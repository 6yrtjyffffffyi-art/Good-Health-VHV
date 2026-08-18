import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Navigation, ShieldCheck } from 'lucide-react';

interface LocationPermissionModalProps {
  onComplete?: () => void;
  onAllow?: () => void;
  onAllowOnce?: () => void;
  onDeny?: () => void;
}

export const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
  onComplete,
  onAllow,
  onAllowOnce,
  onDeny,
}) => {
  const { setLocationPermission } = useApp();

  const handleSelect = (choice: 'granted' | 'granted_once' | 'denied') => {
    setLocationPermission(choice);

    if (choice === 'granted' || choice === 'granted_once') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          () => {},
          () => {}
        );
      }
    }

    if (choice === 'granted') onAllow?.();
    if (choice === 'granted_once') onAllowOnce?.();
    if (choice === 'denied') onDeny?.();
    onComplete?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-center space-y-6 border border-slate-200">
        <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-teal-100">
          <MapPin className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-full">
            การเข้าถึงตำแหน่ง GPS
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            อนุญาตให้แอปเข้าถึงตำแหน่งของคุณหรือไม่?
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
            ใช้สำหรับการค้นหาสถานพยาบาลใกล้บ้าน และส่งตำแหน่งพิกัดฉุกเฉินเมื่อกดปุ่ม SOS ถึง อสม. และญาติ
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={() => handleSelect('granted')}
            className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl text-sm shadow-md shadow-teal-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            1. อนุญาต
          </button>

          <button
            onClick={() => handleSelect('granted_once')}
            className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            2. เฉพาะครั้งนี้
          </button>

          <button
            onClick={() => handleSelect('denied')}
            className="w-full py-3.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 font-semibold rounded-2xl text-sm transition-colors cursor-pointer"
          >
            3. ไม่อนุญาต
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          * หากเลือกไม่อนุญาต แอปยังคงใช้งานฟังก์ชันอื่นได้ตามปกติ แต่ฟังก์ชัน Location/SOS จะแสดงคำเตือน
        </p>
      </div>
    </div>
  );
};
