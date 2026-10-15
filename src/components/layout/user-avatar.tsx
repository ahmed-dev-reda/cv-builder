"use client";

import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { LayoutDashboard, LogOut } from "lucide-react";
import { Avatar } from "../ui/avatar";
import { selectAuthUser, signOutUser } from "@/lib/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export default function UserAvatar() {
  const user = useAppSelector(selectAuthUser);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSignOut = async () => {
    await dispatch(signOutUser());
    router.push("/");
  };
  return (
    <DropdownMenu
      trigger={
        <button className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-100 cursor-pointer">
          <Avatar fallback={user?.name?.charAt(0).toUpperCase() || "?"} />
          <span className="text-sm font-medium">{user?.name}</span>
        </button>
      }
    >
      <div className="px-2 py-1.5">
        <p className="text-sm font-medium">{user?.name}</p>
        <p className="text-xs text-muted">{user?.email}</p>
      </div>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => router.push("/dashboard")}>
        <LayoutDashboard className="h-4 w-4" />
        Dashboard
      </DropdownMenuItem>

      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleSignOut}>
        <LogOut className="h-4 w-4" />
        Sign out
      </DropdownMenuItem>
    </DropdownMenu>
  );
}
