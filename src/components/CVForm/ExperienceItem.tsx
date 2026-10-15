import { addExperiencePoint, Experience, removeExperience, removeExperiencePoint, updateExperience, updateExperiencePoint } from "@/lib/features/resumeSlice";
import { FaRegTrashAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";

// Single work experience entry with inline fields and bullet-point descriptions
export default function ExperienceJSX({
  exp,
  inputClasses,
}: {
  exp: Experience;
  inputClasses: string;
}) {
  const dispatch = useDispatch();
  return (
    <div
      key={exp.id}
      className="relative mb-4 rounded-sm border border-gray-300 bg-[#edf0f9a7] p-4"
    >
      <button
        type="button"
        className="absolute right-3 top-3 cursor-pointer text-red-600"
        onClick={() => {
          dispatch(removeExperience(exp.id));
        }}
      >
        <FaRegTrashAlt size={16} />
      </button>
      <div>
        <label className="text-sm font-semibold" htmlFor={`jobTitle-${exp.id}`}>
          Job Title
        </label>

        <input
          type="text"
          className={inputClasses}
          id={`jobTitle-${exp.id}`}
          value={exp.jobTitle}
          onChange={(e) =>
            dispatch(
              updateExperience({
                id: exp.id,
                field: "jobTitle",
                value: e.target.value,
              }),
            )
          }
        />
      </div>
      <div className="mt-4 flex gap-4">
        <div>
          <label
            className="text-sm font-semibold"
            htmlFor={`company-${exp.id}`}
          >
            Company
          </label>

          <input
            type="text"
            className={inputClasses}
            id={`company-${exp.id}`}
            value={exp.company}
            onChange={(e) =>
              dispatch(
                updateExperience({
                  id: exp.id,
                  field: "company",
                  value: e.target.value,
                }),
              )
            }
          />
        </div>

        <div>
          <label
            className="text-sm font-semibold"
            htmlFor={`location-${exp.id}`}
          >
            Location
          </label>

          <input
            type="text"
            className={inputClasses}
            id={`location-${exp.id}`}
            value={exp.location ?? ""}
            onChange={(e) =>
              dispatch(
                updateExperience({
                  id: exp.id,
                  field: "location",
                  value: e.target.value,
                }),
              )
            }
          />
        </div>
      </div>

      <div className="flex gap-4 my-2">
        <div>
          <label
            className="text-sm font-semibold"
            htmlFor={`startDate-${exp.id}`}
          >
            Start Date
          </label>

          <input
            type="text"
            className={inputClasses}
            id={`startDate-${exp.id}`}
            value={exp.startDate}
            onChange={(e) =>
              dispatch(
                updateExperience({
                  id: exp.id,
                  field: "startDate",
                  value: e.target.value,
                }),
              )
            }
          />
        </div>

        <div>
          <label
            className="text-sm font-semibold"
            htmlFor={`endDate-${exp.id}`}
          >
            End Date
          </label>

          <input
            type="text"
            className={inputClasses}
            id={`endDate-${exp.id}`}
            value={exp.endDate}
            onChange={(e) =>
              dispatch(
                updateExperience({
                  id: exp.id,
                  field: "endDate",
                  value: e.target.value,
                }),
              )
            }
          />
        </div>
      </div>{" "}
      {/* Description */}
      <div className="mt-5">
        <label className="text-sm font-semibold">Description</label>

        <div className="mt-2 space-y-2">
          {exp.points.map((point, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                className={inputClasses}
                placeholder="e.g. Graduated with honors..."
                value={point}
                onChange={(e) =>
                  dispatch(
                    updateExperiencePoint({
                      id: exp.id,
                      pointIndex: index,
                      value: e.target.value,
                    }),
                  )
                }
              />

              <button
                type="button"
                className="shrink-0 text-red-600 hover:text-red-700"
                onClick={() =>
                  dispatch(
                    removeExperiencePoint({
                      id: exp.id,
                      pointIndex: index,
                    }),
                  )
                }
              >
                <FaRegTrashAlt size={15} />
              </button>
            </div>
          ))}
        </div>

        {/* Add Description */}
        <button
          type="button"
          className="mt-3 text-sm font-semibold text-[#0D47A1] hover:underline"
          onClick={() =>
            dispatch(
              addExperiencePoint({
                id: exp.id,
                point: "",
              }),
            )
          }
        >
          + Add description
        </button>
      </div>
    </div>
  );
}
