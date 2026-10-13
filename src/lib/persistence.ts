import { ResumeState } from "./features/resumeSlice";

/**
 * Persistence abstraction layer for CV data.
 * - Guest mode: localStorage
 * - Authenticated mode: API/database
 */

const GUEST_CV_KEY = "nowcv_guest_cvs";
const GUEST_ACTIVE_CV_KEY = "nowcv_guest_active_cv";

// --- Types ---
export interface CvListItem {
  id: string;
  name: string;
  updated_at: string;
  is_default?: boolean;
}

export interface CvData {
  id: string;
  name: string;
  data: ResumeState;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// --- Guest mode: localStorage ---

export function getGuestCvs(): CvListItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_CV_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getGuestCv(id: string): CvData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${GUEST_CV_KEY}_${id}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveGuestCv(cv: CvData): void {
  if (typeof window === "undefined") return;
  try {
    // Save CV data
    localStorage.setItem(`${GUEST_CV_KEY}_${cv.id}`, JSON.stringify(cv));

    // Update list
    const list = getGuestCvs();
    const existingIndex = list.findIndex((item) => item.id === cv.id);
    const listItem: CvListItem = {
      id: cv.id,
      name: cv.name,
      updated_at: cv.updated_at,
    };
    if (existingIndex >= 0) {
      list[existingIndex] = listItem;
    } else {
      list.unshift(listItem);
    }
    localStorage.setItem(GUEST_CV_KEY, JSON.stringify(list));
  } catch (error) {
    console.error("Failed to save guest CV:", error);
  }
}

export function deleteGuestCv(id: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`${GUEST_CV_KEY}_${id}`);
    const list = getGuestCvs().filter((item) => item.id !== id);
    localStorage.setItem(GUEST_CV_KEY, JSON.stringify(list));

    // Clear active if it was deleted
    const activeId = localStorage.getItem(GUEST_ACTIVE_CV_KEY);
    if (activeId === id) {
      localStorage.removeItem(GUEST_ACTIVE_CV_KEY);
    }
  } catch (error) {
    console.error("Failed to delete guest CV:", error);
  }
}

export function setActiveGuestCv(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_ACTIVE_CV_KEY, id);
}

export function getActiveGuestCvId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(GUEST_ACTIVE_CV_KEY);
}

export function getActiveGuestCv(): CvData | null {
  const id = getActiveGuestCvId();
  if (!id) return null;
  return getGuestCv(id);
}

// --- Authenticated mode: API ---

export async function fetchAuthenticatedCvs(): Promise<CvListItem[]> {
  const res = await fetch("/api/cvs");
  if (!res.ok) throw new Error("Failed to fetch CVs");
  const data = await res.json();
  return data.cvs;
}

export async function fetchAuthenticatedCv(id: string): Promise<CvData> {
  const res = await fetch(`/api/cvs/${id}`);
  if (!res.ok) throw new Error("Failed to fetch CV");
  const data = await res.json();
  return data.cv;
}

export async function createAuthenticatedCv(name: string, data: ResumeState): Promise<string> {
  const res = await fetch("/api/cvs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, data }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Failed to create CV");
  }
  const result = await res.json();
  return result.id;
}

export async function updateAuthenticatedCv(
  id: string,
  name: string,
  data: ResumeState,
): Promise<void> {
  const res = await fetch(`/api/cvs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, data }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Failed to update CV");
  }
}

export async function deleteAuthenticatedCv(id: string): Promise<void> {
  const res = await fetch(`/api/cvs/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Failed to delete CV");
  }
}

export async function importGuestCvsToAccount(
  cvs: Array<{ name: string; data: ResumeState }>,
): Promise<Array<{ name: string; success: boolean; id?: string; error?: string }>> {
  const res = await fetch("/api/cvs/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cvs }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Failed to import CVs");
  }
  const result = await res.json();
  return result.results;
}

// --- Migration helper ---

export function getAllGuestCvData(): Array<{ name: string; data: ResumeState }> {
  const list = getGuestCvs();
  const result: Array<{ name: string; data: ResumeState }> = [];

  for (const item of list) {
    const cv = getGuestCv(item.id);
    if (cv) {
      result.push({ name: cv.name, data: cv.data });
    }
  }

  return result;
}
