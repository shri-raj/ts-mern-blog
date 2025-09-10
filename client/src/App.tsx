// client/src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import Qna from './pages/Qna';
import Navbar from './components/Navbar';
import React from 'react';
import EditPost from './pages/EditPost';
import PostDetail from './pages/PostDetail';

const ProtectedRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
    const token = localStorage.getItem('token');
    const location = window.location.pathname;

    // Don't redirect if we're already on login or register page
    if (!token && location !== '/login' && location !== '/register') {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

function App() {
    return (
        <Router>
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/ask"
                        element={
                            <ProtectedRoute>
                                <Qna />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/post/:id"
                        element={
                            <ProtectedRoute>
                                <PostDetail />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/create-post"
                        element={
                            <ProtectedRoute>
                                <CreatePost />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/edit-post/:id"
                        element={
                            <ProtectedRoute>
                                <EditPost />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </main>
        </Router>
    )
}

export default App;