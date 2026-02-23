import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Phone, User, Calendar, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AdminOrders = () => {
    const { orders, fetchOrders, updateOrderStatus } = useApp();

    React.useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = (orderId, newStatus) => {
        const note = prompt('Nhập ghi chú cho thay đổi trạng thái này:', `Trạng thái đơn hàng cập nhật thành: ${newStatus}`);
        if (note !== null) {
            updateOrderStatus(orderId, newStatus, note);
        }
    };

    return (
        <div className="admin-orders space-y-8">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">Danh sách đơn hàng</h1>
                <p className="text-sm md:text-base text-gray-500">Theo dõi và quản lý quá trình giao hàng cho khách hàng.</p>
            </div>

            {orders.length > 0 ? (
                <div className="grid gap-6">
                    {orders.map((order, idx) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                        >
                            <div className="flex flex-col md:flex-row justify-between mb-6 pb-6 border-b border-gray-50">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-black bg-primary/10 text-primary px-3 py-1 rounded-lg uppercase">Đơn hàng #{order.id}</span>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-lg uppercase ${order.status === 'completed' ? 'text-green-600 bg-green-50' :
                                            order.status === 'shipping' ? 'text-blue-600 bg-blue-50' :
                                                'text-amber-600 bg-amber-50'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mt-4">
                                        <span className="flex items-center gap-2 text-sm text-gray-600"><User className="w-4 h-4 text-primary" /> {order.customer_name}</span>
                                        <span className="flex items-center gap-2 text-sm text-gray-600"><Phone className="w-4 h-4 text-primary" /> {order.customer_phone}</span>
                                        <span className="flex items-center gap-2 text-sm text-gray-600"><Calendar className="w-4 h-4 text-primary" /> {new Date(order.created_at).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <p className="flex items-center gap-2 text-sm text-gray-500"><MapPin className="w-4 h-4 text-primary" /> {order.customer_address}</p>
                                </div>
                                <div className="mt-6 md:mt-0 text-left md:text-right">
                                    <p className="text-gray-400 text-[10px] md:text-xs uppercase font-bold mb-1">Tổng cộng</p>
                                    <p className="text-xl md:text-2xl font-black text-secondary">{order.total_amount.toLocaleString('vi-VN')} đ</p>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3 flex-wrap">
                                {order.status === 'pending' && (
                                    <button
                                        onClick={() => handleStatusUpdate(order.id, 'shipping')}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-all shadow-md"
                                    >
                                        Giao hàng
                                    </button>
                                )}
                                {order.status === 'shipping' && (
                                    <button
                                        onClick={() => handleStatusUpdate(order.id, 'completed')}
                                        className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-600 transition-all shadow-md"
                                    >
                                        Hoàn tất
                                    </button>
                                )}
                                {order.status !== 'cancelled' && order.status !== 'completed' && (
                                    <button
                                        onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                                        className="px-4 py-2 border border-red-200 text-red-500 rounded-xl text-sm font-bold hover:bg-red-50 transition-all"
                                    >
                                        Hủy đơn
                                    </button>
                                )}
                                <Link to={`/tracking/${order.tracking_id}`} className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all flex items-center gap-2">
                                    Chi tiết <ExternalLink className="w-4 h-4" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 bg-white rounded-[40px] border border-dashed border-gray-200">
                    <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-gray-800">Chưa có đơn hàng nào</h3>
                    <p className="text-gray-500">Các đơn hàng từ khách hàng sẽ xuất hiện tại đây.</p>
                </div>
            )}

        </div>
    );
};

export default AdminOrders;
