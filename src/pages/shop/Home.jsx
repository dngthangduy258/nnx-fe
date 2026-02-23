import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Percent, Star, ShieldCheck, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ProductCard from '../../components/shop/ProductCard';
import { categories } from '../../data/categories';

const Home = () => {
    const { products } = useApp();
    const [visibleCount, setVisibleCount] = useState(12);

    const loadMore = () => setVisibleCount(prev => prev + 12);

    // Mock banners for e-commerce feel
    const mainBanner = "https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?auto=format&fit=crop&q=80&w=1200";
    const sideBanners = [
        "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=400"
    ];

    return (
        <div className="bg-[#f5f5f5] w-full pb-10">
            {/* Top Banners Section */}
            <section className="container mx-auto px-2 md:px-0 pt-6 mb-6">
                <div className="flex flex-col lg:flex-row gap-2">
                    {/* Main Slider Area */}
                    <div className="lg:w-[66.66%] w-full rounded-sm overflow-hidden relative shadow-sm h-[200px] md:h-[350px]">
                        <img src={mainBanner} alt="Khuyến mãi" className="w-full h-full object-cover" />
                        {/* Fake slider dots */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-white"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-white/70"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-white/70"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-white/70"></span>
                        </div>
                    </div>
                    {/* Side Banners Area */}
                    <div className="lg:w-[33.33%] w-full flex flex-row lg:flex-col gap-2 h-auto lg:h-[350px]">
                        <div className="flex-1 rounded-sm overflow-hidden shadow-sm">
                            <img src={sideBanners[0]} alt="Phân bón" className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" />
                        </div>
                        <div className="flex-1 rounded-sm overflow-hidden shadow-sm">
                            <img src={sideBanners[1]} alt="Hạt giống" className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" />
                        </div>
                    </div>
                </div>

                {/* Service Icons Row */}
                <div className="bg-white px-4 py-4 mt-6 rounded-sm shadow-sm flex items-center justify-between text-xs md:text-sm text-gray-700 overflow-x-auto hide-scrollbar gap-4">
                    <div className="flex items-center gap-1.5 flex-shrink-0 cursor-pointer hover:text-primary transition-colors">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                        <span className="whitespace-nowrap">Đảm bảo 100% Chính hãng</span>
                    </div>
                    <div className="w-px h-6 bg-gray-200 hidden md:block"></div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 cursor-pointer hover:text-primary transition-colors">
                        <div className="w-5 h-5 rounded-full border border-primary text-primary flex items-center justify-center font-bold text-[10px]">&</div>
                        <span className="whitespace-nowrap">Miễn phí trả hàng</span>
                    </div>
                    <div className="w-px h-6 bg-gray-200 hidden md:block"></div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 cursor-pointer hover:text-primary transition-colors">
                        <div className="w-5 h-5 bg-primary text-white flex items-center justify-center rounded-sm font-bold text-[10px]">#1</div>
                        <span className="whitespace-nowrap">Miễn phí vận chuyển</span>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="container mx-auto px-2 md:px-0 mb-6">
                <div className="bg-white rounded-sm shadow-sm">
                    <div className="px-4 py-3 border-b border-gray-100 uppercase text-gray-500 font-medium text-sm md:text-base">Danh Mục</div>

                    {/* Grid List of Categories */}
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                        {categories.map((cat, idx) => (
                            <Link
                                key={cat.id}
                                to={`/products?category=${cat.id}`}
                                className="border-r border-b border-gray-100 flex flex-col items-center justify-center p-3 md:p-4 hover:shadow-[0_2px_10px_rgba(0,0,0,0.06)] hover:z-10 transition-shadow bg-white cursor-pointer group"
                            >
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-50 flex items-center justify-center mb-2 overflow-hidden group-hover:scale-105 transition-transform">
                                    {/* Mocking unique images for categories based on index */}
                                    <img src={`https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=150&q=80&sig=${idx}`} className="w-full h-full object-cover opacity-80 mix-blend-multiply" alt={cat.name} />
                                </div>
                                <span className="text-xs md:text-sm text-center text-gray-700 font-medium break-words px-1 line-clamp-2 leading-tight h-[34px] group-hover:text-primary transition-colors">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Top Selling Products / Flash Deal Style */}
            <section className="container mx-auto px-2 md:px-0 mb-6">
                <div className="bg-white rounded-sm shadow-sm p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xl md:text-2xl font-black text-secondary uppercase animate-pulse">Hot Deal Hôm Nay</span>
                        </div>
                        <Link to="/products?sort=popular" className="text-sm font-medium text-primary hover:underline flex items-center">
                            Xem thêm <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
                        {products.slice(0, 6).map(p => (
                            <Link key={p.id} to={`/product/${p.id}`} className="min-w-[150px] w-[150px] md:min-w-[200px] md:w-[200px] flex-shrink-0 group">
                                <div className="bg-gray-50 aspect-square overflow-hidden mb-2 relative">
                                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={p.name} />
                                    {/* Fake huge discount badge */}
                                    <div className="absolute top-0 right-0 bg-secondary/10 px-2 py-3 rounded-bl-sm">
                                        <div className="flex flex-col items-center leading-none text-secondary">
                                            <span className="text-[10px] font-bold">GIẢM</span>
                                            <span className="text-sm font-black">20%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center font-bold text-secondary text-sm md:text-base mb-1">{p.price.toLocaleString('vi-VN')} đ</div>
                                {/* Progress bar mock for stock */}
                                <div className="h-4 bg-secondary/20 rounded-full overflow-hidden relative">
                                    <div className="absolute top-0 left-0 bottom-0 bg-secondary w-2/3"></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-sm">Đã bán 120</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Product Feed - "Gợi ý cho bạn" */}
            <section className="container mx-auto px-2 md:px-0">
                <div className="bg-white px-4 py-3 border-b-4 border-primary inline-block rounded-t-sm shadow-sm sticky top-[60px] md:top-[120px] z-40 w-full mb-2 uppercase text-primary font-bold">
                    Gợi ý Hôm Nay
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-2">
                    {products.slice(0, visibleCount).map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                    {products.length === 0 && (
                        <div className="col-span-full py-20 text-center text-gray-500 bg-white rounded-sm">
                            Đang tải sản phẩm...
                        </div>
                    )}
                </div>

                {/* Load More Button */}
                {visibleCount < products.length && (
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={loadMore}
                            className="bg-white border border-gray-300 text-gray-600 px-32 py-2.5 rounded hover:bg-gray-50 transition-colors font-medium shadow-sm"
                        >
                            Xem thêm
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
