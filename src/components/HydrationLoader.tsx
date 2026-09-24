"use client";

import { useEffect, useState } from "react";

export default function HydrationLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F9FF]">
        <div className="flex flex-col items-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-[#0D47A1] shadow-lg shadow-blue-900/20">
            <span className="text-xl font-bold text-white">CV</span>
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900">
            Now <span className="text-[#0D47A1]">CV</span>
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Building your professional resume
          </p>

          <div className="mt-7 h-1 w-40 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-[#0D47A1]" />
          </div>
        </div>
      </main>
    );
  }

  return children;
}
