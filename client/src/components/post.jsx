import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { delete_post, get_post } from "../store/postSlice";
import { toast } from "react-toastify";

function Post() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const posts = useSelector(state => state.posts.blogList);

    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (posts.length === 0) {
            dispatch(get_post());
        }
    }, [dispatch, posts.length]);
    const post = posts.find(post => post.id == id);

    if (!post) {
        return <h2 className="text-center mt-5">Post not found</h2>;
    }

    const deletePost = async (e) => {
        e.preventDefault()
        if (!user) {
            toast.error("Please login to delete a post");
            navigate("/login", { state: { from: "/" } });
        } else {
            await dispatch(delete_post(id));
            navigate("/");
        }
    }

    const handleEditPost = (e) => {
        if (!user) {
            e.preventDefault();
            toast.error("Please login to edit a post");
            navigate("/login", { state: { from: `/post/update/${post.id}` } });
        } else {
            navigate(`/post/update/${post.id}`);
        }
    };

    return (

        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-md-10">
                    <div className="post-container p-4 rounded shadow-sm">
                        <div className="text-center mb-4">
                            <img src={post.image} className="img-fluid post-image shadow" alt="Post image" />
                        </div>

                        <h1 className="display-5 fw-bold text-center text-title mb-2">
                            {post.title}
                        </h1>

                        <p className="text-muted text-center mb-4 fs-6">
                            📅 {post.mondate?.startsWith("Edited") ? post.mondate : `Posted on ${post.mondate}`}
                        </p>

                        <div className="post-content mb-5">
                            <p className="lead justify-text">
                                {post.description}
                            </p>
                        </div>

                        <div className="d-flex justify-content-center gap-3">
                            <button className="btn btn-warning px-4 min-width-btn" onClick={handleEditPost}>Edit</button>
                            <form >
                                <button onClick={deletePost} className="btn btn-danger px-4 min-width-btn">Delete</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Post;