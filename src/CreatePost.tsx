import { useState } from "react";
import type { FormEvent } from "react";
import { createPost } from "./api";
import { Post } from "./Types";
import { hasReachedPostLimit, isPostTooLong, postLimits } from "./storage";

export function CreatePost({ onCreate }: { onCreate: (post: Post) => void }) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const limitReached = hasReachedPostLimit();
    const { MAX_TITLE_LENGTH, MAX_BODY_LENGTH } = postLimits();
    const tooLong = isPostTooLong(title, body);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (hasReachedPostLimit() || isPostTooLong(title, body)) {
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

    if (limitReached) {
        return <p>Post limit reached sir/madamd</p>;
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
            <span className={`text-xs ${title.length > MAX_TITLE_LENGTH ? "text-error" : "opacity-60"}`}>
                {title.length}/{MAX_TITLE_LENGTH}
            </span>

            <textarea
                className="textarea textarea-bordered w-full"
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder="What's on your mind?"
                required
            />
            <span className={`text-xs ${body.length > MAX_BODY_LENGTH ? "text-error" : "opacity-60"}`}>
                {body.length}/{MAX_BODY_LENGTH}
            </span>

            {tooLong && (
                <p className="text-error text-sm">Titel eller opslag er for langt.</p>
            )}

            <button type="submit" className="btn btn-primary self-end" disabled={tooLong}>
                Post
            </button>
        </form>
    );
}