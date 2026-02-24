import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Bell, HelpCircle, User, Menu, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Header = () => {
    const { cart } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <header className="bg-primary text-white sticky top-0 z-50 shadow">
            {/* Top Bar (Hidden on Mobile) */}
            <div className="hidden md:block bg-primary-dark">
                <div className="container mx-auto px-4 flex justify-between items-center text-xs py-1.5 h-8">
                    <div className="flex gap-4">
                        <Link to="/products" className="hover:text-gray-200">Kênh Chuyên Gia</Link>
                        <span className="text-white/50">|</span>
                        <Link to="/products" className="hover:text-gray-200">Tải ứng dụng NNX</Link>
                        <span className="text-white/50">|</span>
                        <span>Kết nối</span>
                    </div>
                    <div className="flex gap-4 items-center">
                        <Link to="/lookup-order" className="flex items-center gap-1 hover:text-gray-200">Tra cứu đơn hàng</Link>
                        <Link to="/products" className="flex items-center gap-1 hover:text-gray-200"><Bell className="w-4 h-4" /> Thông báo</Link>
                        <Link to="/lookup-order" className="flex items-center gap-1 hover:text-gray-200"><HelpCircle className="w-4 h-4" /> Hỗ trợ</Link>
                        <Link to="/login" className="flex items-center gap-1 hover:text-gray-200"><User className="w-4 h-4" /> Đăng nhập</Link>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center gap-2 md:gap-8">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 flex-shrink-0 mr-2">
                        <div className="text-xl md:text-3xl font-extrabold tracking-tight">NNX<span className="text-white font-normal">AGRO</span></div>
                    </Link>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex-1 flex max-w-3xl relative hidden md:flex">
                        <input
                            type="text"
                            placeholder="Tìm kiếm thuốc trừ sâu, phân bón..."
                            className="w-full py-2.5 px-4 rounded-sm bg-white text-gray-800 outline-none placeholder:text-gray-500 shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="absolute right-1 top-1 bottom-1 bg-primary text-white px-6 rounded-sm hover:bg-primary-dark transition-colors flex items-center justify-center">
                            <Search className="w-5 h-5" />
                        </button>
                    </form>

                    {/* Cart & Mobile Nav Toggle */}
                    <div className="flex items-center gap-1 sm:gap-6 ml-auto md:ml-0 flex-shrink-0">
                        {/* Mobile Search Button */}
                        <button className="md:hidden p-2 text-white" onClick={() => setIsMobileMenuOpen(true)}>
                            <Search className="w-6 h-6" />
                        </button>

                        {/* Cart */}
                        <Link to="/cart" className="relative p-2 group flex items-center">
                            <ShoppingCart className="w-7 h-7 md:w-8 md:h-8" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-2 md:-top-1 md:-right-1 bg-white text-primary border-2 border-primary text-[11px] font-bold min-w-[24px] h-[24px] rounded-full flex items-center justify-center leading-none">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Icon */}
                        <button className="md:hidden p-1 text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Popular Search Terms (Desktop) */}
                <div className="hidden md:flex gap-3 text-xs mt-2 text-white/90">
                    <Link to="/products?category=fertilizers&search=NPK" className="hover:text-white">Phân bón NPK</Link>
                    <Link to="/products?category=plant-protection" className="hover:text-white">Thuốc bảo vệ thực vật</Link>
                    <Link to="/products?category=bio" className="hover:text-white">Chế phẩm sinh học</Link>
                    <Link to="/products?category=seeds" className="hover:text-white">Hạt giống lúa</Link>
                </div>
            </div>

            {/* Mobile Dropdown & Search */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white text-gray-800 absolute top-full left-0 w-full shadow-lg border-t border-gray-100 flex flex-col p-4 animate-fadeIn z-50">
                    {/* Mobile Search Input */}
                    <form onSubmit={(e) => { handleSearch(e); setIsMobileMenuOpen(false); }} className="flex mb-4 relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            className="w-full py-2.5 pl-4 pr-12 rounded border border-primary text-gray-800 outline-none focus:ring-1 focus:ring-primary"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="absolute right-0 top-0 bottom-0 bg-primary text-white w-12 rounded-r flex items-center justify-center">
                            <Search className="w-5 h-5" />
                        </button>
                    </form>

                    <div className="flex flex-col">
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-gray-100 font-medium">Trang chủ</Link>
                        <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-gray-100 font-medium">Tất cả sản phẩm</Link>
                        <Link to="/lookup-order" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-gray-100 font-medium">Tra cứu đơn hàng</Link>
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="py-3 text-primary font-bold">Đăng nhập Quản trị</Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
