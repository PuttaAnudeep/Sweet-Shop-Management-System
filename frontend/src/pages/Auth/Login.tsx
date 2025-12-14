import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.token, res.data.user);
            if (res.data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-chocolate-50 py-12">
            <div className="w-full max-w-md px-4">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-serif font-bold text-chocolate-900 mb-2">Welcome Back</h2>
                    <p className="text-chocolate-600">Sign in to your SweetShop account</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-2xl shadow-sm border border-chocolate-100"
                >
                    {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 text-sm flex items-center gap-2">⚠️ {error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-chocolate-900 text-sm font-bold mb-2">Email Address</label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate-400" />
                                <input
                                    type="email"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-chocolate-200 focus:border-gold-500 focus:ring-4 focus:ring-gold-50 outline-none transition-all bg-white text-chocolate-900 placeholder-chocolate-300"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-chocolate-900 text-sm font-bold mb-2">Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-chocolate-200 focus:border-gold-500 focus:ring-4 focus:ring-gold-50 outline-none transition-all bg-white text-chocolate-900 placeholder-chocolate-300"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-chocolate-400 hover:text-chocolate-600"
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-chocolate-700 cursor-pointer">
                                <input type="checkbox" className="rounded border-chocolate-300 text-gold-500 focus:ring-gold-500" />
                                Remember me
                            </label>
                            <button type="button" className="text-gold-1000 hover:text-gold-1000 font-medium">
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-chocolate-900 text-gold-400 py-3.5 rounded-full text-lg font-medium hover:bg-chocolate-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-chocolate-600 text-sm">
                            Don't have an account? <Link to="/register" className="text-gold-600 font-bold hover:underline">Sign up</Link>
                        </p>
                    </div>

                    <div className="mt-8 pt-8 border-t border-chocolate-50">
                        <p className="text-xs text-chocolate-400 mb-4 text-center">Demo Accounts:</p>
                        <div className="space-y-3">
                            <div className="bg-chocolate-50 p-3 rounded-lg text-xs text-chocolate-700 border border-chocolate-100">
                                <span className="font-bold text-chocolate-900 block mb-1">User Account:</span>
                                Email: user@demo.com | Password: any
                            </div>
                            <div className="bg-chocolate-50 p-3 rounded-lg text-xs text-chocolate-700 border border-chocolate-100">
                                <span className="font-bold text-chocolate-900 block mb-1">Admin Account:</span>
                                Email: admin@demo.com | Password: any
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
