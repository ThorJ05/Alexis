import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Feed } from "./Feed";
import { CreatePost } from "./CreatePost";
import { PostPage } from "./PostPage";
import { Post } from "./Types";
import { getCustomPosts, saveCustomPost, deleteCustomPost, isCustomPostId } from "./storage";
import { deletePost } from "./api";

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
            .then(json => {
                const custom = query.trim() ? [] : getCustomPosts();
                setPosts([...custom, ...json.posts]);
            });
    }, [query]);

    function addPost(newPost: Post) {
        saveCustomPost(newPost);
        setPosts(prev => [newPost, ...prev]);
    }

    function adjustLikes(id: number, delta: number) {
        setPosts(prev =>
            prev.map(post =>
                post.id === id
                    ? { ...post, reactions: { ...post.reactions, likes: post.reactions.likes + delta } }
                    : post
            )
        );
    }

    async function removePost(id: number) {
        if (isCustomPostId(id)) {
            deleteCustomPost(id);
        } else {
            await deletePost(id);
        }
        setPosts(prev => prev.filter(post => post.id !== id));
    }

    return (
        <BrowserRouter>
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
                <Routes>
                    <Route
                        path="/"
                        element={
                            <div className="max-w-2xl mx-auto p-4">
                                <CreatePost onCreate={addPost} />
                                <Feed
                                    posts={posts}
                                    query={query}
                                    onSearch={setQuery}
                                    onLikeChange={adjustLikes}
                                    onDelete={removePost}
                                />
                            </div>
                        }
                    />
                    <Route path="/post/:id" element={<PostPage onDelete={removePost} />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;