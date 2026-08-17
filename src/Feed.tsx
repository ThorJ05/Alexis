import { useState } from "react";
import postsData from "/posts.json";
import { Post } from "/types";

export function Feed() {
    const [posts, setPosts] = useState<Post[]>(postsData);

    return (
        <div>
            <h1>Posts</h1>

            {posts.map(post => (
                <div key={post.id}>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                    <small>{post.created_at}</small>
                </div>
            ))}
        </div>
    );
}
