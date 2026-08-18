import { useState } from "react";
import { Post, Comment } from "./Types";

const LIKED_KEY = "likedPostIds";
const CUSTOM_POSTS_KEY = "customPosts";
const CUSTOM_COMMENTS_KEY = "customComments";

// ---- Likes (which posts the user has liked, so we can toggle) ----
function loadLikedIds(): Set<number> {
    try {
        const raw = localStorage.getItem(LIKED_KEY);
        return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
        return new Set();
    }
}

function saveLikedIds(ids: Set<number>) {
    localStorage.setItem(LIKED_KEY, JSON.stringify([...ids]));
}

export function useLikedPosts() {
    const [likedIds, setLikedIds] = useState<Set<number>>(() => loadLikedIds());

    function toggleLike(id: number) {
        setLikedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            saveLikedIds(next);
            return next;
        });
    }

    return { likedIds, toggleLike };
}

// ---- Posts the user created locally (dummyjson won't actually store these) ----
export function getCustomPosts(): Post[] {
    try {
        const raw = localStorage.getItem(CUSTOM_POSTS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function saveCustomPost(post: Post) {
    const posts = getCustomPosts();
    localStorage.setItem(CUSTOM_POSTS_KEY, JSON.stringify([post, ...posts]));
}

export function getCustomPost(id: number): Post | undefined {
    return getCustomPosts().find(p => p.id === id);
}

export function isCustomPostId(id: number): boolean {
    return getCustomPosts().some(p => p.id === id);
}

export function deleteCustomPost(id: number) {
    const posts = getCustomPosts().filter(p => p.id !== id);
    localStorage.setItem(CUSTOM_POSTS_KEY, JSON.stringify(posts));
}

// ---- Comments on those locally-created posts ----
function loadCustomComments(): Record<number, Comment[]> {
    try {
        const raw = localStorage.getItem(CUSTOM_COMMENTS_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

export function getCustomComments(postId: number): Comment[] {
    const all = loadCustomComments();
    return all[postId] ?? [];
}

export function addCustomComment(postId: number, comment: Comment) {
    const all = loadCustomComments();
    all[postId] = [comment, ...(all[postId] ?? [])];
    localStorage.setItem(CUSTOM_COMMENTS_KEY, JSON.stringify(all));
}