import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { delete_post } from "../store/postSlice";


function Post() {
    const { id } = useParams();
    const posts = useSelector(state => state.posts.blogList);
    const post = posts.find(post => post.id == id);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    if (!post) {
        return <h2 className="text-center mt-5">Post not found</h2>;
    }

    const deletePost = async (e) => {
        e.preventDefault()
        await dispatch(delete_post(id));
        navigate("/");
    }



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

                        <p className="text-muted text-center mb-4 fs-6">📅 Posted on {post.monDate}
                        </p>

                        <div className="post-content mb-5">
                            <p className="lead justify-text">
                                {post.description}
                            </p>
                        </div>

                        <div className="d-flex justify-content-center gap-3">
                            <Link to={`/post/update/${post.id}`} className="btn btn-warning px-4 min-width-btn">Edit</Link>
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