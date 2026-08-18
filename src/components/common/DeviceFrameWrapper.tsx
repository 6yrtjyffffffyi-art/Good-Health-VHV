import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Users,
  Activity,
  Megaphone,
  MapPin,
  User,
  HeartHandshake,
  FileSpreadsheet,
  ClipboardList,
  Map
} from 'lucide-react';

interface DeviceFrameWrapperProps {
  children: React.ReactNode;
}

export const DeviceFrameWrapper: React.FC<DeviceFrameWrapperProps> = ({ children }) => {
  const { deviceType, fontSize, activeTab, setActiveTab, currentUser } = useApp();

  // Dynamic Font Size Class calculation
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small':
        return 'text-xs scale-font-sm';
      case 'large':
        return 'text-base scale-font-large';
      case 'extralarge':
        return 'text-lg scale-font-xl';
      default:
        return 'text-sm scale-font-normal';
    }
  };

  // Nav items based on user role
  const getNavItems = () => {
    if (!currentUser) return [];

    if (currentUser.role === 'PATIENT') {
      return [
        { id: 'dashboard', label: 'หน้าหลัก (6 เมนู)', icon: Home },
        { id: 'health', label: 'ข้อมูลสุขภาพ', icon: Activity },
        { id: 'hospitals', label: 'สถานพยาบาล', icon: MapPin },
        { id: 'announcements', label: 'ข่าวสารชุมชน', icon: Megaphone },
        { id: 'profile', label: 'โปรไฟล์', icon: User },
      ];
    } else if (currentUser.role === 'CAREGIVER') {
      return [
        { id: 'dashboard', label: 'หน้าหลักผู้ดูแล', icon: Home },
        { id: 'patients', label: 'ผู้สูงอายุที่ดูแล', icon: Users },
        { id: 'hospitals', label: 'สถานพยาบาล', icon: MapPin },
        { id: 'announcements', label: 'ประกาศชุมชน', icon: Megaphone },
        { id: 'profile', label: 'โปรไฟล์', icon: User },
      ];
    } else {
      // VHV (อสม.)
      return [
        { id: 'dashboard', label: 'หน้าหลัก อสม.', icon: Home },
        { id: 'queue', label: 'คิวตรวจวันนี้', icon: ClipboardList },
        { id: 'elderly', label: 'ผู้สูงอายุในเขต', icon: HeartHandshake },
        { id: 'gis_map', label: 'แผนที่ปักหมุด GPS', icon: Map },
        { id: 'reports', label: 'ออกรายงาน', icon: FileSpreadsheet },
        { id: 'announcements', label: 'สร้างประกาศ', icon: Megaphone },
        { id: 'profile', label: 'โปรไฟล์', icon: User },
      ];
    }
  };

  // Role Theme Color Scheme
  const getRoleTheme = () => {
    if (!currentUser) {
      return {
        sidebarBg: 'bg-blue-800',
        activeBtn: 'bg-white text-blue-900',
        badgeBg: 'bg-blue-900/60 text-blue-100 border-blue-400/30',
        topScrollActive: 'bg-blue-700 text-white shadow-md',
        phoneActive: 'text-blue-700 bg-blue-50',
      };
    }

    if (currentUser.role === 'PATIENT') {
      return {
        sidebarBg: 'bg-gradient-to-b from-emerald-700 to-teal-800',
        activeBtn: 'bg-white text-emerald-950 font-black',
        badgeBg: 'bg-emerald-900/60 text-emerald-100 border-emerald-400/30',
        topScrollActive: 'bg-emerald-700 text-white shadow-md',
        phoneActive: 'text-emerald-700 bg-emerald-50',
      };
    }

    if (currentUser.role === 'CAREGIVER') {
      return {
        sidebarBg: 'bg-gradient-to-b from-indigo-800 via-purple-900 to-slate-900',
        activeBtn: 'bg-white text-indigo-950 font-black',
        badgeBg: 'bg-indigo-900/60 text-indigo-100 border-indigo-400/30',
        topScrollActive: 'bg-indigo-700 text-white shadow-md',
        phoneActive: 'text-indigo-700 bg-indigo-50',
      };
    }

    // VHV
    return {
      sidebarBg: 'bg-gradient-to-b from-blue-800 via-sky-900 to-slate-900',
      activeBtn: 'bg-white text-blue-950 font-black',
      badgeBg: 'bg-blue-900/60 text-blue-100 border-blue-400/30',
      topScrollActive: 'bg-blue-700 text-white shadow-md',
      phoneActive: 'text-blue-700 bg-blue-50',
    };
  };

  const navItems = getNavItems();
  const theme = getRoleTheme();

  // Top Horizontal Scrolling Category Navigation Bar
  const renderTopCategoryBar = () => {
    if (!currentUser) return null;

    return (
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs font-black text-slate-400 shrink-0 hidden sm:inline mr-1">
            หมวดหมู่:
          </span>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                  isActive
                    ? `${theme.topScrollActive} border-transparent scale-102`
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // PHONE MODE
  if (deviceType === 'phone') {
    return (
      <div className={`min-h-screen bg-slate-100 pb-24 ${getFontSizeClass()}`}>
        <div className="max-w-md mx-auto bg-slate-50 min-h-screen shadow-xl border-x border-slate-200 flex flex-col">
          {renderTopCategoryBar()}
          <main className="flex-1 p-4">{children}</main>

          {/* Bottom Nav Bar */}
          {currentUser && (
            <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 px-2 py-2 flex justify-around items-center z-30 shadow-lg">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-1 rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? `${theme.phoneActive} font-black scale-105`
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-1 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                    <span className="text-[10px] sm:text-[11px] leading-tight text-center truncate max-w-[64px]">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      </div>
    );
  }

  // TABLET MODE
  if (deviceType === 'tablet') {
    return (
      <div className={`min-h-screen bg-slate-100 flex flex-col ${getFontSizeClass()}`}>
        {renderTopCategoryBar()}
        <main className="flex-1 max-w-5xl w-full mx-auto p-6">{children}</main>
      </div>
    );
  }

  // DESKTOP MODE
  return (
    <div className={`flex min-h-screen w-full bg-slate-50 font-sans text-slate-800 overflow-x-hidden ${getFontSizeClass()}`}>
      {/* Role-Themed Sidebar */}
      {currentUser && (
        <aside className={`w-64 ${theme.sidebarBg} text-white shrink-0 min-h-screen p-6 flex flex-col justify-between shadow-xl sticky top-0 h-screen`}>
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-black flex items-center gap-2">
                <span className="p-2 bg-white rounded-xl shadow-xs text-slate-900 flex items-center justify-center">
                  ❤️
                </span>
                Com-Health
              </h1>
              <div className={`mt-3 rounded-full px-3.5 py-1 text-xs border inline-block font-extrabold ${theme.badgeBg}`}>
                {currentUser.role === 'PATIENT' ? 'บทบาท: ผู้สูงอายุ' : currentUser.role === 'CAREGIVER' ? 'บทบาท: ผู้ดูแล/ญาติ' : 'บทบาท: อสม. ชุมชน'}
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-2">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                      isActive
                        ? `${theme.activeBtn} shadow-md scale-102`
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Emergency helpline footer */}
          <div className="pt-4 border-t border-white/20 space-y-2 text-xs opacity-95">
            <div className="p-3 bg-black/20 rounded-2xl space-y-1">
              <p className="font-bold text-amber-300">สายด่วนช่วยเหลือด่วน</p>
              <p className="text-[11px]">🚑 กู้ชีพฉุกเฉิน: 1669</p>
              <p className="text-[11px]">🛡️ สปสช. บัตรทอง: 1330</p>
            </div>
          </div>
        </aside>
      )}

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-h-screen min-w-0 overflow-y-auto">
        {renderTopCategoryBar()}
        <section className="flex-1 p-6 sm:p-8">{children}</section>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 shrink-0 gap-2">
          <div className="flex gap-4 font-semibold">
            <span className="hover:text-slate-600 cursor-pointer">ศูนย์ช่วยเหลือ</span>
            <span className="hover:text-slate-600 cursor-pointer">คู่มือการใช้งาน</span>
            <span className="hover:text-slate-600 cursor-pointer">สิทธิ สปสช. บัตรทอง</span>
          </div>
          <div>Com-Health v1.2 • พัฒนาเพื่อการดูแลสุขภาพผู้สูงอายุในชุมชน</div>
        </footer>
      </main>
    </div>
  );
};
