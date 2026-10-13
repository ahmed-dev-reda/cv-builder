"use client";

import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    title: "Add your information",
    description:
      "Enter your personal information, experience, education and skills.",
  },
  {
    number: "02",
    title: "Customize your CV",
    description:
      "Choose a template and customize the sections to match your profile.",
  },
  {
    number: "03",
    title: "Download your CV",
    description: "Preview your CV and export it as a professional PDF.",
  },
];

export function StepsSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-y border-border bg-surface py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              How it works
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              From blank page to professional CV.
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted">
              No complicated design tools. Just add your information, customize
              your CV and download it.
            </p>
            <Link href="/builder" className="mt-8 inline-block">
              <Button size="lg" className="gap-2">
                Start building
                <BsArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex gap-5 rounded-xl border border-border bg-background p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
