import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useApp } from '../../context/AppContext';
import { Pin, Calendar, ArrowLeft } from 'lucide-react';

const NewsDetail = () => {
    const { id } = useParams();
    const { fetchNewsById } = useApp();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;
        fetchNewsById(id)
            .then(setArticle)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [id, fetchNewsById]);

    const formatDate = (d) => {
        if (!d) return '';
        return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="bg-[#f5f5f5] min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Đang tải...</div>
            </div>
        );
    }
    if (error || !article) {
        return (
            <div className="bg-[#f5f5f5] min-h-screen flex flex-col items-center justify-center p-4">
                <p className="text-red-600 mb-4">{error || 'Không tìm thấy tin tức'}</p>
                <Link to="/news" className="text-primary font-medium hover:underline">← Quay lại tin tức</Link>
            </div>
        );
    }

    return (
        <div className="bg-[#f5f5f5] min-h-screen pb-10">
            <div className="container mx-auto px-4 py-6 max-w-3xl">
                <Link to="/news" className="inline-flex items-center gap-1 text-gray-600 hover:text-primary text-sm mb-4">
                    <ArrowLeft className="w-4 h-4" /> Tin tức
                </Link>
                <article className="bg-white rounded-sm shadow-sm overflow-hidden">
                    {article.image && (
                        <div className="bg-gray-100 flex justify-center overflow-hidden">
                            <img
                                src={article.image}
                                alt=""
                                className="max-w-full w-full h-auto object-contain"
                            />
                        </div>
                    )}
                    <div className="p-4 md:p-6">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                            {article.pin_to_top ? (
                                <span className="flex items-center gap-1 text-primary font-medium">
                                    <Pin className="w-3 h-3" /> Ghim
                                </span>
                            ) : null}
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {formatDate(article.created_at)}
                            </span>
                        </div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{article.title}</h1>
                        {article.excerpt && (
                            <p className="text-gray-600 mb-4 border-l-4 border-primary pl-4">{article.excerpt}</p>
                        )}
                        <div className="news-content text-gray-700">
                            {article.content ? (
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        table: ({ node, ...props }) => (
                                            <div className="table-wrap">
                                                <table {...props} />
                                            </div>
                                        ),
                                    }}
                                >
                                    {article.content}
                                </ReactMarkdown>
                            ) : (
                                <p className="text-gray-500">Nội dung đang cập nhật.</p>
                            )}
                        </div>
                    </div>
                </article>
                <div className="mt-6 flex flex-wrap gap-4 justify-center">
                    <Link to="/news" className="text-primary font-medium hover:underline">← Tin tức</Link>
                    <Link to="/products" className="text-primary font-medium hover:underline">Mua sắm sản phẩm →</Link>
                </div>
            </div>
        </div>
    );
};

export default NewsDetail;
