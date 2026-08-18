import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPost, fetchComments, addComment } from "./api";
import { Post, Comment } from "./Types";

export function PostPage() {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        if (!id) return;
        fetchPost(id).then(setPost);
        fetchComments(id).then(setComments);
    }, [id]);

    async function handleAddComment(e: FormEvent) {
        e.preventDefault();
        if (!id || !newComment.trim()) return;
        const comment = await addComment(Number(id), newComment);
        setComments(prev => [comment, ...prev]);
        setNewComment("");
    }

    if (!post) return <p className="p-4">Loading...</p>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <Link to="/" className="btn btn-ghost mb-4">← Back to feed</Link>

            <div className="card bg-base-200 shadow-sm mb-6">
                <div className="card-body">
                    <h1 className="card-title text-2xl">{post.title}</h1>
                    <p>{post.body}</p>
                    <div className="flex justify-between items-center text-xs opacity-60 mt-2">
                        <span>User {post.userId}</span>
                        <span>👍 {post.reactions.likes} · 👁 {post.views} views</span>
                    </div>
                </div>
            </div>

            <h2 className="text-lg font-semibold mb-2">Comments</h2>

            <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
                <input
                    className="input input-bordered flex-1"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    required
                />
                <button type="submit" className="btn btn-primary">Comment</button>
            </form>

            <div className="flex flex-col gap-2">
                {comments.map(comment => (
                    <div key={comment.id} className="card bg-base-200 shadow-sm">
                        <div className="card-body py-3">
                            <p>{comment.body}</p>
                            <span className="text-xs opacity-60">— {comment.user.username}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}