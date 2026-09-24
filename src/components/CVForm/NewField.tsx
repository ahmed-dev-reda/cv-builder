"use client";

import {
  NewSection,
  Project,
  updateSection,
  updateSectionBody,
  updateSectionType,
} from "@/lib/features/resumeSlice";
import { useState } from "react";
import { CgCheck } from "react-icons/cg";
import { FaRegTrashAlt } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import { TbTrash } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";

interface NewFieldProps {
  info: NewSection;
}

export default function NewField({ info }: NewFieldProps) {
  const dispatch = useDispatch();

  const [showSections, setShowSection] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // Simple field
  const [title, setTitle] = useState<string>("");

  // Section name
  const [sectionName, setSectionName] = useState<string>("");

  // Project fields
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectTechnologies, setProjectTechnologies] = useState("");
  const [projectUrl, setProjectUrl] = useState("");

  function updateSections(type: "ADD" | "DELETE") {
    dispatch(
      updateSection({
        id: info.id,
        sectionName,
        body: info.body,
        type,
        sectionType: info.sectionType,
      }),
    );

    setIsEdit(false);
  }

  function addSimpleContent() {
    if (!title.trim()) return;

    dispatch(
      updateSectionBody({
        id: info.id,
        body: {
          id: uuidv4(),
          name: title.trim(),
        },
        type: "ADD",
      }),
    );

    setTitle("");
  }

  function addProject() {
    if (!projectName.trim()) return;

    const project: Project = {
      id: uuidv4(),
      name: projectName.trim(),
      description: projectDescription.trim(),
      technologies: projectTechnologies
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean),
      url: projectUrl.trim() || undefined,
    };

    dispatch(
      updateSectionBody({
        id: info.id,
        body: project,
        type: "ADD",
      }),
    );

    setProjectName("");
    setProjectDescription("");
    setProjectTechnologies("");
    setProjectUrl("");
  }

  const getPlaceholder = (sectionName: string) => {
    switch (sectionName.toLowerCase()) {
      case "languages":
        return "e.g. English";

      case "skills":
        return "e.g. React, Next.js, TypeScript";

      case "certifications":
        return "e.g. AWS Certified Developer";

      case "hobbies":
        return "e.g. Reading";

      case "awards":
        return "e.g. Employee of the Month";

      case "interests":
        return "e.g. Technology";

      case "courses":
        return "e.g. Advanced React Course";

      case "volunteering":
        return "e.g. Volunteer at Red Crescent";

      default:
        return `e.g. Enter ${sectionName.toLowerCase()}`;
    }
  };

  const isProjects = info.sectionName.toLowerCase() === "projects";

  return (
    <div
      className={`mt-4 flex-1 basis-sm overflow-hidden rounded-md border border-[#C3C6D7] shadow-lg shadow-gray-300/45 transition-all ${
        showSections ? "max-h-dvh" : "max-h-11"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-b-[#C3C6D7] bg-[#F8F9FF] px-4 py-2">
        {isEdit ? (
          <div className="flex flex-1 justify-between text-lg font-semibold">
            <input
              type="text"
              id={`sectionName-${info.id}`}
              className="indent-2 focus:outline-none focus:ring focus:ring-gray-400"
              value={sectionName}
              onChange={(event) => setSectionName(event.target.value)}
            />

            <button type="button" onClick={() => updateSections("ADD")}>
              <CgCheck size={28} />
            </button>
          </div>
        ) : (
          <>
            <h2 className="flex flex-1 items-center gap-2 text-lg font-semibold">
              {info.sectionName}

              {/* Delete */}
              <button
                type="button"
                className="cursor-pointer"
                onClick={() => updateSections("DELETE")}
              >
                <TbTrash />
              </button>
            </h2>

            {/* Collapse */}
            <button
              type="button"
              className={`cursor-pointer transition-all ${
                !showSections && "rotate-180"
              }`}
              onClick={() => setShowSection(!showSections)}
            >
              <IoIosArrowDown size={25} />
            </button>
          </>
        )}
      </div>

      {/* Content */}
      <div className="bg-white p-4">
        {/* ================= PROJECTS ================= */}
        {isProjects ? (
          <div className="space-y-3">
            {/* Project Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Project Name
              </label>

              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. E-commerce Website"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-[#0D47A1] focus:ring-2 focus:ring-[#0D47A1]/10"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Describe your project..."
                rows={3}
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-[#0D47A1] focus:ring-2 focus:ring-[#0D47A1]/10"
              />
            </div>

            {/* Technologies */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Technologies
              </label>

              <input
                type="text"
                value={projectTechnologies}
                onChange={(e) => setProjectTechnologies(e.target.value)}
                placeholder="e.g. React, Next.js, TypeScript"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-[#0D47A1] focus:ring-2 focus:ring-[#0D47A1]/10"
              />

              <p className="mt-1 text-xs text-gray-400">
                Separate technologies with commas
              </p>
            </div>

            {/* Project URL */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Project URL
              </label>

              <input
                type="url"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-[#0D47A1] focus:ring-2 focus:ring-[#0D47A1]/10"
              />
            </div>

            {/* Add Project */}
            <button
              type="button"
              onClick={addProject}
              className="w-full rounded-lg bg-[#0D47A1] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#093575]"
            >
              Add Project
            </button>
          </div>
        ) : (
          /* ================= SIMPLE SECTIONS ================= */
          <div className="flex w-full overflow-hidden rounded-lg border border-gray-300 transition-all focus-within:border-[#0D47A1] focus-within:ring-2 focus-within:ring-[#0D47A1]/10">
            <input
              type="text"
              name="sectionContent"
              id={`sectionContent-${info.id}`}
              placeholder={getPlaceholder(info.sectionName)}
              className="min-w-0 flex-1 px-3 py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  addSimpleContent();
                }
              }}
            />

            <button
              type="button"
              className="cursor-pointer bg-[#0D47A1] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#093575]"
              onClick={addSimpleContent}
            >
              Add
            </button>
          </div>
        )}

        {/* ================= ADDED CONTENT ================= */}
        {info.body.length > 0 ? (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
              Added Content
            </p>

            <ul className="flex flex-wrap gap-2">
              {info.body.map((item) => {
                const project = item as Project;

                return (
                  <li
                    key={item.id}
                    className={`group relative ${
                      isProjects
                        ? "w-full rounded-lg border border-[#C7DAFA] bg-[#E8F0FE] p-4"
                        : "inline-flex items-center gap-1.5 rounded-full border border-[#C7DAFA] bg-[#E8F0FE] px-3 py-1.5 text-sm font-medium text-[#173B69]"
                    }`}
                  >
                    {isProjects ? (
                      <div className="pr-6">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-[#173B69]">
                            {project.name}
                          </h3>

                          <button
                            type="button"
                            className="absolute right-3 top-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                            onClick={() => {
                              dispatch(
                                updateSectionBody({
                                  id: info.id,
                                  body: {
                                    id: item.id,
                                    name: "",
                                  },
                                  type: "DELETE",
                                }),
                              );
                            }}
                          >
                            <FaRegTrashAlt size={12} />
                          </button>
                        </div>

                        {project.description && (
                          <p className="mt-2 text-sm text-gray-600">
                            {project.description}
                          </p>
                        )}

                        {project.technologies?.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {project.technologies.map((tech, index) => (
                              <span
                                key={index}
                                className="rounded-full bg-white px-2 py-1 text-xs text-[#173B69]"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-block text-xs text-[#0D47A1] underline"
                          >
                            View Project
                          </a>
                        )}
                      </div>
                    ) : (
                      <>
                        <span>{item.name}</span>

                        <button
                          type="button"
                          className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                          onClick={() => {
                            dispatch(
                              updateSectionBody({
                                id: info.id,
                                body: {
                                  id: item.id,
                                  name: "",
                                },
                                type: "DELETE",
                              }),
                            );
                          }}
                        >
                          <FaRegTrashAlt size={11} />
                        </button>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <p className="mt-4 text-center text-sm text-gray-400">Add Content</p>
        )}
      </div>
    </div>
  );
}
