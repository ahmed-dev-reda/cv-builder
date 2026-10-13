"use client";

import * as React from "react";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "@/lib/store";
import { addEducation } from "@/lib/features/resumeSlice";
import EducationItem from "./EducationItem";
import { FaPlus } from "react-icons/fa";
import { SortableProvider } from "../dnd/SortableProvider";
import { SortableItem } from "../dnd/SortableItem";

export default function Education({
  inputClasses,
  children,
}: {
  inputClasses: string;
  children: React.ReactNode;
}) {
  const state = useSelector((state: RootState) => state.resume);
  const dispatch = useDispatch();

  const [showEducations, setShowEducations] = useState<boolean>(false);

  function createNewEducation() {
    dispatch(
      addEducation({
        id: uuidv4(),
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
        points: [],
      }),
    );
  }

  const educationIds = state.education.map((edu) => edu.id);

  const handleReorder = (newOrder: string[]) => {
    const newEducation = newOrder.map((id) =>
      state.education.find((edu) => edu.id === id),
    ).filter(Boolean);

    dispatch({
      type: "resume/setEducation",
      payload: newEducation,
    });
  };

  return (
    <div>
      <div
        className={`mt-4 overflow-hidden border border-border rounded-lg shadow-sm transition-all ${showEducations ? "max-h-dvh" : "max-h-11"}`}
      >
        <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2">
          {children}
          <button
            className={`cursor-pointer transition-all ${!showEducations && "rotate-180"}`}
            onClick={() => setShowEducations(!showEducations)}
          >
            <IoIosArrowDown className="h-5 w-5" />
          </button>
        </div>
        <div className="bg-surface p-4">
          <SortableProvider id="education-entries" items={educationIds} onReorder={handleReorder}>
            {state.education.map((edu) => (
              <SortableItem key={edu.id} id={edu.id}>
                <EducationItem edu={edu} inputClasses={inputClasses} />
              </SortableItem>
            ))}
          </SortableProvider>
          <button
            className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-primary-200 p-1 text-center text-lg font-semibold text-primary transition hover:bg-primary-50"
            onClick={createNewEducation}
          >
            <FaPlus className="h-4 w-4" /> Add Education
          </button>
        </div>
      </div>
    </div>
  );
}
