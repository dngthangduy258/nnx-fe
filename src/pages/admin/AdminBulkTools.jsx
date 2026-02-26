import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileDown, Upload, Table2, ImagePlus, X } from 'lucide-react';

const AdminBulkTools = () => {
    const { categories, downloadImportTemplate, importProductsCSV, bulkCreateProducts, uploadProductImages } = useApp();

    const [importFile, setImportFile] = useState(null);
    const [importing, setImporting] = useState(false);
    const [importResult, setImportResult] = useState(null);

    const [bulkImageFiles, setBulkImageFiles] = useState([]);
    const [bulkImageUploading, setBulkImageUploading] = useState(false);
    const [bulkImageUrls, setBulkImageUrls] = useState([]);

    const [bulkRows, setBulkRows] = useState([{ name: '', price: '', stock: '', category: 'pesticides' }]);
    const [bulkSaving, setBulkSaving] = useState(false);

    const handleDownloadTemplate = async () => {
        try {
            await downloadImportTemplate();
        } catch (e) {
            alert(e?.message || 'Khong tai duoc file mau');
        }
    };

    const handleImportCSV = async () => {
        if (!importFile) {
            alert('Chon file CSV truoc.');
            return;
        }
        setImporting(true);
        setImportResult(null);
        try {
            const res = await importProductsCSV(importFile);
            setImportResult(res);
            if (res.created > 0) setImportFile(null);
        } catch (e) {
            alert(e?.message || 'Import that bai');
        } finally {
            setImporting(false);
        }
    };

    const handleBulkImageUpload = async () => {
        const files = Array.isArray(bulkImageFiles) ? bulkImageFiles : [];
        if (!files.length) {
            alert('Chon it nhat 1 anh.');
            return;
        }
        setBulkImageUploading(true);
        setBulkImageUrls([]);
        try {
            const urls = await uploadProductImages(files);
            setBulkImageUrls(urls);
        } catch (e) {
            alert(e?.message || 'Upload that bai');
        } finally {
            setBulkImageUploading(false);
        }
    };

    const copyImageUrlsForCsv = () => {
        const s = bulkImageUrls.join('|');
        if (!s) return;
        navigator.clipboard.writeText(s).then(() => alert('Da copy chuoi URL (anh dai dien = dau tien). Dan vao cot image_urls trong CSV.'));
    };

    const addBulkRow = () => {
        setBulkRows(prev => [...prev, { name: '', price: '', stock: '', category: 'pesticides' }]);
    };

    const updateBulkRow = (index, field, value) => {
        setBulkRows(prev => prev.map((row, i) => i === index ? { ...row, [field]: value } : row));
    };

    const removeBulkRow = (index) => {
        if (bulkRows.length <= 1) return;
        setBulkRows(prev => prev.filter((_, i) => i !== index));
    };

    const handleBulkSave = async () => {
        const list = bulkRows
            .map(r => ({ name: r.name.trim(), price: r.price, stock: r.stock, category: r.category }))
            .filter(r => r.name.length >= 2);
        if (!list.length) {
            alert('Nhap it nhat 1 dong co ten san pham.');
            return;
        }
        setBulkSaving(true);
        try {
            const res = await bulkCreateProducts(list.map(r => ({
                name: r.name,
                category: r.category,
                price: Number(r.price) || 0,
                stock: Number(r.stock) || 0,
            })));
            alert(`Da them ${res.created} san pham.${res.errors?.length ? ' Loi: ' + res.errors.length : ''}`);
            if (res.created > 0) setBulkRows([{ name: '', price: '', stock: '', category: 'pesticides' }]);
        } catch (e) {
            alert(e?.message || 'Luu that bai');
        } finally {
            setBulkSaving(false);
        }
    };

    return (
        <div className="admin-bulk-tools space-y-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">Công cụ hàng loạt</h1>
                <p className="text-sm text-gray-500 mt-1">Import CSV, upload ảnh R2, thêm nhanh nhiều sản phẩm.</p>
            </div>

            {/* Import CSV */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3">
                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Import CSV hàng loạt
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={handleDownloadTemplate}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-sm font-medium"
                    >
                        <FileDown className="w-4 h-4" /> Tải file mẫu
                    </button>
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-sm font-medium cursor-pointer">
                        <input type="file" accept=".csv" className="hidden" onChange={(e) => { setImportFile(e.target.files?.[0] || null); setImportResult(null); }} />
                        Chọn file CSV
                    </label>
                    {importFile && <span className="text-sm text-gray-500">{importFile.name}</span>}
                    <button
                        type="button"
                        onClick={handleImportCSV}
                        disabled={!importFile || importing}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-50 text-sm font-medium"
                    >
                        {importing ? 'Đang import...' : 'Import'}
                    </button>
                </div>
                {importResult && (
                    <div className="text-sm p-3 rounded-xl bg-gray-50 border border-gray-100">
                        Đã thêm <strong>{importResult.created}</strong> sản phẩm (tổng {importResult.totalRows} dòng).
                        {importResult.errors?.length > 0 && (
                            <div className="mt-2 text-amber-700">
                                Lỗi: {importResult.errors.map(e => `Dòng ${e.row}: ${e.message}`).join('; ')}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Upload ảnh hàng loạt R2 */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3">
                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <ImagePlus className="w-4 h-4" /> Upload ảnh hàng loạt (R2)
                </h3>
                <p className="text-xs text-gray-500">
                    Chọn nhiều ảnh → Upload lên R2 → Copy chuỗi URL để dán vào cột <strong>image_urls</strong> trong file CSV (cách nhau bằng <code>|</code>). Ảnh đầu tiên = ảnh đại diện.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-sm font-medium cursor-pointer">
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                                const list = Array.from(e.target.files || []);
                                setBulkImageFiles(list);
                                if (!list.length) setBulkImageUrls([]);
                            }}
                        />
                        Chọn ảnh (nhiều file)
                    </label>
                    {bulkImageFiles.length > 0 && <span className="text-sm text-gray-500">{bulkImageFiles.length} ảnh</span>}
                    <button
                        type="button"
                        onClick={handleBulkImageUpload}
                        disabled={!bulkImageFiles.length || bulkImageUploading}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-50 text-sm font-medium"
                    >
                        {bulkImageUploading ? 'Đang tải lên...' : 'Upload lên R2'}
                    </button>
                </div>
                {bulkImageUrls.length > 0 && (
                    <div className="space-y-2 text-sm">
                        <p className="font-medium text-gray-700">Đã tải lên {bulkImageUrls.length} ảnh. Ảnh đại diện = ảnh đầu tiên.</p>
                        <ul className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                            {bulkImageUrls.map((url, i) => (
                                <li key={i} className="flex items-center gap-1">
                                    <img src={url} alt="" className="w-10 h-10 rounded object-cover border border-gray-200" />
                                    <span className="text-gray-500 text-xs">#{i + 1}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                readOnly
                                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-xs font-mono truncate"
                                value={bulkImageUrls.join('|')}
                                title={bulkImageUrls.join('|')}
                            />
                            <button type="button" onClick={copyImageUrlsForCsv} className="px-3 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-700">
                                Copy (dán vào CSV)
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Thêm nhanh nhiều dòng */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Table2 className="w-4 h-4" /> Thêm nhanh nhiều dòng
                </h3>
                <p className="text-xs text-gray-500 mb-3">Chỉ cần tên, giá, tồn kho, danh mục — ảnh có thể thêm sau khi tạo sản phẩm.</p>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 text-gray-500 font-bold uppercase text-xs">
                            <th className="py-2 pr-2 text-left">Tên</th>
                            <th className="py-2 pr-2 text-left w-28">Giá (VNĐ)</th>
                            <th className="py-2 pr-2 text-left w-24">Tồn kho</th>
                            <th className="py-2 pr-2 text-left w-40">Danh mục</th>
                            <th className="py-2 w-10" />
                        </tr>
                    </thead>
                    <tbody>
                        {bulkRows.map((row, index) => (
                            <tr key={index} className="border-b border-gray-50">
                                <td className="py-1.5 pr-2">
                                    <input
                                        type="text"
                                        className="w-full px-2 py-1.5 rounded-lg border border-gray-100 text-gray-800"
                                        placeholder="Tên sản phẩm"
                                        value={row.name}
                                        onChange={e => updateBulkRow(index, 'name', e.target.value)}
                                    />
                                </td>
                                <td className="py-1.5 pr-2">
                                    <input
                                        type="number"
                                        className="w-full px-2 py-1.5 rounded-lg border border-gray-100"
                                        placeholder="0"
                                        value={row.price}
                                        onChange={e => updateBulkRow(index, 'price', e.target.value)}
                                    />
                                </td>
                                <td className="py-1.5 pr-2">
                                    <input
                                        type="number"
                                        className="w-full px-2 py-1.5 rounded-lg border border-gray-100"
                                        placeholder="0"
                                        value={row.stock}
                                        onChange={e => updateBulkRow(index, 'stock', e.target.value)}
                                    />
                                </td>
                                <td className="py-1.5 pr-2">
                                    <select
                                        className="w-full px-2 py-1.5 rounded-lg border border-gray-100"
                                        value={row.category}
                                        onChange={e => updateBulkRow(index, 'category', e.target.value)}
                                    >
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </td>
                                <td className="py-1.5">
                                    <button type="button" onClick={() => removeBulkRow(index)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                                        <X className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex items-center gap-2 mt-3">
                    <button type="button" onClick={addBulkRow} className="text-sm text-primary font-medium hover:underline">
                        + Thêm dòng
                    </button>
                    <button
                        type="button"
                        onClick={handleBulkSave}
                        disabled={bulkSaving}
                        className="ml-auto px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium disabled:opacity-50"
                    >
                        {bulkSaving ? 'Đang lưu...' : 'Lưu tất cả'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminBulkTools;
