import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Phone,
  MapPin,
  Stethoscope,
  Shield,
  LogOut,
  Smartphone,
  Tablet,
  Monitor,
  Edit3,
  Save,
  X,
  Building2,
  BadgeCheck,
  Search,
  Users,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
  Volume2,
  VolumeX,
  Sparkles,
  Heart,
  Pill,
  FileText,
  BookOpen
} from 'lucide-react';
import { VhvCenterSearchModal } from '../vhv/VhvCenterSearchModal';
import { VoiceReaderButton } from './VoiceReaderButton';
import { BirthDateInput } from './BirthDateInput';
import { PatientStatusSelector } from './PatientStatusSelector';
import { CHRONIC_DISEASES, PATIENT_STATUSES, CaregiverContact, PatientProfile } from '../../types';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    currentPatientProfile,
    currentVhvProfile,
    currentCaregiverProfile,
    allPatients,
    updateUserAccount,
    updatePatientProfile,
    updateVhvProfile,
    updateCaregiverProfile,
    addPatientToCaregiver,
    removePatientFromCaregiver,
    deviceType,
    setDeviceType,
    voiceReaderEnabled,
    setVoiceReaderEnabled,
    logout,
    getPatientVhvPermission,
    setPatientVhvPermission,
    openUserGuide,
    showToast,
    userCoords,
    locationPermission
  } = useApp();

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);

  // Modal for VHV Center Search
  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false);

  // Modal for adding a patient (Caregiver role)
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);

  // Modal for editing a managed patient (Caregiver role)
  const [editingPatient, setEditingPatient] = useState<PatientProfile | null>(null);

  // Form states for general info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  // Form states for structured address (แยกช่องชัดเจน)
  const [houseNo, setHouseNo] = useState('');
  const [alley, setAlley] = useState('');
  const [moo, setMoo] = useState('');
  const [subdistrict, setSubdistrict] = useState('');
  const [district, setDistrict] = useState('');
  const [province, setProvince] = useState('');

  // Form states for Patient specific fields
  const [birthDate, setBirthDate] = useState('1956-05-15');
  const [age, setAge] = useState<number>(70);
  const [status, setStatus] = useState<string>('ติดสังคม');
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
  const [otherDisease, setOtherDisease] = useState('');
  const [allergies, setAllergies] = useState('');
  const [currentMedicationsText, setCurrentMedicationsText] = useState('');
  const [notes, setNotes] = useState('');
  const [caregiverContacts, setCaregiverContacts] = useState<CaregiverContact[]>([]);

  // Form states for VHV specific fields
  const [vhvCode, setVhvCode] = useState('');
  const [vhvOrganization, setVhvOrganization] = useState('');
  const [vhvCenterProvince, setVhvCenterProvince] = useState('');
  const [vhvCenterDistrict, setVhvCenterDistrict] = useState('');
  const [vhvCenterSubdistrict, setVhvCenterSubdistrict] = useState('');

  // New patient form for caregiver
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientLastName, setNewPatientLastName] = useState('');
  const [newPatientBirthDate, setNewPatientBirthDate] = useState('1956-01-01');
  const [newPatientAge, setNewPatientAge] = useState<number>(70);
  const [newPatientPhone, setNewPatientPhone] = useState('');
  const [newPatientStatus, setNewPatientStatus] = useState<string>('ติดสังคม');
  const [newPatientDiseases, setNewPatientDiseases] = useState<string[]>(['ความดันโลหิตสูง']);

  // Initialize form states when opening or user/profile changes
  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName || '');
      setLastName(currentUser.lastName || '');
      setPhone(currentUser.phone || '');
    }

    if (currentUser?.role === 'PATIENT' && currentPatientProfile) {
      setHouseNo(currentPatientProfile.address.houseNo || '');
      setAlley(currentPatientProfile.address.alley || '');
      setMoo(currentPatientProfile.address.moo || '');
      setSubdistrict(currentPatientProfile.address.subdistrict || '');
      setDistrict(currentPatientProfile.address.district || '');
      setProvince(currentPatientProfile.address.province || '');

      setBirthDate(currentPatientProfile.birthDate || '1956-05-15');
      setAge(currentPatientProfile.age || 70);
      setStatus(currentPatientProfile.status || 'ติดสังคม');
      setSelectedDiseases(currentPatientProfile.diseases || []);
      setOtherDisease(currentPatientProfile.otherDisease || '');
      setAllergies(currentPatientProfile.allergies || '');
      setCurrentMedicationsText(currentPatientProfile.currentMedicationsText || '');
      setNotes(currentPatientProfile.notes || '');
      setCaregiverContacts(currentPatientProfile.caregiverContacts || []);
    } else if (currentUser?.role === 'VHV' && currentVhvProfile) {
      setHouseNo(currentVhvProfile.houseNo || '');
      setAlley(currentVhvProfile.alley || '');
      setMoo(currentVhvProfile.moo || '');
      setSubdistrict(currentVhvProfile.subdistrict || '');
      setDistrict(currentVhvProfile.district || '');
      setProvince(currentVhvProfile.province || '');
      setVhvCode(currentVhvProfile.vhvCode || '');
      setVhvOrganization(currentVhvProfile.organization || '');
      setVhvCenterProvince(currentVhvProfile.centerProvince || currentVhvProfile.province || 'เชียงใหม่');
      setVhvCenterDistrict(currentVhvProfile.centerDistrict || currentVhvProfile.district || 'เมืองเชียงใหม่');
      setVhvCenterSubdistrict(currentVhvProfile.centerSubdistrict || currentVhvProfile.subdistrict || 'สุเทพ');
    } else if (currentUser?.role === 'CAREGIVER' && currentCaregiverProfile) {
      setHouseNo(currentCaregiverProfile.houseNo || '123/45');
      setAlley(currentCaregiverProfile.alley || 'ซอย 5');
      setMoo(currentCaregiverProfile.moo || 'หมู่ 2');
      setSubdistrict(currentCaregiverProfile.subdistrict || 'สุเทพ');
      setDistrict(currentCaregiverProfile.district || 'เมืองเชียงใหม่');
      setProvince(currentCaregiverProfile.province || 'เชียงใหม่');
    }
  }, [currentUser, currentPatientProfile, currentVhvProfile, currentCaregiverProfile, isEditing]);

  if (!currentUser) return null;

  const handleDiseaseToggle = (disease: string) => {
    setSelectedDiseases(prev =>
      prev.includes(disease) ? prev.filter(d => d !== disease) : [...prev, disease]
    );
  };

  const handleAddCaregiverContact = () => {
    if (caregiverContacts.length >= 5) return;
    setCaregiverContacts(prev => [...prev, { name: '', phone: '', relationship: '' }]);
  };

  const handleRemoveCaregiverContact = (idx: number) => {
    setCaregiverContacts(prev => prev.filter((_, i) => i !== idx));
  };

  const handleCaregiverContactChange = (idx: number, field: keyof CaregiverContact, val: string) => {
    setCaregiverContacts(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: val };
      return updated;
    });
  };

  const handleSelectVhvCenter = (center: {
    name: string;
    province: string;
    district: string;
    subdistrict: string;
  }) => {
    setVhvOrganization(center.name);
    setVhvCenterProvince(center.province);
    setVhvCenterDistrict(center.district);
    setVhvCenterSubdistrict(center.subdistrict);
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      showToast('กรุณากรอกชื่อ นามสกุล และเบอร์โทรศัพท์ให้ครบถ้วน');
      return;
    }

    // 1. Update Core User Account
    updateUserAccount({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim()
    });

    // 2. Update Role Specific Profile
    if (currentUser.role === 'PATIENT' && currentPatientProfile) {
      updatePatientProfile(currentPatientProfile.id, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        birthDate,
        age: Number(age) || currentPatientProfile.age,
        status: status as any,
        diseases: selectedDiseases,
        otherDisease: otherDisease.trim(),
        allergies: allergies.trim(),
        currentMedicationsText: currentMedicationsText.trim(),
        notes: notes.trim(),
        caregiverContacts: caregiverContacts.filter(c => c.name.trim() !== ''),
        address: {
          houseNo: houseNo.trim(),
          alley: alley.trim(),
          moo: moo.trim(),
          subdistrict: subdistrict.trim(),
          district: district.trim(),
          province: province.trim()
        }
      });
    } else if (currentUser.role === 'VHV' && currentVhvProfile) {
      updateVhvProfile(currentVhvProfile.id, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        houseNo: houseNo.trim(),
        alley: alley.trim(),
        moo: moo.trim(),
        subdistrict: subdistrict.trim(),
        district: district.trim(),
        province: province.trim(),
        vhvCode: vhvCode.trim() || currentVhvProfile.vhvCode,
        organization: vhvOrganization.trim() || currentVhvProfile.organization,
        centerProvince: vhvCenterProvince.trim(),
        centerDistrict: vhvCenterDistrict.trim(),
        centerSubdistrict: vhvCenterSubdistrict.trim()
      });
    } else if (currentUser.role === 'CAREGIVER' && currentCaregiverProfile) {
      updateCaregiverProfile(currentCaregiverProfile.id, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        houseNo: houseNo.trim(),
        alley: alley.trim(),
        moo: moo.trim(),
        subdistrict: subdistrict.trim(),
        district: district.trim(),
        province: province.trim(),
        address: `${houseNo} ${alley ? 'ซ.' + alley : ''} ${moo ? 'ม.' + moo : ''} ต.${subdistrict} อ.${district} จ.${province}`.trim()
      });
    }

    setIsEditing(false);
    showToast('บันทึกข้อมูลเรียบร้อยแล้ว');
  };

  const handleAddPatientFromCaregiver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim() || !newPatientLastName.trim()) {
      showToast('กรุณากรอกชื่อและนามสกุลของผู้ป่วย');
      return;
    }

    addPatientToCaregiver({
      firstName: newPatientName.trim(),
      lastName: newPatientLastName.trim(),
      phone: newPatientPhone.trim() || '0800000000',
      birthDate: newPatientBirthDate || '1955-01-01',
      age: Number(newPatientAge) || 70,
      address: {
        province: province || 'เชียงใหม่',
        district: district || 'เมืองเชียงใหม่',
        subdistrict: subdistrict || 'สุเทพ',
        houseNo: houseNo || '1',
        alley: alley || '',
        moo: moo || '',
      },
      diseases: newPatientDiseases,
      status: newPatientStatus as any,
      caregiverContacts: [
        { name: `${currentUser.firstName} ${currentUser.lastName}`, phone: currentUser.phone, relationship: 'ผู้ดูแลหลัก' }
      ]
    });

    setIsAddPatientModalOpen(false);
    setNewPatientName('');
    setNewPatientLastName('');
    setNewPatientPhone('');
    setNewPatientBirthDate('1956-01-01');
    setNewPatientAge(70);
  };

  const handleSaveEditedPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatient) return;

    updatePatientProfile(editingPatient.id, {
      firstName: editingPatient.firstName,
      lastName: editingPatient.lastName,
      phone: editingPatient.phone,
      age: Number(editingPatient.age) || 70,
      status: editingPatient.status,
      diseases: editingPatient.diseases,
      allergies: editingPatient.allergies,
      notes: editingPatient.notes,
    });

    setEditingPatient(null);
    showToast(`อัปเดตข้อมูลผู้ป่วยคุณ${editingPatient.firstName} เรียบร้อยแล้ว`);
  };

  const getDeviceLabel = () => {
    switch (deviceType) {
      case 'phone':
        return 'โทรศัพท์';
      case 'tablet':
        return 'iPad / Tablet';
      case 'desktop':
        return 'คอมพิวเตอร์';
      default:
        return 'โทรศัพท์';
    }
  };

  const getRoleBadge = () => {
    switch (currentUser.role) {
      case 'PATIENT':
        return { label: 'ผู้ป่วย / ผู้สูงอายุ', color: 'bg-emerald-100 text-emerald-800' };
      case 'CAREGIVER':
        return { label: 'ผู้ดูแล / ญาติ', color: 'bg-blue-100 text-blue-800' };
      case 'VHV':
        return { label: 'อสม. (อาสาสมัครสาธารณสุขประจำหมู่บ้าน)', color: 'bg-purple-100 text-purple-800' };
      default:
        return { label: 'ผู้ใช้งาน', color: 'bg-slate-100 text-slate-800' };
    }
  };

  const roleInfo = getRoleBadge();

  // Caregiver managed patients resolution from allPatients
  const caregiverManagedPatients = currentUser.role === 'CAREGIVER' && currentCaregiverProfile
    ? currentCaregiverProfile.managedPatients.map(mp => allPatients.find(p => p.id === mp.id) || mp)
    : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-md shadow-blue-100 shrink-0">
              {currentUser.firstName ? currentUser.firstName.charAt(0) : 'ผ'}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {currentUser.firstName} {currentUser.lastName}
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${roleInfo.color}`}>
                  {roleInfo.label}
                </span>
                {currentUser.role === 'PATIENT' && currentPatientProfile?.status && (
                  <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                    สถานะ: {currentPatientProfile.status}
                  </span>
                )}
                {currentUser.role === 'VHV' && currentVhvProfile?.vhvCode && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-md">
                    <BadgeCheck className="w-3.5 h-3.5 text-purple-600" />
                    รหัส: {currentVhvProfile.vhvCode}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <VoiceReaderButton
              textToRead={`ข้อมูลโปรไฟล์ของคุณ ${currentUser.firstName} ${currentUser.lastName} บทบาท ${roleInfo.label}`}
              label="ฟังข้อมูล"
              size="sm"
            />
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-xs hover:shadow transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 self-start sm:self-center"
              >
                <Edit3 className="w-4 h-4" />
                แก้ไขข้อมูล
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-2xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-center"
              >
                <X className="w-4 h-4" />
                ยกเลิก
              </button>
            )}
          </div>
        </div>

        {/* View Mode vs Edit Mode Content */}
        {!isEditing ? (
          <div className="pt-6 space-y-6 text-xs sm:text-sm text-slate-700">
            {/* General Info */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="font-bold text-slate-900 flex items-center gap-2 text-xs sm:text-sm">
                <User className="w-4 h-4 text-blue-700" />
                ข้อมูลส่วนบุคคลทั่วไป (Personal Details)
              </span>

              <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 p-2 sm:p-3">
                <div className="flex items-center justify-between gap-3 py-2 px-2 text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium shrink-0">ชื่อ - นามสกุล</span>
                  <strong className="text-slate-900 font-bold text-right">
                    {currentUser.firstName} {currentUser.lastName}
                  </strong>
                </div>

                <div className="flex items-center justify-between gap-3 py-2 px-2 text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium shrink-0">เบอร์โทรศัพท์</span>
                  <strong className="text-blue-700 font-bold text-right">{currentUser.phone}</strong>
                </div>

                {currentUser.role === 'PATIENT' && currentPatientProfile && (
                  <div className="flex items-center justify-between gap-3 py-2 px-2 text-xs sm:text-sm">
                    <span className="text-slate-500 font-medium shrink-0">วันเกิด / อายุ</span>
                    <strong className="text-slate-900 font-bold text-right">
                      {currentPatientProfile.birthDate || '-'} (อายุ {currentPatientProfile.age} ปี)
                    </strong>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 py-2 px-2 text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium shrink-0">บทบาทผู้ใช้งาน</span>
                  <span className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded-full text-right ${roleInfo.color}`}>
                    {roleInfo.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="font-bold text-slate-900 flex items-center gap-2 text-xs sm:text-sm">
                <MapPin className="w-4 h-4 text-blue-700" />
                ข้อมูลที่อยู่ (Address)
              </span>

              <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 p-2 sm:p-3">
                <div className="flex items-center justify-between gap-3 py-2 px-2 text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium shrink-0">บ้านเลขที่</span>
                  <strong className="text-slate-900 font-bold text-right">{houseNo || '-'}</strong>
                </div>
                <div className="flex items-center justify-between gap-3 py-2 px-2 text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium shrink-0">ซอย / หมู่</span>
                  <strong className="text-slate-900 font-bold text-right">
                    {alley ? `ซอย ${alley}` : '-'} {moo ? `หมู่ ${moo}` : ''}
                  </strong>
                </div>
                <div className="flex items-center justify-between gap-3 py-2 px-2 text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium shrink-0">ตำบล / แขวง</span>
                  <strong className="text-slate-900 font-bold text-right">{subdistrict || '-'}</strong>
                </div>
                <div className="flex items-center justify-between gap-3 py-2 px-2 text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium shrink-0">อำเภอ / เขต</span>
                  <strong className="text-slate-900 font-bold text-right">{district || '-'}</strong>
                </div>
                <div className="flex items-center justify-between gap-3 py-2 px-2 text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium shrink-0">จังหวัด</span>
                  <strong className="text-slate-900 font-bold text-right">{province || '-'}</strong>
                </div>
              </div>
            </div>

            {/* PATIENT Detailed Health Summary Card */}
            {currentUser.role === 'PATIENT' && currentPatientProfile && (
              <div className="space-y-4">
                <div className="p-5 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-950 flex items-center gap-2 text-xs sm:text-sm">
                      <Stethoscope className="w-4 h-4 text-blue-700" />
                      ข้อมูลสุขภาพและโรคประจำตัว (Health & Diseases)
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full text-right">
                      สถานะ: {currentPatientProfile.status}
                    </span>
                  </div>

                  <div className="bg-white rounded-xl border border-blue-100 divide-y divide-blue-50 p-2 sm:p-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 px-2 text-xs sm:text-sm">
                      <span className="text-slate-500 font-medium shrink-0">โรคประจำตัว</span>
                      <div className="flex flex-wrap gap-1.5 justify-start sm:justify-end">
                        {currentPatientProfile.diseases && currentPatientProfile.diseases.length > 0 ? (
                          currentPatientProfile.diseases.map((d, i) => (
                            <span key={i} className="px-2.5 py-0.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-lg border border-rose-200">
                              {d}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-500 text-xs">ไม่มีโรคประจำตัว</span>
                        )}
                        {currentPatientProfile.otherDisease && (
                          <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg border border-amber-200">
                            {currentPatientProfile.otherDisease}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 py-2 px-2 text-xs sm:text-sm">
                      <span className="text-slate-500 font-medium shrink-0">ประวัติแพ้ยา / แพ้อาหาร</span>
                      <strong className="text-rose-700 font-bold text-right">
                        {currentPatientProfile.allergies || 'ไม่มีประวัติแพ้'}
                      </strong>
                    </div>

                    {currentPatientProfile.currentMedicationsText && (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 py-2 px-2 text-xs sm:text-sm">
                        <span className="text-slate-500 font-medium shrink-0">ยาที่ใช้ประจำ</span>
                        <p className="text-slate-800 font-bold text-left sm:text-right">
                          {currentPatientProfile.currentMedicationsText}
                        </p>
                      </div>
                    )}

                    {currentPatientProfile.notes && (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 py-2 px-2 text-xs sm:text-sm">
                        <span className="text-slate-500 font-medium shrink-0">หมายเหตุสุขภาพ</span>
                        <p className="text-slate-800 font-medium text-left sm:text-right">
                          {currentPatientProfile.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Emergency Caregiver Contacts */}
                {currentPatientProfile.caregiverContacts && currentPatientProfile.caregiverContacts.length > 0 && (
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <span className="font-bold text-slate-900 flex items-center gap-2 text-xs sm:text-sm">
                      <Shield className="w-4 h-4 text-blue-600" />
                      ข้อมูลญาติ / ผู้ดูแลที่ติดต่อได้ฉุกเฉิน ({currentPatientProfile.caregiverContacts.length} ท่าน)
                    </span>
                    <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 p-2 sm:p-3">
                      {currentPatientProfile.caregiverContacts.map((c, i) => (
                        <div key={i} className="flex items-center justify-between gap-3 py-2 px-2 text-xs sm:text-sm">
                          <div>
                            <strong className="text-slate-900 block font-bold">{c.name}</strong>
                            <span className="text-slate-500 text-[11px]">ความสัมพันธ์: {c.relationship || 'ผู้ดูแล'}</span>
                          </div>
                          <a
                            href={`tel:${c.phone}`}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg border border-blue-200 transition-colors flex items-center gap-1 shrink-0 text-right"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            {c.phone}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CAREGIVER Managed Patients Block */}
            {currentUser.role === 'CAREGIVER' && currentCaregiverProfile && (
              <div className="p-5 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-blue-950 flex items-center gap-2 text-xs sm:text-sm">
                      <Users className="w-4 h-4 text-blue-700" />
                      ผู้ป่วย / ผู้สูงอายุในความดูแล ({caregiverManagedPatients.length}/5 คน)
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      คุณสามารถจัดการและแก้ไขข้อมูลสุขภาพของผู้ป่วยแต่ละคนได้โดยตรง
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddPatientModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    + เพิ่มผู้ป่วยที่ดูแล
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {caregiverManagedPatients.map(p => (
                    <div key={p.id} className="p-4 bg-white rounded-2xl border border-blue-100 shadow-xs space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <strong className="text-slate-900 text-sm block font-bold">
                            {p.firstName} {p.lastName}
                          </strong>
                          <span className="text-xs text-slate-500">อายุ {p.age} ปี • โทร {p.phone}</span>
                        </div>
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full text-right">
                          {p.status}
                        </span>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-2.5 space-y-1 text-xs">
                        <div className="flex justify-between items-center text-slate-600">
                          <span className="text-slate-500">โรคประจำตัว:</span>
                          <span className="font-bold text-slate-900 text-right">
                            {p.diseases && p.diseases.length > 0 ? p.diseases.join(', ') : 'ไม่มี'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600">
                          <span className="text-slate-500">เบอร์โทร:</span>
                          <span className="font-bold text-blue-700 text-right">{p.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setEditingPatient(p)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          แก้ไขข้อมูล
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`ต้องการนำคุณ ${p.firstName} ออกจากการดูแลหรือไม่?`)) {
                              removePatientFromCaregiver(currentCaregiverProfile.id, p.id);
                            }
                          }}
                          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VHV Specific Information Block */}
            {currentUser.role === 'VHV' && (
              <div className="p-5 bg-purple-50/70 rounded-2xl border border-purple-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-950 flex items-center gap-2 text-xs sm:text-sm">
                    <Building2 className="w-4 h-4 text-purple-700" />
                    ข้อมูลสังกัดและศูนย์ อสม. (VHV Center Affiliation)
                  </span>
                  <span className="px-2.5 py-0.5 bg-purple-200/80 text-purple-900 text-[11px] font-bold rounded-full text-right">
                    สังกัดที่บันทึกไว้
                  </span>
                </div>

                <div className="bg-white rounded-xl border border-purple-200 shadow-xs divide-y divide-purple-100 p-2 sm:p-3 text-xs sm:text-sm">
                  <div className="flex items-center justify-between gap-3 py-2 px-2">
                    <span className="text-slate-500 font-medium shrink-0">สังกัด / ศูนย์ อสม.</span>
                    <strong className="text-purple-900 font-bold text-right">
                      {vhvOrganization || currentVhvProfile?.organization || 'ยังไม่ได้ระบุสังกัด'}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between gap-3 py-2 px-2">
                    <span className="text-slate-500 font-medium shrink-0">รหัสประจำตัว อสม.</span>
                    <strong className="font-mono font-bold text-slate-800 text-right">
                      {vhvCode || currentVhvProfile?.vhvCode || 'VHV-5001'}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between gap-3 py-2 px-2">
                    <span className="text-slate-500 font-medium shrink-0">พื้นที่รับผิดชอบ (ตำบล)</span>
                    <strong className="text-slate-900 font-bold text-right">
                      {vhvCenterSubdistrict || subdistrict || '-'}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between gap-3 py-2 px-2">
                    <span className="text-slate-500 font-medium shrink-0">อำเภอ / จังหวัด</span>
                    <strong className="text-slate-900 font-bold text-right">
                      {vhvCenterDistrict || district || '-'} จ.{vhvCenterProvince || province || '-'}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy & Permissions Section for Patient */}
            {currentUser.role === 'PATIENT' && currentPatientProfile && (
              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-3">
                <span className="font-bold text-blue-900 flex items-center gap-2 text-xs sm:text-sm">
                  <Shield className="w-4 h-4 text-blue-700" />
                  ความเป็นส่วนตัวและการอนุญาต (Privacy & Permissions)
                </span>
                <div className="space-y-2 bg-white p-3 rounded-xl border border-blue-100">
                  <label className="block text-xs font-bold text-slate-800">
                    การอนุญาตให้ อสม. เข้าถึงและแก้ไขข้อมูลสุขภาพ
                  </label>
                  <p className="text-[11px] text-slate-500">
                    เลือกสิทธิ์การเข้าถึงข้อมูลสำหรับ อสม. ในความดูแลของคุณ
                  </p>
                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="vhvPerm"
                        checked={(getPatientVhvPermission(currentPatientProfile.id) || 'granted') === 'granted'}
                        onChange={() => {
                          setPatientVhvPermission(currentPatientProfile.id, 'granted');
                          showToast('อัปเดตสิทธิ์การเข้าถึงของ อสม. เป็น "อนุญาต" แล้ว');
                        }}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>● <strong>อนุญาต</strong> (อสม. สามารถดู เพิ่ม และแก้ไขข้อมูลสุขภาพได้ตลอด)</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="vhvPerm"
                        checked={getPatientVhvPermission(currentPatientProfile.id) === 'granted_once'}
                        onChange={() => {
                          setPatientVhvPermission(currentPatientProfile.id, 'granted_once');
                          showToast('อัปเดตสิทธิ์การเข้าถึงของ อสม. เป็น "เฉพาะครั้งนี้" แล้ว');
                        }}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>○ <strong>เฉพาะครั้งนี้</strong> (อนุญาตให้ อสม. จัดการข้อมูลเฉพาะครั้งนี้)</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="vhvPerm"
                        checked={getPatientVhvPermission(currentPatientProfile.id) === 'denied'}
                        onChange={() => {
                          setPatientVhvPermission(currentPatientProfile.id, 'denied');
                          showToast('อัปเดตสิทธิ์การเข้าถึงของ อสม. เป็น "ไม่อนุญาต" แล้ว');
                        }}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>○ <strong>ไม่อนุญาต</strong> (อสม. ดูข้อมูลได้เท่านั้น ไม่สามารถแก้ไขได้)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* User Guide and Help Card */}
            <div className="p-5 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 rounded-2xl border border-indigo-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-indigo-100 text-indigo-800 text-[11px] font-bold rounded-full">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  คำแนะนำการใช้งาน
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  คู่มือสอนวิธีการใช้งานระบบ & คำแนะนำโปรไฟล์
                </h4>
                <p className="text-xs text-slate-600">
                  เรียนรู้วิธีการใช้งานสำหรับบทบาท{roleInfo.label} และวิธีตั้งค่าโปรไฟล์ การแก้ไขข้อมูลส่วนตัว
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => openUserGuide('PROFILE')}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-slate-50 text-indigo-900 font-bold rounded-xl text-xs border border-indigo-200 shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  <span>คู่มือโปรไฟล์</span>
                </button>

                <button
                  type="button"
                  onClick={() => openUserGuide()}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>เปิดคู่มือการใช้งานทั้งหมด</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* EDIT MODE FORM (Fully Editable Profile for all roles)                     */
          /* ========================================================================= */
          <form onSubmit={handleSaveChanges} className="pt-6 space-y-6">
            <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200">
              <h3 className="font-bold text-sm sm:text-base text-blue-950 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-700" />
                แก้ไขข้อมูลส่วนตัวและข้อมูลสุขภาพ
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                กรอกหรือแก้ไขข้อมูลส่วนบุคคล ที่อยู่ และสุขภาพให้เป็นปัจจุบัน แล้วกด "บันทึกการเปลี่ยนแปลง"
              </p>
            </div>

            {/* General Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-700" />
                1. ข้อมูลส่วนบุคคลทั่วไป
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    ชื่อ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="เช่น สมศรี"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    นามสกุล <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="เช่น ใจดี"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    เบอร์โทรศัพท์ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="เช่น 0812345678"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* PATIENT EDIT HEALTH FIELDS */}
            {currentUser.role === 'PATIENT' && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-blue-700" />
                  2. ข้อมูลสุขภาพ วันเกิด และการช่วยเหลือตัวเอง
                </h4>

                {/* Birth Date (Supports Direct Typing & BE/CE) */}
                <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200">
                  <BirthDateInput
                    value={birthDate}
                    age={age}
                    onChange={(iso, calculatedAge) => {
                      setBirthDate(iso);
                      setAge(calculatedAge);
                    }}
                    onAgeChange={(newAge) => setAge(newAge)}
                  />
                </div>

                {/* Status Options with Full Descriptions */}
                <div>
                  <PatientStatusSelector
                    value={status}
                    onChange={(st) => setStatus(st)}
                    label="สถานะสุขภาพ / การช่วยเหลือตัวเอง (ADL Health Status)"
                  />
                </div>

                {/* Chronic Diseases Chips */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    โรคประจำตัว (เลือกได้หลายข้อ)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CHRONIC_DISEASES.map(disease => {
                      const isSelected = selectedDiseases.includes(disease);
                      return (
                        <button
                          key={disease}
                          type="button"
                          onClick={() => handleDiseaseToggle(disease)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}{disease}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      โรคประจำตัวอื่นๆ (ถ้ามี)
                    </label>
                    <input
                      type="text"
                      value={otherDisease}
                      onChange={e => setOtherDisease(e.target.value)}
                      placeholder="ระบุโรคประจำตัวอื่นๆ เพิ่มเติม..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Allergies */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    ประวัติการแพ้ยา / แพ้อาหาร
                  </label>
                  <input
                    type="text"
                    value={allergies}
                    onChange={e => setAllergies(e.target.value)}
                    placeholder="เช่น แพ้ยา Penicillin มีผื่นคัน หรือ แพ้อาหารทะเล"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                {/* Current medications summary */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    ยาที่ใช้ประจำโดยสังเขป
                  </label>
                  <textarea
                    rows={2}
                    value={currentMedicationsText}
                    onChange={e => setCurrentMedicationsText(e.target.value)}
                    placeholder="เช่น ยาลดความดัน Amlodipine 5mg วันละ 1 เม็ดเช้า, ยาเบาหวาน Metformin 500mg"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                {/* Health Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    หมายเหตุสุขภาพ / ข้อควรระวังพิเศษ
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="เช่น ต้องตรวจระดับน้ำตาลในเลือดสัปดาห์ละ 2 ครั้ง หรือ ระวังเรื่องการล้ม"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                {/* Caregiver Contacts List */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800">
                      ข้อมูลญาติผู้ดูแลฉุกเฉิน (สูงสุด 5 ท่าน)
                    </label>
                    <button
                      type="button"
                      onClick={handleAddCaregiverContact}
                      disabled={caregiverContacts.length >= 5}
                      className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      เพิ่มญาติ
                    </button>
                  </div>

                  {caregiverContacts.map((contact, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center">
                      <input
                        type="text"
                        placeholder="ชื่อญาติ"
                        value={contact.name}
                        onChange={e => handleCaregiverContactChange(idx, 'name', e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                      />
                      <input
                        type="text"
                        placeholder="ความสัมพันธ์ (เช่น ลูกชาย)"
                        value={contact.relationship}
                        onChange={e => handleCaregiverContactChange(idx, 'relationship', e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="tel"
                          placeholder="เบอร์โทรศัพท์"
                          value={contact.phone}
                          onChange={e => handleCaregiverContactChange(idx, 'phone', e.target.value)}
                          className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveCaregiverContact(idx)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Address Form (แยกช่องชัดเจน) */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-700" />
                {currentUser.role === 'PATIENT' ? '3.' : '2.'} ข้อมูลที่อยู่ (แยกช่องชัดเจน)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    บ้านเลขที่
                  </label>
                  <input
                    type="text"
                    value={houseNo}
                    onChange={e => setHouseNo(e.target.value)}
                    placeholder="เช่น 123/45"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    ซอย
                  </label>
                  <input
                    type="text"
                    value={alley}
                    onChange={e => setAlley(e.target.value)}
                    placeholder="เช่น ซอย 5 หรือ -"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    หมู่ที่
                  </label>
                  <input
                    type="text"
                    value={moo}
                    onChange={e => setMoo(e.target.value)}
                    placeholder="เช่น หมู่ 2 หรือ -"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    ตำบล / แขวง
                  </label>
                  <input
                    type="text"
                    value={subdistrict}
                    onChange={e => setSubdistrict(e.target.value)}
                    placeholder="เช่น สุเทพ"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    อำเภอ / เขต
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    placeholder="เช่น เมืองเชียงใหม่"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    จังหวัด
                  </label>
                  <input
                    type="text"
                    value={province}
                    onChange={e => setProvince(e.target.value)}
                    placeholder="เช่น เชียงใหม่"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* VHV Specific Affiliation Block */}
            {currentUser.role === 'VHV' && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wide flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-purple-700" />
                    3. ข้อมูลเฉพาะ อสม. & ค้นหาสังกัดศูนย์
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      รหัสประจำตัว อสม. <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={vhvCode}
                      onChange={e => setVhvCode(e.target.value)}
                      placeholder="เช่น VHV-CM-5001"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      สังกัดศูนย์ อสม. / รพ.สต. <span className="text-rose-500">*</span>
                    </label>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        readOnly
                        value={vhvOrganization || 'ยังไม่ได้เลือกสังกัด'}
                        placeholder="กดปุ่มค้นหาสังกัดด้านขวา..."
                        className="flex-1 px-3.5 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 cursor-not-allowed"
                      />
                      <button
                        type="button"
                        onClick={() => setIsCenterModalOpen(true)}
                        className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
                      >
                        <Search className="w-4 h-4" />
                        {vhvOrganization ? 'เปลี่ยนสังกัด' : '🔍 ค้นหาสังกัด'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                บันทึกการเปลี่ยนแปลง
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Voice Reader Settings Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
              voiceReaderEnabled ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'
            }`}>
              {voiceReaderEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </div>
            <div>
              <span className="font-bold text-slate-900 flex items-center gap-2 text-xs sm:text-sm">
                ระบบอ่านออกเสียง (Text-to-Speech)
                {voiceReaderEnabled && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full">
                    เปิดใช้งานอยู่
                  </span>
                )}
              </span>
              <p className="text-[11px] text-slate-500">
                อ่านออกเสียงประกาศ ข้อมูลสุขภาพ รายการตรวจ และคำแนะนำอัตโนมัติหรือตามสั่ง
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const newState = !voiceReaderEnabled;
              setVoiceReaderEnabled(newState);
              showToast(newState ? 'เปิดใช้งานระบบอ่านออกเสียงเรียบร้อยแล้ว' : 'ปิดระบบอ่านออกเสียงเรียบร้อยแล้ว');
            }}
            className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              voiceReaderEnabled ? 'bg-blue-600' : 'bg-slate-300'
            }`}
            role="switch"
            aria-checked={voiceReaderEnabled}
            aria-label="เปิด/ปิด ระบบอ่านออกเสียง"
          >
            <span
              className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                voiceReaderEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className={`p-4 rounded-2xl border transition-all space-y-3 ${
          voiceReaderEnabled 
            ? 'bg-blue-50/70 border-blue-200' 
            : 'bg-slate-50 border-slate-200 opacity-70'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <strong className={`block font-bold ${voiceReaderEnabled ? 'text-blue-950' : 'text-slate-700'}`}>
                {voiceReaderEnabled 
                  ? 'ระบบอ่านออกเสียงเปิดใช้งานอยู่' 
                  : 'ระบบอ่านออกเสียงถูกปิดอยู่'}
              </strong>
              <p className="text-[11px] text-slate-600">
                {currentUser.role === 'VHV' 
                  ? 'เมื่อเปิดใช้งาน ปุ่มฟังเสียงอ่านจะปรากฏในหน้าคิวตรวจผู้สูงอายุ รายละเอียดสุขภาพ และรายการประกาศ เพื่อช่วย อสม. ฟังข้อมูลขณะลงพื้นที่' 
                  : 'เมื่อเปิดใช้งาน ระบบจะมีปุ่มฟังเสียงอ่านในหน้าประกาศ สัญญาณชีพ และข้อมูลสุขภาพต่างๆ'}
              </p>
            </div>

            <div className="shrink-0">
              <VoiceReaderButton
                textToRead={
                  currentUser.role === 'VHV'
                    ? `สวัสดีครับ อาสาสมัครสาธารณสุขประจำหมู่บ้าน คุณ${currentUser.firstName} ${currentUser.lastName} ระบบอ่านออกเสียงสำหรับ อสม. พร้อมใช้งานแล้วครับ`
                    : `สวัสดีครับ คุณ${currentUser.firstName} ${currentUser.lastName} ระบบอ่านออกเสียงพร้อมใช้งานแล้วครับ`
                }
                label="ทดสอบฟังเสียง"
                size="sm"
                forceShow={true}
                className={voiceReaderEnabled ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300 border-none'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logout Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <button
          onClick={logout}
          className="w-full py-3.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-2xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 border border-red-200"
        >
          <LogOut className="w-4 h-4" />
          ออกจากระบบ
        </button>
      </div>

      {/* VHV Center Search Modal */}
      <VhvCenterSearchModal
        isOpen={isCenterModalOpen}
        onClose={() => setIsCenterModalOpen(false)}
        onSelectCenter={handleSelectVhvCenter}
        userCoords={userCoords}
        locationPermission={locationPermission}
      />

      {/* Caregiver: Add Patient Modal */}
      {isAddPatientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-lg text-slate-900">+ เพิ่มผู้ป่วย/ผู้สูงอายุในความดูแล</h3>
                <p className="text-xs text-slate-500">กรอกข้อมูลผู้ป่วยที่คุณต้องการดูแล</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddPatientModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddPatientFromCaregiver} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">ชื่อ <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น สมศรี"
                    value={newPatientName}
                    onChange={e => setNewPatientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">นามสกุล <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น ใจดี"
                    value={newPatientLastName}
                    onChange={e => setNewPatientLastName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                  />
                </div>
              </div>

              {/* Birth Date & Age */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <BirthDateInput
                  value={newPatientBirthDate}
                  age={newPatientAge}
                  onChange={(iso, calculatedAge) => {
                    setNewPatientBirthDate(iso);
                    setNewPatientAge(calculatedAge);
                  }}
                  onAgeChange={(newAge) => setNewPatientAge(newAge)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">เบอร์โทรศัพท์</label>
                <input
                  type="tel"
                  placeholder="เช่น 0812345678"
                  value={newPatientPhone}
                  onChange={e => setNewPatientPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                />
              </div>

              {/* Status Selector */}
              <div>
                <PatientStatusSelector
                  value={newPatientStatus}
                  onChange={(st) => setNewPatientStatus(st)}
                  label="สถานะสุขภาพ / การช่วยเหลือตัวเอง"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">โรคประจำตัว</label>
                <div className="flex flex-wrap gap-1.5">
                  {CHRONIC_DISEASES.slice(0, 6).map(d => {
                    const isSel = newPatientDiseases.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setNewPatientDiseases(prev => isSel ? prev.filter(x => x !== d) : [...prev, d])}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          isSel ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddPatientModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  บันทึกผู้ป่วย
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Caregiver: Edit Patient Modal */}
      {editingPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-lg text-slate-900">✏️ แก้ไขข้อมูลคุณ{editingPatient.firstName}</h3>
                <p className="text-xs text-slate-500">แก้ไขข้อมูลสุขภาพและสถานะ</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingPatient(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedPatient} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">ชื่อ</label>
                  <input
                    type="text"
                    required
                    value={editingPatient.firstName}
                    onChange={e => setEditingPatient({ ...editingPatient, firstName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">นามสกุล</label>
                  <input
                    type="text"
                    required
                    value={editingPatient.lastName}
                    onChange={e => setEditingPatient({ ...editingPatient, lastName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                  />
                </div>
              </div>

              {/* Birth Date & Age */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <BirthDateInput
                  value={editingPatient.birthDate || '1956-01-01'}
                  age={editingPatient.age || 70}
                  onChange={(iso, calculatedAge) => {
                    setEditingPatient({
                      ...editingPatient,
                      birthDate: iso,
                      age: calculatedAge
                    });
                  }}
                  onAgeChange={(newAge) => {
                    setEditingPatient({
                      ...editingPatient,
                      age: newAge
                    });
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">เบอร์โทรศัพท์</label>
                <input
                  type="tel"
                  value={editingPatient.phone}
                  onChange={e => setEditingPatient({ ...editingPatient, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                />
              </div>

              {/* Status with descriptions */}
              <div>
                <PatientStatusSelector
                  value={editingPatient.status || 'ติดสังคม'}
                  onChange={(st) => setEditingPatient({ ...editingPatient, status: st as any })}
                  label="สถานะสุขภาพ / การช่วยเหลือตัวเอง (ADL Status)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">โรคประจำตัว</label>
                <div className="flex flex-wrap gap-1.5">
                  {CHRONIC_DISEASES.map(d => {
                    const isSel = editingPatient.diseases?.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          const cur = editingPatient.diseases || [];
                          const updated = isSel ? cur.filter(x => x !== d) : [...cur, d];
                          setEditingPatient({ ...editingPatient, diseases: updated });
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          isSel ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">ประวัติแพ้ยา / แพ้อาหาร</label>
                <input
                  type="text"
                  value={editingPatient.allergies || ''}
                  onChange={e => setEditingPatient({ ...editingPatient, allergies: e.target.value })}
                  placeholder="เช่น แพ้ยา Penicillin หรือ ไม่มี"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">หมายเหตุการดูแล</label>
                <textarea
                  rows={2}
                  value={editingPatient.notes || ''}
                  onChange={e => setEditingPatient({ ...editingPatient, notes: e.target.value })}
                  placeholder="ข้อความระวังหรือคำแนะนำการดูแล..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPatient(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  บันทึกการแก้ไข
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
