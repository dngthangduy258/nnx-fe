import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Edit2, Trash2, Pin, X, Newspaper, ImagePlus } from 'lucide-react';
import Button from '../../components/common/Button';
import { formatDateUTC7 } from '../../utils/date';

const defaultForm = {
    title: '',
    excerpt: '',
    content: '',
    image: '',
    pin_to_top: false,
    published: true
};

const AdminNews = () => {
    const {
        fetchAdminNews,
        fetchAdminNewsById,
        createNews,
        updateNews,
        deleteNews,
        setNewsPin,
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
        fetchAdminNews().then(setList).catch(() => setList([])).finally(() => setLoading(false));
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
            const item = await fetchAdminNewsById(id);
            setForm({
                title: item.title || '',
                excerpt: item.excerpt || '',
                content: item.content || '',
                image: item.image || '',
                pin_to_top: !!item.pin_to_top,
                published: item.published !== 0
            });
            setIsOpen(true);
        } catch (e) {
            setError(e.message || 'Không tải được tin');
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            const payload = {
                title: form.title.trim(),
                excerpt: form.excerpt.trim(),
                content: form.content.trim(),
                image: form.image.trim(),
                pin_to_top: form.pin_to_top,
                published: form.published
            };
            if (editingId) {
                await updateNews(editingId, payload);
            } else {
                await createNews(payload);
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
        if (!window.confirm('Bạn có chắc muốn xóa tin này?')) return;
        try {
            await deleteNews(id);
            loadList();
        } catch (err) {
            alert(err.message || 'Không thể xóa tin');
        }
    };

    const onTogglePin = async (id, currentPin) => {
        try {
            await setNewsPin(id, !currentPin);
            loadList();
        } catch (err) {
            alert(err.message || 'Không thể ghim');
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

    const formatDate = (d) => formatDateUTC7(d);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">Quản lý tin tức</h1>
                    <p className="text-gray-500">Đăng tin nông nghiệp, ghim lên đầu trang. Trọng tâm vẫn là bán sản phẩm.</p>
                </div>
                <Button onClick={openCreate}><Plus className="w-4 h-4" /> Đăng tin</Button>
            </div>

            {loading ? (
                <div className="py-12 text-center text-gray-500">Đang tải...</div>
            ) : (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-xs uppercase text-gray-400 font-bold">
                                <th className="px-6 py-4">Tiêu đề</th>
                                <th className="px-6 py-4 hidden md:table-cell">Ghim</th>
                                <th className="px-6 py-4 hidden sm:table-cell">Ngày</th>
                                <th className="px-6 py-4">Công bố</th>
                                <th className="px-6 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {list.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Chưa có tin nào. Bấm &quot;Đăng tin&quot; để thêm.</td></tr>
                            ) : (
                                list.map((item) => (
                                    <tr key={item.id} className="text-sm">
                                        <td className="px-6 py-4">
                                            <span className="font-semibold line-clamp-2 max-w-xs">{item.title}</span>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <button
                                                onClick={() => onTogglePin(item.id, item.pin_to_top)}
                                                className={`p-2 rounded-lg ${item.pin_to_top ? 'bg-primary/20 text-primary' : 'hover:bg-gray-100 text-gray-400'}`}
                                                title={item.pin_to_top ? 'Bỏ ghim' : 'Ghim lên đầu'}
                                            >
                                                <Pin className="w-4 h-4" />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 hidden sm:table-cell text-gray-500">{formatDate(item.created_at)}</td>
                                        <td className="px-6 py-4">
                                            <span className={item.published ? 'text-green-600' : 'text-gray-400'}>
                                                {item.published ? 'Có' : 'Ẩn'}
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
                            <Newspaper className="w-5 h-5" />
                            {editingId ? 'Sửa tin tức' : 'Đăng tin tức'}
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
                                    placeholder="Tiêu đề tin tức"
                                />
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung (Markdown)</label>
                                <textarea
                                    rows={10}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 font-mono text-sm"
                                    value={form.content}
                                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                                    placeholder="Dùng Markdown: **in đậm**, ## tiêu đề, bảng, list..."
                                />
                                <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 space-y-1">
                                    <p className="font-semibold text-gray-700">Gợi ý định dạng:</p>
                                    <p><strong>**chữ in đậm**</strong> → chữ in đậm</p>
                                    <p><strong>## Tiêu đề nhỏ</strong> → tiêu đề cấp 2</p>
                                    <p>Bảng: dòng 1 = tiêu đề, dòng 2 = |---|---|, các dòng sau = dữ liệu (dùng | phân cột)</p>
                                    <p>• List: dòng bắt đầu bằng - hoặc * hoặc 1.</p>
                                    <p>Link: [text](url). Trích dẫn: dòng bắt đầu bằng &gt;</p>
                                    <p>Xuống dòng: 2 khoảng trắng cuối dòng hoặc dòng trống.</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện</label>
                                <div className="flex gap-2">
                                    <input
                                        type="url"
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
                            <div className="flex flex-wrap gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.pin_to_top}
                                        onChange={(e) => setForm({ ...form, pin_to_top: e.target.checked })}
                                    />
                                    <span>Ghim lên đầu trang</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.published}
                                        onChange={(e) => setForm({ ...form, published: e.target.checked })}
                                    />
                                    <span>Công bố (hiển thị cho khách)</span>
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

export default AdminNews;
