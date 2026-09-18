"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";

export default function ClassicFour() {
  const resume = useSelector((state: RootState) => state.resume);

  const { color, personalInfo, experience, education, skills, moreSections } =
    resume;

  return (
    <div className="mx-auto min-h-[1123px] w-[794px] bg-white px-[52px] py-[45px] text-[#111]">
      {/* ================= HEADER ================= */}
      <header className="text-center">
        <h1 className="text-[30px] font-bold uppercase leading-none">
          {personalInfo.fullName || "FIRST M. LAST"}
        </h1>

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

      {/* ================= EXPERIENCE ================= */}
      {experience.length > 0 && (
        <Section title="EXPERIENCE" color={color}>
          <div className="space-y-4">
            {experience.map((item) => (
              <div key={item.id}>
                {/* Company + Location */}
                <div className="flex items-baseline justify-between gap-6">
                  <h3 className="text-[16px] font-bold uppercase">
                    {item.company}
                  </h3>

                  {/* You don't currently have location in Experience */}
                  <span className="shrink-0 text-[15px]">
                    {personalInfo.address}
                  </span>
                </div>

                {/* Job + Date */}
                <div className="flex items-baseline justify-between gap-6">
                  <p className="text-[15px] italic">{item.jobTitle}</p>

                  <p className="shrink-0 text-[15px]">
                    {item.startDate}
                    {item.endDate && ` – ${item.endDate}`}
                  </p>
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
        <Section title="EDUCATION" color={color}>
          <div className="space-y-4">
            {education.map((item) => (
              <div key={item.id}>
                {/* University + Location */}
                <div className="flex items-baseline justify-between gap-6">
                  <h3 className="text-[16px] font-bold uppercase">
                    {item.institution}
                  </h3>

                  <span className="shrink-0 text-[15px]">
                    {personalInfo.address}
                  </span>
                </div>

                {/* Degree + Date */}
                <div className="flex items-baseline justify-between gap-6">
                  <p className="text-[15px] italic">{item.degree}</p>

                  <p className="shrink-0 text-[15px]">
                    {item.startDate}
                    {item.endDate && ` – ${item.endDate}`}
                  </p>
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

      {/* ================= SKILLS ================= */}

      {/* ================= ADDITIONAL / CUSTOM ================= */}
      {moreSections.length > 0 && (
        <Section title="ADDITIONAL" color={color}>
          {skills.length > 0 && (
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
          )}
          <div className="space-y-1 text-[14px] leading-4.75">
            {moreSections.map((section) => (
              <div key={section.id}>
                <strong>{section.sectionName}:</strong>{" "}
                {section.body.map((item, index) => (
                  <span key={item.id}>
                    {item.name}
                    {index < section.body.length - 1 && ", "}
                  </span>
                ))}
              </div>
            ))}
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
        }}
      >
        {title}
      </h2>

      <div className="pt-2">{children}</div>
    </section>
  );
}
