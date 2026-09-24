"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  function clearLocalStorage() {
    localStorage.clear();
    window.location.href = "/builder";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mb-5 text-5xl">⚠️</div>

        <h1 className="text-2xl font-bold text-gray-900">
          Something went wrong
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          An unexpected error occurred. This may be caused by corrupted or
          outdated CV data saved in your browser.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={clearLocalStorage}
            className="w-full rounded-lg bg-[#8055a2] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      </div>
    </main>
  );
}
