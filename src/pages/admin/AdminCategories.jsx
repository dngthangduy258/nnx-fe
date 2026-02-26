import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Edit2, Trash2, Layers, X, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/common/Button';

const AdminCategories = () => {
    const { addCategory, updateCategory, deleteCategory, fetchAdminCategories } = useApp();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ id: '', name: '', icon: 'Tag', active: true });

    useEffect(() => {
        fetchAdminCategories().then(setCategories).catch(() => setCategories([])).finally(() => setLoading(false));
    }, [fetchAdminCategories]);

    const loadCategories = () => {
        fetchAdminCategories().then(setCategories).catch(() => {});
    };

    const openCreate = () => {
        setError('');
        setEditingId('');
        setForm({ id: '', name: '', icon: 'Tag', active: true });
        setIsOpen(true);
    };

    const openEdit = (category) => {
        setError('');
        setEditingId(category.id);
        setForm({
            id: category.id,
            name: category.name,
            icon: category.icon || 'Tag',
            active: category.active !== 0
        });
        setIsOpen(true);
    };

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (editingId) {
                await updateCategory(editingId, { name: form.name, icon: form.icon, active: form.active });
            } else {
                await addCategory(form);
            }
            setIsOpen(false);
            loadCategories();
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra');
        }
    };

    const onToggleActive = async (c) => {
        const newActive = !(c.active !== 0);
        const prevActive = c.active;
        setCategories(prev => prev.map(item => item.id === c.id ? { ...item, active: newActive ? 1 : 0 } : item));
        try {
            await updateCategory(c.id, { name: c.name, icon: c.icon || 'Tag', active: newActive });
        } catch (err) {
            setCategories(prev => prev.map(item => item.id === c.id ? { ...item, active: prevActive } : item));
            alert(err.message || 'Không thể cập nhật');
        }
    };

    const onDelete = async (id) => {
        try {
            await deleteCategory(id);
            loadCategories();
        } catch (err) {
            alert(err.message || 'Không thể xóa danh mục');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">Quản lý danh mục</h1>
                    <p className="text-gray-500">Thêm, sửa, xóa danh mục sản phẩm.</p>
                </div>
                <Button onClick={openCreate}><Plus className="w-4 h-4" /> Thêm danh mục</Button>
            </div>

            {loading ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center text-gray-500">Đang tải...</div>
            ) : (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-xs uppercase text-gray-400 font-bold">
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Tên</th>
                                <th className="px-6 py-4">Icon</th>
                                <th className="px-6 py-4">Hiển thị</th>
                                <th className="px-6 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {categories.map((c) => (
                                <tr key={c.id} className={`text-sm transition-all duration-200 ${c.active === 0 ? 'bg-gray-50 opacity-75' : ''}`}>
                                    <td className="px-6 py-4 font-mono">{c.id}</td>
                                    <td className="px-6 py-4 font-semibold">{c.name}</td>
                                    <td className="px-6 py-4">{c.icon || 'Tag'}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            type="button"
                                            onClick={() => onToggleActive(c)}
                                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${c.active !== 0 ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}
                                            title={c.active !== 0 ? 'Đang hiển thị (bấm để ẩn)' : 'Đang ẩn (bấm để hiện)'}
                                        >
                                            {c.active !== 0 ? <><Eye className="w-3 h-3" /> Hiện</> : <><EyeOff className="w-3 h-3" /> Ẩn</>}
                                        </button>
                                        <span className="ml-1 text-gray-400 text-xs">(ẩn = sản phẩm thuộc DM cũng ẩn)</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="inline-flex items-center gap-2">
                                            <button onClick={() => openEdit(c)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-500" title="Sửa">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => onDelete(c.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500" title="Xóa">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isOpen && (
                <div className="fixed inset-0 z-[100] bg-black/40 p-4 flex items-center justify-center">
                    <div className="bg-white w-full max-w-lg rounded-2xl p-6 relative">
                        <button onClick={() => setIsOpen(false)} className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100">
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                            <Layers className="w-5 h-5" />
                            {editingId ? 'Sửa danh mục' : 'Thêm danh mục'}
                        </h2>
                        <form onSubmit={submit} className="space-y-4">
                            <input
                                required
                                disabled={!!editingId}
                                placeholder="ID (vd: fertilizers)"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200"
                                value={form.id}
                                onChange={(e) => setForm({ ...form, id: e.target.value })}
                            />
                            <input
                                required
                                placeholder="Tên danh mục"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                            <input
                                required
                                placeholder="Icon name"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200"
                                value={form.icon}
                                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                            />
                            {editingId && (
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.active}
                                        onChange={(e) => setForm({ ...form, active: e.target.checked })}
                                    />
                                    <span>Hiển thị trên gian hàng (ẩn = sản phẩm thuộc DM cũng ẩn)</span>
                                </label>
                            )}
                            {error && <div className="text-sm text-red-500 font-semibold">{error}</div>}
                            <Button type="submit" className="w-full">{editingId ? 'Cập nhật' : 'Tạo mới'}</Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
