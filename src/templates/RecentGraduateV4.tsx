"use client";

import * as React from "react";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import type { OrderableSectionId } from "@/lib/features/resumeSlice";
import { OrderedSections, getSectionOrder } from "./orderedSections";

export default function RecentGraduateV4() {
  const resumeData = useSelector((state: RootState) => state.resume);
  const color = resumeData.color;
  const order = getSectionOrder(resumeData);

  const mainBlocks: Record<OrderableSectionId, React.ReactNode> = {
    summary: resumeData.summary ? (
      <div className="mb-6">
        <h3 className="text-[16px] font-bold uppercase tracking-wide mb-3" style={{ color }}>
          {resumeData.sectionsTitle.summary?.name || "Profile"}
        </h3>
        <p className="text-[14px] leading-6" style={{ color: "#333" }}>
          {resumeData.summary}
        </p>
      </div>
    ) : null,

    education: resumeData.education.length > 0 ? (
      <div className="mb-6">
        <h3 className="text-[16px] font-bold uppercase tracking-wide mb-3" style={{ color }}>
          {resumeData.sectionsTitle.education?.name || "Education"}
        </h3>
        <div className="space-y-4">
          {resumeData.education.map((edu) => (
            <div key={edu.id} className="p-3 rounded" style={{ backgroundColor: `${color}06` }}>
              <div className="flex items-baseline justify-between gap-4 flex-wrap mb-1">
                <h4 className="text-[15px] font-bold text-[#111]">{edu.degree}</h4>
                {(edu.startDate || edu.endDate) && (
                  <span className="shrink-0 text-[12px] text-[#666]">
                    {edu.startDate}
                    {edu.startDate && edu.endDate && " – "}
                    {edu.endDate || (edu.startDate && "Present")}
                  </span>
                )}
              </div>
              {edu.institution && (
                <p className="text-[13px] text-[#444] italic mb-1">{edu.institution}</p>
              )}
              {edu.location && (
                <p className="text-[12px] text-[#666] mb-1">{edu.location}</p>
              )}
              {edu.gpa && (
                <p className="text-[12px] text-[#444] mb-1">
                  <strong>GPA:</strong> {edu.gpa}
                </p>
              )}
              {edu.points.length > 0 && (
                <ul className="pl-4 space-y-0.5" style={{ color: "#333" }}>
                  {edu.points.map((point, index) => (
                    <li key={index} className="list-disc text-[12px] leading-5">
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
      <div className="mb-6">
        <h3 className="text-[16px] font-bold uppercase tracking-wide mb-3" style={{ color }}>
          {resumeData.sectionsTitle.experience?.name || "Experience"}
        </h3>
        <div className="space-y-4">
          {resumeData.experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex items-baseline justify-between gap-4 flex-wrap mb-1">
                <h4 className="text-[14px] font-bold text-[#111]">{exp.jobTitle}</h4>
                {(exp.startDate || exp.endDate) && (
                  <span className="shrink-0 text-[12px] text-[#666]">
                    {exp.startDate}
                    {exp.startDate && exp.endDate && " – "}
                    {exp.endDate || (exp.startDate && "Present")}
                  </span>
                )}
              </div>
              {(exp.company || exp.location) && (
                <p className="text-[13px] text-[#444] italic mb-2">
                  {exp.company}
                  {exp.company && exp.location && " • "}
                  {exp.location}
                </p>
              )}
              {exp.points.length > 0 && (
                <ul className="pl-4 space-y-0.5" style={{ color: "#333" }}>
                  {exp.points.map((point, index) => (
                    <li key={index} className="list-disc text-[12px] leading-5">
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
        <div className="space-y-3">
          {resumeData.projects.map((project) => (
            <div key={project.id} className="p-3 rounded border" style={{ borderColor: `${color}30` }}>
              <div className="flex items-baseline justify-between gap-4 flex-wrap mb-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-[14px] font-bold text-[#111]">{project.name}</h4>
                  {project.url && (
                    <a
                      href={project.url.startsWith("http") ? project.url : `https://${project.url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-normal underline"
                      style={{ color }}
                    >
                      Link
                    </a>
                  )}
                </div>
                {(project.startDate || project.endDate) && (
                  <span className="shrink-0 text-[11px] text-[#666]">
                    {project.startDate}
                    {project.startDate && project.endDate && " – "}
                    {project.endDate || (project.startDate && "Present")}
                  </span>
                )}
              </div>
              {project.description && (
                <p className="text-[12px] leading-5" style={{ color: "#333" }}>
                  {project.description}
                </p>
              )}
              {project.technologies.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-[10px] rounded"
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

  // Sidebar content
  const sidebarContact = (
    <div className="mb-6">
      <h3 className="text-[12px] font-bold uppercase tracking-wider mb-3 text-white/90">CONTACT</h3>
      <div className="space-y-2.5 text-[11px] text-white/90">
        {resumeData.personalInfo.email && (
          <a href={`mailto:${resumeData.personalInfo.email}`} className="block hover:text-white underline flex items-center gap-2">
            <span className="w-3 h-3">✉</span>
            {resumeData.personalInfo.email}
          </a>
        )}
        {resumeData.personalInfo.phone && (
          <a href={`tel:${resumeData.personalInfo.phone}`} className="block hover:text-white underline flex items-center gap-2">
            <span className="w-3 h-3">📞</span>
            {resumeData.personalInfo.phone}
          </a>
        )}
        {resumeData.personalInfo.address && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3">📍</span>
            <span>{resumeData.personalInfo.address}</span>
          </div>
        )}
        {resumeData.personalInfo.website && (
          <a
            href={resumeData.personalInfo.website.startsWith("http") ? resumeData.personalInfo.website : `https://${resumeData.personalInfo.website}`}
            target="_blank"
            rel="noreferrer"
            className="block hover:text-white underline flex items-center gap-2"
          >
            <span className="w-3 h-3">🌐</span>
            {resumeData.personalInfo.website}
          </a>
        )}
      </div>
    </div>
  );

  const sidebarSkills =
    resumeData.skills.length > 0 ? (
      <div className="mb-6">
        <h3 className="text-[12px] font-bold uppercase tracking-wider mb-3 text-white/90">
          {resumeData.sectionsTitle.skills?.name || "SKILLS"}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {resumeData.skills.map((skill) => (
            <span
              key={skill.id}
              className="px-2.5 py-1 text-[10px] font-medium rounded bg-white/15 border border-white/30 text-white"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    ) : null;

  const sidebarProjects =
    resumeData.projects.length > 0 ? (
      <div className="mb-6">
        <h3 className="text-[12px] font-bold uppercase tracking-wider mb-3 text-white/90">KEY PROJECTS</h3>
        <div className="space-y-2">
          {resumeData.projects.slice(0, 3).map((project) => (
            <div key={project.id} className="text-[11px] text-white/80">
              <div className="font-semibold text-white mb-0.5">{project.name}</div>
              {project.technologies.length > 0 && (
                <div className="text-[10px] text-white/60">
                  {project.technologies.slice(0, 4).join(", ")}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null;

  const sidebarMoreSections =
    resumeData.moreSections.length > 0 ? (
      <div>
        {resumeData.moreSections.map((sec) => {
          if (!sec.sectionName || sec.body.length === 0) return null;
          return (
            <div key={sec.id} className="mb-4">
              <h3 className="text-[12px] font-bold uppercase tracking-wider mb-2 text-white/90">
                {sec.sectionName.toUpperCase()}
              </h3>
              <ul className="space-y-1.5 text-[10px] text-white/80">
                {sec.body.map((item) => (
                  <li key={item.id} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    ) : null;

  return (
    <div className="mx-auto min-h-[1123px] w-[794px] bg-white overflow-hidden">
      <div className="flex h-full">
        {/* LEFT SIDEBAR */}
        <aside
          className="w-[35%] shrink-0 flex flex-col py-[45px] px-[30px]"
          style={{ backgroundColor: color }}
        >
          <div className="flex-1 flex flex-col">
            {resumeData.personalInfo.fullName && (
              <h1 className="text-[26px] font-bold uppercase leading-tight text-white mb-2">
                {resumeData.personalInfo.fullName}
              </h1>
            )}
            {resumeData.personalInfo.job && (
              <p className="text-[14px] text-white/80 mb-6">{resumeData.personalInfo.job}</p>
            )}
            {sidebarContact}
            {sidebarSkills}
            {sidebarProjects}
            {sidebarMoreSections}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 px-[40px] py-[45px]">
          <div className={`${resumeData.font} text-[#111]`}>
            <OrderedSections order={order} blocks={mainBlocks} />

            {/* More Sections in main area (if not already in sidebar) */}
            {resumeData.moreSections.map((sec) => {
              if (!sec.sectionName || sec.body.length === 0) return null;
              return (
                <div key={sec.id} className="mt-6">
                  <h3 className="text-[16px] font-bold uppercase tracking-wide mb-3" style={{ color }}>
                    {sec.sectionName}
                  </h3>
                  <ul className="pl-5 space-y-1" style={{ color: "#333" }}>
                    {sec.body.map((item) => (
                      <li key={item.id} className="list-disc text-[14px] leading-6">
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