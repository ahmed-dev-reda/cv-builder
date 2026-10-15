import simple from "@/thumbnails/simple.jpg";
import minimalist from "@/thumbnails/minimalist.jpg";
import classicOne from "@/thumbnails/classic_one.jpg";
import classicTwo from "@/thumbnails/classic_two.png";
import minimalistTwo from "@/thumbnails/minimalist_two.png";
import classicThree from "@/thumbnails/classic_three.png";
import classicFour from "@/thumbnails/classic_four.png";
import softwareEngineeringLead from "@/thumbnails/software_engineering_lead.png";
import experiencedHireV6 from "@/thumbnails/experienced_hire_v6.png";
import recentGraduateV3 from "@/thumbnails/recent_graduate_v3.png";
import recentGraduateV4 from "@/thumbnails/recent_graduate_v4.png";
import technicalProgramManager from "@/thumbnails/technical_program_manager.png";
import { TemplateType } from "@/lib/features/resumeSlice";
import { StaticImageData } from "next/image";

export type Template = {
  name: TemplateType;
  image: StaticImageData;
};

export const templates: Template[] = [
  { name: "simple", image: simple },
  { name: "minimalist", image: minimalist },
  { name: "classicOne", image: classicOne },
  { name: "classicTwo", image: classicTwo },
  { name: "minimalistTwo", image: minimalistTwo },
  { name: "classicThree", image: classicThree },
  { name: "classicFour", image: classicFour },
  { name: "softwareEngineeringLead", image: softwareEngineeringLead },
  { name: "experiencedHireV6", image: experiencedHireV6 },
  { name: "recentGraduateV3", image: recentGraduateV3 },
  { name: "recentGraduateV4", image: recentGraduateV4 },
  { name: "technicalProgramManager", image: technicalProgramManager },
];
