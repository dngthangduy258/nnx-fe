import React, { useMemo } from 'react';
import { MapPin } from 'lucide-react';
import SearchableSelect from './SearchableSelect';
import { addressesOld, addressesNew } from '../../data/vietnam-addresses';

const emptyAddress = { addressType: 'old', provinceId: '', districtId: '', wardId: '', streetAddress: '' };

/** Địa chỉ theo ĐVHC cũ (3 cấp) và mới (2 cấp). value/onChange: { addressType, provinceId, districtId, wardId, streetAddress } */
export const AddressForm = ({ value = emptyAddress, onChange, setFormError, showLabel = true }) => {
    const { addressType, provinceId, districtId, wardId, streetAddress } = value || emptyAddress;
    const addresses = addressType === 'old' ? addressesOld : addressesNew;
    const selectedProvince = useMemo(() => addresses.find(p => p.id === provinceId), [addresses, provinceId]);
    const selectedDistrict = useMemo(() => selectedProvince?.districts?.find(d => d.id === districtId), [selectedProvince, districtId]);
    const isNewFormat = addressType === 'new';
    const districts = selectedProvince?.districts ?? [];
    const wards = isNewFormat ? (selectedProvince?.wards ?? []) : (selectedDistrict?.wards ?? []);

    const update = (updates) => {
        onChange({ ...(value || emptyAddress), ...updates });
        setFormError?.('');
    };

    const handleTypeChange = (type) => {
        update({ addressType: type, provinceId: '', districtId: '', wardId: '' });
    };

    return (
        <div className="space-y-3">
            {showLabel && (
                <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Địa chỉ
                </p>
            )}
            <p className="text-xs text-gray-500 mb-1.5">Loại đơn vị hành chính</p>
            <div className="flex p-1 rounded-xl bg-gray-100 border border-gray-200">
                <button
                    type="button"
                    onClick={() => handleTypeChange('old')}
                    className={`flex-1 min-h-[48px] px-4 py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 touch-manipulation ${addressType === 'old' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                >
                    ĐVHC Cũ
                </button>
                <button
                    type="button"
                    onClick={() => handleTypeChange('new')}
                    className={`flex-1 min-h-[48px] px-4 py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 touch-manipulation ${addressType === 'new' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                >
                    ĐVHC Mới
                </button>
            </div>

            <SearchableSelect
                options={addresses}
                value={provinceId}
                onChange={(id) => update({ provinceId: id, districtId: '', wardId: '' })}
                placeholder="Chọn Tỉnh / Thành phố"
                searchPlaceholder="Gõ để tìm (vd: ca → Cà Mau)"
                getOptionLabel={(o) => o.name}
                getOptionValue={(o) => o.id}
            />

            {!isNewFormat && (
                <SearchableSelect
                    options={districts}
                    value={districtId}
                    onChange={(id) => update({ districtId: id, wardId: '' })}
                    placeholder="Chọn Quận / Huyện"
                    searchPlaceholder="Gõ để tìm..."
                    disabled={!provinceId}
                    getOptionLabel={(o) => o.name}
                    getOptionValue={(o) => o.id}
                />
            )}

            <SearchableSelect
                options={wards}
                value={wardId}
                onChange={(id) => update({ wardId: id })}
                placeholder="Chọn Xã / Phường"
                searchPlaceholder="Gõ để tìm..."
                disabled={!provinceId}
                getOptionLabel={(o) => o.name}
                getOptionValue={(o) => o.id}
            />

            <input
                type="text"
                placeholder="Số nhà, tên đường (bắt buộc)"
                className="w-full min-h-[48px] px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-base touch-manipulation"
                value={streetAddress}
                onChange={(e) => update({ streetAddress: e.target.value })}
            />
        </div>
    );
};

/** Build address string từ structured data */
export const buildAddressFromStructured = (addr, addressesOldData, addressesNewData) => {
    if (!addr || typeof addr !== 'object') return '';
    const { addressType, provinceId, districtId, wardId, streetAddress } = addr;
    const addresses = addressType === 'new' ? addressesNewData : addressesOldData;
    const province = addresses?.find(p => p.id === provinceId);
    const district = province?.districts?.find(d => d.id === districtId);
    const ward = (addressType === 'new' ? province?.wards : district?.wards)?.find(w => w.id === wardId);
    const parts = [];
    if (streetAddress?.trim()) parts.push(streetAddress.trim());
    if (ward) parts.push(ward.name);
    if (addressType === 'old' && district) parts.push(district.name);
    if (province) parts.push(province.name);
    return parts.join(', ');
};

/** Parse address - nếu là JSON structured thì return object, nếu string thì return null (không restore được) */
export const parseAddressFromApi = (addr) => {
    if (!addr) return null;
    if (typeof addr === 'string') {
        try {
            const parsed = JSON.parse(addr);
            if (parsed && typeof parsed === 'object' && 'provinceId' in parsed) return parsed;
        } catch { }
        return null;
    }
    if (typeof addr === 'object' && addr.provinceId !== undefined) return addr;
    return null;
};

export default AddressForm;
