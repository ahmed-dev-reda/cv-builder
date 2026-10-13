import type { IconType } from "react-icons";
import {
  FaGithub,
  FaLinkedinIn,
  FaYoutube,
  FaTiktok,
  FaInstagram,
} from "react-icons/fa";

// --- Trigger sources ---
// "generate" = AI content generated, "save" = CV persisted,
// "back" = user returned to the Editor panel (the previous editing step).
export type SupportMeSource = "generate" | "save" | "back";

// --- Social links ---
// Verified URLs already used in the project (home footer + download dialog).
// Add or edit entries here — the modal picks them up automatically.
export interface SupportMeLink {
  id: string;
  label: string;
  href: string;
  icon: IconType;
  hoverClass: string;
}

export const SUPPORT_ME_LINKS: SupportMeLink[] = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/ahmed-dev-reda",
    icon: FaGithub,
    hoverClass: "hover:text-black",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ahmed-reda-a41b49435/",
    icon: FaLinkedinIn,
    hoverClass: "hover:text-[#0A66C2]",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@ahmed-dev-reda",
    icon: FaYoutube,
    hoverClass: "hover:text-red-600",
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@ahmed.dev.reda",
    icon: FaTiktok,
    hoverClass: "hover:text-black",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/ahmed.dev.reda",
    icon: FaInstagram,
    hoverClass: "hover:text-pink-600",
  },
];

// --- Frequency control ---
// Tune these to change how often the popup appears. Defaults:
// at most once per source per session, with a global cooldown between prompts.
export const SUPPORT_ME_CONFIG = {
  enabled: true,
  maxPerSessionPerSource: 1,
  minIntervalMs: 60_000,
} as const;

const COUNTS_KEY = "nowcv:support-me:counts";
const LAST_SHOWN_KEY = "nowcv:support-me:last-shown";

const emptyCounts = (): Record<SupportMeSource, number> => ({
  generate: 0,
  save: 0,
  back: 0,
});

function readCounts(): Record<SupportMeSource, number> {
  if (typeof window === "undefined") return emptyCounts();
  try {
    const raw = window.sessionStorage.getItem(COUNTS_KEY);
    if (!raw) return emptyCounts();
    const parsed = JSON.parse(raw) as Partial<Record<SupportMeSource, number>>;
    return { ...emptyCounts(), ...parsed };
  } catch {
    return emptyCounts();
  }
}

function readLastShown(): number {
  if (typeof window === "undefined") return 0;
  try {
    return Number(window.sessionStorage.getItem(LAST_SHOWN_KEY) ?? 0) || 0;
  } catch {
    return 0;
  }
}

// True when the popup may be shown for this source right now.
export function canShowSupportMe(
  source: SupportMeSource,
  now: number = Date.now(),
): boolean {
  if (!SUPPORT_ME_CONFIG.enabled) return false;
  const counts = readCounts();
  if (counts[source] >= SUPPORT_ME_CONFIG.maxPerSessionPerSource) return false;
  if (now - readLastShown() < SUPPORT_ME_CONFIG.minIntervalMs) return false;
  return true;
}

// Persist that the popup was shown (call only when it actually opens).
export function recordSupportMeShown(
  source: SupportMeSource,
  now: number = Date.now(),
): void {
  if (typeof window === "undefined") return;
  try {
    const counts = readCounts();
    counts[source] += 1;
    window.sessionStorage.setItem(COUNTS_KEY, JSON.stringify(counts));
    window.sessionStorage.setItem(LAST_SHOWN_KEY, String(now));
  } catch {
    // Storage failures must never break the builder.
  }
}

// "Maybe later" — restart the cooldown without consuming another impression.
export function markSupportMeSnoozed(now: number = Date.now()): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(LAST_SHOWN_KEY, String(now));
  } catch {
    // Storage failures must never break the builder.
  }
}
