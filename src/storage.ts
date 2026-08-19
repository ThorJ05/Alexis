import { useState } from "react";
import { Post, Comment } from "./Types";

const LIKED_KEY = "likedPostIds";
const CUSTOM_POSTS_KEY = "customPosts";
const CUSTOM_COMMENTS_KEY = "customComments";
const MAX_CUSTOM_POSTS = 12;

const MAX_TITLE_LENGTH = 100;
const MAX_BODY_LENGTH = 500;

export function postLimits() {
    return { MAX_TITLE_LENGTH, MAX_BODY_LENGTH };
}

export function isPostTooLong(title: string, body: string): boolean {
    return title.length > MAX_TITLE_LENGTH || body.length > MAX_BODY_LENGTH;
}

// ---- Likes ----
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

// ---- Custom posts ----
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

export function hasReachedPostLimit(): boolean {
    return getCustomPosts().length >= MAX_CUSTOM_POSTS;
}

export function deleteCustomPost(id: number) {
    const posts = getCustomPosts().filter(p => p.id !== id);
    localStorage.setItem(CUSTOM_POSTS_KEY, JSON.stringify(posts));
}

// ---- Custom comments ----
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