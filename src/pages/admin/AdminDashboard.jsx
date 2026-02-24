import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, Users, DollarSign, Package, TrendingUp, ArrowUpRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const { products, orders, fetchOrders } = useApp();

    React.useEffect(() => {
        fetchOrders();
    }, []);

    const totalSales = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    const totalProducts = products.length;
    const totalOrders = orders.length;

    const stats = [
        { title: 'Tổng doanh thu', value: `${totalSales.toLocaleString('vi-VN')} đ`, icon: DollarSign, color: 'bg-green-500', trend: '+12%' },
        { title: 'Sản phẩm', value: totalProducts, icon: Package, color: 'bg-blue-500', trend: '+3 mới' },
        { title: 'Đơn hàng', value: totalOrders, icon: ShoppingBag, color: 'bg-purple-500', trend: '+5 hôm nay' },
        { title: 'Khách hàng', value: '1,250', icon: Users, color: 'bg-orange-500', trend: '+15%' },
    ];

    return (
        <div className="admin-dashboard space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">Tổng quan</h1>
                    <p className="text-sm md:text-base text-gray-500">Chào mừng bạn trở lại, đây là những gì đang diễn ra.</p>
                </div>
                <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg w-full md:w-auto">
                    <TrendingUp className="w-5 h-5" /> Tải báo cáo
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.color} text-white`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full bg-green-50 text-green-600 flex items-center gap-1`}>
                                {stat.trend} <ArrowUpRight className="w-3 h-3" />
                            </span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
                        <p className="text-2xl font-black text-gray-800">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Orders Table Mini */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <h2 className="font-bold text-lg">Đơn hàng gần đây</h2>
                        <button className="text-primary font-bold text-sm">Xem tất cả</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 text-xs uppercase text-gray-400 font-bold">
                                    <th className="px-6 py-4">Mã ĐH</th>
                                    <th className="px-6 py-4">Khách hàng</th>
                                    <th className="px-6 py-4">Tổng tiền</th>
                                    <th className="px-6 py-4">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.length > 0 ? orders.slice(0, 5).map((order) => (
                                    <tr key={order.id} className="text-sm hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-700">#{order.id.toString().slice(-6)}</td>
                                        <td className="px-6 py-4">{order.customer_name}</td>
                                        <td className="px-6 py-4 font-bold">{(order.total_amount || 0).toLocaleString('vi-VN')} đ</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold uppercase">
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10 text-center text-gray-400">Chưa có đơn hàng nào</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" /> Hoạt động mới
                    </h2>
                    <div className="space-y-6">
                        {[
                            { text: 'Kho hàng đã nhập thêm 50 Phân bón NPK', time: '5 phút trước', type: 'product' },
                            { text: 'Đơn hàng #8821 đã được giao thành công', time: '1 giờ trước', type: 'order' },
                            { text: 'Khách hàng mới đăng ký tài khoản', time: '3 giờ trước', type: 'user' },
                            { text: 'Hết hàng: Thuốc diệt cỏ Glyphosate', time: '5 giờ trước', type: 'alert' }
                        ].map((act, i) => (
                            <div key={i} className="flex gap-4">
                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${act.type === 'alert' ? 'bg-red-500' : 'bg-primary'}`}></div>
                                <div>
                                    <p className="text-sm text-gray-700">{act.text}</p>
                                    <span className="text-[10px] text-gray-400 uppercase font-bold">{act.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;
