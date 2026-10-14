"use client";

import * as React from "react";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import AuthSync from "./auth-sync";

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthSync />
      {children}
    </SessionProvider>
  );
}
