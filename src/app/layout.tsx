import type { Metadata } from "next";
import { Open_Sans, Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Toaster } from "sonner";
import favicon from "./favicon.png";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nowcv.com"),

  title: {
    default: "Now CV - Free Online CV & Resume Builder",
    template: "%s | Now CV",
  },

  description:
    "Create a professional CV and resume online with Now CV. Choose from modern templates, customize your resume, and download your CV as a PDF.",

  icons: {
    icon: favicon.src,
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://now-cv.vercel.app",
    siteName: "Now CV",
    title: "Now CV - Free Online CV & Resume Builder",
    description:
      "Create a professional CV online with modern resume templates and download your CV as a PDF.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${openSans.className} ${inter.className} h-full antialiased`}
    >
      <body className="flex flex-col">
        <StoreProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-center" richColors />
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
