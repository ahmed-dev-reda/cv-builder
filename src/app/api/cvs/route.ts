import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import { SaveCvSchema, validateResumeData } from "@/lib/validation";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

// GET /api/cvs - List all CVs for the authenticated user
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cvs = await prisma.cv.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      name: true,
      isDefault: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({
    cvs: cvs.map((cv) => ({
      id: cv.id,
      name: cv.name,
      is_default: cv.isDefault,
      created_at: cv.createdAt.toISOString(),
      updated_at: cv.updatedAt.toISOString(),
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

    const jsonData = JSON.parse(
      JSON.stringify(validation.data),
    ) as Prisma.InputJsonValue;

    if (id) {
      // Update existing CV - verify ownership
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

      await prisma.cv.update({
        where: { id },
        data: { name, data: jsonData },
      });

      return NextResponse.json({ id, success: true });
    } else {
      // Create new CV
      const newId = uuidv4();
      await prisma.cv.create({
        data: {
          id: newId,
          userId: session.user.id,
          name,
          data: jsonData,
        },
      });

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
