import { z } from "zod";
import {
  ResumeState,
  Experience,
  Education,
  Project,
  NewSection,
  Single,
  SectionName,
  SectionId,
} from "./features/resumeSlice";

// --- Schemas matching the existing CV data model ---

export const PersonalInfoSchema = z.object({
  fullName: z.string().default(""),
  job: z.string().optional().default(""),
  email: z.string().default(""),
  phone: z.string().default(""),
  address: z.string().default(""),
  website: z.string().default(""),
});

export const ExperienceSchema: z.ZodType<Experience> = z.object({
  id: z.string(),
  jobTitle: z.string(),
  company: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  points: z.array(z.string()),
});

export const EducationSchema: z.ZodType<Education> = z.object({
  id: z.string(),
  degree: z.string(),
  institution: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  points: z.array(z.string()),
  gpa: z.string().optional(),
});

export const ProjectSchema: z.ZodType<Project> = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
  url: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const SingleSchema: z.ZodType<Single> = z.object({
  id: z.string(),
  name: z.string(),
});

export const SectionNameSchema: z.ZodType<SectionName> = z.object({
  id: z.number(),
  name: z.string(),
});

export const SectionIdSchema: z.ZodType<SectionId> = z.enum([
  "summary",
  "experience",
  "education",
  "projects",
  "skills",
]);

export const SectionBodySchema = z.union([SingleSchema, ProjectSchema]);

export const NewSectionSchema: z.ZodType<NewSection> = z.object({
  id: z.string(),
  sectionName: z.string(),
  sectionType: z.enum(["primary", "secondary"]),
  body: z.array(SectionBodySchema),
});

export const TemplateSchema = z.enum([
  "simple",
  "minimalist",
  "classicOne",
  "classicTwo",
  "minimalistTwo",
  "classicThree",
  "classicFour",
]);

export const ResumeStateSchema: z.ZodType<ResumeState> = z.object({
  color: z.string(),
  sectionsTitle: z.record(SectionIdSchema, SectionNameSchema),
  sectionOrder: z.array(SectionIdSchema).length(5),
  personalInfo: PersonalInfoSchema,
  summary: z.string(),
  experience: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  skills: z.array(SingleSchema),
  template: TemplateSchema,
  projects: z.array(ProjectSchema),
  moreSections: z.array(NewSectionSchema),
  font: z.string(),
});

// --- Auth schemas ---
export const SignUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});

export const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// --- CV API schemas ---
export const SaveCvSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "CV name is required").max(200),
  data: ResumeStateSchema,
});

export const RenameCvSchema = z.object({
  name: z.string().min(1, "CV name is required").max(200),
});

// --- AI schemas ---
export const AiGenerateSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(10000),
  context: z.string().max(20000).optional(),
  type: z.enum([
    "summary",
    "improve",
    "experience",
    "extract",
    "tailor",
    "complete",
    "ats",
  ]),
});

// --- Validation helper ---

// Maps legacy numeric section ids to stable section keys
const LEGACY_ID_TO_KEY: Record<number, SectionId> = {
  1: "summary",
  2: "experience",
  3: "education",
  4: "projects",
  5: "skills",
};

const DEFAULT_SECTIONS_TITLE: Record<SectionId, SectionName> = {
  summary: { id: 1, name: "Professional Summary" },
  experience: { id: 2, name: "Work Experience" },
  education: { id: 3, name: "Educations" },
  projects: { id: 4, name: "Projects" },
  skills: { id: 5, name: "Skills" },
};

const DEFAULT_SECTION_ORDER: SectionId[] = [
  "summary",
  "experience",
  "education",
  "projects",
  "skills",
];

function isSectionId(value: unknown): value is SectionId {
  return typeof value === "string" && (DEFAULT_SECTION_ORDER as string[]).includes(value);
}

/**
 * Migrates CV data saved by older versions (sectionsTitle as an array,
 * no sectionOrder) to the current shape. Idempotent for new data.
 */
export function normalizeResumeState(input: unknown): unknown {
  if (typeof input !== "object" || input === null) return input;
  const data = { ...(input as Record<string, unknown>) };

  if (Array.isArray(data.sectionsTitle)) {
    const migrated: Record<string, unknown> = {};
    for (const item of data.sectionsTitle) {
      if (typeof item === "object" && item !== null) {
        const { id, name } = item as { id?: unknown; name?: unknown };
        const key = typeof id === "number" ? LEGACY_ID_TO_KEY[id] : undefined;
        if (key && typeof name === "string") {
          migrated[key] = { id, name };
        }
      }
    }
    data.sectionsTitle = { ...DEFAULT_SECTIONS_TITLE, ...migrated };
  }

  if (
    !Array.isArray(data.sectionOrder) ||
    data.sectionOrder.length !== DEFAULT_SECTION_ORDER.length ||
    !(data.sectionOrder as unknown[]).every(isSectionId) ||
    new Set(data.sectionOrder as unknown[]).size !== DEFAULT_SECTION_ORDER.length
  ) {
    data.sectionOrder = [...DEFAULT_SECTION_ORDER];
  }

  return data;
}

export function validateResumeData(data: unknown): { valid: boolean; data?: ResumeState; error?: string } {
  const result = ResumeStateSchema.safeParse(normalizeResumeState(data));
  if (result.success) {
    return { valid: true, data: result.data };
  }
  return { valid: false, error: result.error.issues.map((i) => i.message).join(", ") };
}
