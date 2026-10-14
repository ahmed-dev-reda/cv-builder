import AppHeader from "@/components/layout/app-header";
import {
  FeaturesSection,
  StepsSection,
  TemplatesSection,
  StatsSection,
} from "@/components/home";
import { Footer } from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import HydrationLoader from "@/components/HydrationLoader";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

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
  url: "https://nowcv.com",
  description:
    "Online CV and resume builder for creating professional resumes.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
};

export default async function Home() {
  const session = await auth();
  if (session?.user?.id) {
    redirect("/dashboard");
  }
  return (
    <HydrationLoader>
      <main className="min-h-screen bg-background text-foreground overflow-auto">
        <AppHeader />
        <Hero />
        <StatsSection />
        <FeaturesSection />
        <StepsSection />
        <TemplatesSection />
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
