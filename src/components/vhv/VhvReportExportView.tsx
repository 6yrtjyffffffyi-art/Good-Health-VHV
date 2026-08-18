import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PatientProfile } from '../../types';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Calendar,
  Filter,
  Users,
  Activity,
  AlertTriangle,
  Building2,
  ShieldCheck,
  Search,
  User,
  UserCheck,
  Pill,
  Stethoscope,
  Heart,
  MapPin,
  Phone,
  Crosshair,
  FileCheck2,
  FileSpreadsheet
} from 'lucide-react';
import { formatAddress } from '../../utils/addressUtils';
import { VoiceReaderButton } from '../common/VoiceReaderButton';

type ReportType = 'summary' | 'individual';

export const VhvReportExportView: React.FC = () => {
  const {
    allPatients,
    vitalSignsRecords,
    symptomRecords,
    medications,
    nhsoRecords,
    currentUser,
    showToast
  } = useApp();

  const [reportType, setReportType] = useState<ReportType>('summary');
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-08');
  const [selectedGroup, setSelectedGroup] = useState<'all' | 'ติดสังคม' | 'ติดบ้าน' | 'ติดเตียง'>('all');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(allPatients[0]?.id || '');
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const currentDate = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Group tagging logic
  const getPatientCategory = (patient: PatientProfile): 'ติดสังคม' | 'ติดบ้าน' | 'ติดเตียง' => {
    if (patient.status === 'ติดเตียง') return 'ติดเตียง';
    if (patient.status === 'ต้องติดตามเป็นพิเศษ' || patient.status === 'มีผู้ดูแล') return 'ติดบ้าน';
    return 'ติดสังคม';
  };

  const filteredPatients = allPatients.filter(p => {
    if (selectedGroup === 'all') return true;
    return getPatientCategory(p) === selectedGroup;
  });

  const selectedPatient = allPatients.find(p => p.id === selectedPatientId) || allPatients[0];

  // Selected patient's individual records
  const patientVitals = selectedPatient
    ? vitalSignsRecords.filter(r => r.patientId === selectedPatient.id)
    : [];
  const patientSymptoms = selectedPatient
    ? symptomRecords.filter(r => r.patientId === selectedPatient.id)
    : [];
  const patientMeds = selectedPatient
    ? medications.filter(m => m.patientId === selectedPatient.id)
    : [];
  const patientNhso = selectedPatient ? nhsoRecords[selectedPatient.id] : null;

  // Calculate summary statistics
  const totalInCare = allPatients.length;
  const countSociety = allPatients.filter(p => getPatientCategory(p) === 'ติดสังคม').length;
  const countHomebound = allPatients.filter(p => getPatientCategory(p) === 'ติดบ้าน').length;
  const countBedridden = allPatients.filter(p => getPatientCategory(p) === 'ติดเตียง').length;
  const monthRecords = vitalSignsRecords.filter(r => r.recordedAt.startsWith(selectedMonth));
  const highBpCount = monthRecords.filter(r => r.systolic >= 140 || r.diastolic >= 90).length;

  const handlePrint = () => {
    window.print();
  };

  // Export CSV for Summary Report
  const handleDownloadSummaryCsv = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = ['ลำดับ,ชื่อ-นามสกุล,อายุ,กลุ่มสุขภาพ,เบอร์โทร,ที่อยู่,โรคประจำตัว,ความดันล่าสุด(mmHg),ชีพจร,สถานะ'];
      const rows = filteredPatients.map((p, idx) => {
        const pRecords = vitalSignsRecords.filter(r => r.patientId === p.id);
        const lastRec = pRecords.length > 0 ? pRecords[pRecords.length - 1] : null;
        const bpStr = lastRec ? `${lastRec.systolic}/${lastRec.diastolic}` : 'ไม่ได้บันทึก';
        const pulseStr = lastRec?.pulse ? `${lastRec.pulse}` : '-';
        const cat = getPatientCategory(p);
        const diseases = p.diseases.join('; ');
        const addr = formatAddress(p.address).replace(/,/g, ' ');

        return `${idx + 1},${p.firstName} ${p.lastName},${p.age},${cat},${p.phone},"${addr}","${diseases}",${bpStr},${pulseStr},${p.status}`;
      });

      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `รายงานสรุปผู้สูงอายุ_อสม_${selectedMonth}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      setExportSuccess(true);
      showToast('ดาวน์โหลดรายงานสรุป อสม. (CSV) สำเร็จ');
      setTimeout(() => setExportSuccess(false), 4000);
    }, 600);
  };

  // Export CSV for Individual Patient Report
  const handleDownloadIndividualCsv = () => {
    if (!selectedPatient) return;
    setIsExporting(true);
    setTimeout(() => {
      const lines: string[] = [];
      lines.push(`รายงานประวัติสุขภาพรายบุคคล - ${selectedPatient.firstName} ${selectedPatient.lastName}`);
      lines.push(`อายุ: ${selectedPatient.age} ปี, เบอร์โทร: ${selectedPatient.phone}`);
      lines.push(`ที่อยู่: "${formatAddress(selectedPatient.address)}"`);
      lines.push(`โรคประจำตัว: "${selectedPatient.diseases?.join(', ') || 'ไม่มี'}"`);
      lines.push(`สิทธิการรักษา: "${patientNhso?.entitlementType || 'สิทธิหลักประกันสุขภาพแห่งชาติ'}"`);
      lines.push('');
      lines.push('--- ประวัติสัญญาณชีพ ---');
      lines.push('ลำดับ,วันที่-เวลา,ความดันตัวบน(SYS),ความดันตัวล่าง(DIA),ชีพจร(bpm),ระดับความดัน');

      if (patientVitals.length > 0) {
        patientVitals.forEach((v, idx) => {
          const bpStatus = v.systolic >= 140 || v.diastolic >= 90 ? 'สูงกว่าเกณฑ์' : 'ปกติ';
          lines.push(`${idx + 1},${v.recordedAt},${v.systolic},${v.diastolic},${v.pulse || '-'},${bpStatus}`);
        });
      } else {
        lines.push('ไม่มีประวัติการบันทึก');
      }

      lines.push('');
      lines.push('--- รายการยาที่รับประทานประจำ ---');
      lines.push('ลำดับ,ชื่อยา,ขนาดยา,เวลาที่รับประทาน,ข้อแนะนำ');
      if (patientMeds.length > 0) {
        patientMeds.forEach((m, idx) => {
          const times = m.timings?.join(' ') || '-';
          lines.push(`${idx + 1},"${m.drugNameTH}","${m.dosage}","${times}","${m.instructions || '-'}"`);
        });
      } else {
        lines.push('ไม่มีรายการยา');
      }

      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + lines.join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `ประวัติสุขภาพ_${selectedPatient.firstName}_${selectedPatient.lastName}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      setExportSuccess(true);
      showToast(`ดาวน์โหลดรายงานประวัติ ${selectedPatient.firstName} สำเร็จ`);
      setTimeout(() => setExportSuccess(false), 4000);
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 print:hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-bold">
            <Building2 className="w-3.5 h-3.5" />
            ระบบออกรายงานส่ง รพ.สต. / กองทุน สปสช. และรายงานเฉพาะบุคคล
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            ระบบส่งออกรายงานผลการตรวจสุขภาพ อสม.
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
            เลือกออกรายงานแบบรวมส่ง รพ.สต. หรือรายงานประวัติสุขภาพแบบรายชื่อเฉพาะบุคคล สามารถพิมพ์เป็นเอกสาร (Print PDF) หรือดาวน์โหลดไฟล์ Excel/CSV ได้ทันที
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={reportType === 'summary' ? handleDownloadSummaryCsv : handleDownloadIndividualCsv}
            disabled={isExporting}
            className="flex-1 md:flex-none px-5 py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'กำลังสร้างไฟล์...' : 'ส่งออกไฟล์ Excel / CSV'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 md:flex-none px-5 py-3 bg-white/15 hover:bg-white/25 active:scale-95 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 border border-white/30 backdrop-blur-xs transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์รายงาน (Print)</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector Tabs (Requirement: แบบรวมสำหรับส่งเฉพาะอสม. กับ แบบรายชื่อเฉพาะ) */}
      <div className="bg-white rounded-3xl p-3 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-700 ml-2" />
          <span className="text-xs sm:text-sm font-bold text-slate-800">เลือกรูปแบบรายงาน:</span>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => setReportType('summary')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              reportType === 'summary'
                ? 'bg-blue-700 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>1. รายงานสรุปแบบรวม (สำหรับส่งเฉพาะ อสม.)</span>
          </button>

          <button
            onClick={() => setReportType('individual')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              reportType === 'individual'
                ? 'bg-purple-700 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>2. รายงานประวัติสุขภาพแบบรายชื่อเฉพาะ</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: SUMMARY REPORT FOR VHV (รายงานสรุปแบบรวมสำหรับส่งเฉพาะ อสม.) */}
      {/* ========================================================================= */}
      {reportType === 'summary' && (
        <div className="space-y-6">
          {/* Filter and Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block">ผู้สูงอายุในดูแลทั้งหมด</span>
                <strong className="text-lg font-bold text-slate-900">{totalInCare} คน</strong>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block">กลุ่มติดสังคม</span>
                <strong className="text-lg font-bold text-emerald-800">{countSociety} คน</strong>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block">กลุ่มติดบ้าน</span>
                <strong className="text-lg font-bold text-amber-800">{countHomebound} คน</strong>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block">กลุ่มติดเตียง (เฝ้าระวัง)</span>
                <strong className="text-lg font-bold text-rose-800">{countBedridden} คน</strong>
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-blue-700" />
              <span className="text-xs sm:text-sm font-bold text-slate-800">กรองข้อมูลในรายงานสรุป อสม.:</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">รอบเดือน:</span>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                {(['all', 'ติดสังคม', 'ติดบ้าน', 'ติดเตียง'] as const).map(grp => (
                  <button
                    key={grp}
                    onClick={() => setSelectedGroup(grp)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedGroup === grp
                        ? 'bg-blue-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {grp === 'all' ? 'ทั้งหมด' : grp}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Printable Report Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 print:p-0 print:border-none print:shadow-none">
            {/* Report Official Header */}
            <div className="text-center space-y-1.5 border-b border-slate-200 pb-5">
              <div className="inline-block px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-bold mb-1 border border-blue-200">
                แบบฟอร์มรายงาน อสม. 1 / รพ.สต.
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                แบบสรุปการติดตามสุขภาพและสัญญาณชีพผู้สูงอายุในชุมชน (สำหรับส่ง อสม.)
              </h3>
              <p className="text-xs text-slate-600">
                หน่วยบริการสาธารณสุข: รพ.สต.สุเทพ จ.เชียงใหม่ | ผู้รับผิดชอบ: {currentUser?.firstName || 'อสม.สมพร'} {currentUser?.lastName || 'แก้วมณี'} (อสม.ประจำหมู่ที่ 2)
              </p>
              <p className="text-xs text-slate-500">
                ประจำเดือน: {selectedMonth} | จำนวนผู้ได้รับการตรวจในรายงาน: {filteredPatients.length} ราย (ติดสังคม {countSociety}, ติดบ้าน {countHomebound}, ติดเตียง {countBedridden})
              </p>
            </div>

            {/* Data Display: Table for desktop/print and clean right-aligned cards for mobile */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                    <th className="p-3 text-center w-12">ลำดับ</th>
                    <th className="p-3">ชื่อ - นามสกุล</th>
                    <th className="p-3 text-center">อายุ</th>
                    <th className="p-3 text-center">กลุ่มสุขภาพ</th>
                    <th className="p-3">โรคประจำตัว</th>
                    <th className="p-3 text-center">ความดันโลหิต (mmHg)</th>
                    <th className="p-3 text-center">ชีพจร</th>
                    <th className="p-3">เบอร์ติดต่อ / ผู้ดูแล</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredPatients.map((patient, index) => {
                    const pRecords = vitalSignsRecords.filter(r => r.patientId === patient.id);
                    const lastRec = pRecords.length > 0 ? pRecords[pRecords.length - 1] : null;
                    const cat = getPatientCategory(patient);
                    const isHigh = lastRec && (lastRec.systolic >= 140 || lastRec.diastolic >= 90);

                    return (
                      <tr key={patient.id} className="hover:bg-slate-50">
                        <td className="p-3 text-center font-bold text-slate-500">{index + 1}</td>
                        <td className="p-3 font-bold text-slate-900">
                          {patient.firstName} {patient.lastName}
                          <span className="block text-[11px] font-normal text-slate-500">{patient.address?.houseNo ? `บ้านเลขที่ ${patient.address.houseNo}` : ''}</span>
                        </td>
                        <td className="p-3 text-center">{patient.age} ปี</td>
                        <td className="p-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              cat === 'ติดเตียง'
                                ? 'bg-rose-100 text-rose-800'
                                : cat === 'ติดบ้าน'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {cat}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 max-w-xs truncate">
                          {patient.diseases?.join(', ') || '-'}
                        </td>
                        <td className="p-3 text-center font-bold">
                          {lastRec ? (
                            <span className={isHigh ? 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md' : 'text-slate-800'}>
                              {lastRec.systolic}/{lastRec.diastolic}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-normal">ยังไม่ได้วัด</span>
                          )}
                        </td>
                        <td className="p-3 text-center text-slate-700">
                          {lastRec?.pulse ? `${lastRec.pulse} bpm` : '-'}
                        </td>
                        <td className="p-3 text-slate-600">
                          <div>{patient.phone}</div>
                          {patient.caregiverContacts?.[0] && (
                            <div className="text-[11px] text-slate-400">
                              {patient.caregiverContacts[0].name} ({patient.caregiverContacts[0].relationship})
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile View: Senior-friendly cards with clean right-aligned key-value rows */}
            <div className="block md:hidden space-y-3.5 print:hidden">
              {filteredPatients.map((patient, index) => {
                const pRecords = vitalSignsRecords.filter(r => r.patientId === patient.id);
                const lastRec = pRecords.length > 0 ? pRecords[pRecords.length - 1] : null;
                const cat = getPatientCategory(patient);
                const isHigh = lastRec && (lastRec.systolic >= 140 || lastRec.diastolic >= 90);

                return (
                  <div key={patient.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <strong className="text-sm font-bold text-slate-900">
                          {patient.firstName} {patient.lastName}
                        </strong>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold shrink-0 text-right ${
                          cat === 'ติดเตียง'
                            ? 'bg-rose-100 text-rose-800'
                            : cat === 'ติดบ้าน'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {cat}
                      </span>
                    </div>

                    <div className="bg-white rounded-xl p-3 border border-slate-200 divide-y divide-slate-100 text-xs">
                      <div className="flex items-center justify-between py-1.5 gap-2">
                        <span className="text-slate-500 font-medium">อายุ</span>
                        <span className="font-bold text-slate-900 text-right">{patient.age} ปี</span>
                      </div>

                      <div className="flex items-center justify-between py-1.5 gap-2">
                        <span className="text-slate-500 font-medium">ความดันโลหิต</span>
                        <span className="text-right">
                          {lastRec ? (
                            <span className={`font-bold px-2 py-0.5 rounded-md text-xs ${isHigh ? 'bg-rose-50 text-rose-700' : 'text-slate-900'}`}>
                              {lastRec.systolic}/{lastRec.diastolic} mmHg
                            </span>
                          ) : (
                            <span className="text-slate-400 font-normal">ยังไม่ได้วัด</span>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1.5 gap-2">
                        <span className="text-slate-500 font-medium">ชีพจร</span>
                        <span className="font-bold text-slate-800 text-right">
                          {lastRec?.pulse ? `${lastRec.pulse} bpm` : '-'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1.5 gap-2">
                        <span className="text-slate-500 font-medium">โรคประจำตัว</span>
                        <span className="font-bold text-slate-800 text-right truncate max-w-[180px]">
                          {patient.diseases?.join(', ') || 'ไม่มี'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1.5 gap-2">
                        <span className="text-slate-500 font-medium">เบอร์โทรศัพท์</span>
                        <span className="font-bold text-blue-700 text-right">{patient.phone}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Signature Block (VHV + Health Center Staff) */}
            <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8">
              <div className="text-center space-y-4">
                <p className="text-xs text-slate-600">ลงชื่อ....................................................... (ผู้รายงาน)</p>
                <p className="text-xs font-bold text-slate-800">
                  ({currentUser?.firstName || 'อสม.สมพร'} {currentUser?.lastName || 'แก้วมณี'})
                </p>
                <p className="text-[11px] text-slate-500">อาสาสมัครสาธารณสุขประจำหมู่บ้าน (อสม.)</p>
              </div>

              <div className="text-center space-y-4">
                <p className="text-xs text-slate-600">ลงชื่อ....................................................... (ผู้รับรายงาน)</p>
                <p className="text-xs font-bold text-slate-800">
                  (พยาบาลวิชาชีพ / เจ้าหน้าที่สาธารณสุข)
                </p>
                <p className="text-[11px] text-slate-500">โรงพยาบาลส่งเสริมสุขภาพตำบล (รพ.สต.)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SINGLE PATIENT DETAILED REPORT PREVIEW */}
      {reportType === 'individual' && selectedPatient && (
        <div id="patient-individual-report" className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          {/* Print/Export Header */}
          <div className="border-b border-slate-200 pb-4 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    รายงานบันทึกสุขภาพและประวัติการดูแลรายบุคคล
                  </h3>
                  <p className="text-xs text-slate-500">
                    โครงการดูแลสุขภาพผู้สูงอายุในชุมชน • ข้อมูล ณ วันที่ {currentDate}
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full inline-block">
                  อสม. {currentUser?.firstName} {currentUser?.lastName}
                </span>
              </div>
            </div>
          </div>

          {/* Report Body */}
          <div className="space-y-6">
            {/* Patient Profile Card Block */}
            <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 divide-y divide-slate-200/70 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 py-2 first:pt-0">
                <span className="text-slate-500 font-medium">ชื่อ - สกุล ผู้สูงอายุ</span>
                <strong className="text-sm font-bold text-slate-900 text-left sm:text-right">
                  คุณ{selectedPatient.firstName} {selectedPatient.lastName}
                </strong>
              </div>

              <div className="flex items-center justify-between gap-2 py-2">
                <span className="text-slate-500 font-medium">อายุ</span>
                <strong className="text-slate-800 text-right">{selectedPatient.age} ปี</strong>
              </div>

              <div className="flex items-center justify-between gap-2 py-2">
                <span className="text-slate-500 font-medium">เบอร์โทรศัพท์</span>
                <strong className="text-blue-700 font-bold text-right">{selectedPatient.phone}</strong>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 py-2">
                <span className="text-slate-500 font-medium">ที่อยู่ปัจจุบัน</span>
                <span className="font-semibold text-slate-800 text-left sm:text-right">{formatAddress(selectedPatient.address)}</span>
              </div>

              <div className="flex items-center justify-between gap-2 py-2">
                <span className="text-slate-500 font-medium">สิทธิการรักษา</span>
                <strong className="text-emerald-800 text-right">
                  {patientNhso?.entitlementType || 'สิทธิหลักประกันสุขภาพแห่งชาติ (บัตรทอง 30 บาท)'}
                </strong>
              </div>

              <div className="flex items-center justify-between gap-2 py-2">
                <span className="text-slate-500 font-medium">โรคประจำตัว</span>
                <strong className="text-rose-700 text-right">
                  {selectedPatient.diseases?.join(', ') || 'ไม่มีโรคประจำตัวระบุ'}
                </strong>
              </div>

              {selectedPatient.caregiverContacts?.[0] && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 py-2 last:pb-0">
                  <span className="text-slate-500 font-medium">ผู้ดูแลหลัก / ญาติ</span>
                  <strong className="text-slate-800 text-left sm:text-right">
                    {selectedPatient.caregiverContacts[0].name} ({selectedPatient.caregiverContacts[0].relationship}) โทร {selectedPatient.caregiverContacts[0].phone}
                  </strong>
                </div>
              )}
            </div>

            {/* Vitals History Section */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600" />
                <span>1. ประวัติการบันทึกค่าสัญญาณชีพ (ความดันโลหิตและชีพจร)</span>
              </h4>

              {patientVitals.length > 0 ? (
                <>
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                          <th className="p-2.5 text-center w-12">ลำดับ</th>
                          <th className="p-2.5">วันที่ - เวลา</th>
                          <th className="p-2.5 text-center">ความดัน SYS (บน)</th>
                          <th className="p-2.5 text-center">ความดัน DIA (ล่าง)</th>
                          <th className="p-2.5 text-center">ชีพจร (Pulse)</th>
                          <th className="p-2.5 text-center">การแปลผล</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {patientVitals.map((rec, idx) => {
                          const isHigh = rec.systolic >= 140 || rec.diastolic >= 90;
                          return (
                            <tr key={rec.id} className="hover:bg-slate-50">
                              <td className="p-2.5 text-center font-bold text-slate-500">{idx + 1}</td>
                              <td className="p-2.5 font-medium text-slate-800">{rec.recordedAt}</td>
                              <td className="p-2.5 text-center font-bold text-slate-900">{rec.systolic} mmHg</td>
                              <td className="p-2.5 text-center font-bold text-slate-900">{rec.diastolic} mmHg</td>
                              <td className="p-2.5 text-center text-slate-700">{rec.pulse || '-'} bpm</td>
                              <td className="p-2.5 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                    isHigh ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                                  }`}
                                >
                                  {isHigh ? 'ความดันสูงกว่าเกณฑ์' : 'ระดับปกติ'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Vitals Card List */}
                  <div className="block md:hidden space-y-2.5 print:hidden">
                    {patientVitals.map((rec, idx) => {
                      const isHigh = rec.systolic >= 140 || rec.diastolic >= 90;
                      return (
                        <div key={rec.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                            <span className="font-bold text-slate-700">ครั้งที่ {idx + 1} • {rec.recordedAt}</span>
                            <span
                              className={`px-2 py-0.5 rounded-md font-bold text-[10px] text-right ${
                                isHigh ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {isHigh ? 'สูงกว่าเกณฑ์' : 'ปกติ'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">ความดันโลหิต (SYS/DIA)</span>
                            <strong className={`text-right font-bold ${isHigh ? 'text-rose-700' : 'text-slate-900'}`}>
                              {rec.systolic}/{rec.diastolic} mmHg
                            </strong>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">ชีพจร (Pulse)</span>
                            <strong className="text-slate-800 text-right">{rec.pulse || '-'} bpm</strong>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl text-center text-xs text-slate-500">
                  ยังไม่มีประวัติการบันทึกสัญญาณชีพ
                </div>
              )}
            </div>

            {/* Medications Section */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Pill className="w-4 h-4 text-amber-600" />
                <span>2. รายการยาที่ต้องรับประทานประจำ</span>
              </h4>

              {patientMeds.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {patientMeds.map((med, idx) => (
                    <div key={med.id} className="p-3 bg-amber-50/50 border border-amber-200 rounded-2xl space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{idx + 1}. {med.drugNameTH}</span>
                        <span className="text-amber-800">{med.dosage}</span>
                      </div>
                      <div className="text-slate-600 text-[11px]">
                        ช่วงเวลา: {med.timings?.join(', ') || 'ตามแพทย์สั่ง'}
                      </div>
                      {med.instructions && (
                        <div className="text-slate-500 text-[11px] italic">
                          คำแนะนำ: {med.instructions}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl text-center text-xs text-slate-500">
                  ไม่มีรายการยาประจำที่บันทึกไว้
                </div>
              )}
            </div>

            {/* Symptoms History */}
            {patientSymptoms.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-blue-700" />
                  <span>3. ประวัติการบันทึกอาการผิดปกติที่เคยพบ</span>
                </h4>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  {patientSymptoms.map(sym => (
                    <div key={sym.id} className="flex items-start justify-between border-b border-slate-200 last:border-0 pb-1.5 last:pb-0">
                      <div>
                        <span className="font-bold text-slate-800">{sym.symptoms.join(', ')}</span>
                        <span className="text-slate-500 ml-2">({sym.timePeriod}, {sym.duration})</span>
                        {sym.notes && <p className="text-[11px] text-slate-500 mt-0.5">{sym.notes}</p>}
                      </div>
                      <span className="text-[11px] text-slate-400">{sym.recordedAt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VHV Evaluation & Follow-up Notes */}
            <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200 space-y-2 text-xs">
              <h5 className="font-bold text-purple-900">สรุปความเห็นและการติดตามของ อสม.</h5>
              <p className="text-slate-700 leading-relaxed">
                ผู้สูงอายุได้รับการดูแลและติดตามสุขภาพอย่างต่อเนื่อง แนะนำให้รับประทานยาตามเวลาอย่างสม่ำเสมอ ลดอาหารรสเค็ม ดื่มน้ำสะอาด และนัดตรวจสุขภาพสัญญาณชีพในรอบถัดไป
              </p>
            </div>

            {/* Official Signature */}
            <div className="pt-6 border-t border-slate-200 flex justify-end">
              <div className="text-center space-y-3 w-64">
                <p className="text-xs text-slate-600">ลงชื่อ.......................................................</p>
                <p className="text-xs font-bold text-slate-800">
                  ({currentUser?.firstName || 'อสม.สมพร'} {currentUser?.lastName || 'แก้วมณี'})
                </p>
                <p className="text-[11px] text-slate-500">อสม. ผู้รับผิดชอบดูแล</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
