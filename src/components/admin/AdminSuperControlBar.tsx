import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Gem, 
  ShieldAlert, 
  UserCheck, 
  ShieldCheck, 
  Settings, 
  Sparkles, 
  ArrowRight,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { Role } from '../../types';

interface AdminSuperControlBarProps {
  onOpenAdminManager?: () => void;
}

export const AdminSuperControlBar: React.FC<AdminSuperControlBarProps> = ({ onOpenAdminManager }) => {
  const { 
    currentUser, 
    isAdminMode, 
    adminData, 
    switchAdminRole, 
    returnToAdminSystem 
  } = useApp();

  if (!isAdminMode && !currentUser?.isAdmin) return null;

  const currentRole = currentUser?.role || 'VHV';
  const adminRank = adminData?.role || currentUser?.adminRole || 'Diamond';

  const rolesConfig: { role: Role; label: string; icon: string; desc: string; color: string; activeStyle: string }[] = [
    {
      role: 'VHV',
      label: 'อสม. (ควบคุมเต็มระบบ)',
      icon: '🏥',
      desc: 'ดู/แก้ไขข้อมูลผู้สูงอายุทุกคน สัญญาณชีพ คิว แผนที่ GIS รายงาน',
      color: 'blue',
      activeStyle: 'bg-blue-600 text-white shadow-md shadow-blue-500/30 border-blue-400',
    },
    {
      role: 'PATIENT',
      label: 'ผู้สูงอายุ / ผู้ป่วย',
      icon: '👵',
      desc: 'ดู/แก้ไขสัญญาณชีพ สิทธิ สปสช. ยา นัดหมาย อาการ',
      color: 'emerald',
      activeStyle: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30 border-emerald-400',
    },
    {
      role: 'CAREGIVER',
      label: 'ผู้ดูแล / ญาติ',
      icon: '👨‍👩‍👦',
      desc: 'ดู/แก้ไขผู้ป่วยในความดูแล แจ้งเตือนนัดหมาย บันทึกติดตาม',
      color: 'purple',
      activeStyle: 'bg-purple-600 text-white shadow-md shadow-purple-500/30 border-purple-400',
    },
  ];

  return (
    <div className="bg-slate-900 text-white border-b-2 border-amber-400/80 px-4 py-2.5 shadow-lg relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        
        {/* Left: Admin Identity */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white shadow-xs border border-white/20">
            <Gem className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wider">
                {adminRank} ADMIN
              </span>
              <span className="text-xs font-bold text-slate-200">
                โหมดควบคุมและแก้ไข 3 บทบาท
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              สิทธิ์สูงสุด: ดูและแก้ไขข้อมูลได้ทุกมิติเสมือน อสม. และแอดมินกลาง
            </p>
          </div>
        </div>

        {/* Middle: 3-Role Switching Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-2xl border border-slate-700 w-full lg:w-auto overflow-x-auto">
          <span className="text-[10px] font-bold text-slate-400 px-2 shrink-0 hidden sm:inline">
            สลับบทบาท:
          </span>
          {rolesConfig.map((item) => {
            const isActive = currentRole === item.role;
            return (
              <button
                key={item.role}
                type="button"
                onClick={() => switchAdminRole(item.role)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border ${
                  isActive
                    ? item.activeStyle
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60 border-transparent'
                }`}
                title={item.desc}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping ml-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0 w-full lg:w-auto justify-end">
          {onOpenAdminManager && (
            <button
              type="button"
              onClick={onOpenAdminManager}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-xs font-bold text-slate-200 hover:text-white transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="เปิดตารางข้อมูลแอดมิน อนุมัติคำขอ และเพิ่มแอดมินใหม่"
            >
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              <span>จัดการทีมแอดมิน</span>
            </button>
          )}

          <button
            type="button"
            onClick={returnToAdminSystem}
            className="px-3 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
            title="ออกจากโหมดแอดมิน"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>ออก</span>
          </button>
        </div>

      </div>
    </div>
  );
};
