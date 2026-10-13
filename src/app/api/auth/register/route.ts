import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createUser, getUserByEmail } from "@/lib/auth";
import { sql, initDb } from "@/lib/db";
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
    await initDb();
    await sql`
      INSERT INTO cvs (id, user_id, name, data, is_default)
      VALUES (${uuidv4()}, ${user.id}, 'My CV', ${JSON.stringify(createDefaultResumeState())}::jsonb, TRUE)
    `;

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