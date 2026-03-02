import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Percent, Star, ShieldCheck, MapPin, ShoppingCart, Check, Phone } from 'lucide-react';
import SEO from '../../components/common/SEO';
import { useApp, getDefaultProductImageUrl } from '../../context/AppContext';
import ProductCard from '../../components/shop/ProductCard';
import { categories } from '../../data/categories';
import { formatDateUTC7 } from '../../utils/date';

/** Lấy sản phẩm đều theo từng danh mục (round-robin). Sau này có thể sort theo số lượng mua/đánh giá trong từng category trước khi pick. */
function pickProductsBalancedByCategory(products, limit, categoryOrder = []) {
    if (!products.length || limit <= 0) return [];
    const byCategory = {};
    for (const p of products) {
        if (!byCategory[p.category]) byCategory[p.category] = [];
        byCategory[p.category].push(p);
    }
    const ids = categoryOrder.length ? categoryOrder.filter(c => byCategory[c]?.length) : Object.keys(byCategory);
    if (!ids.length) return products.slice(0, limit);
    const indices = {};
    ids.forEach(c => { indices[c] = 0; });
    const result = [];
    let round = 0;
    while (result.length < limit && round < 1000) {
        let added = 0;
        for (const c of ids) {
            if (result.length >= limit) break;
            const list = byCategory[c];
            if (list && indices[c] < list.length) {
                result.push(list[indices[c]]);
                indices[c]++;
                added++;
            }
        }
        if (added === 0) break;
        round++;
    }
    return result;
}

const HotDealCard = ({ product: p, categories, getProductImageUrl, addToCart }) => {
    const navigate = useNavigate();
    const [justAdded, setJustAdded] = useState(false);
    const inStock = (p.stock ?? 0) > 0;
    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(p, 1);
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1500);
    };
    return (
        <Link to={`/product/${p.id}`} className="min-w-[150px] w-[150px] md:min-w-[200px] md:w-[200px] flex-shrink-0 group flex flex-col relative">
            <div className="bg-gray-50 aspect-square overflow-hidden mb-2 relative flex-shrink-0">
                <img src={getProductImageUrl(p.image, false, p.category)} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={p.name} />
                <div className="absolute top-0 right-0 bg-secondary/10 px-2 py-3 rounded-bl-sm">
                    <div className="flex flex-col items-center leading-none text-secondary">
                        <span className="text-[10px] font-bold">GIẢM</span>
                        <span className="text-sm font-black">20%</span>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 pointer-events-none group-hover:pointer-events-auto">
                    {inStock ? (
                        <button type="button" onClick={handleAddToCart} className="w-full flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2 rounded-lg">
                            {justAdded ? <><Check className="w-3.5 h-3.5" /> Đã thêm!</> : <><ShoppingCart className="w-3.5 h-3.5" /> Thêm vào giỏ</>}
                        </button>
                    ) : (
                        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate('/contact'); }} className="w-full flex items-center justify-center gap-1.5 bg-gray-600 hover:bg-gray-700 text-white text-xs font-bold py-2 rounded-lg">
                            <Phone className="w-3.5 h-3.5" /> Liên hệ cửa hàng
                        </button>
                    )}
                </div>
            </div>
            <div className="flex flex-col flex-1 min-h-0">
                <h3 className="text-xs md:text-sm font-medium text-gray-800 line-clamp-2 h-10 leading-tight break-words" title={p.name}>{p.name}</h3>
                <p className="text-[10px] text-gray-500 capitalize line-clamp-2 h-6 mt-0.5">{categories.find(c => c.id === p.category)?.name || p.category}</p>
                <div className="text-center font-bold text-secondary text-sm md:text-base mt-1 flex-shrink-0">{p.price.toLocaleString('vi-VN')} đ</div>
                <div className="h-4 bg-secondary/20 rounded-full overflow-hidden relative mt-1 flex-shrink-0">
                    <div className="absolute top-0 left-0 bottom-0 bg-secondary w-2/3"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-sm">Đã bán 120</div>
                </div>
            </div>
        </Link>
    );
};

const Home = () => {
    const { products, categories, getProductImageUrl, addToCart, fetchNews, fetchSlideshows } = useApp();
    const [visibleCount, setVisibleCount] = useState(12);
    const [newsList, setNewsList] = useState([]);
    const [slideshows, setSlideshows] = useState([]);
    const [slideIndex, setSlideIndex] = useState(0);

    useEffect(() => {
        fetchNews(4, 0).then(setNewsList).catch(() => setNewsList([]));
    }, [fetchNews]);

    useEffect(() => {
        fetchSlideshows().then(setSlideshows).catch(() => setSlideshows([]));
    }, [fetchSlideshows]);

    useEffect(() => {
        if (slideshows.length <= 1) return;
        const t = setInterval(() => setSlideIndex((i) => (i + 1) % slideshows.length), 5000);
        return () => clearInterval(t);
    }, [slideshows]);

    const loadMore = () => setVisibleCount(prev => prev + 12);

    const categoryOrder = categories.map(c => c.id);
    const hotDealProducts = pickProductsBalancedByCategory(products, 7, categoryOrder);
    const suggestedProducts = pickProductsBalancedByCategory(products, visibleCount, categoryOrder);

    const fallbackBanner = "https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?auto=format&fit=crop&q=80&w=1200";
    const currentSlide = slideshows[slideIndex];
    const featuredNews = newsList.slice(0, 3);

    return (
        <>
            <SEO title="Trang chủ" description="Cửa hàng Vật tư nông nghiệp - Nông Nghiệp Xanh: phân bón, thuốc BVTV, chế phẩm sinh học, hạt giống. Giao hàng tận nơi, COD." url="/" />
            <div className="bg-[#f5f5f5] w-full pb-10">
            {/* Slideshow + Tin nổi bật */}
            <section className="container mx-auto px-2 md:px-0 pt-6 mb-6">
                <div className="flex flex-col lg:flex-row gap-2">
                    {/* Slideshow - 16:9, auto chuyển, nút prev/next khi hover */}
                    <div className="lg:w-[66.66%] w-full rounded-sm overflow-hidden relative shadow-sm aspect-video group">
                        {slideshows.length > 0 ? (
                            <>
                                {slideshows.map((s, i) => (
                                    <Link
                                        key={s.id}
                                        to={`/slide/${s.id}`}
                                        className={`absolute inset-0 block transition-opacity duration-500 ${i === slideIndex ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'}`}
                                    >
                                        <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                                    </Link>
                                ))}
                                {slideshows.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSlideIndex((i) => (i - 1 + slideshows.length) % slideshows.length); }}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            aria-label="Slide trước"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSlideIndex((i) => (i + 1) % slideshows.length); }}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            aria-label="Slide sau"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </button>
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                                            {slideshows.map((_, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSlideIndex(i); }}
                                                    className={`w-2.5 h-2.5 rounded-full transition-colors ${i === slideIndex ? 'bg-primary ring-2 ring-white' : 'bg-white/70 hover:bg-white/90'}`}
                                                    aria-label={`Slide ${i + 1}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <img src={fallbackBanner} alt="Khuyến mãi" className="w-full h-full object-cover" />
                        )}
                    </div>
                    {/* Tin nổi bật */}
                    <div className="lg:w-[33.33%] w-full flex flex-col rounded-sm overflow-hidden shadow-sm bg-white">
                        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-sm font-bold text-primary border-b-2 border-primary pb-1">Tin nổi bật</h2>
                            <Link to="/news" className="text-xs font-medium text-primary hover:underline flex items-center gap-0.5">
                                Xem thêm <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        <div className="flex-1 p-3 space-y-2 min-h-0">
                            {featuredNews.length > 0 ? (
                                featuredNews.map((item) => (
                                    <Link
                                        key={item.id}
                                        to={`/news/${item.id}`}
                                        className="flex gap-2 p-2 rounded hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                                            {item.image ? (
                                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-lg text-gray-400">📰</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-[10px] text-gray-500">{formatDateUTC7(item.created_at)}</span>
                                            <h3 className="text-xs font-semibold text-gray-800 group-hover:text-primary line-clamp-2 leading-tight">{item.title}</h3>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-xs text-gray-500 py-4 text-center">Chưa có tin tức</p>
                            )}
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
                                    <img src={getDefaultProductImageUrl(cat.id)} className="w-full h-full object-cover" alt={cat.name} />
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

                    <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar items-stretch">
                        {hotDealProducts.map(p => (
                            <HotDealCard key={p.id} product={p} categories={categories} getProductImageUrl={getProductImageUrl} addToCart={addToCart} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Product Feed - "Gợi ý cho bạn" */}
            <section className="container mx-auto px-2 md:px-0">
                <div className="bg-white px-4 py-3 border-b-4 border-primary inline-block rounded-t-sm shadow-sm sticky top-[56px] md:top-[128px] z-40 w-full mb-2 uppercase text-primary font-bold">
                    Gợi ý Hôm Nay
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-2">
                    {suggestedProducts.map((p) => (
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
        </>
    );
};

export default Home;
