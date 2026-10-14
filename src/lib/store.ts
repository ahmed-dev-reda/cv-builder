import { configureStore } from "@reduxjs/toolkit";
import resumeReducer from "./features/resumeSlice";
import supportMeReducer from "./features/supportMeSlice";
import authReducer from "./features/authSlice";

// Creates a fresh Redux store instance (used by StoreProvider on the client)
export const makeStore = () => {
  return configureStore({
    reducer: {
      resume: resumeReducer,
      supportMe: supportMeReducer,
      auth: authReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
