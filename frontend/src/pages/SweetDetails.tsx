import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiClock, FiUser, FiArrowLeft, FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface Comment {
    user: string;
    username: string;
    text: string;
    createdAt: string;
    _id: string;
}

interface Sweet {
    _id: string;
    name: string;
    description?: string;
    price: number;
    category: string;
    image?: string;
    comments: Comment[];
}

const SweetDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [sweet, setSweet] = useState<Sweet | null>(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const { user } = useAuth();
    const { addToCart } = useCart();

    useEffect(() => {
        fetchSweet();
    }, [id]);

    const fetchSweet = async () => {
        try {
            const res = await api.get('/sweets');
            if (res.data.sweets) {
                const found = res.data.sweets.find((s: Sweet) => s._id === id);
                setSweet(found);
            } else {
                const found = res.data.find((s: Sweet) => s._id === id);
                setSweet(found);
            }
        } catch (error) {
            console.error('Failed to fetch sweet details', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            const res = await api.post(`/sweets/${id}/comments`, { text: commentText });
            setSweet(res.data);
            setCommentText('');
            toast.success('Comment added!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add comment');
        }
    };

    const handleAddToCart = async () => {
        if (!sweet) return;
        try {
            await addToCart(sweet._id, 1);
            toast.success('Added to cart!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add to cart');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-chocolate-200 border-t-gold-500 rounded-full animate-spin"></div>
        </div>
    );

    if (!sweet) return (
        <div className="container mx-auto px-4 py-20 text-center">
            <div className="text-chocolate-400 text-6xl mb-4">?</div>
            <h2 className="text-2xl font-bold text-chocolate-900 mb-4">Sweet not found</h2>
            <Link to="/shop" className="text-gold-600 hover:text-gold-700 font-medium">Browse Shop</Link>
        </div>
    );

    return (
        <div className="min-h-screen pb-20">
            {/* Breadcrumb / Back Navigation */}
            <div className="bg-white border-b border-chocolate-50 sticky top-16 z-10 backdrop-blur-md bg-white/80">
                <div className="container mx-auto px-4 py-4">
                    <Link to="/shop" className="inline-flex items-center gap-2 text-chocolate-500 hover:text-gold-600 transition-colors text-sm font-medium group">
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        Back to Shop
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden mb-12 border border-chocolate-50">
                    <div className="grid md:grid-cols-2 gap-0">
                        {/* Image Section */}
                        <div className="relative group overflow-hidden bg-gradient-to-br from-chocolate-100 to-chocolate-50 h-[400px] md:h-[600px]">
                            {sweet.image ? (
                                <img
                                    src={sweet.image}
                                    alt={sweet.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-chocolate-200 text-8xl">🍬</div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* Details Section */}
                        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="px-4 py-1.5 bg-gold-100 text-gold-700 rounded-full text-xs font-bold uppercase tracking-wider">{sweet.category}</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-chocolate-900 mb-6 leading-tight">
                                {sweet.name}
                            </h1>

                            <div className="flex items-end gap-4 mb-8">
                                <span className="text-4xl font-bold text-gold-600">${sweet.price}</span>
                                <span className="text-chocolate-400 text-lg mb-1 line-through opacity-50">${(sweet.price * 1.2).toFixed(2)}</span>
                            </div>

                            <div className="prose prose-chocolate mb-10 text-chocolate-600 leading-relaxed text-lg">
                                <p>{sweet.description || 'A delightful treat crafted with premium ingredients for the ultimate indulgence.'}</p>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-chocolate-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-chocolate-800 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0"
                                >
                                    <FiShoppingCart size={20} />
                                    Add to Cart
                                </button>
                                <button className="p-4 border-2 border-chocolate-100 rounded-xl text-chocolate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all">
                                    <FiHeart size={24} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews / Comments Section */}
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-serif font-bold text-chocolate-900">
                            Customer Reviews
                            <span className="ml-3 text-lg font-sans text-chocolate-400 font-normal">({sweet.comments?.length || 0})</span>
                        </h2>
                    </div>

                    {user ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-chocolate-100 mb-10"
                        >
                            <label className="block text-sm font-bold text-chocolate-900 mb-3 ml-1">Write a Review</label>
                            <form onSubmit={handleAddComment}>
                                <div className="relative">
                                    <textarea
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="How was your experience with this sweet?"
                                        className="w-full p-4 rounded-xl bg-chocolate-50 border border-transparent focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-100 transition-all outline-none resize-none min-h-[120px]"
                                    />
                                    <div className="absolute bottom-3 right-3 text-xs text-chocolate-400">
                                        {commentText.length} chars
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={!commentText.trim()}
                                        className="bg-gold-500 text-white px-8 py-2.5 rounded-lg font-medium hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
                                    >
                                        Post Review
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    ) : (
                        <div className="bg-gradient-to-r from-chocolate-900 to-chocolate-800 p-8 rounded-2xl text-center mb-10 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10 text-white transform translate-x-10 -translate-y-10">
                                <FiUser size={100} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 relative z-10">Join the conversation</h3>
                            <p className="text-chocolate-200 mb-6 relative z-10">Log in to share your thoughts with other sweet lovers.</p>
                            <Link
                                to="/login"
                                className="inline-block bg-white text-chocolate-900 px-8 py-3 rounded-full font-bold hover:bg-gold-50 transition-colors relative z-10 shadow-lg"
                            >
                                Login to Review
                            </Link>
                        </div>
                    )}

                    <div className="space-y-6">
                        {sweet.comments?.length > 0 ? (
                            sweet.comments.map((comment, idx) => (
                                <motion.div
                                    key={comment._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white p-6 rounded-2xl border border-chocolate-50 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gold-400 to-gold-200 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                                {(comment.username || 'A').charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-chocolate-900">{comment.username || 'Anonymous'}</h4>
                                                <div className="flex text-gold-400 text-xs">
                                                    ★★★★★
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-chocolate-400 flex items-center gap-1 bg-chocolate-50 px-3 py-1 rounded-full">
                                            <FiClock size={12} />
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-chocolate-700 leading-relaxed pl-14">{comment.text}</p>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-chocolate-200">
                                <div className="w-16 h-16 bg-chocolate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-chocolate-300">
                                    <FiUser size={24} />
                                </div>
                                <p className="text-chocolate-500 font-medium">No reviews yet.</p>
                                <p className="text-chocolate-400 text-sm">Be the first to share your experience!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SweetDetails;
