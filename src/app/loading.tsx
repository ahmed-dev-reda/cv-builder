export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F9FF] px-6">
      <div className="flex flex-col items-center text-center">
        {/* Logo */}
        <div className="relative mb-8">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-[#0D47A1] shadow-lg shadow-blue-900/20">
            <span className="text-xl font-bold tracking-tight text-white">
              CV
            </span>
          </div>

          <div className="absolute -inset-2 -z-10 rounded-3xl bg-blue-100 blur-xl" />
        </div>

        {/* Brand */}
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Now <span className="text-[#0D47A1]">CV</span>
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Building your professional resume
        </p>

        {/* Loader */}
        <div className="mt-8 w-48">
          <div className="h-1 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-1/2 animate-[loading_1.4s_ease-in-out_infinite] rounded-full bg-[#0D47A1]" />
          </div>
        </div>

        <p className="mt-4 text-xs font-medium text-gray-400">Please wait...</p>
      </div>

      <style>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(250%);
          }
        }
      `}</style>
    </main>
  );
}
