import { motion } from 'framer-motion';
import { FiShoppingCart } from 'react-icons/fi';

interface ProductCardProps {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    onAddToCart: (id: string) => void;
}

const ProductCard = ({ id, name, description, price, image, onAddToCart }: ProductCardProps) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-chocolate-100 hover:shadow-xl transition-all"
        >
            <div className="h-48 bg-chocolate-100 flex items-center justify-center overflow-hidden relative group">
                {image ? (
                    <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                    <div className="text-chocolate-300 text-4xl font-serif">🍬</div>
                )}
                <button
                    onClick={() => onAddToCart(id)}
                    className="absolute bottom-4 right-4 bg-white p-3 rounded-full text-chocolate-900 shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gold-400 hover:text-white"
                >
                    <FiShoppingCart size={20} />
                </button>
            </div>
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-serif font-bold text-chocolate-900 line-clamp-1">{name}</h3>
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
