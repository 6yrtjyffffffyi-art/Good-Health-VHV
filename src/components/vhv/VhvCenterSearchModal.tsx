import React, { useState, useMemo } from 'react';
import { VhvCenter } from '../../types';
import { VHV_CENTERS_DATABASE, THAILAND_PROVINCES, calculateDistanceKm } from '../../data/vhvCentersData';
import {
  Search,
  MapPin,
  Building2,
  Navigation,
  X,
  Check,
  HelpCircle,
  ChevronRight,
  Filter,
  Sparkles
} from 'lucide-react';

interface VhvCenterSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCenter: (center: {
    name: string;
    province: string;
    district: string;
    subdistrict: string;
  }) => void;
  userCoords: { lat: number; lng: number } | null;
  locationPermission: string;
}

export const VhvCenterSearchModal: React.FC<VhvCenterSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCenter,
  userCoords,
  locationPermission
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedSubdistrict, setSelectedSubdistrict] = useState<string>('');
  
  // Custom "Other" manual input mode
  const [showOtherManual, setShowOtherManual] = useState(false);
  const [customCenterName, setCustomCenterName] = useState('');
  const [customProvince, setCustomProvince] = useState('');
  const [customDistrict, setCustomDistrict] = useState('');
  const [customSubdistrict, setCustomSubdistrict] = useState('');

  const hasLocation = (locationPermission === 'granted' || locationPermission === 'granted_once') && userCoords !== null;

  // Compute centers with distance if location available
  const processedCenters = useMemo(() => {
    return VHV_CENTERS_DATABASE.map(center => {
      let distanceKm: number | null = null;
      if (hasLocation && userCoords && center.lat && center.lng) {
        distanceKm = calculateDistanceKm(userCoords.lat, userCoords.lng, center.lat, center.lng);
      }
      return {
        ...center,
        distanceKm
      };
    });
  }, [hasLocation, userCoords]);

  // Extract unique districts and subdistricts based on selected province
  const availableDistricts = useMemo(() => {
    if (!selectedProvince) {
      return Array.from(new Set(VHV_CENTERS_DATABASE.map(c => c.district))).filter(Boolean);
    }
    return Array.from(
      new Set(
        VHV_CENTERS_DATABASE.filter(c => c.province === selectedProvince).map(c => c.district)
      )
    ).filter(Boolean);
  }, [selectedProvince]);

  const availableSubdistricts = useMemo(() => {
    let list = VHV_CENTERS_DATABASE;
    if (selectedProvince) {
      list = list.filter(c => c.province === selectedProvince);
    }
    if (selectedDistrict) {
      list = list.filter(c => c.district === selectedDistrict);
    }
    return Array.from(new Set(list.map(c => c.subdistrict))).filter(Boolean);
  }, [selectedProvince, selectedDistrict]);

  // Filter and sort results
  const filteredCenters = useMemo(() => {
    let result = processedCenters;

    // Filter by search term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.subdistrict.toLowerCase().includes(q) ||
          c.district.toLowerCase().includes(q) ||
          c.province.toLowerCase().includes(q)
      );
    }

    // Filter by dropdowns
    if (selectedProvince) {
      result = result.filter(c => c.province === selectedProvince);
    }
    if (selectedDistrict) {
      result = result.filter(c => c.district === selectedDistrict);
    }
    if (selectedSubdistrict) {
      result = result.filter(c => c.subdistrict === selectedSubdistrict);
    }

    // Sort by distance if available
    if (hasLocation) {
      result.sort((a, b) => {
        if (a.distanceKm === null && b.distanceKm === null) return 0;
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      });
    }

    return result;
  }, [
    processedCenters,
    searchTerm,
    selectedProvince,
    selectedDistrict,
    selectedSubdistrict,
    hasLocation
  ]);

  if (!isOpen) return null;

  const handleSelect = (center: (typeof processedCenters)[0]) => {
    onSelectCenter({
      name: center.name,
      province: center.province,
      district: center.district,
      subdistrict: center.subdistrict
    });
    onClose();
  };

  const handleSelectCustom = () => {
    if (!customCenterName.trim()) return;
    onSelectCenter({
      name: customCenterName.trim(),
      province: customProvince.trim() || 'เชียงใหม่',
      district: customDistrict.trim() || 'เมือง',
      subdistrict: customSubdistrict.trim() || 'สุเทพ'
    });
    onClose();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedProvince('');
    setSelectedDistrict('');
    setSelectedSubdistrict('');
    setShowOtherManual(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-700 to-teal-800 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-white backdrop-blur-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight">ค้นหาศูนย์ อสม.</h3>
              <p className="text-xs text-emerald-100">
                ค้นหาสังกัดศูนย์ อสม. หรือ รพ.สต. ที่คุณสังกัด
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50/50">
          {/* Location Assistance Banner */}
          {hasLocation ? (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-900">
              <Navigation className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block text-emerald-950">
                  ระบบกำลังใช้พิกัดปัจจุบันของคุณ
                </strong>
                <span>
                  แสดงศูนย์ อสม. ใกล้คุณ โดยเรียงลำดับจากใกล้ที่สุดไปไกลที่สุด (กรุณากด "เลือกสังกัดนี้" เพื่อยืนยัน)
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block text-amber-950">
                  ค้นหาตามพื้นที่หรือพิมพ์ชื่อศูนย์
                </strong>
                <span>
                  คุณสามารถพิมพ์ชื่อศูนย์ หรือเลือกจังหวัด/อำเภอ/ตำบล เพื่อค้นหาสังกัดที่ต้องการได้
                </span>
              </div>
            </div>
          )}

          {/* Search Box */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              พิมพ์ค้นหาชื่อศูนย์ หรือพื้นที่ (เช่น "บางนา", "สุเทพ", "คลองเตย")
            </label>
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setShowOtherManual(false);
                }}
                placeholder="พิมพ์ชื่อศูนย์ อสม., รพ.สต., ตำบล หรืออำเภอ..."
                className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Cascading Address Filters (จังหวัด -> อำเภอ -> ตำบล) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-emerald-700" />
                กรองตามพื้นที่ (จังหวัด / อำเภอ / ตำบล)
              </span>
              {(selectedProvince || selectedDistrict || selectedSubdistrict) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                >
                  ล้างตัวกรอง
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Province */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  จังหวัด
                </label>
                <select
                  value={selectedProvince}
                  onChange={e => {
                    setSelectedProvince(e.target.value);
                    setSelectedDistrict('');
                    setSelectedSubdistrict('');
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">ทุกจังหวัด</option>
                  {THAILAND_PROVINCES.map(p => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  อำเภอ / เขต
                </label>
                <select
                  value={selectedDistrict}
                  onChange={e => {
                    setSelectedDistrict(e.target.value);
                    setSelectedSubdistrict('');
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">ทุกอำเภอ</option>
                  {availableDistricts.map(d => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subdistrict */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  ตำบล / แขวง
                </label>
                <select
                  value={selectedSubdistrict}
                  onChange={e => setSelectedSubdistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">ทุกตำบล</option>
                  {availableSubdistricts.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-700" />
                {hasLocation ? 'ศูนย์ อสม. ใกล้คุณ (เรียงตามระยะทาง)' : 'รายการศูนย์ อสม. ที่พบ'} ({filteredCenters.length})
              </span>
            </div>

            {filteredCenters.length > 0 ? (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {filteredCenters.map((center, idx) => (
                  <div
                    key={center.id}
                    className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left group"
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition-colors">
                          {center.name}
                        </h4>
                      </div>
                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-0.5 pl-7">
                        <span>ตำบล{center.subdistrict}</span>
                        <span>•</span>
                        <span>อำเภอ{center.district}</span>
                        <span>•</span>
                        <span>จังหวัด{center.province}</span>
                      </div>
                      {center.distanceKm !== null && (
                        <div className="pl-7 pt-0.5">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <Navigation className="w-3 h-3 text-emerald-600" />
                            ห่างจากคุณ {center.distanceKm} กม.
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelect(center)}
                      className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <Check className="w-3.5 h-3.5" />
                      เลือกสังกัดนี้
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">ไม่พบศูนย์ อสม. ที่ตรงกับเงื่อนไข</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    ลองค้นหาด้วยคำค้นอื่น หรือใช้ตัวเลือก "ระบุชื่อสังกัดด้วยตนเอง" ด้านล่าง
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Option "Other / Not Found" (Requirement #6) */}
          <div className="pt-2 border-t border-slate-200">
            {!showOtherManual ? (
              <button
                type="button"
                onClick={() => setShowOtherManual(true)}
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 border border-slate-300"
              >
                <HelpCircle className="w-4 h-4 text-slate-500" />
                ไม่พบสังกัดของฉัน / ระบุสังกัดอื่น ๆ
              </button>
            ) : (
              <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    อื่นๆ: ระบุชื่อสังกัด/ศูนย์ อสม. ด้วยตนเอง
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowOtherManual(false)}
                    className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    ปิดส่วนนี้
                  </button>
                </div>
                <p className="text-[11px] text-amber-800">
                  กรอกชื่อสังกัดด้วยตนเอง หากไม่พบข้อมูลในระบบ (เป็นทางเลือกสำรอง)
                </p>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    ระบุชื่อสังกัด / ศูนย์ อสม. <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customCenterName}
                    onChange={e => setCustomCenterName(e.target.value)}
                    placeholder="เช่น ศูนย์ อสม. ชุมชนร่วมใจพัฒนา"
                    className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      ตำบล / แขวง
                    </label>
                    <input
                      type="text"
                      value={customSubdistrict}
                      onChange={e => setCustomSubdistrict(e.target.value)}
                      placeholder="ตำบล"
                      className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs font-medium text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      อำเภอ / เขต
                    </label>
                    <input
                      type="text"
                      value={customDistrict}
                      onChange={e => setCustomDistrict(e.target.value)}
                      placeholder="อำเภอ"
                      className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs font-medium text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      จังหวัด
                    </label>
                    <input
                      type="text"
                      value={customProvince}
                      onChange={e => setCustomProvince(e.target.value)}
                      placeholder="จังหวัด"
                      className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    disabled={!customCenterName.trim()}
                    onClick={handleSelectCustom}
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    ใช้สังกัดที่กรอกด้วยตนเองนี้
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
