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

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/auth/register', { name, email, password });
            // After successful registration, redirect to login
            navigate('/login');
        } catch (err: unknown) {
            console.error('Registration failed', err);
            if (
                isAxiosError(err) && err.response?.data?.message
            ) {
                setError(err.response.data.message);
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center mt-10">
            <form onSubmit={handleSubmit} className="p-8 bg-white border rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                    minLength={6}
                    required
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;