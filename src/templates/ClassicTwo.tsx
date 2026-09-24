"use client";

import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

export default function ClassicTwo() {
  const resumeData = useSelector((state: RootState) => state.resume);
  const color = resumeData.color;

  const { personalInfo } = resumeData;

  return (
    <div className="w-full bg-white p-10 text-black">
      {/* ==================== Header ==================== */}

      <header className="border-b-2 pb-5" style={{ borderColor: color }}>
        <div className="flex items-end justify-between gap-6">
          <div>
            {personalInfo.fullName && (
              <h1 className="text-[34px] font-bold leading-none">
                {personalInfo.fullName}
              </h1>
            )}

            {personalInfo.job && (
              <p className="mt-2 text-[17px] font-medium" style={{ color }}>
                {personalInfo.job}
              </p>
            )}
          </div>

          <div className="text-[13.5px]">
            {personalInfo.phone && <p>{personalInfo.phone}</p>}

            {personalInfo.email && (
              <a
                href={`mailto:${personalInfo.email}`}
                className="block hover:underline"
              >
                {personalInfo.email}
              </a>
            )}

            <div className="flex justify-between gap-4">
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

              {personalInfo.address && <p>{personalInfo.address}</p>}
            </div>
          </div>
        </div>
      </header>

      {/* ==================== Summary ==================== */}

      {resumeData.summary && (
        <section className="mt-2">
          <SectionHeading
            title={resumeData.sectionsTitle[0]?.name || "Professional Summary"}
            color={color}
          />

          <p className="mt-3 text-[15px]">{resumeData.summary}</p>
        </section>
      )}

      {/* ==================== Experience ==================== */}

      {resumeData.experience.length > 0 && (
        <section className="mt-2">
          <SectionHeading
            title={resumeData.sectionsTitle[1]?.name || "Work Experience"}
            color={color}
          />

          <div className="mt-4 space-y-5">
            {resumeData.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between gap-5">
                  <div>
                    {exp.company && (
                      <h3 className="text-[17px] font-bold">{exp.company}</h3>
                    )}

                    {exp.jobTitle && (
                      <p className="text-[14.5px] italic">{exp.jobTitle}</p>
                    )}
                  </div>

                  {(exp.startDate || exp.endDate) && (
                    <span className="shrink-0 text-[14px]">
                      {exp.startDate}

                      {exp.startDate && exp.endDate && " – "}

                      {exp.endDate || (exp.startDate && "Present")}
                    </span>
                  )}
                </div>

                {exp.points.length > 0 && (
                  <ul className="mt-2 space-y-1 pl-6">
                    {exp.points.map((point, index) => (
                      <li key={index} className="list-disc text-[14px]">
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ==================== Education ==================== */}

      {resumeData.education.length > 0 && (
        <section className="mt-2">
          <SectionHeading
            title={resumeData.sectionsTitle[2]?.name || "Education"}
            color={color}
          />

          <div className="mt-4 space-y-5">
            {resumeData.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex items-baseline justify-between gap-5">
                  <div>
                    {edu.institution && (
                      <h3 className="text-[17px] font-bold">
                        {edu.institution}
                      </h3>
                    )}

                    {edu.degree && (
                      <p className="text-[14.5px] italic">{edu.degree}</p>
                    )}
                  </div>

                  {(edu.startDate || edu.endDate) && (
                    <span className="shrink-0 text-[14px]">
                      {edu.startDate}

                      {edu.startDate && edu.endDate && " – "}

                      {edu.endDate || (edu.startDate && "Present")}
                    </span>
                  )}
                </div>

                {edu.gpa && (
                  <p className="mt-1 text-[14px]">
                    <strong>GPA:</strong> {edu.gpa}
                  </p>
                )}

                {edu.points.length > 0 && (
                  <ul className="mt-2 space-y-1 pl-6">
                    {edu.points.map((point, index) => (
                      <li key={index} className="list-disc text-[14px]">
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ==================== Projects ==================== */}

      {resumeData.projects.length > 0 && (
        <section className="mt-2">
          <SectionHeading
            title={resumeData.sectionsTitle[3]?.name || "Projects"}
            color={color}
          />

          <div className="mt-4 space-y-5">
            {resumeData.projects.map((project) => (
              <article key={project.id}>
                <div className="flex items-baseline justify-between gap-5">
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
                    <span className="shrink-0 text-[14px]">
                      {project.startDate}

                      {project.startDate && project.endDate && " – "}

                      {project.endDate || (project.startDate && "Present")}
                    </span>
                  )}
                </div>

                {project.description && (
                  <p className="mt-1 text-[14px]">{project.description}</p>
                )}

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

      {/* ==================== Skills ==================== */}

      {resumeData.skills.length > 0 && (
        <section className="mt-2">
          <SectionHeading
            title={resumeData.sectionsTitle[4]?.name || "Skills"}
            color={color}
          />

          <p className="mt-3 text-[14.5px]">
            {resumeData.skills.map((skill, index) => (
              <span key={skill.id}>
                <strong>{skill.name}</strong>

                {index !== resumeData.skills.length - 1 && (
                  <span className="mx-2">•</span>
                )}
              </span>
            ))}
          </p>
        </section>
      )}

      {/* ==================== Additional Sections ==================== */}

      {resumeData.moreSections.map((section) => {
        if (!section.sectionName || section.body.length === 0) {
          return null;
        }

        return (
          <section key={section.id} className="mt-2">
            <SectionHeading title={section.sectionName} color={color} />

            <div className="mt-3">
              {section.body.map((item) => (
                <span
                  key={item.id}
                  className="mr-10 inline-block text-[14.5px]"
                >
                  • {item.name}
                </span>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

/* ==================== Section Heading ==================== */

function SectionHeading({ title, color }: { title: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-6 w-1" style={{ backgroundColor: color }} />

      <h2
        className="text-[18px] font-bold uppercase tracking-wide"
        style={{ color }}
      >
        {title}
      </h2>
    </div>
  );
}
