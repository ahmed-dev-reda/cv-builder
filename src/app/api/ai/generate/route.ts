import { NextRequest, NextResponse } from "next/server";
import { AiGenerateSchema } from "@/lib/validation";
import { ResumeStateSchema } from "@/lib/validation";

export const runtime = "nodejs";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Structured output schema for Gemini
const CV_OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    personalInfo: {
      type: "object",
      properties: {
        fullName: { type: "string" },
        job: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        address: { type: "string" },
        website: { type: "string" },
      },
    },
    summary: { type: "string" },
    experience: {
      type: "array",
      items: {
        type: "object",
        properties: {
          jobTitle: { type: "string" },
          company: { type: "string" },
          startDate: { type: "string" },
          endDate: { type: "string" },
          points: { type: "array", items: { type: "string" } },
        },
      },
    },
    education: {
      type: "array",
      items: {
        type: "object",
        properties: {
          degree: { type: "string" },
          institution: { type: "string" },
          startDate: { type: "string" },
          endDate: { type: "string" },
          gpa: { type: "string" },
        },
      },
    },
    skills: {
      type: "array",
      items: { type: "string" },
    },
    projects: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          technologies: { type: "array", items: { type: "string" } },
          url: { type: "string" },
        },
      },
    },
  },
};

function buildPrompt(type: string, prompt: string, context?: string): string {
  const contextSection = context
    ? `\n\nExisting CV content for context:\n${context}`
    : "";

  switch (type) {
    case "summary":
      return `Generate a professional summary for a CV based on the following information. Return ONLY the summary text, no explanations. The summary should be 2-4 sentences, professional, and highlight key strengths.\n\nUser input: ${prompt}${contextSection}`;

    case "improve":
      return `Improve the following CV content to be more professional, impactful, and ATS-friendly. Return ONLY the improved content, no explanations.\n\nContent to improve: ${prompt}${contextSection}`;

    case "experience":
      return `Generate professional bullet points for a work experience entry based on the following information. Return ONLY the bullet points as an array of strings. Each bullet should start with an action verb and quantify achievements where possible.\n\nUser input: ${prompt}${contextSection}`;

    case "extract":
      return `Extract structured CV information from the following text. Identify personal info, work experience, education, skills, and projects. Return the data in the specified JSON format. Do NOT invent any information that is not present in the text.\n\nText to analyze: ${prompt}`;

    case "tailor":
      return `Tailor the following CV content to match the target job description. Adjust the summary, skills, and experience highlights to align with the job requirements. Return ONLY the tailored content.\n\nCV Content: ${prompt}\n\nTarget Job: ${context || "General"}`;

    case "complete":
      return `Generate a complete CV draft based on the following user information. Fill in all sections with realistic content based ONLY on what the user provided. Do NOT invent employment history, degrees, dates, or achievements. Leave fields empty if the user did not provide relevant information.\n\nUser information: ${prompt}`;

    case "ats":
      return `Analyze the following CV content for ATS (Applicant Tracking System) readability and suggest specific improvements. Consider keyword optimization, formatting, section headings, and content structure.\n\nCV Content: ${prompt}${contextSection}`;

    default:
      return prompt;
  }
}

export async function POST(request: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "AI service is not configured. Please set GEMINI_API_KEY." },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const parsed = AiGenerateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid request" },
        { status: 400 },
      );
    }

    const { prompt, context, type } = parsed.data;

    const systemPrompt = buildPrompt(type, prompt, context);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
            responseMimeType:
              type === "extract" || type === "complete"
                ? "application/json"
                : "text/plain",
            ...(type === "extract" || type === "complete"
              ? { responseSchema: CV_OUTPUT_SCHEMA }
              : {}),
          },
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData?.error?.message || `Gemini API error: ${response.status}`;

      if (response.status === 429) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please try again in a moment." },
          { status: 429 },
        );
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return NextResponse.json(
        { error: "No content generated" },
        { status: 500 },
      );
    }

    // For extract/complete types, try to parse JSON
    if (type === "extract" || type === "complete") {
      try {
        const parsedData = JSON.parse(text);
        // Validate against our schema
        const validation = ResumeStateSchema.safeParse({
          color: "#8055a2",
          sectionsTitle: {
            summary: { id: 1, name: "Professional Summary" },
            experience: { id: 2, name: "Work Experience" },
            education: { id: 3, name: "Educations" },
            projects: { id: 4, name: "Projects" },
            skills: { id: 5, name: "Skills" },
          },
          sectionOrder: ["summary", "experience", "education", "projects"],
          personalInfo: parsedData.personalInfo || {},
          summary: parsedData.summary || "",
          experience: (parsedData.experience || []).map(
            (exp: Record<string, unknown>) => ({
              id: crypto.randomUUID(),
              jobTitle: exp.jobTitle || "",
              company: exp.company || "",
              startDate: exp.startDate || "",
              endDate: exp.endDate || "",
              points: exp.points || [],
            }),
          ),
          education: (parsedData.education || []).map(
            (edu: Record<string, unknown>) => ({
              id: crypto.randomUUID(),
              degree: edu.degree || "",
              institution: edu.institution || "",
              startDate: edu.startDate || "",
              endDate: edu.endDate || "",
              points: [],
              gpa: edu.gpa || undefined,
            }),
          ),
          skills: (parsedData.skills || []).map((skill: string, i: number) => ({
            id: `skill-${i}`,
            name: skill,
          })),
          template: "simple" as const,
          projects: (parsedData.projects || []).map(
            (proj: Record<string, unknown>) => ({
              id: crypto.randomUUID(),
              name: proj.name || "",
              description: proj.description || "",
              technologies: proj.technologies || [],
              url: proj.url || undefined,
              startDate: proj.startDate || undefined,
              endDate: proj.endDate || undefined,
            }),
          ),
          moreSections: [],
          font: "inter",
        });

        if (validation.success) {
          return NextResponse.json({ content: validation.data, raw: text });
        }
      } catch {
        // If JSON parsing fails, return raw text
      }
    }

    return NextResponse.json({ content: text, type });
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 },
    );
  }
}
