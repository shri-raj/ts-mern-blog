import React from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface Post {
    id: string;
    title: string;
    content?: string | null;
    author: {
        id: string;
        name: string | null
    };
    createdAt: string;
}

interface PostCardProps {
    post: Post;
    onDelete: (id: string) => void;
}

interface DecodedToken {
    userId: string;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
    const token = localStorage.getItem("token");
    let currentUserId: string | null = null;

    if (token) {
        try {
            const decodedToken = jwtDecode<DecodedToken>(token);
            currentUserId = decodedToken.userId;
        } catch (error) {
            console.error("Failed to decode token:", error);
        }
    }

    const isAuthor = post.author && post.author.id === currentUserId;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const contentSnippet = post.content ? post.content.substring(0, 120) + '...' : 'No content available';

    return (
        <div className="border rounded-lg shadow-md bg-white flex flex-col justify-between transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <div className="p-6">
                <div className="mb-4">
                    <p className="text-sm text-gray-500">By {post.author?.name || 'Anonymous'}</p>
                    <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-gray-800">
                    <Link to={`/post/${post.id}`} className="hover:text-blue-600">{post.title}</Link>
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    {contentSnippet}
                </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
                <Link to={`/post/${post.id}`} className="font-semibold text-blue-500 hover:text-blue-700">
                    Read More &rarr;
                </Link>
                {/* **NEW**: Conditionally render Edit and Delete buttons */}
                {isAuthor && (
                    <div className="flex space-x-4">
                        <Link to={`/edit-post/${post.id}`} className="font-semibold text-green-500 hover:text-green-700">
                            Edit
                        </Link>
                        <button
                            onClick={() => onDelete(post.id)}
                            className="font-semibold text-red-500 hover:text-red-700"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostCard;