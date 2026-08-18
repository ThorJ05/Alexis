import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPost, fetchComments, addComment } from "./api";
import { Post, Comment } from "./Types";
import {
    useLikedPosts,
    isCustomPostId,
    getCustomPost,
    getCustomComments,
    addCustomComment,
} from "./storage";

export function PostPage() {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const { likedIds, toggleLike } = useLikedPosts();

    const numericId = id ? Number(id) : null;
    const isCustom = numericId !== null && isCustomPostId(numericId);

    useEffect(() => {
        if (!id || numericId === null) return;

        if (isCustom) {
            // Locally-created post — dummyjson doesn't know about this ID, so read from localStorage
            setPost(getCustomPost(numericId) ?? null);
            setComments(getCustomComments(numericId));
        } else {
            fetchPost(id).then(setPost);
            fetchComments(id).then(setComments);
        }
    }, [id]);

    async function handleAddComment(e: FormEvent) {
        e.preventDefault();
        if (!id || numericId === null || !newComment.trim()) return;

        if (isCustom) {
            const comment: Comment = {
                id: Date.now(),
                body: newComment,
                postId: numericId,
                user: { id: 0, username: "You" },
            };
            addCustomComment(numericId, comment);
            setComments(prev => [comment, ...prev]);
        } else {
            const comment = await addComment(numericId, newComment);
            setComments(prev => [comment, ...prev]);
        }
        setNewComment("");
    }

    function handleLike() {
        if (!post || numericId === null) return;
        const delta = likedIds.has(numericId) ? -1 : 1;
        toggleLike(numericId);
        setPost({ ...post, reactions: { ...post.reactions, likes: post.reactions.likes + delta } });
    }

    if (!post) return <p className="p-4">Loading...</p>;

    const liked = numericId !== null && likedIds.has(numericId);

    return (
        <div className="max-w-2xl mx-auto p-4">
            <Link to="/" className="btn btn-ghost mb-4">← Back to feed</Link>

            <div className="card bg-base-200 shadow-sm mb-6">
                <div className="card-body">
                    <h1 className="card-title text-2xl">{post.title}</h1>
                    <p>{post.body}</p>
                    <div className="flex justify-between items-center text-xs opacity-60 mt-2">
                        <span>User {post.userId}</span>
                        <span className="flex items-center gap-3">
                            <button
                                onClick={handleLike}
                                className={`hover:scale-110 transition-transform cursor-pointer ${liked ? "text-primary font-semibold" : ""}`}
                            >
                                {liked ? "👍" : "🤍"} {post.reactions.likes}
                            </button>
                            <span>👁 {post.views} views</span>
                        </span>
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
                {comments.length === 0 && <p className="text-sm opacity-60">No comments yet.</p>}
            </div>
        </div>
    );
}