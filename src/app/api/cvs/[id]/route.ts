import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
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

  const cv = await prisma.cv.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!cv) {
    return NextResponse.json({ error: "CV not found" }, { status: 404 });
  }

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
      is_default: cv.isDefault,
      created_at: cv.createdAt.toISOString(),
      updated_at: cv.updatedAt.toISOString(),
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

    // Verify ownership
    const existing = await prisma.cv.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    if (existing.userId !== session.user.id) {
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
      await prisma.cv.update({
        where: { id },
        data: { name: parsed.data.name },
      });
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
      const jsonData = JSON.parse(
        JSON.stringify(validation.data),
      ) as Prisma.InputJsonValue;
      await prisma.cv.update({
        where: { id },
        data: { data: jsonData },
      });
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

  const existing = await prisma.cv.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "CV not found" }, { status: 404 });
  }

  if (existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.cv.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
