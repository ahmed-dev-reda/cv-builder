"use client";

import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { useDispatch } from "react-redux";
import { setTemplate, TemplateType } from "@/lib/features/resumeSlice";
import { Button } from "@/components/ui/button";
import { BsArrowRight } from "react-icons/bs";

import simple from "@/thumbnails/simple.jpg";
import minimalist from "@/thumbnails/minimalist.jpg";
import classicOne from "@/thumbnails/classic_one.jpg";
import classicTwo from "@/thumbnails/classic_two.png";
import minimalistTwo from "@/thumbnails/minimalist_two.png";
import classicThree from "@/thumbnails/classic_three.png";
import classicFour from "@/thumbnails/classic_four.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Template = {
  name: TemplateType;
  image: StaticImageData;
};

const templates: Template[] = [
  { name: "simple", image: simple },
  { name: "minimalist", image: minimalist },
  { name: "classicOne", image: classicOne },
  { name: "classicTwo", image: classicTwo },
  { name: "minimalistTwo", image: minimalistTwo },
  { name: "classicThree", image: classicThree },
  { name: "classicFour", image: classicFour },
];

export function TemplatesSection() {
  const dispatch = useDispatch();

  return (
    <section id="templates" className="scroll-mt-20 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Templates
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Start with a professional design.
            </h2>
            <p className="mt-4 max-w-xl text-muted">
              Clean templates designed to make your experience easy to read and
              hard to ignore.
            </p>
          </div>
        </div>

        <div className="relative mt-12">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              prevEl: ".templates-prev",
              nextEl: ".templates-next",
            }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="templates-slider pb-12!"
          >
            {templates.map((template) => (
              <SwiperSlide key={template.name}>
                <div className="overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-md">
                  <div className="aspect-4/5 overflow-hidden bg-primary-50/30 p-4">
                    <div className="h-full w-full transition-transform duration-300 hover:scale-[1.03]">
                      <Image
                        src={template.image}
                        alt={`${template.name} template`}
                        width={500}
                        height={625}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 p-4">
                    <h3 className="font-semibold capitalize">
                      {template.name}
                    </h3>
                    <Link
                      href="/builder"
                      onClick={() => dispatch(setTemplate(template.name))}
                    >
                      <Button size="sm" variant="outline" className="gap-1.5">
                        Use
                        <BsArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
