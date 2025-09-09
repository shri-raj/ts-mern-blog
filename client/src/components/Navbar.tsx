import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    // We use a state variable to force re-render when auth status changes
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('authToken'));

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        navigate('/login');
    };

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthenticated(!!localStorage.getItem('authToken'));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);


    return (
        <nav className="bg-gray-800 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <Link to="/" className="text-2xl font-bold hover:text-gray-300">
                        MERN Blog
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="hover:text-gray-300">Home</Link>
                        <Link to="/ask" className="hover:text-gray-300">Ask Q&A</Link>
                        {isAuthenticated ? (
                            <>
                                <Link to="/create-post" className="hover:text-gray-300">Create Post</Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="hover:text-gray-300">Login</Link>
                                <Link to="/register" className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;