"use client";

import * as React from "react";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";
import { selectAuthUser } from "@/lib/features/authSlice";
import { Button } from "@/components/ui/button";

import { LayoutDashboard, Menu, X } from "lucide-react";

import { useState } from "react";
import UserAvatar from "./user-avatar";

export default function AppHeader() {
  const user = useAppSelector(selectAuthUser);

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-surface/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white shadow-sm">
            CV
          </div>
          <span className="text-lg font-bold tracking-tight">
            Now <span className="text-primary">CV</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#features"
            className="text-sm font-medium text-muted transition hover:text-primary"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-muted transition hover:text-primary"
          >
            How it works
          </a>
          <a
            href="#templates"
            className="text-sm font-medium text-muted transition hover:text-primary"
          >
            Templates
          </a>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link href="/builder">
                <Button size="sm">Build CV</Button>
              </Link>
              <UserAvatar />
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden rounded-md p-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-border bg-surface px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <a
              href="#features"
              className="text-sm font-medium text-muted"
              onClick={() => setMobileOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-muted"
              onClick={() => setMobileOpen(false)}
            >
              How it works
            </a>
            <a
              href="#templates"
              className="text-sm font-medium text-muted"
              onClick={() => setMobileOpen(false)}
            >
              Templates
            </a>
            <div className="border-t border-border pt-3 mt-2">
              {user ? (
                <div className="flex flex-col gap-2">
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/builder" onClick={() => setMobileOpen(false)}>
                    <Button size="sm" className="w-full">
                      Build CV
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/signin" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileOpen(false)}>
                    <Button size="sm" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
