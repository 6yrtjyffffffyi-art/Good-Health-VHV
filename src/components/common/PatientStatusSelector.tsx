import React from 'react';
import { PATIENT_STATUS_CONFIG, ALL_STATUS_KEYS, PatientStatusDetail } from '../../utils/statusUtils';
import { CheckCircle2, Info } from 'lucide-react';

interface PatientStatusSelectorProps {
  value: string;
  onChange: (status: any) => void;
  otherStatusText?: string;
  onOtherTextChange?: (text: string) => void;
  label?: string;
  layout?: 'cards' | 'compact-grid' | 'dropdown';
  className?: string;
}

export const PatientStatusSelector: React.FC<PatientStatusSelectorProps> = ({
  value,
  onChange,
  otherStatusText = '',
  onOtherTextChange,
  label = 'สถานะผู้ป่วย / ผู้สูงอายุ',
  layout = 'cards',
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-800">
          {label} <span className="text-rose-500">*</span>
        </label>
        <span className="text-[11px] text-slate-500 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-blue-600" />
          แตะเลือกสถานะเพื่อดูคำอธิบายลักษณะ
        </span>
      </div>

      {/* Cards Layout with Full Descriptions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {ALL_STATUS_KEYS.map(key => {
          const cfg: PatientStatusDetail = PATIENT_STATUS_CONFIG[key];
          const isSelected = value === key;

          return (
            <div
              key={key}
              onClick={() => onChange(key)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between text-left ${
                isSelected
                  ? `${cfg.activeBorderClass} shadow-xs`
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cfg.emoji}</span>
                    <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                      {cfg.label}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.badgeBg}`}>
                    {cfg.badge}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {cfg.shortDesc}
                </p>

                {isSelected && cfg.example && (
                  <p className="text-[10px] text-slate-500 bg-white/80 p-1.5 rounded-lg mt-2 border border-slate-100 italic">
                    {cfg.example}
                  </p>
                )}
              </div>

              {isSelected && (
                <div className="flex items-center justify-end gap-1 mt-2 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>เลือกสถานะนี้แล้ว</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* When "อื่นๆ" is selected, show input */}
      {value === 'อื่นๆ' && (
        <div className="pt-1 animate-in fade-in">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            ระบุรายละเอียดสถานะเพิ่มเติม <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={otherStatusText}
            onChange={e => onOtherTextChange?.(e.target.value)}
            placeholder="อธิบายลักษณะสภาพความเป็นอยู่หรือการดูแลเพิ่มเติม..."
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:border-blue-500 outline-none"
          />
        </div>
      )}
    </div>
  );
};
