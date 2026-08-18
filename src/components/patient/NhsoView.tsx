import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, ExternalLink, RefreshCw, Building2, Lock, AlertCircle } from 'lucide-react';
import { VhvPermissionState } from '../../types';
import { VoiceReaderButton } from '../common/VoiceReaderButton';

interface NhsoViewProps {
  patientId?: string;
  readOnly?: boolean;
  permission?: VhvPermissionState;
}

export const NhsoView: React.FC<NhsoViewProps> = ({ patientId, readOnly, permission }) => {
  const { currentPatientProfile, nhsoRecords, updateNhsoRecord, showToast } = useApp();
  const pId = patientId || currentPatientProfile?.id || 'patient-1';
  const isDenied = permission === 'denied' || readOnly;

  const currentRec = nhsoRecords[pId] || {
    patientId: pId,
    entitlementType: 'บัตรทอง',
    serviceUnit: 'ศูนย์บริการสาธารณสุข ต.สุเทพ / รพ.มหาราชนครเชียงใหม่',
    recordedAt: new Date().toISOString(),
  };

  const [entitlement, setEntitlement] = useState(currentRec.entitlementType);
  const [serviceUnit, setServiceUnit] = useState(currentRec.serviceUnit);
  const [showChangeUnit, setShowChangeUnit] = useState(false);
  const [newUnitReq, setNewUnitReq] = useState('');
  const [showPermissionWarning, setShowPermissionWarning] = useState(false);

  const handleSaveEntitlement = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDenied) {
      setShowPermissionWarning(true);
      return;
    }
    updateNhsoRecord({
      patientId: pId,
      entitlementType: entitlement as any,
      serviceUnit,
      recordedAt: new Date().toISOString(),
    });
    showToast('บันทึกข้อมูลสิทธิรักษาเรียบร้อยแล้ว');
  };

  const handleOpenNhsoWebsite = () => {
    window.open('https://srmcitizen.nhso.go.th/', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
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
              <span>Healthcare Entitlement • สิทธิการรักษาพยาบาล</span>
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
      </div>

      {/* Title Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 to-emerald-600 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full backdrop-blur-md">
            สปสช. / หลักประกันสุขภาพ
          </span>
          <h2 className="text-2xl font-bold">เช็กสิทธิรักษาพยาบาล</h2>
          <p className="text-teal-100 text-xs sm:text-sm">
            ตรวจสอบสิทธิการรักษา บัตรทอง ประกันสังคม ข้าราชการ และเปลี่ยนหน่วยบริการ
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <VoiceReaderButton
            textToRead={`หน้าตรวจสอบสิทธิรักษาพยาบาล สปสช. สิทธิปัจจุบันของคุณคือ ${entitlement} หน่วยบริการประจำ ${serviceUnit}`}
            label="ฟังเสียง"
            size="md"
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
          />
          {/* External Link Button (Requirement #12) */}
          <button
            onClick={handleOpenNhsoWebsite}
            className="px-5 py-3 bg-white hover:bg-teal-50 text-teal-800 font-bold rounded-2xl text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer shrink-0 transition-all"
          >
            <span>ตรวจสอบสิทธิ สปสช.</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Entitlement Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        {isDenied && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-800 text-xs font-medium">
            <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-amber-900 block mb-0.5">ดูข้อมูลได้อย่างเดียว (Read-Only)</strong>
              คุณสามารถดูข้อมูลได้ แต่ไม่สามารถแก้ไขข้อมูลนี้ เนื่องจากเจ้าของข้อมูลยังไม่ได้อนุญาต
            </div>
          </div>
        )}

        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
          สิทธิรักษาของฉัน
        </h3>

        <form onSubmit={handleSaveEntitlement} className="space-y-6">
          {/* Options: บัตรทอง, ประกันสังคม, ข้าราชการ, อื่นๆ */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">ประเภทสิทธิการรักษา</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['บัตรทอง', 'ประกันสังคม', 'ข้าราชการ', 'อื่นๆ'] as const).map(type => (
                <label
                  key={type}
                  className={`p-3.5 rounded-2xl border text-xs font-bold text-center cursor-pointer transition-all flex items-center justify-center gap-2 ${
                    entitlement === type
                      ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-100'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="entitlement"
                    checked={entitlement === type}
                    onChange={() => setEntitlement(type)}
                    className="sr-only"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              หน่วยบริการ/สถานพยาบาลประจำสิทธิ
            </label>
            <div className="relative">
              <Building2 className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={serviceUnit}
                onChange={e => setServiceUnit(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <span>บันทึกล่าสุดเมื่อ:</span>
            <span className="font-semibold text-slate-700">
              {new Date(currentRec.recordedAt).toLocaleDateString('th-TH')} เวลา{' '}
              {new Date(currentRec.recordedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl text-sm shadow-md transition-all cursor-pointer"
          >
            บันทึกข้อมูลสิทธิรักษา
          </button>
        </form>

        {/* Change Service Unit Section (Requirement #12) */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-slate-900">เปลี่ยนหน่วยบริการที่ใช้สิทธิ</h4>
              <p className="text-xs text-slate-500">ขอย้ายหน่วยบริการปฐมภูมิไปยัง รพ.สต. หรือ รพ. ใกล้บ้าน</p>
            </div>
            <button
              type="button"
              onClick={() => setShowChangeUnit(!showChangeUnit)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {showChangeUnit ? 'ปิด' : 'ยื่นคำขอเปลี่ยน'}
            </button>
          </div>

          {showChangeUnit && (
            <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200 space-y-3 animate-in fade-in duration-200">
              <label className="block text-xs font-bold text-teal-900">
                ระบุสถานพยาบาลใหม่ที่ต้องการย้ายสิทธิ
              </label>
              <input
                type="text"
                placeholder="เช่น โรงพยาบาลส่งเสริมสุขภาพตำบลสุเทพ"
                value={newUnitReq}
                onChange={e => setNewUnitReq(e.target.value)}
                className="w-full p-2.5 bg-white border border-teal-200 rounded-xl text-xs font-medium"
              />
              <button
                type="button"
                onClick={() => {
                  if (newUnitReq.trim()) {
                    setServiceUnit(newUnitReq);
                    setShowChangeUnit(false);
                    setNewUnitReq('');
                  }
                }}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                ยืนยันคำขอย้ายสิทธิ
              </button>
            </div>
          )}
        </div>
      </div>

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
