import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiPackage, FiCalendar, FiSearch, FiFilter, FiChevronDown, FiChevronUp, FiDollarSign } from 'react-icons/fi';

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
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date-desc');
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchOrders();
    }, [currentPage]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/orders?page=${currentPage}&limit=5`);

            if (res.data.orders) {
                setOrders(res.data.orders);
                setTotalPages(res.data.totalPages || 1);
            } else {
                setOrders([]);
            }
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedOrderId(expandedOrderId === id ? null : id);
    };

    const filteredOrders = orders
        .filter(order => order._id.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(order => statusFilter === 'all' || order.status === statusFilter)
        .sort((a, b) => {
            if (sortBy === 'date-desc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            if (sortBy === 'date-asc') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            if (sortBy === 'amount-desc') return b.totalAmount - a.totalAmount;
            if (sortBy === 'amount-asc') return a.totalAmount - b.totalAmount;
            return 0;
        });

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-chocolate-200 border-t-gold-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-4xl font-serif font-bold text-chocolate-900 mb-8">Order History</h1>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-chocolate-100 mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate-400" />
                    <input
                        type="text"
                        placeholder="Search by Order ID..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-chocolate-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-4">
                    <div className="relative">
                        <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-chocolate-400" />
                        <select
                            className="pl-9 pr-8 py-2 rounded-xl border border-chocolate-200 focus:border-gold-500 outline-none bg-white appearance-none cursor-pointer hover:bg-chocolate-50 transition-colors"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>

                    <div className="relative">
                        <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-chocolate-400" />
                        <select
                            className="pl-9 pr-8 py-2 rounded-xl border border-chocolate-200 focus:border-gold-500 outline-none bg-white appearance-none cursor-pointer hover:bg-chocolate-50 transition-colors"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="date-desc">Newest First</option>
                            <option value="date-asc">Oldest First</option>
                            <option value="amount-desc">Amount: High to Low</option>
                            <option value="amount-asc">Amount: Low to High</option>
                        </select>
                    </div>
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-chocolate-50">
                    <div className="bg-chocolate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiPackage className="text-3xl text-chocolate-300" />
                    </div>
                    <p className="text-chocolate-600 text-lg">No orders found matching your criteria.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {filteredOrders.map((order) => (
                            <motion.div
                                key={order._id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`bg-white rounded-xl shadow-sm border transition-all duration-300 overflow-hidden ${expandedOrderId === order._id ? 'border-gold-500 ring-1 ring-gold-200' : 'border-chocolate-100 hover:border-gold-300'
                                    }`}
                            >
                                <div
                                    className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                                    onClick={() => toggleExpand(order._id)}
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                            <span className="text-chocolate-400 text-sm font-mono flex items-center gap-1">
                                                <span className="hidden md:inline">ID:</span> #{order._id.slice(-6)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-chocolate-600 text-sm">
                                            <FiCalendar className="text-gold-500" />
                                            {new Date(order.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-6">
                                        <div className="text-right">
                                            <p className="text-xs text-chocolate-400 uppercase font-bold tracking-wider">Total Amount</p>
                                            <p className="text-xl font-bold text-chocolate-900">${order.totalAmount.toFixed(2)}</p>
                                        </div>
                                        <div className={`p-2 rounded-full transition-transform duration-300 ${expandedOrderId === order._id ? 'bg-gold-500 text-white rotate-180' : 'bg-chocolate-50 text-chocolate-400'
                                            }`}>
                                            <FiChevronDown />
                                        </div>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {expandedOrderId === order._id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="border-t border-chocolate-50 bg-chocolate-50/30"
                                        >
                                            <div className="p-6">
                                                <h4 className="text-sm font-bold text-chocolate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                    <FiPackage className="text-gold-500" />
                                                    Order Items
                                                </h4>
                                                <div className="space-y-3">
                                                    {order.items.map((item, i) => (
                                                        <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg border border-chocolate-100">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 font-bold text-xs">
                                                                    {item.quantity}x
                                                                </div>
                                                                <span className="text-chocolate-800 font-medium">
                                                                    {item.sweetId?.name || 'Unknown Item'}
                                                                </span>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-chocolate-900 font-bold">${(item.sweetId?.price * item.quantity).toFixed(2)}</p>
                                                                <p className="text-xs text-chocolate-400">${item.sweetId?.price} each</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
            {/* Pagination Controls */}
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
        </div>
    );
};

export default Orders;
