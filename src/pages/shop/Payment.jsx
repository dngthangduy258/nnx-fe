import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, ExternalLink, CreditCard } from 'lucide-react';
import Button from '../../components/common/Button';
import { API_BASE_URL } from '../../context/AppContext';

const Payment = () => {
    const { trackingId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPaymentInfo = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE_URL}/orders/${trackingId}/payment-info`);
                if (!res.ok) throw new Error('Không tìm thấy thông tin thanh toán');
                const json = await res.json();
                setData(json);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPaymentInfo();
    }, [trackingId]);

    const openPayOS = () => {
        if (data?.checkoutUrl) window.location.href = data.checkoutUrl;
    };

    if (loading) return (
        <div className="container pt-40 pb-20 text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-bold">Đang tải thông tin thanh toán...</p>
        </div>
    );

    if (error || !data) return (
        <div className="container pt-40 pb-20 text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Lỗi</h2>
            <p className="text-gray-600 mb-8">{error || 'Không tìm thấy thông tin thanh toán'}</p>
            <Button onClick={() => navigate('/cart')}>Quay lại giỏ hàng</Button>
        </div>
    );

    return (
        <>
            <SEO title={`Thanh toán đơn #${trackingId}`} description="Quét mã QR để thanh toán qua PayOS" noindex />
            <div className="container pt-24 pb-20 min-h-screen">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-bold mb-8 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Quay lại
                </button>

                <div className="max-w-md mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <CreditCard className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-2xl font-black text-primary-dark mb-2">Thanh toán qua PayOS</h1>
                        <p className="text-gray-500 text-sm">Quét mã QR bằng app ngân hàng để thanh toán</p>
                    </div>

                    <div className="mb-8">
                        <p className="text-sm text-gray-500 mb-2">Mã đơn hàng: <span className="font-mono font-bold text-gray-800">{trackingId}</span></p>
                        <p className="text-2xl font-black text-secondary mb-6">{data.totalAmount?.toLocaleString('vi-VN')} đ</p>

                        {data.qrCode ? (
                            <div className="flex justify-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <QRCodeSVG value={data.qrCode} size={220} level="M" includeMargin />
                            </div>
                        ) : (
                            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200 text-amber-800 text-center">
                                <p className="font-bold mb-2">Không có mã QR</p>
                                <p className="text-sm">Nhấn nút bên dưới để mở trang PayOS và thanh toán.</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <Button onClick={openPayOS} className="w-full flex items-center justify-center gap-2" size="lg">
                            <ExternalLink className="w-5 h-5" /> Mở trang PayOS để thanh toán
                        </Button>
                        <Button variant="outline" onClick={() => navigate(`/tracking/${trackingId}`)} className="w-full">
                            Theo dõi đơn hàng
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Payment;
