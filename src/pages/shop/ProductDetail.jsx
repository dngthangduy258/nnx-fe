import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck, RefreshCw, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import ProductCard from '../../components/shop/ProductCard';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, loading, addToCart, getProductImageUrl } = useApp();
    const [quantity, setQuantity] = useState(1);

    if (loading) {
        return (
            <div className="container pt-32 pb-20 text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 font-bold">Đang tải chi tiết sản phẩm...</p>
            </div>
        );
    }

    const product = products.find(p => p.id === parseInt(id));

    if (!product) {
        return (
            <div className="container pt-32 pb-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Sản phẩm không tồn tại</h2>
                <Button onClick={() => navigate('/products')}>Quay về cửa hàng</Button>
            </div>
        );
    }

    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
    };

    return (
        <div className="product-detail-page pt-24 pb-20">
            <div className="container">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-8"
                >
                    <ArrowLeft className="w-5 h-5" /> Quay lại
                </button>

                <div className="grid md:grid-cols-2 gap-12 mb-20">
                    {/* Image Gallery */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="aspect-square rounded-3xl overflow-hidden bg-gray-100 border border-gray-100 shadow-lg"
                    >
                        <img
                            src={getProductImageUrl(product.image)}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-4 uppercase">
                            {product.category}
                        </span>
                        <h1 className="text-4xl font-extrabold text-primary-dark mb-2">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-1 text-amber-500">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="font-bold">{product.rating}</span>
                            </div>
                            <span className="text-gray-300">|</span>
                            <span className="text-sm text-green-600 font-bold">Còn hàng: {product.stock} sản phẩm</span>
                        </div>

                        <p className="text-3xl font-extrabold text-secondary mb-6">
                            {product.price.toLocaleString('vi-VN')} đ
                        </p>

                        <p className="text-gray-600 leading-relaxed mb-8">
                            {product.description}
                        </p>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-6 mb-8">
                            <div className="flex items-center border border-gray-200 rounded-xl p-1">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-12 text-center font-bold">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                                <ShoppingCart className="w-5 h-5" /> Thêm vào giỏ hàng
                            </Button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-8">
                            <div className="flex flex-col items-center text-center gap-2">
                                <ShieldCheck className="w-6 h-6 text-primary" />
                                <span className="text-[10px] font-bold uppercase text-gray-500">100% Chính hãng</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2">
                                <Truck className="w-6 h-6 text-primary" />
                                <span className="text-[10px] font-bold uppercase text-gray-500">Giao hàng cơ động</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2">
                                <RefreshCw className="w-6 h-6 text-primary" />
                                <span className="text-[10px] font-bold uppercase text-gray-500">Hỗ trợ kỹ thuật</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="related-section">
                        <h2 className="text-2xl font-extrabold text-primary-dark mb-8">Sản phẩm liên quan</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {relatedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default ProductDetail;
