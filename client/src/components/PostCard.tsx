import React from "react";
import { Link } from "react-router-dom";

interface Post {
    id: string;
    title: string;
    content?: string | null;
    author: { name: string | null };
    createdAt: string;
}

interface PostCardProps {
    post: Post;
}
const PostCard: React.FC<PostCardProps> = ({ post }) => {

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const contentSnippet = post.content ? post.content.substring(0, 120) + '...' : 'No content available';

    return (
        <div className="border rounded-lg shadow-md bg-white overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <div className="p-6">
                <div className="mb-4">
                    <p className="text-sm text-gray-500">By {post.author.name || 'Anonymous'}</p>
                    <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-gray-800">
                    {/* In a full app, this Link would go to /post/${post.id} */}
                    <Link to={`/`} className="hover:text-blue-600">{post.title}</Link>
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    {contentSnippet}
                </p>
            </div>
            <div className="px-6 py-4 bg-gray-50">
                <Link to={`/`} className="font-semibold text-blue-500 hover:text-blue-700">
                    Read More &rarr;
                </Link>
            </div>
        </div>
    );
};

export default PostCard;