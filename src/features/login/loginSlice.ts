import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

interface User {
  name: string;
  email: string;
}

interface LoginState {
  user: User | null;
  token: string | null;
  images: string[];
  loading: 'idle' | 'loading'; // Thêm trạng thái loading
  isLoggedIn: boolean; // Thêm trạng thái isLoggedIn
  error: string | null; // Thêm trường error để lưu thông báo lỗi
}

const initialState: LoginState = {
  user: null,
  token: null,
  images: [],
  loading: 'idle',
  isLoggedIn: false,
  error: null,
};

export const login = createAsyncThunk(
  "login/login",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        values,
        { withCredentials: true }
      );
      Cookies.set("token", response.data.token); // Set the 'token' cookie
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const logout = createAsyncThunk(
  "login/logout",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Đảm bảo gửi yêu cầu với credentials
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/logout",
        {},
        { withCredentials: true } // Đảm bảo gửi cookie trên yêu cầu
      );
      Cookies.remove("token"); // Remove the 'token' cookie
      dispatch(reset()); // Reset the state
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response ? err.response.data : err);
    }
  }
);

export const fetchImages = createAsyncThunk("login/fetchImages", async () => {
  const response = await axios.get("http://localhost:5000/api/v1/auth/images");
  return response.data;
});

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    reset: () => initialState,
    loginFulfilled: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      // Add this action
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.images = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = "idle";
        state.user = action.payload.user;
        state.error = null;
        state.isLoggedIn = true;
        state.token = action.payload.token; // Store the 'token' in the state
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = "idle";
        state.error = action.payload;
        state.isLoggedIn = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        state.token = null;
      });
  },
});
export const { reset, loginFulfilled } = loginSlice.actions;
export default loginSlice.reducer;
