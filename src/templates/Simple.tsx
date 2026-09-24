
"use client";

import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

export default function Simple() {
  const resumeData = useSelector((state: RootState) => state.resume);

  const {
    personalInfo,
    color,
    summary,
    experience,
    education,
    projects,
    skills,
    moreSections,
    sectionsTitle,
  } = resumeData;

  return (
    <div className="w-full p-10">
      {/* ================================= */}
      {/* Header */}
      {/* ================================= */}

      {personalInfo.fullName && (
        <h2
          className="mb-2 text-center text-[36px] font-bold uppercase"
          style={{ color }}
        >
          {personalInfo.fullName}
        </h2>
      )}

      {(personalInfo.address ||
        personalInfo.phone ||
        personalInfo.email ||
        personalInfo.website) && (
        <div className="text-center font-medium">
          <div className="flex items-center justify-center gap-2">
            {/* Address */}
            {personalInfo.address && <span>{personalInfo.address}</span>}

            {personalInfo.address &&
              (personalInfo.phone || personalInfo.email) && (
                <span className="h-3 w-[0.8px] bg-gray-900" />
              )}

            {/* Phone */}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}

            {personalInfo.phone && personalInfo.email && (
              <span className="h-3 w-[0.8px] bg-gray-900" />
            )}

            {/* Email */}
            {personalInfo.email && (
              <a
                href={`mailto:${personalInfo.email}`}
                className="hover:bg-amber-50"
              >
                {personalInfo.email}
              </a>
            )}
          </div>

          {/* Website */}
          {personalInfo.website && (
            <a
              href={
                personalInfo.website.startsWith("http")
                  ? personalInfo.website
                  : `https://${personalInfo.website}`
              }
              target="_blank"
              rel="noreferrer"
              className="hover:bg-amber-50"
            >
              {personalInfo.website}
            </a>
          )}
        </div>
      )}

      {/* ================================= */}
      {/* Summary */}
      {/* ================================= */}

      {summary && (
        <div>
          <div
            className="my-3 h-px w-full"
            style={{
              backgroundColor: color,
            }}
          />

          <h2
            className="my-2 text-xl font-semibold uppercase"
            style={{ color }}
          >
            {sectionsTitle[0]?.name || "Professional Summary"}
          </h2>

          <p>{summary}</p>

          <div
            className="my-3 h-px w-full"
            style={{
              backgroundColor: color,
            }}
          />
        </div>
      )}

      {/* ================================= */}
      {/* Work Experience */}
      {/* ================================= */}

      {experience.length > 0 && (
        <div>
          <h2
            className="my-2 text-xl font-semibold uppercase"
            style={{ color }}
          >
            {sectionsTitle[1]?.name || "Work Experience"}
          </h2>

          {experience.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between font-semibold">
                <h3>
                  {exp.jobTitle}

                  {exp.jobTitle && exp.company && ", "}

                  {exp.company}
                </h3>

                {(exp.startDate || exp.endDate) && (
                  <p>
                    {exp.startDate}

                    {exp.startDate && exp.endDate && " - "}

                    {exp.endDate || (exp.startDate && "Present")}
                  </p>
                )}
              </div>

              {exp.points.length > 0 && (
                <ul className="my-2 pl-8">
                  {exp.points.map((desc, index) => (
                    <li key={index} className="list-disc text-[15.2px]">
                      {desc}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================================= */}
      {/* Education */}
      {/* ================================= */}

      {education.length > 0 && (
        <div>
          <h2
            className="my-2 text-xl font-semibold uppercase"
            style={{ color }}
          >
            {sectionsTitle[2]?.name || "Education"}
          </h2>

          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between font-semibold">
                <h3>{edu.degree}</h3>

                {(edu.startDate || edu.endDate) && (
                  <p>
                    {edu.startDate}

                    {edu.startDate && edu.endDate && " - "}

                    {edu.endDate || (edu.startDate && "Present")}
                  </p>
                )}
              </div>

              {edu.institution && <h4>{edu.institution}</h4>}

              {edu.points.length > 0 && (
                <ul className="my-2 pl-8">
                  {edu.points.map((desc, index) => (
                    <li key={index} className="list-disc text-[15.2px]">
                      {desc}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================================= */}
      {/* Projects */}
      {/* ================================= */}

      {projects.length > 0 && (
        <div>
          <h2
            className="my-2 text-xl font-semibold uppercase"
            style={{ color }}
          >
            {sectionsTitle[3]?.name || "Projects"}
          </h2>

          {projects.map((project) => (
            <div key={project.id} className="mb-3">
              {/* Project Header */}
              <div className="flex items-center justify-between font-semibold">
                <div className="flex items-center gap-2">
                  <h3>{project.name}</h3>

                  {project.url && (
                    <a
                      href={
                        project.url.startsWith("http")
                          ? project.url
                          : `https://${project.url}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs underline"
                      style={{
                        color,
                      }}
                    >
                      Link
                    </a>
                  )}
                </div>

                {(project.startDate || project.endDate) && (
                  <p>
                    {project.startDate}

                    {project.startDate && project.endDate && " - "}

                    {project.endDate ||
                      (project.startDate && "Present")}
                  </p>
                )}
              </div>

              {/* Description */}
              {project.description && (
                <p className="mt-1 text-[14px]">
                  {project.description}
                </p>
              )}

              {/* Technologies */}
              {project.technologies.length > 0 && (
                <p className="mt-1 text-[14px]">
                  <span className="font-semibold">
                    Technologies:
                  </span>{" "}
                  {project.technologies.join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================================= */}
      {/* Additional Information */}
      {/* ================================= */}

      {(skills.length > 0 || moreSections.length > 0) && (
        <div>
          <h2
            className="my-2 text-xl font-semibold uppercase"
            style={{ color }}
          >
            {sectionsTitle[4]?.name || "Skills"}
          </h2>

          {/* ============================ */}
          {/* Skills */}
          {/* ============================ */}

          {skills.length > 0 && (
            <div className="ml-8 text-[14px]">
              <span className="font-semibold">Technical Skills:</span>{" "}
              {skills.map((skill) => skill.name).join(", ")}
            </div>
          )}

          {/* ============================ */}
          {/* More Sections */}
          {/* ============================ */}

          {moreSections.map((sec) => {
            if (sec.body.length === 0) {
              return null;
            }

            return (
              <div key={sec.id} className="mt-3">
                <h3
                  className="mb-1 ml-8 text-[14px] font-semibold"
                  style={{
                    color,
                  }}
                >
                  {sec.sectionName}
                </h3>

                <ul className="ml-8 text-[14px]">
                  {sec.body.map((item) => (
                    <li key={item.id} className="list-disc">
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
