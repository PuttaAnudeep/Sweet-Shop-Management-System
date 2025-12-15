import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface ProductCardProps {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    onAddToCart: (id: string) => void;
}

const ProductCard = ({ id, name, description, price, image, onAddToCart }: ProductCardProps) => {
    const { user, updateUser } = useAuth();
    const isFavorite = user?.favorites?.includes(id);

    const handleToggleFavorite = async () => {
        if (!user) {
            toast.error('Please login to add to favorites');
            return;
        }

        try {
            if (isFavorite) {
                const res = await api.delete(`/users/favorites/${id}`);
                updateUser({ ...user, favorites: res.data.favorites });
                toast.success('Removed from favorites');
            } else {
                const res = await api.post('/users/favorites', { sweetId: id });
                updateUser({ ...user, favorites: res.data.favorites });
                toast.success('Added to favorites');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update favorites');
        }
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-chocolate-100 hover:shadow-xl transition-all relative"
        >
            <div className="h-48 bg-chocolate-100 flex items-center justify-center overflow-hidden relative group">
                <Link to={`/product/${id}`} className="block w-full h-full">
                    {image ? (
                        <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-chocolate-300 text-4xl font-serif">🍬</div>
                    )}
                </Link>

                <button
                    onClick={handleToggleFavorite}
                    className="absolute top-4 right-4 bg-white p-2 rounded-full text-chocolate-900 shadow-md hover:bg-gold-50 transition-colors z-10"
                >
                    <FiHeart
                        size={20}
                        className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-chocolate-400'}`}
                    />
                </button>

                <button
                    onClick={() => onAddToCart(id)}
                    className="absolute bottom-4 right-4 bg-white p-3 rounded-full text-chocolate-900 shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gold-400 hover:text-white"
                >
                    <FiShoppingCart size={20} />
                </button>
            </div>
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <Link to={`/product/${id}`} className="hover:text-gold-600 transition-colors">
                        <h3 className="text-xl font-serif font-bold text-chocolate-900 line-clamp-1">{name}</h3>
                    </Link>
                    <span className="text-gold-600 font-bold">${price}</span>
                </div>
                <p className="text-chocolate-600 text-sm line-clamp-2 mb-4 h-10">
                    {description || 'A delicious treat waiting for you.'}
                </p>
                <button
                    onClick={() => onAddToCart(id)}
                    className="w-full py-2 border border-chocolate-900 text-chocolate-900 rounded-lg hover:bg-chocolate-900 hover:text-white transition-colors text-sm font-medium uppercase tracking-wide"
                >
                    Add to Cart
                </button>
            </div>
        </motion.div>
    );
};

export default ProductCard;

