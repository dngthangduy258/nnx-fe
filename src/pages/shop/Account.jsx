import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import { Package, User, LogOut, ShoppingCart, MapPin, Phone } from 'lucide-react';
import Button from '../../components/common/Button';
import { useApp } from '../../context/AppContext';
import { formatDateTimeUTC7 } from '../../utils/date';

const Account = () => {
    const { customer, customerOrders, isCustomerAuthenticated, customerLogout, fetchCustomerOrders, updateCustomerProfile } = useApp();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editAddress, setEditAddress] = useState('');
    const [saveError, setSaveError] = useState('');

    useEffect(() => {
        if (isCustomerAuthenticated) {
            fetchCustomerOrders();
            setEditName(customer?.name || '');
            setEditAddress(customer?.address || '');
        }
    }, [isCustomerAuthenticated, customer?.name, customer?.address, fetchCustomerOrders]);

    useEffect(() => {
        if (!isCustomerAuthenticated) {
            navigate('/dang-nhap');
        }
    }, [isCustomerAuthenticated, navigate]);

    const handleLogout = () => {
        customerLogout();
        navigate('/');
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaveError('');
        try {
            await updateCustomerProfile({ name: editName, address: editAddress });
            setEditing(false);
        } catch (err) {
            setSaveError(err.message || 'Cập nhật thất bại');
        }
    };

    if (!isCustomerAuthenticated) return null;

    return (
        <>
            <SEO title="Tài khoản" description="Quản lý đơn hàng và thông tin cá nhân" noindex />
            <div className="container pt-32 pb-20 min-h-screen">
                <h1 className="text-2xl font-black text-primary-dark mb-8">Tài khoản của tôi</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Thông tin cá nhân */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6">
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" /> Thông tin cá nhân
                        </h2>
                        {editing ? (
                            <form onSubmit={handleSaveProfile} className="space-y-4">
                                {saveError && <div className="p-2 rounded bg-red-50 text-red-600 text-sm">{saveError}</div>}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Họ tên</label>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Số điện thoại</label>
                                    <input type="text" value={customer?.phone} disabled className="w-full px-4 py-2 border border-gray-100 rounded-xl bg-gray-50 text-gray-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Địa chỉ</label>
                                    <input
                                        type="text"
                                        value={editAddress}
                                        onChange={(e) => setEditAddress(e.target.value)}
                                        placeholder="Số nhà, đường, phường, quận..."
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit">Lưu</Button>
                                    <Button type="button" variant="outline" onClick={() => setEditing(false)}>Hủy</Button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-2">
                                <p><span className="text-gray-500">Họ tên:</span> <span className="font-bold">{customer?.name}</span></p>
                                <p><span className="text-gray-500">SĐT:</span> <span className="font-bold">{customer?.phone}</span></p>
                                <p><span className="text-gray-500">Địa chỉ:</span> {customer?.address || '—'}</p>
                                <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="mt-2">Chỉnh sửa</Button>
                            </div>
                        )}
                    </div>

                    {/* Quick links */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6">
                        <h2 className="font-bold text-lg mb-4">Truy cập nhanh</h2>
                        <div className="space-y-3">
                            <Link to="/cart" className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                                <ShoppingCart className="w-6 h-6 text-primary" />
                                <span className="font-bold">Giỏ hàng</span>
                            </Link>
                            <Link to="/products" className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                                <Package className="w-6 h-6 text-primary" />
                                <span className="font-bold">Tiếp tục mua sắm</span>
                            </Link>
                            <button onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-xl border border-red-100 hover:bg-red-50 text-red-600 transition-colors w-full">
                                <LogOut className="w-6 h-6" />
                                <span className="font-bold">Đăng xuất</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Đơn hàng của tôi */}
                <div className="mt-10 bg-white rounded-3xl border border-gray-100 shadow-lg p-6">
                    <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary" /> Đơn hàng của tôi
                    </h2>
                    {customerOrders.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p>Chưa có đơn hàng nào</p>
                            <Link to="/products"><Button className="mt-4">Mua sắm ngay</Button></Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {customerOrders.map((order) => (
                                <Link
                                    key={order.id}
                                    to={`/tracking/${order.tracking_id}`}
                                    className="block p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all"
                                >
                                    <div className="flex flex-wrap justify-between items-center gap-2">
                                        <div>
                                            <span className="font-bold text-primary">#{order.id}</span>
                                            <span className="text-gray-500 text-sm ml-2">{order.tracking_id}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-secondary">{order.total_amount?.toLocaleString('vi-VN')} đ</span>
                                            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                                                order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                order.status === 'shipping' ? 'bg-blue-100 text-blue-700' :
                                                order.status === 'cancelled' ? 'bg-gray-100 text-gray-600' :
                                                'bg-amber-100 text-amber-700'
                                            }`}>
                                                {order.status === 'pending' ? 'Đang xử lý' : order.status === 'shipping' ? 'Đang giao' : order.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">{formatDateTimeUTC7(order.created_at)}</p>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Account;
