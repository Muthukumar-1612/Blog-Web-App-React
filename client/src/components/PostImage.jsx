import React from "react";

function PostImage({ post }) {
    if (!post.image) return null;

    return (
        <img
            src={post.image}
            alt="Post"
            className="post-thumbnail"
        />
    );
}

export default PostImage;
