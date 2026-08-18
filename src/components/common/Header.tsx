import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HeartPulse,
  Bell,
  LogOut,
  User,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  Volume2,
  VolumeX,
  BookOpen
} from 'lucide-react';
import { SosModal } from './SosModal';
import { NotificationDrawer } from './NotificationDrawer';

export const Header: React.FC = () => {
  const {
    currentUser,
    fontSize,
    setFontSize,
    notifications,
    logout,
    sosAlerts,
    voiceReaderEnabled,
    setVoiceReaderEnabled,
    openUserGuide,
    showToast
  } = useApp();

  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const unreadCount = currentUser
    ? notifications.filter(n => n.userId === currentUser.id && !n.read).length
    : 0;

  const activeSosCount = sosAlerts.filter(s => s.status === 'ACTIVE').length;

  const getRoleTheme = () => {
    if (!currentUser) return { badgeBg: 'bg-slate-100 text-slate-700', brandBorder: 'border-blue-500' };
    switch (currentUser.role) {
      case 'PATIENT':
        return {
          badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          roleTitle: 'ผู้สูงอายุ / ผู้รับบริการ',
          icon: UserCheck,
          accentColor: 'text-emerald-700',
          accentBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          subBar: 'bg-emerald-600',
        };
      case 'CAREGIVER':
        return {
          badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-300',
          roleTitle: 'ผู้ดูแล / ญาติ',
          icon: ShieldCheck,
          accentColor: 'text-indigo-700',
          accentBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          subBar: 'bg-indigo-600',
        };
      case 'VHV':
        return {
          badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
          roleTitle: 'อสม. ชุมชน',
          icon: ShieldAlert,
          accentColor: 'text-blue-700',
          accentBg: 'bg-blue-50 text-blue-700 border-blue-200',
          subBar: 'bg-blue-600',
        };
      default:
        return {
          badgeBg: 'bg-slate-100 text-slate-700 border-slate-300',
          roleTitle: 'ผู้ใช้งาน',
          icon: User,
          accentColor: 'text-blue-700',
          accentBg: 'bg-blue-50 text-blue-700 border-blue-200',
          subBar: 'bg-blue-600',
        };
    }
  };

  const roleTheme = getRoleTheme();
  const RoleIcon = roleTheme.icon;

  return (
    <>
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3 shrink-0 sticky top-0 z-40 shadow-xs">
        <div className="flex items-center justify-between w-full">
          {/* Left Brand & Role Identification */}
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 border rounded-2xl flex items-center justify-center font-bold shadow-xs ${roleTheme.accentBg}`}>
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-black text-slate-900 text-base sm:text-lg tracking-tight">
                  Good Health VHV
                </h1>
                {currentUser && (
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${roleTheme.badgeBg}`}>
                    <RoleIcon className="w-3.5 h-3.5" />
                    {roleTheme.roleTitle}
                  </span>
                )}
              </div>
              {currentUser && (
                <p className="text-xs text-slate-600 font-medium hidden sm:block">
                  คุณ <span className="font-bold text-slate-900">{currentUser.firstName} {currentUser.lastName}</span> ({currentUser.phone})
                </p>
              )}
            </div>
          </div>

          {/* Right Controls Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Font Resizing Controls: ก- / ก / ก+ / ก++ */}
            <div className="flex items-center gap-0.5 bg-slate-100 border border-slate-200 rounded-2xl p-1 shadow-2xs">
              <span className="text-[11px] font-extrabold text-slate-500 px-1 hidden md:inline">ขนาด:</span>
              <button
                onClick={() => setFontSize('small')}
                className={`px-2 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  fontSize === 'small'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-white'
                }`}
                title="ลดขนาดตัวอักษร (ก-)"
              >
                ก-
              </button>
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2.5 py-1 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  fontSize === 'normal'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-white'
                }`}
                title="ขนาดตัวอักษรมาตรฐาน (ก)"
              >
                ก
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2.5 py-1 text-base font-bold rounded-xl transition-all cursor-pointer ${
                  fontSize === 'large'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-white'
                }`}
                title="เพิ่มขนาดตัวอักษรใหญ่ (ก+)"
              >
                ก+
              </button>
              <button
                onClick={() => setFontSize('extralarge')}
                className={`px-3 py-1 text-lg font-extrabold rounded-xl transition-all cursor-pointer ${
                  fontSize === 'extralarge'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-white'
                }`}
                title="ขยายขนาดตัวอักษรใหญ่พิเศษ (ก++)"
              >
                ก++
              </button>
            </div>

            {/* Voice Reader Toggle Button */}
            <button
              onClick={() => {
                const nextState = !voiceReaderEnabled;
                setVoiceReaderEnabled(nextState);
                showToast(nextState ? '🔊 เปิดปุ่มเสียงอ่านข้อความแล้ว' : '🔇 ปิดปุ่มเสียงอ่านข้อความแล้ว');
              }}
              className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer shadow-xs ${
                voiceReaderEnabled
                  ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                  : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200 hover:text-slate-700'
              }`}
              title={voiceReaderEnabled ? 'เปิดโหมดอ่านออกเสียงอยู่ (แตะเพื่อปิด)' : 'ปิดโหมดอ่านออกเสียง (แตะเพื่อเปิด)'}
            >
              {voiceReaderEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-amber-600 animate-pulse" />
                  <span className="hidden sm:inline">อ่านเสียง: <strong className="text-emerald-700">เปิด</strong></span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span className="hidden sm:inline">อ่านเสียง: <strong>ปิด</strong></span>
                </>
              )}
            </button>

            {/* User Guide Button */}
            <button
              onClick={() => openUserGuide()}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="คู่มือการใช้งานระบบสำหรับแต่ละบทบาท"
            >
              <BookOpen className="w-4 h-4 text-indigo-700" />
              <span className="hidden lg:inline">คู่มือการใช้</span>
            </button>

            {/* SOS Alert Button */}
            <button
              onClick={() => setIsSosOpen(true)}
              className="relative px-3 py-2 sm:px-4 sm:py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-md shadow-rose-200 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 animate-bounce" />
              <span>SOS</span>
              {activeSosCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full animate-pulse border border-white">
                  {activeSosCount}
                </span>
              )}
            </button>

            {/* Notifications */}
            {currentUser && (
              <div
                onClick={() => setIsNotifOpen(true)}
                className="relative cursor-pointer group"
                title="การแจ้งเตือน"
              >
                <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-slate-200 transition-colors text-slate-700 border border-slate-200">
                  <Bell className="w-5 h-5" />
                </div>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-white rounded-full text-[10px] text-white font-black flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
            )}

            {/* Logout Button */}
            {currentUser && (
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="p-2 sm:px-3 sm:py-2 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-2xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer border border-slate-200 hover:border-rose-300"
                title="ออกจากระบบ"
              >
                <LogOut className="w-4 h-4 text-slate-500 group-hover:text-rose-600" />
                <span className="hidden sm:inline">ออก</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* SOS Modal */}
      <SosModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />

      {/* Notifications Drawer */}
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />

      {/* Logout Confirmation Dialog */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border-2 border-slate-200">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-900">ออกจากระบบ?</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                ข้อมูลสุขภาพ ประวัติการตรวจ และยาประจำตัวของคุณถูกบันทึกไว้อย่างปลอดภัยในระบบ
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  logout();
                }}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl text-sm transition-colors cursor-pointer shadow-md shadow-rose-100"
              >
                ออกจากระบบ
              </button>
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
