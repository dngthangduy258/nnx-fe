/** DB lưu UTC. FE hiển thị UTC+7 (Vietnam). */
const TZ_VIETNAM = 'Asia/Ho_Chi_Minh';

/** Format date only (dd/mm/yyyy) - UTC+7 */
export const formatDateUTC7 = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('vi-VN', { timeZone: TZ_VIETNAM, day: '2-digit', month: '2-digit', year: 'numeric' });
};

/** Format date + time - UTC+7 */
export const formatDateTimeUTC7 = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleString('vi-VN', { timeZone: TZ_VIETNAM });
};
