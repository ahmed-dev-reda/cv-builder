import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

const isEmpty = (value?: string) => !value?.trim();

const getTextClass = (value?: string, hidePlaceholders = false) => {
  if (isEmpty(value) && !hidePlaceholders) {
    return "text-gray-400/50";
  }

  return "";
};

export default function Minimalist() {
  const resumeData = useSelector((state: RootState) => state.resume);
  const color = resumeData.color;

  return (
    <div className="w-full p-10">
      {/* Personal Info */}
      <h2
        className={`text-center text-4xl font-semibold uppercase tracking-widest ${getTextClass(
          resumeData.personalInfo.fullName,
          true,
        )}`}
        style={resumeData.personalInfo.fullName ? { color } : undefined}
      >
        {resumeData.personalInfo.fullName}
      </h2>

      {resumeData.personalInfo.job && (
        <p
          className={`mt-3 mb-2 text-center text-xl uppercase ${getTextClass(
            resumeData.personalInfo.job,
            true,
          )}`}
        >
          {resumeData.personalInfo.job}
        </p>
      )}

      {(resumeData.personalInfo.address ||
        resumeData.personalInfo.email ||
        resumeData.personalInfo.website) && (
        <div className="flex items-center justify-center gap-2 text-center">
          {resumeData.personalInfo.address && (
            <span>{resumeData.personalInfo.address}</span>
          )}

          {resumeData.personalInfo.address && resumeData.personalInfo.email && (
            <span className="h-3 w-[0.8px] bg-gray-900" />
          )}

          {resumeData.personalInfo.email && (
            <span>{resumeData.personalInfo.email}</span>
          )}

          {(resumeData.personalInfo.address || resumeData.personalInfo.email) &&
            resumeData.personalInfo.website && (
              <span className="h-3 w-[0.8px] bg-gray-900" />
            )}

          {resumeData.personalInfo.website && (
            <a
              href={`https://${resumeData.personalInfo.website}`}
              target="_blank"
              rel="noreferrer"
              className="hover:bg-amber-50"
            >
              {resumeData.personalInfo.website}
            </a>
          )}
        </div>
      )}

      {/* Divider */}
      <div
        className="my-5 h-0.5 w-full rounded-sm"
        style={{ backgroundColor: color }}
      />

      {/* Professional Summary */}
      {resumeData.summary && (
        <div>
          <h3 className="text-[20px] font-bold uppercase" style={{ color }}>
            {resumeData.sectionsTitle[0].name}
          </h3>

          <p className="my-3 leading-5 text-[14px]">{resumeData.summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {resumeData.experience.length > 0 && (
        <div>
          <h3 className="text-[20px] font-bold uppercase" style={{ color }}>
            {resumeData.sectionsTitle[1].name}
          </h3>

          <div>
            {resumeData.experience.map((exp) => (
              <div key={exp.id}>
                <h4 className="mt-4 flex justify-between pr-45 text-[15px] font-semibold">
                  <span>
                    {exp.jobTitle}
                    {exp.jobTitle && exp.company && ", "}
                    {exp.company}
                  </span>

                  <span>
                    {exp.startDate}
                    {exp.startDate && exp.endDate && " - "}
                    {exp.endDate !== "" && exp.endDate
                      ? exp.endDate
                      : exp.startDate
                        ? " - Present"
                        : ""}
                  </span>
                </h4>

                {exp.points.length > 0 && (
                  <ul className="my-1 pl-8">
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
        </div>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <div>
          <h3 className="text-[20px] font-bold uppercase" style={{ color }}>
            {resumeData.sectionsTitle[2].name}
          </h3>

          <div>
            {resumeData.education.map((edu) => (
              <div key={edu.id}>
                <h4 className="mt-4 flex justify-between pr-45 text-[15px] font-semibold">
                  <span>{edu.degree}</span>

                  <span>
                    {edu.startDate}
                    {edu.startDate && edu.endDate && " - "}
                    {edu.endDate !== "" && edu.endDate
                      ? edu.endDate
                      : edu.startDate
                        ? " - Present"
                        : ""}
                  </span>
                </h4>

                {edu.institution && (
                  <p className="text-[14px]">{edu.institution}</p>
                )}

                {edu.points.length > 0 && (
                  <ul className="my-1 pl-8">
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
        </div>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <div>
          <h3 className="text-[20px] font-bold uppercase" style={{ color }}>
            {resumeData.sectionsTitle[3].name}
          </h3>

          <ul className="grid grid-cols-5 gap-2 my-1 pl-8">
            {resumeData.skills.map((skill) => (
              <li key={skill.id} className="list-disc">
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* More Sections */}
      {resumeData.moreSections.map((sec) => (
        <div key={sec.id}>
          {sec.sectionName && (
            <h3 className="text-[20px] font-bold uppercase" style={{ color }}>
              {sec.sectionName}
            </h3>
          )}

          {sec.body.length > 0 && (
            <ul className={`grid grid-cols-2 gap-2 my-1 pl-8`}>
              {sec.body.map((s) => (
                <li key={s.id} className="list-disc">
                  {s.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
