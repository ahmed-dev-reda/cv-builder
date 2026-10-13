import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { sql, initDb } from "@/lib/db";
import { SaveCvSchema, validateResumeData } from "@/lib/validation";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

// GET /api/cvs - List all CVs for the authenticated user
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await initDb();
  const cvs = await sql`
    SELECT id, name, is_default, created_at, updated_at
    FROM cvs
    WHERE user_id = ${session.user.id}
    ORDER BY updated_at DESC
  `;

  return NextResponse.json({
    cvs: cvs.map((cv: Record<string, unknown>) => ({
      ...cv,
      is_default: Boolean(cv.is_default),
    })),
  });
}

// POST /api/cvs - Create or update a CV
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = SaveCvSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid CV data" },
        { status: 400 },
      );
    }

    const { id, name, data } = parsed.data;

    // Validate the CV data structure
    const validation = validateResumeData(data);
    if (!validation.valid || !validation.data) {
      return NextResponse.json(
        { error: `Invalid CV data: ${validation.error}` },
        { status: 400 },
      );
    }

    await initDb();

    if (id) {
      // Update existing CV - verify ownership
      const existing = await sql`
        SELECT user_id FROM cvs WHERE id = ${id}
      `;

      if (existing.length === 0) {
        return NextResponse.json({ error: "CV not found" }, { status: 404 });
      }

      if (existing[0].user_id !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      await sql`
        UPDATE cvs
        SET name = ${name}, data = ${JSON.stringify(validation.data)}::jsonb, updated_at = NOW()
        WHERE id = ${id}
      `;

      return NextResponse.json({ id, success: true });
    } else {
      // Create new CV
      const newId = uuidv4();
      await sql`
        INSERT INTO cvs (id, user_id, name, data)
        VALUES (${newId}, ${session.user.id}, ${name}, ${JSON.stringify(validation.data)}::jsonb)
      `;

      return NextResponse.json({ id: newId, success: true }, { status: 201 });
    }
  } catch (error) {
    console.error("Save CV error:", error);
    return NextResponse.json(
      { error: "Failed to save CV" },
      { status: 500 },
    );
  }
}