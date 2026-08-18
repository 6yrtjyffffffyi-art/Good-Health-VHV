import React from 'react';
import { ShieldAlert, CheckCircle2, Clock, Lock } from 'lucide-react';
import { VhvPermissionState } from '../../types';

interface VhvPermissionDialogProps {
  patientName: string;
  isOpen: boolean;
  onSelectPermission: (perm: VhvPermissionState) => void;
}

export const VhvPermissionDialog: React.FC<VhvPermissionDialogProps> = ({
  patientName,
  isOpen,
  onSelectPermission,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-900 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
            อนุญาตให้ อสม. จัดการข้อมูลของคุณหรือไม่?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            อสม. สามารถช่วยบันทึกและแก้ไขข้อมูลสุขภาพของ <strong className="text-slate-900 font-bold">{patientName}</strong> ได้เมื่อได้รับอนุญาต
          </p>
        </div>

        <div className="space-y-2.5 pt-2">
          {/* Button 1: Solid Dark Blue */}
          <button
            onClick={() => onSelectPermission('granted')}
            className="w-full py-4 px-5 bg-blue-900 hover:bg-blue-950 text-white font-black rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>✓ อนุญาต (เข้าถึงและแก้ไขได้เสมอ)</span>
          </button>

          {/* Button 2: Soft Blue background with Dark Blue text */}
          <button
            onClick={() => onSelectPermission('granted_once')}
            className="w-full py-4 px-5 bg-blue-100/80 hover:bg-blue-200 text-blue-900 font-black rounded-2xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] border border-blue-200"
          >
            <Clock className="w-5 h-5 text-blue-900" />
            <span>↻ เฉพาะครั้งนี้ (อนุญาตเฉพาะการใช้งานครั้งนี้)</span>
          </button>

          {/* Button 3: White background with Outline */}
          <button
            onClick={() => onSelectPermission('denied')}
            className="w-full py-4 px-5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-300 shadow-2xs"
          >
            <Lock className="w-5 h-5 text-slate-500" />
            <span>✕ ไม่อนุญาต (ดูได้อย่างเดียว ห้ามแก้ไข)</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 font-medium">
          ผู้ป่วยหรือผู้ดูแลสามารถเปลี่ยนการอนุญาตได้ตลอดเวลาในหน้าข้อมูลส่วนตัว
        </p>
      </div>
    </div>
  );
};
