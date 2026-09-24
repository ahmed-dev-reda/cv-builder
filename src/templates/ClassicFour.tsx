"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";

export default function ClassicFour() {
  const resume = useSelector((state: RootState) => state.resume);

  const {
    color,
    personalInfo,
    summary,
    experience,
    education,
    projects,
    skills,
    moreSections,
    sectionsTitle,
  } = resume;

  return (
    <div className="mx-auto min-h-[1123px] w-[794px] bg-white px-[52px] py-[45px] text-[#111]">
      {/* ================= HEADER ================= */}

      <header className="text-center">
        <h1
          className="text-[30px] font-bold uppercase leading-none"
          style={{ color }}
        >
          {personalInfo.fullName || "FIRST M. LAST"}
        </h1>

        {personalInfo.job && (
          <p className="mt-2 text-[16px] font-medium">{personalInfo.job}</p>
        )}

        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-2 text-[14px]">
          {personalInfo.address && <span>{personalInfo.address}</span>}

          {personalInfo.phone && (
            <>
              {personalInfo.address && <span>•</span>}

              <a
                href={`tel:${personalInfo.phone}`}
                className="hover:underline"
                style={{ color }}
              >
                {personalInfo.phone}
              </a>
            </>
          )}

          {personalInfo.email && (
            <>
              {(personalInfo.address || personalInfo.phone) && <span>•</span>}

              <a
                href={`mailto:${personalInfo.email}`}
                className="hover:underline"
                style={{ color }}
              >
                {personalInfo.email}
              </a>
            </>
          )}

          {personalInfo.website && (
            <>
              <span>•</span>

              <a
                href={
                  personalInfo.website.startsWith("http")
                    ? personalInfo.website
                    : `https://${personalInfo.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color }}
              >
                {personalInfo.website}
              </a>
            </>
          )}
        </div>
      </header>

      {/* ================= SUMMARY ================= */}

      {summary && (
        <Section
          title={sectionsTitle[0]?.name || "PROFESSIONAL SUMMARY"}
          color={color}
        >
          <p className="text-[14px] leading-5">{summary}</p>
        </Section>
      )}

      {/* ================= EXPERIENCE ================= */}

      {experience.length > 0 && (
        <Section title={sectionsTitle[1]?.name || "EXPERIENCE"} color={color}>
          <div className="space-y-4">
            {experience.map((item) => (
              <div key={item.id}>
                {/* Company + Location */}

                <div className="flex items-baseline justify-between gap-6">
                  <h3 className="text-[16px] font-bold uppercase">
                    {item.company}
                  </h3>

                  {personalInfo.address && (
                    <span className="shrink-0 text-[15px]">
                      {personalInfo.address}
                    </span>
                  )}
                </div>

                {/* Job + Date */}

                <div className="flex items-baseline justify-between gap-6">
                  <p className="text-[15px] italic">{item.jobTitle}</p>

                  {(item.startDate || item.endDate) && (
                    <p className="shrink-0 text-[15px]">
                      {item.startDate}

                      {item.startDate && item.endDate && " – "}

                      {item.endDate || (item.startDate && "Present")}
                    </p>
                  )}
                </div>

                {/* Description */}

                {item.points.length > 0 && (
                  <ul className="mt-1 list-disc space-y-0 pl-6 text-[14px] leading-[18px]">
                    {item.points.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ================= EDUCATION ================= */}

      {education.length > 0 && (
        <Section title={sectionsTitle[2]?.name || "EDUCATION"} color={color}>
          <div className="space-y-4">
            {education.map((item) => (
              <div key={item.id}>
                {/* University + Location */}

                <div className="flex items-baseline justify-between gap-6">
                  <h3 className="text-[16px] font-bold uppercase">
                    {item.institution}
                  </h3>

                  {personalInfo.address && (
                    <span className="shrink-0 text-[15px]">
                      {personalInfo.address}
                    </span>
                  )}
                </div>

                {/* Degree + Date */}

                <div className="flex items-baseline justify-between gap-6">
                  <p className="text-[15px] italic">{item.degree}</p>

                  {(item.startDate || item.endDate) && (
                    <p className="shrink-0 text-[15px]">
                      {item.startDate}

                      {item.startDate && item.endDate && " – "}

                      {item.endDate || (item.startDate && "Present")}
                    </p>
                  )}
                </div>

                {item.points.length > 0 && (
                  <ul className="mt-1 list-disc space-y-0 pl-6 text-[14px] leading-[18px]">
                    {item.points.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                )}

                {item.gpa && (
                  <p className="text-[14px]">
                    <strong>GPA:</strong> {item.gpa}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ================= PROJECTS ================= */}

      {projects.length > 0 && (
        <Section title={sectionsTitle[3]?.name || "PROJECTS"} color={color}>
          <div className="space-y-4">
            {projects.map((project) => (
              <article key={project.id}>
                {/* Project + Date */}

                <div className="flex items-baseline justify-between gap-6">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[16px] font-bold">{project.name}</h3>

                    {project.url && (
                      <a
                        href={
                          project.url.startsWith("http")
                            ? project.url
                            : `https://${project.url}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] hover:underline"
                        style={{ color }}
                      >
                        [Link]
                      </a>
                    )}
                  </div>

                  {(project.startDate || project.endDate) && (
                    <p className="shrink-0 text-[15px]">
                      {project.startDate}

                      {project.startDate && project.endDate && " – "}

                      {project.endDate || (project.startDate && "Present")}
                    </p>
                  )}
                </div>

                {/* Description */}

                {project.description && (
                  <p className="mt-1 text-[14px] leading-5">
                    {project.description}
                  </p>
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
        </Section>
      )}

      {/* ================= SKILLS ================= */}

      {skills.length > 0 && (
        <Section title={sectionsTitle[4]?.name || "SKILLS"} color={color}>
          <div className="text-[14px] leading-5">
            <p>
              <strong>Technical Skills:</strong>{" "}
              {skills.map((skill, index) => (
                <span key={skill.id}>
                  {skill.name}

                  {index < skills.length - 1 && ", "}
                </span>
              ))}
            </p>
          </div>
        </Section>
      )}

      {/* ================= ADDITIONAL SECTIONS ================= */}

      {moreSections.length > 0 && (
        <Section title="ADDITIONAL" color={color}>
          <div className="space-y-1 text-[14px] leading-4.75">
            {moreSections.map((section) => {
              if (!section.sectionName || section.body.length === 0) {
                return null;
              }

              return (
                <div key={section.id}>
                  <strong>{section.sectionName}:</strong>{" "}
                  {section.body.map((item, index) => (
                    <span key={item.id}>
                      {item.name}

                      {index < section.body.length - 1 && ", "}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        </Section>
      )}
    </div>
  );
}

/* ================================================= */
/* SECTION */
/* ================================================= */

function Section({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-2">
      <h2
        className="border-b text-[17px] font-bold uppercase"
        style={{
          borderColor: color,
          color,
        }}
      >
        {title}
      </h2>

      <div className="pt-2">{children}</div>
    </section>
  );
}
