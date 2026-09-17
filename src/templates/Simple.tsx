import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

export default function Simple() {
  const resumeData = useSelector((state: RootState) => state.resume);

  const { personalInfo, color } = resumeData;

  return (
    <div className="w-full p-10">
      {/* Header */}
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
              href={`https://${personalInfo.website}`}
              target="_blank"
              rel="noreferrer"
              className="hover:bg-amber-50"
            >
              {personalInfo.website}
            </a>
          )}
        </div>
      )}

      {/* Summary */}
      {resumeData.summary && (
        <div>
          <div
            className="my-3 h-px w-full"
            style={{ backgroundColor: color }}
          />

          <h2
            className="my-2 text-xl font-semibold uppercase"
            style={{ color }}
          >
            {resumeData.sectionsTitle[0].name}
          </h2>

          <p>{resumeData.summary}</p>

          <div
            className="my-3 h-px w-full"
            style={{ backgroundColor: color }}
          />
        </div>
      )}

      {/* Work Experience */}
      {resumeData.experience.length > 0 && (
        <div>
          <h2
            className="my-2 text-xl font-semibold uppercase"
            style={{ color }}
          >
            {resumeData.sectionsTitle[1].name}
          </h2>

          {resumeData.experience.map((exp) => (
            <div key={exp.id}>
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

      {/* Education */}
      {resumeData.education.length > 0 && (
        <div>
          <h2
            className="my-2 text-xl font-semibold uppercase"
            style={{ color }}
          >
            {resumeData.sectionsTitle[2].name}
          </h2>

          {resumeData.education.map((edu) => (
            <div key={edu.id}>
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

      {/* Additional Information */}
      {(resumeData.skills.length > 0 || resumeData.moreSections.length > 0) && (
        <div>
          <h2
            className="my-2 text-xl font-semibold uppercase"
            style={{ color }}
          >
            ADDITIONAL INFORMATION
          </h2>

          <ul className="list-disc">
            {/* Skills */}
            {resumeData.skills.length > 0 && (
              <li className="ml-8 text-[14px]">
                <span className="font-semibold">Technical Skills:</span>{" "}
                {resumeData.skills.map((skill) => skill.name).join(", ")}
              </li>
            )}

            {/* More Sections */}
            {resumeData.moreSections.map((sec) => (
              <li className="ml-8 text-[14px]" key={sec.id}>
                <span className="font-semibold">{sec.sectionName}:</span>{" "}
                {sec.body.map((s) => s.name).join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
