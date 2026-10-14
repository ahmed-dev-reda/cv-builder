"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch } from "@/lib/hooks";
import { fetchCurrentUser, setSessionUser } from "@/lib/features/authSlice";

/**
 * Single one-way sync point between the NextAuth session (the secure
 * credential mechanism) and the Redux auth slice (the UI source of truth).
 * No other component reads useSession for display state.
 */
export default function AuthSync() {
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();
  const lastSyncedId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      lastSyncedId.current = null;
      dispatch(setSessionUser(null));
      return;
    }

    if (status === "authenticated") {
      const id = session?.user?.id;
      if (id !== lastSyncedId.current) {
        lastSyncedId.current = id ?? null;
        if (id) {
          dispatch(
            setSessionUser({
              id,
              name: session?.user?.name ?? null,
              email: session?.user?.email ?? null,
            }),
          );
          // Refresh from the database so renames/updates propagate.
          dispatch(fetchCurrentUser());
        } else {
          dispatch(setSessionUser(null));
        }
      }
    }
  }, [status, session, dispatch]);

  return null;
}
