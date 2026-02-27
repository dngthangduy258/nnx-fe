import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Search, Bell, HelpCircle, User, Menu, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import SearchWithSuggestions from '../shop/SearchWithSuggestions';

const Header = () => {
    const { cart, cartAddFeedback } = useApp();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="bg-primary text-white sticky top-0 z-50 shadow">
            {/* Top Bar (Hidden on Mobile) */}
            <div className="hidden md:block bg-primary-dark">
                <div className="container mx-auto px-4 flex justify-between items-center text-xs py-1.5 h-8">
                    <div className="flex gap-4">
                        <Link to="/news" className="hover:text-gray-200">Tin tức / Kênh Chuyên Gia</Link>
                        <span className="text-white/50">|</span>
                        <Link to="/contact" className="hover:text-gray-200">Liên hệ</Link>
                        {/* <span className="text-white/50">|</span>
                        <Link to="/products" className="hover:text-gray-200">Cửa hàng Vật tư nông nghiệp</Link>
                        <span className="text-white/50">|</span>
                        <span>Kết nối</span> */}
                    </div>
                    <div className="flex gap-4 items-center">
                        <Link to="/lookup-order" className="flex items-center gap-1 hover:text-gray-200">Tra cứu đơn hàng</Link>
                        {/* <Link to="/products" className="flex items-center gap-1 hover:text-gray-200"><Bell className="w-4 h-4" /> Thông báo</Link>
                        <Link to="/lookup-order" className="flex items-center gap-1 hover:text-gray-200"><HelpCircle className="w-4 h-4" /> Hỗ trợ</Link> */}
                        <Link to="/login" className="flex items-center gap-1 hover:text-gray-200"><User className="w-4 h-4" /> Đăng nhập</Link>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center gap-4 md:gap-6 min-h-[44px]">
                    {/* Logo */}
                    <Link to="/" className="flex items-center flex-shrink-0">
                        <span className="text-xl md:text-2xl font-extrabold tracking-tight leading-none">Nông Nghiệp<span className="font-normal"> Xanh</span></span>
                    </Link>

                    {/* Search Bar with Suggestions */}
                    <div className="flex-1 min-w-0 max-w-2xl hidden md:flex items-center">
                        <SearchWithSuggestions
                            placeholder="Tìm kiếm thuốc trừ sâu, phân bón..."
                            className="w-full"
                            inputClassName="w-full py-2 px-4 rounded-sm bg-white text-gray-800 outline-none placeholder:text-gray-500 shadow-sm text-sm"
                        />
                    </div>

                    {/* Cart & Mobile Nav Toggle */}
                    <div className="flex items-center gap-1 sm:gap-4 ml-auto md:ml-0 flex-shrink-0">
                        {/* Mobile Search Button */}
                        <button className="md:hidden p-2 text-white" onClick={() => setIsMobileMenuOpen(true)}>
                            <Search className="w-6 h-6" />
                        </button>

                        {/* Cart - bounce khi thêm sản phẩm */}
                        <Link to="/cart" className="relative p-2 group flex items-center">
                            <motion.span
                                animate={cartAddFeedback ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] } : {}}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                className="inline-flex"
                            >
                                <ShoppingCart className="w-7 h-7 md:w-8 md:h-8" />
                            </motion.span>
                            {cartCount > 0 && (
                                <motion.span
                                    key={cartCount}
                                    initial={false}
                                    animate={cartAddFeedback ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute -top-1 -right-2 md:-top-1 md:-right-1 bg-white text-primary border-2 border-primary text-[11px] font-bold min-w-[24px] h-[24px] rounded-full flex items-center justify-center leading-none"
                                >
                                    {cartCount > 99 ? '99+' : cartCount}
                                </motion.span>
                            )}
                        </Link>

                        {/* Mobile Menu Icon */}
                        <button className="md:hidden p-1 text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Category Links (Desktop) */}
                <div className="hidden md:flex items-center gap-4 text-xs mt-2 text-white/90">
                    <Link to="/products?category=fertilizers&search=NPK" className="hover:text-white whitespace-nowrap">Phân bón NPK</Link>
                    <Link to="/products?category=plant-protection" className="hover:text-white whitespace-nowrap">Thuốc BVTV</Link>
                    <Link to="/products?category=bio" className="hover:text-white whitespace-nowrap">Chế phẩm sinh học</Link>
                    <Link to="/products?category=seeds" className="hover:text-white whitespace-nowrap">Hạt giống lúa</Link>
                </div>
            </div>

            {/* Mobile Dropdown & Search */}
            {isMobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/20 z-40 md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-hidden="true"
                    />
                    <div
                        className="md:hidden bg-white text-gray-800 absolute top-full left-0 w-full shadow-lg border-t border-gray-100 flex flex-col p-4 animate-fadeIn z-50"
                        onClick={(e) => e.stopPropagation()}
                    >
                    {/* Mobile Search Input with Suggestions */}
                    <div className="mb-4">
                        <SearchWithSuggestions
                            placeholder="Tìm kiếm sản phẩm..."
                            onSearchComplete={() => setIsMobileMenuOpen(false)}
                            inputClassName="w-full py-2.5 pl-4 pr-12 rounded border border-primary text-gray-800 outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div className="flex flex-col">
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-gray-100 font-medium">Trang chủ</Link>
                        <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-gray-100 font-medium">Tất cả sản phẩm</Link>
                        <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-gray-100 font-medium">Liên hệ</Link>
                        <Link to="/lookup-order" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-gray-100 font-medium">Tra cứu đơn hàng</Link>
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="py-3 text-primary font-bold">Đăng nhập Quản trị</Link>
                    </div>
                </div>
                </>
            )}
        </header>
    );
};

export default Header;
