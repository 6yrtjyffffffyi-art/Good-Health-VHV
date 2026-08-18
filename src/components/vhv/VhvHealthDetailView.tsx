import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PatientProfile, VhvPermissionState } from '../../types';
import { ArrowLeft, ShieldCheck, Clock, Lock, KeyRound, MapPin, Phone, User } from 'lucide-react';
import { VitalSignsView } from '../patient/VitalSignsView';
import { SymptomsView } from '../patient/SymptomsView';
import { MedicationsView } from '../patient/MedicationsView';
import { CalendarView } from '../patient/CalendarView';
import { NhsoView } from '../patient/NhsoView';
import { NearbyHospitalsView } from '../patient/NearbyHospitalsView';
import { VhvPermissionDialog } from './VhvPermissionDialog';
import { formatAddress } from '../../utils/addressUtils';
import { VoiceReaderButton } from '../common/VoiceReaderButton';

interface VhvHealthDetailViewProps {
  patient?: PatientProfile;
  patientId?: string;
  menuKey?: 'vitals' | 'symptoms' | 'meds' | 'calendar' | 'nhso' | 'hospitals';
  initialTab?: 'vitals' | 'symptoms' | 'meds' | 'calendar' | 'nhso' | 'hospitals';
  onBack: () => void;
}

export const VhvHealthDetailView: React.FC<VhvHealthDetailViewProps> = ({
  patient: propPatient,
  patientId,
  menuKey,
  initialTab,
  onBack,
}) => {
  const { allPatients, getPatientVhvPermission, setPatientVhvPermission, showToast } = useApp();
  const [showPermDialog, setShowPermDialog] = useState(false);

  const patient = propPatient || allPatients.find(p => p.id === patientId) || allPatients[0];
  const activeMenuKey = menuKey || initialTab || 'vitals';

  if (!patient) {
    return (
      <div className="bg-white p-8 rounded-3xl text-center space-y-4">
        <p className="text-slate-600">ไม่พบข้อมูลผู้สูงอายุ</p>
        <button onClick={onBack} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">
          กลับไป
        </button>
      </div>
    );
  }

  const permission = getPatientVhvPermission(patient.id);

  const renderPermissionBadge = () => {
    switch (permission) {
      case 'granted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            สิทธิ์: อนุญาต
          </span>
        );
      case 'granted_once':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            สิทธิ์: เฉพาะครั้งนี้
          </span>
        );
      case 'denied':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full border border-rose-300">
            <Lock className="w-3.5 h-3.5 text-rose-600" />
            สิทธิ์: ไม่อนุญาต (ดูได้อย่างเดียว)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-300">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            ยังไม่ได้กำหนดสิทธิ์
          </span>
        );
    }
  };

  const handleSelectPermission = (newPerm: VhvPermissionState) => {
    setPatientVhvPermission(patient.id, newPerm);
    setShowPermDialog(false);
    const label = newPerm === 'granted' ? 'อนุญาต' : newPerm === 'granted_once' ? 'เฉพาะครั้งนี้' : 'ไม่อนุญาต';
    showToast(`อัปเดตสิทธิ์สำหรับ ${patient.firstName} เป็น "${label}" เรียบร้อยแล้ว`);
  };

  return (
    <div className="space-y-6">
      {/* Back Button & Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับไปหน้ารายชื่อผู้สูงอายุ</span>
        </button>

        <button
          onClick={() => setShowPermDialog(true)}
          className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-2xl text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-blue-200"
        >
          <KeyRound className="w-4 h-4 text-blue-600" />
          <span>ปรับสิทธิ์การเข้าถึง</span>
        </button>
      </div>

      {/* Patient Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/20">
              <User className="w-6 h-6 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold">
                  {patient.firstName} {patient.lastName}
                </h2>
                <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full">
                  อายุ {patient.age} ปี
                </span>
              </div>
              <p className="text-xs text-blue-200 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-blue-300" />
                {formatAddress(patient.address)}
              </p>
            </div>
          </div>

          <div className="self-start sm:self-center">
            {renderPermissionBadge()}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-blue-200">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              โทร: {patient.phone || '081-234-5678'}
            </span>
            <VoiceReaderButton
              textToRead={`ข้อมูลผู้สูงอายุ คุณ${patient.firstName} ${patient.lastName} อายุ ${patient.age} ปี ที่อยู่ ${formatAddress(patient.address)} เบอร์โทรศัพท์ ${patient.phone || 'ไม่ระบุ'}`}
              label="ฟังข้อมูลผู้สูงอายุ"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
            />
          </div>
          <span className="text-[11px] bg-white/10 px-2.5 py-1 rounded-lg">
            ระบบสิทธิข้อมูล: {permission === 'denied' ? 'อ่านอย่างเดียว (Read Only)' : 'มีสิทธิ์จัดการข้อมูล'}
          </span>
        </div>
      </div>

      {/* Dynamic Health View */}
      <div className="bg-slate-50/50 rounded-3xl">
        {activeMenuKey === 'vitals' && (
          <VitalSignsView patientId={patient.id} permission={permission} />
        )}
        {activeMenuKey === 'symptoms' && (
          <SymptomsView patientId={patient.id} permission={permission} />
        )}
        {activeMenuKey === 'meds' && (
          <MedicationsView patientId={patient.id} permission={permission} />
        )}
        {activeMenuKey === 'calendar' && (
          <CalendarView patientId={patient.id} permission={permission} />
        )}
        {activeMenuKey === 'nhso' && (
          <NhsoView patientId={patient.id} permission={permission} />
        )}
        {activeMenuKey === 'hospitals' && (
          <NearbyHospitalsView patientId={patient.id} permission={permission} />
        )}
      </div>

      {/* Permission Dialog */}
      <VhvPermissionDialog
        patientName={`${patient.firstName} ${patient.lastName}`}
        isOpen={showPermDialog}
        onSelectPermission={handleSelectPermission}
      />
    </div>
  );
};
