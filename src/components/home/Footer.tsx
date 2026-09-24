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
export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-14 items-center justify-center rounded-lg">
              <Image src={logo} alt="Now CV logo" />
            </div>

            <span className="font-bold">
              Now<span className="text-[#0D47A1]"> CV</span>
            </span>
          </Link>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/ahmed-dev-reda"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex size-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:text-black"
            >
              <FaGithub size={17} />
            </a>

            <a
              href="https://www.linkedin.com/in/ahmed-reda-a41b49435/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex size-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:text-[#0A66C2]"
            >
              <FaLinkedinIn size={16} />
            </a>

            <a
              href="https://www.youtube.com/@ahmed-dev-reda"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="flex size-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:text-red-600"
            >
              <FaYoutube size={18} />
            </a>

            <a
              href="https://www.tiktok.com/@ahmed.dev.reda"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="flex size-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:text-black"
            >
              <FaTiktok size={16} />
            </a>

            <a
              href="https://www.instagram.com/ahmed.dev.reda 
              "
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex size-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:text-pink-600"
            >
              <FaInstagram size={18} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-100 pt-5 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Now CV. Created by{" "}
            <a
              href="https://github.com/ahmed-dev-reda"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-500 transition-colors hover:text-blue-700 hover:underline"
            >
              Ahmed Reda
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
