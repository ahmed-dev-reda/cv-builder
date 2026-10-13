import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { sql, initDb } from "./db";

/**
 * User persistence + password hashing helpers.
 *
 * Session handling is delegated to NextAuth (see `src/auth.ts`); this module
 * only owns the `users` table and credential verification used by the
 * NextAuth Credentials provider.
 */

// --- Password hashing ---
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// --- User CRUD ---
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export async function createUser(
  email: string,
  password: string,
  name: string,
): Promise<User> {
  await initDb();
  const id = uuidv4();
  const hash = bcrypt.hashSync(password, 12);

  await sql`
    INSERT INTO users (id, email, password_hash, name)
    VALUES (${id}, ${email.toLowerCase().trim()}, ${hash}, ${name})
  `;

  return {
    id,
    email: email.toLowerCase().trim(),
    name,
    created_at: new Date().toISOString(),
  };
}

export async function getUserByEmail(
  email: string,
): Promise<(User & { password_hash: string }) | null> {
  await initDb();
  const rows = await sql`
    SELECT * FROM users WHERE email = ${email.toLowerCase().trim()}
  `;
  return (rows[0] as (User & { password_hash: string }) | undefined) ?? null;
}

export async function getUserById(userId: string): Promise<User | null> {
  await initDb();
  const rows = await sql`
    SELECT id, email, name, created_at FROM users WHERE id = ${userId}
  `;
  return (rows[0] as User | undefined) ?? null;
}

export async function updateUserName(userId: string, name: string): Promise<void> {
  await initDb();
  await sql`
    UPDATE users SET name = ${name}, updated_at = NOW() WHERE id = ${userId}
  `;
}