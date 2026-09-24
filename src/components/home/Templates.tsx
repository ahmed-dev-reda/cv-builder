"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { BsArrowRight } from "react-icons/bs";
import { setTemplate, TemplateType } from "@/lib/features/resumeSlice";

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
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";

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

export default function Templates() {
  const dispatch = useDispatch();

  return (
    <section id="templates" className="scroll-mt-20 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-[#0D47A1]">
              Templates
            </span>
<></>
            <h2 className="mt-3 text-4xl font-bold tracking-tight">
              Start with a professional design.
            </h2>

            <p className="mt-4 max-w-xl text-gray-600">
              Clean templates designed to make your experience easy to read and
              hard to ignore.
            </p>
          </div>
        </div>

        {/* Slider */}
        <div className="relative mt-12">
          <button
            type="button"
            className="templates-prev absolute left-0 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full
             bg-white text-[#0D47A1] shadow-sm transition hover:bg-[#0D47A1] hover:text-white cursor-pointer"
            aria-label="Previous template"
          >
            <FaArrowAltCircleLeft size={35} />
          </button>

          <button
            type="button"
            className="templates-next absolute right-0 top-1/2 z-10 flex translate-x-1/2 -translate-y-1/2 items-center justify-center cursor-pointer
             rounded-full bg-white text-[#0D47A1] shadow-sm transition hover:bg-[#0D47A1] hover:text-white"
            aria-label="Next template"
          >
            <FaArrowAltCircleRight size={35} />
          </button>
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
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="templates-slider pb-12!"
          >
            {templates.map((template) => (
              <SwiperSlide key={template.name}>
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
                  {/* Preview */}
                  <div className="aspect-4/5 overflow-hidden bg-[#EEF3FC] p-4">
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

                  {/* Info */}
                  <div className="flex items-center justify-between gap-4 p-5">
                    <h3 className="font-semibold capitalize">
                      {template.name}
                    </h3>

                    <Link
                      href="/builder"
                      onClick={() => dispatch(setTemplate(template.name))}
                      className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-[#0D47A1] transition hover:bg-[#0D47A1] hover:text-white"
                    >
                      Use
                      <BsArrowRight size={13} />
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
