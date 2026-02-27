import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

/** Debounce delay (ms) */
const DEBOUNCE_MS = 300;

const SearchWithSuggestions = ({ placeholder, onSearchComplete, className = '', inputClassName = '' }) => {
    const { fetchSearchSuggestions, getProductImageUrl } = useApp();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef = useRef(null);
    const debounceRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!query.trim()) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            const results = await fetchSearchSuggestions(query, 8);
            setSuggestions(results);
            setShowDropdown(true);
            setActiveIndex(-1);
            setLoading(false);
            debounceRef.current = null;
        }, DEBOUNCE_MS);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query, fetchSearchSuggestions]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/products?search=${encodeURIComponent(query)}`);
            setShowDropdown(false);
            onSearchComplete?.();
        }
    };

    const handleSelect = (product) => {
        setShowDropdown(false);
        setQuery('');
        onSearchComplete?.();
        navigate(`/product/${product.id}`);
    };

    const handleKeyDown = (e) => {
        if (!showDropdown || suggestions.length === 0) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((i) => (i < suggestions.length - 1 ? i + 1 : i));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((i) => (i > 0 ? i - 1 : -1));
        } else if (e.key === 'Enter' && activeIndex >= 0 && suggestions[activeIndex]) {
            e.preventDefault();
            handleSelect(suggestions[activeIndex]);
        }
    };

    const categoryLabel = (cat) => {
        const map = {
            fertilizers: 'Phân bón',
            'plant-protection': 'Thuốc BVTV',
            pesticides: 'Thuốc trừ sâu',
            bio: 'Chế phẩm sinh học',
            seeds: 'Hạt giống',
            tools: 'Công cụ'
        };
        return map[cat] || cat;
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <form onSubmit={handleSubmit} className="flex relative">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.trim() && setShowDropdown(true)}
                    onKeyDown={handleKeyDown}
                    className={inputClassName}
                    autoComplete="off"
                />
                <button type="submit" className="absolute right-1 top-1 bottom-1 bg-primary text-white px-6 rounded-sm hover:bg-primary-dark transition-colors flex items-center justify-center">
                    <Search className="w-5 h-5" />
                </button>
            </form>

            {showDropdown && query.trim() && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-[100] max-h-[min(400px,70vh)] overflow-y-auto">
                    {loading ? (
                        <div className="px-4 py-6 text-center text-gray-500 text-sm">Đang tìm...</div>
                    ) : suggestions.length === 0 ? (
                        <div className="px-4 py-6 text-center text-gray-500 text-sm">Không tìm thấy sản phẩm</div>
                    ) : (
                        <div className="py-1">
                            {suggestions.map((p, i) => (
                                <Link
                                    key={p.id}
                                    to={`/product/${p.id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleSelect(p);
                                    }}
                                    className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${i === activeIndex ? 'bg-gray-50' : ''}`}
                                >
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        <img
                                            src={getProductImageUrl(p.image, false, p.category)}
                                            alt=""
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = '/images/default-product-pesticides.jpg';
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-800 text-sm line-clamp-2">{p.name}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{categoryLabel(p.category)}</p>
                                    </div>
                                    <p className="font-bold text-primary text-sm flex-shrink-0">{p.price?.toLocaleString('vi-VN')} đ</p>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchWithSuggestions;
