"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";

export default function ClassicThree() {
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
    <div className="mx-auto min-h-[1123px] w-[794px] bg-white px-[40px] py-[55px]">
      {/* Header */}

      <header className="grid grid-cols-[1fr_300px] gap-8">
        <div>
          <h1
            className="font-serif text-[29px] font-bold leading-tight"
            style={{ color }}
          >
            {personalInfo.fullName || "Your Name"}
          </h1>

          {personalInfo.job && (
            <p className="mt-1 text-[18px]">{personalInfo.job}</p>
          )}
        </div>

        <div className="pt-1 text-[13px] leading-[24px]">
          {personalInfo.phone && <p>{personalInfo.phone}</p>}

          {personalInfo.email && (
            <a
              href={`mailto:${personalInfo.email}`}
              className="block w-fit hover:underline"
            >
              {personalInfo.email}
            </a>
          )}

          <div className="flex justify-between">
            {personalInfo.website && (
              <a
                href={
                  personalInfo.website.startsWith("http")
                    ? personalInfo.website
                    : `https://${personalInfo.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="block w-fit hover:underline"
              >
                {personalInfo.website}
              </a>
            )}

            {personalInfo.address && <p>{personalInfo.address}</p>}
          </div>
        </div>
      </header>

      {/* Summary */}

      {summary && (
        <Section
          title={sectionsTitle[0]?.name || "PROFESSIONAL SUMMARY"}
          color={color}
        >
          <p className="text-[13.5px] leading-5.5 -my-2" style={{ color }}>
            {summary}
          </p>
        </Section>
      )}

      {/* Experience */}

      {experience.length > 0 && (
        <Section title={sectionsTitle[1]?.name || "EXPERIENCE"} color={color}>
          <div className="space-y-2">
            {experience.map((item) => (
              <div key={item.id} className="grid grid-cols-[155px_1fr] gap-5">
                <div className="text-[13px] text-[#858585]">
                  {item.startDate}

                  {item.endDate && ` - ${item.endDate}`}

                  {!item.endDate && item.startDate && " - Present"}
                </div>

                <div className="text-[13.5px] leading-[19px]">
                  <h3 className="font-bold">{item.jobTitle}</h3>

                  {item.company && (
                    <p className="text-[#999]">{item.company}</p>
                  )}

                  {item.points.length > 0 && (
                    <ul className="mt-1 list-disc space-y-[1px] pl-4">
                      {item.points.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Education */}

      {education.length > 0 && (
        <Section title={sectionsTitle[2]?.name || "EDUCATION"} color={color}>
          <div className="space-y-2">
            {education.map((item) => (
              <div key={item.id} className="grid grid-cols-[155px_1fr] gap-5">
                <div className="text-[13px] text-[#858585]">
                  {item.startDate}

                  {item.endDate && ` - ${item.endDate}`}

                  {!item.endDate && item.startDate && " - Present"}
                </div>

                <div className="text-[13.5px] leading-[19px]">
                  <h3 className="font-bold">{item.degree}</h3>

                  {item.institution && (
                    <p className="text-[#999]">{item.institution}</p>
                  )}

                  {item.points.length > 0 && (
                    <ul className="list-disc pl-4">
                      {item.points.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  )}

                  {item.gpa && <p>GPA: {item.gpa}</p>}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Projects */}

      {projects.length > 0 && (
        <Section title={sectionsTitle[3]?.name || "PROJECTS"} color={color}>
          <div className="space-y-3">
            {projects.map((project) => (
              <article
                key={project.id}
                className="grid grid-cols-[155px_1fr] gap-5"
              >
                <div className="text-[13px] text-[#858585]">
                  {project.startDate}

                  {project.endDate && ` - ${project.endDate}`}

                  {!project.endDate && project.startDate && " - Present"}
                </div>

                <div className="text-[13.5px] leading-[19px]">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{project.name}</h3>

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
                        View Project
                      </a>
                    )}
                  </div>

                  {project.description && (
                    <p className="mt-1">{project.description}</p>
                  )}

                  {project.technologies.length > 0 && (
                    <p className="mt-1 text-[13px]">
                      <strong>Technologies:</strong>{" "}
                      {project.technologies.join(", ")}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </Section>
      )}

      {/* Skills */}

      {skills.length > 0 && (
        <Section title={sectionsTitle[4]?.name || "SKILLS"} color={color}>
          <ul className="ml-4 grid grid-cols-4 gap-x-12">
            {skills.map((skill) => (
              <li key={skill.id} className="list-disc text-[13.5px]">
                {skill.name}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* More Sections */}

      {moreSections.length > 0 &&
        moreSections.map((section) => {
          if (!section.sectionName || section.body.length === 0) {
            return null;
          }

          return (
            <Section
              key={section.id}
              title={section.sectionName.toUpperCase()}
              color={color}
            >
              <ul className="ml-4 ">
                {section.body.map((item) => (
                  <li
                    key={item.id}
                    className="mr-10 inline-block text-[13.5px] leading-3.75 list-disc"
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            </Section>
          );
        })}
    </div>
  );
}

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
    <section className="mt-[10px]">
      <h2
        className="border-b pb-[2px] text-[15px] font-semibold tracking-[1px]"
        style={{
          borderColor: color,
          color,
        }}
      >
        {title}
      </h2>

      <div className="pt-[20px]">{children}</div>
    </section>
  );
}
