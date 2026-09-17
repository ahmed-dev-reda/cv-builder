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
import MoreSections from "../CVForm/MoreSections";
import Skills from "../CVForm/SkillsField";

// Icons
import { AiOutlineAlignLeft } from "react-icons/ai";
import { LuBriefcaseBusiness } from "react-icons/lu";
import { SlGraduation } from "react-icons/sl";
import { LuBrain } from "react-icons/lu";
import SectionTitle from "../CVForm/reusable/SectionTitle";
// Resume data entry form — dispatches Redux updates and persists to localStorage
export default function CVForm() {
  const state = useSelector((state: RootState) => state.resume);
  const dispatch = useDispatch();

  const [hydrated, setHydrated] = useState(false);
  const {
    education,
    experience,
    personalInfo,
    skills,
    summary,
    color,
    sectionsTitle,
  } = state;

  // Constants

  const inputClasses =
    "block w-full mt-0.5 p-1.5 indent-2 border border-gray-300 rounded-sm bg-gray-50/99 transition-all focus:outline-none focus:border-[#0D47A1]";
  const [progress, setProgress] = useState<number>(0);

  // Completion score mapped to a 0–100 percentage (max progress = 320)
  const percentage = (progress * 100) / 320;

  // Recalculate profile completion whenever resume fields change
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

      if (skills.length > 0) {
        newProgress += 10;
      }

      setProgress(newProgress);
    }
    trackingProgress();
  }, [
    education.length,
    experience.length,
    personalInfo.address.length,
    personalInfo.email.length,
    personalInfo.fullName.length,
    personalInfo.phone.length,
    personalInfo.website.length,
    skills.length,
    state,
    summary,
    sectionsTitle,
  ]);

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

  // Persist entire resume state to localStorage after initial hydration
  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem("userInfo", JSON.stringify(state));
  }, [state, hydrated]);

  const editableSections = [Summary, Experience, Education, Skills];
  const arrayOfIcons = [
    AiOutlineAlignLeft,
    LuBriefcaseBusiness,
    SlGraduation,
    LuBrain,
  ];
  // Render
  return (
    <>
      <Progress percentage={percentage} color={color} />
      <motion.form
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        onSubmit={(e) => e.preventDefault()}
        className="flex-1 min-w-100 xl:h-[80vh] max-xl:pb-4 overflow-auto p-4"
      >
        <PersonalInfo inputClasses={inputClasses} />
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
        <MoreSections />
        <button
          className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm border-2 border-dashed border-[#B4C5FF] p-1 text-center text-lg font-semibold text-[#004AC6]"
          onClick={() => {
            dispatch(
              addMoreSection({
                id: uuidv4(),
                sectionName: "New Section",
                body: [],
              }),
            );
          }}
        >
          <FaPlus size={15} /> Add Section
        </button>
      </motion.form>
    </>
  );
}
