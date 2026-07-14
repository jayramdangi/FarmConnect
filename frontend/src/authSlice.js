import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "./utils/axiosClient";

/* ===========================
   REGISTER USER
=========================== */
export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ role, ...userData }, { rejectWithValue }) => {
    try {
      let url = "";

      if (role === "farmer") url = "/farmer/auth/register";
      else if (role === "shop") url = "/shop/auth/register";
      else if (role === "mandi") url = "/mandi/auth/register";
      else throw new Error("Invalid role");

      const response = await axiosClient.post(url, userData);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.message || "Registration failed"
      );
    }
  }
);

/* ===========================
   LOGIN USER
=========================== */
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ role, emailId, password }, { rejectWithValue }) => {
    try {
      let url = "";

      if (role === "farmer") url = "/farmer/auth/login";
      else if (role === "shop") url = "/shop/auth/login";
      else if (role === "mandi") url = "/mandi/auth/login";
      else throw new Error("Invalid role");

      const response = await axiosClient.post(url, { emailId, password });
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.message || "Login failed"
      );
    }
  }
);

/* ===========================
   CHECK AUTH
=========================== */
export const checkAuth = createAsyncThunk(
  "auth/check",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get("/check");
      return data.user;
    } catch (error) {
      if (error.response?.status === 401) return rejectWithValue(null);
      return rejectWithValue(error.message);
    }
  }
);

/* ===========================
   LOGOUT
=========================== */
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post("/logout");
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ===========================
   SLICE
=========================== */
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* REGISTER */
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      /* LOGIN */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      /* CHECK AUTH */
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.loading = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })

      /* LOGOUT */
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export default authSlice.reducer;
