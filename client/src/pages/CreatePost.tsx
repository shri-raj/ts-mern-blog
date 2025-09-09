import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface AxiosErrorResponse {
    response?: {
        data?: {
            message?: string;
        };
    };
}

function isAxiosError(error: unknown): error is AxiosErrorResponse {
    return (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: unknown }).response === 'object'
    );
}

const CreatePost: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!title) {
            setError('Title is required.');
            return;
        }

        try {
            await api.post('/posts', { title, content });
            navigate('/'); // Redirect to home page after successful creation
        } catch (err: unknown) {
            console.error('Failed to create post', err);
            if (isAxiosError(err) && err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Post could not be created. Please try again.');

            }
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-10">
            <form onSubmit={handleSubmit} className="p-8 bg-white border rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-center">Create a New Post</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <div className="mb-4">
                    <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title</label>
                    <input
                        id="title"
                        type="text"
                        placeholder="Your Post Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full p-2 border rounded shadow-sm"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="content" className="block text-gray-700 font-bold mb-2">Content</label>
                    <textarea
                        id="content"
                        placeholder="Write your thoughts..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        className="w-full p-2 border rounded shadow-sm h-48"
                    />
                </div>
                <button type="submit" className="w-full bg-green-500 text-white p-3 rounded-lg font-bold hover:bg-green-600">
                    Publish Post
                </button>
            </form>
        </div>
    );
};

export default CreatePost;