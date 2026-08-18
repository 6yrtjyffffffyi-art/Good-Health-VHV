import React from 'react';
import { useApp } from '../../context/AppContext';
import { Smartphone, Tablet, Monitor, CheckCircle2 } from 'lucide-react';
import { DeviceType } from '../../types';

interface DeviceSelectionModalProps {
  onConfirm: () => void;
  isModal?: boolean;
}

export const DeviceSelectionModal: React.FC<DeviceSelectionModalProps> = ({ onConfirm, isModal = false }) => {
  const { deviceType, setDeviceType } = useApp();

  const options: { id: DeviceType; title: string; desc: string; icon: any }[] = [
    {
      id: 'phone',
      title: 'โทรศัพท์มือถือ',
      desc: 'รูปแบบแนวตั้ง เหมาะสำหรับสมาร์ตโฟน',
      icon: Smartphone,
    },
    {
      id: 'tablet',
      title: 'iPad / Tablet',
      desc: 'หน้าจอกว้างปานกลาง พร้อมแถบเมนูด้านบน',
      icon: Tablet,
    },
    {
      id: 'desktop',
      title: 'คอมพิวเตอร์ / แล็ปท็อป',
      desc: 'หน้าจอกว้าง มีแถบเมนูสีน้ำเงินด้านข้าง',
      icon: Monitor,
    },
  ];

  const content = (
    <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 animate-in fade-in zoom-in duration-200">
      <div className="text-center space-y-2">
        <span className="px-3.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full inline-block">
          ตั้งค่าอุปกรณ์การใช้งาน
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          คุณใช้อุปกรณ์อะไร?
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
          เลือกอุปกรณ์ที่คุณกำลังใช้งาน เพื่อให้ระบบแสดงผลหน้าจอและเมนูที่เหมาะสมกับคุณที่สุด (สามารถเปลี่ยนได้ตลอดในข้อมูลส่วนตัว)
        </p>
      </div>

      <div className="space-y-3">
        {options.map(opt => {
          const Icon = opt.icon;
          const isSelected = deviceType === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => setDeviceType(opt.id)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                isSelected
                  ? 'border-blue-700 bg-blue-50/70 ring-2 ring-blue-200 shadow-sm'
                  : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                  isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base">{opt.title}</h3>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-700" />}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{opt.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onConfirm}
        className="w-full py-4 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold rounded-2xl text-base shadow-lg shadow-blue-200 transition-all cursor-pointer"
      >
        ยืนยันและเริ่มใช้งาน
      </button>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 sm:p-6 w-full max-w-lg mx-auto">
      {content}
    </div>
  );
};

