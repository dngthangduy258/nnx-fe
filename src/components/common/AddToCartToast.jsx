import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Toast thông báo khi thêm sản phẩm vào giỏ hàng.
 * Hiển thị rõ ràng để người dùng biết thao tác đã thành công.
 */
const AddToCartToast = ({ count }) => {
    return (
        <AnimatePresence>
            {count > 0 && (
            <motion.div
                key="add-to-cart-toast"
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto"
            >
                <Link
                    to="/cart"
                    className="flex items-center gap-3 bg-white shadow-xl rounded-2xl border-2 border-primary px-5 py-4 min-w-[280px] hover:shadow-2xl hover:scale-[1.02] transition-all"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.1 }}
                        className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"
                    >
                        <CheckCircle2 className="w-7 h-7 text-primary" />
                    </motion.div>
                    <div className="flex-1">
                        <p className="font-bold text-gray-800 text-base">
                            Đã thêm {count} sản phẩm vào giỏ hàng
                        </p>
                        <p className="text-sm text-primary font-semibold mt-0.5 flex items-center gap-1">
                            <ShoppingCart className="w-4 h-4" />
                            Xem giỏ hàng →
                        </p>
                    </div>
                </Link>
            </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AddToCartToast;
