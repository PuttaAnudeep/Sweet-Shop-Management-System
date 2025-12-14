import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiPackage, FiCalendar } from 'react-icons/fi';

interface Order {
    _id: string;
    items: {
        sweetId: {
            name: string;
            price: number;
        };
        quantity: number;
    }[];
    totalAmount: number;
    status: string;
    createdAt: string;
}

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            setOrders(res.data.orders);
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-20">Loading orders...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-serif font-bold text-chocolate-900 mb-8">Order History</h1>

            {orders.length === 0 ? (
                <div className="text-center py-12 text-chocolate-600">No orders found.</div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order, index) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 rounded-xl shadow-sm border border-chocolate-100"
                        >
                            <div className="flex justify-between items-start mb-4 border-b border-chocolate-50 pb-4">
                                <div>
                                    <p className="text-sm text-chocolate-500 flex items-center gap-2">
                                        <FiCalendar /> {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                    <p className="text-xs text-chocolate-400 font-mono mt-1">ID: {order._id}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100'
                                        }`}>
                                        {order.status.toUpperCase()}
                                    </span>
                                    <p className="text-xl font-bold text-chocolate-900 mt-2">${order.totalAmount}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <FiPackage className="text-chocolate-300" />
                                            <span className="text-chocolate-800">{item.sweetId?.name || 'Unknown Item'}</span>
                                            <span className="text-chocolate-400">x{item.quantity}</span>
                                        </div>
                                        <span className="text-chocolate-600">${item.sweetId?.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
