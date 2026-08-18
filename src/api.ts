import { Post, Comment } from "./Types";

const BASE = "https://dummyjson.com";

export async function fetchPosts(): Promise<Post[]> {
    const res = await fetch(`${BASE}/posts?limit=50`);
    const data = await res.json();
    return data.posts;
}

export async function fetchPost(id: string): Promise<Post> {
    const res = await fetch(`${BASE}/posts/${id}`);
    return res.json();
}

export async function fetchComments(id: string): Promise<Comment[]> {
    const res = await fetch(`${BASE}/comments/post/${id}`);
    const data = await res.json();
    return data.comments;
}

export async function createPost(title: string, body: string): Promise<Post> {
    const res = await fetch(`${BASE}/posts/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, userId: 1 }),
    });
    return res.json();
}

export async function deletePost(id: number): Promise<void> {
    await fetch(`${BASE}/posts/${id}`, { method: "DELETE" });
}