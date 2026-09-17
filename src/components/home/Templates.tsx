"use client";
import { motion } from "motion/react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

import simple from "@/thumbnails/simple.jpg";
import minimalist from "@/thumbnails/minimalist.jpg";
import classicOne from "@/thumbnails/classic_one.jpg";
import classicTwo from "@/thumbnails/classic_two.png";
import minimalistTwo from "@/thumbnails/minimalist_two.png";
import { useDispatch } from "react-redux";
import { setTemplate, TemplateType } from "@/lib/features/resumeSlice";

const templates: Template[] = [
  {
    name: "simple",
    image: simple,
  },
  {
    name: "minimalist",
    image: minimalist,
  },
  {
    name: "classicOne",
    image: classicOne,
  },
  {
    name: "classicTwo",
    image: classicTwo,
  },
  {
    name: "minimalistTwo",
    image: minimalistTwo,
  },
];
type Template = {
  name: TemplateType;
  image: StaticImageData;
};
export default function Templates() {
  const dispatch = useDispatch();

  return (
    <section id="templates" className="scroll-mt-20 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-[#0D47A1]">
              Templates
            </span>

            <h2 className="mt-3 text-4xl font-bold tracking-tight">
              Start with a professional design.
            </h2>

            <p className="mt-4 max-w-xl text-gray-600">
              Clean templates designed to make your experience easy to read and
              hard to ignore.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {templates.map((template: Template, index) => (
            <motion.div
              key={template.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.12,
                ease: "easeIn",
              }}
              viewport={{
                once: true,
                amount: 0.15,
              }}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5"
            >
              <motion.div className="aspect-5 bg-[#EEF3FC] p-4">
                <Image
                  src={template.image}
                  alt={`${template.name} template`}
                  width={500}
                  height={625}
                  className="h-full w-full object-contain"
                />
              </motion.div>

              <div className="flex items-center justify-between p-5">
                <div>
                  <h3 className="font-semibold capitalize">
                    {template.name} Template
                  </h3>
                </div>

                <Link
                  href="/builder"
                  className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-[#0D47A1] transition hover:bg-[#0D47A1] hover:text-white"
                  onClick={() => dispatch(setTemplate(template.name))}
                >
                  Use template
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
