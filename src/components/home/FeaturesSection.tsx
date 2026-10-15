"use client";

import { FaBolt, FaDownload, FaPalette, FaStar } from "react-icons/fa";
import { FiLayout, FiMousePointer } from "react-icons/fi";
import { Reveal } from "@/components/ui/reveal";

const features = [
  {
    icon: FiMousePointer,
    title: "Easy to customize",
    description:
      "Build your CV with a simple editor designed to keep everything fast and easy.",
  },
  {
    icon: FiLayout,
    title: "Professional templates",
    description:
      "Choose from clean, professional templates designed to make your experience stand out.",
  },
  {
    icon: FaBolt,
    title: "Real-time preview",
    description: "See every change instantly while you're building your CV.",
  },
  {
    icon: FaDownload,
    title: "Export as PDF",
    description:
      "Download your finished CV as a high-quality PDF whenever you're ready.",
  },
  {
    icon: FaPalette,
    title: "Customize your style",
    description:
      "Choose colors, sections and layouts that match your personal style.",
  },
  {
    icon: FaStar,
    title: "Add custom sections",
    description:
      "Add languages, certifications, hobbies and any other information you need.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-20 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Everything you need
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Build your CV without the hassle.
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted">
            Everything is designed to help you focus on your experience instead
            of fighting with formatting.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.title} delay={Math.min(index * 0.07, 0.35)}>
                <div className="group h-full rounded-xl border border-border bg-surface p-6 transition-shadow hover:shadow-md">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {feature.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
