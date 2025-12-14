import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import { FiSearch } from 'react-icons/fi';
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

const Shop = () => {
    const [sweets, setSweets] = useState<Sweet[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const { addToCart } = useCart();

    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchSweets();
    }, [search, category, currentPage]);

    const fetchSweets = async () => {
        try {
            setLoading(true);
            let query = `/sweets?page=${currentPage}&limit=8&`;
            if (search) query += `search=${search}&`;
            if (category) query += `category=${category}&`;

            const res = await api.get(query);

            if (res.data.sweets) {
                setSweets(res.data.sweets);
                setTotalPages(res.data.totalPages);
            } else {
                setSweets(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch sweets', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (id: string) => {
        try {
            await addToCart(id, 1);
            toast.success('Added to cart!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add to cart');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-4xl font-serif font-bold text-chocolate-900">Our Collection</h1>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-grow-0">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-chocolate-400" />
                        <input
                            type="text"
                            placeholder="Search sweets..."
                            className="pl-10 pr-4 py-2 rounded-full border border-chocolate-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none w-full"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    <select
                        className="px-4 py-2 rounded-full border border-chocolate-200 focus:border-gold-500 outline-none bg-white"
                        value={category}
                        onChange={(e) => { setCategory(e.target.value); setCurrentPage(1); }}
                    >
                        <option value="">All Categories</option>
                        {['Bengali Sweets', 'Traditional', 'Ghee Sweets', 'Milk Sweets', 'Dry Fruit Sweets', 'Syrup Sweets', 'Halwa'].map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="h-80 bg-chocolate-50 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <>
                    {sweets.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-chocolate-600 text-lg">No sweets found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {sweets.map((sweet) => (
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
                    )}

                    {totalPages > 1 && (
                        <div className="flex justify-center gap-4 mt-8">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-6 py-2 rounded-full border border-chocolate-200 text-chocolate-700 hover:bg-chocolate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <span className="flex items-center text-chocolate-900 font-medium">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-6 py-2 rounded-full bg-chocolate-900 text-white hover:bg-chocolate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Shop;
