import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, MapPin, X, CheckCircle2, ShieldAlert } from 'lucide-react';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SosModal: React.FC<SosModalProps> = ({ isOpen, onClose }) => {
  const { triggerSOS, locationPermission, userCoords } = useApp();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirmSOS = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Smooth loading simulation
    await triggerSOS();
    setLoading(false);
    setIsConfirmed(true);
  };

  const handleClose = () => {
    setIsConfirmed(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-red-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md animate-pulse">
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">แจ้งเหตุฉุกเฉิน SOS</h2>
              <p className="text-red-100 text-sm">ขอความช่วยเหลือด่วนสำหรับผู้ป่วย/ผู้สูงอายุ</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {!isConfirmed ? (
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center space-y-2">
                <ShieldAlert className="w-12 h-12 text-red-600 mx-auto" />
                <h3 className="text-lg font-bold text-red-900">ยืนยันการขอความช่วยเหลือหรือไม่?</h3>
                <p className="text-sm text-red-700 leading-relaxed">
                  ระบบจะส่งตำแหน่งปัจจุบันของคุณไปยัง <span className="font-semibold text-red-900">อสม.</span> และ <span className="font-semibold text-red-900">ผู้ติดต่อฉุกเฉิน/ญาติ</span> เพื่อประสานงานเข้าช่วยเหลือโดยเร็วที่สุด
                </p>
              </div>

              {/* Location Status Info */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600 space-y-1">
                  <span className="font-semibold text-slate-800 block text-sm">ตำแหน่งที่จะส่ง:</span>
                  {locationPermission === 'granted' || locationPermission === 'granted_once' ? (
                    <p className="text-emerald-700 font-medium">
                      ✓ พิกัด GPS: {userCoords?.lat.toFixed(4)}, {userCoords?.lng.toFixed(4)} (ต.สุเทพ อ.เมือง จ.เชียงใหม่)
                    </p>
                  ) : (
                    <p className="text-amber-700 font-medium">
                      ⚠️ ยังไม่ได้รับอนุญาตระบุตำแหน่ง GPS จะส่งที่อยู่ตามทะเบียนบ้านที่ลงทะเบียนไว้แทน
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleConfirmSOS}
                  disabled={loading}
                  className="flex-1 py-4 px-6 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-xl shadow-lg shadow-red-200 text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5" />
                      ยืนยันการขอความช่วยเหลือ
                    </>
                  )}
                </button>
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-base transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">ส่งคำขอความช่วยเหลือแล้ว</h3>
                <p className="text-slate-600 text-sm mt-1">
                  ระบบแจ้งเตือน อสม. และผู้ดูแลของคุณเรียบร้อยแล้ว กรุณานั่งพักและเตรียมรับการติดต่อกลับ
                </p>
              </div>
              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs border border-emerald-200">
                หากเป็นภาวะวิกฤติรุนแรง กรุณาโทร <span className="font-bold text-emerald-900 text-sm">1669</span> สายด่วนกู้ชีพทันที
              </div>
              <button
                onClick={handleClose}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
              >
                รับทราบ และ ปิดหน้านี้
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
