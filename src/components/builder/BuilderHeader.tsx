"use client";

import * as React from "react";

import { AppDispatch, RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";

export default function BuilderHeader() {
  return (
    <nav className="flex items-center justify-between bg-inherit px-4 py-2">
      <h1 className="hidden xl:block mr-4 text-lg font-semibold text-foreground">
        Resume Builder
      </h1>
    </nav>
  );
}
