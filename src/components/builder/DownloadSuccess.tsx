"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  FaGithub,
  FaLinkedinIn,
  FaYoutube,
  FaTiktok,
  FaInstagram,
} from "react-icons/fa";
import { IoCheckmark } from "react-icons/io5";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function DownloadSuccess({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.95 }}
            transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-2xl"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.15,
                type: "spring",
                stiffness: 250,
                damping: 15,
              }}
              className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-100"
            >
              <IoCheckmark className="size-9 text-green-600" />
            </motion.div>

            {/* Title */}
            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              Downloaded!
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Your CV has been downloaded successfully.
            </p>

            {/* Support */}
            <div className="mt-6 rounded-xl bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-700">
                Support me by subscribing to my channels ❤️
              </p>

              {/* Social Links */}
              <div className="mt-4 flex justify-center gap-2">
                <a
                  href="https://github.com/ahmed-dev-reda"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex size-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:text-black"
                >
                  <FaGithub size={17} />
                </a>

                <a
                  href="https://www.linkedin.com/in/ahmed-reda-a41b49435/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex size-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:text-[#0A66C2]"
                >
                  <FaLinkedinIn size={16} />
                </a>

                <a
                  href="https://www.youtube.com/@ahmed-dev-reda"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex size-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:text-red-600"
                >
                  <FaYoutube size={18} />
                </a>

                <a
                  href="https://www.tiktok.com/@ahmed.dev.reda"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="flex size-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:text-black"
                >
                  <FaTiktok size={16} />
                </a>

                <a
                  href="https://www.instagram.com/ahmed.dev.reda"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex size-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:text-pink-600"
                >
                  <FaInstagram size={18} />
                </a>
              </div>
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-lg bg-[#0D47A1] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#093675]"
            >
              Continue
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
