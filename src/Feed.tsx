import { Link } from "react-router-dom";
import { Post } from "./Types";
import { useLikedPosts } from "./storage";

const accentColors = ["goldenrod", "seagreen", "chocolate", "mediumpurple"];
function accentFor(userId: number) {
    return accentColors[userId % accentColors.length];
}

export function Feed({
                         posts,
                         query,
                         onSearch,
                         onLikeChange,
                     }: {
    posts: Post[];
    query: string;
    onSearch: (q: string) => void;
    onLikeChange: (id: number, delta: number) => void;
}) {
    const { likedIds, toggleLike } = useLikedPosts();

    return (
        <div>
            <input
                type="text"
                placeholder="Søg efter titel..."
                className="input input-bordered w-full mb-4"
                value={query}
                onChange={e => onSearch(e.target.value)}
            />
            <div className="flex flex-col gap-3">
                {posts.map(post => {
                    const liked = likedIds.has(post.id);
                    return (
                        <Link
                            key={post.id}
                            to={`/post/${post.id}`}
                            className="card bg-base-200 shadow-sm rounded-r-lg rounded-l-none hover:shadow-md transition-shadow"
                            style={{ borderLeft: `5px solid ${accentFor(post.userId)}` }}
                        >
                            <div className="card-body py-4">
                                <h2 className="card-title">{post.title}</h2>
                                <p>{post.body}</p>
                                <div className="flex justify-between items-center text-xs opacity-60">
                                    <span>User {post.userId}</span>
                                    <span className="flex items-center gap-3">
                                        <button
                                            onClick={e => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleLike(post.id);
                                                onLikeChange(post.id, liked ? -1 : 1);
                                            }}
                                            className={`hover:scale-110 transition-transform cursor-pointer ${liked ? "text-primary font-semibold" : ""}`}
                                        >
                                            {liked ? "👍" : "🤍"} {post.reactions.likes}
                                        </button>
                                        <span>👁 {post.views} views</span>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}