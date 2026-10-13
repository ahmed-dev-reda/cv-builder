"use client";

import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import {
  AlertDialog,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  FileText,
  Download,
  Edit,
  Trash2,
  Copy,
  MoreVertical,
  LogOut,
  Settings,
} from "lucide-react";
import { signOut } from "next-auth/react";
import type { CvListItem } from "@/lib/persistence";
import { toast } from "sonner";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [cvs, setCvs] = useState<CvListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const refreshCvs = useCallback(async () => {
    if (!session?.user) return;
    setLoading(true);
    try {
      const res = await fetch("/api/cvs");
      if (!res.ok) throw new Error("Failed to fetch CVs");
      const data = await res.json();
      setCvs(data.cvs);
    } catch (error) {
      console.error("Failed to load CVs:", error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }
    if (status !== "authenticated" || !session?.user) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/cvs");
        if (!res.ok) throw new Error("Failed to fetch CVs");
        const data = await res.json();
        if (!cancelled) setCvs(data.cvs);
      } catch (error) {
        if (!cancelled) console.error("Failed to load CVs:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status, router, session?.user]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/cvs/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setCvs((prev) => prev.filter((cv) => cv.id !== deleteId));
        toast.success("CV deleted successfully");
      } else {
        toast.error("Failed to delete CV");
      }
    } catch {
      toast.error("Failed to delete CV");
    }
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const handleDuplicate = async (cv: CvListItem) => {
    try {
      const res = await fetch(`/api/cvs/${cv.id}`);
      if (!res.ok) throw new Error("Failed to fetch CV");
      const data = await res.json();

      const createRes = await fetch("/api/cvs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${cv.name} (Copy)`,
          data: data.cv.data,
        }),
      });

      if (createRes.ok) {
        toast.success("CV duplicated successfully");
        refreshCvs();
      } else {
        toast.error("Failed to duplicate CV");
      }
    } catch {
      toast.error("Failed to duplicate CV");
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  if (status === "loading" || !session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
              CV
            </div>
            <span className="text-lg font-bold tracking-tight">
              Now <span className="text-primary">CV</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/builder">
              <Button size="sm">
                <Plus className="h-4 w-4" />
                New CV
              </Button>
            </Link>

            <DropdownMenu
              trigger={
                <button className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-100 cursor-pointer">
                  <Avatar fallback={session.user.name?.charAt(0).toUpperCase() || "?"} />
                  <span className="hidden sm:inline text-sm font-medium">{session.user.name}</span>
                </button>
              }
            >
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{session.user.name}</p>
                <p className="text-xs text-muted">{session.user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">My CVs</h1>
          <p className="mt-2 text-muted">Manage and edit your saved CVs</p>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : cvs.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No CVs yet</h3>
              <p className="mt-2 text-sm text-muted text-center max-w-sm">
                Create your first CV and it will appear here. You can also import CVs from guest mode.
              </p>
              <Link href="/builder" className="mt-6">
                <Button>
                  <Plus className="h-4 w-4" />
                  Create your first CV
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cvs.map((cv) => (
              <Card key={cv.id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="truncate text-base">{cv.name}</CardTitle>
                      <CardDescription>
                        Updated {new Date(cv.updated_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <DropdownMenu
                      trigger={
                        <button className="rounded-md p-1 hover:bg-gray-100 cursor-pointer">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      }
                    >
                      <DropdownMenuItem onClick={() => router.push(`/builder?cv=${cv.id}`)}>
                        <Edit className="h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(cv)}>
                        <Copy className="h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-error"
                        onClick={() => {
                          setDeleteId(cv.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Link href={`/builder?cv=${cv.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/builder?cv=${cv.id}&export=true`}>
                      <Button variant="outline" size="sm">
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete CV"
        description="Are you sure you want to delete this CV? This action cannot be undone."
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
