import React, { useEffect, useState } from 'react';
import api from '../services/api';
import PostCard from '../components/PostCard';

interface Post {
    id: string;
    title: string;
    content: string;
    author: { name: string };
    createdAt: string;
}

const Home: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/posts');
                setPosts(response.data);
                setError(null);
            } catch (error) {
                console.error("Failed to fetch posts", error);
                setError("Failed to load posts. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Latest Posts</h1>
            {isLoading ? (
                <p className="text-center text-gray-500">Loading posts...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-600">No posts have been published yet.</p>
            )}
        </div>
    );
};

export default Home;