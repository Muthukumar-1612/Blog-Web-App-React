import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { add_post } from "../store/postSlice";
import { useNavigate } from "react-router-dom";
import formatDate from "../store/date";
import { toast } from "react-toastify";

function CreatePost() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const status = useSelector((state) => state.posts.status);

    const [post, setPost] = useState({
        title: "",
        description: "",
        mondate: "",
        image: null,
    });
    const [fileName, setFileName] = useState("No file selected");
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        return () => {
            if (post.imagePreview && !submitted) {
                URL.revokeObjectURL(post.imagePreview);
            }
        };
    }, [post.imagePreview, submitted]);

    const handleFileChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "image" && files?.length > 0) {
            const file = files[0];

            if (file.size > 10 * 1024 * 1024) {
                const sizeInMB = (file.size / (1024 * 1024)).toFixed(2); // show size in MB
                toast.error(`File is ${sizeInMB} MB. Please upload a file ≤ 10 MB.`);
                e.target.value = ""; // reset file input
                return;
            }

            if (post.imagePreview) {
                URL.revokeObjectURL(post.imagePreview);
            }

            setPost((prev) => ({
                ...prev,
                image: file,
                imagePreview: URL.createObjectURL(file),
            }));
            setFileName(file.name);
        } else {
            setPost((prev) => ({
                ...prev,
                [name]: value,
                mondate: formatDate(),
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        await dispatch(add_post(post));
        navigate("/");
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="col-md-6">
                <h2 className="text-center mb-4">Post Your Article</h2>
                <form onSubmit={handleSubmit} className="p-4 border rounded shadow bg-white">
                    {/* Title */}
                    <div className="form-group mb-3">
                        <label htmlFor="title">Title</label>
                        <input
                            className="form-control"
                            id="title"
                            name="title"
                            type="text"
                            value={post.title}
                            onChange={handleFileChange}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="form-group mb-3">
                        <label htmlFor="description">Description</label>
                        <textarea
                            className="form-control"
                            id="description"
                            name="description"
                            rows="5"
                            value={post.description}
                            onChange={handleFileChange}
                            required
                        />
                    </div>

                    {/* Image Preview */}
                    {post.imagePreview && (
                        <div className="mt-3 text-center">
                            <img
                                src={post.imagePreview}
                                alt="Preview"
                                className="img-fluid rounded shadow"
                                style={{ maxHeight: "200px" }}
                            />
                        </div>
                    )}

                    {/* Image Upload */}
                    <div className="form-group mb-4">
                        <label htmlFor="image" className="form-label">
                            Upload Image <small>(≤ 10 MB, JPG/JPEG/PNG)</small>
                        </label>
                        <div className="custom-file-input">
                            <input type="file" onChange={handleFileChange} name="image" id="image" required />
                            <span id="fileName" className="custom-file-label">
                                {fileName}
                            </span>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary" disabled={status === "loading"}>
                            {status === "loading" ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Submitting...
                                </>
                            ) : (
                                "Submit"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreatePost;
