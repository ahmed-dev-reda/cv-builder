import Features from "@/components/home/Features";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import Steps from "@/components/home/Steps";
import Templates from "@/components/home/Templates";
import HydrationLoader from "@/components/HydrationLoader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free CV Builder - Create a Professional Resume",
  description:
    "Build your professional CV online with Now CV. Choose a modern resume template, customize your information, and download your CV as a PDF.",
  alternates: {
    canonical: "/",
  },
};
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Now CV",
  url: "https://now-cv.com",
  description:
    "Online CV and resume builder for creating professional resumes.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
};

export default function Home() {
  return (
    <HydrationLoader>
      <main className="min-h-screen bg-[#F8F9FF] text-[#171923]">
        <Header />
        <Hero />
        <Stats />
        <Features />
        <Steps />
        <Templates />
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </main>
    </HydrationLoader>
  );
}
