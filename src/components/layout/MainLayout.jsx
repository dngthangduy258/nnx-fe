import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import Header from './Header';
import AddToCartToast from '../common/AddToCartToast';
import { storeInfo } from '../../data/store-info';
import { useApp } from '../../context/AppContext';

const MainLayout = ({ children }) => {
    const { cartAddFeedback } = useApp();

    return (
        <div className="flex flex-col min-h-screen bg-bg-main">
            <Header />
            <AddToCartToast count={cartAddFeedback} />
            <main className="flex-1">
                {children}
            </main>
            <footer className="bg-primary-dark text-white/90 py-12 border-t border-white/10 mt-auto">
                <div className="container px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {/* Liên kết */}
                        <div>
                            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Liên kết</h3>
                            <nav className="flex flex-col gap-2">
                                <Link to="/" className="text-white/80 hover:text-white text-sm">Trang chủ</Link>
                                <Link to="/products" className="text-white/80 hover:text-white text-sm">Sản phẩm</Link>
                                <Link to="/news" className="text-white/80 hover:text-white text-sm">Tin tức</Link>
                                <Link to="/contact" className="text-white/80 hover:text-white text-sm">Liên hệ</Link>
                                <Link to="/lookup-order" className="text-white/80 hover:text-white text-sm">Tra cứu đơn hàng</Link>
                            </nav>
                        </div>
                        {/* Liên hệ */}
                        <div>
                            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Liên hệ</h3>
                            <div className="flex flex-col gap-3 text-sm text-white/80">
                                <a href={`tel:${storeInfo.phone.replace(/\s/g, '')}`} className="flex items-start gap-2 hover:text-white">
                                    <Phone className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    <span>{storeInfo.phone}</span>
                                </a>
                                <a href={`mailto:${storeInfo.email}`} className="flex items-start gap-2 hover:text-white">
                                    <Mail className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    <span>{storeInfo.email}</span>
                                </a>
                                <Link to="/contact" className="flex items-start gap-2 hover:text-white">
                                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    <span className="line-clamp-2">{storeInfo.address}</span>
                                </Link>
                            </div>
                        </div>
                        {/* Thông tin */}
                        <div>
                            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Về chúng tôi</h3>
                            <p className="text-sm text-white/80 leading-relaxed">
                                {storeInfo.name} – Cung cấp phân bón, thuốc bảo vệ thực vật, hạt giống chất lượng.
                            </p>
                        </div>
                    </div>
                    <div className="mt-10 pt-6 border-t border-white/10 text-center">
                        <p className="text-xs text-white/60 font-medium">© 2026 Cửa hàng Vật tư nông nghiệp - Nông Nghiệp Xanh</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
