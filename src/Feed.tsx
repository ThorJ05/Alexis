import { Link } from "react-router-dom";
import { Post } from "./Types";

const accentColors = ["goldenrod", "seagreen", "chocolate", "mediumpurple"];
function accentFor(userId: number) {
    return accentColors[userId % accentColors.length];
}

export function Feed({ posts, query, onSearch }: { posts: Post[]; query: string; onSearch: (q: string) => void }) {
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
                {posts.map(post => (
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
                                <span>👍 {post.reactions.likes} · 👁 {post.views} views</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}