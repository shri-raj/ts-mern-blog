import React, { useState } from 'react';
import api from '../services/api';

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

const Qna: React.FC = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;

        setIsLoading(true);
        setError('');
        setAnswer('');

        try {
            const response = await api.post('/qa/ask', { question });
            setAnswer(response.data.answer);
        } catch (err: unknown) {
            console.error('Error asking question:', err);
            if (isAxiosError(err) && err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('An error occurred while fetching the answer. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto mt-10">
            <div className="p-8 bg-white border rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-center">Ask a Question</h2>
                <p className="text-center text-gray-600 mb-6">
                    Ask anything about the content of our blog posts, and the AI will try to find an answer.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="e.g., What is MERN stack?"
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                            className="flex-grow p-3 border rounded-l-lg shadow-sm"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="bg-purple-600 text-white p-3 rounded-r-lg font-bold hover:bg-purple-700 disabled:bg-purple-300"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Thinking...' : 'Ask'}
                        </button>
                    </div>
                </form>

                {error && <p className="text-red-500 text-center mt-4">{error}</p>}

                {answer && (
                    <div className="mt-8 p-4 bg-gray-100 border-l-4 border-purple-500 rounded">
                        <h3 className="text-xl font-semibold mb-2">Answer:</h3>
                        <p className="text-gray-800 whitespace-pre-wrap">{answer}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Qna;