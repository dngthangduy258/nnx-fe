import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useApp } from '../../context/AppContext';
import SEO from '../../components/common/SEO';
import { siteConfig } from '../../data/seo-config';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const SlideshowDetail = () => {
    const { id } = useParams();
    const { fetchSlideshowById } = useApp();
    const [slide, setSlide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;
        fetchSlideshowById(id)
            .then(setSlide)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [id, fetchSlideshowById]);

    const formatDate = (d) => {
        if (!d) return '';
        return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const isExternalLink = (url) => url && (url.startsWith('http://') || url.startsWith('https://'));

    if (loading) {
        return (
            <div className="bg-[#f5f5f5] min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Đang tải...</div>
            </div>
        );
    }
    if (error || !slide) {
        return (
            <div className="bg-[#f5f5f5] min-h-screen flex flex-col items-center justify-center p-4">
                <p className="text-red-600 mb-4">{error || 'Không tìm thấy thông tin'}</p>
                <Link to="/" className="text-primary font-medium hover:underline">← Về trang chủ</Link>
            </div>
        );
    }

    const slideUrl = `${siteConfig.siteUrl}/slide/${slide.id}`;

    return (
        <>
            <SEO
                title={slide.title}
                description={slide.excerpt || slide.title}
                image={slide.image}
                imageAlt={slide.title}
                url={slideUrl}
            />
            <div className="bg-[#f5f5f5] min-h-screen pb-10">
                <div className="container mx-auto px-4 py-6 max-w-3xl">
                    <Link to="/" className="inline-flex items-center gap-1 text-gray-600 hover:text-primary text-sm mb-4">
                        <ArrowLeft className="w-4 h-4" /> Trang chủ
                    </Link>
                    <article className="bg-white rounded-sm shadow-sm overflow-hidden">
                        {slide.image && (
                            <div className="bg-gray-100 flex justify-center overflow-hidden">
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="max-w-full w-full h-auto object-contain"
                                />
                            </div>
                        )}
                        <div className="p-4 md:p-6">
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                <span>{formatDate(slide.created_at)}</span>
                            </div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{slide.title}</h1>
                            {slide.excerpt && (
                                <p className="text-gray-600 mb-4 border-l-4 border-primary pl-4">{slide.excerpt}</p>
                            )}
                            <div className="news-content text-gray-700">
                                {slide.content ? (
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            table: ({ node, ...props }) => (
                                                <div className="overflow-x-auto my-3">
                                                    <table {...props} />
                                                </div>
                                            ),
                                        }}
                                    >
                                        {slide.content}
                                    </ReactMarkdown>
                                ) : (
                                    <p className="text-gray-500">Nội dung đang cập nhật.</p>
                                )}
                            </div>
                            {slide.link_url && (
                                <div className="mt-6 pt-4 border-t border-gray-100">
                                    {isExternalLink(slide.link_url) ? (
                                        <a
                                            href={slide.link_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                                        >
                                            Xem thêm <ExternalLink className="w-4 h-4" />
                                        </a>
                                    ) : (
                                        <Link
                                            to={slide.link_url.startsWith('/') ? slide.link_url : `/${slide.link_url}`}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                                        >
                                            Xem thêm <ArrowLeft className="w-4 h-4 rotate-180" />
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </article>
                    <div className="mt-6 flex flex-wrap gap-4 justify-center">
                        <Link to="/" className="text-primary font-medium hover:underline">← Trang chủ</Link>
                        <Link to="/products" className="text-primary font-medium hover:underline">Mua sắm sản phẩm →</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SlideshowDetail;
