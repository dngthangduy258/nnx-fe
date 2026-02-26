import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ChevronRight, Pin, Calendar } from 'lucide-react';

const NewsList = () => {
    const { fetchNews } = useApp();
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNews(20, 0).then(setList).catch((e) => setError(e.message)).finally(() => setLoading(false));
    }, [fetchNews]);

    const formatDate = (d) => {
        if (!d) return '';
        return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <div className="bg-[#f5f5f5] min-h-screen pb-10">
            <div className="container mx-auto px-4 py-6">
                <div className="bg-white rounded-sm shadow-sm p-4 md:p-6">
                    <h1 className="text-xl md:text-2xl font-bold text-primary border-b-4 border-primary inline-block pb-2 mb-6">
                        Tin tức nông nghiệp
                    </h1>
                    <p className="text-gray-600 text-sm mb-6">
                        Cập nhật kiến thức và tin tức nông nghiệp — luôn hướng tới sản phẩm chất lượng tại NNXAGRO.
                    </p>
                    {loading && <div className="py-12 text-center text-gray-500">Đang tải tin tức...</div>}
                    {error && <div className="py-8 text-center text-red-600">{error}</div>}
                    {!loading && !error && list.length === 0 && (
                        <div className="py-12 text-center text-gray-500">Chưa có tin tức nào.</div>
                    )}
                    {!loading && !error && list.length > 0 && (
                        <div className="space-y-4">
                            {list.map((item) => (
                                <Link
                                    key={item.id}
                                    to={`/news/${item.id}`}
                                    className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-sm hover:border-primary hover:bg-primary/5 transition-all group"
                                >
                                    <div className="sm:w-40 flex-shrink-0 aspect-video sm:aspect-square bg-gray-100 rounded overflow-hidden">
                                        {item.image ? (
                                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">📰</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                            {item.pin_to_top ? (
                                                <span className="flex items-center gap-1 text-primary font-medium"><Pin className="w-3 h-3" /> Ghim</span>
                                            ) : null}
                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(item.created_at)}</span>
                                        </div>
                                        <h2 className="text-base md:text-lg font-semibold text-gray-800 group-hover:text-primary line-clamp-2">{item.title}</h2>
                                        {item.excerpt && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.excerpt}</p>}
                                        <span className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-2">Đọc tiếp <ChevronRight className="w-4 h-4" /></span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <Link to="/products" className="text-primary font-medium hover:underline">← Mua sắm sản phẩm tại NNXAGRO</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsList;
