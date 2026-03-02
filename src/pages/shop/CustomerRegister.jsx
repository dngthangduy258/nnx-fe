import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import { UserPlus, Lock, Phone, User, MapPin, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import { useApp } from '../../context/AppContext';

const CustomerRegister = () => {
    const { customerRegister } = useApp();
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!phone.trim() || !name.trim() || !password) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }
        if (!/^[0-9]{10,11}$/.test(phone.trim())) {
            setError('Số điện thoại không hợp lệ');
            return;
        }
        if (password.length < 6) {
            setError('Mật khẩu tối thiểu 6 ký tự');
            return;
        }
        try {
            setLoading(true);
            await customerRegister(phone.trim(), name.trim(), password, address.trim());
            navigate('/account');
        } catch (err) {
            setError(err.message || 'Đăng ký thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SEO title="Đăng ký" description="Đăng ký tài khoản khách hàng" noindex />
            <div className="container pt-32 pb-20 min-h-screen">
                <div className="max-w-md mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <UserPlus className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-2xl font-black text-primary-dark">Đăng ký</h1>
                        <p className="text-gray-500 text-sm mt-1">Tạo tài khoản để quản lý đơn hàng dễ dàng</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>
                        )}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Số điện thoại *</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="0344311448"
                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Họ tên *</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nguyễn Văn A"
                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Mật khẩu * (tối thiểu 6 ký tự)</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Địa chỉ (tùy chọn)</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Số nhà, đường, phường, quận..."
                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full" size="lg" disabled={loading}>
                            {loading ? 'Đang xử lý...' : 'Đăng ký'} <ArrowRight className="w-5 h-5 ml-2 inline" />
                        </Button>
                    </form>
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Đã có tài khoản?{' '}
                        <Link to="/login" className="text-primary font-bold hover:underline">Đăng nhập</Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default CustomerRegister;
