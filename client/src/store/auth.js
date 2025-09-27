import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const isProd = import.meta.env.VITE_ENV === "production";
const backend_URL = isProd
    ? import.meta.env.VITE_RENDER_BACKEND_URL
    : import.meta.env.VITE_LOCAL_BACKEND_URL;

// Get token from localStorage on app start
const savedToken = localStorage.getItem("jwt");

export const user_register = createAsyncThunk(
    "user/register",
    async (user, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${backend_URL}/api/auth/register`, user);
            const { token, user: userData } = res.data;
            localStorage.setItem("jwt", token); // store token
            return { user: userData, token, message: res.data.message };
        } catch (err) {
            if (err.response) {
                return rejectWithValue({
                    status: err.response.status,
                    message: err.response.data.message,
                });
            }
            return rejectWithValue({ message: "Something went wrong." });
        }
    }
);

export const user_login = createAsyncThunk(
    "user/login",
    async (user, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${backend_URL}/api/auth/login`, user);
            const { token, user: userData } = res.data;
            localStorage.setItem("jwt", token); // store token
            return { user: userData, token, message: res.data.message };
        } catch (err) {
            if (err.response) {
                return rejectWithValue({
                    status: err.response.status,
                    message: err.response.data.message,
                });
            }
            return rejectWithValue({ message: "Something went wrong." });
        }
    }
);

export const checkAuth = createAsyncThunk(
    "user/checkAuth",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("jwt"); // get token
            if (!token) throw new Error("No token");

            const res = await axios.get(`${backend_URL}/api/auth/user`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            return { user: res.data.user, token };
        } catch (err) {
            if (err.response) {
                return rejectWithValue({
                    status: err.response.status,
                    message: err.response.data.message,
                });
            }
            return rejectWithValue({ message: "Something went wrong." });
        }
    }
);

export const user_logout = createAsyncThunk("user/logout", async () => {
    localStorage.removeItem("jwt"); // 🔑 remove token
    return { message: "Logout successful" };
});

const initialState = {
    user: null,
    status: "idle",
    error: null,
    code: null,
    message: null,
    token: savedToken || null, // restore token on reload
};

const authReducer = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetAuthState: (state) => {
            state.error = null;
            state.message = null;
            state.code = null;
            state.status = "idle";
        },
        setToken: (state, action) => {
            state.token = action.payload;
            localStorage.setItem("jwt", action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            // User Register
            .addCase(user_register.pending, (state) => {
                state.status = "loading";
                state.error = null;
                state.message = null;
            })
            .addCase(user_register.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.status = "succeeded";
                state.message = action.payload.message;
                state.code = 201;
            })
            .addCase(user_register.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || "Something went wrong";
                state.code = action.payload?.status || 500;
            })

            // User Login
            .addCase(user_login.pending, (state) => {
                state.status = "loading";
                state.error = null;
                state.message = null;
            })
            .addCase(user_login.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.status = "succeeded";
                state.message = action.payload.message;
                state.code = 202;
            })
            .addCase(user_login.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || "Something went wrong";
                state.code = action.payload?.status || 500;
            })

            // Check Auth
            .addCase(checkAuth.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.status = "succeeded";
                state.code = 200;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || "Something went wrong";
                state.token = null;
                state.user = null;
                state.code = action.payload?.status || 500;
            })

            // Logout
            .addCase(user_logout.pending, (state) => {
                state.status = "loading";
            })
            .addCase(user_logout.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.status = "idle";
                state.message = "Logged out";
                state.error = null;
            })
            .addCase(user_logout.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || "Logout failed";
            });
    },
});

export const { resetAuthState, setToken } = authReducer.actions;
export default authReducer.reducer;