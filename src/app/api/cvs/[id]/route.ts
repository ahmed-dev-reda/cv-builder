import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { sql, initDb } from "@/lib/db";
import { RenameCvSchema, validateResumeData } from "@/lib/validation";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/cvs/[id] - Get a specific CV with full data
export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  await initDb();

  const rows = await sql`
    SELECT * FROM cvs WHERE id = ${id} AND user_id = ${session.user.id}
  `;

  if (rows.length === 0) {
    return NextResponse.json({ error: "CV not found" }, { status: 404 });
  }

  const cv = rows[0] as {
    id: string;
    name: string;
    data: Record<string, unknown>;
    is_default: boolean;
    created_at: string;
    updated_at: string;
  };

  // Validate on read too
  const validation = validateResumeData(cv.data);
  if (!validation.valid) {
    return NextResponse.json({ error: "Corrupted CV data" }, { status: 500 });
  }

  return NextResponse.json({
    cv: {
      id: cv.id,
      name: cv.name,
      data: validation.data,
      is_default: Boolean(cv.is_default),
      created_at: cv.created_at,
      updated_at: cv.updated_at,
    },
  });
}

// PATCH /api/cvs/[id] - Update CV name or data
export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const body = await request.json();
    await initDb();

    // Verify ownership
    const existing = await sql`
      SELECT user_id FROM cvs WHERE id = ${id}
    `;

    if (existing.length === 0) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    if (existing[0].user_id !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update name if provided
    if (body.name !== undefined) {
      const parsed = RenameCvSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.issues[0]?.message || "Invalid name" },
          { status: 400 },
        );
      }
      await sql`
        UPDATE cvs SET name = ${parsed.data.name}, updated_at = NOW() WHERE id = ${id}
      `;
    }

    // Update data if provided
    if (body.data !== undefined) {
      const validation = validateResumeData(body.data);
      if (!validation.valid || !validation.data) {
        return NextResponse.json(
          { error: `Invalid CV data: ${validation.error}` },
          { status: 400 },
        );
      }
      await sql`
        UPDATE cvs SET data = ${JSON.stringify(validation.data)}::jsonb, updated_at = NOW() WHERE id = ${id}
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update CV error:", error);
    return NextResponse.json(
      { error: "Failed to update CV" },
      { status: 500 },
    );
  }
}

// DELETE /api/cvs/[id] - Delete a CV
export async function DELETE(_request: NextRequest, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  await initDb();

  const existing = await sql`
    SELECT user_id FROM cvs WHERE id = ${id}
  `;

  if (existing.length === 0) {
    return NextResponse.json({ error: "CV not found" }, { status: 404 });
  }

  if (existing[0].user_id !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await sql`DELETE FROM cvs WHERE id = ${id}`;

  return NextResponse.json({ success: true });
}