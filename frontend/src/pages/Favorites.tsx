import { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface Sweet {
    _id: string;
    name: string;
    description?: string;
    price: number;
    category: string;
    image?: string;
    stock: number;
}

const Favorites = () => {
    const [sweets, setSweets] = useState<Sweet[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { user } = useAuth();

    useEffect(() => {
        fetchFavorites();
    }, [user?.favorites]); // Refetch or filter when favorites change

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const res = await api.get('/users/favorites');
            setSweets(res.data);
        } catch (error) {
            console.error('Failed to fetch favorites', error);
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
            <h1 className="text-4xl font-serif font-bold text-chocolate-900 mb-8">My Favorites</h1>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-80 bg-chocolate-50 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <>
                    {sweets.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-chocolate-600 text-lg mb-6">You haven't added any favorites yet.</p>
                            <Link to="/shop" className="bg-chocolate-900 text-white px-8 py-3 rounded-full hover:bg-chocolate-800 transition-colors">
                                Browse Sweets
                            </Link>
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
                </>
            )}
        </div>
    );
};

export default Favorites;
