import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        setError('');

        try {
            console.log('Form submitted with:', { email, password: '****' });

            const response = await api.post('/auth/login', {
                email,
                password
            }).catch(err => {
                console.log('API call error:', err);
                throw err;
            });

            console.log('Server response received:', response);

            if (response?.data?.token) {
                console.log('Token received, storing...');
                localStorage.setItem('token', response.data.token);
                console.log('Navigating to home...');
                navigate('/');
            } else {
                throw new Error('No token received from server');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed';
            console.error('Login error:', errorMessage);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={handleSubmit} className="p-8 border rounded-lg shadow-lg w-96">
                <h2 className="text-2xl mb-4">Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                    disabled={isLoading}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                    disabled={isLoading}
                />
                {error && (
                    <div className="mb-4 p-2 text-red-500 bg-red-100 rounded">
                        {error}
                    </div>
                )}
                <button
                    type="submit"
                    className={`w-full text-white p-2 rounded ${isLoading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;