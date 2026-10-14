import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signIn, signOut } from "next-auth/react";
import type { RootState } from "../store";

// --- Types ---

export interface AuthUser {
  id: string;
  name: string | null;
  email: string | null;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

// --- Thunks ---
// These never store passwords, tokens, or cookies — only the public
// profile returned by /api/user. The NextAuth session cookie remains the
// sole credential mechanism; the server re-validates it on every request.

export const fetchCurrentUser = createAsyncThunk<AuthUser | null>(
  "auth/fetchCurrentUser",
  async () => {
    const res = await fetch("/api/user");
    if (res.status === 401) return null;
    if (!res.ok) throw new Error("Failed to load user");
    const data = await res.json();
    const u = data.user as { id: string; name?: unknown; email?: unknown };
    return {
      id: u.id,
      name: typeof u.name === "string" ? u.name : null,
      email: typeof u.email === "string" ? u.email : null,
    };
  },
);

interface SignInCredentials {
  email: string;
  password: string;
}

export const signInUser = createAsyncThunk<
  AuthUser,
  SignInCredentials,
  { rejectValue: string }
>("auth/signIn", async (credentials, { dispatch, rejectWithValue }) => {
  try {
    const result = await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });

    if (result?.error) {
      return rejectWithValue(
        result.code === "account not found"
          ? "account not found"
          : "Invalid email or password",
      );
    }

    const user = await dispatch(fetchCurrentUser()).unwrap();
    if (!user) {
      return rejectWithValue("Sign in succeeded but the session is invalid");
    }
    return user;
  } catch {
    return rejectWithValue("Unable to sign in. Please try again.");
  }
});

interface SignUpInput extends SignInCredentials {
  name: string;
}

export const signUpUser = createAsyncThunk<
  AuthUser,
  SignUpInput,
  { rejectValue: string }
>("auth/signUp", async (input, { dispatch, rejectWithValue }) => {
  try {
    const registerRes = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.name,
        email: input.email,
        password: input.password,
      }),
    });

    if (!registerRes.ok) {
      const data = await registerRes.json().catch(() => ({}));
      return rejectWithValue(
        typeof data.error === "string" ? data.error : "Failed to create account",
      );
    }

    const result = await signIn("credentials", {
      email: input.email,
      password: input.password,
      redirect: false,
    });

    if (result?.error) {
      return rejectWithValue(
        "Account created but sign in failed. Please sign in manually.",
      );
    }

    const user = await dispatch(fetchCurrentUser()).unwrap();
    if (!user) {
      return rejectWithValue(
        "Account created but sign in failed. Please sign in manually.",
      );
    }
    return user;
  } catch {
    return rejectWithValue("Unable to create account. Please try again.");
  }
});

export const signOutUser = createAsyncThunk("auth/signOut", async () => {
  await signOut({ redirect: false });
  return null;
});

// --- Slice ---

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // One-way sync from the NextAuth session (see AuthSync). Keeps the
    // single UI source of truth aligned without duplicating credentials.
    setSessionUser(state, action: { payload: AuthUser | null }) {
      state.user = action.payload;
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state: AuthState) => {
      state.isLoading = true;
      state.error = null;
    };
    builder
      .addCase(fetchCurrentUser.pending, pending)
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        // A failed refresh must not sign the user out locally when we
        // already hold a session-backed user (e.g. transient network blip).
        if (!state.user) {
          state.error =
            action.error.message ?? "Failed to load user";
        }
      })
      .addCase(signInUser.pending, pending)
      .addCase(signInUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Unable to sign in";
      })
      .addCase(signUpUser.pending, pending)
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Unable to create account";
      })
      .addCase(signOutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signOutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(signOutUser.rejected, (state) => {
        // Cookie clearing is best-effort; drop local state regardless.
        state.isLoading = false;
        state.user = null;
        state.error = null;
      });
  },
});

export const { setSessionUser, clearAuthError } = authSlice.actions;

// --- Selectors (derived data lives here, not duplicated in state) ---

export const selectAuthUser = (state: RootState): AuthUser | null =>
  state.auth.user;

export const selectIsAuthenticated = (state: RootState): boolean =>
  state.auth.user !== null;

export const selectAuthLoading = (state: RootState): boolean =>
  state.auth.isLoading;

export const selectAuthError = (state: RootState): string | null =>
  state.auth.error;

export default authSlice.reducer;
