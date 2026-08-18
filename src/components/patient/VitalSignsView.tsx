import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  Heart,
  Thermometer,
  Zap,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Filter,
  BarChart3
} from 'lucide-react';
import { VitalSignRecord, VhvPermissionState } from '../../types';
import { Lock } from 'lucide-react';
import { AiVitalSignsAnalysisCard } from './AiVitalSignsAnalysisCard';
import { VoiceReaderButton } from '../common/VoiceReaderButton';

interface VitalSignsViewProps {
  patientId?: string;
  readOnly?: boolean;
  permission?: VhvPermissionState;
}

export const VitalSignsView: React.FC<VitalSignsViewProps> = ({ patientId, readOnly, permission }) => {
  const { currentPatientProfile, vitalSignsRecords, addVitalSignsRecord, showToast } = useApp();
  const pId = patientId || currentPatientProfile?.id || 'patient-1';
  const isDenied = permission === 'denied' || readOnly;

  const userRecords = vitalSignsRecords.filter(r => r.patientId === pId);

  // Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPermissionWarning, setShowPermissionWarning] = useState(false);
  const [systolic, setSystolic] = useState<string>('120');
  const [diastolic, setDiastolic] = useState<string>('80');
  const [pulse, setPulse] = useState<string>('72');
  const [oxygen, setOxygen] = useState<string>('98');
  const [temperature, setTemperature] = useState<string>('36.6');
  const [recordDate, setRecordDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [recordTime, setRecordTime] = useState<string>('08:00');
  const [formError, setFormError] = useState('');

  // Summary Filter State (Day, Week, Month, Year)
  const [summaryFilter, setSummaryFilter] = useState<'day' | 'week' | 'month' | 'year'>('week');

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Strict validation requirement: BP Systolic & Diastolic are MANDATORY!
    if (!systolic || !diastolic) {
      setFormError('ความดันโลหิต (Systolic & Diastolic) เป็นข้อมูลจำเป็น ต้องไม่เป็นค่าว่าง');
      return;
    }

    const sysNum = Number(systolic);
    const diaNum = Number(diastolic);

    if (sysNum < 50 || sysNum > 250 || diaNum < 30 || diaNum > 150) {
      setFormError('ค่าความดันโลหิตอยู่นอกช่วงที่เป็นไปได้ทาง медицин');
      return;
    }

    const dateTimeStr = `${recordDate}T${recordTime}:00.000Z`;

    addVitalSignsRecord({
      patientId: pId,
      systolic: sysNum,
      diastolic: diaNum,
      pulse: pulse ? Number(pulse) : undefined,
      oxygen: oxygen ? Number(oxygen) : undefined,
      temperature: temperature ? Number(temperature) : undefined,
      recordedAt: dateTimeStr,
    });

    setShowAddModal(false);
    showToast('บันทึกข้อมูลสัญญาณชีพเรียบร้อยแล้ว');
  };

  // Calculate Average Summary with Data Boundary Check (Requirement #14)
  const getFilteredRecords = () => {
    const now = new Date();
    return userRecords.filter(r => {
      const rDate = new Date(r.recordedAt);
      const diffMs = now.getTime() - rDate.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      if (summaryFilter === 'day') return diffDays <= 1;
      if (summaryFilter === 'week') return diffDays <= 7;
      if (summaryFilter === 'month') return diffDays <= 30;
      return diffDays <= 365;
    });
  };

  const filteredRecs = getFilteredRecords();

  // Strict Data Boundary Criteria check: Minimum threshold of records required to present meaningful average
  const minRequiredCount = summaryFilter === 'day' ? 1 : summaryFilter === 'week' ? 3 : summaryFilter === 'month' ? 5 : 10;
  const isDataSufficient = filteredRecs.length >= minRequiredCount;

  const avgSystolic = isDataSufficient
    ? Math.round(filteredRecs.reduce((a, b) => a + b.systolic, 0) / filteredRecs.length)
    : 0;

  const avgDiastolic = isDataSufficient
    ? Math.round(filteredRecs.reduce((a, b) => a + b.diastolic, 0) / filteredRecs.length)
    : 0;

  const avgPulse = isDataSufficient
    ? Math.round(
        filteredRecs.filter(r => r.pulse).reduce((a, b) => a + (b.pulse || 0), 0) /
          (filteredRecs.filter(r => r.pulse).length || 1)
      )
    : 0;

  const getBpStatusColor = (sys: number, dia: number) => {
    if (sys >= 140 || dia >= 90) return 'text-red-700 bg-red-50 border-red-200';
    if (sys >= 130 || dia >= 85) return 'text-amber-800 bg-amber-50 border-amber-200';
    return 'text-emerald-800 bg-emerald-50 border-emerald-200';
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
              {currentPatientProfile?.firstName
                ? `${currentPatientProfile.firstName} ${currentPatientProfile.lastName}`
                : 'สมชาย ใจดี'}
            </h2>
            <div className="text-slate-600 text-xs sm:text-sm font-semibold mt-0.5">
              <span>Vital Signs Record • #{pId}</span>
            </div>
          </div>
        </div>

        {/* Edit Allowed / View Only Badge */}
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

        {/* Big Solid Record Button (Navy Blue Pill) */}
        {!isDenied && (
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full py-3 px-6 bg-[#0f3d69] hover:bg-[#0c2f55] active:scale-[0.99] text-white font-bold rounded-full text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>+ Record Vital Signs</span>
          </button>
        )}
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

      {/* Vital Signs Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>ความดันโลหิต</span>
            <Activity className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">
            {userRecords[0] ? `${userRecords[0].systolic}/${userRecords[0].diastolic}` : '-/-'}
          </p>
          <span className="text-[10px] text-slate-400 block">มม.ปรอท (mmHg)</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>ชีพจร</span>
            <Heart className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">
            {userRecords[0]?.pulse || '-'}
          </p>
          <span className="text-[10px] text-slate-400 block">ครั้ง/นาที (bpm)</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>ออกซิเจน SpO2</span>
            <Zap className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">
            {userRecords[0]?.oxygen ? `${userRecords[0].oxygen}%` : '-'}
          </p>
          <span className="text-[10px] text-slate-400 block">เปอร์เซ็นต์ (%)</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>อุณหภูมิ</span>
            <Thermometer className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">
            {userRecords[0]?.temperature ? `${userRecords[0].temperature}°C` : '-'}
          </p>
          <span className="text-[10px] text-slate-400 block">องศาเซลเซียส</span>
        </div>
      </div>

      {/* Summary Averages Section with Strict Data Boundary Guard (Requirement #14) */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-600" />
            สรุปค่าเฉลี่ยสุขภาพ
          </h3>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            {(['day', 'week', 'month', 'year'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setSummaryFilter(filter)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  summaryFilter === filter
                    ? 'bg-white text-teal-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {filter === 'day' ? 'วัน' : filter === 'week' ? 'สัปดาห์' : filter === 'month' ? 'เดือน' : 'ปี'}
              </button>
            ))}
          </div>
        </div>

        {/* Data Boundary Warning vs Summary Results */}
        {!isDataSufficient ? (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-3 text-amber-900 text-xs font-medium">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
            <span>
              ขออภัย คุณยังบันทึกข้อมูลไม่ครบสำหรับช่วงเวลาที่เลือก (ต้องการอย่างน้อย {minRequiredCount} รายการสำหรับช่วงนี้)
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-teal-50/50 rounded-2xl border border-teal-100">
            <div>
              <span className="text-xs text-slate-500 font-semibold block">ความดันโลหิตเฉลี่ย:</span>
              <p className="text-xl font-bold text-teal-900">
                {avgSystolic} / {avgDiastolic} mmHg
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">ชีพจรเฉลี่ย:</span>
              <p className="text-xl font-bold text-teal-900">{avgPulse} bpm</p>
            </div>
          </div>
        )}
      </div>

      {/* AI Vital Signs Analysis Card with Red Warning Disclaimer */}
      {userRecords.length > 0 && (
        <AiVitalSignsAnalysisCard
          records={userRecords}
          patientName={currentPatientProfile?.id === pId ? `${currentPatientProfile.firstName} ${currentPatientProfile.lastName}` : undefined}
        />
      )}

      {/* History Log Table */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <h3 className="font-bold text-base text-slate-900">ประวัติการบันทึก</h3>

        <div className="space-y-4">
          {userRecords.map((rec, idx) => {
            const bpClass = getBpStatusColor(rec.systolic, rec.diastolic);
            const borderColors = ['border-l-blue-600', 'border-l-rose-500', 'border-l-emerald-600', 'border-l-amber-600'];
            const borderColor = borderColors[idx % borderColors.length];

            return (
              <div
                key={rec.id}
                className={`p-5 bg-white rounded-3xl border border-slate-200 border-l-[6px] ${borderColor} shadow-xs space-y-3 hover:shadow-md transition-all`}
              >
                {/* Outside: Title BP & Time */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-slate-900 text-lg">
                        ความดัน: {rec.systolic}/{rec.diastolic} mmHg
                      </h4>
                      <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${bpClass}`}>
                        {rec.systolic >= 140 ? 'ความดันสูง' : rec.systolic >= 130 ? 'ค่อนข้างสูง' : 'ปกติ'}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-xl font-bold shrink-0">
                    {new Date(rec.recordedAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {/* Inside: Concise Sequential Info */}
                <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-rose-600" />
                      <span className="font-bold text-slate-900">ชีพจร:</span>
                      <span>{rec.pulse || '-'} ครั้ง/นาที</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-slate-900">SpO2:</span>
                      <span>{rec.oxygen ? `${rec.oxygen}%` : '-'}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Thermometer className="w-4 h-4 text-amber-600" />
                      <span className="font-bold text-slate-900">อุณหภูมิ:</span>
                      <span>{rec.temperature ? `${rec.temperature}°C` : '-'}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    เวลาบันทึก: {new Date(rec.recordedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Record Modal with Retroactive Date Picker up to 5 Years Past (Requirement #14) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
              บันทึกค่าสัญญาณชีพ
            </h3>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveRecord} className="space-y-3 text-xs">
              <div className="bg-teal-50 p-3 rounded-2xl border border-teal-100 space-y-2">
                <label className="block font-bold text-teal-900">
                  ความดันโลหิต (จำเป็นต้องกรอกทั้ง 2 ค่า!) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-teal-700 block mb-0.5">ตัวบน (Systolic)</span>
                    <input
                      type="number"
                      required
                      placeholder="เช่น 120"
                      value={systolic}
                      onChange={e => setSystolic(e.target.value)}
                      className="w-full p-2.5 bg-white border border-teal-200 rounded-xl font-bold text-sm text-center"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-teal-700 block mb-0.5">ตัวล่าง (Diastolic)</span>
                    <input
                      type="number"
                      required
                      placeholder="เช่น 80"
                      value={diastolic}
                      onChange={e => setDiastolic(e.target.value)}
                      className="w-full p-2.5 bg-white border border-teal-200 rounded-xl font-bold text-sm text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ชีพจร (bpm)</label>
                  <input
                    type="number"
                    value={pulse}
                    onChange={e => setPulse(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SpO2 (%)</label>
                  <input
                    type="number"
                    value={oxygen}
                    onChange={e => setOxygen(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">อุณหภูมิ (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={temperature}
                    onChange={e => setTemperature(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              {/* Retroactive Date Picker (up to 5 years past) */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">วันที่บันทึก (ย้อนหลังได้)</label>
                  <input
                    type="date"
                    required
                    max={new Date().toISOString().split('T')[0]}
                    min={new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    value={recordDate}
                    onChange={e => setRecordDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">เวลา</label>
                  <input
                    type="time"
                    required
                    value={recordTime}
                    onChange={e => setRecordTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md"
                >
                  บันทึกสัญญาณชีพ
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
