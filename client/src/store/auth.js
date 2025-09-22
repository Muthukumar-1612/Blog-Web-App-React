import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const isProd = import.meta.env.VITE_ENV === "production";
const backend_URL = isProd ? import.meta.env.VITE_RENDER_BACKEND_URL : import.meta.env.VITE_LOCAL_BACKEND_URL;

export const user_register = createAsyncThunk(
    "user/register",
    async (user, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${backend_URL}/api/auth/register`, user, { withCredentials: true });
            // console.log(res.data);
            return res.data; // { message, user }
        } catch (err) {
            if (err.response) {
                return rejectWithValue({
                    status: err.response.status,       // 409
                    message: err.response.data.message // Email already exists
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
            const res = await axios.post(`${backend_URL}/api/auth/login`, user, { withCredentials: true });
            return res.data; // { message, user }
        } catch (err) {
            if (err.response) {
                return rejectWithValue({
                    status: err.response.status, // 401
                    message: err.response.data.message // Incorrect email or password
                })
            }
            return rejectWithValue({ message: "Something went wrong." });
        }
    }
);

export const checkAuth = createAsyncThunk(
    "user/checkAuth",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${backend_URL}/api/auth/user`, { withCredentials: true });
            // console.log("checkAuth success:", res.data);
            return res.data; // { user }
        } catch (err) {
            // console.log("checkAuth failed:", err.response?.data || err.message);
            if (err.response) {
                return rejectWithValue({
                    status: err.response.status, // 401
                    message: err.response.data.message // Unauthorized
                })
            }
            return rejectWithValue({ message: "Something went wrong." });
        }
    }
);

export const user_logout = createAsyncThunk(
    "user/logout",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${backend_URL}/api/auth/logout`, {}, { withCredentials: true });
            return res.data; // { message }
        } catch (err) {
            if (err.response) {
                return rejectWithValue({
                    status: err.response.status, // 500
                    message: err.response.data.message // Logout failed. Please try again.
                })
            }
            return rejectWithValue({ message: "Something went wrong." });
        }
    }
);

const initialState = {
    user: null,
    status: "idle",
    error: null,      // store error message
    code: null,       // store HTTP status code
    message: null,    // store backend message - success/error
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
        }
    },
    extraReducers: (builder) => {
        builder
            // Register reducers
            .addCase(user_register.pending, (state) => {
                state.status = "loading";
                state.error = null;
                state.code = null;
                state.message = null;
            })
            .addCase(user_register.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload.user;
                state.message = action.payload.message;
                state.code = 201;
            })
            .addCase(user_register.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload.message;
                state.code = action.payload.status;
            })
            // Login reducers
            .addCase(user_login.pending, (state) => {
                state.status = "loading";
                state.error = null;
                state.code = null;
                state.message = null;
            })
            .addCase(user_login.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload.user;
                state.message = action.payload.message;
                state.code = 202;
            })
            .addCase(user_login.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload.message;
                state.code = action.payload.status;
            })
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
                state.status = "loading";
                state.error = null;
                state.code = null;
                state.message = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "succeeded";
                state.user = action.payload.user;
                state.code = 200;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.loading = false;
                state.status = "failed";
                state.user = null;
                state.error = action.payload.message;
                state.code = action.payload.status;
            })
            .addCase(user_logout.fulfilled, (state) => {
                state.user = null;
                state.status = "idle";
                state.message = "Logged out";
            })
    }
})

export const { resetAuthState } = authReducer.actions;
export default authReducer.reducer;