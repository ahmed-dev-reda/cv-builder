import { addEducationPoint, Education, removeEducation, removeEducationPoint, updateEducation, updateEducationPoint } from "@/lib/features/resumeSlice";
import { FaRegTrashAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";

// Single education entry with inline fields and bullet-point descriptions
export default function EducationJSX({
  edu,
  inputClasses,
}: {
  edu: Education;
  inputClasses: string;
}) {
  const dispatch = useDispatch();

  return (
    <div className="relative mb-4 rounded-sm border border-gray-300 bg-[#edf0f9a7] p-4">
      {/* Delete Education */}
      <button
        type="button"
        className="absolute right-3 top-3 cursor-pointer text-red-600"
        onClick={() => {
          dispatch(removeEducation(edu.id));
        }}
      >
        <FaRegTrashAlt size={16} />
      </button>

      {/* Degree */}
      <div>
        <label className="text-sm font-semibold" htmlFor={`degree-${edu.id}`}>
          Degree
        </label>

        <input
          type="text"
          className={inputClasses}
          id={`degree-${edu.id}`}
          value={edu.degree}
          onChange={(e) =>
            dispatch(
              updateEducation({
                id: edu.id,
                field: "degree",
                value: e.target.value,
              }),
            )
          }
        />
      </div>

      {/* Institution + Dates */}

      {/* Institution */}
      <div className="flex-1">
        <label
          className="text-sm font-semibold"
          htmlFor={`institution-${edu.id}`}
        >
          Institution
        </label>

        <input
          type="text"
          className={inputClasses}
          id={`institution-${edu.id}`}
          value={edu.institution}
          onChange={(e) =>
            dispatch(
              updateEducation({
                id: edu.id,
                field: "institution",
                value: e.target.value,
              }),
            )
          }
        />
      </div>

      {/* Location */}
      <div className="flex-1 basis-72 my-2">
        <label className="text-sm font-semibold" htmlFor={`education-location-${edu.id}`}>
          Location
        </label>
        <input
          type="text"
          name="location"
          id={`education-location-${edu.id}`}
          className={inputClasses}
          value={edu.location ?? ""}
          onChange={(e) => {
            dispatch(updateEducation({ id: edu.id, field: "location", value: e.target.value }));
          }}
        />
      </div>

      <div className="flex gap-4 my-2">
        {/* Start Date */}
        <div className="flex-1">
          <label
            className="text-sm font-semibold"
            htmlFor={`education-start-${edu.id}`}
          >
            Start Date
          </label>

          <input
            type="text"
            className={inputClasses}
            id={`education-start-${edu.id}`}
            value={edu.startDate}
            onChange={(e) =>
              dispatch(
                updateEducation({
                  id: edu.id,
                  field: "startDate",
                  value: e.target.value,
                }),
              )
            }
          />
        </div>
        {/* End Date */}
        <div className="flex-1">
          <label
            className="text-sm font-semibold"
            htmlFor={`education-end-${edu.id}`}
          >
            End Date
          </label>

          <input
            type="text"
            className={inputClasses}
            id={`education-end-${edu.id}`}
            value={edu.endDate}
            onChange={(e) =>
              dispatch(
                updateEducation({
                  id: edu.id,
                  field: "endDate",
                  value: e.target.value,
                }),
              )
            }
          />
        </div>
      </div>
      <div className="flex-1">
        <label
          className="text-sm font-semibold"
          htmlFor={`education-start-${edu.id}`}
        >
          GPA
        </label>

        <input
          type="text"
          className={inputClasses}
          id={`education-gpa-${edu.id}`}
          value={edu.gpa}
          onChange={(e) =>
            dispatch(
              updateEducation({
                id: edu.id,
                field: "gpa",
                value: e.target.value,
              }),
            )
          }
        />
      </div>

      {/* Description */}
      <div className="mt-5">
        <label className="text-sm font-semibold">Description</label>

        <div className="mt-2 space-y-2">
          {edu.points.map((point, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                className={inputClasses}
                placeholder="e.g. Graduated with honors..."
                value={point}
                onChange={(e) =>
                  dispatch(
                    updateEducationPoint({
                      id: edu.id,
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
                    removeEducationPoint({
                      id: edu.id,
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
              addEducationPoint({
                id: edu.id,
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
