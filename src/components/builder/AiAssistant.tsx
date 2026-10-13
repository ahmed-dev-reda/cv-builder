"use client";

import * as React from "react";
import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Sparkles,
  Wand2,
  FileText,
  Briefcase,
  GraduationCap,
  Code,
  Target,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  updateSummary,
  updatePersonalInfo,
  addExperience,
  addExperiencePoint,
  addEducation,
  addProject,
  setSkills,
} from "@/lib/features/resumeSlice";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch } from "@/lib/hooks";
import { requestSupportMe } from "@/lib/features/supportMeSlice";

type AiType =
  | "summary"
  | "improve"
  | "experience"
  | "extract"
  | "tailor"
  | "complete"
  | "ats";

const aiTypes: Array<{
  value: AiType;
  label: string;
  icon: React.ElementType;
  description: string;
}> = [
  {
    value: "summary",
    label: "Write Summary",
    icon: FileText,
    description: "Generate a professional summary",
  },
  {
    value: "improve",
    label: "Improve Content",
    icon: Wand2,
    description: "Make existing content more impactful",
  },
  {
    value: "experience",
    label: "Experience Bullets",
    icon: Briefcase,
    description: "Generate achievement bullet points",
  },
  {
    value: "extract",
    label: "Extract from Text",
    icon: GraduationCap,
    description: "Extract CV data from pasted text",
  },
  {
    value: "tailor",
    label: "Tailor to Job",
    icon: Target,
    description: "Match your CV to a job description",
  },
  {
    value: "complete",
    label: "Complete CV",
    icon: Code,
    description: "Generate a full CV draft",
  },
  {
    value: "ats",
    label: "ATS Check",
    icon: CheckCircle,
    description: "Improve ATS readability",
  },
];

export default function AiAssistant() {
  const dispatch = useAppDispatch();
  const resume = useSelector((state: RootState) => state.resume);
  const [activeTab, setActiveTab] = useState<AiType>("summary");
  const [prompt, setPrompt] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [appliedTo, setAppliedTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const buildContext = useCallback(() => {
    const parts: string[] = [];
    if (resume.personalInfo.fullName)
      parts.push(`Name: ${resume.personalInfo.fullName}`);
    if (resume.personalInfo.job)
      parts.push(`Job Title: ${resume.personalInfo.job}`);
    if (resume.summary) parts.push(`Summary: ${resume.summary}`);
    if (resume.experience.length > 0) {
      parts.push(
        `Experience: ${resume.experience.map((e) => `${e.jobTitle} at ${e.company}`).join(", ")}`,
      );
    }
    if (resume.education.length > 0) {
      parts.push(
        `Education: ${resume.education.map((e) => `${e.degree} at ${e.institution}`).join(", ")}`,
      );
    }
    if (resume.skills.length > 0) {
      parts.push(`Skills: ${resume.skills.map((s) => s.name).join(", ")}`);
    }
    return parts.join("\n");
  }, [resume]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setAppliedTo(null);

    try {
      const cvContext = context || buildContext();

      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          context: cvContext,
          type: activeTab,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }

      if (data.content && typeof data.content === "object") {
        // Structured CV data returned
        applyStructuredData(data.content);
        setResult("CV updated successfully! Check the preview.");
        setAppliedTo("your CV");
        toast.success("AI generated content applied to your CV");
      } else {
        const text = (data.content || "").trim();
        // Auto-apply the text result straight into the form
        applyTextResult(activeTab, text);
        setResult(text || "Generated content");
      }
      // Success-only trigger: any failure above throws and skips this.
      dispatch(requestSupportMe("generate"));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Generation failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Split generated text into bullet lines, stripping common
   * bullet/number prefixes (•, -, *, 1., 1), ...).
   */
  const parseBullets = (text: string): string[] => {
    return text
      .split("\n")
      .map((line) =>
        line
          .replace(/^[\s•\-\*▪◦·>]+/, "")
          .replace(/^\d+[.)\]]\s*/, "")
          .trim(),
      )
      .filter((line) => line.length > 0);
  };

  /**
   * Apply a plain-text AI result directly to the CV form,
   * based on which tab generated it.
   */
  const applyTextResult = (type: AiType, text: string) => {
    if (!text) return;

    switch (type) {
      case "summary":
      case "improve":
      case "tailor":
        dispatch(updateSummary(text));
        setAppliedTo("Professional Summary");
        toast.success("Applied to Professional Summary");
        break;

      case "experience": {
        const bullets = parseBullets(text);
        if (bullets.length === 0) break;
        const entries = resume.experience;
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
        setAppliedTo("Work Experience");
        break;
      }

      // "ats" returns advisory analysis with no clear form target —
      // it stays in the result box with a manual "Apply to Summary" button.
      case "ats":
      default:
        break;
    }
  };

  const applyStructuredData = (data: Record<string, unknown>) => {
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
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Assistant
        </CardTitle>
        <CardDescription>
          Generate and improve your CV content with AI
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto space-y-4">
        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            setActiveTab(v as AiType);
            setResult(null);
            setAppliedTo(null);
            setError(null);
          }}
        >
          <TabsList className="flex flex-wrap gap-1 h-auto">
            {aiTypes.map((type) => (
              <TabsTrigger
                key={type.value}
                value={type.value}
                className="flex flex-col items-center gap-1 py-2 px-1 text-xs"
              >
                <type.icon className="h-4 w-4" />
                <span className="truncate text-[10px]">{type.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="space-y-2">
          <Label htmlFor="ai-prompt">
            {activeTab === "summary" && "Describe your professional background"}
            {activeTab === "improve" && "Paste the content you want to improve"}
            {activeTab === "experience" &&
              "Describe your role and achievements"}
            {activeTab === "extract" && "Paste your existing CV or resume text"}
            {activeTab === "tailor" && "Paste your CV content"}
            {activeTab === "complete" &&
              "Describe your professional background"}
            {activeTab === "ats" && "Paste your CV content for ATS analysis"}
          </Label>
          <Textarea
            id="ai-prompt"
            placeholder={
              activeTab === "summary"
                ? "e.g. Senior developer with 5 years of experience in React and Node.js..."
                : activeTab === "improve"
                  ? "Paste the text you want to improve..."
                  : activeTab === "experience"
                    ? "e.g. Software Engineer at Tech Corp, led team of 5, improved performance by 40%..."
                    : activeTab === "extract"
                      ? "Paste your CV or resume text here..."
                      : activeTab === "tailor"
                        ? "Paste your current CV content..."
                        : activeTab === "complete"
                          ? "e.g. John Doe, Software Engineer, 5 years experience in React, Node.js, Python..."
                          : "Paste your CV for ATS optimization suggestions..."
            }
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
          />
        </div>

        {activeTab === "tailor" && (
          <div className="space-y-2">
            <Label htmlFor="ai-context">Target Job Description</Label>
            <Textarea
              id="ai-context"
              placeholder="Paste the job description here..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={3}
            />
          </div>
        )}

        <Button onClick={handleGenerate} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate
            </>
          )}
        </Button>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-error flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {result && (
          <div className="rounded-md bg-green-50 p-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-green-600" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-green-800">Result</p>
                <p className="mt-1 text-green-700 break-words">{result}</p>
                {appliedTo ? (
                  <p className="mt-2 text-xs font-semibold text-green-800">
                    ✓ Applied to {appliedTo}
                  </p>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 w-full"
                    onClick={() => {
                      dispatch(updateSummary(result));
                      setAppliedTo("Professional Summary");
                      toast.success("Applied to Professional Summary");
                    }}
                  >
                    Apply to Summary
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
