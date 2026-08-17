import { useState } from "react";
import postsData from "./posts.json";
import { Post } from "./Types";

export function Feed() {
    const [posts] = useState<Post[]>(postsData);

    // Søgefelt (brugeren skriver tekst)
    const [search, setSearch] = useState("");

    // Filtrer posts efter title
    const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <h1>Feed</h1>

            {/* Søgefelt */}
            <input
                type="text"
                placeholder="Søg efter titel..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            {/* Facebook-style feed: viser ALLE posts som default */}
            {filtered.map(post => (
                <div key={post.id} style={{ marginBottom: "20px" }}>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                    <small>{post.created_at}</small>
                </div>
            ))}
        </div>
    );
}
