import Link from "next/link";
import Image from "next/image";
import logo from "@/logo.png";
import {
  FaGithub,
  FaLinkedinIn,
  FaYoutube,
  FaTiktok,
  FaInstagram,
} from "react-icons/fa";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg">
              <Image src={logo} alt="Now CV logo" />
            </div>
            <span className="font-bold">
              Now<span className="text-primary"> CV</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-all hover:-translate-y-0.5 hover:bg-gray-50 hover:text-foreground"
            >
              <FaGithub className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-all hover:-translate-y-0.5 hover:bg-gray-50 hover:text-[#0A66C2]"
            >
              <FaLinkedinIn className="h-4 w-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-all hover:-translate-y-0.5 hover:bg-gray-50 hover:text-red-600"
            >
              <FaYoutube className="h-4 w-4" />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-all hover:-translate-y-0.5 hover:bg-gray-50 hover:text-foreground"
            >
              <FaTiktok className="h-4 w-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-all hover:-translate-y-0.5 hover:bg-gray-50 hover:text-pink-600"
            >
              <FaInstagram className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5 text-center">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Now CV. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
