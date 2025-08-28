import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const get_post = createAsyncThunk("posts/fetchPosts", async () => {
    const res = await axios.get("http://localhost:5000/api/posts");
    return res.data;
})

export const add_post = createAsyncThunk("posts/addPosts", async (post, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        for (const key in post) {
            formData.append(key, post[key]);
        }

        const res = await axios.post("http://localhost:5000/api/posts/submit", formData);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
})

export const update_post = createAsyncThunk("posts/updatePosts", async (updatedData, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        for (const key in updatedData) {
            formData.append(key, updatedData[key]);
        }
        const res = await axios.patch(`http://localhost:5000/api/posts/update/${updatedData.id}`, formData);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
})

export const delete_post = createAsyncThunk("posts/deletePosts", async (id) => {
    await axios.delete(`http://localhost:5000/api/posts/delete/${id}`);
    return id;
})

const postReducer = createSlice({
    name: "posts",
    initialState: {
        blogList: [],
        status: "idle",
        error: null,
    },
    extraReducers: (builder) => {
        builder
            // GET
            .addCase(get_post.fulfilled, (state, action) => {
                state.blogList = action.payload;
            })

            // ADD
            .addCase(add_post.pending, (state) => {
                state.status = "loading";
            })
            .addCase(add_post.fulfilled, (state, action) => {
                state.status = "idle";
                state.blogList.push(action.payload);
            })
            .addCase(add_post.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload;
            })

            // UPDATE
            .addCase(update_post.pending, (state) => {
                state.status = "updating";
            })
            .addCase(update_post.fulfilled, (state, action) => {
                state.status = "idle";
                const updatedPost = action.payload;
                const index = state.blogList.findIndex((p) => p.id == updatedPost.id);
                if (index !== -1) {
                    state.blogList[index] = updatedPost;
                }
            })
            .addCase(update_post.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload;
            })

            // DELETE
            .addCase(delete_post.fulfilled, (state, action) => {
                state.blogList = state.blogList.filter((post) => post.id !== action.payload);
            });
    },

})

export default postReducer.reducer;