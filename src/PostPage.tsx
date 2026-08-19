import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchPost, fetchComments, addComment, deleteComment } from "./api";
import { Post, Comment } from "./Types";
import {
    useLikedPosts,
    isCustomPostId,
    getCustomPost,
    getCustomComments,
    addCustomComment,
    deleteCustomComment,
    getExtraComments,
    addExtraComment,
    deleteExtraComment,
    markCommentDeleted,
    filterDeletedComments,
} from "./storage";

export function PostPage({ onDelete }: { onDelete: (id: number) => void }) {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const { likedIds, toggleLike } = useLikedPosts();

    const numericId = id ? Number(id) : null;
    const isCustom = numericId !== null && isCustomPostId(numericId);

    useEffect(() => {
        if (!id || numericId === null) return;

        if (isCustom) {
            setPost(getCustomPost(numericId) ?? null);
            setComments(getCustomComments(numericId));
        } else {
            fetchPost(id).then(setPost);
            fetchComments(id).then(fetched => {
                // Merge dummyjson's seeded comments (minus any you've deleted)
                // with comments you've added locally, since dummyjson doesn't
                // actually persist new comments server-side.
                const seeded = filterDeletedComments(fetched);
                const extra = getExtraComments(numericId);
                setComments([...extra, ...seeded]);
            });
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
            const serverComment = await addComment(numericId, newComment);
            // Ignore dummyjson's returned id (it's often reused/fake) — use our own
            // unique local id so it never collides with a deleted-comment id later.
            const comment: Comment = { ...serverComment, id: Date.now() };
            addExtraComment(numericId, comment);
            setComments(prev => [comment, ...prev]);
        }
        setNewComment("");
    }

    async function handleDeleteComment(commentId: number) {
        if (numericId === null) return;

        if (isCustom) {
            deleteCustomComment(numericId, commentId);
        } else {
            // Locally-added comment vs. one of dummyjson's seeded ones
            const isExtra = getExtraComments(numericId).some(c => c.id === commentId);
            if (isExtra) {
                deleteExtraComment(numericId, commentId);
            } else {
                await deleteComment(commentId);
                markCommentDeleted(commentId);
            }
        }
        setComments(prev => prev.filter(c => c.id !== commentId));
    }

    function handleLike() {
        if (!post || numericId === null) return;
        const delta = likedIds.has(numericId) ? -1 : 1;
        toggleLike(numericId);
        setPost({ ...post, reactions: { ...post.reactions, likes: post.reactions.likes + delta } });
    }

    function handleDelete() {
        if (numericId === null) return;
        onDelete(numericId);
        navigate("/");
    }

    if (!post) return <p className="p-4">Loading...</p>;

    const liked = numericId !== null && likedIds.has(numericId);

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="flex items-center gap-2 mb-4">
                <Link to="/" className="btn btn-ghost">← Back to feed</Link>
                <button onClick={handleDelete} className="btn btn-error btn-sm">
                    Slet post
                </button>
            </div>

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
                        <div className="card-body py-3 flex-row items-center justify-between">
                            <div>
                                <p>{comment.body}</p>
                                <span className="text-xs opacity-60">— {comment.user.username}</span>
                            </div>
                            <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-error hover:scale-110 transition-transform cursor-pointer shrink-0 ml-2"
                                title="Slet kommentar"
                            >
                                🗑
                            </button>
                        </div>
                    </div>
                ))}
                {comments.length === 0 && <p className="text-sm opacity-60">No comments yet.</p>}
            </div>
        </div>
    );
}