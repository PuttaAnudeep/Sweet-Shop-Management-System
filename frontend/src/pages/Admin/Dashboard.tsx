import { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiPackage } from 'react-icons/fi';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalCustomers: 0,
        totalSweets: 0,
        liveSweets: 0,
        outOfStockSweets: 0,
        totalOrders: 0,
        totalRevenue: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/stats');
            setStats(res.data.stats);
        } catch (error) {
            console.error('Failed to load stats');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Analytics Dashboard */}
            <h2 className="text-3xl font-serif font-bold text-chocolate-900 mb-6">Analytic Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-chocolate-100 flex items-center justify-between">
                    <div>
                        <p className="text-chocolate-400 text-sm font-bold uppercase tracking-wider">Total Customers</p>
                        <p className="text-3xl font-bold text-chocolate-900 mt-1">{stats.totalCustomers}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-full text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-chocolate-100 flex items-center justify-between">
                    <div>
                        <p className="text-chocolate-400 text-sm font-bold uppercase tracking-wider">Live Sweets</p>
                        <p className="text-3xl font-bold text-chocolate-900 mt-1">{stats.liveSweets}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-full text-green-600">
                        <FiPackage className="h-8 w-8" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-chocolate-100 flex items-center justify-between">
                    <div>
                        <p className="text-chocolate-400 text-sm font-bold uppercase tracking-wider">Out of Stock</p>
                        <p className={`text-3xl font-bold mt-1 ${stats.outOfStockSweets > 0 ? 'text-red-600' : 'text-chocolate-900'}`}>{stats.outOfStockSweets}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-full text-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-2xl shadow-sm border border-yellow-100 flex items-center justify-between hover:shadow-md transition-shadow duration-300">
                    <div>
                        <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest">Total Revenue</p>
                        <p className="text-4xl font-serif font-bold text-chocolate-900 mt-2">${stats.totalRevenue.toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm text-yellow-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Key Findings Section */}
            <div className="bg-gradient-to-r from-chocolate-900 to-chocolate-800 text-chocolate-50 p-8 rounded-2xl shadow-lg mb-12 relative overflow-hidden">
                <h3 className="text-xl font-bold font-serif mb-2">Key Findings</h3>
                <p className="opacity-90 leading-relaxed">
                    You have processed <span className="font-bold text-white">{stats.totalOrders} total orders</span>, generating a revenue of <span className="font-bold text-white">${stats.totalRevenue.toFixed(2)}</span>.
                    Currently, {stats.liveSweets} sweet varieties are available for customers, while {stats.outOfStockSweets} items are out of stock and may require immediate restocking to avoid lost sales.
                </p>
            </div>
        </div>
    );
};

export default AdminDashboard;
