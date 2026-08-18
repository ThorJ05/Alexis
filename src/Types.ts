export interface Root {
    posts: Post[];
    total: number;
    skip: number;
    limit: number;
}

export interface Post {
    id: number;
    title: string;
    body: string;
    tags: string[];
    reactions: Reactions;
    views: number;
    userId: number;
}

export interface Reactions {
    likes: number;
    dislikes: number;
}

export interface Comment {
    id: number;
    body: string;
    postId: number;
    user: {
        id: number;
        username: string;
    };
}