import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, X, Check, Trash2, Calendar, AlertTriangle, ShieldCheck, Info } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, currentUser, markNotificationRead, clearAllNotifications } = useApp();

  if (!isOpen) return null;

  const userNotifs = currentUser
    ? notifications.filter(n => n.userId === currentUser.id)
    : [];

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'SOS':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'APPOINTMENT':
        return <Calendar className="w-5 h-5 text-teal-600" />;
      case 'ANNOUNCEMENT':
        return <ShieldCheck className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-100 text-teal-700 rounded-xl">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">ศูนย์การแจ้งเตือน</h3>
              <p className="text-xs text-slate-500">การแจ้งเตือนนัดหมาย ประกาศข่าว และ SOS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        {userNotifs.length > 0 && (
          <div className="px-4 py-2 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>การแจ้งเตือนทั้งหมด ({userNotifs.length})</span>
            <button
              onClick={clearAllNotifications}
              className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              ล้างทั้งหมด
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {userNotifs.length === 0 ? (
            <div className="text-center py-16 px-4 text-slate-400 space-y-3">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Bell className="w-8 h-8" />
              </div>
              <p className="font-semibold text-slate-600 text-sm">ยังไม่มีรายการแจ้งเตือน</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                เมื่อมีข่าวนัดหมายใหม่ ประกาศ อสม. หรือสัญญาณ SOS รายการจะแสดงที่นี่
              </p>
            </div>
          ) : (
            userNotifs.map(n => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  n.read
                    ? 'bg-slate-50 border-slate-200 text-slate-600'
                    : 'bg-white border-teal-200 shadow-sm text-slate-900 ring-1 ring-teal-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-xl shrink-0 mt-0.5">
                    {getNotifIcon(n.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900">{n.title}</h4>
                      {!n.read && (
                        <span className="w-2 h-2 bg-teal-600 rounded-full shrink-0" />
                      )}
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600">{n.message}</p>
                    <span className="text-[10px] text-slate-400 block pt-1">
                      {new Date(n.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
