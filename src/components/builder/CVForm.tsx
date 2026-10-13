"use client";

import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { FaPlus } from "react-icons/fa";
import { motion } from "motion/react";

import { addMoreSection, setSectionOrder } from "@/lib/features/resumeSlice";
import { RootState } from "@/lib/store";
import { useAppDispatch } from "@/lib/hooks";

import Progress from "../CVForm/CVHeader";
import PersonalInfo from "../CVForm/PersonalInfo";
import Summary from "../CVForm/Summary";
import Experience from "../CVForm/Experience";
import Education from "../CVForm/Education";
import Projects from "../CVForm/Projects";
import MoreSections from "../CVForm/MoreSections";
import Skills from "../CVForm/SkillsField";

import { AiOutlineAlignLeft } from "react-icons/ai";
import { LuBriefcaseBusiness } from "react-icons/lu";
import { SlGraduation } from "react-icons/sl";
import { LuBrain } from "react-icons/lu";
import { LuFolderKanban } from "react-icons/lu";

import SectionTitle from "../CVForm/reusable/SectionTitle";
import { SortableProvider } from "../dnd/SortableProvider";
import { SortableItem } from "../dnd/SortableItem";
import type { IconType } from "react-icons";

import type { OrderableSectionId } from "@/lib/features/resumeSlice";

// Section registry — maps stable section IDs to their components and icons.
// Skills is fixed (always last) and excluded from drag-and-drop ordering.
const sectionRegistry: Record<
  OrderableSectionId,
  { component: React.ElementType; icon: IconType }
> = {
  summary: { component: Summary, icon: AiOutlineAlignLeft },
  experience: { component: Experience, icon: LuBriefcaseBusiness },
  education: { component: Education, icon: SlGraduation },
  projects: { component: Projects, icon: LuFolderKanban },
};

export default function CVForm() {
  const state = useSelector((state: RootState) => state.resume);
  const dispatch = useAppDispatch();

  const {
    education,
    experience,
    projects,
    personalInfo,
    skills,
    summary,
    color,
    moreSections,
  } = state;

  // --------------------------------
  // Input classes
  // --------------------------------

  const inputClasses =
    "block w-full mt-0.5 p-1.5 indent-2 border border-border rounded-md bg-gray-50/50 transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm";

  // --------------------------------
  // Progress
  // --------------------------------

  const [progress, setProgress] = useState<number>(0);

  const percentage = (progress * 100) / 320;

  useEffect(() => {
    function trackingProgress() {
      let newProgress = 0;

      if (personalInfo.fullName.length > 4) {
        newProgress += 5;
      }

      if (personalInfo.address.length > 8) {
        newProgress += 5;
      }

      if (personalInfo.email.length > 1) {
        newProgress += 5;
      }

      if (personalInfo.phone.length > 10) {
        newProgress += 5;
      }

      if (personalInfo.website.length > 2) {
        newProgress += 5;
      }

      if (summary.trim().length > 20) {
        newProgress += 15;
      }

      if (experience.length > 0) {
        newProgress += 25;
      }

      if (education.length > 0) {
        newProgress += 15;
      }

      if (projects.length > 0) {
        newProgress += 15;
      }

      if (skills.length > 0) {
        newProgress += 10;
      }

      setProgress(newProgress);
    }

    trackingProgress();
  }, [
    education.length,
    experience.length,
    projects.length,
    personalInfo.address.length,
    personalInfo.email.length,
    personalInfo.fullName.length,
    personalInfo.phone.length,
    personalInfo.website.length,
    skills.length,
    summary,
  ]);

  // --------------------------------
  // Additional Sections
  // --------------------------------

  const availableSections = [
    "Certifications",
    "Languages",
    "Courses",
    "Awards",
    "Volunteering",
    "Interests",
    "Hobbies",
  ];

  // --------------------------------
  // Check if section already exists
  // --------------------------------

  const isSectionAdded = (sectionName: string) => {
    return moreSections.some(
      (section) =>
        section.sectionName.toLowerCase() === sectionName.toLowerCase(),
    );
  };

  // --------------------------------
  // Add Section
  // --------------------------------

  const handleAddSection = (sectionName: string) => {
    if (isSectionAdded(sectionName)) return;

    dispatch(
      addMoreSection({
        id: uuidv4(),
        sectionName,
        body: [],
        sectionType: "secondary",
      }),
    );
  };

  // --------------------------------
  // Drag and Drop for sections
  // --------------------------------

  const sectionIds = state.sectionOrder;

  const handleSectionReorder = useCallback(
    (newOrder: string[]) => {
      dispatch(setSectionOrder(newOrder as OrderableSectionId[]));
    },
    [dispatch],
  );

  // --------------------------------
  // Render
  // --------------------------------

  return (
    <>
      <Progress percentage={percentage} color={color} />

      <motion.form
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        onSubmit={(e) => e.preventDefault()}
        className="min-w-100 max-xl:pb-4 flex-1 overflow-auto p-4"
      >
        {/* Personal Information */}
        <PersonalInfo inputClasses={inputClasses} />

        {/* Main Sections with Drag and Drop — rendered in sectionOrder */}
        <SortableProvider
          id="cv-sections"
          items={sectionIds}
          onReorder={handleSectionReorder}
        >
          {sectionIds.map((sectionId) => {
            const { component: Component, icon: Icon } =
              sectionRegistry[sectionId];

            return (
              <SortableItem key={sectionId} id={sectionId}>
                <Component inputClasses={inputClasses}>
                  <SectionTitle
                    sectionId={sectionId}
                    section={state.sectionsTitle[sectionId]}
                    Icon={Icon}
                  />
                </Component>
              </SortableItem>
            );
          })}
        </SortableProvider>

        {/* Skills — fixed position (always last), excluded from ordering */}

        <Skills>
          <SectionTitle
            sectionId="skills"
            section={state.sectionsTitle.skills}
            Icon={LuBrain}
          />
        </Skills>

        {/* Added Additional Sections */}
        <MoreSections />

        {/* -------------------------------- */}
        {/* Add Section Buttons */}
        {/* -------------------------------- */}

        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold text-muted">
            Add More Sections
          </p>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {availableSections.map((sectionName) => {
              const exists = isSectionAdded(sectionName);

              if (exists) return null;

              return (
                <button
                  key={sectionName}
                  type="button"
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-primary-200 p-2 text-sm font-semibold text-primary transition hover:bg-primary-50"
                  onClick={() => handleAddSection(sectionName)}
                >
                  <FaPlus className="h-3 w-3" />
                  {sectionName}
                </button>
              );
            })}
          </div>
        </div>
      </motion.form>
    </>
  );
}
