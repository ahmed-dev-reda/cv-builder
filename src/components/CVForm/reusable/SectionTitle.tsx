"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { CgCheck } from "react-icons/cg";
import { GoPencil } from "react-icons/go";
import { TbTrash } from "react-icons/tb";

import { updateSectionName } from "@/lib/features/resumeSlice";
import { IconType } from "react-icons";

type Section = {
  id: number;
  name: string;
};

type SectionTitleProps = {
  section: Section;
  Icon: IconType;
};
export default function SectionTitle({ section, Icon }: SectionTitleProps) {
  const dispatch = useDispatch();

  const [isEdit, setIsEdit] = useState(false);
  const [sectionName, setSectionName] = useState(section.name);

  const handleUpdate = () => {
    if (!sectionName.trim()) return;

    dispatch(
      updateSectionName({
        id: section.id,
        name: sectionName.trim(),
      }),
    );

    setIsEdit(false);
  };

  return (
    <>
      {isEdit ? (
        <div className="flex flex-1 justify-between text-lg font-semibold">
          <input
            type="text"
            id={`sectionName-${section.id}`}
            className="flex-1 indent-2 focus:outline-none focus:ring focus:ring-gray-400"
            value={sectionName}
            onChange={(event) => setSectionName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleUpdate();
              }
            }}
            autoFocus
          />

          <button
            type="button"
            className="cursor-pointer"
            onClick={handleUpdate}
          >
            <CgCheck size={28} />
          </button>
        </div>
      ) : (
        <h2 className="flex flex-1 items-center gap-2 text-lg font-semibold">
          <Icon color="#0D47A1" />
          {section.name}

          <button
            type="button"
            className="cursor-pointer"
            onClick={() => {
              setSectionName(section.name);
              setIsEdit(true);
            }}
          >
            <GoPencil />
          </button>
        </h2>
      )}
    </>
  );
}
