import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import SEO from '../../components/common/SEO';
import ProductCard from '../../components/shop/ProductCard';
import { ChevronRight, Filter, Search, Star, Menu, X, Package, TrendingUp } from 'lucide-react';
import { categories as staticCategories } from '../../data/categories';
import { motion, AnimatePresence } from 'framer-motion';

const ProductList = () => {
    const { products, categories: apiCategories, loading, error, fetchData } = useApp();
    const location = useLocation();
    const navigate = useNavigate();

    // Parse query params
    const queryParams = new URLSearchParams(location.search);
    const initialCategory = queryParams.get('category') || 'all';
    const initialSearch = queryParams.get('search') || '';

    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [sortBy, setSortBy] = useState('popular');

    // Filter states
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [pricePreset, setPricePreset] = useState(''); // 'under100k' | '100k-500k' | '500k-1m' | '1m-2m' | 'over2m'
    const [inStockOnly, setInStockOnly] = useState(false);
    const [minRating, setMinRating] = useState(0); // 0 = all, 3 = 3+, 4 = 4+
    const [showMobileFilter, setShowMobileFilter] = useState(false);

    const PRICE_PRESETS = [
        { id: 'under100k', label: 'Dưới 100.000₫', min: 0, max: 100000 },
        { id: '100k-500k', label: '100.000₫ - 500.000₫', min: 100000, max: 500000 },
        { id: '500k-1m', label: '500.000₫ - 1.000.000₫', min: 500000, max: 1000000 },
        { id: '1m-2m', label: '1.000.000₫ - 2.000.000₫', min: 1000000, max: 2000000 },
        { id: 'over2m', label: 'Trên 2.000.000₫', min: 2000000, max: null },
    ];
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;
    const categories = apiCategories.length > 0 ? apiCategories : staticCategories;

    // Prevent scrolling when mobile filter is open
    useEffect(() => {
        if (showMobileFilter) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showMobileFilter]);

    useEffect(() => {
        const cat = queryParams.get('category') || 'all';
        const search = queryParams.get('search') || '';

        setSelectedCategory(cat);
        setSearchTerm(search);

        // Fetch new data from Backend based on params
        fetchData({ category: cat, search: search });
    }, [location.search]);

    const handleCategoryClick = (id) => {
        setSelectedCategory(id);
        setCurrentPage(1); // Reset to first page
        setShowMobileFilter(false);
        navigate(`/products?category=${id}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`);
    };

    const handlePriceFilter = (e) => {
        e?.preventDefault?.();
        setCurrentPage(1);
        setShowMobileFilter(false);
    };

    const handlePricePreset = (presetId) => {
        const preset = PRICE_PRESETS.find(p => p.id === presetId);
        if (!preset) {
            setPricePreset('');
            setMinPrice('');
            setMaxPrice('');
        } else {
            setPricePreset(presetId);
            setMinPrice(preset.min > 0 ? String(preset.min) : '');
            setMaxPrice(preset.max ? String(preset.max) : '');
        }
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setMinPrice('');
        setMaxPrice('');
        setPricePreset('');
        setInStockOnly(false);
        setMinRating(0);
        setSelectedCategory('all');
        setCurrentPage(1);
        setShowMobileFilter(false);
        navigate('/products');
    };

    const getEffectivePriceRange = () => {
        let min = minPrice ? parseInt(minPrice, 10) : null;
        let max = maxPrice ? parseInt(maxPrice, 10) : null;
        if (pricePreset) {
            const preset = PRICE_PRESETS.find(p => p.id === pricePreset);
            if (preset) {
                min = preset.min;
                max = preset.max;
            }
        }
        return { min, max };
    };

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (selectedCategory !== 'all') {
            result = result.filter(p => p.category === selectedCategory);
        }

        if (searchTerm) {
            result = result.filter(p =>
                (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.description || '').toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        const { min, max } = getEffectivePriceRange();
        if (min != null && !isNaN(min)) result = result.filter(p => p.price >= min);
        if (max != null && !isNaN(max)) result = result.filter(p => p.price <= max);

        if (inStockOnly) result = result.filter(p => (p.stock ?? 0) > 0);
        if (minRating > 0) result = result.filter(p => (p.rating ?? 0) >= minRating);

        // Sort logic
        if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
        if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
        if (sortBy === 'rating') result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        if (sortBy === 'popular') result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

        return result;
    }, [products, selectedCategory, searchTerm, sortBy, minPrice, maxPrice, pricePreset, inStockOnly, minRating]);

    // Pagination logic
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * productsPerPage;
        return filteredProducts.slice(startIndex, startIndex + productsPerPage);
    }, [filteredProducts, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="product-list-page pt-10 pb-20 text-center text-gray-500 bg-[#f5f5f5] min-h-screen">
                Đang tải sản phẩm...
            </div>
        );
    }

    if (error) {
        return (
            <div className="product-list-page pt-10 pb-20 text-center text-red-500 bg-[#f5f5f5] min-h-screen">
                Lỗi tải dữ liệu: {error}
            </div>
        );
    }

    return (
        <>
            <SEO
                title="Sản phẩm"
                description="Mua phân bón, thuốc bảo vệ thực vật, chế phẩm sinh học, hạt giống chất lượng tại Cửa hàng Vật tư nông nghiệp - Nông Nghiệp Xanh. Giao hàng tận nơi."
                url="/products"
            />
        <div className="bg-[#f5f5f5] min-h-screen pb-20 pt-4 relative">
            {/* Mobile Filter Drawer */}
            <AnimatePresence>
                {showMobileFilter && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMobileFilter(false)}
                            className="fixed inset-0 bg-black/50 z-[100] md:hidden"
                        />
                        {/* Drawer content */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[320px] bg-white z-[101] md:hidden overflow-y-auto p-5 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-3">
                                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                                    <Filter className="w-5 h-5 text-primary" /> BỘ LỌC
                                </h2>
                                <button
                                    onClick={() => setShowMobileFilter(false)}
                                    className="p-1.5 bg-gray-100 rounded-full text-gray-500 hover:text-gray-800"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-8">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm uppercase text-primary">
                                    <Menu className="w-4 h-4" /> Danh Mục
                                </h3>
                                <ul className="flex flex-col gap-3">
                                    <li
                                        className={`py-2 px-3 rounded-md text-sm cursor-pointer transition-colors ${selectedCategory === 'all' ? 'bg-primary/10 text-primary font-bold' : 'text-gray-600 bg-gray-50'}`}
                                        onClick={() => handleCategoryClick('all')}
                                    >
                                        Tất cả sản phẩm
                                    </li>
                                    {categories.map(cat => (
                                        <li
                                            key={cat.id}
                                            className={`py-2 px-3 rounded-md text-sm cursor-pointer transition-colors ${selectedCategory === cat.id ? 'bg-primary/10 text-primary font-bold' : 'text-gray-600 bg-gray-50'}`}
                                            onClick={() => handleCategoryClick(cat.id)}
                                        >
                                            {cat.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Khoảng giá */}
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm uppercase text-primary">
                                    <TrendingUp className="w-4 h-4" /> Khoảng giá
                                </h3>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {PRICE_PRESETS.map(p => (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => handlePricePreset(pricePreset === p.id ? '' : p.id)}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${pricePreset === p.id ? 'bg-primary text-white border-primary' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-primary hover:text-primary'}`}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                                <form onSubmit={handlePriceFilter} className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <input type="number" placeholder="₫ Từ" className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-primary" value={minPrice} onChange={e => { setPricePreset(''); setMinPrice(e.target.value); }} />
                                        <span className="text-gray-400">—</span>
                                        <input type="number" placeholder="₫ Đến" className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-primary" value={maxPrice} onChange={e => { setPricePreset(''); setMaxPrice(e.target.value); }} />
                                    </div>
                                </form>
                            </div>

                            {/* Tình trạng kho */}
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm uppercase text-primary">
                                    <Package className="w-4 h-4" /> Tình trạng
                                </h3>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={inStockOnly} onChange={e => { setInStockOnly(e.target.checked); setCurrentPage(1); }} className="rounded border-gray-300 text-primary focus:ring-primary" />
                                    <span className="text-sm text-gray-700">Chỉ hiển thị còn hàng</span>
                                </label>
                            </div>

                            {/* Đánh giá */}
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm uppercase text-primary">
                                    <Star className="w-4 h-4" /> Đánh giá
                                </h3>
                                <div className="flex flex-col gap-1.5">
                                    {[4, 3].map(r => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => { setMinRating(minRating === r ? 0 : r); setCurrentPage(1); }}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${minRating === r ? 'bg-primary/10 text-primary font-medium' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                                        >
                                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                            <span>Từ {r} sao trở lên</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <button type="button" onClick={handlePriceFilter} className="w-full bg-primary text-white py-3 font-bold rounded-lg shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95">
                                    ÁP DỤNG BỘ LỌC
                                </button>
                                <button type="button" onClick={handleClearFilters} className="w-full border border-gray-200 text-gray-500 py-3 text-sm font-medium rounded-lg">
                                    Xóa tất cả
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            <div className="container mx-auto px-2 md:px-0 flex flex-col md:flex-row gap-4">

                {/* Left Sidebar Filter (Hidden on Small Mobile, visible on Md+) */}
                <div className="hidden md:flex flex-col w-60 flex-shrink-0">
                    <div className="bg-white rounded-sm shadow-sm p-4 sticky top-[128px]">
                        <h2 className="uppercase font-bold text-gray-800 border-b border-gray-100 pb-2 flex items-center gap-2 mb-3">
                            <Menu className="w-5 h-5" /> Danh Mục Sản Phẩm
                        </h2>
                        <ul className="text-sm font-medium text-gray-700 flex flex-col gap-2 mb-6">
                            <li
                                className={`cursor-pointer flex items-center gap-1 ${selectedCategory === 'all' ? 'text-primary' : 'hover:text-primary'} transition-colors`}
                                onClick={() => handleCategoryClick('all')}
                            >
                                {selectedCategory === 'all' && <ChevronRight className="w-3 h-3 text-primary" />}
                                Tất cả sản phẩm
                            </li>
                            {categories.map(cat => (
                                <li
                                    key={cat.id}
                                    className={`cursor-pointer flex items-center gap-1 ${selectedCategory === cat.id ? 'text-primary' : 'hover:text-primary'} transition-colors`}
                                    onClick={() => handleCategoryClick(cat.id)}
                                >
                                    {selectedCategory === cat.id && <ChevronRight className="w-3 h-3 text-primary" />}
                                    {cat.name}
                                </li>
                            ))}
                        </ul>

                        <h2 className="uppercase font-bold text-gray-800 border-b border-gray-100 pb-2 flex items-center gap-2 mb-3">
                            <Filter className="w-5 h-5" /> Bộ lọc tìm kiếm
                        </h2>

                        {/* Khoảng giá */}
                        <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                                <TrendingUp className="w-3.5 h-3.5 text-primary" /> Khoảng giá
                            </h3>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                                {PRICE_PRESETS.map(p => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => handlePricePreset(pricePreset === p.id ? '' : p.id)}
                                        className={`px-2 py-1 text-[10px] font-medium rounded border transition-colors ${pricePreset === p.id ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'}`}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                            <form className="flex items-center gap-1 mb-2" onSubmit={handlePriceFilter}>
                                <input type="number" placeholder="₫ Từ" className="w-[70px] p-1 text-[10px] border border-gray-200 rounded focus:border-primary outline-none" value={minPrice} onChange={e => { setPricePreset(''); setMinPrice(e.target.value); }} />
                                <span className="text-gray-400 text-xs">-</span>
                                <input type="number" placeholder="₫ Đến" className="w-[70px] p-1 text-[10px] border border-gray-200 rounded focus:border-primary outline-none" value={maxPrice} onChange={e => { setPricePreset(''); setMaxPrice(e.target.value); }} />
                            </form>
                        </div>

                        {/* Tình trạng kho */}
                        <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                                <Package className="w-3.5 h-3.5 text-primary" /> Tình trạng
                            </h3>
                            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600">
                                <input type="checkbox" checked={inStockOnly} onChange={e => { setInStockOnly(e.target.checked); setCurrentPage(1); }} className="rounded border-gray-300 text-primary focus:ring-primary" />
                                Chỉ hiển thị còn hàng
                            </label>
                        </div>

                        {/* Đánh giá */}
                        <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                                <Star className="w-3.5 h-3.5 text-primary" /> Đánh giá
                            </h3>
                            <div className="flex flex-col gap-1">
                                {[4, 3].map(r => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => { setMinRating(minRating === r ? 0 : r); setCurrentPage(1); }}
                                        className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-xs text-left transition-colors ${minRating === r ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                        Từ {r} sao trở lên
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handlePriceFilter}
                            className="w-full bg-primary text-white text-xs py-2 uppercase font-medium rounded hover:bg-primary-dark transition-colors"
                        >
                            Áp dụng
                        </button>
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="w-full mt-2 border border-gray-200 text-gray-500 text-xs py-1.5 rounded hover:bg-gray-50"
                        >
                            Xóa tất cả
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                    {/* Sort Bar (Desktop) */}
                    <div className="bg-[#ededed] p-3 rounded-sm items-center gap-4 hidden md:flex mb-2">
                        <span className="text-sm text-gray-600">Sắp xếp theo</span>
                        <button
                            className={`px-4 py-1.5 text-sm font-medium rounded-sm transition-colors ${sortBy === 'popular' ? 'bg-primary text-white' : 'bg-white text-gray-800 hover:bg-gray-50'}`}
                            onClick={() => setSortBy('popular')}
                        >
                            Phổ Biến
                        </button>
                        <button
                            className={`px-4 py-1.5 text-sm font-medium rounded-sm transition-colors cursor-not-allowed ${sortBy === 'newest' ? 'bg-primary text-white' : 'bg-white text-gray-800 hover:bg-gray-50'}`}
                            title="Tính năng đang phát triển"
                        >
                            Mới Nhất
                        </button>
                        <button
                            className={`px-4 py-1.5 text-sm font-medium rounded-sm transition-colors cursor-not-allowed ${sortBy === 'selling' ? 'bg-primary text-white' : 'bg-white text-gray-800 hover:bg-gray-50'}`}
                            title="Tính năng đang phát triển"
                        >
                            Bán Chạy
                        </button>

                        <select
                            className="bg-white border border-gray-200 text-sm p-1.5 outline-none focus:border-primary rounded-sm shadow-sm"
                            value={sortBy.includes('price') ? sortBy : 'price'}
                            onChange={e => setSortBy(e.target.value)}
                        >
                            <option value="price" disabled hidden>Giá</option>
                            <option value="price-low">Giá: Thấp đến Cao</option>
                            <option value="price-high">Giá: Cao đến Thấp</option>
                        </select>
                    </div>

                    {/* Mobile Sort/Filter Bar (Sticky) */}
                    <div className="md:hidden flex sticky top-[56px] z-40 bg-white shadow-sm border-b border-gray-100 mb-2">
                        <select
                            className="flex-1 text-center py-3 border-r border-gray-100 bg-transparent text-sm focus:outline-none"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="popular">Phổ biến</option>
                            <option value="newest">Mới nhất</option>
                            <option value="price-low">Giá: Tăng dần</option>
                            <option value="price-high">Giá: Giảm dần</option>
                        </select>
                        <button
                            onClick={() => setShowMobileFilter(true)}
                            className="flex-1 flex justify-center items-center py-3 gap-1 text-sm text-gray-700 active:bg-gray-50 transition-colors"
                        >
                            Bộ lọc <Filter className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Active Filters Display */}
                    <div className="flex flex-wrap items-center gap-2 mb-3 text-sm">
                        {(searchTerm || selectedCategory !== 'all' || minPrice || maxPrice || inStockOnly || minRating > 0) && (
                            <div className="flex flex-wrap items-center gap-2">
                                <Search className="w-4 h-4 text-primary flex-shrink-0" />
                                <span className="text-gray-600">Kết quả:</span>
                                {searchTerm && <span className="font-bold text-primary">"{searchTerm}"</span>}
                                {selectedCategory !== 'all' && (
                                    <span className="font-bold text-primary">• {categories.find(c => c.id === selectedCategory)?.name}</span>
                                )}
                                {(minPrice || maxPrice) && (
                                    <span className="text-gray-600">• Giá {minPrice && !isNaN(parseInt(minPrice, 10)) ? `≥ ${parseInt(minPrice, 10).toLocaleString('vi-VN')}₫` : ''} {minPrice && maxPrice ? '–' : ''} {maxPrice && !isNaN(parseInt(maxPrice, 10)) ? `≤ ${parseInt(maxPrice, 10).toLocaleString('vi-VN')}₫` : ''}</span>
                                )}
                                {inStockOnly && <span className="text-green-600 font-medium">• Còn hàng</span>}
                                {minRating > 0 && <span className="text-amber-600 font-medium">• Từ {minRating} sao</span>}
                                <span className="text-gray-500">({filteredProducts.length} sản phẩm)</span>
                                <button onClick={handleClearFilters} className="text-primary text-xs font-medium hover:underline ml-1">
                                    Xóa bộ lọc
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Grid List */}
                    {paginatedProducts.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                            {paginatedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white py-24 flex flex-col items-center justify-center rounded-sm relative z-10">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                <Search className="w-12 h-12" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-700 mb-2">Không tìm thấy sản phẩm</h3>
                            <button
                                type="button"
                                onClick={handleClearFilters}
                                className="text-primary font-medium border-2 border-primary px-6 py-3 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer"
                            >
                                Xóa điều kiện lọc
                            </button>
                        </div>
                    )}

                    {/* Actual Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-8 mb-4">
                            <div className="flex bg-white rounded-sm shadow-sm overflow-hidden text-sm md:text-base border border-gray-200">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className={`px-3 md:px-4 py-1.5 md:py-2 flex items-center justify-center border-r border-gray-200 ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    &lt;
                                </button>

                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`px-3 md:px-4 py-1.5 md:py-2 font-medium border-r border-gray-200 ${currentPage === i + 1 ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary hover:bg-gray-50'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className={`px-3 md:px-4 py-1.5 md:py-2 flex items-center justify-center ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    &gt;
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </>
    );
};

export default ProductList;
