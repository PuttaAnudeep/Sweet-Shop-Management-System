import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPackage } from 'react-icons/fi';

interface Sweet {
    _id: string;
    name: string;
    price: number;
    category: string;
    quantity: number;
    image?: string;
    description?: string;
}

const AdminDashboard = () => {
    const [sweets, setSweets] = useState<Sweet[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
    const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
    const [formData, setFormData] = useState({ name: '', price: '', category: '', quantity: '', description: '', image: '' });
    const [restockData, setRestockData] = useState({ sweetId: '', quantity: '', costPrice: '', supplier: '' });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 6;

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.get('create') === 'true') {
            setEditingSweet(null);
            setFormData({ name: '', price: '', category: '', quantity: '', description: '', image: '' });
            setIsModalOpen(true);
            setSearchParams(params => {
                params.delete('create');
                return params;
            }, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        fetchSweets();
    }, [currentPage]);

    const fetchSweets = async () => {
        try {
            const res = await api.get(`/sweets?page=${currentPage}&limit=${LIMIT}`);
            if (res.data.sweets) {
                setSweets(res.data.sweets);
                setTotalPages(res.data.totalPages);
            } else {
                setSweets(res.data);
            }
        } catch (error) {
            toast.error('Failed to load inventory');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/sweets/${id}`);
            toast.success('Sweet deleted');
            fetchSweets();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                quantity: Number(formData.quantity)
            };

            if (editingSweet) {
                await api.put(`/sweets/${editingSweet._id}`, payload);
                toast.success('Sweet updated');
            } else {
                await api.post('/sweets', payload);
                toast.success('Sweet added');
            }
            setIsModalOpen(false);
            setEditingSweet(null);
            setFormData({ name: '', price: '', category: '', quantity: '', description: '', image: '' });
            fetchSweets();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleRestock = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!restockData.sweetId) return;

            await api.post('/inventory', {
                sweetId: restockData.sweetId,
                quantity: Number(restockData.quantity),
                costPrice: Number(restockData.costPrice),
                supplier: restockData.supplier
            });

            toast.success('Inventory Restocked Successfully');
            setIsRestockModalOpen(false);
            setRestockData({ sweetId: '', quantity: '', costPrice: '', supplier: '' });
            fetchSweets();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Restock failed');
        }
    };

    const openEdit = (sweet: Sweet) => {
        setEditingSweet(sweet);
        setFormData({
            name: sweet.name,
            price: sweet.price.toString(),
            category: sweet.category,
            quantity: sweet.quantity.toString(),
            description: sweet.description || '',
            image: sweet.image || ''
        });
        setIsModalOpen(true);
    };

    const openRestock = (sweet: Sweet) => {
        setRestockData({ sweetId: sweet._id, quantity: '', costPrice: '', supplier: '' });
        setIsRestockModalOpen(true);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-lg border border-chocolate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-chocolate-100 text-chocolate-900 font-bold">
                        <tr>
                            <th className="p-4 border-b border-chocolate-200">Name</th>
                            <th className="p-4 border-b border-chocolate-200">Category</th>
                            <th className="p-4 border-b border-chocolate-200">Price</th>
                            <th className="p-4 border-b border-chocolate-200">Stock</th>
                            <th className="p-4 border-b border-chocolate-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-chocolate-50">
                        {sweets.map(sweet => (
                            <tr key={sweet._id} className="hover:bg-chocolate-50/30 transition-colors">
                                <td className="p-4 font-medium text-chocolate-800">{sweet.name}</td>
                                <td className="p-4 text-chocolate-600">{sweet.category}</td>
                                <td className="p-4 text-chocolate-900 font-bold">${sweet.price}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${sweet.quantity > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {sweet.quantity}
                                    </span>
                                </td>
                                <td className="p-4 flex gap-3">
                                    <button onClick={() => openRestock(sweet)} title="Restock" className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded-full transition-colors"><FiPackage /></button>
                                    <button onClick={() => openEdit(sweet)} title="Edit" className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-full transition-colors"><FiEdit2 /></button>
                                    <button onClick={() => handleDelete(sweet._id)} title="Delete" className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"><FiTrash2 /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl border border-chocolate-100 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6 text-chocolate-900">{editingSweet ? 'Edit Sweet' : 'Add New Sweet'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-chocolate-700 text-sm font-medium mb-1">Name</label>
                                <input required placeholder="Sweet Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border border-chocolate-200 p-2 rounded-lg focus:ring-1 focus:ring-gold-500 outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-chocolate-700 text-sm font-medium mb-1">Price</label>
                                    <input required type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full border border-chocolate-200 p-2 rounded-lg focus:ring-1 focus:ring-gold-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-chocolate-700 text-sm font-medium mb-1">Quantity</label>
                                    <input required type="number" placeholder="Qty" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} className="w-full border border-chocolate-200 p-2 rounded-lg focus:ring-1 focus:ring-gold-500 outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-chocolate-700 text-sm font-medium mb-1">Category</label>
                                <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full border border-chocolate-200 p-2 rounded-lg focus:ring-1 focus:ring-gold-500 outline-none bg-white">
                                    <option value="">Select Category</option>
                                    <option value="Bengali Sweets">Bengali Sweets</option>
                                    <option value="Traditional">Traditional</option>
                                    <option value="Ghee Sweets">Ghee Sweets</option>
                                    <option value="Milk Sweets">Milk Sweets</option>
                                    <option value="Dry Fruit Sweets">Dry Fruit Sweets</option>
                                    <option value="Syrup Sweets">Syrup Sweets</option>
                                    <option value="Halwa">Halwa</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-chocolate-700 text-sm font-medium mb-1">Description</label>
                                <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full border border-chocolate-200 p-2 rounded-lg focus:ring-1 focus:ring-gold-500 outline-none" rows={3} />
                            </div>
                            <div>
                                <label className="block text-chocolate-700 text-sm font-medium mb-1">Image URL</label>
                                <input placeholder="/sweets/sample.jpg" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full border border-chocolate-200 p-2 rounded-lg focus:ring-1 focus:ring-gold-500 outline-none" />
                            </div>

                            <div className="flex gap-4 mt-8 pt-4 border-t border-chocolate-50">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 border border-chocolate-200 rounded-lg hover:bg-chocolate-50 text-chocolate-700 font-medium transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-2.5 bg-gold-500 text-white rounded-lg hover:bg-gold-600 font-medium transition-colors shadow-sm">Save Sweet</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {isRestockModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 rounded-xl w-full max-w-sm shadow-2xl border border-chocolate-100">
                        <h2 className="text-xl font-bold mb-4 text-chocolate-900">Restock Inventory</h2>
                        <form onSubmit={handleRestock} className="space-y-4">
                            <div>
                                <label className="block text-chocolate-700 text-sm font-medium mb-1">Quantity to Add</label>
                                <input required type="number" min="1" value={restockData.quantity} onChange={e => setRestockData({ ...restockData, quantity: e.target.value })} className="w-full border border-chocolate-200 p-2 rounded-lg focus:ring-1 focus:ring-gold-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-chocolate-700 text-sm font-medium mb-1">Cost Price (per unit)</label>
                                <input required type="number" min="0" value={restockData.costPrice} onChange={e => setRestockData({ ...restockData, costPrice: e.target.value })} className="w-full border border-chocolate-200 p-2 rounded-lg focus:ring-1 focus:ring-gold-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-chocolate-700 text-sm font-medium mb-1">Supplier (Optional)</label>
                                <input type="text" value={restockData.supplier} onChange={e => setRestockData({ ...restockData, supplier: e.target.value })} className="w-full border border-chocolate-200 p-2 rounded-lg focus:ring-1 focus:ring-gold-500 outline-none" />
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button type="button" onClick={() => setIsRestockModalOpen(false)} className="flex-1 py-2 border border-chocolate-200 rounded-lg hover:bg-chocolate-50 text-chocolate-700 font-medium transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors shadow-sm">Confirm Restock</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
