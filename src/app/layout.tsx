import type { Metadata } from "next";
import { Open_Sans, Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
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
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Now CV - Online CV Builder",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Now CV - Free Online CV & Resume Builder",
    description:
      "Create and customize your professional CV online with Now CV.",
    images: ["/og-image.png"],
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
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
