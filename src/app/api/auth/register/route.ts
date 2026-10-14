import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createUser, getUserByEmail } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import { SignUpSchema } from "@/lib/validation";
import { createDefaultResumeState } from "@/lib/features/resumeSlice";

export const runtime = "nodejs";

// POST /api/auth/register - Create a new account (NextAuth handles the sign-in)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = SignUpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid registration data" },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;

    if (await getUserByEmail(email)) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    const user = await createUser(email, password, name);

    // Give every new account a default CV so the dashboard is never empty.
    const jsonData = JSON.parse(
      JSON.stringify(createDefaultResumeState()),
    ) as Prisma.InputJsonValue;
    await prisma.cv.create({
      data: {
        id: uuidv4(),
        userId: user.id,
        name: "My CV",
        data: jsonData,
        isDefault: true,
      },
    });

    return NextResponse.json(
      { user: { id: user.id, email: user.email, name: user.name } },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 },
    );
  }
}