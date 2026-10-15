import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useAppSelector } from "@/lib/hooks";
import { selectAuthUser } from "@/lib/features/authSlice";

export default function BuilderHeader() {
  const user = useAppSelector(selectAuthUser);
  const router = useRouter();

  return (
    <nav className="flex items-center gap-1.5 bg-inherit px-4 py-2 sm:gap-2">
      <Link
        href="/"
        className="flex shrink-0 items-center gap-2"
        aria-label="Now CV home"
      >
        <span className="hidden text-base font-bold tracking-tight lg:inline">
          Now <span className="text-primary">CV</span>
        </span>
      </Link>

      {user ? (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>
        </>
      ) : (
        <Link href="/signin">
          <Button variant="ghost" size="sm">
            Sign in
          </Button>
        </Link>
      )}
    </nav>
  );
}
