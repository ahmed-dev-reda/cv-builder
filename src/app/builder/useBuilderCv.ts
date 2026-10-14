"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { selectAuthUser } from "@/lib/features/authSlice";
import { setResume, type ResumeState } from "@/lib/features/resumeSlice";
import {
  saveGuestCv,
  getGuestCv,
  getActiveGuestCvId,
  setActiveGuestCv,
  updateAuthenticatedCv,
  createAuthenticatedCv,
  fetchAuthenticatedCv,
} from "@/lib/persistence";
import { requestSupportMe } from "@/lib/features/supportMeSlice";
import { toast } from "sonner";
import { validateResumeData } from "@/lib/validation";

export interface InitialCv {
  id: string;
  name: string;
  data: ResumeState;
}

export type SaveStatus = "saved" | "saving" | "error";

interface UseBuilderCvOptions {
  cvId: string | null;
  initialCv: InitialCv | null;
  /** Suppresses the save-success popup while another modal is open. */
  isDownloadOpen: boolean;
}

/**
 * Owns CV identity, loading, saving, and autosave for the builder.
 * Rendering (panel, preview, toolbar) lives in the Builder* components.
 */
export function useBuilderCv({
  cvId,
  initialCv,
  isDownloadOpen,
}: UseBuilderCvOptions) {
  const dispatch = useAppDispatch();
  // Single source of truth for the signed-in user (synced from the NextAuth
  // session by AuthSync). Server routes remain the authorization authority.
  const user = useAppSelector(selectAuthUser);
  const resumeData = useSelector((state: RootState) => state.resume);
  const router = useRouter();

  const [currentCvId, setCurrentCvId] = useState<string | null>(
    initialCv?.id ?? null,
  );
  const [currentCvName, setCurrentCvName] = useState<string>(
    initialCv?.name ?? "My CV",
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [, setSaving] = useState(false);

  // Guards autosave while a CV is being loaded. A ref is used deliberately so
  // that flipping it synchronously from the load effect is not a state update.
  const loadingCvRef = useRef(false);
  // Counts completed saves per mount so the initial hydration autosave
  // (not a user-driven success) never triggers the Support Me popup.
  const saveCountRef = useRef(0);
  // Ensures the server-preloaded CV hydrates Redux exactly once per mount.
  // (The server page remounts the client via `key` when `cvId` changes.)
  const serverHydratedRef = useRef(false);

  const saveCurrentCv = useCallback(async () => {
    if (loadingCvRef.current) return;

    setSaving(true);
    setSaveStatus("saving");

    try {
      if (user && currentCvId) {
        await updateAuthenticatedCv(currentCvId, currentCvName, resumeData);
      } else if (!user && currentCvId) {
        saveGuestCv({
          id: currentCvId,
          name: currentCvName,
          data: resumeData,
          is_default: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      } else {
        // Create new CV
        const newId = crypto.randomUUID();
        if (user) {
          // Throws on failure so a failed save never counts as success.
          const createdId = await createAuthenticatedCv(
            currentCvName,
            resumeData,
          );
          setCurrentCvId(createdId);
        } else {
          saveGuestCv({
            id: newId,
            name: currentCvName,
            data: resumeData,
            is_default: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
          setCurrentCvId(newId);
          setActiveGuestCv(newId);
        }
      }
      setSaveStatus("saved");
      // Success-only trigger: exceptions above skip this entirely.
      // Suppressed while the download-success dialog is open so two
      // modals never stack.
      saveCountRef.current += 1;
      if (saveCountRef.current > 1 && !isDownloadOpen) {
        dispatch(requestSupportMe("save"));
      }
    } catch (error) {
      console.error("Save failed:", error);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  }, [user, currentCvId, currentCvName, resumeData, dispatch, isDownloadOpen]);

  // Hydrate Redux from the server-preloaded CV (mount only).
  useEffect(() => {
    if (initialCv && !serverHydratedRef.current) {
      serverHydratedRef.current = true;
      loadingCvRef.current = true;
      (async () => {
        // Yield to the microtask queue so no setState happens synchronously
        // within the effect body (satisfies react-hooks/set-state-in-effect).
        await Promise.resolve();
        dispatch(setResume(initialCv.data));
        loadingCvRef.current = false;
      })();
    }
  }, [initialCv, dispatch]);

  // Load CV from URL param (authenticated) or the active guest CV.
  // Skips the network fetch when the server already provided this CV.
  useEffect(() => {
    if (user) {
      if (!cvId) return;
      if (initialCv && initialCv.id === cvId) return;

      loadingCvRef.current = true;
      let cancelled = false;

      (async () => {
        try {
          const cv = await fetchAuthenticatedCv(cvId);
          if (!cancelled) {
            const validation = validateResumeData(cv.data);
            if (!validation.valid || !validation.data) {
              toast.error("Saved CV data is corrupted");
              return;
            }
            dispatch(setResume(validation.data));
            setCurrentCvId(cv.id);
            setCurrentCvName(cv.name);
          }
        } catch (error) {
          if (!cancelled) {
            console.error("Failed to load CV:", error);
            toast.error("Failed to load CV");
          }
        } finally {
          if (!cancelled) loadingCvRef.current = false;
        }
      })();

      return () => {
        cancelled = true;
      };
    }

    // Guest mode: hydrate from the active guest CV
    (async () => {
      const activeId = getActiveGuestCvId();
      if (!activeId) return;
      const cv = getGuestCv(activeId);
      if (!cv) return;
      // Yield to the microtask queue so no setState happens synchronously
      // within the effect body (satisfies react-hooks/set-state-in-effect).
      await Promise.resolve();
      const validation = validateResumeData(cv.data);
      if (!validation.valid || !validation.data) {
        toast.error("Saved CV data is corrupted");
        return;
      }
      dispatch(setResume(validation.data));
      setCurrentCvId(cv.id);
      setCurrentCvName(cv.name);
    })();
  }, [cvId, user, dispatch, initialCv]);

  // Autosave with debounce
  useEffect(() => {
    if (loadingCvRef.current) return;

    const timeout = setTimeout(async () => {
      await saveCurrentCv();
    }, 2000);

    return () => clearTimeout(timeout);
  }, [resumeData, currentCvId, currentCvName, saveCurrentCv]);

  const startNewCv = useCallback(() => {
    setCurrentCvId(null);
    setCurrentCvName("My CV");
    router.push("/builder");
  }, [router]);

  return {
    resumeData,
    currentCvId,
    currentCvName,
    saveStatus,
    startNewCv,
  };
}
