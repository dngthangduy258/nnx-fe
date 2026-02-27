/**
 * Cấu hình SEO - cập nhật tại đây
 * Dùng cho meta tags, Open Graph, Twitter Card, JSON-LD
 */
import { storeInfo } from './store-info';

export const siteConfig = {
    name: 'Cửa hàng Vật tư nông nghiệp - Nông Nghiệp Xanh',
    shortName: 'Nông Nghiệp Xanh',
    description: 'Vật tư nông nghiệp chất lượng – Phân bón, thuốc bảo vệ thực vật, chế phẩm sinh học, hạt giống. Giao hàng tận nơi, thanh toán COD.',
    keywords: 'phân bón, thuốc trừ sâu, thuốc bảo vệ thực vật, hạt giống, chế phẩm sinh học, vật tư nông nghiệp, nông nghiệp xanh',
    locale: 'vi_VN',
    /** URL gốc website (không có / cuối). VD: https://nnxagro.vn */
    siteUrl: import.meta.env.VITE_SITE_URL || 'https://nnxagro.vn',
    /** Ảnh mặc định cho OG (1200x630 px khuyến nghị) */
    defaultImage: '/images/og-default.jpg',
    /** Logo / favicon */
    logo: '/vite.svg',
    /** Thông tin tổ chức cho JSON-LD */
    organization: {
        '@type': 'Organization',
        name: storeInfo.name,
        url: import.meta.env.VITE_SITE_URL || 'https://nnxagro.vn',
        telephone: storeInfo.phone,
        email: storeInfo.email,
        address: {
            '@type': 'PostalAddress',
            addressLocality: storeInfo.address,
        },
    },
};
