"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence, motion } from "motion/react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  signInUser,
  selectAuthLoading,
  selectAuthError,
} from "@/lib/features/authSlice";

export default function SignInPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const error = authError ?? "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Guard against duplicate submissions while a request is pending.
    if (loading) return;

    try {
      await dispatch(signInUser({ email, password })).unwrap();
      const params = new URLSearchParams(window.location.search);
      const callbackUrl = params.get("callbackUrl");
      const target =
        callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/dashboard";
      router.push(target);
      router.refresh();
    } catch {
      // The error is already in Redux state and rendered below.
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-md"
      >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your Now CV account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="signin-error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="rounded-md bg-red-50 p-3 text-sm text-error">
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link href="/builder" className="text-sm text-muted hover:text-foreground">
              Continue as Guest &rarr;
            </Link>
          </div>
        </CardContent>
      </Card>
      </motion.div>
    </div>
  );
}
