import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "./db";

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

function toUser(row: {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    created_at: row.createdAt.toISOString(),
  };
}

export async function createUser(
  email: string,
  password: string,
  name: string,
): Promise<User> {
  const id = uuidv4();
  const hash = bcrypt.hashSync(password, 12);

  const user = await prisma.user.create({
    data: { id, email: email.toLowerCase().trim(), passwordHash: hash, name },
  });

  return toUser(user);
}

export async function getUserByEmail(
  email: string,
): Promise<(User & { password_hash: string }) | null> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });
  if (!user) return null;
  return { ...toUser(user), password_hash: user.passwordHash };
}

export async function getUserById(userId: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, createdAt: true },
  });
  return user ? toUser(user) : null;
}

export async function updateUserName(userId: string, name: string): Promise<void> {
  await prisma.user.update({ where: { id: userId }, data: { name } });
}
