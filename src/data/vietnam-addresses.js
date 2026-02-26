/**
 * Đơn vị hành chính Việt Nam
 * - Cũ: trước 01/07/2025 (Tỉnh/TP → Quận/Huyện/TX → Xã/Phường/TT) - từ data/old/data.json
 * - Mới: từ 01/07/2025 (Tỉnh/TP → Xã/Phường trực thuộc)
 */

import addressesNewRaw from './new/vn_only_simplified_json_generated_data_vn_units.json';
import addressesOldRaw from './old/data.json';

/** Chuyển data.json (level1/2/3) sang format { id, name, districts, wards } */
const mapOldData = (raw) => {
    if (!raw || !Array.isArray(raw)) return [];
    return raw.map((p) => ({
        id: p.level1_id,
        name: p.name,
        districts: (p.level2s || []).map((d) => ({
            id: d.level2_id,
            name: d.name,
            wards: (d.level3s || []).map((w) => ({ id: w.level3_id, name: w.name })),
        })),
    }));
};

/** Đơn vị hành chính CŨ (trước 01/07/2025) - 3 cấp: Tỉnh → Quận/Huyện → Xã/Phường */
export const addressesOld = mapOldData(addressesOldRaw);

/** Đơn vị hành chính MỚI (từ 01/07/2025) - 2 cấp: Tỉnh/TP → Xã/Phường (không có Quận/Huyện) */
export const addressesNew = (addressesNewRaw || []).map((p) => ({
    id: p.Code,
    name: p.FullName,
    wards: (p.Wards || []).map((w) => ({ id: w.Code, name: w.FullName })),
}));
