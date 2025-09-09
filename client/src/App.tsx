import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import Qna from './pages/Qna';
import Navbar from './components/Navbar';
import React from 'react';
// A simple component to protect routes
const ProtectedRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to. This allows us to send them back after they log in.
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};


function App() {
    return (
        <Router>
            {/* Navbar will be displayed on all pages */}
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/ask" element={<Qna />} />

                    {/* Protected Routes */}
                    <Route
                        path="/create-post"
                        element={
                            <ProtectedRoute>
                                <CreatePost />
                            </ProtectedRoute>
                        }
                    />

                    {/* Add other routes here, e.g., for viewing a single post */}
                    {/* <Route path="/post/:id" element={<PostDetail />} /> */}
                </Routes>
            </main>
        </Router>
    )
}

export default App