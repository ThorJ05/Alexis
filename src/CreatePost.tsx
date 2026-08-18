import { useState } from "react";
import type { FormEvent } from "react";
import { createPost } from "./api";
import { Post } from "./Types";

export function CreatePost({ onCreate }: { onCreate: (post: Post) => void }) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        await createPost(title, body); // hits the real API, dummyjson just won't save it server-side

        onCreate({
            id: Date.now(),
            title,
            body,
            tags: [],
            reactions: { likes: 0, dislikes: 0 },
            views: 0,
            userId: 0,
        });

        setTitle("");
        setBody("");
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
            <input
                className="input input-bordered w-full"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Title"
                required
            />
            <textarea
                className="textarea textarea-bordered w-full"
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder="What's on your mind?"
                required
            />
            <button type="submit" className="btn btn-primary self-end">Post</button>
        </form>
    );
}