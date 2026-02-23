import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ProductCard from '../../components/shop/ProductCard';
import { ChevronRight, Filter, Search, Star, Menu } from 'lucide-react';
import { categories } from '../../data/categories';

const ProductList = () => {
    const { products, loading, error, fetchData } = useApp();
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
        navigate(`/products?category=${id}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`);
    };

    const handlePriceFilter = (e) => {
        e.preventDefault();
        // Just trigger standard filter recalculation visually
        // in a real app this would likely trigger an API refetch.
        // We handle it in the useMemo below.
    };

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (selectedCategory !== 'all') {
            result = result.filter(p => p.category === selectedCategory);
        }

        if (searchTerm) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (minPrice) result = result.filter(p => p.price >= parseInt(minPrice));
        if (maxPrice) result = result.filter(p => p.price <= parseInt(maxPrice));

        // Sort logic
        if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
        if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
        if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
        // 'popular' could just be default order or rating sorting
        if (sortBy === 'popular') result.sort((a, b) => b.rating - a.rating);

        return result;
    }, [products, selectedCategory, searchTerm, sortBy, minPrice, maxPrice]);

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
        <div className="bg-[#f5f5f5] min-h-screen pb-20 pt-4">
            <div className="container mx-auto px-2 md:px-0 flex flex-col md:flex-row gap-4">

                {/* Left Sidebar Filter (Hidden on Small Mobile, visible on Md+) */}
                <div className="hidden md:flex flex-col w-60 flex-shrink-0">
                    <div className="bg-white rounded-sm shadow-sm p-4 sticky top-[120px]">
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

                        <div className="mb-4">
                            <h3 className="text-sm text-gray-700 font-medium mb-3">Khoảng Giá</h3>
                            <form className="flex items-center gap-2 mb-2" onSubmit={handlePriceFilter}>
                                <input
                                    type="number"
                                    placeholder="₫ TỪ"
                                    className="w-[80px] p-1 text-xs border border-gray-300 rounded-sm focus:border-primary outline-none"
                                    value={minPrice}
                                    onChange={e => setMinPrice(e.target.value)}
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    placeholder="₫ ĐẾN"
                                    className="w-[80px] p-1 text-xs border border-gray-300 rounded-sm focus:border-primary outline-none"
                                    value={maxPrice}
                                    onChange={e => setMaxPrice(e.target.value)}
                                />
                            </form>
                            <button
                                className="w-full bg-primary text-white text-xs py-1.5 uppercase font-medium rounded-sm hover:bg-primary-dark transition-colors"
                                onClick={handlePriceFilter}
                            >
                                Áp dụng
                            </button>
                        </div>
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
                    <div className="md:hidden flex sticky top-[55px] z-40 bg-white shadow-sm border-b border-gray-100 mb-2">
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
                        <button className="flex-1 flex justify-center items-center py-3 gap-1 text-sm text-gray-700">
                            Bộ lọc <Filter className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Active Filters Display */}
                    {(searchTerm || selectedCategory !== 'all') && (
                        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 bg-white p-2 md:bg-transparent md:p-0">
                            <Search className="w-4 h-4 text-primary" />
                            Kết quả tìm kiếm cho
                            {searchTerm && <span className="font-bold text-primary">'{searchTerm}'</span>}
                            {selectedCategory !== 'all' && (
                                <span className="font-bold text-primary">trong mục {categories.find(c => c.id === selectedCategory)?.name}</span>
                            )}
                        </div>
                    )}

                    {/* Grid List */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                            {filteredProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white py-24 flex flex-col items-center justify-center rounded-sm">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                <Search className="w-12 h-12" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-700 mb-2">Không tìm thấy sản phẩm</h3>
                            <button
                                onClick={() => navigate('/products')}
                                className="text-primary font-medium border border-primary px-4 py-2 hover:bg-primary/5 transition-colors"
                            >
                                Xóa điều kiện lọc
                            </button>
                        </div>
                    )}

                    {/* Pagination Mock */}
                    {filteredProducts.length > 0 && (
                        <div className="flex justify-center mt-8 mb-4">
                            <div className="flex bg-white rounded-sm shadow-sm overflow-hidden text-sm md:text-base border border-gray-200">
                                <button className="px-3 md:px-4 py-1.5 md:py-2 text-gray-400 hover:bg-gray-50 flex items-center justify-center border-r border-gray-200">&lt;</button>
                                <button className="px-3 md:px-4 py-1.5 md:py-2 text-white bg-primary font-medium border-r border-gray-200">1</button>
                                <button className="px-3 md:px-4 py-1.5 md:py-2 text-gray-600 hover:text-primary border-r border-gray-200">2</button>
                                <button className="px-3 md:px-4 py-1.5 md:py-2 text-gray-600 hover:text-primary hover:bg-gray-50 border-r border-gray-200">...</button>
                                <button className="px-3 md:px-4 py-1.5 md:py-2 text-gray-600 hover:bg-gray-50 flex items-center justify-center">&gt;</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;
