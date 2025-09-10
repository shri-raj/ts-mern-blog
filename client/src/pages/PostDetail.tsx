// client/src/pages/PostDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

interface Post {
    title: string;
    content: string;
    author: { name: string | null };
    createdAt: string;
}

const PostDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/posts/${id}`);
                setPost(response.data);
            } catch (err) {
                console.error("Failed to fetch post", err);
                setError("Could not load the post. It may have been deleted or the link is incorrect.");
            } finally {
                setIsLoading(false);
            }
        };
        if (id) {
            fetchPost();
        }
    }, [id]);

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric", hour: '2-digit', minute: '2-digit'
    });

    if (isLoading) return <p className="text-center text-gray-500">Loading post...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!post) return <p className="text-center">Post not found.</p>;

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-lg rounded-lg">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{post.title}</h1>
            <div className="text-sm text-gray-500 mb-6">
                <span>By {post.author?.name || 'Anonymous'}</span>
                <span className="mx-2">|</span>
                <span>{formatDate(post.createdAt)}</span>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap">
                {post.content}
            </div>
        </div>
    );
};

export default PostDetail;