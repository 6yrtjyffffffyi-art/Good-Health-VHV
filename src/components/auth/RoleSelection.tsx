import React from 'react';
import { Role } from '../../types';
import { UserCheck, ShieldCheck, Stethoscope, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface RoleSelectionProps {
  selectedRole: Role | null;
  onSelectRole: (role: Role) => void;
  onBack: () => void;
  onNext: () => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({
  selectedRole,
  onSelectRole,
  onBack,
  onNext,
}) => {
  const roles: { id: Role; title: string; subtitle: string; desc: string; icon: any; color: string }[] = [
    {
      id: 'PATIENT',
      title: 'ผู้ป่วย / ผู้สูงอายุ',
      subtitle: 'ผู้รับบริการสุขภาพในชุมชน',
      desc: 'บันทึกสัญญาณชีพ อาการ ยาประจํา เช็กสิทธิรักษา และนัดหมาย อสม.',
      icon: UserCheck,
      color: 'border-emerald-500 bg-emerald-50/50 text-emerald-800',
    },
    {
      id: 'CAREGIVER',
      title: 'ผู้ดูแล / ญาติ',
      subtitle: 'ญาติผู้ดูแลผู้ป่วย/ผู้สูงอายุ',
      desc: 'ติดตามและดูแลสุขภาพของผู้ป่วยในปกครองสูงสุด 5 คน',
      icon: ShieldCheck,
      color: 'border-blue-500 bg-blue-50/50 text-blue-800',
    },
    {
      id: 'VHV',
      title: 'อสม.',
      subtitle: 'อาสาสมัครสาธารณสุขประจำหมู่บ้าน',
      desc: 'ตรวจคิวรับนัด ดูแลผู้สูงอายุประจำพื้นที่ และออกประกาศสุขภาพ',
      icon: Stethoscope,
      color: 'border-purple-500 bg-purple-50/50 text-purple-800',
    },
  ];

  return (
    <div className="max-w-lg w-full mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 my-6 space-y-6 animate-in fade-in zoom-in duration-200">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        ย้อนกลับ
      </button>

      <div className="text-center space-y-2">
        <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full">
          กฎบัญชี: 1 Account = 1 Role
        </span>
        <h2 className="text-2xl font-bold text-slate-900">เลือกบทบาทของคุณ</h2>
        <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
          โปรดเลือกบทบาทหลักในการใช้งาน (แต่ละบัญชีสามารถเลือกได้เพียงบทบาทเดียวเท่านั้น)
        </p>
      </div>

      <div className="space-y-3">
        {roles.map(r => {
          const Icon = r.icon;
          const isSelected = selectedRole === r.id;
          return (
            <div
              key={r.id}
              onClick={() => onSelectRole(r.id)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                isSelected
                  ? 'border-teal-600 bg-teal-50/80 ring-2 ring-teal-200 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base">{r.title}</h3>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />}
                </div>
                <p className="text-xs font-semibold text-teal-800">{r.subtitle}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{r.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onNext}
        disabled={!selectedRole}
        className="w-full py-4 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold rounded-2xl text-base shadow-lg shadow-teal-200 transition-all cursor-pointer disabled:cursor-not-allowed"
      >
        ยืนยันบทบาท และ กรอกข้อมูลเพิ่มเติม
      </button>
    </div>
  );
};
