"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BiCheck } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import { Reveal } from "@/components/ui/reveal";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/50 to-background">
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pb-28 lg:pt-24">
        {/* Hero content */}
        <div>
          <Reveal>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Create a CV that{" "}
              <span className="text-primary">gets noticed.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
              Create a professional CV in minutes with an easy-to-use builder,
              beautiful templates, real-time preview and high-quality PDF
              export.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/builder">
                <Button size="lg" className="gap-2">
                  Create your CV
                  <BsArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/signin">
                <Button size="lg" variant="outline">
                  Sign in
                </Button>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
              {[
                "No design skills required",
                "Real-time preview",
                "PDF export",
                "AI-powered writing",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-muted"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-50 text-primary">
                    <BiCheck className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* CV Preview Mockup */}
        <Reveal
          delay={0.25}
          distance={40}
          className="relative mx-auto w-full max-w-lg"
        >
          <div className="relative rotate-1 rounded-2xl border border-border bg-surface p-3 shadow-2xl shadow-primary/5">
            <div className="rounded-xl border border-gray-100 bg-white p-6 sm:p-8">
              {/* CV header */}
              <div className="border-b border-gray-200 pb-4">
                <div className="h-5 w-48 rounded bg-primary" />
                <div className="mt-3 flex gap-2">
                  <div className="h-2 w-20 rounded bg-gray-200" />
                  <div className="h-2 w-24 rounded bg-gray-200" />
                  <div className="h-2 w-16 rounded bg-gray-200" />
                </div>
              </div>

              {/* Summary */}
              <div className="mt-5">
                <div className="mb-3 h-3 w-20 rounded bg-primary" />
                <div className="space-y-2">
                  <div className="h-2 w-full rounded bg-gray-200" />
                  <div className="h-2 w-[92%] rounded bg-gray-200" />
                  <div className="h-2 w-[80%] rounded bg-gray-200" />
                </div>
              </div>

              {/* Experience */}
              <div className="mt-6">
                <div className="mb-4 h-3 w-32 rounded bg-primary" />
                <div className="flex justify-between">
                  <div className="h-3 w-40 rounded bg-gray-300" />
                  <div className="h-2 w-20 rounded bg-gray-200" />
                </div>
                <div className="mt-3 space-y-2">
                  <div className="h-2 w-full rounded bg-gray-200" />
                  <div className="h-2 w-[95%] rounded bg-gray-200" />
                  <div className="h-2 w-[87%] rounded bg-gray-200" />
                </div>
              </div>

              {/* Skills */}
              <div className="mt-6">
                <div className="mb-3 h-3 w-28 rounded bg-primary" />
                <div className="flex flex-wrap gap-2">
                  {["React", "Next.js", "TypeScript", "UI/UX"].map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-primary-50 px-2.5 py-1 text-[9px] font-medium text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating card */}
          <div className="absolute -bottom-6 -left-6 hidden rounded-xl border border-border bg-surface p-4 shadow-md sm:block">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <BiCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted">Your CV</p>
                <p className="text-sm font-semibold">Ready to download</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
