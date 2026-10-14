import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import { validateResumeData } from "@/lib/validation";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

// POST /api/cvs/import - Import guest CVs from localStorage
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { cvs } = body as { cvs: Array<{ name: string; data: unknown }> };

    if (!Array.isArray(cvs) || cvs.length === 0) {
      return NextResponse.json(
        { error: "No CVs to import" },
        { status: 400 },
      );
    }

    // Limit import batch size
    if (cvs.length > 50) {
      return NextResponse.json(
        { error: "Too many CVs to import at once (max 50)" },
        { status: 400 },
      );
    }

    const results: Array<{ name: string; success: boolean; id?: string; error?: string }> = [];

    for (const cv of cvs) {
      try {
        const validation = validateResumeData(cv.data);
        if (!validation.valid || !validation.data) {
          results.push({ name: cv.name || "Untitled", success: false, error: "Invalid CV data" });
          continue;
        }

        const id = uuidv4();
        const jsonData = JSON.parse(
          JSON.stringify(validation.data),
        ) as Prisma.InputJsonValue;
        await prisma.cv.create({
          data: {
            id,
            userId: session.user.id,
            name: cv.name || "Imported CV",
            data: jsonData,
          },
        });

        results.push({ name: cv.name || "Imported CV", success: true, id });
      } catch (err) {
        results.push({
          name: cv.name || "Untitled",
          success: false,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Import CVs error:", error);
    return NextResponse.json(
      { error: "Failed to import CVs" },
      { status: 500 },
    );
  }
}