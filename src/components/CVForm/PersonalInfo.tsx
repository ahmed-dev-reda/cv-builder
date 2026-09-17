import { updatePersonalInfo } from "@/lib/features/resumeSlice";
import { RootState } from "@/lib/store";
import { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

export default function PersonalInfo({
  inputClasses,

}: {
  inputClasses: string;
  
}) {
  const { personalInfo, template } = useSelector(
    (state: RootState) => state.resume,
  );
  const dispatch = useDispatch();
  // State — collapsible section visibility
  const [showPersonalInfo, setShowPersonalInfo] = useState<boolean>(false);
  return (
    <div
      className={`overflow-hidden border border-[#C3C6D7] rounded-md bg-white shadow-lg shadow-gray-300/45 transition-all ${showPersonalInfo ? "max-h-dvh" : "max-h-11"}`}
    >
      <div className="flex items-center justify-between overflow-hidden border-b border-b-[#C3C6D7] bg-[#F8F9FF] px-4 py-2">
        <div className="relative z-50 flex">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-black">
            <FaRegUser color="#0D47A1" />
            Personal Info
          </h2>
        </div>
        <button
          className={`cursor-pointer transition-all ${!showPersonalInfo && "rotate-180"}`}
          onClick={() => setShowPersonalInfo(!showPersonalInfo)}
        >
          <IoIosArrowDown size={25}></IoIosArrowDown>
        </button>
      </div>

      <div className="p-4">
        <div>
          <label className="text-sm font-semibold" htmlFor="fullname">
            Full Name
          </label>
          <input
            type="text"
            name="fullname"
            id="fullname"
            className={inputClasses}
            value={personalInfo.fullName}
            onChange={(e) => {
              dispatch(updatePersonalInfo({ fullName: e.target.value }));
            }}
          />
        </div>
        {(template === "simple" || template === "minimalist") && (
          <>
            {template === "minimalist" && (
              <div className="flex-1 basis-72 mt-2">
                <label className="text-sm font-semibold" htmlFor="website">
                  Job Title
                </label>
                <input
                  type="text"
                  name="job"
                  id="job"
                  className={inputClasses}
                  value={personalInfo.job}
                  onChange={(e) => {
                    dispatch(updatePersonalInfo({ job: e.target.value }));
                  }}
                />
              </div>
            )}
            <div className="flex-1 basis-72 my-2">
              <label className="text-sm font-semibold" htmlFor="address">
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                className={inputClasses}
                value={personalInfo.address}
                onChange={(e) => {
                  dispatch(updatePersonalInfo({ address: e.target.value }));
                }}
              />
            </div>
          </>
        )}

        <div className="flex-1 basis-72 my-2">
          <label className="text-sm font-semibold" htmlFor="phoneNumber">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            id="phoneNumber"
            className={inputClasses}
            inputMode="numeric"
            value={personalInfo.phone}
            onChange={(e) => {
              dispatch(updatePersonalInfo({ phone: e.target.value }));
            }}
          />
        </div>

        <div className="flex-1 basis-72 my-2">
          <label className="text-sm font-semibold" htmlFor="email">
            Email
          </label>
          <input
            type="text"
            name="email"
            id="email"
            className={inputClasses}
            value={personalInfo.email}
            onChange={(e) => {
              dispatch(updatePersonalInfo({ email: e.target.value }));
            }}
          />
        </div>
        <div className="flex-1 basis-72">
          <label className="text-sm font-semibold" htmlFor="website">
            Website
          </label>
          <input
            type="text"
            name="website"
            id="website"
            className={inputClasses}
            value={personalInfo.website}
            onChange={(e) => {
              dispatch(updatePersonalInfo({ website: e.target.value }));
            }}
          />
        </div>
      </div>
    </div>
  );
}
