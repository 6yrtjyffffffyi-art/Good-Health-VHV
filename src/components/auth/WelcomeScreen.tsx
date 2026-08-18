import React from 'react';
import { HeartPulse, ShieldCheck, UserCheck, Stethoscope } from 'lucide-react';

interface WelcomeScreenProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onAdminClick?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onLoginClick,
  onRegisterClick,
  onAdminClick,
}) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200 text-center space-y-6 animate-in fade-in zoom-in duration-200">
        {/* App Logo */}
        <div className="w-20 h-20 bg-gradient-to-tr from-blue-700 to-blue-500 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-blue-200">
          <HeartPulse className="w-12 h-12" />
        </div>

        {/* Welcome Messages */}
        <div className="space-y-3">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
            ระบบสุขภาพชุมชน
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            สวัสดี
          </h1>
          <p className="text-xl font-bold text-blue-700">
            ยินดีต้อนรับเข้าสู่ Good Health VHV
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
            แพลตฟอร์มดูแลสุขภาพสำหรับ ผู้ป่วย/ผู้สูงอายุ, ผู้ดูแล/ญาติ และ อสม. เพื่อชุมชนเข้มแข็ง
          </p>
        </div>

        {/* Roles Highlights */}
        <div className="grid grid-cols-3 gap-2 py-2">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-1">
            <UserCheck className="w-6 h-6 text-emerald-600 mx-auto" />
            <span className="text-[11px] font-bold text-slate-800 block">ผู้ป่วย/สูงอายุ</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-1">
            <ShieldCheck className="w-6 h-6 text-blue-600 mx-auto" />
            <span className="text-[11px] font-bold text-slate-800 block">ผู้ดูแล / ญาติ</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-1">
            <Stethoscope className="w-6 h-6 text-purple-600 mx-auto" />
            <span className="text-[11px] font-bold text-slate-800 block">อสม.</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={onLoginClick}
            className="w-full py-4 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold rounded-2xl text-base shadow-lg shadow-blue-200 transition-all cursor-pointer"
          >
            เข้าสู่ระบบ
          </button>
          <button
            onClick={onRegisterClick}
            className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-base transition-colors cursor-pointer border border-slate-200"
          >
            ลงทะเบียน
          </button>

          {onAdminClick && (
            <button
              onClick={onAdminClick}
              className="w-full py-2.5 bg-slate-900 hover:bg-black text-slate-100 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs mt-1"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              ระบบแอดมิน / Super Admin (Portal)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


