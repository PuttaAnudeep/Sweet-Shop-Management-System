import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import { FiStar, FiHeart, FiShield, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

interface Sweet {
    _id: string;
    name: string;
    description?: string;
    price: number;
    category: string;
    image?: string;
    stock: number;
}

const Home = () => {
    const [featuredSweets, setFeaturedSweets] = useState<Sweet[]>([]);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                // Fetch first 3 sweets as "Featured"
                const res = await api.get('/sweets?limit=3');
                if (res.data.sweets) {
                    setFeaturedSweets(res.data.sweets);
                } else if (Array.isArray(res.data)) {
                    setFeaturedSweets(res.data.slice(0, 3));
                }
            } catch (error) {
                console.error('Failed to fetch featured sweets', error);
            }
        };
        fetchFeatured();
    }, []);

    const handleAddToCart = async (id: string) => {
        try {
            await addToCart(id, 1);
            toast.success('Added to cart!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add to cart');
        }
    };

    return (
        <div className="flex flex-col w-full">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] bg-gradient-to-b from-chocolate-50 to-white flex items-center overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-chocolate-100/20 rounded-l-[10rem] transform translate-x-20"></div>

                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-chocolate-900 leading-tight mb-6">
                            Welcome to <span className="text-gold-500">SweetShop</span>
                        </h1>
                        <p className="text-lg md:text-xl text-chocolate-600 mb-8 max-w-lg leading-relaxed">
                            Discover the finest collection of handcrafted sweets, chocolates, and confections. From classic favorites to exotic delicacies, we bring sweetness to every moment.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/shop" className="bg-gradient-to-r from-gold-500 to-gold-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:from-gold-600 hover:to-gold-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2">
                                Shop Now <FiArrowRight />
                            </Link>
                            <Link to="/shop" className="px-8 py-4 rounded-full text-lg font-medium text-chocolate-900 border-2 border-chocolate-200 hover:border-chocolate-900 transition-all hover:bg-chocolate-50">
                                Our Sweets
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative z-10 bg-white p-4 rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <img
                                src="/sweets/delicious cupcake.jpg"
                                alt="Delicious Cupcake"
                                className="w-full h-[500px] object-cover rounded-2xl"
                            />
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute top-10 -right-10 w-24 h-24 bg-gold-200/50 rounded-full blur-xl animate-pulse"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-chocolate-200/50 rounded-full blur-xl animate-pulse delay-700"></div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-serif font-bold text-chocolate-900 mb-4">Why Choose SweetShop?</h2>
                        <p className="text-chocolate-600 max-w-2xl mx-auto">We are committed to bringing you the highest quality sweets with exceptional service.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-chocolate-50 p-8 rounded-2xl text-center border border-chocolate-100 hover:border-gold-300 hover:shadow-lg transition-all"
                        >
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-gold-500">
                                <FiStar size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-chocolate-900 mb-3">Premium Quality</h3>
                            <p className="text-chocolate-600 text-sm leading-relaxed">
                                Hand-selected ingredients and traditional recipes ensure every sweet meets our high standards.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-chocolate-50 p-8 rounded-2xl text-center border border-chocolate-100 hover:border-gold-300 hover:shadow-lg transition-all"
                        >
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-gold-500">
                                <FiHeart size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-chocolate-900 mb-3">Authentic Taste</h3>
                            <p className="text-chocolate-600 text-sm leading-relaxed">
                                Experience the true essence of traditional flavors, crafted with passion and time-honored recipes.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-chocolate-50 p-8 rounded-2xl text-center border border-chocolate-100 hover:border-gold-300 hover:shadow-lg transition-all"
                        >
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-gold-500">
                                <FiShield size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-chocolate-900 mb-3">Secure Shopping</h3>
                            <p className="text-chocolate-600 text-sm leading-relaxed">
                                Your personal information and payments are protected with industry-leading security.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Featured Sweets Section */}
            <section className="py-24 bg-chocolate-50/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-serif font-bold text-chocolate-900 mb-4">Featured Sweets</h2>
                        <p className="text-chocolate-600">Discover our most popular and beloved confections</p>
                    </div>

                    {featuredSweets.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 max-w-6xl mx-auto">
                            {featuredSweets.map((sweet) => (
                                <ProductCard
                                    key={sweet._id}
                                    id={sweet._id}
                                    name={sweet.name}
                                    price={sweet.price}
                                    description={sweet.description}
                                    image={sweet.image}
                                    onAddToCart={handleAddToCart}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">Loading featured sweets...</div>
                    )}

                    <div className="text-center">
                        <Link to="/shop" className="inline-block bg-chocolate-900 text-gold-400 px-8 py-3 rounded-full font-medium hover:bg-chocolate-800 transition-colors shadow-lg">
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-br from-gold-500 to-chocolate-600 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 pattern-dots"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Ready to Satisfy Your Sweet Tooth?</h2>
                    <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                        Join thousands of happy customers who trust SweetShop for their confection needs.
                    </p>
                    <Link to="/register" className="inline-block bg-white text-chocolate-900 px-10 py-4 rounded-full text-lg font-bold hover:bg-chocolate-50 transition-all shadow-xl transform hover:-translate-y-1">
                        Create Your Account
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
