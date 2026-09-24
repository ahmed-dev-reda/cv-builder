"use client";

import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

export default function MinimalistTwo() {
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
    <div className="flex min-h-full w-full bg-white text-black">
      {/* ================= Sidebar ================= */}

      <aside
        className="w-[40%] shrink-0 p-8"
        style={{
          backgroundColor: `${color}12`,
          borderRight: `3px solid ${color}`,
        }}
      >
        {/* Name */}
        {personalInfo.fullName && (
          <h1
            className="text-[27px] font-bold uppercase leading-tight"
            style={{ color }}
          >
            {personalInfo.fullName}
          </h1>
        )}

        {/* Job */}
        {personalInfo.job && (
          <p className="mt-2 text-[15px] font-medium">{personalInfo.job}</p>
        )}

        {/* Contact */}
        {(personalInfo.email ||
          personalInfo.phone ||
          personalInfo.address ||
          personalInfo.website) && (
          <div className="mt-8">
            <SidebarTitle title="Contact" color={color} />

            <div className="mt-3 space-y-2 break-words text-[13px]">
              {personalInfo.email && (
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="block hover:underline"
                >
                  {personalInfo.email}
                </a>
              )}

              {personalInfo.phone && <p>{personalInfo.phone}</p>}

              {personalInfo.address && <p>{personalInfo.address}</p>}

              {personalInfo.website && (
                <a
                  href={
                    personalInfo.website.startsWith("http")
                      ? personalInfo.website
                      : `https://${personalInfo.website}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="block hover:underline"
                >
                  {personalInfo.website}
                </a>
              )}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mt-8">
            <SidebarTitle
              title={sectionsTitle[4]?.name || "Skills"}
              color={color}
            />

            <ul className="mt-3 space-y-1.5">
              {skills.map((skill) => (
                <li key={skill.id} className="text-[13.5px]">
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* More Sections */}
        {moreSections.map((section) => {
          if (!section.sectionName || section.body.length === 0) {
            return null;
          }

          return (
            <div key={section.id} className="mt-8">
              <SidebarTitle title={section.sectionName} color={color} />

              <ul className="mt-3 space-y-1.5">
                {section.body.map((item) => (
                  <li key={item.id} className="text-[13.5px]">
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </aside>

      {/* ================= Main Content ================= */}

      <main className="flex-1 p-10">
        {/* Summary */}
        {summary && (
          <section>
            <MainTitle
              title={sectionsTitle[0]?.name || "Summary"}
              color={color}
            />

            <p className="mt-3 text-[14.5px]">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mt-8">
            <MainTitle
              title={sectionsTitle[1]?.name || "Work Experience"}
              color={color}
            />

            <div className="mt-4 space-y-6">
              {experience.map((exp) => (
                <article key={exp.id}>
                  <div className="flex justify-between gap-4">
                    <div>
                      {exp.company && (
                        <h3 className="text-[17px] font-bold">{exp.company}</h3>
                      )}

                      {exp.jobTitle && (
                        <p className="text-[14px] italic" style={{ color }}>
                          {exp.jobTitle}
                        </p>
                      )}
                    </div>

                    {(exp.startDate || exp.endDate) && (
                      <span className="shrink-0 text-[13px]">
                        {exp.startDate}

                        {exp.startDate && exp.endDate && " – "}

                        {exp.endDate || (exp.startDate && "Present")}
                      </span>
                    )}
                  </div>

                  {exp.points.length > 0 && (
                    <ul className="mt-2 space-y-1 pl-5">
                      {exp.points.map((point, index) => (
                        <li key={index} className="list-disc text-[14px]">
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mt-8">
            <MainTitle
              title={sectionsTitle[2]?.name || "Education"}
              color={color}
            />

            <div className="mt-4 space-y-6">
              {education.map((edu) => (
                <article key={edu.id}>
                  <div className="flex justify-between gap-4">
                    <div>
                      {edu.institution && (
                        <h3 className="text-[17px] font-bold">
                          {edu.institution}
                        </h3>
                      )}

                      {edu.degree && (
                        <p className="text-[14px] italic" style={{ color }}>
                          {edu.degree}
                        </p>
                      )}
                    </div>

                    {(edu.startDate || edu.endDate) && (
                      <span className="shrink-0 text-[13px]">
                        {edu.startDate}

                        {edu.startDate && edu.endDate && " – "}

                        {edu.endDate || (edu.startDate && "Present")}
                      </span>
                    )}
                  </div>

                  {edu.gpa && (
                    <p className="mt-1 text-[13.5px]">
                      <strong>GPA:</strong> {edu.gpa}
                    </p>
                  )}

                  {edu.points.length > 0 && (
                    <ul className="mt-2 space-y-1 pl-5">
                      {edu.points.map((point, index) => (
                        <li key={index} className="list-disc text-[14px]">
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mt-8">
            <MainTitle
              title={sectionsTitle[3]?.name || "Projects"}
              color={color}
            />

            <div className="mt-4 space-y-6">
              {projects.map((project) => (
                <article key={project.id}>
                  {/* Project Header */}
                  <div className="flex justify-between gap-4">
                    <div>
                      {project.name && (
                        <div className="flex items-center gap-2">
                          <h3 className="text-[17px] font-bold">
                            {project.name}
                          </h3>

                          {project.url && (
                            <a
                              href={
                                project.url.startsWith("http")
                                  ? project.url
                                  : `https://${project.url}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="text-[12px] underline"
                              style={{ color }}
                            >
                              View Project
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {(project.startDate || project.endDate) && (
                      <span className="shrink-0 text-[13px]">
                        {project.startDate}

                        {project.startDate && project.endDate && " – "}

                        {project.endDate || (project.startDate && "Present")}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {project.description && (
                    <p className="mt-2 text-[14px]">{project.description}</p>
                  )}

                  {/* Technologies */}
                  {project.technologies.length > 0 && (
                    <p className="mt-1 text-[13.5px]">
                      <strong>Technologies:</strong>{" "}
                      {project.technologies.join(", ")}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

/* ================= Sidebar Title ================= */

function SidebarTitle({ title, color }: { title: string; color: string }) {
  return (
    <h2
      className="border-b pb-1 text-[15px] font-bold uppercase tracking-wider"
      style={{
        borderColor: color,
        color,
      }}
    >
      {title}
    </h2>
  );
}

/* ================= Main Title ================= */

function MainTitle({ title, color }: { title: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-0.5 w-8" style={{ backgroundColor: color }} />

      <h2
        className="text-[19px] font-bold uppercase tracking-wide"
        style={{ color }}
      >
        {title}
      </h2>

      <span className="h-[2px] flex-1" style={{ backgroundColor: color }} />
    </div>
  );
}
