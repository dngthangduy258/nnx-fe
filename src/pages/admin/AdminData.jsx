import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Database, Play, Table2, AlertCircle } from 'lucide-react';

const AdminData = () => {
    const { fetchD1Tables, runD1Query } = useApp();
    const [tables, setTables] = useState([]);
    const [loadingTables, setLoadingTables] = useState(true);
    const [sql, setSql] = useState('');
    const [paramsText, setParamsText] = useState('[]');
    const [running, setRunning] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        setLoadingTables(true);
        fetchD1Tables()
            .then((list) => { if (!cancelled) setTables(list || []); })
            .catch((e) => { if (!cancelled) setError(e?.message || 'Loi tai bang'); })
            .finally(() => { if (!cancelled) setLoadingTables(false); });
        return () => { cancelled = true; };
    }, [fetchD1Tables]);

    const handleRun = async () => {
        const trimmed = sql.trim();
        if (!trimmed) {
            setError('Nhap cau lenh SQL');
            return;
        }
        setError(null);
        setResult(null);
        setRunning(true);
        let params = [];
        try {
            if (paramsText.trim()) params = JSON.parse(paramsText);
        } catch (_) {
            setError('Tham so params phai la JSON hop le (vd: [1, "x"])');
            setRunning(false);
            return;
        }
        try {
            const data = await runD1Query(trimmed, params);
            setResult(data);
        } catch (e) {
            setError(e?.message || 'Thuc thi that bai');
        } finally {
            setRunning(false);
        }
    };

    const handleTableClick = (name) => {
        setSql(`SELECT * FROM ${name} LIMIT 100`);
        setError(null);
        setResult(null);
    };

    return (
        <div className="admin-data space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 flex items-center gap-2">
                    <Database className="w-8 h-8" /> Dữ liệu D1 / SQL
                </h1>
                <p className="text-sm text-gray-500 mt-1">Xem bang va thuc thi cau lenh SQL (chi 1 cau lenh, toi da 500 dong cho SELECT).</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Danh sach bang */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-3">
                        <Table2 className="w-4 h-4" /> Bảng
                    </h3>
                    {loadingTables ? (
                        <p className="text-sm text-gray-500">Đang tải...</p>
                    ) : (
                        <ul className="space-y-1">
                            {tables.map((t) => (
                                <li key={t}>
                                    <button
                                        type="button"
                                        onClick={() => handleTableClick(t)}
                                        className="w-full text-left px-3 py-2 rounded-lg text-sm font-mono bg-gray-50 hover:bg-primary/10 text-gray-700 hover:text-primary"
                                    >
                                        {t}
                                    </button>
                                </li>
                            ))}
                            {tables.length === 0 && <p className="text-sm text-gray-500">Không có bảng.</p>}
                        </ul>
                    )}
                </div>

                {/* SQL + ket qua */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Câu lệnh SQL</label>
                        <textarea
                            value={sql}
                            onChange={(e) => setSql(e.target.value)}
                            placeholder="VD: SELECT * FROM products LIMIT 10"
                            className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 font-mono text-sm resize-y"
                            spellCheck={false}
                        />
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <label className="text-xs text-gray-500">Tham số (JSON):</label>
                            <input
                                type="text"
                                value={paramsText}
                                onChange={(e) => setParamsText(e.target.value)}
                                placeholder="[]"
                                className="flex-1 min-w-[120px] px-2 py-1.5 rounded border border-gray-200 font-mono text-xs"
                            />
                            <button
                                type="button"
                                onClick={handleRun}
                                disabled={running}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                            >
                                <Play className="w-4 h-4" /> {running ? 'Đang chạy...' : 'Chạy'}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-start gap-2 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {result && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 overflow-hidden">
                            {result.columns ? (
                                <>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {result.rows?.length ?? 0} dòng
                                        {result.truncated && ` (chi hien ${result.rows?.length}, tong ${result.total})`}
                                    </p>
                                    <div className="overflow-x-auto max-h-96 overflow-y-auto">
                                        <table className="w-full text-sm border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-200">
                                                    {result.columns.map((col) => (
                                                        <th key={col} className="px-3 py-2 text-left font-bold text-gray-600 whitespace-nowrap">
                                                            {col}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(result.rows || []).map((row, i) => (
                                                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                                                        {result.columns.map((col) => (
                                                            <td key={col} className="px-3 py-2 text-gray-800 max-w-xs truncate" title={String(row[col] ?? '')}>
                                                                {row[col] != null ? String(row[col]) : 'NULL'}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) : (
                                <p className="text-sm text-gray-600">
                                    Đã thực thi. Thay đổi: <strong>{result.changes ?? 0}</strong>
                                    {result.lastRowId != null && ` • last row id: ${result.lastRowId}`}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminData;
