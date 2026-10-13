import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import {
  canShowSupportMe,
  recordSupportMeShown,
  type SupportMeSource,
} from "@/lib/supportMe";

interface SupportMeState {
  open: boolean;
  source: SupportMeSource | null;
}

const initialState: SupportMeState = {
  open: false,
  source: null,
};

const supportMeSlice = createSlice({
  name: "supportMe",
  initialState,
  reducers: {
    openSupportMe: (state, action: PayloadAction<SupportMeSource>) => {
      state.open = true;
      state.source = action.payload;
    },
    closeSupportMe: (state) => {
      state.open = false;
    },
  },
});

export const { openSupportMe, closeSupportMe } = supportMeSlice.actions;
export default supportMeSlice.reducer;

// Central gate for every Support Me trigger. Call sites invoke this only
// after their action has SUCCEEDED — failed operations never reach it.
// Returns true when the modal actually opened. Guarantees:
// - never opens twice (single Redux-backed instance),
// - respects the per-source session budget and global cooldown.
export const requestSupportMe =
  (source: SupportMeSource) =>
  (dispatch: AppDispatch, getState: () => RootState): boolean => {
    if (getState().supportMe.open) return false;
    const now = Date.now();
    if (!canShowSupportMe(source, now)) return false;
    recordSupportMeShown(source, now);
    dispatch(openSupportMe(source));
    return true;
  };
