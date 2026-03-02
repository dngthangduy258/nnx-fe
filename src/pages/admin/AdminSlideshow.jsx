import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Edit2, Trash2, X, ImagePlus, GripVertical } from 'lucide-react';
import Button from '../../components/common/Button';

const defaultForm = {
    title: '',
    image: '',
    excerpt: '',
    content: '',
    link_url: '',
    sort_order: 0,
    active: true
};

const AdminSlideshow = () => {
    const {
        fetchAdminSlideshows,
        fetchAdminSlideshowById,
        createSlideshow,
        updateSlideshow,
        deleteSlideshow,
        uploadProductImage
    } = useApp();
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(defaultForm);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [uploadingImg, setUploadingImg] = useState(false);

    const loadList = () => {
        setLoading(true);
        fetchAdminSlideshows().then(setList).catch(() => setList([])).finally(() => setLoading(false));
    };

    useEffect(() => {
        loadList();
    }, []);

    const openCreate = () => {
        setError('');
        setEditingId(null);
        setForm(defaultForm);
        setIsOpen(true);
    };

    const openEdit = async (id) => {
        setError('');
        setEditingId(id);
        try {
            const item = await fetchAdminSlideshowById(id);
            setForm({
                title: item.title || '',
                image: item.image || '',
                excerpt: item.excerpt || '',
                content: item.content || '',
                link_url: item.link_url || '',
                sort_order: item.sort_order ?? 0,
                active: item.active !== 0
            });
            setIsOpen(true);
        } catch (e) {
            setError(e.message || 'Không tải được slide');
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            const payload = {
                title: form.title.trim(),
                image: form.image.trim(),
                excerpt: form.excerpt.trim(),
                content: form.content.trim(),
                link_url: form.link_url.trim(),
                sort_order: Number(form.sort_order) || 0,
                active: form.active
            };
            if (editingId) {
                await updateSlideshow(editingId, payload);
            } else {
                await createSlideshow(payload);
            }
            setIsOpen(false);
            loadList();
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra');
        } finally {
            setSaving(false);
        }
    };

    const onDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa slide này?')) return;
        try {
            await deleteSlideshow(id);
            loadList();
        } catch (err) {
            alert(err.message || 'Không thể xóa slide');
        }
    };

    const onImageUpload = async (e) => {
        const file = e.target?.files?.[0];
        if (!file) return;
        setUploadingImg(true);
        try {
            const url = await uploadProductImage(file);
            setForm((f) => ({ ...f, image: url }));
        } catch (err) {
            setError(err.message || 'Upload ảnh thất bại');
        } finally {
            setUploadingImg(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">Quản lý Slideshow</h1>
                    <p className="text-gray-500">Khuyến mãi, thông báo hiển thị trên trang chủ. Click vào slide có thể xem chi tiết.</p>
                </div>
                <Button onClick={openCreate}><Plus className="w-4 h-4" /> Thêm slide</Button>
            </div>

            {loading ? (
                <div className="py-12 text-center text-gray-500">Đang tải...</div>
            ) : (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-xs uppercase text-gray-400 font-bold">
                                <th className="px-6 py-4 w-10">#</th>
                                <th className="px-6 py-4">Ảnh</th>
                                <th className="px-6 py-4">Tiêu đề</th>
                                <th className="px-6 py-4 hidden md:table-cell">Thứ tự</th>
                                <th className="px-6 py-4">Hiển thị</th>
                                <th className="px-6 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {list.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Chưa có slide nào. Bấm &quot;Thêm slide&quot; để tạo.</td></tr>
                            ) : (
                                list.map((item) => (
                                    <tr key={item.id} className="text-sm">
                                        <td className="px-6 py-4 text-gray-400"><GripVertical className="w-4 h-4" /></td>
                                        <td className="px-6 py-4">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                                {item.image ? (
                                                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">—</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold line-clamp-2 max-w-xs">{item.title}</span>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell text-gray-500">{item.sort_order}</td>
                                        <td className="px-6 py-4">
                                            <span className={item.active ? 'text-green-600' : 'text-gray-400'}>
                                                {item.active ? 'Có' : 'Ẩn'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="inline-flex items-center gap-2">
                                                <button onClick={() => openEdit(item.id)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-500" title="Sửa">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => onDelete(item.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500" title="Xóa">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {isOpen && (
                <div className="fixed inset-0 z-[100] bg-black/40 p-4 flex items-center justify-center overflow-y-auto">
                    <div className="bg-white w-full max-w-2xl rounded-2xl p-6 relative my-8 max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setIsOpen(false)} className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100">
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                            <ImagePlus className="w-5 h-5" />
                            {editingId ? 'Sửa slide' : 'Thêm slide'}
                        </h2>
                        <form onSubmit={submit} className="space-y-4">
                            {error && <div className="text-red-600 text-sm">{error}</div>}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
                                <input
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="VD: Khuyến mãi Tết 2026"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh *</label>
                                <div className="flex gap-2">
                                    <input
                                        type="url"
                                        required
                                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200"
                                        value={form.image}
                                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                                        placeholder="URL ảnh hoặc upload"
                                    />
                                    <label className="px-4 py-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 flex items-center gap-2 whitespace-nowrap disabled:opacity-50">
                                        <ImagePlus className="w-4 h-4" />
                                        {uploadingImg ? 'Đang tải...' : 'Upload'}
                                        <input type="file" accept="image/*" className="hidden" onChange={onImageUpload} disabled={uploadingImg} />
                                    </label>
                                </div>
                                {form.image && (
                                    <img src={form.image} alt="" className="mt-2 max-h-40 w-auto object-contain rounded-lg border bg-gray-50" />
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tóm tắt (hiển thị trong danh sách)</label>
                                <input
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200"
                                    value={form.excerpt}
                                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                                    placeholder="Một vài dòng tóm tắt"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link khi click (tùy chọn)</label>
                                <input
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200"
                                    value={form.link_url}
                                    onChange={(e) => setForm({ ...form, link_url: e.target.value })}
                                    placeholder="VD: /news/1, /product/5, hoặc https://..."
                                />
                                <p className="text-xs text-gray-500 mt-1">Để trống nếu dùng trang chi tiết.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung chi tiết (Markdown)</label>
                                <textarea
                                    rows={10}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 font-mono text-sm"
                                    value={form.content}
                                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                                    placeholder="Nội dung khi khách xem chi tiết slide..."
                                />
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự</label>
                                    <input
                                        type="number"
                                        className="w-24 px-4 py-2 rounded-xl border border-gray-200"
                                        value={form.sort_order}
                                        onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                                    />
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer pt-2">
                                    <input
                                        type="checkbox"
                                        checked={form.active}
                                        onChange={(e) => setForm({ ...form, active: e.target.checked })}
                                    />
                                    <span>Hiển thị</span>
                                </label>
                            </div>
                            <div className="flex gap-2 pt-4">
                                <Button type="submit" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</Button>
                                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50">
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSlideshow;
