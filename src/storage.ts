import { useState } from "react";
import { Post, Comment } from "./Types";

const LIKED_KEY = "likedPostIds";
const CUSTOM_POSTS_KEY = "customPosts";
const CUSTOM_COMMENTS_KEY = "customComments";
const DELETED_COMMENTS_KEY = "deletedCommentIds";
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

// ---- Custom comments (comments on locally-created posts) ----
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

export function deleteCustomComment(postId: number, commentId: number) {
    const all = loadCustomComments();
    all[postId] = (all[postId] ?? []).filter(c => c.id !== commentId);
    localStorage.setItem(CUSTOM_COMMENTS_KEY, JSON.stringify(all));
}

// ---- Locally-added comments on real dummyjson posts (their API doesn't actually persist adds) ----
const EXTRA_COMMENTS_KEY = "extraComments";

function loadExtraComments(): Record<number, Comment[]> {
    try {
        const raw = localStorage.getItem(EXTRA_COMMENTS_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

export function getExtraComments(postId: number): Comment[] {
    const all = loadExtraComments();
    return all[postId] ?? [];
}

export function addExtraComment(postId: number, comment: Comment) {
    const all = loadExtraComments();
    all[postId] = [comment, ...(all[postId] ?? [])];
    localStorage.setItem(EXTRA_COMMENTS_KEY, JSON.stringify(all));
}

export function deleteExtraComment(postId: number, commentId: number) {
    const all = loadExtraComments();
    all[postId] = (all[postId] ?? []).filter(c => c.id !== commentId);
    localStorage.setItem(EXTRA_COMMENTS_KEY, JSON.stringify(all));
}

// ---- Deleted comment tracking (for dummyjson's own seeded comments, since their API doesn't persist deletes) ----
function loadDeletedCommentIds(): Set<number> {
    try {
        const raw = localStorage.getItem(DELETED_COMMENTS_KEY);
        return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
        return new Set();
    }
}

export function markCommentDeleted(commentId: number) {
    const ids = loadDeletedCommentIds();
    ids.add(commentId);
    localStorage.setItem(DELETED_COMMENTS_KEY, JSON.stringify([...ids]));
}

export function filterDeletedComments(comments: Comment[]): Comment[] {
    const deleted = loadDeletedCommentIds();
    return comments.filter(c => !deleted.has(c.id));
}