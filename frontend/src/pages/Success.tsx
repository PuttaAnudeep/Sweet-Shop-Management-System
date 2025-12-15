import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Success = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const { refreshCart } = useCart();

    useEffect(() => {
        if (sessionId) {
            confirmOrder(sessionId);
        }
    }, [sessionId]);

    const confirmOrder = async (id: string) => {
        try {
            await api.get(`/orders/success?session_id=${id}`);
            toast.success('Order placed successfully!');
            refreshCart(); // Clear cart in context (backend already cleared it)
        } catch (error) {
            console.error('Order confirmation failed', error);
            const message = (error as any).response?.data?.message || 'Something went wrong confirming your order.';
            // Only show toast if it's not a "success" error (which shouldn't happen with 200) -> logic handled by catch
            toast.error(message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-20 text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-block text-green-500 mb-6"
            >
                <FiCheckCircle size={80} />
            </motion.div>
            <h1 className="text-4xl font-serif font-bold text-chocolate-900 mb-4">Payment Successful!</h1>
            <p className="text-chocolate-600 text-lg mb-8">Your sweet treats are on their way to being prepared.</p>

            <div className="flex justify-center gap-4">
                <Link
                    to="/shop"
                    className="bg-chocolate-900 text-white px-8 py-3 rounded-full hover:bg-chocolate-700 transition-colors"
                >
                    Continue Shopping
                </Link>
                <Link
                    to="/orders"
                    className="border-2 border-chocolate-900 text-chocolate-900 px-8 py-3 rounded-full hover:bg-chocolate-50 transition-colors"
                >
                    View Orders
                </Link>
            </div>
        </div>
    );
};

export default Success;
