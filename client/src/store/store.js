import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./postSlice";
import authReducer from "./auth";

export const store = configureStore({
    reducer: {
        posts: postReducer,
        auth: authReducer,
    },
});
