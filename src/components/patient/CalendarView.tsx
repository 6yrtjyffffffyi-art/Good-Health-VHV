import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckSquare,
  Square,
  Clock,
  UserCheck,
  AlertCircle,
  Megaphone,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { AppointmentStatus, VhvPermissionState } from '../../types';
import { Lock } from 'lucide-react';
import { VoiceReaderButton } from '../common/VoiceReaderButton';

interface CalendarViewProps {
  patientId?: string;
  readOnly?: boolean;
  permission?: VhvPermissionState;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ patientId, readOnly, permission }) => {
  const {
    currentPatientProfile,
    announcements,
    todos,
    toggleTodo,
    addTodo,
    appointments,
    createAppointmentRequest,
    allVhvs
  } = useApp();

  const pId = patientId || currentPatientProfile?.id || 'patient-1';
  const isDenied = permission === 'denied' || readOnly;
  const [showPermissionWarning, setShowPermissionWarning] = useState(false);

  const pName = currentPatientProfile?.firstName
    ? `${currentPatientProfile.firstName} ${currentPatientProfile.lastName}`
    : 'คุณสมศรี ใจดี';
  const pPhone = currentPatientProfile?.phone || '0812345678';

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const [showAddTodo, setShowAddTodo] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const [showAppModal, setShowAppModal] = useState(false);
  const [appTime, setAppTime] = useState('09:30');
  const [appSymptoms, setAppSymptoms] = useState('');
  const [appCause, setAppCause] = useState('');
  const [appNotes, setAppNotes] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const monthNamesTH = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleAddTodoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      addTodo(pId, newTodoTitle.trim(), selectedDay);
      setNewTodoTitle('');
      setShowAddTodo(false);
    }
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const defaultVhv = allVhvs[0]?.id || 'vhv-1';
    createAppointmentRequest({
      patientId: pId,
      patientName: pName,
      patientPhone: pPhone,
      vhvId: defaultVhv,
      date: selectedDay,
      time: appTime,
      symptoms: appSymptoms,
      cause: appCause,
      notes: appNotes,
    });
    setShowAppModal(false);
    setAppSymptoms('');
    setAppCause('');
    setAppNotes('');
  };

  // Check if day has VHV announcements
  const dayHasAnnouncement = (dayNum: number) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return announcements.some(a => a.date === formattedDate);
  };

  // Filter day todos & appointments
  const selectedDayTodos = todos.filter(t => t.patientId === pId && t.date === selectedDay);
  const patientAppointments = appointments.filter(a => a.patientId === pId);

  const getStatusBadge = (st: AppointmentStatus) => {
    switch (st) {
      case 'อนุมัติแล้ว':
        return (
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            อสม. อนุมัติแล้ว
          </span>
        );
      case 'ปฏิเสธ':
        return (
          <span className="px-2.5 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full flex items-center gap-1 border border-red-200">
            <XCircle className="w-3.5 h-3.5" />
            คำขอถูกปฏิเสธ
          </span>
        );
      case 'เสนอเวลาใหม่':
        return (
          <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full flex items-center gap-1 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            เสนอเวลาใหม่
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full flex items-center gap-1 border border-slate-200">
            <HelpCircle className="w-3.5 h-3.5" />
            รออนุมัติจาก อสม.
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Top Header matching mockup image */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-1 text-slate-800 hover:text-blue-900 transition-colors"
            title="กลับ"
          >
            <span className="text-2xl font-bold">←</span>
          </button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {pName}
            </h2>
            <div className="text-slate-600 text-xs sm:text-sm font-semibold mt-0.5">
              <span>Community Calendar</span>
            </div>
          </div>
        </div>

        {/* Edit Allowed Badge */}
        <div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            isDenied
              ? 'bg-rose-50 text-rose-700 border border-rose-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isDenied ? 'bg-rose-500' : 'bg-emerald-500'}`} />
            <span>{isDenied ? 'View Only (ดูได้อย่างเดียว)' : 'Edit Allowed'}</span>
          </span>
        </div>
      </div>

      {isDenied && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-800 text-xs font-medium">
          <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold text-amber-900 block mb-0.5">ดูข้อมูลได้อย่างเดียว (Read-Only)</strong>
            คุณสามารถดูข้อมูลได้ แต่ไม่สามารถแก้ไขข้อมูลนี้ เนื่องจากเจ้าของข้อมูลยังไม่ได้อนุญาต
          </div>
        </div>
      )}

      {/* Calendar Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200 space-y-4">
        {/* Calendar Month Selector */}
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-lg text-slate-900">
            {monthNamesTH[month]} {year + 543}
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-slate-600"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-slate-600"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Day Headers S M T W T F S */}
        <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 py-1">
          <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold">
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isSelected = selectedDay === formattedDate;
            const hasApp = appointments.some(a => a.date === formattedDate);

            return (
              <button
                key={dayNum}
                onClick={() => setSelectedDay(formattedDate)}
                className={`py-2 rounded-2xl transition-all cursor-pointer flex flex-col items-center justify-center relative ${
                  isSelected
                    ? 'bg-[#0f3d69] text-white shadow-md font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{dayNum}</span>
                {hasApp && (
                  <span
                    className={`w-1 h-1 rounded-full mt-0.5 ${
                      isSelected ? 'bg-amber-300' : 'bg-[#0f3d69]'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Appointments Section with + Add Button */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              {new Date(selectedDay).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} ({new Date(selectedDay).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })})
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {appointments.filter(a => a.date === selectedDay).length} Appointments
            </p>
          </div>

          {!isDenied && (
            <button
              onClick={() => setShowAppModal(true)}
              className="px-4 py-1.5 bg-[#0f3d69] hover:bg-[#0c2f55] text-white text-xs font-bold rounded-full shadow-xs flex items-center gap-1 cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add</span>
            </button>
          )}
        </div>

        {/* Appointments List for Day matching Mockup */}
        <div className="space-y-3">
          {appointments.filter(a => a.date === selectedDay).length === 0 ? (
            <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
              ไม่มีการนัดหมายในวันนี้ • กดปุ่ม "+ Add" เพื่อสร้างคำขอนัดหมาย อสม.
            </div>
          ) : (
            appointments.filter(a => a.date === selectedDay).map((app) => {
              const timeParts = app.time.split(':');
              const hourNum = parseInt(timeParts[0] || '9', 10);
              const isPM = hourNum >= 12;
              const formattedPeriod = isPM ? 'PM' : 'AM';

              return (
                <div
                  key={app.id}
                  className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-4 hover:shadow-md transition-all"
                >
                  {/* Left Column: Time */}
                  <div className="text-center pr-3 border-r border-slate-100 shrink-0 min-w-[65px]">
                    <div className="text-sm sm:text-base font-extrabold text-slate-900">
                      {app.time}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      {formattedPeriod}
                    </div>
                  </div>

                  {/* Middle Column: Title & Clinic Location */}
                  <div className="space-y-1 flex-1">
                    <h4 className="font-bold text-sm sm:text-base text-slate-900">
                      {app.cause || 'Checkup at Health Center (ตรวจสุขภาพ)'}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <span>📍</span>
                      <span>{app.notes || 'District Clinic 4 (รพ.สต.)'}</span>
                    </p>
                  </div>

                  {/* Right Column: Status / Action */}
                  <div className="shrink-0">
                    {getStatusBadge(app.status)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Appointment Requests List */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-lg text-slate-900">
            ประวัติคำขอนัดหมายถึง อสม. (Appointment Requests)
          </h3>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {patientAppointments.length} รายการ
          </span>
        </div>

        {patientAppointments.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            ยังไม่มีคำขอนัดหมาย สามารถกดปุ่ม "+ สร้างคำขอนัดหมาย อสม." ด้านบนได้ครับ
          </div>
        ) : (
          <div className="space-y-4">
            {patientAppointments.map((app, idx) => {
              const borderColors = ['border-l-blue-600', 'border-l-emerald-600', 'border-l-amber-600', 'border-l-purple-600'];
              const borderColor = borderColors[idx % borderColors.length];

              return (
                <div
                  key={app.id}
                  className={`p-5 bg-white rounded-3xl border border-slate-200 border-l-[6px] ${borderColor} shadow-xs space-y-3 hover:shadow-md transition-all`}
                >
                  {/* Outside: Date & Status Badge */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="space-y-0.5">
                      <h4 className="font-black text-base sm:text-lg text-slate-900">
                        {new Date(app.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </h4>
                      <p className="text-xs text-slate-500">
                        วัตถุประสงค์: <strong className="text-slate-800 font-bold">{app.cause || 'ตรวจติดตามสุขภาพ'}</strong>
                      </p>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>

                  {/* Inside: Sequential Details */}
                  <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-bold text-slate-900">เวลานัดหมาย:</span>
                      <span className="text-slate-700 font-semibold">{app.time} น.</span>
                    </div>

                    {app.symptoms && (
                      <div className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <p>
                          <span className="font-bold text-slate-900">อาการที่พบ:</span> {app.symptoms}
                        </p>
                      </div>
                    )}

                    {app.proposedTime && (
                      <div className="text-amber-900 font-bold bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs">
                        💡 อสม. เสนอเวลาใหม่เป็น: {app.proposedTime} น.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Appointment Creation Modal */}
      {showAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
              สร้างคำขอนัดหมายถึง อสม.
            </h3>

            <form onSubmit={handleCreateAppointment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">วันที่ต้องการนัดหมาย</label>
                <input
                  type="date"
                  required
                  value={selectedDay}
                  onChange={e => setSelectedDay(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">เวลา</label>
                <input
                  type="time"
                  required
                  value={appTime}
                  onChange={e => setAppTime(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">อาการสำคัญ</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น เวียนศีรษะ วัดความดันสูง"
                  value={appSymptoms}
                  onChange={e => setAppSymptoms(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">สาเหตุ</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ต้องการตรวจเจาะเลือดปลายนิ้ว หรือเยี่ยมบ้าน"
                  value={appCause}
                  onChange={e => setAppCause(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">หมายเหตุ</label>
                <textarea
                  rows={2}
                  placeholder="สถานที่หรือรายละเอียดเพิ่มเติม"
                  value={appNotes}
                  onChange={e => setAppNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md"
                >
                  ส่งคำขอนัดหมาย
                </button>
                <button
                  type="button"
                  onClick={() => setShowAppModal(false)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permission Warning Dialog */}
      {showPermissionWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-200 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">ไม่สามารถแก้ไขข้อมูลได้</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                กรุณาขออนุญาตจากผู้ป่วยหรือผู้ดูแลก่อน
              </p>
            </div>
            <button
              onClick={() => setShowPermissionWarning(false)}
              className="w-full py-2.5 bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              รับทราบ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
