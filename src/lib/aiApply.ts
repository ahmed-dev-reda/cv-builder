import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import type { AppDispatch } from "./store";
import {
  updateSummary,
  updatePersonalInfo,
  addExperience,
  addExperiencePoint,
  addEducation,
  addProject,
  setSkills,
  type Experience,
} from "./features/resumeSlice";

export type AiType =
  | "summary"
  | "improve"
  | "experience"
  | "extract"
  | "tailor"
  | "complete"
  | "ats";

/**
 * Split generated text into bullet lines, stripping common
 * bullet/number prefixes (•, -, *, 1., 1), ...).
 */
export function parseBullets(text: string): string[] {
  return text
    .split("\n")
    .map((line) =>
      line
        .replace(/^[\s•\-\*▪◦·>]+/, "")
        .replace(/^\d+[.)\]]\s*/, "")
        .trim(),
    )
    .filter((line) => line.length > 0);
}

/**
 * Apply a plain-text AI result directly to the CV form,
 * based on which tab generated it. Returns the section label the
 * content was applied to, or null when there was nothing to apply.
 */
export function applyTextResult(
  dispatch: AppDispatch,
  experience: Experience[],
  type: AiType,
  text: string,
): string | null {
  if (!text) return null;

  switch (type) {
    case "summary":
    case "improve":
    case "tailor":
      dispatch(updateSummary(text));
      toast.success("Applied to Professional Summary");
      return "Professional Summary";

    case "experience": {
      const bullets = parseBullets(text);
      if (bullets.length === 0) return null;
      const entries = experience;
      if (entries.length > 0) {
        const target = entries[entries.length - 1];
        bullets.forEach((point) =>
          dispatch(addExperiencePoint({ id: target.id, point })),
        );
        toast.success(
          `Added ${bullets.length} bullet${bullets.length > 1 ? "s" : ""} to your latest experience`,
        );
      } else {
        dispatch(
          addExperience({
            id: uuidv4(),
            jobTitle: "",
            company: "",
            startDate: "",
            endDate: "",
            points: bullets,
          }),
        );
        toast.success("Created an experience entry with the generated bullets");
      }
      return "Work Experience";
    }

    // "ats" returns advisory analysis with no clear form target —
    // it stays in the result box with a manual "Apply to Summary" button.
    case "ats":
    default:
      return null;
  }
}

/**
 * Apply structured (extract/complete) AI data to the matching
 * resume fields. Only truthy fields are applied; everything else
 * in the user's CV is left untouched.
 */
export function applyStructuredData(
  dispatch: AppDispatch,
  data: Record<string, unknown>,
): void {
  // Apply personal info
  if (data.personalInfo) {
    const pi = data.personalInfo as Record<string, string>;
    if (pi.fullName) dispatch(updatePersonalInfo({ fullName: pi.fullName }));
    if (pi.job) dispatch(updatePersonalInfo({ job: pi.job }));
    if (pi.email) dispatch(updatePersonalInfo({ email: pi.email }));
    if (pi.phone) dispatch(updatePersonalInfo({ phone: pi.phone }));
    if (pi.address) dispatch(updatePersonalInfo({ address: pi.address }));
    if (pi.website) dispatch(updatePersonalInfo({ website: pi.website }));
  }

  // Apply summary
  if (data.summary && typeof data.summary === "string") {
    dispatch(updateSummary(data.summary));
  }

  // Apply experience
  if (data.experience && Array.isArray(data.experience)) {
    // Clear existing and add new
    data.experience.forEach((exp: Record<string, unknown>) => {
      dispatch(
        addExperience({
          id: uuidv4(),
          jobTitle: (exp.jobTitle as string) || "",
          company: (exp.company as string) || "",
          startDate: (exp.startDate as string) || "",
          endDate: (exp.endDate as string) || "",
          points: (exp.points as string[]) || [],
        }),
      );
    });
  }

  // Apply education
  if (data.education && Array.isArray(data.education)) {
    data.education.forEach((edu: Record<string, unknown>) => {
      dispatch(
        addEducation({
          id: uuidv4(),
          degree: (edu.degree as string) || "",
          institution: (edu.institution as string) || "",
          startDate: (edu.startDate as string) || "",
          endDate: (edu.endDate as string) || "",
          points: [],
          gpa: (edu.gpa as string) || undefined,
        }),
      );
    });
  }

  // Apply skills
  if (data.skills && Array.isArray(data.skills)) {
    data.skills.forEach((skill: string) => {
      dispatch(setSkills({ id: uuidv4(), name: skill }));
    });
  }

  // Apply projects
  if (data.projects && Array.isArray(data.projects)) {
    data.projects.forEach((proj: Record<string, unknown>) => {
      dispatch(
        addProject({
          id: uuidv4(),
          name: (proj.name as string) || "",
          description: (proj.description as string) || "",
          technologies: (proj.technologies as string[]) || [],
          url: (proj.url as string) || undefined,
          startDate: (proj.startDate as string) || undefined,
          endDate: (proj.endDate as string) || undefined,
        }),
      );
    });
  }
}
