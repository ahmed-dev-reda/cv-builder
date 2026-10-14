import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import type { CvListItem } from "@/lib/persistence";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "My CVs",
  description: "Manage and edit your saved CVs.",
};

// Server component: owns auth, metadata, and the initial CV list.
// All interactivity lives in DashboardClient.
export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/signin");
  }

  let initialCvs: CvListItem[] = [];
  let loadError: string | null = null;

  try {
    const rows = await prisma.cv.findMany({
      where: { userId: session.user.id },
      select: { id: true, name: true, isDefault: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });
    initialCvs = rows.map((cv) => ({
      id: cv.id,
      name: cv.name,
      is_default: cv.isDefault,
      updated_at: cv.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Dashboard preload failed:", error);
    loadError = "Failed to load your CVs. Please try again.";
  }

  return (
    <DashboardClient initialCvs={initialCvs} loadError={loadError} />
  );
}
