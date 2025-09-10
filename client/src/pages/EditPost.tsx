// client/src/pages/EditPost.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const EditPost: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/posts/${id}`);
                setTitle(response.data.title);
                setContent(response.data.content || '');
            } catch (err) {
                console.error("Failed to fetch post for editing", err);
                setError("Could not load the post. You may not have permission or the post may not exist.");
            } finally {
                setIsLoading(false);
            }
        };
        if (id) {
            fetchPost();
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!title) {
            setError('Title is required.');
            return;
        }

        try {
            await api.put(`/posts/${id}`, { title, content });
            navigate('/'); // Redirect to home after successful update
        } catch (err) {
            console.error('Failed to update post', err);
            setError('Post could not be updated. Please try again.');
        }
    };

    if (isLoading) {
        return <p className="text-center text-gray-500">Loading post for editing...</p>;
    }

    return (
        <div className="w-full max-w-2xl mx-auto mt-10">
            <form onSubmit={handleSubmit} className="p-8 bg-white border rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-center">Edit Your Post</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <div className="mb-4">
                    <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full p-2 border rounded shadow-sm"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="content" className="block text-gray-700 font-bold mb-2">Content</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        className="w-full p-2 border rounded shadow-sm h-48"
                    />
                </div>
                <button type="submit" className="w-full bg-green-500 text-white p-3 rounded-lg font-bold hover:bg-green-600">
                    Update Post
                </button>
            </form>
        </div>
    );
};

export default EditPost;