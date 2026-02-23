import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Phone, Hash, ArrowRight, Package, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/common/Button';
import { API_BASE_URL } from '../../context/AppContext';

const LookupOrder = () => {
    const [lookupType, setLookupType] = useState('tracking'); // 'tracking' or 'phone'
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLookup = async (e) => {
        e.preventDefault();
        setError('');
        setResults(null);

        if (!inputValue.trim()) return;

        if (lookupType === 'tracking') {
            navigate(`/tracking/${inputValue.trim()}`);
            return;
        }

        // Phone Lookup
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/orders/lookup/phone/${inputValue.trim()}`);
            if (!response.ok) throw new Error('Không thể tìm kiếm đơn hàng');
            const data = await response.json();
            setResults(data);
            if (data.length === 0) {
                setError('Không tìm thấy đơn hàng nào gắn với số điện thoại này');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Đang xử lý';
            case 'shipping': return 'Đang giao hàng';
            case 'completed': return 'Đã hoàn thành';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    };

    return (
        <div className="lookup-page pt-32 pb-20">
            <div className="container max-w-2xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-primary-dark mb-4">Tra cứu đơn hàng</h1>
                    <p className="text-text-muted">Nhập mã đơn hàng hoặc số điện thoại để kiểm tra trạng thái</p>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 mb-8">
                    <div className="flex bg-gray-50 p-1 rounded-2xl mb-8">
                        <button
                            onClick={() => { setLookupType('tracking'); setInputValue(''); setError(''); setResults(null); }}
                            className={`flex-1 py-3 rounded-xl font-bold transition-all ${lookupType === 'tracking' ? 'bg-white shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Mã tra cứu (Tracking ID)
                        </button>
                        <button
                            onClick={() => { setLookupType('phone'); setInputValue(''); setError(''); setResults(null); }}
                            className={`flex-1 py-3 rounded-xl font-bold transition-all ${lookupType === 'phone' ? 'bg-white shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Số điện thoại
                        </button>
                    </div>

                    <form onSubmit={handleLookup} className="space-y-6">
                        <div className="relative">
                            {lookupType === 'tracking' ? (
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                            ) : (
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                            )}
                            <input
                                required
                                type="text"
                                placeholder={lookupType === 'tracking' ? "Nhập mã UUID (Vd: 550e8400...)" : "Nhập số điện thoại đặt hàng"}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 focus:border-primary outline-none transition-all shadow-inner bg-gray-50/50"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full py-4 h-auto text-lg" disabled={loading}>
                            {loading ? 'Đang tra cứu...' : 'Tiếp tục'} <ArrowRight className="ml-2 w-6 h-6" />
                        </Button>
                    </form>

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 text-red-500 rounded-2xl text-sm font-bold text-center">
                            {error}
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {results && results.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <h3 className="font-bold text-gray-500 uppercase text-xs tracking-widest ml-2 mb-4">Các đơn hàng tìm thấy</h3>
                            {results.map((order) => (
                                <div
                                    key={order.id}
                                    onClick={() => navigate(`/tracking/${order.tracking_id}`)}
                                    className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm hover:shadow-md hover:border-primary/20 transition-all cursor-pointer flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-extrabold text-primary-dark">Đơn hàng #{order.id}</p>
                                            <p className="text-xs text-text-muted">{new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-secondary mb-1">{order.total_amount.toLocaleString('vi-VN')} đ</p>
                                        <span className="text-[10px] font-black uppercase tracking-tighter bg-amber-50 text-amber-600 px-2 py-1 rounded-md">
                                            {getStatusText(order.status)}
                                        </span>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors ml-4" />
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default LookupOrder;
