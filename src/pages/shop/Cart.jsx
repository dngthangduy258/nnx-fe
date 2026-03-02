import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import SEO from '../../components/common/SEO';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, CreditCard, MapPin, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/common/Button';
import SearchableSelect from '../../components/common/SearchableSelect';
import { addressesOld, addressesNew } from '../../data/vietnam-addresses';
import { parseAddressFromApi } from '../../components/common/AddressForm';

const Cart = () => {
    const { cart, removeFromCart, updateCartQuantity, checkout, getProductImageUrl, customer, isCustomerAuthenticated } = useApp();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const payosCancel = searchParams.get('payos') === 'cancel';
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
    const [formError, setFormError] = useState('');
    const [showReview, setShowReview] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');

    useEffect(() => {
        if (payosCancel) {
            setSearchParams({}, { replace: true });
        }
    }, [payosCancel, setSearchParams]);

    useEffect(() => {
        if (isCustomerAuthenticated && customer) {
            const parsedAddr = parseAddressFromApi(customer.address);
            if (parsedAddr) {
                setAddressType(parsedAddr.addressType || 'old');
                setCustomerInfo(prev => ({
                    ...prev,
                    name: customer.name || prev.name,
                    phone: customer.phone || prev.phone,
                    provinceId: parsedAddr.provinceId || prev.provinceId,
                    districtId: parsedAddr.districtId || prev.districtId,
                    wardId: parsedAddr.wardId || prev.wardId,
                    streetAddress: parsedAddr.streetAddress || prev.streetAddress
                }));
            } else {
                setCustomerInfo(prev => ({
                    ...prev,
                    name: customer.name || prev.name,
                    phone: customer.phone || prev.phone,
                    streetAddress: (typeof customer.address === 'string' ? customer.address : '') || prev.streetAddress
                }));
            }
        }
    }, [isCustomerAuthenticated, customer?.name, customer?.phone, customer?.address]);

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 1000000 ? 0 : 35000;
    const total = subtotal + shipping;

    const validateForm = () => {
        if (!customerInfo.name?.trim()) {
            setFormError('Vui lòng nhập họ và tên.');
            return false;
        }
        if (!customerInfo.phone?.trim()) {
            setFormError('Vui lòng nhập số điện thoại.');
            return false;
        }
        if (!customerInfo.provinceId) {
            setFormError('Vui lòng chọn Tỉnh/Thành phố.');
            return false;
        }
        if (!isNewFormat && !customerInfo.districtId) {
            setFormError('Vui lòng chọn Quận/Huyện.');
            return false;
        }
        if (!customerInfo.wardId) {
            setFormError('Vui lòng chọn Xã/Phường.');
            return false;
        }
        if (!customerInfo.streetAddress?.trim()) {
            setFormError('Vui lòng nhập số nhà, tên đường.');
            return false;
        }
        setFormError('');
        return true;
    };

    const handleReviewStep = (e) => {
        e.preventDefault();
        if (cart.length === 0) return;
        if (!validateForm()) return;
        setShowReview(true);
    };

    const handleConfirmOrder = async () => {
        if (cart.length === 0) return;
        const address = buildAddressString();
        try {
            setIsLoading(true);
            const result = await checkout({ ...customerInfo, address }, paymentMethod);
            // PayOS: chuyển sang trang thanh toán custom (QR trên site), không redirect sang PayOS
            if ((result.paymentMethod === 'payos' || result.checkoutUrl) && result.trackingId) {
                navigate(`/payment/${result.trackingId}`);
                return;
            }
            setOrderData(result);
            setIsOrderPlaced(true);
        } catch (err) {
            setFormError(err.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!');
            setShowReview(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddressTypeChange = (type) => {
        setFormError('');
        setAddressType(type);
        setCustomerInfo(prev => ({ ...prev, provinceId: '', districtId: '', wardId: '' }));
    };

    const handleProvinceChange = (id) => {
        setFormError('');
        setCustomerInfo(prev => ({ ...prev, provinceId: id, districtId: '', wardId: '' }));
    };

    const handleWardChange = (id) => {
        setFormError('');
        setCustomerInfo(prev => ({ ...prev, wardId: id }));
    };

    const handleDistrictChange = (id) => {
        setFormError('');
        setCustomerInfo(prev => ({ ...prev, districtId: id, wardId: '' }));
    };

    if (isOrderPlaced) {
        return (
            <>
                <SEO title="Đặt hàng thành công" noindex />
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
            </>
        );
    }

    return (
        <>
            <SEO title="Giỏ hàng" description="Giỏ hàng của bạn – Cửa hàng Vật tư nông nghiệp - Nông Nghiệp Xanh. Thanh toán COD, giao hàng tận nơi." url="/cart" />
            <div className="cart-page pt-20 pb-24 sm:pt-24 sm:pb-20 overflow-x-hidden">
            <div className="container max-w-full">
                <h1 className="text-3xl font-extrabold text-primary-dark mb-10">Giỏ hàng của bạn</h1>

                {payosCancel && (
                    <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>Bạn đã hủy thanh toán PayOS. Đơn hàng vẫn được lưu — tra cứu bằng SĐT để thanh toán lại hoặc liên hệ hỗ trợ.</span>
                    </div>
                )}

                {cart.length > 0 ? (
                    <div className="grid lg:grid-cols-3 gap-10">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-3 min-w-0">
                            <AnimatePresence>
                                {cart.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 md:gap-6 p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm min-w-0"
                                    >
                                        <div className="w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg sm:rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                                            <img src={getProductImageUrl(item.image, false, item.category)} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-800 text-xs sm:text-base line-clamp-2">{item.name}</h3>
                                            <p className="text-[10px] sm:text-sm text-text-muted capitalize mt-0.5 hidden sm:block">{item.category}</p>
                                            <p className="font-bold text-primary text-xs sm:text-base mt-0.5">{item.price.toLocaleString('vi-VN')} đ</p>
                                        </div>

                                        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 ml-auto sm:ml-0">
                                            <div className="flex items-center border border-gray-100 rounded-lg p-0.5 sm:p-1 bg-gray-50">
                                                <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="p-1 sm:p-1.5 hover:bg-white rounded-md transition-all">
                                                    <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </button>
                                                <span className="w-5 sm:w-8 text-center font-bold text-xs">{item.quantity}</span>
                                                <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="p-1 sm:p-1.5 hover:bg-white rounded-md transition-all">
                                                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </button>
                                            </div>
                                            <p className="font-bold text-xs sm:text-base md:text-lg text-primary whitespace-nowrap min-w-0">{(item.price * item.quantity).toLocaleString('vi-VN')} đ</p>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-400 hover:text-red-600 transition-colors p-1 sm:p-2 flex-shrink-0"
                                            >
                                                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Summary & Checkout */}
                        <div className="space-y-6">
                            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
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

                                {!showReview ? (
                                <form onSubmit={handleReviewStep} noValidate className="space-y-4">
                                    {formError && (
                                        <div role="alert" className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 text-sm flex items-center gap-3 shadow-sm">
                                            <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600" />
                                            <span className="flex-1 font-medium">{formError}</span>
                                            <button type="button" onClick={() => setFormError('')} className="text-amber-600 hover:text-amber-800 font-medium underline">Đóng</button>
                                        </div>
                                    )}
                                    <div>
                                        <label htmlFor="cart-name" className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên</label>
                                        <input
                                            id="cart-name"
                                            type="text"
                                            placeholder="Nhập họ và tên người nhận"
                                            className="w-full min-h-[48px] px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-base touch-manipulation"
                                            value={customerInfo.name}
                                            onChange={(e) => { setFormError(''); setCustomerInfo({ ...customerInfo, name: e.target.value }); }}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="cart-phone" className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
                                        <input
                                            id="cart-phone"
                                            type="tel"
                                            placeholder="Nhập số điện thoại liên hệ"
                                            className="w-full min-h-[48px] px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-base touch-manipulation"
                                            value={customerInfo.phone}
                                            onChange={(e) => { setFormError(''); setCustomerInfo({ ...customerInfo, phone: e.target.value }); }}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <MapPin className="w-4 h-4" /> Địa chỉ nhận hàng
                                        </p>
                                        <>
                                        <p className="text-xs text-gray-500 mb-1.5">Loại đơn vị hành chính</p>
                                        <div className="flex p-1 rounded-xl bg-gray-100 border border-gray-200">
                                            <button
                                                type="button"
                                                onClick={() => handleAddressTypeChange('old')}
                                                className={`flex-1 min-h-[48px] px-4 py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 touch-manipulation ${addressType === 'old' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                                            >
                                                ĐVHC Cũ
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleAddressTypeChange('new')}
                                                className={`flex-1 min-h-[48px] px-4 py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 touch-manipulation ${addressType === 'new' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                                            >
                                                ĐVHC Mới
                                            </button>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tỉnh / Thành phố</label>
                                            <SearchableSelect
                                                options={addresses}
                                                value={customerInfo.provinceId}
                                                onChange={handleProvinceChange}
                                                placeholder="Chọn Tỉnh / Thành phố"
                                                searchPlaceholder="Gõ để tìm (vd: ca → Cà Mau)"
                                                getOptionLabel={(o) => o.name}
                                                getOptionValue={(o) => o.id}
                                            />
                                        </div>

                                        {!isNewFormat && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Quận / Huyện</label>
                                                <SearchableSelect
                                                    options={districts}
                                                    value={customerInfo.districtId}
                                                    onChange={handleDistrictChange}
                                                    placeholder="Chọn Quận / Huyện"
                                                    searchPlaceholder="Gõ để tìm..."
                                                    disabled={!customerInfo.provinceId}
                                                    getOptionLabel={(o) => o.name}
                                                    getOptionValue={(o) => o.id}
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Xã / Phường</label>
                                            <SearchableSelect
                                                options={wards}
                                                value={customerInfo.wardId}
                                                onChange={handleWardChange}
                                                placeholder="Chọn Xã / Phường"
                                                searchPlaceholder="Gõ để tìm..."
                                                disabled={!customerInfo.provinceId}
                                                getOptionLabel={(o) => o.name}
                                                getOptionValue={(o) => o.id}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="cart-street" className="block text-sm font-medium text-gray-700 mb-1.5">Số nhà, tên đường</label>
                                            <input
                                                id="cart-street"
                                                type="text"
                                                placeholder="VD: Số 98, Thôn 17"
                                                className="w-full min-h-[48px] px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-base touch-manipulation"
                                                value={customerInfo.streetAddress}
                                                onChange={(e) => { setFormError(''); setCustomerInfo({ ...customerInfo, streetAddress: e.target.value }); }}
                                            />
                                        </div>
                                        </>
                                    </div>

                                    <Button type="submit" variant="primary" size="lg" className="w-full min-h-[48px] text-base touch-manipulation" disabled={isLoading}>
                                        Xem lại & Xác nhận <ArrowRight className="w-5 h-5" />
                                    </Button>
                                </form>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-4"
                                    >
                                        <h3 className="font-bold text-gray-800">Xác nhận thông tin đơn hàng</h3>
                                        <div className="space-y-2 text-sm max-h-32 overflow-y-auto">
                                            {cart.map((item) => (
                                                <div key={item.id} className="flex justify-between gap-2">
                                                    <span className="truncate">{item.name}</span>
                                                    <span className="flex-shrink-0">{item.quantity} × {item.price.toLocaleString('vi-VN')} đ</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="text-text-muted">Người nhận:</span> <strong>{customerInfo.name}</strong></p>
                                            <p><span className="text-text-muted">SĐT:</span> <strong>{customerInfo.phone}</strong></p>
                                            <p><span className="text-text-muted">Địa chỉ:</span> <strong>{buildAddressString()}</strong></p>
                                        </div>
                                        <div className="space-y-2 text-sm border-t border-gray-200 pt-3">
                                            <div className="flex justify-between"><span className="text-text-muted">Tạm tính</span><span>{subtotal.toLocaleString('vi-VN')} đ</span></div>
                                            <div className="flex justify-between"><span className="text-text-muted">Phí vận chuyển</span><span>{shipping === 0 ? 'Miễn phí' : `${shipping.toLocaleString('vi-VN')} đ`}</span></div>
                                            <div className="flex justify-between font-bold text-base pt-1"><span>Tổng cộng</span><span className="text-primary">{total.toLocaleString('vi-VN')} đ</span></div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-gray-700">Phương thức thanh toán</p>
                                            <div className="flex gap-3">
                                                <label className={`flex-1 flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300'}`}>
                                                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="sr-only" />
                                                    <CreditCard className="w-5 h-5 text-primary" />
                                                    <span className="text-sm font-medium">COD (Thanh toán khi nhận hàng)</span>
                                                </label>
                                                <label className={`flex-1 flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'payos' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300'}`}>
                                                    <input type="radio" name="payment" value="payos" checked={paymentMethod === 'payos'} onChange={() => setPaymentMethod('payos')} className="sr-only" />
                                                    <span className="text-lg font-bold text-primary">PayOS</span>
                                                    <span className="text-xs text-gray-500">VNPay, Momo, thẻ...</span>
                                                </label>
                                            </div>
                                        </div>
                                        {formError && (
                                            <div role="alert" className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                <span className="flex-1">{formError}</span>
                                            </div>
                                        )}
                                        <div className="flex gap-3">
                                            <Button variant="outline" className="flex-1 min-h-[44px] touch-manipulation" onClick={() => { setShowReview(false); setFormError(''); }}>
                                                Quay lại sửa
                                            </Button>
                                            <Button variant="primary" className="flex-1 min-h-[44px] touch-manipulation" onClick={handleConfirmOrder} disabled={isLoading}>
                                                {isLoading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'} <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-text-muted uppercase font-bold text-center">
                                    <CreditCard className="w-4 h-4" /> COD hoặc PayOS (VNPay, Momo, thẻ)
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
        </>
    );
};

export default Cart;
