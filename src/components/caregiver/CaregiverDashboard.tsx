import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PatientProfile, CHRONIC_DISEASES } from '../../types';
import {
  ShieldCheck,
  Calendar,
  HeartPulse,
  Building2,
  Stethoscope,
  Pill,
  ArrowLeft,
  Search,
  Users,
  Plus,
  Edit3,
  Trash2,
  Phone,
  MapPin,
  Filter,
  UserX,
  AlertTriangle,
  User,
  Heart,
  X,
  ChevronRight,
  Activity,
  Sparkles,
  FileText,
  CheckCircle2,
  Lock,
  Clock,
  Eye
} from 'lucide-react';
import { VoiceReaderButton } from '../common/VoiceReaderButton';
import { formatAddress } from '../../utils/addressUtils';
import { VitalSignsView } from '../patient/VitalSignsView';
import { SymptomsView } from '../patient/SymptomsView';
import { MedicationsView } from '../patient/MedicationsView';
import { CalendarView } from '../patient/CalendarView';
import { NhsoView } from '../patient/NhsoView';
import { NearbyHospitalsView } from '../patient/NearbyHospitalsView';
import { BirthDateInput } from '../common/BirthDateInput';
import { PatientStatusSelector } from '../common/PatientStatusSelector';

type MenuKey = 'nhso' | 'calendar' | 'vitals' | 'hospitals' | 'symptoms' | 'meds';

interface MenuCardItem {
  key: MenuKey;
  title: string;
  icon: React.ElementType;
  badge: string;
  description: string;
  colorClass: string;
  iconBgClass: string;
}

const CAREGIVER_MENU_CARDS: MenuCardItem[] = [
  {
    key: 'nhso',
    title: 'เช็กสิทธิรักษา',
    icon: ShieldCheck,
    badge: 'สปสช./บัตรทอง',
    description: 'ตรวจสอบและอัปเดตสิทธิรักษาพยาบาล สปสช. บัตรทอง ประกันสังคม',
    colorClass: 'border-blue-200 hover:border-blue-500 bg-gradient-to-br from-blue-50/50 to-white',
    iconBgClass: 'bg-blue-600 text-white shadow-blue-200',
  },
  {
    key: 'calendar',
    title: 'ปฏิทินชุมชน',
    icon: Calendar,
    badge: 'นัดหมายชุมชน',
    description: 'ดูวันนัดหมาย กิจกรรมตรวจสุขภาพ และตารางติดตามผู้สูงอายุ',
    colorClass: 'border-indigo-200 hover:border-indigo-500 bg-gradient-to-br from-indigo-50/50 to-white',
    iconBgClass: 'bg-indigo-600 text-white shadow-indigo-200',
  },
  {
    key: 'vitals',
    title: 'บันทึกสัญญาณชีพ',
    icon: HeartPulse,
    badge: 'ความดัน/ชีพจร',
    description: 'บันทึกและติดตามความดันโลหิต อัตราชีพจร ออกซิเจน และอุณหภูมิ',
    colorClass: 'border-rose-200 hover:border-rose-500 bg-gradient-to-br from-rose-50/50 to-white',
    iconBgClass: 'bg-rose-600 text-white shadow-rose-200',
  },
  {
    key: 'hospitals',
    title: 'สถานพยาบาลใกล้ฉัน',
    icon: Building2,
    badge: 'รพ.สต. / รพ.',
    description: 'ค้นหารายชื่อ รพ.สต. และสถานพยาบาลใกล้เคียง พร้อมเส้นทางนำทาง',
    colorClass: 'border-emerald-200 hover:border-emerald-500 bg-gradient-to-br from-emerald-50/50 to-white',
    iconBgClass: 'bg-emerald-600 text-white shadow-emerald-200',
  },
  {
    key: 'symptoms',
    title: 'บันทึกอาการ',
    icon: Stethoscope,
    badge: 'ประเมิน 15 อาการ',
    description: 'ประเมินและบันทึกอาการไม่สบาย 15 รายการสำคัญของผู้สูงอายุ',
    colorClass: 'border-amber-200 hover:border-amber-500 bg-gradient-to-br from-amber-50/50 to-white',
    iconBgClass: 'bg-amber-600 text-white shadow-amber-200',
  },
  {
    key: 'meds',
    title: 'ยาที่ใช้ประจำ',
    icon: Pill,
    badge: 'การทานยา',
    description: 'ตรวจสอบและจัดระเบียบรายการยาประจำตัว พร้อมแจ้งเตือนการทานยา',
    colorClass: 'border-purple-200 hover:border-purple-500 bg-gradient-to-br from-purple-50/50 to-white',
    iconBgClass: 'bg-purple-600 text-white shadow-purple-200',
  },
];

export const CaregiverDashboard: React.FC = () => {
  const {
    currentUser,
    currentCaregiverProfile,
    allPatients,
    vitalSignsRecords,
    symptomRecords,
    medications,
    addPatientToCaregiver,
    removePatientFromCaregiver,
    updatePatientProfile,
    showToast,
    activeTab,
    setActiveTab
  } = useApp();

  // Navigation flow states (Dashboard -> Elderly List -> Patient Detail)
  const [viewState, setViewState] = useState<'dashboard' | 'elderly_list' | 'patient_detail'>('dashboard');
  const [activeMenu, setActiveMenu] = useState<MenuKey>('vitals');
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null);

  // Sync with left/top sidebar navigation (activeTab)
  useEffect(() => {
    if (activeTab === 'dashboard') {
      setViewState('dashboard');
    } else if (activeTab === 'patients') {
      setViewState('elderly_list');
    }
  }, [activeTab]);

  // Search and filter for elderly list
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Add / Edit Patient Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<PatientProfile | null>(null);
  const [deletingPatientId, setDeletingPatientId] = useState<string | null>(null);

  // Form State for Adding / Editing Patient
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('1954-01-01');
  const [age, setAge] = useState<number>(72);
  const [houseNo, setHouseNo] = useState('');
  const [soi, setSoi] = useState('');
  const [moo, setMoo] = useState('');
  const [subdistrict, setSubdistrict] = useState('สุเทพ');
  const [district, setDistrict] = useState('เมืองเชียงใหม่');
  const [province, setProvince] = useState('เชียงใหม่');
  const [diseases, setDiseases] = useState<string[]>(['ความดันโลหิตสูง']);
  const [allergies, setAllergies] = useState('');
  const [patientStatus, setPatientStatus] = useState<PatientProfile['status']>('ติดสังคม');
  const [otherStatusText, setOtherStatusText] = useState('');

  // Resolve dynamic managed patients from caregiver profile or allPatients
  const myPatients: PatientProfile[] = (currentCaregiverProfile?.managedPatients && currentCaregiverProfile.managedPatients.length > 0)
    ? currentCaregiverProfile.managedPatients.map(mp => allPatients.find(p => p.id === mp.id) || mp)
    : allPatients;

  const caregiverName = currentCaregiverProfile
    ? `${currentCaregiverProfile.firstName} ${currentCaregiverProfile.lastName}`
    : currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : 'ผู้ดูแลใจดี';

  // Handle opening menu card -> goes to Elderly List
  const handleMenuClick = (key: MenuKey) => {
    setActiveMenu(key);
    setViewState('elderly_list');
  };

  // Handle selecting patient -> goes to Patient Detail View
  const handleSelectPatient = (patient: PatientProfile) => {
    setSelectedPatient(patient);
    setViewState('patient_detail');
  };

  const getMenuTitle = (key: MenuKey): string => {
    const card = CAREGIVER_MENU_CARDS.find(c => c.key === key);
    return card ? card.title : 'ข้อมูลสุขภาพ';
  };

  // Open Edit modal preloaded with patient data
  const handleOpenEdit = (patient: PatientProfile, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPatient(patient);
    setFirstName(patient.firstName);
    setLastName(patient.lastName);
    setPhone(patient.phone || '');
    setBirthDate(patient.birthDate || '1954-01-01');
    setAge(patient.age || 70);
    setHouseNo(patient.address?.houseNo || '');
    setSoi(patient.address?.alley || '');
    setMoo(patient.address?.moo || '');
    setSubdistrict(patient.address?.subdistrict || 'สุเทพ');
    setDistrict(patient.address?.district || 'เมืองเชียงใหม่');
    setProvince(patient.address?.province || 'เชียงใหม่');
    setDiseases(patient.diseases || []);
    setAllergies(patient.allergies || '');
    setPatientStatus(patient.status || 'ติดสังคม');
    setOtherStatusText(patient.otherStatusText || '');
  };

  // Handle Save New Patient
  const handleSaveAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      showToast('กรุณาระบุชื่อและนามสกุลของผู้ป่วย');
      return;
    }

    addPatientToCaregiver({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() || '081-000-0000',
      birthDate: birthDate || '1954-01-01',
      age: Number(age) || 70,
      address: {
        province: province || 'เชียงใหม่',
        district: district || 'เมืองเชียงใหม่',
        subdistrict: subdistrict || 'สุเทพ',
        houseNo: houseNo || '1',
        alley: soi || '',
        moo: moo || '',
      },
      diseases: diseases.length > 0 ? diseases : ['ความดันโลหิตสูง'],
      allergies: allergies.trim() || 'ไม่มี',
      status: patientStatus,
      otherStatusText: patientStatus === 'อื่นๆ' ? otherStatusText : undefined,
      caregiverContacts: [
        {
          name: caregiverName,
          relationship: 'ผู้ดูแลหลัก',
          phone: currentUser?.phone || '081-234-5678',
        }
      ],
    });

    showToast(`เพิ่มคุณ ${firstName} ${lastName} เข้าสู่การดูแลเรียบร้อยแล้ว`);
    setShowAddModal(false);
    // Reset Form
    setFirstName('');
    setLastName('');
    setPhone('');
    setBirthDate('1954-01-01');
    setAge(72);
    setHouseNo('');
    setSoi('');
    setMoo('');
    setDiseases(['ความดันโลหิตสูง']);
    setAllergies('');
    setPatientStatus('ติดสังคม');
  };

  // Handle Save Edited Patient
  const handleSaveEditPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatient) return;
    if (!firstName.trim() || !lastName.trim()) {
      showToast('กรุณาระบุชื่อและนามสกุล');
      return;
    }

    updatePatientProfile(editingPatient.id, {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      birthDate: birthDate || '1954-01-01',
      age: Number(age),
      address: {
        province,
        district,
        subdistrict,
        houseNo,
        alley: soi,
        moo,
      },
      diseases,
      allergies,
      status: patientStatus,
      otherStatusText: patientStatus === 'อื่นๆ' ? otherStatusText : undefined,
    });

    if (selectedPatient && selectedPatient.id === editingPatient.id) {
      setSelectedPatient({
        ...selectedPatient,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        birthDate: birthDate || '1954-01-01',
        age: Number(age),
        address: {
          province,
          district,
          subdistrict,
          houseNo,
          alley: soi,
          moo,
        },
        diseases,
        allergies,
        status: patientStatus,
        otherStatusText: patientStatus === 'อื่นๆ' ? otherStatusText : undefined,
      });
    }

    showToast(`อัปเดตข้อมูลคุณ ${firstName} ${lastName} เรียบร้อยแล้ว`);
    setEditingPatient(null);
  };

  // Handle Delete / Remove Patient
  const handleConfirmDelete = () => {
    if (!deletingPatientId) return;
    const cgId = currentCaregiverProfile?.id || 'caregiver-1';
    removePatientFromCaregiver(cgId, deletingPatientId);
    showToast('นำผู้ป่วยออกจากรายการดูแลแล้ว');
    setDeletingPatientId(null);
    if (selectedPatient && selectedPatient.id === deletingPatientId) {
      setSelectedPatient(null);
      setViewState('elderly_list');
    }
  };

  // Filter patients
  const filteredPatients = myPatients.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const phoneNum = patient.phone || '';
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || phoneNum.includes(searchQuery);

    if (!matchesSearch) return false;

    if (statusFilter !== 'all') {
      if (patient.status !== statusFilter) return false;
    }

    return true;
  });

  // Helper to get status color badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ติดสังคม':
      case 'ช่วยเหลือตัวเองได้':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {status}
          </span>
        );
      case 'ติดบ้าน':
      case 'มีผู้ดูแล':
      case 'อยู่บ้าน':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            {status}
          </span>
        );
      case 'ติดเตียง':
      case 'ต้องติดตามเป็นพิเศษ':
      case 'อยู่โรงพยาบาล':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            {status || 'ทั่วไป'}
          </span>
        );
    }
  };

  // ==========================================
  // VIEW 3: PATIENT HEALTH DETAIL VIEW
  // ==========================================
  if (viewState === 'patient_detail' && selectedPatient) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back Button & Top Action */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setViewState('elderly_list')}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer border border-slate-200 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับไปหน้ารายชื่อผู้ป่วย ({getMenuTitle(activeMenu)})</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => handleOpenEdit(selectedPatient, e)}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-slate-200 shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              <span>แก้ไขข้อมูล</span>
            </button>
            <VoiceReaderButton
              textToRead={`ข้อมูลผู้ป่วยคุณ ${selectedPatient.firstName} ${selectedPatient.lastName} อายุ ${selectedPatient.age} ปี สถานะ ${selectedPatient.status} โรคประจำตัว ${selectedPatient.diseases?.join(', ') || 'ไม่มี'}`}
              label="ฟังข้อมูล"
              size="sm"
            />
          </div>
        </div>

        {/* Patient Profile Card Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/20">
                <User className="w-7 h-7 text-blue-200" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold">
                    {selectedPatient.firstName} {selectedPatient.lastName}
                  </h2>
                  <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-medium">
                    อายุ {selectedPatient.age} ปี
                  </span>
                  {getStatusBadge(selectedPatient.status)}
                </div>
                <p className="text-xs text-blue-200 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-300" />
                  {formatAddress(selectedPatient.address)}
                </p>
              </div>
            </div>

            <div className="text-xs text-blue-200 flex sm:flex-col items-start sm:items-end justify-between gap-1">
              <span className="flex items-center gap-1 text-white font-medium">
                <Phone className="w-3.5 h-3.5 text-emerald-300" />
                {selectedPatient.phone || '081-234-5678'}
              </span>
              <span className="text-[11px] bg-white/10 px-2.5 py-0.5 rounded-lg">
                สิทธิ์ผู้ดูแล: ดูแลและบันทึกข้อมูลได้
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-blue-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-white">โรคประจำตัว:</span>
              {selectedPatient.diseases && selectedPatient.diseases.length > 0 ? (
                selectedPatient.diseases.map((d, i) => (
                  <span key={i} className="bg-blue-800/80 px-2 py-0.5 rounded-md text-[11px] text-blue-100 border border-blue-700">
                    {d}
                  </span>
                ))
              ) : (
                <span className="text-blue-300">ไม่มี</span>
              )}
            </div>

            {selectedPatient.allergies && (
              <div className="flex items-center gap-1 text-amber-200">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>แพ้ยา/อาหาร: {selectedPatient.allergies}</span>
              </div>
            )}
          </div>
        </div>

        {/* 6-Topic Health Sub-navigation Tab Bar */}
        <div className="bg-white rounded-2xl p-2 shadow-xs border border-slate-200 flex flex-wrap gap-2">
          {CAREGIVER_MENU_CARDS.map(card => {
            const Icon = card.icon;
            const isActive = activeMenu === card.key;
            return (
              <button
                key={card.key}
                onClick={() => setActiveMenu(card.key)}
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  isActive
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{card.title}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Health View based on selected 6 topics */}
        <div className="bg-slate-50/50 rounded-3xl">
          {activeMenu === 'vitals' && (
            <VitalSignsView patientId={selectedPatient.id} />
          )}
          {activeMenu === 'symptoms' && (
            <SymptomsView patientId={selectedPatient.id} />
          )}
          {activeMenu === 'meds' && (
            <MedicationsView patientId={selectedPatient.id} />
          )}
          {activeMenu === 'calendar' && (
            <CalendarView patientId={selectedPatient.id} />
          )}
          {activeMenu === 'nhso' && (
            <NhsoView patientId={selectedPatient.id} />
          )}
          {activeMenu === 'hospitals' && (
            <NearbyHospitalsView patientId={selectedPatient.id} />
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: ELDERLY LIST VIEW (กดจาก 6 ช่อง)
  // ==========================================
  if (viewState === 'elderly_list') {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Container */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
          {/* ฝั่งซ้าย: ปุ่มย้อนกลับ + หัวข้อใหญ่ */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              onClick={() => setViewState('dashboard')}
              className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer shrink-0"
              title="ย้อนกลับ"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>

            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 whitespace-nowrap inline-block mb-0.5">
                ผู้สูงอายุในความดูแล
              </span>
              <h1 className="text-lg sm:text-xl font-bold text-slate-800 whitespace-nowrap truncate">
                เมนู: {getMenuTitle(activeMenu)}
              </h1>
            </div>
          </div>

          {/* ฝั่งขวา: กลุ่มปุ่มฟังเสียง & เพิ่มข้อมูล (จัดแนวนอน ชิดขวา) */}
          <div className="flex items-center gap-2 justify-start sm:justify-end shrink-0 flex-nowrap">
            <VoiceReaderButton
              textToRead={`รายชื่อผู้ป่วยในความดูแลสำหรับเมนู ${getMenuTitle(activeMenu)} มีทั้งหมด ${filteredPatients.length} คน`}
              label="ฟังเสียง"
              size="md"
              className="shrink-0 whitespace-nowrap"
            />
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm whitespace-nowrap shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>เพิ่มผู้สูงอายุ</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="ค้นหาชื่อ นามสกุล หรือเบอร์โทรศัพท์..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
            >
              <option value="all">สถานะสุขภาพทั้งหมด</option>
              <option value="ติดสังคม">ติดสังคม (ช่วยเหลือตัวเองได้ดี)</option>
              <option value="ติดบ้าน">ติดบ้าน (ต้องการการดูแลบางส่วน)</option>
              <option value="ติดเตียง">ติดเตียง (ต้องการการดูแลใกล้ชิด)</option>
              <option value="ช่วยเหลือตัวเองได้">ช่วยเหลือตัวเองได้</option>
              <option value="มีผู้ดูแล">มีผู้ดูแล</option>
            </select>
          </div>
        </div>

        {/* Patient List */}
        {myPatients.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">ยังไม่มีผู้ป่วยในความดูแล</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                คุณสามารถกดปุ่ม "+ เพิ่มผู้ป่วยในความดูแล" ด้านบนเพื่อเพิ่มข้อมูลผู้สูงอายุหรือบุคคลในครอบครัวที่ต้องการดูแล
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-2xl text-xs inline-flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>+ เพิ่มผู้ป่วยในความดูแล</span>
            </button>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3 shadow-xs">
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto">
              <UserX className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">ไม่พบผู้ป่วยตามเงื่อนไขที่ค้นหา</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              ลองเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรองสถานะเป็น "สถานะสุขภาพทั้งหมด"
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              ล้างคำค้นหา
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPatients.map(patient => {
              const vitalsList = vitalSignsRecords.filter(v => v.patientId === patient.id);
              const symptomsList = symptomRecords.filter(s => s.patientId === patient.id);
              const medsList = medications.filter(m => m.patientId === patient.id);
              const latestVital = vitalsList[0];

              return (
                <div
                  key={patient.id}
                  className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all space-y-4 group cursor-pointer"
                  onClick={() => handleSelectPatient(patient)}
                >
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100 font-bold text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {patient.firstName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition-colors">
                            {patient.firstName} {patient.lastName}
                          </h3>
                          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium">
                            อายุ {patient.age} ปี
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {formatAddress(patient.address)}
                        </p>
                      </div>
                    </div>

                    <div>
                      {getStatusBadge(patient.status)}
                    </div>
                  </div>

                  {/* Contextual Metric Banner based on selected Menu Card */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                    {activeMenu === 'vitals' && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <HeartPulse className="w-4 h-4 text-rose-500" />
                          ความดันโลหิตล่าสุด:
                        </span>
                        <span className="font-bold text-slate-800">
                          {latestVital ? `${latestVital.systolic}/${latestVital.diastolic} mmHg (ชีพจร ${latestVital.pulse || '-'})` : 'ยังไม่มีบันทึก'}
                        </span>
                      </div>
                    )}
                    {activeMenu === 'symptoms' && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Stethoscope className="w-4 h-4 text-amber-500" />
                          บันทึกอาการไม่สบาย:
                        </span>
                        <span className="font-bold text-slate-800">
                          {symptomsList.length > 0 ? `${symptomsList.length} รายการ (ล่าสุด: ${symptomsList[0].symptoms.join(', ')})` : 'ปกติ ไม่มีอาการ'}
                        </span>
                      </div>
                    )}
                    {activeMenu === 'meds' && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Pill className="w-4 h-4 text-purple-500" />
                          รายการยาประจำตัว:
                        </span>
                        <span className="font-bold text-slate-800">
                          {medsList.length > 0 ? `${medsList.length} ขนาน` : 'ยังไม่มีรายการยา'}
                        </span>
                      </div>
                    )}
                    {activeMenu === 'nhso' && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-blue-500" />
                          สิทธิรักษาพยาบาล:
                        </span>
                        <span className="font-bold text-emerald-700">
                          สิทธิบัตรทอง (สปสช.)
                        </span>
                      </div>
                    )}
                    {activeMenu === 'calendar' && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-indigo-500" />
                          การนัดหมาย:
                        </span>
                        <span className="font-bold text-slate-800">
                          มีนัดตรวจสุขภาพตามรอบ
                        </span>
                      </div>
                    )}
                    {activeMenu === 'hospitals' && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-emerald-500" />
                          หน่วยบริการปฐมภูมิ:
                        </span>
                        <span className="font-bold text-slate-800 truncate max-w-[180px]">
                          รพ.สต.สุเทพ จ.เชียงใหม่
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Diseases and Action Buttons */}
                  <div className="flex items-center justify-between pt-1 gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap flex-1">
                      <span className="text-[11px] text-slate-500">โรค:</span>
                      {patient.diseases && patient.diseases.length > 0 ? (
                        patient.diseases.slice(0, 2).map((d, i) => (
                          <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                            {d}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-400">-</span>
                      )}
                      {patient.diseases && patient.diseases.length > 2 && (
                        <span className="text-[10px] text-slate-500 font-bold">
                          +{patient.diseases.length - 2}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleOpenEdit(patient, e)}
                        className="p-2 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                        title="แก้ไขข้อมูล"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingPatientId(patient.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="นำออกจากการดูแล"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSelectPatient(patient)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-all cursor-pointer border border-blue-200"
                      >
                        <span>เลือก</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 1: MAIN CAREGIVER DASHBOARD (6 ช่อง)
  // ==========================================
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Caregiver Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-purple-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-purple-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs bg-purple-800/80 text-purple-200 px-3 py-1 rounded-full font-bold border border-purple-600/60 flex items-center gap-1.5 shadow-xs">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                บทบาท: ผู้ดูแล / ญาติ (Caregiver)
              </span>
              <span className="text-xs bg-white/10 text-purple-100 px-2.5 py-1 rounded-full font-medium">
                ศูนย์กลางการดูแลสุขภาพครอบครัว
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              ระบบดูแลสุขภาพสำหรับผู้ดูแล
            </h1>
            <p className="text-xs sm:text-sm text-purple-200 max-w-2xl leading-relaxed">
              สวัสดีคุณ <span className="text-white font-bold">{caregiverName}</span> | คุณกำลังดูแลผู้สูงอายุในครอบครัวทั้งหมด <span className="font-extrabold text-white bg-purple-800/90 px-2.5 py-0.5 rounded-full border border-purple-600">{myPatients.length} ท่าน</span> สามารถเลือกรายชื่อด้านล่างเพื่อบันทึกและติดตามสุขภาพได้ทันที
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <VoiceReaderButton
              textToRead={`ยินดีต้อนรับคุณ ${caregiverName} สู่ระบบดูแลสุขภาพสำหรับผู้ดูแล คุณกำลังดูแลผู้สูงอายุทั้งหมด ${myPatients.length} ท่าน กรุณาเลือกรายชื่อผู้สูงอายุด้านล่างเพื่อบันทึกและติดตามสุขภาพ หรือเลือกหมวดหมู่บริการ 6 เมนูหลัก`}
              label="ฟังคำแนะนำ"
              size="md"
              className="bg-white/15 hover:bg-white/25 text-white border border-white/20"
            />
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer border border-purple-400/40"
            >
              <Plus className="w-4 h-4" />
              <span>+ เพิ่มผู้ป่วย/ญาติ</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP SECTION: รายชื่อผู้สูงอายุในความดูแล (Moved up immediately after header) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-6 bg-gradient-to-b from-purple-600 to-indigo-600 rounded-full" />
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-700" />
                <span>รายชื่อผู้สูงอายุในความดูแลของคุณ</span>
                <span className="text-xs bg-indigo-100 text-indigo-800 font-extrabold px-2.5 py-0.5 rounded-full border border-indigo-200">
                  {myPatients.length} ท่าน
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              กดเลือกผู้สูงอายุเพื่อเข้าสู่หน้าบันทึกสุขภาพ (6 เมนู) หรือจัดการข้อมูลส่วนบุคคล
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-indigo-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>เพิ่มคนในครอบครัว</span>
            </button>
            <button
              onClick={() => {
                setActiveMenu('vitals');
                setViewState('elderly_list');
              }}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>ดูตารางรายชื่อแบบเต็ม</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {myPatients.length === 0 ? (
          <div className="text-center py-10 space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <UserX className="w-12 h-12 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <p className="font-bold text-slate-700 text-sm">ยังไม่มีผู้สูงอายุในความดูแล</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                เริ่มต้นโดยการเพิ่มข้อมูลคุณตา คุณยาย หรือบุคคลในครอบครัวที่คุณต้องการดูแลสุขภาพ
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มผู้สูงอายุเข้าสู่การดูแล</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myPatients.map(patient => {
              const vitals = vitalSignsRecords.filter(v => v.patientId === patient.id);
              const latestVital = vitals[0];
              const meds = medications.filter(m => m.patientId === patient.id);
              const symptoms = symptomRecords.filter(s => s.patientId === patient.id);
              const isHighBp = latestVital && (latestVital.systolic >= 140 || latestVital.diastolic >= 90);

              return (
                <div
                  key={patient.id}
                  onClick={() => {
                    setSelectedPatient(patient);
                    setActiveMenu('vitals');
                    setViewState('patient_detail');
                  }}
                  className="p-5 rounded-3xl border border-slate-200 hover:border-indigo-400 bg-gradient-to-b from-white to-slate-50/80 hover:shadow-md transition-all duration-200 cursor-pointer space-y-3 group flex flex-col justify-between"
                >
                  {/* Top Profile Row */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black flex items-center justify-center text-base shadow-xs group-hover:scale-105 transition-transform">
                          {patient.firstName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-slate-900 text-base group-hover:text-indigo-700 transition-colors">
                              {patient.firstName} {patient.lastName}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">
                            อายุ {patient.age} ปี • {patient.phone || '081-234-5678'}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {getStatusBadge(patient.status)}
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{formatAddress(patient.address)}</span>
                    </p>
                  </div>

                  {/* Health Snapshot Micro-Card */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-150 space-y-1.5 text-xs shadow-2xs">
                    {/* Vital BP */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                        <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                        ความดันล่าสุด:
                      </span>
                      {latestVital ? (
                        <span className={`font-bold px-2 py-0.5 rounded-lg text-[11px] ${
                          isHighBp ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {latestVital.systolic}/{latestVital.diastolic} mmHg
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">ยังไม่มีข้อมูล</span>
                      )}
                    </div>

                    {/* Medications & Symptoms count */}
                    <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <Pill className="w-3 h-3 text-purple-500" />
                        ยา {meds.length} ขนาน
                      </span>
                      <span className="flex items-center gap-1">
                        <Stethoscope className="w-3 h-3 text-amber-500" />
                        {symptoms.length > 0 ? `อาการล่าสุด ${symptoms.length} รายการ` : 'ปกติ ไม่มีอาการ'}
                      </span>
                    </div>
                  </div>

                  {/* Footer Action Strip */}
                  <div className="flex items-center justify-between pt-1 text-xs border-t border-slate-100">
                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleOpenEdit(patient, e)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="แก้ไขข้อมูลส่วนตัว"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingPatientId(patient.id);
                        }}
                        className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="นำออกจากการดูแล"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedPatient(patient);
                        setActiveMenu('vitals');
                        setViewState('patient_detail');
                      }}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-extrabold rounded-xl text-xs flex items-center gap-1 transition-all cursor-pointer border border-indigo-200/80"
                    >
                      <span>บันทึก & ดูสุขภาพ</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. BOTTOM SECTION: 6 MAIN CATEGORY CARDS (หมวดหมู่บริการสุขภาพ 6 เมนู) */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-6 bg-indigo-700 rounded-full" />
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              หมวดหมู่บริการสุขภาพ (6 เมนูหลักสำหรับผู้ดูแล)
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            เลือกเมนูเพื่อดูหรือบันทึกข้อมูลสุขภาพของผู้สูงอายุ
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAREGIVER_MENU_CARDS.map(card => {
            const Icon = card.icon;
            return (
              <div
                key={card.key}
                onClick={() => handleMenuClick(card.key)}
                className={`relative p-5 rounded-3xl border ${card.colorClass} shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col justify-between overflow-hidden transform hover:-translate-y-1`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.iconBgClass} shadow-sm group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/80 border border-slate-200 text-slate-700 shadow-xs">
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-700 group-hover:translate-x-1 transition-transform">
                  <span className="text-[11px] text-slate-500 font-medium">
                    ผู้ป่วยในความดูแล: {myPatients.length} ท่าน
                  </span>
                  <div className="flex items-center gap-1">
                    <span>เปิดดูข้อมูล</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================== */}
      {/* MODAL: ADD PATIENT TO CAREGIVER            */}
      {/* ========================================== */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  เพิ่มผู้ป่วยในความดูแล
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddPatient} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ชื่อ *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น สมศรี"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    นามสกุล *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น รักสงบ"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Birth Date & Age */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
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

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="tel"
                  placeholder="เช่น 081-234-5678"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <PatientStatusSelector
                  value={patientStatus}
                  onChange={(st) => setPatientStatus(st)}
                  otherStatusText={otherStatusText}
                  onOtherTextChange={(txt) => setOtherStatusText(txt)}
                  label="สถานะการดำเนินชีวิต / การดูแล"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  โรคประจำตัว (เลือกได้หลายโรค)
                </label>
                <div className="flex flex-wrap gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  {CHRONIC_DISEASES.map(d => {
                    const isSelected = diseases.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setDiseases(diseases.filter(item => item !== d));
                          } else {
                            setDiseases([...diseases, d]);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-700 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ประวัติแพ้ยา / แพ้อาหาร
                </label>
                <input
                  type="text"
                  placeholder="เช่น แพ้ยา Penicillin หรือระบุว่า ไม่มี"
                  value={allergies}
                  onChange={e => setAllergies(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    บ้านเลขที่
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    value={houseNo}
                    onChange={e => setHouseNo(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    หมู่ที่
                  </label>
                  <input
                    type="text"
                    placeholder="1"
                    value={moo}
                    onChange={e => setMoo(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    ซอย / ถนน
                  </label>
                  <input
                    type="text"
                    placeholder="ซอย 2"
                    value={soi}
                    onChange={e => setSoi(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer"
                >
                  บันทึกข้อมูลผู้ป่วย
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: EDIT PATIENT PROFILE                */}
      {/* ========================================== */}
      {editingPatient && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  แก้ไขข้อมูลผู้ป่วย: {editingPatient.firstName} {editingPatient.lastName}
                </h3>
              </div>
              <button
                onClick={() => setEditingPatient(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditPatient} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ชื่อ *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    นามสกุล *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Birth Date & Age */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
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

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <PatientStatusSelector
                  value={patientStatus}
                  onChange={(st) => setPatientStatus(st)}
                  otherStatusText={otherStatusText}
                  onOtherTextChange={(txt) => setOtherStatusText(txt)}
                  label="สถานะการดำเนินชีวิต"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  โรคประจำตัว
                </label>
                <div className="flex flex-wrap gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  {CHRONIC_DISEASES.map(d => {
                    const isSelected = diseases.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setDiseases(diseases.filter(item => item !== d));
                          } else {
                            setDiseases([...diseases, d]);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-700 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ประวัติแพ้ยา / แพ้อาหาร
                </label>
                <input
                  type="text"
                  value={allergies}
                  onChange={e => setAllergies(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPatient(null)}
                  className="px-4 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer"
                >
                  บันทึกการแก้ไข
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: CONFIRM REMOVE PATIENT FROM CARE    */}
      {/* ========================================== */}
      {deletingPatientId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-center">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                ยืนยันการนำออกจากรายการดูแล
              </h3>
              <p className="text-xs text-slate-500">
                คุณต้องการนำผู้ป่วยท่านนี้ออกจากการดูแลใช่หรือไม่?
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeletingPatientId(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md"
              >
                ยืนยันนำออก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
