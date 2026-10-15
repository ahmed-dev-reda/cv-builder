"use client";

import * as React from "react";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import type { OrderableSectionId } from "@/lib/features/resumeSlice";
import { OrderedSections, getSectionOrder } from "./orderedSections";

export default function ExperiencedHireV6() {
  const resumeData = useSelector((state: RootState) => state.resume);
  const color = resumeData.color;
  const order = getSectionOrder(resumeData);

  const blocks: Record<OrderableSectionId, React.ReactNode> = {
    summary: resumeData.summary ? (
      <div className="mb-6">
        <h3 className="text-[16px] font-bold uppercase tracking-wide mb-3" style={{ color }}>
          {resumeData.sectionsTitle.summary?.name || "Professional Summary"}
        </h3>
        <div className="h-[1.5px] w-full mb-4" style={{ backgroundColor: color }} />
        <p className="text-[15px] leading-7" style={{ color: "#333" }}>
          {resumeData.summary}
        </p>
      </div>
    ) : null,

    experience: resumeData.experience.length > 0 ? (
      <div className="mb-6">
        <h3 className="text-[16px] font-bold uppercase tracking-wide mb-3" style={{ color }}>
          {resumeData.sectionsTitle.experience?.name || "Professional Experience"}
        </h3>
        <div className="h-[1.5px] w-full mb-4" style={{ backgroundColor: color }} />
        <div className="space-y-5">
          {resumeData.experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex items-baseline justify-between gap-4 flex-wrap mb-1">
                <h4 className="text-[16px] font-bold text-[#111]">{exp.jobTitle}</h4>
                {(exp.startDate || exp.endDate) && (
                  <span className="shrink-0 text-[14px] font-medium text-[#111]">
                    {exp.startDate}
                    {exp.startDate && exp.endDate && " – "}
                    {exp.endDate || (exp.startDate && "Present")}
                  </span>
                )}
              </div>
              {(exp.company || exp.location) && (
                <p className="text-[15px] text-[#444] italic mb-2">
                  {exp.company}
                  {exp.company && exp.location && " • "}
                  {exp.location}
                </p>
              )}
              {exp.points.length > 0 && (
                <ul className="pl-5 space-y-1.5" style={{ color: "#333" }}>
                  {exp.points.map((point, index) => (
                    <li key={index} className="list-disc text-[15px] leading-6">
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null,

    education: resumeData.education.length > 0 ? (
      <div className="mb-6">
        <h3 className="text-[16px] font-bold uppercase tracking-wide mb-3" style={{ color }}>
          {resumeData.sectionsTitle.education?.name || "Education"}
        </h3>
        <div className="h-[1.5px] w-full mb-4" style={{ backgroundColor: color }} />
        <div className="space-y-4">
          {resumeData.education.map((edu) => (
            <div key={edu.id}>
              <div className="flex items-baseline justify-between gap-4 flex-wrap mb-1">
                <h4 className="text-[16px] font-bold text-[#111]">{edu.degree}</h4>
                {(edu.startDate || edu.endDate) && (
                  <span className="shrink-0 text-[14px] font-medium text-[#111]">
                    {edu.startDate}
                    {edu.startDate && edu.endDate && " – "}
                    {edu.endDate || (edu.startDate && "Present")}
                  </span>
                )}
              </div>
              {(edu.institution || edu.location) && (
                <p className="text-[15px] text-[#444] italic mb-1">
                  {edu.institution}
                  {edu.institution && edu.location && " • "}
                  {edu.location}
                </p>
              )}
              {edu.gpa && (
                <p className="text-[14px] text-[#444] mb-1">
                  <strong>GPA:</strong> {edu.gpa}
                </p>
              )}
              {edu.points.length > 0 && (
                <ul className="pl-5 space-y-1" style={{ color: "#333" }}>
                  {edu.points.map((point, index) => (
                    <li key={index} className="list-disc text-[14px] leading-5">
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null,

    projects: resumeData.projects.length > 0 ? (
      <div className="mb-6">
        <h3 className="text-[16px] font-bold uppercase tracking-wide mb-3" style={{ color }}>
          {resumeData.sectionsTitle.projects?.name || "Projects"}
        </h3>
        <div className="h-[1.5px] w-full mb-4" style={{ backgroundColor: color }} />
        <div className="space-y-4">
          {resumeData.projects.map((project) => (
            <div key={project.id}>
              <div className="flex items-baseline justify-between gap-4 flex-wrap mb-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-[16px] font-bold text-[#111]">{project.name}</h4>
                  {project.url && (
                    <a
                      href={project.url.startsWith("http") ? project.url : `https://${project.url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[12px] font-normal underline"
                      style={{ color }}
                    >
                      Link
                    </a>
                  )}
                </div>
                {(project.startDate || project.endDate) && (
                  <span className="shrink-0 text-[13px] text-[#666]">
                    {project.startDate}
                    {project.startDate && project.endDate && " – "}
                    {project.endDate || (project.startDate && "Present")}
                  </span>
                )}
              </div>
              {project.description && (
                <p className="text-[14px] leading-6" style={{ color: "#333" }}>
                  {project.description}
                </p>
              )}
              {project.technologies.length > 0 && (
                <p className="mt-1 text-[13px] text-[#666]">
                  <strong>Technologies:</strong> {project.technologies.join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null,
  };

  const skillsBlock =
    resumeData.skills.length > 0 ? (
      <div className="mb-6">
        <h3 className="text-[16px] font-bold uppercase tracking-wide mb-3" style={{ color }}>
          {resumeData.sectionsTitle.skills?.name || "Technical Skills"}
        </h3>
        <div className="h-[1.5px] w-full mb-4" style={{ backgroundColor: color }} />
        <p className="text-[15px] leading-7" style={{ color: "#333" }}>
          {resumeData.skills.map((skill) => skill.name).join(", ")}
        </p>
      </div>
    ) : null;

  return (
    <div
      className={`mx-auto min-h-[1123px] w-[794px] bg-white px-[52px] py-[45px] text-[#111] ${resumeData.font}`}
    >
      {/* Header */}
      <header className="mb-6 pb-5 border-b-2" style={{ borderColor: color }}>
        <div className="flex items-baseline justify-between gap-6 flex-wrap">
          <div>
            {resumeData.personalInfo.fullName && (
              <h1 className="text-[32px] font-bold leading-tight" style={{ color }}>
                {resumeData.personalInfo.fullName}
              </h1>
            )}
            {resumeData.personalInfo.job && (
              <p className="mt-2 text-[18px] font-medium" style={{ color }}>
                {resumeData.personalInfo.job}
              </p>
            )}
          </div>

          <div className="text-[14px] text-[#444] flex flex-col items-end gap-1">
            {resumeData.personalInfo.phone && <p>{resumeData.personalInfo.phone}</p>}
            {resumeData.personalInfo.email && (
              <a href={`mailto:${resumeData.personalInfo.email}`} className="hover:underline">
                {resumeData.personalInfo.email}
              </a>
            )}
            <div className="flex gap-4 mt-1">
              {resumeData.personalInfo.website && (
                <a
                  href={resumeData.personalInfo.website.startsWith("http") ? resumeData.personalInfo.website : `https://${resumeData.personalInfo.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                  style={{ color }}
                >
                  {resumeData.personalInfo.website}
                </a>
              )}
              {resumeData.personalInfo.address && <p>{resumeData.personalInfo.address}</p>}
            </div>
          </div>
        </div>
      </header>

      {/* Ordered sections */}
      <OrderedSections order={order} blocks={blocks} />

      {/* Skills — fixed last */}
      {skillsBlock}

      {/* More Sections */}
      {resumeData.moreSections.map((sec) => {
        if (!sec.sectionName || sec.body.length === 0) return null;
        return (
          <div key={sec.id} className="mb-6">
            <h3 className="text-[16px] font-bold uppercase tracking-wide mb-3" style={{ color }}>
              {sec.sectionName}
            </h3>
            <div className="h-[1.5px] w-full mb-4" style={{ backgroundColor: color }} />
            <ul className="pl-5 space-y-1" style={{ color: "#333" }}>
              {sec.body.map((item) => (
                <li key={item.id} className="list-disc text-[15px] leading-6">
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}