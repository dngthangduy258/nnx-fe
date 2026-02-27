import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

/** Chuẩn hóa chuỗi để tìm kiếm (bỏ dấu tiếng Việt). VD: "Đồng Tháp" -> "dong thap", "D" khớp "Đ" */
const normalizeForSearch = (str) => {
    if (!str || typeof str !== 'string') return '';
    return str
        .toLowerCase()
        .replace(/đ/g, 'd')  // đ/Đ không bị NFD tách, cần map thủ công
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
};

/** Dropdown có ô tìm kiếm - gõ để lọc, VD: "ca" -> gợi ý "Cà Mau" */
const SearchableSelect = ({
    options = [],
    value = '',
    onChange,
    placeholder = 'Chọn...',
    searchPlaceholder = 'Gõ để tìm...',
    disabled = false,
    required = false,
    getOptionLabel = (opt) => opt?.name ?? opt?.label ?? String(opt),
    getOptionValue = (opt) => opt?.id ?? opt?.value ?? String(opt),
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const inputRef = useRef(null);
    const containerRef = useRef(null);

    const selectedOption = options.find((o) => getOptionValue(o) === value);
    const displayValue = selectedOption ? getOptionLabel(selectedOption) : '';

    const filteredOptions = React.useMemo(() => {
        if (!search.trim()) return options;
        const q = normalizeForSearch(search);
        return options.filter((opt) => normalizeForSearch(getOptionLabel(opt)).includes(q));
    }, [options, search, getOptionLabel]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (opt) => {
        onChange(getOptionValue(opt));
        setSearch('');
        setIsOpen(false);
    };

    const handleFocus = () => {
        setIsOpen(true);
        setSearch('');
        inputRef.current?.focus();
    };

    return (
        <div ref={containerRef} className="relative">
            <div
                onClick={() => !disabled && handleFocus()}
                className={`w-full min-h-[48px] px-4 py-3 rounded-xl border border-gray-200 focus-within:border-primary outline-none bg-white flex items-center gap-2 cursor-pointer touch-manipulation ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0 sm:w-4 sm:h-4" />
                <input
                    ref={inputRef}
                    type="text"
                    value={isOpen ? search : displayValue}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    onFocus={handleFocus}
                    placeholder={displayValue ? '' : (isOpen ? searchPlaceholder : placeholder)}
                    disabled={disabled}
                    className="flex-1 min-w-0 bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-400 text-base"
                />
                <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 sm:w-4 sm:h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-50 left-0 right-0 mt-1 max-h-[70vh] sm:max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg py-1 overscroll-contain">
                    <div className="max-h-[calc(70vh-0.5rem)] sm:max-h-52 overflow-y-auto overscroll-contain">
                        {filteredOptions.length === 0 ? (
                            <div className="px-4 py-4 text-base text-gray-500">Không tìm thấy</div>
                        ) : (
                            filteredOptions.map((opt) => {
                                const optValue = getOptionValue(opt);
                                const optLabel = getOptionLabel(opt);
                                const isSelected = optValue === value;
                                return (
                                    <button
                                        key={optValue}
                                        type="button"
                                        onClick={() => handleSelect(opt)}
                                        className={`w-full text-left px-4 py-3.5 min-h-[44px] text-base sm:text-sm sm:py-2.5 hover:bg-primary/10 active:bg-primary/15 transition-colors touch-manipulation ${isSelected ? 'bg-primary/15 text-primary font-medium' : 'text-gray-700'}`}
                                    >
                                        {optLabel}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
