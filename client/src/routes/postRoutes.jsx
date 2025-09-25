import { Routes, Route } from "react-router-dom";
import Home from "../components/home";
import Post from "../components/post";
import Edit from "../components/edit";
import CreatePost from "../components/createPost";
import Register from "../components/Register";
import Login from "../components/Login";
import RequireAuth from "../components/RequireAuth";
import OauthSuccess from "../pages/OauthSuccess";


function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/oauth-success" element={<OauthSuccess />} />
            {/* Protected routes */}
            <Route element={<RequireAuth />} >
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/post/update/:id" element={<Edit />} />
            </Route>

        </Routes>
    );
}

export default AppRoutes;