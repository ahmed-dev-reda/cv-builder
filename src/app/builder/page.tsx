import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { validateResumeData } from "@/lib/validation";
import BuilderClient from "./BuilderClient";
import type { InitialCv } from "./useBuilderCv";

export const metadata: Metadata = {
  title: "Builder",
  description:
    "Build and preview your professional CV with live templates and PDF export.",
};

// Server component: owns metadata, the `cv` search param, and the initial
// CV preload. All interactivity lives in BuilderClient. Guest mode needs no
// session, so unauthenticated users are never redirected.
export default async function BuilderPage({
  searchParams,
}: {
  searchParams: Promise<{ cv?: string }>;
}) {
  const { cv: cvId } = await searchParams;
  const session = await auth();

  // Preload the requested CV server-side so an authenticated owner skips
  // the client fetch waterfall. Anything untrusted (missing id, foreign
  // owner, corrupt data) falls through to `null` and the client keeps its
  // existing fetch + toast behavior as a fallback.
  let initialCv: InitialCv | null = null;
  if (session?.user?.id && cvId) {
    const row = await prisma.cv.findFirst({
      where: { id: cvId, userId: session.user.id },
    });
    if (row) {
      const validation = validateResumeData(row.data);
      if (validation.valid && validation.data) {
        initialCv = { id: row.id, name: row.name, data: validation.data };
      }
    }
  }

  return (
    <BuilderClient
      key={cvId ?? "new"}
      cvId={cvId ?? null}
      initialCv={initialCv}
    />
  );
}
