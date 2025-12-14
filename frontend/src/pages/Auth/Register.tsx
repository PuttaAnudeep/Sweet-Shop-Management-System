import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!agreeTerms) {
            setError('You must agree to the Terms of Service');
            return;
        }

        try {
            const res = await api.post('/auth/register', { name, email, password, role });
            login(res.data.token, res.data.user);
            if (res.data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-chocolate-50 py-12">
            <div className="w-full max-w-md px-4">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-serif font-bold text-chocolate-900 mb-2">Create Account</h2>
                    <p className="text-chocolate-600">Join SweetShop and start your sweet journey</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-2xl shadow-sm border border-chocolate-100"
                >
                    {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 text-sm flex items-center gap-2">⚠️ {error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-chocolate-900 text-sm font-bold mb-2">Full Name</label>
                            <div className="relative">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate-400" />
                                <input
                                    type="text"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-chocolate-200 focus:border-gold-500 focus:ring-4 focus:ring-gold-50 outline-none transition-all bg-white text-chocolate-900 placeholder-chocolate-300"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

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
                            <label className="block text-chocolate-900 text-sm font-bold mb-2">Role</label>
                            <div className="relative">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate-400" />
                                <select
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-chocolate-200 focus:border-gold-500 focus:ring-4 focus:ring-gold-50 outline-none transition-all bg-white text-chocolate-900 appearance-none"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="customer">Customer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-chocolate-900 text-sm font-bold mb-2">Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-chocolate-200 focus:border-gold-500 focus:ring-4 focus:ring-gold-50 outline-none transition-all bg-white text-chocolate-900 placeholder-chocolate-300"
                                    placeholder="Create a password"
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

                        <div>
                            <label className="block text-chocolate-900 text-sm font-bold mb-2">Confirm Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate-400" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-chocolate-200 focus:border-gold-500 focus:ring-4 focus:ring-gold-50 outline-none transition-all bg-white text-chocolate-900 placeholder-chocolate-300"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-chocolate-400 hover:text-chocolate-600"
                                >
                                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-chocolate-600">
                            <input
                                type="checkbox"
                                className="rounded border-chocolate-300 text-gold-500 focus:ring-gold-500"
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
                            />
                            <span>
                                I agree to the <a href="#" className="text-gold-600 hover:underline">Terms of Service</a> and <a href="#" className="text-gold-600 hover:underline">Privacy Policy</a>
                            </span>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-chocolate-900 text-gold-400 py-3.5 rounded-full text-lg font-medium hover:bg-chocolate-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Create Account
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-chocolate-600 text-sm">
                            Already have an account? <Link to="/login" className="text-gold-600 font-bold hover:underline">Sign in</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
