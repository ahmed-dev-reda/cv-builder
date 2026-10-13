"use client";

import * as React from "react";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "@/lib/store";
import { addExperience } from "@/lib/features/resumeSlice";
import ExperienceItem from "./ExperienceItem";
import { FaPlus } from "react-icons/fa";
import { SortableProvider } from "../dnd/SortableProvider";
import { SortableItem } from "../dnd/SortableItem";

export default function Experience({
  inputClasses,
  children,
}: {
  inputClasses: string;
  children: React.ReactNode;
}) {
  const state = useSelector((state: RootState) => state.resume);
  const dispatch = useDispatch();
  const [showExperiences, setShowExperiences] = useState<boolean>(false);

  function createNewExperience() {
    dispatch(
      addExperience({
        id: uuidv4(),
        jobTitle: "",
        company: "",
        startDate: "",
        endDate: "",
        points: [],
      }),
    );
  }

  const experienceIds = state.experience.map((exp) => exp.id);

  const handleReorder = (newOrder: string[]) => {
    const newExperience = newOrder.map((id) =>
      state.experience.find((exp) => exp.id === id),
    ).filter(Boolean);

    dispatch({
      type: "resume/setExperience",
      payload: newExperience,
    });
  };

  return (
    <div>
      <div
        className={`mt-4 overflow-hidden border border-border rounded-lg shadow-sm transition-all ${showExperiences ? "max-h-dvh" : "max-h-11"}`}
      >
        <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2">
          {children}
          <button
            className={`cursor-pointer transition-all ${!showExperiences && "rotate-180"}`}
            onClick={() => setShowExperiences(!showExperiences)}
          >
            <IoIosArrowDown className="h-5 w-5" />
          </button>
        </div>
        <div className="bg-surface p-4">
          <SortableProvider id="experience-entries" items={experienceIds} onReorder={handleReorder}>
            {state.experience.map((exp) => (
              <SortableItem key={exp.id} id={exp.id}>
                <ExperienceItem
                  exp={exp}
                  inputClasses={inputClasses}
                />
              </SortableItem>
            ))}
          </SortableProvider>
          <button
            className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-primary-200 p-1 text-center text-lg font-semibold text-primary transition hover:bg-primary-50"
            onClick={createNewExperience}
          >
            <FaPlus className="h-4 w-4" /> Add Experience
          </button>
        </div>
      </div>
    </div>
  );
}
