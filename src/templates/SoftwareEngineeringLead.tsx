"use client";

import * as React from "react";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import type { OrderableSectionId } from "@/lib/features/resumeSlice";
import { OrderedSections, getSectionOrder } from "./orderedSections";

export default function SoftwareEngineeringLead() {
  const resumeData = useSelector((state: RootState) => state.resume);
  const color = resumeData.color;
  const order = getSectionOrder(resumeData);

  const blocks: Record<OrderableSectionId, React.ReactNode> = {
    summary: resumeData.summary ? (
      <div>
        <h3 className="text-[18px] font-bold uppercase tracking-wide mb-3" style={{ color }}>
          {resumeData.sectionsTitle.summary?.name || "Professional Summary"}
        </h3>
        <p className="text-[15px] leading-6" style={{ color: "#333" }}>
          {resumeData.summary}
        </p>
      </div>
    ) : null,

    experience: resumeData.experience.length > 0 ? (
      <div>
        <h3 className="text-[18px] font-bold uppercase tracking-wide mb-3" style={{ color }}>
          {resumeData.sectionsTitle.experience?.name || "Work Experience"}
        </h3>
        <div className="space-y-5">
          {resumeData.experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex items-baseline justify-between gap-4 mb-1">
                <h4 className="text-[17px] font-bold text-[#111]">{exp.jobTitle}</h4>
                {(exp.startDate || exp.endDate) && (
                  <span className="shrink-0 text-[14px] text-[#666]">
                    {exp.startDate}
                    {exp.startDate && exp.endDate && " – "}
                    {exp.endDate || (exp.startDate && "Present")}
                  </span>
                )}
              </div>
              {(exp.company || exp.location) && (
                <p className="text-[15px] text-[#444] italic mb-2">
                  {exp.company}
                  {exp.company && exp.location && ", "}
                  {exp.location}
                </p>
              )}
              {exp.points.length > 0 && (
                <ul className="pl-5 space-y-1.5" style={{ color: "#333" }}>
                  {exp.points.map((point, index) => (
                    <li key={index} className="list-disc text-[15px] leading-5">
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
      <div>
        <h3 className="text-[18px] font-bold uppercase tracking-wide mb-3" style={{ color }}>
          {resumeData.sectionsTitle.education?.name || "Education"}
        </h3>
        <div className="space-y-4">
          {resumeData.education.map((edu) => (
            <div key={edu.id}>
              <div className="flex items-baseline justify-between gap-4 mb-1">
                <h4 className="text-[16px] font-bold text-[#111]">{edu.degree}</h4>
                {(edu.startDate || edu.endDate) && (
                  <span className="shrink-0 text-[14px] text-[#666]">
                    {edu.startDate}
                    {edu.startDate && edu.endDate && " – "}
                    {edu.endDate || (edu.startDate && "Present")}
                  </span>
                )}
              </div>
              {(edu.institution || edu.location) && (
                <p className="text-[15px] text-[#444] italic mb-1">
                  {edu.institution}
                  {edu.institution && edu.location && ", "}
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
      <div>
        <h3 className="text-[18px] font-bold uppercase tracking-wide mb-3" style={{ color }}>
          {resumeData.sectionsTitle.projects?.name || "Projects"}
        </h3>
        <div className="space-y-4">
          {resumeData.projects.map((project) => (
            <div key={project.id}>
              <div className="flex items-baseline justify-between gap-4 mb-1">
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
                      View Project
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
                <p className="text-[14px] leading-5" style={{ color: "#333" }}>
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

  // Skills block for main content area
  const skillsBlock =
    resumeData.skills.length > 0 ? (
      <div>
        <h3 className="text-[18px] font-bold uppercase tracking-wide mb-3" style={{ color }}>
          {resumeData.sectionsTitle.skills?.name || "Skills"}
        </h3>
        <div className="flex flex-wrap gap-2">
          {resumeData.skills.map((skill) => (
            <span
              key={skill.id}
              className="px-3 py-1.5 text-[13px] font-medium rounded"
              style={{ backgroundColor: `${color}15`, color, border: `1px solid ${color}40` }}
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    ) : null;

  const sidebarSkills = resumeData.skills.length > 0 ? (
    <div className="mb-8">
      <h3 className="text-[14px] font-bold uppercase tracking-wider mb-3 text-white/90">
        {resumeData.sectionsTitle.skills?.name || "SKILLS"}
      </h3>
      <div className="flex flex-wrap gap-2">
        {resumeData.skills.map((skill) => (
          <span
            key={skill.id}
            className="px-3 py-1.5 text-[12px] font-medium rounded bg-white/15 border border-white/30 text-white"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  ) : null;

  const sidebarContact = (
    <div className="mb-8">
      <h3 className="text-[14px] font-bold uppercase tracking-wider mb-3 text-white/90">CONTACT</h3>
      <div className="space-y-3 text-[13px] text-white/90">
        {resumeData.personalInfo.email && (
          <div className="flex items-center gap-2">
            <span className="w-4 h-4">✉</span>
            <a href={`mailto:${resumeData.personalInfo.email}`} className="hover:text-white underline">
              {resumeData.personalInfo.email}
            </a>
          </div>
        )}
        {resumeData.personalInfo.phone && (
          <div className="flex items-center gap-2">
            <span className="w-4 h-4">📞</span>
            <a href={`tel:${resumeData.personalInfo.phone}`} className="hover:text-white underline">
              {resumeData.personalInfo.phone}
            </a>
          </div>
        )}
        {resumeData.personalInfo.address && (
          <div className="flex items-center gap-2">
            <span className="w-4 h-4">📍</span>
            <span>{resumeData.personalInfo.address}</span>
          </div>
        )}
        {resumeData.personalInfo.website && (
          <div className="flex items-center gap-2">
            <span className="w-4 h-4">🌐</span>
            <a
              href={resumeData.personalInfo.website.startsWith("http") ? resumeData.personalInfo.website : `https://${resumeData.personalInfo.website}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white underline"
            >
              {resumeData.personalInfo.website}
            </a>
          </div>
        )}
      </div>
    </div>
  );

  const sidebarCertifications =
    resumeData.moreSections.some(
      (s) => s.sectionName.toLowerCase().includes("certif") || s.sectionName.toLowerCase().includes("license")
    ) ? (
      <div>
        <h3 className="text-[14px] font-bold uppercase tracking-wider mb-3 text-white/90">CERTIFICATIONS</h3>
        <div className="space-y-2 text-[12px] text-white/90">
          {resumeData.moreSections
            .filter(
              (s) => s.sectionName.toLowerCase().includes("certif") || s.sectionName.toLowerCase().includes("license")
            )
            .map((sec) =>
              sec.body.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white/50" />
                  <span>{item.name}</span>
                </div>
              ))
            )}
        </div>
      </div>
    ) : null;

  return (
    <div className="mx-auto min-h-[1123px] w-[794px] bg-white overflow-hidden">
      <div className="flex h-full">
        {/* LEFT SIDEBAR */}
        <aside
          className="w-[38%] shrink-0 flex flex-col py-[50px] px-[35px]"
          style={{ backgroundColor: color }}
        >
          <div className="flex-1 flex flex-col">
            {resumeData.personalInfo.fullName && (
              <h1 className="text-[28px] font-bold uppercase leading-tight text-white mb-2">
                {resumeData.personalInfo.fullName}
              </h1>
            )}
            {resumeData.personalInfo.job && (
              <p className="text-[16px] text-white/80 mb-8">{resumeData.personalInfo.job}</p>
            )}
            {sidebarContact}
            {sidebarSkills}
            {sidebarCertifications}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 px-[45px] py-[50px]">
          <div className={`${resumeData.font} text-[#111]`}>
            <OrderedSections order={order} blocks={blocks} />
            {skillsBlock && <div className="mt-8">{skillsBlock}</div>}

            {/* More Sections */}
            {resumeData.moreSections.map((sec) => {
              const isCert = sec.sectionName.toLowerCase().includes("certif") || sec.sectionName.toLowerCase().includes("license");
              if (isCert) return null;
              if (!sec.sectionName || sec.body.length === 0) return null;
              return (
                <div key={sec.id} className="mt-8">
                  <h3 className="text-[18px] font-bold uppercase tracking-wide mb-3" style={{ color }}>
                    {sec.sectionName}
                  </h3>
                  <ul className="pl-5 space-y-1" style={{ color: "#333" }}>
                    {sec.body.map((item) => (
                      <li key={item.id} className="list-disc text-[15px] leading-5">
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}