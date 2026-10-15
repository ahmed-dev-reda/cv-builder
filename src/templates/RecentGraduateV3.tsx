"use client";

import * as React from "react";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import type { OrderableSectionId } from "@/lib/features/resumeSlice";
import { OrderedSections, getSectionOrder } from "./orderedSections";

export default function RecentGraduateV3() {
  const resumeData = useSelector((state: RootState) => state.resume);
  const color = resumeData.color;
  const order = getSectionOrder(resumeData);

  const blocks: Record<OrderableSectionId, React.ReactNode> = {
    summary: resumeData.summary ? (
      <div className="mb-5">
        <h3 className="text-[15px] font-bold uppercase tracking-wider mb-2" style={{ color }}>
          {resumeData.sectionsTitle.summary?.name || "Summary"}
        </h3>
        <p className="text-[14px] leading-6" style={{ color: "#333" }}>
          {resumeData.summary}
        </p>
      </div>
    ) : null,

    education: resumeData.education.length > 0 ? (
      <div className="mb-5">
        <h3 className="text-[15px] font-bold uppercase tracking-wider mb-2" style={{ color }}>
          {resumeData.sectionsTitle.education?.name || "Education"}
        </h3>
        <div className="space-y-4">
          {resumeData.education.map((edu) => (
            <div key={edu.id} className="p-4 rounded" style={{ backgroundColor: `${color}08` }}>
              <div className="flex items-baseline justify-between gap-4 flex-wrap mb-1">
                <h4 className="text-[16px] font-bold text-[#111]">{edu.degree}</h4>
                {(edu.startDate || edu.endDate) && (
                  <span className="shrink-0 text-[13px] font-medium text-[#111]">
                    {edu.startDate}
                    {edu.startDate && edu.endDate && " – "}
                    {edu.endDate || (edu.startDate && "Present")}
                  </span>
                )}
              </div>
              {edu.institution && (
                <p className="text-[14px] text-[#444] italic mb-1">{edu.institution}</p>
              )}
              {edu.location && (
                <p className="text-[13px] text-[#666] mb-1">{edu.location}</p>
              )}
              {edu.gpa && (
                <p className="text-[13px] text-[#444] mb-2">
                  <strong>GPA:</strong> {edu.gpa}
                </p>
              )}
              {edu.points.length > 0 && (
                <ul className="pl-5 space-y-1" style={{ color: "#333" }}>
                  {edu.points.map((point, index) => (
                    <li key={index} className="list-disc text-[13px] leading-5">
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

    experience: resumeData.experience.length > 0 ? (
      <div className="mb-5">
        <h3 className="text-[15px] font-bold uppercase tracking-wider mb-2" style={{ color }}>
          {resumeData.sectionsTitle.experience?.name || "Experience"}
        </h3>
        <div className="space-y-4">
          {resumeData.experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex items-baseline justify-between gap-4 flex-wrap mb-1">
                <h4 className="text-[15px] font-bold text-[#111]">{exp.jobTitle}</h4>
                {(exp.startDate || exp.endDate) && (
                  <span className="shrink-0 text-[13px] text-[#666]">
                    {exp.startDate}
                    {exp.startDate && exp.endDate && " – "}
                    {exp.endDate || (exp.startDate && "Present")}
                  </span>
                )}
              </div>
              {(exp.company || exp.location) && (
                <p className="text-[14px] text-[#444] italic mb-2">
                  {exp.company}
                  {exp.company && exp.location && " • "}
                  {exp.location}
                </p>
              )}
              {exp.points.length > 0 && (
                <ul className="pl-5 space-y-1" style={{ color: "#333" }}>
                  {exp.points.map((point, index) => (
                    <li key={index} className="list-disc text-[13px] leading-5">
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
      <div className="mb-5">
        <h3 className="text-[15px] font-bold uppercase tracking-wider mb-2" style={{ color }}>
          {resumeData.sectionsTitle.projects?.name || "Projects"}
        </h3>
        <div className="space-y-4">
          {resumeData.projects.map((project) => (
            <div key={project.id} className="p-3 rounded border" style={{ borderColor: `${color}30` }}>
              <div className="flex items-baseline justify-between gap-4 flex-wrap mb-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-[15px] font-bold text-[#111]">{project.name}</h4>
                  {project.url && (
                    <a
                      href={project.url.startsWith("http") ? project.url : `https://${project.url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-normal underline"
                      style={{ color }}
                    >
                      View
                    </a>
                  )}
                </div>
                {(project.startDate || project.endDate) && (
                  <span className="shrink-0 text-[12px] text-[#666]">
                    {project.startDate}
                    {project.startDate && project.endDate && " – "}
                    {project.endDate || (project.startDate && "Present")}
                  </span>
                )}
              </div>
              {project.description && (
                <p className="text-[13px] leading-5" style={{ color: "#333" }}>
                  {project.description}
                </p>
              )}
              {project.technologies.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-[11px] rounded"
                      style={{ backgroundColor: `${color}15`, color, border: `1px solid ${color}30` }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null,
  };

  const skillsBlock =
    resumeData.skills.length > 0 ? (
      <div className="mb-5">
        <h3 className="text-[15px] font-bold uppercase tracking-wider mb-2" style={{ color }}>
          {resumeData.sectionsTitle.skills?.name || "Skills"}
        </h3>
        <div className="flex flex-wrap gap-2">
          {resumeData.skills.map((skill) => (
            <span
              key={skill.id}
              className="px-3 py-1 text-[12px] font-medium rounded"
              style={{ backgroundColor: `${color}10`, color, border: `1px solid ${color}30` }}
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    ) : null;

  return (
    <div
      className={`mx-auto min-h-[1123px] w-[794px] bg-white px-[48px] py-[40px] text-[#111] ${resumeData.font}`}
    >
      {/* Header - Centered */}
      <header className="text-center mb-6">
        {resumeData.personalInfo.fullName && (
          <h1 className="text-[28px] font-bold leading-tight" style={{ color }}>
            {resumeData.personalInfo.fullName}
          </h1>
        )}
        {resumeData.personalInfo.job && (
          <p className="mt-2 text-[15px] font-medium text-[#444]">{resumeData.personalInfo.job}</p>
        )}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[12px] text-[#666]">
          {resumeData.personalInfo.email && (
            <a href={`mailto:${resumeData.personalInfo.email}`} className="hover:underline">
              {resumeData.personalInfo.email}
            </a>
          )}
          {resumeData.personalInfo.phone && (
            <>
              {resumeData.personalInfo.email && <span>•</span>}
              <a href={`tel:${resumeData.personalInfo.phone}`} className="hover:underline">
                {resumeData.personalInfo.phone}
              </a>
            </>
          )}
          {resumeData.personalInfo.address && (
            <>
              {(resumeData.personalInfo.email || resumeData.personalInfo.phone) && <span>•</span>}
              <span>{resumeData.personalInfo.address}</span>
            </>
          )}
          {resumeData.personalInfo.website && (
            <>
              <span>•</span>
              <a
                href={resumeData.personalInfo.website.startsWith("http") ? resumeData.personalInfo.website : `https://${resumeData.personalInfo.website}`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
                style={{ color }}
              >
                {resumeData.personalInfo.website}
              </a>
            </>
          )}
        </div>
      </header>

      {/* Divider */}
      <div className="h-px w-full mb-6" style={{ backgroundColor: color }} />

      {/* Education first for recent grads, then ordered sections */}
      <OrderedSections order={order} blocks={blocks} />

      {/* Skills — fixed last */}
      {skillsBlock}

      {/* More Sections */}
      {resumeData.moreSections.map((sec) => {
        if (!sec.sectionName || sec.body.length === 0) return null;
        return (
          <div key={sec.id} className="mt-5">
            <h3 className="text-[15px] font-bold uppercase tracking-wider mb-2" style={{ color }}>
              {sec.sectionName}
            </h3>
            <ul className="pl-5 space-y-1" style={{ color: "#333" }}>
              {sec.body.map((item) => (
                <li key={item.id} className="list-disc text-[13px] leading-5">
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