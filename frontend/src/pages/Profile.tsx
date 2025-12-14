import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiSave } from 'react-icons/fi';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (formData.password && formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const payload: any = {
                name: formData.name,
                email: formData.email
            };
            if (formData.password) {
                payload.password = formData.password;
            }

            const res = await api.put('/auth/profile', payload);
            updateUser({ ...user!, ...res.data });
            toast.success('Profile updated successfully');
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-chocolate-900 p-8 text-center">
                    <div className="w-24 h-24 bg-gold-500 rounded-full mx-auto flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg">
                        {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-white">Manage Profile</h1>
                    <p className="text-chocolate-200 mt-2">Update your personal information</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-chocolate-900 font-medium ml-1">Full Name</label>
                            <div className="relative">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate-400" />
                                <input
                                    type="text"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-chocolate-100 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-chocolate-900 font-medium ml-1">Email Address</label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate-400" />
                                <input
                                    type="email"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-chocolate-100 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-chocolate-50 pt-6">
                        <h3 className="text-lg font-bold text-chocolate-900 mb-4 flex items-center gap-2">
                            <FiLock className="text-gold-500" />
                            Change Password
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-chocolate-900 font-medium ml-1">New Password</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 rounded-xl border border-chocolate-100 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                                    placeholder="Leave blank to keep current"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-chocolate-900 font-medium ml-1">Confirm Password</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 rounded-xl border border-chocolate-100 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                                    placeholder="Confirm new password"
                                    value={formData.confirmPassword}
                                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <FiSave size={20} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
