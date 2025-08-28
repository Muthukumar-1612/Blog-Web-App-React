import { Routes, Route } from "react-router-dom";
import Home from "../components/home";
import Post from "../components/post";
import Edit from "../components/edit";
import CreatePost from "../components/createPost";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/post/update/:id" element={<Edit />} />
            <Route path="/create-post" element={<CreatePost />} />
        </Routes>
    );
}

export default AppRoutes;