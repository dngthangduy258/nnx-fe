import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Database, Upload } from 'lucide-react';
import AdminData from './AdminData';
import AdminBulkTools from './AdminBulkTools';

const TECH_STORAGE_KEY = 'nnx_tech_unlocked';
const TECH_PASSWORD = 'lollipop310@';

const AdminTech = () => {
    const [unlocked, setUnlocked] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('sql'); // 'sql' | 'bulk'

    useEffect(() => {
        try {
            if (sessionStorage.getItem(TECH_STORAGE_KEY) === '1') setUnlocked(true);
        } catch (_) {}
    }, []);

    const handleUnlock = (e) => {
        e.preventDefault();
        setError('');
        if (password === TECH_PASSWORD) {
            try { sessionStorage.setItem(TECH_STORAGE_KEY, '1'); } catch (_) {}
            setUnlocked(true);
            setPassword('');
        } else {
            setError('Mật khẩu không đúng.');
        }
    };

    const handleLock = () => {
        try { sessionStorage.removeItem(TECH_STORAGE_KEY); } catch (_) {}
        setUnlocked(false);
    };

    if (!unlocked) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-6">
                <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-100 text-amber-700 mx-auto mb-4">
                        <Lock className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-800 text-center mb-1">Khu vực kỹ thuật</h2>
                    <p className="text-sm text-gray-500 text-center mb-4">Nhập mật khẩu để mở khóa.</p>
                    <form onSubmit={handleUnlock} className="space-y-3">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mật khẩu"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
                            autoFocus
                        />
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90"
                        >
                            Mở khóa
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-tech space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Kỹ thuật</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                        <Unlock className="w-3 h-3" /> Đã mở khóa
                    </span>
                </div>
                <button
                    type="button"
                    onClick={handleLock}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50"
                >
                    <Lock className="w-4 h-4" /> Khóa lại
                </button>
            </div>

            <div className="flex border-b border-gray-200 gap-1">
                <button
                    type="button"
                    onClick={() => setActiveTab('sql')}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-medium transition-colors ${activeTab === 'sql' ? 'bg-white border border-b-0 border-gray-200 text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Database className="w-4 h-4" /> Dữ liệu / SQL
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('bulk')}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-medium transition-colors ${activeTab === 'bulk' ? 'bg-white border border-b-0 border-gray-200 text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Upload className="w-4 h-4" /> Công cụ hàng loạt
                </button>
            </div>

            <div className="pt-2">
                {activeTab === 'sql' && <AdminData />}
                {activeTab === 'bulk' && <AdminBulkTools />}
            </div>
        </div>
    );
};

export default AdminTech;
