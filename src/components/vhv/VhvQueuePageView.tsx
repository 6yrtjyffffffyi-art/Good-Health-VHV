import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppointmentRequest, AppointmentStatus } from '../../types';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  XCircle,
  User,
  Phone,
  Calendar,
  AlertCircle,
  Search,
  Filter,
  Eye,
  Check,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { formatAddress } from '../../utils/addressUtils';
import { VoiceReaderButton } from '../common/VoiceReaderButton';

export const VhvQueuePageView: React.FC = () => {
  const {
    currentUser,
    currentVhvProfile,
    appointments,
    updateAppointmentStatus,
    allPatients,
    showToast
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<'ALL' | AppointmentStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppForDetail, setSelectedAppForDetail] = useState<AppointmentRequest | null>(null);
  const [selectedAppForReschedule, setSelectedAppForReschedule] = useState<AppointmentRequest | null>(null);
  const [proposedTime, setProposedTime] = useState('10:30');
  const [proposedDate, setProposedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const vhvName = currentVhvProfile
    ? `${currentVhvProfile.firstName} ${currentVhvProfile.lastName}`
    : currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : 'อสม.';

  // Filter appointments
  const filteredAppointments = appointments.filter(app => {
    const matchStatus = filterStatus === 'ALL' || app.status === filterStatus;
    const matchQuery =
      searchQuery.trim() === '' ||
      app.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.patientPhone.includes(searchQuery) ||
      app.symptoms.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchQuery;
  });

  const pendingCount = appointments.filter(a => a.status === 'รอตรวจสอบ').length;
  const approvedCount = appointments.filter(a => a.status === 'อนุมัติแล้ว').length;
  const proposedCount = appointments.filter(a => a.status === 'เสนอเวลาใหม่').length;
  const rejectedCount = appointments.filter(a => a.status === 'ปฏิเสธ').length;

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'รอตรวจสอบ':
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            รอตรวจสอบ
          </span>
        );
      case 'อนุมัติแล้ว':
        return (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            อนุมัติแล้ว
          </span>
        );
      case 'เสนอเวลาใหม่':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 border border-blue-300 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            เสนอเวลาใหม่
          </span>
        );
      case 'ปฏิเสธ':
        return (
          <span className="px-3 py-1 bg-rose-100 text-rose-800 border border-rose-300 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            ปฏิเสธ
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-100/50 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-white/15 border border-white/20 text-white backdrop-blur-xs">
            <ClipboardList className="w-4 h-4 text-purple-300" />
            <span>ระบบคิวตรวจสุขภาพชุมชน</span>
          </div>
          <span className="text-xs text-blue-200 font-medium">
            ผู้ปฏิบัติงาน: อสม. {vhvName}
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            คิวตรวจวันนี้ & คำขอนัดหมาย
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 opacity-90 max-w-2xl">
            รายชื่อผู้สูงอายุที่ส่งคำขอนัดตรวจสุขภาพหรือติดตามอาการ อสม. สามารถตรวจสอบความเร่งด่วน อนุมัตินัดหมาย หรือเสนอเวลาที่สะดวกได้ทันที
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
              filterStatus === 'ALL'
                ? 'bg-white text-blue-950 border-white font-bold shadow-md'
                : 'bg-white/10 text-white border-white/15 hover:bg-white/20'
            }`}
          >
            <span className="text-xs block opacity-80">คำขอทั้งหมด</span>
            <span className="text-xl font-extrabold">{appointments.length}</span>
          </button>

          <button
            onClick={() => setFilterStatus('รอตรวจสอบ')}
            className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
              filterStatus === 'รอตรวจสอบ'
                ? 'bg-amber-400 text-amber-950 border-amber-400 font-bold shadow-md'
                : 'bg-amber-500/20 text-amber-200 border-amber-400/30 hover:bg-amber-500/30'
            }`}
          >
            <span className="text-xs block opacity-90">รอตรวจสอบใหม่</span>
            <span className="text-xl font-extrabold">{pendingCount}</span>
          </button>

          <button
            onClick={() => setFilterStatus('อนุมัติแล้ว')}
            className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
              filterStatus === 'อนุมัติแล้ว'
                ? 'bg-emerald-400 text-emerald-950 border-emerald-400 font-bold shadow-md'
                : 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30 hover:bg-emerald-500/30'
            }`}
          >
            <span className="text-xs block opacity-90">อนุมัติแล้ว</span>
            <span className="text-xl font-extrabold">{approvedCount}</span>
          </button>

          <button
            onClick={() => setFilterStatus('เสนอเวลาใหม่')}
            className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
              filterStatus === 'เสนอเวลาใหม่'
                ? 'bg-blue-300 text-blue-950 border-blue-300 font-bold shadow-md'
                : 'bg-blue-400/20 text-blue-100 border-blue-300/30 hover:bg-blue-400/30'
            }`}
          >
            <span className="text-xs block opacity-90">เสนอเวลาใหม่</span>
            <span className="text-xl font-extrabold">{proposedCount}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อผู้สูงอายุ, เบอร์โทร, อาการ..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {(['ALL', 'รอตรวจสอบ', 'อนุมัติแล้ว', 'เสนอเวลาใหม่', 'ปฏิเสธ'] as const).map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'ทั้งหมด' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-6 bg-purple-600 rounded-full inline-block" />
            รายชื่อผู้ขอนัดหมายตรวจ ({filteredAppointments.length} รายการ)
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            เรียงตามลำดับเวลาล่าสุด
          </span>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <ClipboardList className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">ไม่พบคิวนัดหมายที่ตรงกับเงื่อนไข</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              เมื่อมีผู้สูงอายุหรือผู้ดูแลส่งคำขอนัดตรวจสุขภาพเข้ามา รายการคำขอจะปรากฏในหน้านี้โดยอัตโนมัติ
            </p>
            {filterStatus !== 'ALL' && (
              <button
                onClick={() => setFilterStatus('ALL')}
                className="mt-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-xl text-xs cursor-pointer"
              >
                ดูคำขอทั้งหมด
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredAppointments.map(app => {
              const matchedPatient = allPatients.find(p => p.id === app.patientId);
              return (
                <div
                  key={app.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all space-y-4"
                >
                  {/* Top Row: Patient Info + Status */}
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                        {app.patientName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base">
                            {app.patientName}
                          </h3>
                          <span className="text-xs text-slate-500 font-medium">
                            ({matchedPatient?.age || 70} ปี)
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {app.patientPhone}
                          </span>
                          {matchedPatient && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {formatAddress(matchedPatient.address)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>{getStatusBadge(app.status)}</div>
                  </div>

                  {/* Middle Row: Request Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60 text-xs">
                    <div>
                      <span className="font-bold text-slate-500 block mb-0.5">วันและเวลาที่ขอนัด:</span>
                      <span className="font-bold text-blue-900 flex items-center gap-1.5 text-sm">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        {app.date} • {app.time} น.
                      </span>
                    </div>

                    <div>
                      <span className="font-bold text-slate-500 block mb-0.5">อาการสำคัญ:</span>
                      <span className="font-medium text-slate-800">
                        {app.symptoms || 'ตรวจวัดความดันโลหิตและสัญญาณชีพประจำรอบ'}
                      </span>
                    </div>

                    <div>
                      <span className="font-bold text-slate-500 block mb-0.5">สาเหตุที่ขอนัด:</span>
                      <span className="font-medium text-slate-800">
                        {app.cause || 'ติดตามอาการตามรอบนัดหมายของ อสม.'}
                      </span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedAppForDetail(app)}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Eye className="w-4 h-4 text-slate-500" />
                        <span>ดูรายละเอียดแบบเต็ม</span>
                      </button>

                      <VoiceReaderButton
                        textToRead={`คิวนัดหมายของคุณ${app.patientName} วันที่ ${app.date} เวลา ${app.time} น. อาการ: ${app.symptoms || 'ตรวจวัดความดันโลหิต'} สาเหตุ: ${app.cause || 'ตรวจประจำรอบ'} สถานะ: ${app.status}`}
                        label="ฟังรายละเอียดคิว"
                        size="sm"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {app.status !== 'อนุมัติแล้ว' && (
                        <button
                          onClick={() => {
                            updateAppointmentStatus(app.id, 'อนุมัติแล้ว');
                            showToast(`อนุมัติคำขอนัดของ ${app.patientName} เรียบร้อยแล้ว`);
                          }}
                          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>อนุมัตินัดหมาย</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedAppForReschedule(app);
                          setProposedTime(app.time || '10:30');
                        }}
                        className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <Clock className="w-4 h-4" />
                        <span>เสนอเวลาใหม่</span>
                      </button>

                      {app.status !== 'ปฏิเสธ' && (
                        <button
                          onClick={() => {
                            updateAppointmentStatus(app.id, 'ปฏิเสธ');
                            showToast(`ปฏิเสธคำขอนัดหมายแล้ว`);
                          }}
                          className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>ปฏิเสธ</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedAppForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-purple-600" />
                รายละเอียดคำขอนัดหมายตรวจ
              </h3>
              <button
                onClick={() => setSelectedAppForDetail(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-purple-700 font-bold block">ผู้รับบริการ:</span>
                  <strong className="text-slate-900 text-base">{selectedAppForDetail.patientName}</strong>
                </div>
                <div className="text-right">
                  <span className="text-xs text-purple-700 font-bold block">เบอร์โทรศัพท์:</span>
                  <strong className="text-slate-900">{selectedAppForDetail.patientPhone}</strong>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <p>
                  <strong className="text-slate-900">วันและเวลาที่นัดหมาย:</strong> วันที่{' '}
                  {selectedAppForDetail.date} เวลา {selectedAppForDetail.time} น.
                </p>
                <p>
                  <strong className="text-slate-900">อาการไม่สบาย:</strong>{' '}
                  {selectedAppForDetail.symptoms}
                </p>
                <p>
                  <strong className="text-slate-900">สาเหตุที่ขอนัด:</strong>{' '}
                  {selectedAppForDetail.cause}
                </p>
                <p>
                  <strong className="text-slate-900">สถานะปัจจุบัน:</strong>{' '}
                  {selectedAppForDetail.status}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  updateAppointmentStatus(selectedAppForDetail.id, 'อนุมัติแล้ว');
                  setSelectedAppForDetail(null);
                  showToast('อนุมัตินัดหมายเรียบร้อยแล้ว');
                }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md"
              >
                อนุมัตินัดหมาย
              </button>
              <button
                onClick={() => setSelectedAppForDetail(null)}
                className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {selectedAppForReschedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              เสนอเวลาใหม่สำหรับคิวนัดหมาย
            </h3>

            <p className="text-xs text-slate-600">
              เสนอเวลาใหม่สำหรับผู้ป่วย <strong>{selectedAppForReschedule.patientName}</strong>
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  เลือกเวลาใหม่ที่ อสม. สะดวก
                </label>
                <input
                  type="time"
                  value={proposedTime}
                  onChange={e => setProposedTime(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm text-center"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  updateAppointmentStatus(
                    selectedAppForReschedule.id,
                    'เสนอเวลาใหม่',
                    proposedTime
                  );
                  setSelectedAppForReschedule(null);
                  showToast(
                    `ส่งข้อเสนอเวลาใหม่ (${proposedTime} น.) ให้ ${selectedAppForReschedule.patientName} แล้ว`
                  );
                }}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md"
              >
                ยืนยันเสนอเวลาใหม่
              </button>
              <button
                type="button"
                onClick={() => setSelectedAppForReschedule(null)}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
