import { useState } from "react";
import type { FormEvent } from "react";
import { createPost } from "./api";
import { Post } from "./Types";
import {hasReachedPostLimit} from "./storage";

export function CreatePost({ onCreate }: { onCreate: (post: Post) => void }) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const limitReached = hasReachedPostLimit();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        //Checks for limit reached and stops new post from being posted further
        if (hasReachedPostLimit()) {
            return;
        }

        await createPost(title, body);
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
    //Uses the boolean value above to know if it's true and shows the website user that the limit is reached
    if (limitReached) {
        return <p>Post limit reached sir/madamd</p>;
    }
    return (
        <form onSubmit={handleSubmit}  className="flex flex-col gap-2 mb-4">

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