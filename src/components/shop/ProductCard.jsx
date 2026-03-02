import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, ShoppingCart, Check, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { getProductImageUrl, addToCart } = useApp();
    const [justAdded, setJustAdded] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1500);
    };
    // Generate some random plausible stats based on ID for demo purposes
    const idStr = String(product.id);
    const soldCount = (idStr.charCodeAt(0) * 12) + 34;
    const location = idStr.length % 2 === 0 ? "Hà Nội" : "TP. Hồ Chí Minh";
    const discount = idStr.length % 3 === 0 ? 15 : 0;

    const originalPrice = discount ? product.price / (1 - discount / 100) : product.price;

    return (
        <Link
            to={`/product/${product.id}`}
            className="bg-white group overflow-hidden border border-transparent hover:border-primary hover:shadow-md transition-all rounded-sm flex flex-col h-full transform hover:-translate-y-1 relative min-w-0"
        >
            {/* Image Section */}
            <div className="relative aspect-square bg-[#f5f5f5] w-full min-w-0 overflow-hidden">
                <img
                    src={getProductImageUrl(product.image, false, product.category)}
                    alt={product.name}
                    className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=400';
                    }}
                />

                {/* Sale Badge */}
                {discount > 0 && (
                    <div className="absolute top-0 right-0 bg-yellow-400/90 text-[10px] font-bold text-red-600 px-1 py-1 rounded-bl-sm">
                        <div className="flex flex-col items-center leading-none">
                            <span>Giảm</span>
                            <span>{discount}%</span>
                        </div>
                    </div>
                )}

                {/* Official/Mall Badge */}
                <div className="absolute top-0 left-0">
                    <div className="bg-primary text-white text-[10px] font-medium px-1.5 py-0.5 rounded-br-lg shadow-sm">
                        Nông Nghiệp Xanh
                    </div>
                </div>
            </div>

            {/* Info Section - fixed heights so cards align in grid */}
            <div className="p-2 flex flex-col flex-grow min-h-0">
                <h3 className="text-xs md:text-sm text-gray-800 line-clamp-2 h-10 leading-tight break-words mb-1">
                    {product.name}
                </h3>

                <div className="min-h-[2rem] flex flex-col justify-center">
                    {discount > 0 ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs text-gray-400 line-through">₫{originalPrice.toLocaleString('vi-VN')}</span>
                            <span className="text-sm md:text-base font-medium text-secondary">₫{product.price.toLocaleString('vi-VN')}</span>
                        </div>
                    ) : (
                        <span className="text-sm md:text-base font-medium text-secondary">₫{product.price.toLocaleString('vi-VN')}</span>
                    )}
                </div>

                <div className="mt-auto pt-2 flex items-center justify-between text-[10px] md:text-[11px] text-gray-500">
                    <div className="flex items-center">
                        <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-yellow-400 text-yellow-400" />
                        <span className="ml-[2px]">{product.rating}</span>
                    </div>
                    <span className="px-1 border-l border-gray-300">Đã bán {soldCount}</span>
                </div>

                <div className="mt-1 flex items-center text-[10px] text-gray-400">
                    <MapPin className="w-2.5 h-2.5 mr-0.5" />
                    <span>{location}</span>
                </div>
            </div>

            {/* Quick Add to Cart / Liên hệ - hiện khi hover */}
            <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm pointer-events-none group-hover:pointer-events-auto">
                {(product.stock ?? 0) > 0 ? (
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        className="w-full flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2.5 rounded-lg shadow-md transition-colors"
                    >
                        {justAdded ? (
                            <>
                                <Check className="w-4 h-4" /> Đã thêm!
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="w-4 h-4" /> Thêm vào giỏ hàng
                            </>
                        )}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate('/contact'); }}
                        className="w-full flex items-center justify-center gap-1.5 bg-gray-600 hover:bg-gray-700 text-white text-xs font-bold py-2.5 rounded-lg shadow-md transition-colors"
                    >
                        <Phone className="w-4 h-4" /> Liên hệ cửa hàng
                    </button>
                )}
            </div>
        </Link>
    );
};

export default ProductCard;
