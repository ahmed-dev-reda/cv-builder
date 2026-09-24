import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// --- Types ---

export interface Education {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  points: string[];
  gpa?: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  points: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
}

export type Single = {
  id: string;
  name: string;
};

// Body الخاص بالـ sections الإضافية
export type SectionBody = Single | Project;

export interface NewSection {
  id: string;
  sectionName: string;
  sectionType: "primary" | "secondary";
  body: SectionBody[];
}

export interface NewType extends NewSection {
  type: "ADD" | "DELETE";
}

export type Body = {
  id: string;
  body: SectionBody;
  type: "ADD" | "DELETE";
};

export type SectionName = {
  id: number;
  name: string;
};

export type CVPage = {
  id: number;
  sections: NewSection[];
};

export type TemplateType =
  | "simple"
  | "minimalist"
  | "classicOne"
  | "classicTwo"
  | "minimalistTwo"
  | "classicThree"
  | "classicFour";

// --- Initial state ---

const initialState: ResumeState = {
  color: "#8055a2",

  personalInfo: {
    fullName: "",
    job: "",
    email: "",
    phone: "",
    address: "",
    website: "",
  },

  summary: "",

  experience: [],

  education: [],

  skills: [],

  template: "simple",
  projects: [],
  moreSections: [],

  sectionsTitle: [
    { id: 1, name: "Professional Summary" },
    { id: 2, name: "Work Experience" },
    { id: 3, name: "Educations" },
    { id: 4, name: "Projects" },
    { id: 5, name: "Skills" },
  ],

  font: "inter",
};

export type ResumeState = {
  color: string;

  sectionsTitle: SectionName[];

  personalInfo: {
    fullName: string;
    job?: string;
    email: string;
    phone: string;
    address: string;
    website: string;
  };

  summary: string;

  experience: Experience[];

  education: Education[];

  skills: Single[];

  template: TemplateType;
  projects: Project[];

  moreSections: NewSection[];

  font: string;
};

// --- Slice ---

const resumeSlice = createSlice({
  name: "resume",

  initialState,

  reducers: {
    // --------------------------------
    // Theme
    // --------------------------------

    setColor: (state, action: PayloadAction<ResumeState["color"]>) => {
      state.color = action.payload;
    },

    // --------------------------------
    // Resume
    // --------------------------------

    setResume: (state, action: PayloadAction<ResumeState>) => {
      return action.payload;
    },

    setTemplate: (state, action: PayloadAction<TemplateType>) => {
      state.template = action.payload;

      localStorage.setItem("userInfo", JSON.stringify(state));
    },

    // --------------------------------
    // Personal Info
    // --------------------------------

    updatePersonalInfo: (
      state,
      action: PayloadAction<Partial<ResumeState["personalInfo"]>>,
    ) => {
      state.personalInfo = {
        ...state.personalInfo,
        ...action.payload,
      };
    },

    // --------------------------------
    // Experience
    // --------------------------------

    addExperience: (state, action: PayloadAction<Experience>) => {
      state.experience.push(action.payload);
    },

    addExperiencePoint: (
      state,
      action: PayloadAction<{
        id: string;
        point: string;
      }>,
    ) => {
      const experience = state.experience.find(
        (exp) => exp.id === action.payload.id,
      );

      if (experience) {
        experience.points.push(action.payload.point);
      }
    },

    updateExperiencePoint: (
      state,
      action: PayloadAction<{
        id: string;
        pointIndex: number;
        value: string;
      }>,
    ) => {
      const experience = state.experience.find(
        (exp) => exp.id === action.payload.id,
      );

      if (experience) {
        experience.points[action.payload.pointIndex] = action.payload.value;
      }
    },

    removeExperiencePoint: (
      state,
      action: PayloadAction<{
        id: string;
        pointIndex: number;
      }>,
    ) => {
      const experience = state.experience.find(
        (exp) => exp.id === action.payload.id,
      );

      if (experience) {
        experience.points.splice(action.payload.pointIndex, 1);
      }
    },

    updateExperience: (
      state,
      action: PayloadAction<{
        id: string;
        field: keyof Omit<Experience, "id" | "points">;
        value: string;
      }>,
    ) => {
      const { id, field, value } = action.payload;

      const experience = state.experience.find((exp) => exp.id === id);

      if (experience) {
        experience[field] = value;
      }
    },

    removeExperience: (state, action: PayloadAction<string>) => {
      state.experience = state.experience.filter(
        (exp) => exp.id !== action.payload,
      );
    },

    // --------------------------------
    // Education
    // --------------------------------

    addEducation: (state, action: PayloadAction<Education>) => {
      state.education.push(action.payload);
    },

    addEducationPoint: (
      state,
      action: PayloadAction<{
        id: string;
        point: string;
      }>,
    ) => {
      const education = state.education.find(
        (edu) => edu.id === action.payload.id,
      );

      if (education) {
        education.points.push(action.payload.point);
      }
    },

    updateEducationPoint: (
      state,
      action: PayloadAction<{
        id: string;
        pointIndex: number;
        value: string;
      }>,
    ) => {
      const education = state.education.find(
        (edu) => edu.id === action.payload.id,
      );

      if (education) {
        education.points[action.payload.pointIndex] = action.payload.value;
      }
    },

    removeEducationPoint: (
      state,
      action: PayloadAction<{
        id: string;
        pointIndex: number;
      }>,
    ) => {
      const education = state.education.find(
        (edu) => edu.id === action.payload.id,
      );

      if (education) {
        education.points.splice(action.payload.pointIndex, 1);
      }
    },

    updateEducation: (
      state,
      action: PayloadAction<{
        id: string;
        field: keyof Omit<Education, "id" | "points">;
        value: string;
      }>,
    ) => {
      const { id, field, value } = action.payload;

      const education = state.education.find((edu) => edu.id === id);

      if (education) {
        education[field] = value;
      }
    },

    removeEducation: (state, action: PayloadAction<string>) => {
      state.education = state.education.filter(
        (edu) => edu.id !== action.payload,
      );
    },

    // --------------------------------
    // Skills
    // --------------------------------

    setSkills: (state, action: PayloadAction<Single>) => {
      state.skills.push(action.payload);
    },

    removeSkill: (state, action: PayloadAction<string>) => {
      state.skills = state.skills.filter(
        (skill) => skill.id !== action.payload,
      );
    },

    // --------------------------------
    // Summary
    // --------------------------------

    updateSummary: (state, action: PayloadAction<string>) => {
      state.summary = action.payload;
    },

    // --------------------------------
    // More Sections
    // --------------------------------

    addMoreSection: (state, action: PayloadAction<NewSection>) => {
      state.moreSections.push(action.payload);
    },

    updateSection: (state, action: PayloadAction<NewType>) => {
      switch (action.payload.type) {
        case "ADD": {
          const section = state.moreSections.find(
            (sec) => sec.id === action.payload.id,
          );

          if (section) {
            section.sectionName = action.payload.sectionName;
          }

          break;
        }

        case "DELETE": {
          state.moreSections = state.moreSections.filter(
            (sec) => sec.id !== action.payload.id,
          );

          break;
        }
      }
    },

    // --------------------------------
    // Section Body
    // --------------------------------

    updateSectionBody: (state, action: PayloadAction<Body>) => {
      const { id, body, type } = action.payload;

      const section = state.moreSections.find((section) => section.id === id);

      if (!section) return;

      if (type === "ADD") {
        section.body.push(body);
      }

      if (type === "DELETE") {
        section.body = section.body.filter((item) => item.id !== body.id);
      }
    },

    // --------------------------------
    // Section Type
    // --------------------------------

    updateSectionType: (
      state,
      action: PayloadAction<{
        id: string;
        sectionType: "primary" | "secondary";
      }>,
    ) => {
      const { id, sectionType } = action.payload;

      state.moreSections = state.moreSections.map((section) => {
        if (section.id === id) {
          section.sectionType = sectionType;
        }

        return section;
      });
    },

    // --------------------------------
    // Section Name
    // --------------------------------

    updateSectionName: (state, action: PayloadAction<SectionName>) => {
      const { id, name } = action.payload;

      state.sectionsTitle = state.sectionsTitle.map((title) => {
        if (title.id === id) {
          title.name = name;
        }

        return title;
      });
    },

    // --------------------------------
    // Font
    // --------------------------------

    setFont: (state, action: PayloadAction<string>) => {
      state.font = action.payload;
    },
    // --------------------------------
    // Projects
    // --------------------------------

    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },

    updateProject: (
      state,
      action: PayloadAction<{
        id: string;
        data: Partial<Project>;
      }>,
    ) => {
      const project = state.projects.find(
        (project) => project.id === action.payload.id,
      );

      if (project) {
        Object.assign(project, action.payload.data);
      }
    },

    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(
        (project) => project.id !== action.payload,
      );
    },

    updateProjectTechnologies: (
      state,
      action: PayloadAction<{
        id: string;
        technologies: string[];
      }>,
    ) => {
      const project = state.projects.find(
        (project) => project.id === action.payload.id,
      );

      if (project) {
        project.technologies = action.payload.technologies;
      }
    },
  },
});

// --- Actions ---

export const {
  addEducation,
  addEducationPoint,
  addExperience,
  addExperiencePoint,

  addMoreSection,

  removeEducation,
  removeEducationPoint,

  removeExperience,
  removeExperiencePoint,

  removeSkill,

  setColor,
  setResume,
  setSkills,
  setTemplate,

  updateEducation,
  updateEducationPoint,

  updateExperience,
  updateExperiencePoint,

  updatePersonalInfo,

  updateSection,
  updateSectionBody,
  updateSectionType,

  updateSummary,
  updateSectionName,

  setFont,

  addProject,
  updateProject,
  deleteProject,
  updateProjectTechnologies,
} = resumeSlice.actions;

export default resumeSlice.reducer;
