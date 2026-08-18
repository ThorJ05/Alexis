import { useState, useEffect } from "react";
import { Feed } from "./Feed";
import { CreatePost } from "./CreatePost";
import { Post } from "./Types";

export function App() {
    const [dark, setDark] = useState(() => localStorage.getItem("theme") === "y-dark");
    const [posts, setPosts] = useState<Post[]>([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        const theme = dark ? "y-dark" : "y-light";
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [dark]);

    useEffect(() => {
        const url = query.trim()
            ? `https://dummyjson.com/posts/search?q=${encodeURIComponent(query)}`
            : "https://dummyjson.com/posts?limit=50";

        fetch(url)
            .then(res => res.json())
            .then(json => setPosts(json.posts));
    }, [query]);

    function addPost(newPost: Post) {
        setPosts(prev => [newPost, ...prev]);
    }

    return (
        <div className="min-h-screen bg-base-100">
            <div className="navbar bg-base-100 px-4">
                <span className="text-2xl font-semibold">Y</span>
                <div className="flex-1" />
                <label className="swap swap-rotate ml-2">
                    <input type="checkbox" checked={dark} onChange={e => setDark(e.target.checked)} />
                    <span className="swap-off">Light</span>
                    <span className="swap-on">Dark</span>
                </label>
            </div>

            <div className="max-w-2xl mx-auto p-4">
                <CreatePost onCreate={addPost} />
                <Feed posts={posts} query={query} onSearch={setQuery} />
            </div>
        </div>
    );
}

export default App;