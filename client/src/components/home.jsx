import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_post } from "../store/postSlice";
import { Link } from "react-router-dom";
import PostImage from "./PostImage";

function Home() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(get_post());
  }, [dispatch]);

  const posts = useSelector((state) => state.posts.blogList);
  console.log(posts);

  return (
    <div className="container my-5">
      <div className="row">
        {posts.map((post) => (
          <div className="col-md-6 mb-4" key={post.id}>
            <div className="row g-0 border rounded overflow-hidden flex-md-row shadow-sm h-md-250 position-relative card-hover">
              {/* Text content */}
              <div className="col p-4 d-flex flex-column justify-content-between position-static">
                <div>
                  <h3 className="mb-0">{post.title}</h3>
                  <div className="mb-1 text-body-secondary">{post.mondate}</div>
                  <p className="mb-2 truncate-description">
                    {post.description}
                  </p>
                </div>
                <Link
                  to={`/post/${post.id}`}
                  className="icon-link gap-1 icon-link-hover stretched-link"
                >
                  Continue reading
                </Link>
              </div>

              {/* Image */}
              {(post.imagePreview || post.image) && (
                <div className="col-auto d-none d-lg-block">
                  <PostImage post={post} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
