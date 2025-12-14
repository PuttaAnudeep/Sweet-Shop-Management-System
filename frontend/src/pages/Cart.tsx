import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const Cart = () => {
    const { cartItems, removeFromCart, addToCart, totalPrice } = useCart();

    const handleCheckout = async () => {
        try {
            const res = await api.post('/orders/checkout');
            if (res.data.url) {
                window.location.href = res.data.url;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Checkout failed');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto"
                >
                    <div className="text-6xl mb-6">🛒</div>
                    <h2 className="text-3xl font-serif font-bold text-chocolate-900 mb-4">Your cart is empty</h2>
                    <p className="text-chocolate-600 mb-8">Looks like you haven't added any sweet treats yet.</p>
                    <Link
                        to="/shop"
                        className="inline-block bg-chocolate-900 text-white px-8 py-3 rounded-full hover:bg-chocolate-700 transition-colors font-medium"
                    >
                        Start Shopping
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-serif font-bold text-chocolate-900 mb-8">Your Cart</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items */}
                <div className="lg:w-2/3 space-y-4">
                    {cartItems.map((item) => (
                        <motion.div
                            key={item._id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-white p-4 rounded-xl shadow-sm border border-chocolate-100 flex items-center gap-4"
                        >
                            <div className="w-24 h-24 bg-chocolate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                {item.sweetId.image ? (
                                    <img src={item.sweetId.image} alt={item.sweetId.name} className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                    <span className="text-2xl">🍬</span>
                                )}
                            </div>

                            <div className="flex-grow">
                                <h3 className="text-lg font-bold text-chocolate-900">{item.sweetId.name}</h3>
                                <p className="text-gold-600 font-bold">${item.sweetId.price}</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => addToCart(item.sweetId._id, -1)}
                                    className="w-8 h-8 rounded-full border border-chocolate-200 flex items-center justify-center hover:bg-chocolate-50 text-chocolate-700 disabled:opacity-50"
                                    disabled={item.quantity <= 1}
                                >
                                    <FiMinus size={14} />
                                </button>
                                <span className="font-medium w-6 text-center">{item.quantity}</span>
                                <button
                                    onClick={() => addToCart(item.sweetId._id, 1)}
                                    className="w-8 h-8 rounded-full border border-chocolate-200 flex items-center justify-center hover:bg-chocolate-50 text-chocolate-700"
                                >
                                    <FiPlus size={14} />
                                </button>
                            </div>

                            <button
                                onClick={() => removeFromCart(item.sweetId._id)}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <FiTrash2 size={20} />
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-chocolate-100 sticky top-24">
                        <h3 className="text-xl font-bold text-chocolate-900 mb-6">Order Summary</h3>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-chocolate-600">
                                <span>Subtotal</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-chocolate-600">
                                <span>Tax (Estimate)</span>
                                <span>$0.00</span>
                            </div>
                            <div className="border-t border-chocolate-100 pt-4 flex justify-between font-bold text-lg text-chocolate-900">
                                <span>Total</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full bg-gold-500 text-white py-4 rounded-xl font-bold hover:bg-gold-600 transition-colors shadow-lg shadow-gold-200 flex items-center justify-center gap-2 group"
                        >
                            Proceed to Checkout
                            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
