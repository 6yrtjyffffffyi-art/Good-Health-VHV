import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  MapPin, 
  Check, 
  X, 
  Plus, 
  Filter,
  Hospital
} from 'lucide-react';
import { THAI_HEALTH_ORGANIZATIONS, HealthOrganization } from '../../data/healthOrganizationsData';

interface HealthOrganizationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (org: { organizationName: string; province?: string; district?: string; subdistrict?: string }) => void;
  currentValue?: string;
  defaultProvince?: string;
}

export const HealthOrganizationSelectorModal: React.FC<HealthOrganizationSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentValue = '',
  defaultProvince = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedProvince, setSelectedProvince] = useState<string>(defaultProvince || 'ALL');
  const [customOrgInput, setCustomOrgInput] = useState('');

  // Extract unique provinces
  const provinces = useMemo(() => {
    const set = new Set<string>();
    THAI_HEALTH_ORGANIZATIONS.forEach(org => set.add(org.province));
    return Array.from(set).sort();
  }, []);

  // Filtered organizations
  const filteredOrgs = useMemo(() => {
    return THAI_HEALTH_ORGANIZATIONS.filter(org => {
      const matchText = 
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.subdistrict.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.code.toLowerCase().includes(searchTerm.toLowerCase());

      const matchType = selectedType === 'ALL' || org.type === selectedType;
      const matchProv = selectedProvince === 'ALL' || org.province === selectedProvince;

      return matchText && matchType && matchProv;
    });
  }, [searchTerm, selectedType, selectedProvince]);

  if (!isOpen) return null;

  const handleSelectOrg = (org: HealthOrganization) => {
    onSelect({
      organizationName: org.name,
      province: org.province,
      district: org.district,
      subdistrict: org.subdistrict,
    });
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customOrgInput.trim()) return;
    onSelect({
      organizationName: customOrgInput.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border-2 border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-700 via-sky-700 to-indigo-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white shadow-inner">
              <Hospital className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black">
                ค้นหาและเลือกหน่วยงาน / สังกัด อสม.
              </h3>
              <p className="text-xs text-blue-100 font-medium">
                รพ.สต., ศูนย์บริการสาธารณสุข, สสอ., โรงพยาบาล หรือหน่วยงานท้องถิ่น
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 shrink-0">
          {/* Main Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="พิมพ์ชื่อ รพ.สต. / ตำบล / อำเภอ / รหัสหน่วยงาน..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-slate-300 rounded-2xl text-xs sm:text-sm font-semibold outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
              autoFocus
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Category Type Pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              {[
                { id: 'ALL', label: 'ทั้งหมด' },
                { id: 'รพ.สต.', label: 'รพ.สต.' },
                { id: 'ศูนย์บริการสาธารณสุข', label: 'ศบส.' },
                { id: 'สสอ.', label: 'สสอ.' },
                { id: 'โรงพยาบาล', label: 'โรงพยาบาล' },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedType(tab.id)}
                  className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedType === tab.id
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Province Select */}
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="ml-auto px-2.5 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-blue-600"
            >
              <option value="ALL">ทุกจังหวัด</option>
              {provinces.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* List of Organizations */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-slate-100">
          {filteredOrgs.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  ไม่พบหน่วยงานที่ตรงกับคำค้นหา "{searchTerm}"
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  คุณสามารถพิมพ์ชื่อสังกัดหรือหน่วยงานของคุณเองด้านล่างได้เลย
                </p>
              </div>
            </div>
          ) : (
            filteredOrgs.map((org) => {
              const isSelected = currentValue === org.name;
              return (
                <div
                  key={org.id}
                  onClick={() => handleSelectOrg(org)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      org.type === 'รพ.สต.' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : org.type === 'ศูนย์บริการสาธารณสุข'
                        ? 'bg-blue-100 text-blue-700'
                        : org.type === 'สสอ.'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-blue-700 transition-colors">
                          {org.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {org.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          ต.{org.subdistrict} อ.{org.district} จ.{org.province}
                        </span>
                        {org.phone && (
                          <span className="hidden sm:inline text-slate-400">• โทร {org.phone}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isSelected ? (
                      <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        เลือก
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Custom Typing Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 shrink-0">
          <form onSubmit={handleCustomSubmit} className="flex gap-2 items-center">
            <input
              type="text"
              value={customOrgInput}
              onChange={(e) => setCustomOrgInput(e.target.value)}
              placeholder="หรือพิมพ์ชื่อหน่วยงาน/สังกัดของคุณเองที่นี่..."
              className="flex-1 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="submit"
              disabled={!customOrgInput.trim()}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ใช้ชื่อนี้</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
