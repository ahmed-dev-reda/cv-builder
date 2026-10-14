"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectAuthUser, signOutUser } from "@/lib/features/authSlice";

export default function BuilderHeader() {
  const user = useAppSelector(selectAuthUser);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSignOut = async () => {
    // Stay on the builder as a guest — no full-page reload needed.
    await dispatch(signOutUser());
    router.refresh();
  };

  return (
    <nav className="flex items-center gap-1.5 bg-inherit px-4 py-2 sm:gap-2">
      <Link
        href="/"
        className="flex shrink-0 items-center gap-2"
        aria-label="Now CV home"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white shadow-sm">
          CV
        </div>
        <span className="hidden text-base font-bold tracking-tight lg:inline">
          Now <span className="text-primary">CV</span>
        </span>
      </Link>

      {user ? (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>

          <DropdownMenu
            trigger={
              <button
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-100"
                aria-label="Account menu"
              >
                <Avatar
                  fallback={
                    user.name?.charAt(0).toUpperCase() || "?"
                  }
                />
                <span className="hidden text-sm font-medium md:inline">
                  {user.name}
                </span>
              </button>
            }
          >
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard")}>
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenu>
        </>
      ) : (
        <Link href="/signin">
          <Button variant="ghost" size="sm">
            Sign in
          </Button>
        </Link>
      )}
    </nav>
  );
}
