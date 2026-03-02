/** DB lưu UTC (SQLite: YYYY-MM-DD HH:MM:SS). FE hiển thị UTC+7 (Vietnam). */
const TZ_VIETNAM = 'Asia/Ho_Chi_Minh';

/** Chuẩn hóa chuỗi từ DB (YYYY-MM-DD HH:MM:SS UTC) thành ISO UTC để JS parse đúng. */
const toUTCDate = (d) => {
    if (!d) return null;
    if (d instanceof Date) return d;
    const s = String(d).trim();
    if (!s) return null;
    if (/Z$|[+-]\d{2}:?\d{2}$/.test(s)) return new Date(s);
    const normalized = s.replace(' ', 'T') + 'Z';
    return new Date(normalized);
};

/** Format date only (dd/mm/yyyy) - UTC+7 */
export const formatDateUTC7 = (d) => {
    const date = toUTCDate(d);
    if (!date || isNaN(date.getTime())) return '';
    return date.toLocaleDateString('vi-VN', { timeZone: TZ_VIETNAM, day: '2-digit', month: '2-digit', year: 'numeric' });
};

/** Format date + time - UTC+7 */
export const formatDateTimeUTC7 = (d) => {
    const date = toUTCDate(d);
    if (!date || isNaN(date.getTime())) return '';
    return date.toLocaleString('vi-VN', { timeZone: TZ_VIETNAM });
};
