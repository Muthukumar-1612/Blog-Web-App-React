import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { update_post } from "../store/postSlice";
import { useNavigate, useParams } from "react-router-dom";
import formatDate from "../store/date";

function Edit() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const posts = useSelector((state) => state.posts.blogList);
  const post = posts.find((p) => p.id == id);

  const [updatePost, setPost] = useState(post);
  const { status } = useSelector((state) => state.posts);
  const [fileName, setFileName] = useState("No file selected");

  useEffect(() => {
    return () => {
      if (updatePost?.imagePreview) {
        URL.revokeObjectURL(updatePost.imagePreview);
      }
    };
  }, [updatePost?.imagePreview]);

  const handleUpdate = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files?.length > 0) {
      const file = files[0];
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
    await dispatch(update_post(updatePost));
    navigate("/");
  };

  return (
    <div className="container py-5">
      <div className="col-md-8 mx-auto">
        <h2 className="text-center mb-4">Edit Blog Post</h2>
        <form encType="multipart/form-data" className="p-4 border rounded shadow bg-white" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group mb-3 pt-2">
            <input
              className="form-control"
              id="title"
              name="title"
              onChange={handleUpdate}
              value={updatePost.title}
              type="text"
              required
            />
          </div>

          {/* Description */}
          <div className="form-group mb-3">
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="5"
              onChange={handleUpdate}
              value={updatePost.description}
              required
            ></textarea>
          </div>

          {/* Current/Preview Image */}
          <div className="mb-3 text-center">
            <img
              src={
                updatePost.imagePreview ||
                (typeof updatePost.image === "string" ? updatePost.image : null) ||
                (typeof post.image === "string" ? post.image : null)
              }
              alt="Current Image"
              className="img-fluid rounded shadow"
              style={{ maxHeight: "200px" }}
            />
          </div>

          {/* Upload New Image */}
          <div className="form-group mb-4">
            <label htmlFor="image" className="form-label">
              Upload New Image <small>(≤ 10 MB, JPG/JPEG/PNG)</small>
            </label>
            <div className="custom-file-input">
              <input type="file" onChange={handleUpdate} name="image" id="image" />
              <span id="fileName" className="custom-file-label">
                {fileName}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button type="submit" className="btn btn-primary" disabled={status === "updating"}>
              {status === "updating" ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Edit;
