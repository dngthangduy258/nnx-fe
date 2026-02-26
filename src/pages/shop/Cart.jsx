import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, CreditCard, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/common/Button';
import SearchableSelect from '../../components/common/SearchableSelect';
import { addressesOld, addressesNew } from '../../data/vietnam-addresses';

const Cart = () => {
    const { cart, removeFromCart, updateCartQuantity, checkout, getProductImageUrl } = useApp();
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [addressType, setAddressType] = useState('old'); // 'old' | 'new'
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        phone: '',
        provinceId: '',
        districtId: '',
        wardId: '',
        streetAddress: ''
    });

    const addresses = addressType === 'old' ? addressesOld : addressesNew;
    const selectedProvince = useMemo(() => addresses.find(p => p.id === customerInfo.provinceId), [addresses, customerInfo.provinceId]);
    const selectedDistrict = useMemo(() => selectedProvince?.districts?.find(d => d.id === customerInfo.districtId), [selectedProvince, customerInfo.districtId]);
    const isNewFormat = addressType === 'new';
    const districts = selectedProvince?.districts ?? [];
    const wards = isNewFormat ? (selectedProvince?.wards ?? []) : (selectedDistrict?.wards ?? []);

    const buildAddressString = () => {
        const parts = [];
        if (customerInfo.streetAddress?.trim()) parts.push(customerInfo.streetAddress.trim());
        const ward = isNewFormat
            ? selectedProvince?.wards?.find(w => w.id === customerInfo.wardId)
            : selectedDistrict?.wards?.find(w => w.id === customerInfo.wardId);
        if (ward) parts.push(ward.name);
        if (!isNewFormat && selectedDistrict) parts.push(selectedDistrict.name);
        if (selectedProvince) parts.push(selectedProvince.name);
        return parts.join(', ');
    };
    const [orderData, setOrderData] = useState(null);

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 1000000 ? 0 : 35000;
    const total = subtotal + shipping;

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return;

        const address = buildAddressString();
        const msg = isNewFormat ? 'Vui lòng chọn Tỉnh/Thành phố và Xã/Phường.'
            : 'Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện, Xã/Phường.';
        if (!address?.trim()) {
            alert(msg);
            return;
        }

        try {
            setIsLoading(true);
            const result = await checkout({ ...customerInfo, address });
            setOrderData(result);
            setIsOrderPlaced(true);
        } catch (err) {
            alert(err.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddressTypeChange = (type) => {
        setAddressType(type);
        setCustomerInfo(prev => ({ ...prev, provinceId: '', districtId: '', wardId: '' }));
    };

    const handleProvinceChange = (id) => {
        setCustomerInfo(prev => ({ ...prev, provinceId: id, districtId: '', wardId: '' }));
    };

    const handleWardChange = (id) => {
        setCustomerInfo(prev => ({ ...prev, wardId: id }));
    };

    const handleDistrictChange = (id) => {
        setCustomerInfo(prev => ({ ...prev, districtId: id, wardId: '' }));
    };

    if (isOrderPlaced) {
        return (
            <div className="container pt-40 pb-20 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md mx-auto"
                >
                    <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-primary-dark mb-4">Đặt hàng thành công!</h2>
                    <p className="text-text-muted mb-2">
                        Cảm ơn bạn đã tin tưởng Nông Nghiệp Xanh. Chúng tôi sẽ liên hệ sớm nhất để xác nhận đơn hàng.
                    </p>
                    <p className="font-bold text-primary mb-8">Mã đơn hàng: #{orderData.id}</p>
                    <div className="flex flex-col gap-3">
                        <Link to={`/tracking/${orderData.trackingId}`}>
                            <Button variant="outline" className="w-full">Theo dõi đơn hàng</Button>
                        </Link>
                        <Link to="/products">
                            <Button size="lg" className="w-full">Tiếp tục mua sắm</Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="cart-page pt-24 pb-20">
            <div className="container">
                <h1 className="text-3xl font-extrabold text-primary-dark mb-10">Giỏ hàng của bạn</h1>

                {cart.length > 0 ? (
                    <div className="grid lg:grid-cols-3 gap-10">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            <AnimatePresence>
                                {cart.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
                                    >
                                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                                            <img src={getProductImageUrl(item.image, false, item.category)} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 text-center sm:text-left">
                                            <h3 className="font-bold text-gray-800 mb-1">{item.name}</h3>
                                            <p className="text-sm text-text-muted capitalize mb-2">{item.category}</p>
                                            <p className="font-bold text-primary">{item.price.toLocaleString('vi-VN')} đ</p>
                                        </div>

                                        <div className="flex items-center border border-gray-100 rounded-lg p-1 bg-gray-50">
                                            <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-white rounded-md transition-all">
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                                            <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-white rounded-md transition-all">
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-6 sm:gap-2 w-full sm:w-auto sm:min-w-[120px]">
                                            <p className="font-bold text-lg text-primary sm:text-gray-800">{(item.price * item.quantity).toLocaleString('vi-VN')} đ</p>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-400 hover:text-red-600 transition-colors p-2 sm:p-0"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Summary & Checkout */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h2 className="text-xl font-bold mb-6">Đơn hàng</h2>
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-text-muted">
                                        <span>Tạm tính</span>
                                        <span>{subtotal.toLocaleString('vi-VN')} đ</span>
                                    </div>
                                    <div className="flex justify-between text-text-muted">
                                        <span>Phí vận chuyển</span>
                                        <span>{shipping === 0 ? 'Miễn phí' : `${shipping.toLocaleString('vi-VN')} đ`}</span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-4 flex justify-between font-extrabold text-lg sm:text-xl text-primary-dark">
                                        <span>Tổng cộng</span>
                                        <span className="text-secondary">{total.toLocaleString('vi-VN')} đ</span>
                                    </div>
                                </div>

                                <form onSubmit={handleCheckout} className="space-y-4">
                                    <input
                                        required
                                        type="text"
                                        placeholder="Họ và tên"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
                                        value={customerInfo.name}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                    />
                                    <input
                                        required
                                        type="tel"
                                        placeholder="Số điện thoại"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
                                        value={customerInfo.phone}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                    />

                                    <div className="space-y-3">
                                        <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <MapPin className="w-4 h-4" /> Địa chỉ nhận hàng
                                        </p>
                                        <>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="addressType"
                                                    checked={addressType === 'old'}
                                                    onChange={() => handleAddressTypeChange('old')}
                                                    className="text-primary"
                                                />
                                                <span className="text-sm">Đơn vị hành chính cũ</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="addressType"
                                                    checked={addressType === 'new'}
                                                    onChange={() => handleAddressTypeChange('new')}
                                                    className="text-primary"
                                                />
                                                <span className="text-sm">Đơn vị hành chính mới</span>
                                            </label>
                                        </div>

                                        <SearchableSelect
                                            required
                                            options={addresses}
                                            value={customerInfo.provinceId}
                                            onChange={handleProvinceChange}
                                            placeholder="Chọn Tỉnh / Thành phố"
                                            searchPlaceholder="Gõ để tìm (vd: ca → Cà Mau)"
                                            getOptionLabel={(o) => o.name}
                                            getOptionValue={(o) => o.id}
                                        />

                                        {!isNewFormat && (
                                            <SearchableSelect
                                                required
                                                options={districts}
                                                value={customerInfo.districtId}
                                                onChange={handleDistrictChange}
                                                placeholder="Chọn Quận / Huyện"
                                                searchPlaceholder="Gõ để tìm..."
                                                disabled={!customerInfo.provinceId}
                                                getOptionLabel={(o) => o.name}
                                                getOptionValue={(o) => o.id}
                                            />
                                        )}

                                        <SearchableSelect
                                            required
                                            options={wards}
                                            value={customerInfo.wardId}
                                            onChange={handleWardChange}
                                            placeholder="Chọn Xã / Phường"
                                            searchPlaceholder="Gõ để tìm..."
                                            disabled={!customerInfo.provinceId}
                                            getOptionLabel={(o) => o.name}
                                            getOptionValue={(o) => o.id}
                                        />

                                        <input
                                            type="text"
                                            placeholder="Số nhà, tên đường (tùy chọn)"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
                                            value={customerInfo.streetAddress}
                                            onChange={(e) => setCustomerInfo({ ...customerInfo, streetAddress: e.target.value })}
                                        />
                                        </>
                                    </div>

                                    <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
                                        {isLoading ? 'Đang xử lý...' : 'Gửi Đơn Hàng'} <ArrowRight className="w-5 h-5" />
                                    </Button>
                                </form>

                                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-text-muted uppercase font-bold text-center">
                                    <CreditCard className="w-4 h-4" /> Thanh toán khi nhận hàng (COD)
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <ShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h3>
                        <p className="text-text-muted mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
                        <Link to="/products">
                            <Button size="lg">Khám phá sản phẩm</Button>
                        </Link>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Cart;
