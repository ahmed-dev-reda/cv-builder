"use client";

import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

export default function ClassicOne() {
  const resumeData = useSelector((state: RootState) => state.resume);
  const color = resumeData.color;

  return (
    <div className="w-full p-10">
      {/* Personal Info */}

      {resumeData.personalInfo.fullName && (
        <h2
          className="mb-1 text-center text-3xl font-medium capitalize"
          style={{ color }}
        >
          {resumeData.personalInfo.fullName}
        </h2>
      )}

      {(resumeData.personalInfo.email ||
        resumeData.personalInfo.phone ||
        resumeData.personalInfo.website) && (
        <div className="flex items-center justify-center gap-2 text-center">
          {/* Email */}

          {resumeData.personalInfo.email && (
            <a
              href={`mailto:${resumeData.personalInfo.email}`}
              target="_blank"
              rel="noreferrer"
              className="hover:bg-amber-50"
            >
              {resumeData.personalInfo.email}
            </a>
          )}

          {/* Separator */}

          {resumeData.personalInfo.email &&
            (resumeData.personalInfo.phone ||
              resumeData.personalInfo.website) && (
              <span className="h-3 w-px bg-gray-300" />
            )}

          {/* Phone */}

          {resumeData.personalInfo.phone && (
            <span>{resumeData.personalInfo.phone}</span>
          )}

          {/* Separator */}

          {resumeData.personalInfo.phone && resumeData.personalInfo.website && (
            <span className="h-3 w-px bg-gray-300" />
          )}

          {/* Website */}

          {resumeData.personalInfo.website && (
            <a
              href={
                resumeData.personalInfo.website.startsWith("http")
                  ? resumeData.personalInfo.website
                  : `https://${resumeData.personalInfo.website}`
              }
              target="_blank"
              rel="noreferrer"
              className="hover:bg-amber-50"
            >
              {resumeData.personalInfo.website}
            </a>
          )}
        </div>
      )}

      {/* Profile */}

      {resumeData.summary && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold uppercase" style={{ color }}>
            {resumeData.sectionsTitle[0]?.name || "Professional Summary"}
          </h2>

          <div
            className="mb-2 mt-2 h-[1.3px] w-full rounded-sm"
            style={{ backgroundColor: color }}
          />

          <p className="text-[16px]">{resumeData.summary}</p>
        </div>
      )}

      {/* Education */}

      {resumeData.education.length > 0 && (
        <div>
          <h2
            className="mt-2 text-xl font-semibold uppercase"
            style={{ color }}
          >
            {resumeData.sectionsTitle[2]?.name || "Education"}
          </h2>

          <div
            className="mb-2 mt-2 h-[1.3px] w-full rounded-sm"
            style={{ backgroundColor: color }}
          />

          {resumeData.education.map((edu) => (
            <div key={edu.id}>
              <h3 className="flex justify-between text-[16px] font-semibold">
                <span>{edu.institution}</span>

                {(edu.startDate || edu.endDate) && (
                  <span className="font-medium text-[14px]">
                    {edu.startDate}

                    {edu.startDate && edu.endDate && " - "}

                    {edu.endDate || (edu.startDate && "Present")}
                  </span>
                )}
              </h3>

              {edu.degree && (
                <h4 className="my-0.5 text-[14px]">{edu.degree}</h4>
              )}

              {edu.gpa && (
                <h4 className="text-[14px]">Cumulative GPA: {edu.gpa}</h4>
              )}

              {edu.points.length > 0 && (
                <ul className="my-2 pl-8">
                  {edu.points.map((desc, index) => (
                    <li key={index} className="list-disc text-[14.2px]">
                      {desc}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Work Experience */}

      {resumeData.experience.length > 0 && (
        <div>
          <h2
            className="mt-2 text-xl font-semibold uppercase"
            style={{ color }}
          >
            {resumeData.sectionsTitle[1]?.name || "Work Experience"}
          </h2>

          <div
            className="mb-2 mt-2 h-[1.3px] w-full rounded-sm"
            style={{ backgroundColor: color }}
          />

          {resumeData.experience.map((exp) => (
            <div key={exp.id}>
              <h3 className="flex justify-between text-[16px] font-semibold">
                <span>{exp.company}</span>

                {(exp.startDate || exp.endDate) && (
                  <span className="font-medium text-[14px]">
                    {exp.startDate}

                    {exp.startDate && exp.endDate && " - "}

                    {exp.endDate || (exp.startDate && "Present")}
                  </span>
                )}
              </h3>

              {exp.jobTitle && (
                <h4 className="my-0.5 text-[14px]">{exp.jobTitle}</h4>
              )}

              {exp.points.length > 0 && (
                <ul className="my-2 pl-8">
                  {exp.points.map((desc, index) => (
                    <li key={index} className="list-disc text-[14.2px]">
                      {desc}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}

      {resumeData.projects.length > 0 && (
        <div>
          <h2
            className="mt-2 text-xl font-semibold uppercase"
            style={{ color }}
          >
            {resumeData.sectionsTitle[3]?.name || "Projects"}
          </h2>

          <div
            className="mb-2 mt-2 h-[1.3px] w-full rounded-sm"
            style={{ backgroundColor: color }}
          />

          {resumeData.projects.map((project) => (
            <div key={project.id}>
              <h3 className="flex justify-between text-[16px] font-semibold">
                <span className="flex items-center gap-2">
                  {project.name}

                  {project.url && (
                    <a
                      href={
                        project.url.startsWith("http")
                          ? project.url
                          : `https://${project.url}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="text-[12px] font-normal hover:underline"
                      style={{ color }}
                    >
                      [Link]
                    </a>
                  )}
                </span>

                {(project.startDate || project.endDate) && (
                  <span className="font-medium text-[14px]">
                    {project.startDate}

                    {project.startDate && project.endDate && " - "}

                    {project.endDate || (project.startDate && "Present")}
                  </span>
                )}
              </h3>

              {project.description && (
                <p className="my-1 text-[14px]">{project.description}</p>
              )}

              {project.technologies.length > 0 && (
                <p className="text-[13.5px]">
                  <strong>Technologies:</strong>{" "}
                  {project.technologies.join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}

      {resumeData.skills.length > 0 && (
        <div>
          <h2
            className="mt-2 text-xl font-semibold uppercase"
            style={{ color }}
          >
            {resumeData.sectionsTitle[4]?.name || "Skills"}
          </h2>

          <div
            className="mb-2 mt-2 h-[1.3px] w-full rounded-sm"
            style={{ backgroundColor: color }}
          />

          <ul className="my-2 list-disc pl-8">
            <li className="text-[15px]">
              Technical Skills:{" "}
              {resumeData.skills.map((skill) => skill.name).join(", ")}
            </li>
          </ul>
        </div>
      )}

      {/* Additional Sections */}

      {resumeData.moreSections.map((sec) => {
        if (!sec.sectionName || sec.body.length === 0) {
          return null;
        }

        return (
          <div key={sec.id}>
            <h2
              className="mt-2 text-xl font-semibold uppercase"
              style={{ color }}
            >
              {sec.sectionName}
            </h2>

            <div
              className="mb-2 mt-2 h-[1.3px] w-full rounded-sm"
              style={{ backgroundColor: color }}
            />

            <ul className="my-2 list-disc pl-8">
              <li className="text-[15px]">
                {sec.body.map((item, index) => (
                  <span key={item.id}>
                    {item.name}

                    {index !== sec.body.length - 1 && ", "}
                  </span>
                ))}
              </li>
            </ul>
          </div>
        );
      })}
    </div>
  );
}
