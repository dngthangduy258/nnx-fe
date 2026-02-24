import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Phone, User, Calendar, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AdminOrders = () => {
    const { orders, ordersPagination, fetchOrders, updateOrderStatus, fetchAdminOrderDetail } = useApp();
    const [detail, setDetail] = React.useState(null);
    const [loadingDetail, setLoadingDetail] = React.useState(false);
    const [loadingOrders, setLoadingOrders] = React.useState(false);
    const [shippingModalOrder, setShippingModalOrder] = React.useState(null);
    const [shippingForm, setShippingForm] = React.useState({
        shippingProvider: '',
        shippingCode: '',
        shippingContactName: '',
        shippingContactPhone: '',
        shippingFee: '',
        expectedDeliveryDate: '',
        note: ''
    });
    const [filters, setFilters] = React.useState({
        q: '',
        status: 'all',
        from: '',
        to: '',
        minTotal: '',
        maxTotal: '',
        sortBy: 'created_at',
        sortOrder: 'desc',
        page: 1,
        pageSize: 20
    });

    const loadOrders = async (nextFilters = filters) => {
        try {
            setLoadingOrders(true);
            await fetchOrders(nextFilters);
        } finally {
            setLoadingOrders(false);
        }
    };

    React.useEffect(() => {
        loadOrders(filters);
    }, []);

    const handleStatusUpdate = (orderId, newStatus) => {
        if (newStatus === 'shipping') {
            const order = orders.find((o) => o.id === orderId);
            setShippingModalOrder(order || { id: orderId });
            setShippingForm({
                shippingProvider: '',
                shippingCode: '',
                shippingContactName: '',
                shippingContactPhone: '',
                shippingFee: '',
                expectedDeliveryDate: '',
                note: 'Bàn giao cho đơn vị vận chuyển'
            });
            return;
        }
        const note = prompt('Nhập ghi chú cho thay đổi trạng thái này:', `Trạng thái đơn hàng cập nhật thành: ${newStatus}`);
        if (note !== null) {
            updateOrderStatus(orderId, newStatus, { note });
        }
    };

    const submitShipping = async (e) => {
        e.preventDefault();
        if (!shippingModalOrder) return;
        try {
            await updateOrderStatus(shippingModalOrder.id, 'shipping', {
                shippingProvider: shippingForm.shippingProvider,
                shippingCode: shippingForm.shippingCode,
                shippingContactName: shippingForm.shippingContactName,
                shippingContactPhone: shippingForm.shippingContactPhone,
                shippingFee: shippingForm.shippingFee === '' ? 0 : Number(shippingForm.shippingFee),
                expectedDeliveryDate: shippingForm.expectedDeliveryDate,
                note: shippingForm.note
            });
            setShippingModalOrder(null);
            await loadOrders(filters);
        } catch (error) {
            alert(error.message || 'Không thể cập nhật trạng thái giao hàng');
        }
    };

    const applyFilters = () => {
        const next = { ...filters, page: 1 };
        setFilters(next);
        loadOrders(next);
    };

    const clearFilters = () => {
        const reset = {
            q: '',
            status: 'all',
            from: '',
            to: '',
            minTotal: '',
            maxTotal: '',
            sortBy: 'created_at',
            sortOrder: 'desc',
            page: 1,
            pageSize: 20
        };
        setFilters(reset);
        loadOrders(reset);
    };

    const goToPage = (page) => {
        if (page < 1 || page > (ordersPagination.totalPages || 1)) return;
        const next = { ...filters, page };
        setFilters(next);
        loadOrders(next);
    };

    const openDetail = async (orderId) => {
        try {
            setLoadingDetail(true);
            const data = await fetchAdminOrderDetail(orderId);
            setDetail(data);
        } finally {
            setLoadingDetail(false);
        }
    };

    return (
        <div className="admin-orders space-y-8">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">Danh sách đơn hàng</h1>
                <p className="text-sm md:text-base text-gray-500">Theo dõi và quản lý quá trình giao hàng cho khách hàng.</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm grid md:grid-cols-4 gap-3">
                <input
                    value={filters.q}
                    onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value }))}
                    placeholder="Tìm tên khách, SĐT, tracking..."
                    className="px-3 py-2 rounded-xl border border-gray-200"
                />
                <select
                    value={filters.status}
                    onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                    className="px-3 py-2 rounded-xl border border-gray-200"
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="pending">Pending</option>
                    <option value="shipping">Shipping</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <input
                    type="date"
                    value={filters.from}
                    onChange={(e) => setFilters((prev) => ({ ...prev, from: e.target.value }))}
                    className="px-3 py-2 rounded-xl border border-gray-200"
                />
                <input
                    type="date"
                    value={filters.to}
                    onChange={(e) => setFilters((prev) => ({ ...prev, to: e.target.value }))}
                    className="px-3 py-2 rounded-xl border border-gray-200"
                />
                <input
                    type="number"
                    min="0"
                    value={filters.minTotal}
                    onChange={(e) => setFilters((prev) => ({ ...prev, minTotal: e.target.value }))}
                    placeholder="Tổng tiền từ"
                    className="px-3 py-2 rounded-xl border border-gray-200"
                />
                <input
                    type="number"
                    min="0"
                    value={filters.maxTotal}
                    onChange={(e) => setFilters((prev) => ({ ...prev, maxTotal: e.target.value }))}
                    placeholder="Tổng tiền đến"
                    className="px-3 py-2 rounded-xl border border-gray-200"
                />
                <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
                    className="px-3 py-2 rounded-xl border border-gray-200"
                >
                    <option value="created_at">Sắp xếp theo ngày</option>
                    <option value="total_amount">Sắp xếp theo tổng tiền</option>
                    <option value="status">Sắp xếp theo trạng thái</option>
                </select>
                <select
                    value={filters.sortOrder}
                    onChange={(e) => setFilters((prev) => ({ ...prev, sortOrder: e.target.value }))}
                    className="px-3 py-2 rounded-xl border border-gray-200"
                >
                    <option value="desc">Giảm dần</option>
                    <option value="asc">Tăng dần</option>
                </select>
                <div className="md:col-span-4 flex items-center gap-2">
                    <button onClick={applyFilters} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold">Áp dụng bộ lọc</button>
                    <button onClick={clearFilters} className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold">Xóa bộ lọc</button>
                    <div className="text-sm text-gray-500 ml-auto">
                        {loadingOrders ? 'Đang tải...' : `${ordersPagination.totalItems || 0} đơn hàng`}
                    </div>
                </div>
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
                                <button
                                    onClick={() => openDetail(order.id)}
                                    className="px-4 py-2 border border-primary/30 text-primary rounded-xl text-sm font-bold hover:bg-primary/5 transition-all"
                                >
                                    Xem chi tiết admin
                                </button>
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

            <div className="flex items-center justify-end gap-2">
                <button
                    disabled={(ordersPagination.page || 1) <= 1}
                    onClick={() => goToPage((ordersPagination.page || 1) - 1)}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40"
                >
                    Trước
                </button>
                <span className="text-sm text-gray-500">
                    Trang {ordersPagination.page || 1}/{ordersPagination.totalPages || 1}
                </span>
                <button
                    disabled={(ordersPagination.page || 1) >= (ordersPagination.totalPages || 1)}
                    onClick={() => goToPage((ordersPagination.page || 1) + 1)}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40"
                >
                    Sau
                </button>
            </div>

            {detail && (
                <div className="fixed inset-0 z-[120] bg-black/40 p-4 flex items-center justify-center">
                    <div className="bg-white w-full max-w-3xl rounded-3xl p-6 max-h-[85vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-black">Chi tiết đơn #{detail.id}</h3>
                            <button className="text-sm font-bold text-gray-500 hover:text-gray-800" onClick={() => setDetail(null)}>Đóng</button>
                        </div>
                        <div className="space-y-3 mb-6">
                            <p><span className="font-bold">Khách:</span> {detail.customer_name} - {detail.customer_phone}</p>
                            <p><span className="font-bold">Địa chỉ:</span> {detail.customer_address}</p>
                            <p><span className="font-bold">Trạng thái:</span> {detail.status}</p>
                            {detail.shipping && (
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm">
                                    <div className="font-bold text-blue-700 mb-1">Thông tin giao vận</div>
                                    <div>Đơn vị: {detail.shipping.shipping_provider}</div>
                                    <div>Mã vận đơn: {detail.shipping.shipping_code}</div>
                                    {detail.shipping.shipping_contact_name ? <div>Người nhận giao vận: {detail.shipping.shipping_contact_name}</div> : null}
                                    {detail.shipping.shipping_contact_phone ? <div>SĐT giao vận: {detail.shipping.shipping_contact_phone}</div> : null}
                                    <div>Phí vận chuyển: {(detail.shipping.shipping_fee || 0).toLocaleString('vi-VN')} đ</div>
                                    {detail.shipping.expected_delivery_date ? <div>Dự kiến giao: {detail.shipping.expected_delivery_date}</div> : null}
                                </div>
                            )}
                        </div>
                        <h4 className="font-bold mb-2">Sản phẩm</h4>
                        <div className="space-y-2 mb-6">
                            {detail.items?.map((item) => (
                                <div key={item.id} className="border border-gray-100 rounded-xl p-3 flex justify-between text-sm">
                                    <span>{item.product_name} (x{item.quantity})</span>
                                    <span className="font-bold">{(item.price_at_purchase * item.quantity).toLocaleString('vi-VN')} đ</span>
                                </div>
                            ))}
                        </div>
                        <h4 className="font-bold mb-2">Tracking</h4>
                        <div className="space-y-2">
                            {detail.tracking?.map((t) => (
                                <div key={t.id} className="border border-gray-100 rounded-xl p-3 text-sm">
                                    <div className="font-bold">{t.status}</div>
                                    <div>{t.note}</div>
                                    <div className="text-xs text-gray-400">{new Date(t.timestamp).toLocaleString('vi-VN')}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {loadingDetail && <div className="fixed bottom-4 right-4 bg-white border border-gray-100 shadow px-4 py-2 rounded-xl text-sm">Đang tải chi tiết...</div>}

            {shippingModalOrder && (
                <div className="fixed inset-0 z-[130] bg-black/40 p-4 flex items-center justify-center">
                    <div className="bg-white w-full max-w-xl rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-black">Chuyển đơn #{shippingModalOrder.id} sang giao hàng</h3>
                            <button className="text-sm font-bold text-gray-500 hover:text-gray-800" onClick={() => setShippingModalOrder(null)}>Đóng</button>
                        </div>
                        <form onSubmit={submitShipping} className="space-y-3">
                            <input required placeholder="Đơn vị vận chuyển (VD: GHN, GHTK, ViettelPost)" className="w-full px-3 py-2 border border-gray-200 rounded-xl" value={shippingForm.shippingProvider} onChange={(e) => setShippingForm((prev) => ({ ...prev, shippingProvider: e.target.value }))} />
                            <input required placeholder="Mã vận đơn của đơn vị giao vận" className="w-full px-3 py-2 border border-gray-200 rounded-xl" value={shippingForm.shippingCode} onChange={(e) => setShippingForm((prev) => ({ ...prev, shippingCode: e.target.value }))} />
                            <div className="grid md:grid-cols-2 gap-3">
                                <input placeholder="Người liên hệ giao vận" className="w-full px-3 py-2 border border-gray-200 rounded-xl" value={shippingForm.shippingContactName} onChange={(e) => setShippingForm((prev) => ({ ...prev, shippingContactName: e.target.value }))} />
                                <input placeholder="SĐT liên hệ giao vận" className="w-full px-3 py-2 border border-gray-200 rounded-xl" value={shippingForm.shippingContactPhone} onChange={(e) => setShippingForm((prev) => ({ ...prev, shippingContactPhone: e.target.value }))} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-3">
                                <input type="number" min="0" placeholder="Phí vận chuyển" className="w-full px-3 py-2 border border-gray-200 rounded-xl" value={shippingForm.shippingFee} onChange={(e) => setShippingForm((prev) => ({ ...prev, shippingFee: e.target.value }))} />
                                <input type="date" className="w-full px-3 py-2 border border-gray-200 rounded-xl" value={shippingForm.expectedDeliveryDate} onChange={(e) => setShippingForm((prev) => ({ ...prev, expectedDeliveryDate: e.target.value }))} />
                            </div>
                            <textarea placeholder="Ghi chú bàn giao" className="w-full px-3 py-2 border border-gray-200 rounded-xl h-24 resize-none" value={shippingForm.note} onChange={(e) => setShippingForm((prev) => ({ ...prev, note: e.target.value }))} />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShippingModalOrder(null)} className="px-4 py-2 border border-gray-200 rounded-xl">Hủy</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-xl font-bold">Xác nhận giao vận</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminOrders;
