import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Edit2, Trash2, Search, X, Package, Tag, DollarSign, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/common/Button';

const AdminProducts = () => {
    const { products, categories, addProduct, updateProduct, deleteProduct } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'pesticides',
        stock: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=600',
        rating: 5.0
    });

    const normalizeProductFormData = (product = {}) => ({
        ...product,
        name: product.name || '',
        price: product.price ?? '',
        category: product.category || 'pesticides',
        stock: product.stock ?? product.amount ?? '',
        description: product.description || '',
        image: product.image || 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=600',
        rating: product.rating ?? 5.0
    });

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData(normalizeProductFormData(product));
        } else {
            setEditingProduct(null);
            setFormData(normalizeProductFormData());
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { ...formData, price: Number(formData.price), stock: Number(formData.stock) };
        if (editingProduct) {
            updateProduct(data);
        } else {
            addProduct(data);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="admin-products space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">Quản lý sản phẩm</h1>
                    <p className="text-sm md:text-base text-gray-500">Thêm mới hoặc chỉnh sửa thông tin kho hàng của bạn.</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="flex items-center justify-center gap-2 w-full md:w-auto">
                    <Plus className="w-5 h-5" /> Thêm sản phẩm
                </Button>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên sản phẩm..."
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-100 focus:border-primary outline-none bg-gray-50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 outline-none w-full md:w-auto"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="all">Tất cả danh mục</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-xs uppercase text-gray-400 font-bold">
                                <th className="px-6 py-4">Sản phẩm</th>
                                <th className="px-6 py-4">Danh mục</th>
                                <th className="px-6 py-4">Giá</th>
                                <th className="px-6 py-4">Tồn kho</th>
                                <th className="px-6 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProducts.map((p) => (
                                <tr key={p.id} className="text-sm hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                <img src={p.image} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <span className="font-bold text-gray-700">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 capitalize">{p.category}</td>
                                    <td className="px-6 py-4 font-bold">{p.price.toLocaleString('vi-VN')} đ</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${p.stock < 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                            {p.stock} sản phẩm
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleOpenModal(p)} className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => deleteProduct(p.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] overflow-y-auto bg-black/50 backdrop-blur-sm p-4 md:p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white w-full max-w-2xl rounded-2xl md:rounded-[32px] p-5 md:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto mx-auto my-4 md:my-8"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <h2 className="text-2xl font-black mb-8">
                                {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 flex items-center gap-2"><Tag className="w-4 h-4" /> Tên sản phẩm</label>
                                        <input
                                            required
                                            className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary outline-none transition-all"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 flex items-center gap-2"><Layers className="w-4 h-4" /> Danh mục</label>
                                        <select
                                            className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary outline-none transition-all"
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 flex items-center gap-2"><DollarSign className="w-4 h-4" /> Giá bán (VNĐ)</label>
                                        <input
                                            required
                                            type="number"
                                            className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary outline-none transition-all"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 flex items-center gap-2"><Package className="w-4 h-4" /> Số lượng trong kho</label>
                                        <input
                                            required
                                            type="number"
                                            className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary outline-none transition-all"
                                            value={formData.stock}
                                            onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500">Mô tả sản phẩm</label>
                                    <textarea
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary outline-none transition-all h-32 resize-none"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="pt-4">
                                    <Button type="submit" size="lg" className="w-full">
                                        {editingProduct ? 'Cập nhật sản phẩm' : 'Lưu sản phẩm'}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default AdminProducts;
