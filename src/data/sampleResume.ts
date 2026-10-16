import type { ResumeState } from "@/lib/features/resumeSlice";

// Realistic sample data for testing all templates.
// Template / color / font are preserved from the current state when applied
// (see CVForm fill handler) so you can preview any design with one click.
export const sampleResume: Omit<ResumeState, "template" | "color" | "font"> = {
  personalInfo: {
    fullName: "Ahmed Hassan",
    job: "Senior Software Engineer",
    email: "ahmed.hassan@example.com",
    phone: "+20 100 234 5678",
    address: "Cairo, Egypt",
    website: "ahmedhassan.dev",
  },

  summary:
    "Senior Software Engineer with 6+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud infrastructure. Led teams of up to 5 engineers and delivered products used by 200K+ users.",

  experience: [
    {
      id: "sample-exp-1",
      jobTitle: "Senior Software Engineer",
      company: "TechCorp Solutions",
      location: "Cairo, Egypt",
      startDate: "Jan 2022",
      endDate: "Present",
      points: [
        "Led a team of 5 engineers to rebuild the customer dashboard, improving load time by 60%",
        "Architected microservices migration that reduced infrastructure costs by 35%",
        "Mentored 8 junior developers through code reviews and pair programming",
      ],
    },
    {
      id: "sample-exp-2",
      jobTitle: "Frontend Developer",
      company: "Digital Agency",
      location: "Alexandria, Egypt",
      startDate: "Jun 2019",
      endDate: "Dec 2021",
      points: [
        "Built 15+ responsive client websites with React and Next.js",
        "Improved SEO scores from 60 to 95+ across all client projects",
        "Integrated payment gateways (Stripe, PayPal) for e-commerce clients",
      ],
    },
  ],

  education: [
    {
      id: "sample-edu-1",
      degree: "B.Sc. Computer Science",
      institution: "Cairo University",
      location: "Cairo, Egypt",
      startDate: "2015",
      endDate: "2019",
      gpa: "3.7",
      points: ["Graduated with honors", "GDSC lead — organized 10+ technical workshops"],
    },
  ],

  projects: [
    {
      id: "sample-proj-1",
      name: "E-commerce Platform",
      description:
        "Full-stack e-commerce solution with real-time inventory, order tracking, and admin analytics dashboard.",
      technologies: ["Next.js", "PostgreSQL", "Stripe", "Redis"],
      url: "github.com/ahmed/ecommerce",
      startDate: "Mar 2023",
      endDate: "Aug 2023",
    },
    {
      id: "sample-proj-2",
      name: "Task Management App",
      description:
        "Collaborative task manager with drag-and-drop boards, team chat, and deadline reminders.",
      technologies: ["React", "Firebase", "Tailwind CSS"],
      url: "tasks.ahmedhassan.dev",
      startDate: "Oct 2022",
      endDate: "Jan 2023",
    },
  ],

  skills: [
    { id: "sample-skill-1", name: "JavaScript" },
    { id: "sample-skill-2", name: "TypeScript" },
    { id: "sample-skill-3", name: "React" },
    { id: "sample-skill-4", name: "Next.js" },
    { id: "sample-skill-5", name: "Node.js" },
    { id: "sample-skill-6", name: "PostgreSQL" },
    { id: "sample-skill-7", name: "AWS" },
    { id: "sample-skill-8", name: "Docker" },
  ],

  sectionsTitle: {
    summary: { id: 1, name: "Professional Summary" },
    experience: { id: 2, name: "Work Experience" },
    education: { id: 3, name: "Educations" },
    projects: { id: 4, name: "Projects" },
    skills: { id: 5, name: "Skills" },
  },

  sectionOrder: ["summary", "experience", "education", "projects"],

  moreSections: [
    {
      id: "sample-more-1",
      sectionName: "Languages",
      sectionType: "secondary",
      body: [
        { id: "sample-lang-1", name: "Arabic (Native)" },
        { id: "sample-lang-2", name: "English (Fluent)" },
      ],
    },
    {
      id: "sample-more-2",
      sectionName: "Certifications",
      sectionType: "secondary",
      body: [{ id: "sample-cert-1", name: "AWS Certified Solutions Architect" }],
    },
  ],
};
