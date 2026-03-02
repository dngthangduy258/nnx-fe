import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import { Package, Truck, CheckCircle, Clock, MapPin, User, Phone, ArrowLeft, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import { useApp, API_BASE_URL, getProductImageUrl } from '../../context/AppContext';
import { formatDateTimeUTC7 } from '../../utils/date';

const OrderTracking = () => {
    const { trackingId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const payosSuccess = searchParams.get('payos') === 'success' || searchParams.get('status') === 'PAID';
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(order.tracking_id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/orders/${trackingId}`);
                if (!response.ok) throw new Error('Không tìm thấy đơn hàng');
                const data = await response.json();
                setOrder(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [trackingId]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock className="w-6 h-6 text-amber-500" />;
            case 'shipping': return <Truck className="w-6 h-6 text-blue-500" />;
            case 'completed': return <CheckCircle className="w-6 h-6 text-green-500" />;
            default: return <Package className="w-6 h-6 text-gray-500" />;
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

    if (loading) return (
        <div className="container pt-40 pb-20 text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-bold">Đang tra cứu đơn hàng...</p>
        </div>
    );

    if (error || !order) return (
        <div className="container pt-40 pb-20 text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Lỗi</h2>
            <p className="text-gray-600 mb-8">{error || 'Không tìm thấy đơn hàng'}</p>
            <Button onClick={() => navigate('/products')}>Quay lại mua sắm</Button>
        </div>
    );

    return (
        <>
            <SEO title={`Đơn hàng #${order.id}`} description={`Tra cứu đơn hàng ${order.tracking_id}`} noindex />
            <div className="order-tracking-page pt-24 pb-20 bg-gray-50/30 min-h-screen">
                <div className="container">
                {payosSuccess && (
                    <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                                <CheckCircle className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-extrabold text-green-800 mb-2">Thanh toán thành công!</h2>
                                <p className="text-green-700 font-medium mb-1">Chúng tôi đã nhận được thanh toán của bạn qua PayOS.</p>
                                <p className="text-green-700/90 text-sm">Cửa hàng sẽ chuẩn bị đơn hàng và giao cho đơn vị vận chuyển ngay. Bạn sẽ nhận được thông báo khi đơn hàng được gửi đi.</p>
                            </div>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-bold mb-8 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Quay lại
                </button>

                {!order ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200 shadow-sm">
                        <Package className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy đơn hàng</h2>
                        <p className="text-text-muted mt-2">Vui lòng kiểm tra lại mã vận đơn của bạn.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Header Info */}
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-lg">Mã đơn hàng</span>
                                </div>
                                <h1 className="text-5xl font-black text-primary-dark">#{order.id}</h1>
                                <div className="mt-4 flex flex-wrap items-center gap-3">
                                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 rounded-2xl group relative">
                                        <span className="text-xs font-mono text-gray-400 select-all">{order.tracking_id}</span>
                                        <button
                                            onClick={copyToClipboard}
                                            className="p-1 hover:bg-white rounded-lg transition-all text-gray-400 hover:text-primary"
                                            title="Copy Tracking ID"
                                        >
                                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                        {copied && (
                                            <motion.span
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-3 py-1.5 rounded-lg font-bold"
                                            >
                                                Đã copy!
                                            </motion.span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-amber-50 border border-amber-100 rounded-3xl p-8 flex items-center gap-6 min-w-[240px]">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-amber-500">
                                    {getStatusIcon(order.status)}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-amber-600/60 mb-1">Trạng thái hiện tại</p>
                                    <p className="text-2xl font-black text-amber-600 capitalize">{order.status === 'pending' ? 'Đang xử lý' : order.status === 'shipping' ? 'Đang giao hàng' : 'Hoàn tất'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                            <div className="p-8 grid md:grid-cols-2 gap-10">
                                <div>
                                    <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                                        <User className="w-5 h-5 text-primary" /> Thông tin nhận hàng
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4">
                                            <User className="w-5 h-5 text-gray-300 mt-1" />
                                            <div>
                                                <p className="text-sm text-text-muted">Người nhận</p>
                                                <p className="font-bold">{order.customer_name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <Phone className="w-5 h-5 text-gray-300 mt-1" />
                                            <div>
                                                <p className="text-sm text-text-muted">Số điện thoại</p>
                                                <p className="font-bold">{order.customer_phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <MapPin className="w-5 h-5 text-gray-300 mt-1" />
                                            <div>
                                                <p className="text-sm text-text-muted">Địa chỉ</p>
                                                <p className="font-bold">{order.customer_address}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {order.shipping && (
                                        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-2">
                                            <h4 className="font-bold text-blue-700 text-sm uppercase">Thông tin giao vận</h4>
                                            <p className="text-sm"><span className="font-semibold">Đơn vị vận chuyển:</span> {order.shipping.shipping_provider}</p>
                                            <p className="text-sm"><span className="font-semibold">Mã vận đơn hãng:</span> {order.shipping.shipping_code}</p>
                                            {order.shipping.shipping_contact_name ? (
                                                <p className="text-sm"><span className="font-semibold">Liên hệ giao vận:</span> {order.shipping.shipping_contact_name}</p>
                                            ) : null}
                                            {order.shipping.shipping_contact_phone ? (
                                                <p className="text-sm"><span className="font-semibold">SĐT giao vận:</span> {order.shipping.shipping_contact_phone}</p>
                                            ) : null}
                                            <p className="text-sm"><span className="font-semibold">Phí vận chuyển:</span> {(order.shipping.shipping_fee || 0).toLocaleString('vi-VN')} đ</p>
                                            {order.shipping.expected_delivery_date ? (
                                                <p className="text-sm"><span className="font-semibold">Dự kiến giao:</span> {order.shipping.expected_delivery_date}</p>
                                            ) : null}
                                        </div>
                                    )}
                                </div>

                                {/* Order Summary */}
                                <div>
                                    <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                                        <Package className="w-5 h-5 text-primary" /> Chi tiết sản phẩm
                                    </h3>
                                    <div className="space-y-4 max-h-[350px] overflow-y-auto mb-6 pr-2 custom-scrollbar">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex gap-4 items-center group transition-all p-2 hover:bg-gray-50 rounded-2xl">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                                                    <img src={getProductImageUrl(item.product_image, false, item.product_category)} alt={item.product_name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">{item.product_name}</p>
                                                    <p className="text-xs text-text-muted">SL: {item.quantity} x {item.price_at_purchase.toLocaleString('vi-VN')}đ</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-sm">{(item.quantity * item.price_at_purchase).toLocaleString('vi-VN')} đ</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Tổng tiền thanh toán</p>
                                            <span className="font-bold text-gray-500">Tổng cộng</span>
                                        </div>
                                        <span className="text-3xl font-black text-secondary">{order.total_amount.toLocaleString('vi-VN')} đ</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tracking History */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8">
                            <h3 className="font-bold text-xl mb-8">Lịch sử đơn hàng</h3>
                            <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                                {order.tracking.map((t, index) => (
                                    <div key={index} className="relative pl-10">
                                        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${index === 0 ? 'bg-primary' : 'bg-gray-300'}`}>
                                        </div>
                                        <div>
                                            <p className={`font-bold ${index === 0 ? 'text-primary' : 'text-gray-600'}`}>{getStatusText(t.status)}</p>
                                            <p className="text-sm text-text-muted mb-1">{t.note}</p>
                                            <p className="text-xs text-gray-400">{formatDateTimeUTC7(t.timestamp)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </>
    );
};

export default OrderTracking;
