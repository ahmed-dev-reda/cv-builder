"use client";

import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

import { setResume, addMoreSection } from "@/lib/features/resumeSlice";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";

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

export default function CVForm() {
  const state = useSelector((state: RootState) => state.resume);

  const dispatch = useDispatch();

  const [hydrated, setHydrated] = useState(false);

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
    "block w-full mt-0.5 p-1.5 indent-2 border border-gray-300 rounded-sm bg-gray-50/99 transition-all focus:outline-none focus:border-[#0D47A1]";

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
  // Load localStorage
  // --------------------------------

  useEffect(() => {
    function loadData() {
      const savedUser = localStorage.getItem("userInfo");

      if (savedUser) {
        try {
          const data = JSON.parse(savedUser);

          dispatch(setResume(data));
        } catch (error) {
          console.error("Failed to load resume:", error);
        }
      }

      setHydrated(true);
    }

    loadData();
  }, [dispatch]);

  // --------------------------------
  // Save localStorage
  // --------------------------------

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem("userInfo", JSON.stringify(state));
  }, [state, hydrated]);

  // --------------------------------
  // Main Sections
  // --------------------------------

  const editableSections = [Summary, Experience, Education, Projects, Skills];

  const arrayOfIcons = [
    AiOutlineAlignLeft,
    LuBriefcaseBusiness,
    SlGraduation,
    LuFolderKanban,
    LuBrain,
  ];

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

        {/* Main Sections */}
        {editableSections.map((Section, index) => (
          <Section
            key={index}
            inputClasses={inputClasses}
            section={state.sectionsTitle[index]}
          >
            <SectionTitle
              section={state.sectionsTitle[index]}
              Icon={arrayOfIcons[index]}
            />
          </Section>
        ))}

        {/* Added Additional Sections */}
        <MoreSections />

        {/* -------------------------------- */}
        {/* Add Section Buttons */}
        {/* -------------------------------- */}

        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold text-gray-600">
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
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-sm border-2 border-dashed border-[#B4C5FF] p-2 text-sm font-semibold text-[#004AC6] transition hover:bg-[#F3F6FF]"
                  onClick={() => handleAddSection(sectionName)}
                >
                  <FaPlus size={12} />

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
