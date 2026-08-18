import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PatientProfile, VhvPermissionState } from '../../types';
import {
  ArrowLeft,
  Search,
  Users,
  ShieldCheck,
  Clock,
  Lock,
  ChevronRight,
  Phone,
  MapPin,
  Filter,
  UserX,
  Plus,
  Trash2,
  AlertTriangle,
  User,
  Heart,
  X
} from 'lucide-react';
import { VhvPermissionDialog } from './VhvPermissionDialog';
import { formatAddress } from '../../utils/addressUtils';
import { VoiceReaderButton } from '../common/VoiceReaderButton';
import { BirthDateInput } from '../common/BirthDateInput';
import { PatientStatusSelector } from '../common/PatientStatusSelector';

interface VhvElderlyListViewProps {
  menuTitle: string;
  menuKey: 'vitals' | 'symptoms' | 'meds' | 'calendar' | 'nhso' | 'hospitals';
  onSelectPatient: (patient: PatientProfile) => void;
  onBackToMenu: () => void;
}

export const VhvElderlyListView: React.FC<VhvElderlyListViewProps> = ({
  menuTitle,
  menuKey,
  onSelectPatient,
  onBackToMenu,
}) => {
  const { allPatients, getPatientVhvPermission, setPatientVhvPermission, addElderlyToVHV, removeElderlyFromVHV, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [permFilter, setPermFilter] = useState<'all' | 'granted' | 'granted_once' | 'denied'>('all');

  const [promptPatient, setPromptPatient] = useState<PatientProfile | null>(null);
  const [deletingPatientId, setDeletingPatientId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for Adding Elderly Patient (Requirement #11)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('1956-01-01');
  const [age, setAge] = useState<number>(70);
  const [houseNo, setHouseNo] = useState('');
  const [soi, setSoi] = useState('');
  const [moo, setMoo] = useState('');
  const [subdistrict, setSubdistrict] = useState('สุเทพ');
  const [district, setDistrict] = useState('เมืองเชียงใหม่');
  const [province, setProvince] = useState('เชียงใหม่');
  const [diseases, setDiseases] = useState('');
  const [allergies, setAllergies] = useState('');
  const [patientStatus, setPatientStatus] = useState<string>('อยู่บ้าน');
  const [otherStatusText, setOtherStatusText] = useState('');

  // Caregiver form state
  const [cgFirstName, setCgFirstName] = useState('');
  const [cgLastName, setCgLastName] = useState('');
  const [cgPhone, setCgPhone] = useState('');
  const [cgRelation, setCgRelation] = useState('บุตร/หลาน');

  const handlePatientClick = (patient: PatientProfile) => {
    const currentPerm = getPatientVhvPermission(patient.id);
    if (!currentPerm) {
      setPromptPatient(patient);
    } else {
      onSelectPatient(patient);
    }
  };

  const handleSelectPermission = (newPerm: VhvPermissionState) => {
    if (promptPatient) {
      setPatientVhvPermission(promptPatient.id, newPerm);
      const targetPatient = promptPatient;
      setPromptPatient(null);
      showToast(`กำหนดสิทธิ์สำหรับ ${targetPatient.firstName} แล้ว`);
      onSelectPatient(targetPatient);
    }
  };

  const handleSaveAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      showToast('กรุณาระบุชื่อและนามสกุลของผู้สูงอายุ');
      return;
    }

    const fullAddr = `บ้านเลขที่ ${houseNo || '1'} ${soi ? 'ซ.' + soi : ''} ${moo ? 'ม.' + moo : ''} ต.${subdistrict} อ.${district} จ.${province}`;

    addElderlyToVHV({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() || '081-000-0000',
      birthDate: birthDate || '1956-01-01',
      age: age || 70,
      address: {
        province: province || 'เชียงใหม่',
        district: district || 'เมืองเชียงใหม่',
        subdistrict: subdistrict || 'สุเทพ',
        houseNo: houseNo || '1',
        alley: soi || '',
        moo: moo || '',
      },
      diseases: diseases ? diseases.split(',').map(d => d.trim()) : ['ความดันโลหิตสูง'],
      allergies: allergies.trim() || 'ไม่มี',
      status: patientStatus as any,
      otherStatusText: patientStatus === 'อื่นๆ' ? otherStatusText : undefined,
      caregiverContacts: cgFirstName ? [
        {
          name: `${cgFirstName} ${cgLastName}`.trim(),
          relationship: cgRelation,
          phone: cgPhone || '081-222-3333',
        }
      ] : [],
    });

    // Reset Form
    setFirstName('');
    setLastName('');
    setPhone('');
    setHouseNo('');
    setSoi('');
    setMoo('');
    setDiseases('');
    setAllergies('');
    setCgFirstName('');
    setCgLastName('');
    setCgPhone('');
    setShowAddModal(false);
  };

  // Filter patients
  const filteredPatients = allPatients.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const phoneNum = patient.phone || '';
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || phoneNum.includes(searchQuery);

    if (!matchesSearch) return false;

    const perm = getPatientVhvPermission(patient.id);
    if (permFilter === 'granted') return perm === 'granted';
    if (permFilter === 'granted_once') return perm === 'granted_once';
    if (permFilter === 'denied') return perm === 'denied';

    return true;
  });

  const renderBadge = (patientId: string) => {
    const perm = getPatientVhvPermission(patientId);
    switch (perm) {
      case 'granted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full border border-emerald-300">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            อนุญาต
          </span>
        );
      case 'granted_once':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] font-bold rounded-full border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            เฉพาะครั้งนี้
          </span>
        );
      case 'denied':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-100 text-rose-800 text-[11px] font-bold rounded-full border border-rose-300">
            <Lock className="w-3 h-3 text-rose-600" />
            ไม่อนุญาต
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-full border border-slate-300">
            <Lock className="w-3 h-3 text-slate-400" />
            รอเลือกสิทธิ์
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Container */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
        {/* ฝั่งซ้าย: ปุ่มย้อนกลับ + หัวข้อใหญ่ */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            onClick={onBackToMenu}
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
              เมนู: {menuTitle}
            </h1>
          </div>
        </div>

        {/* ฝั่งขวา: กลุ่มปุ่มฟังเสียง & เพิ่มข้อมูล (จัดแนวนอน ชิดขวา) */}
        <div className="flex items-center gap-2 justify-start sm:justify-end shrink-0 flex-nowrap">
          <VoiceReaderButton
            textToRead={`หน้ารายชื่อผู้สูงอายุในความดูแล สำหรับเมนู ${menuTitle} มีผู้สูงอายุทั้งหมด ${allPatients.length} ท่าน`}
            label="ฟังเสียง"
            size="md"
            className="shrink-0 whitespace-nowrap"
          />
          {/* Requirement #11: "+ เพิ่มผู้สูงอายุ" Button on the right */}
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
            value={permFilter}
            onChange={e => setPermFilter(e.target.value as any)}
            className="py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
          >
            <option value="all">สิทธิ์ทั้งหมด</option>
            <option value="granted">อนุญาตแล้ว</option>
            <option value="granted_once">เฉพาะครั้งนี้</option>
            <option value="denied">ไม่อนุญาต</option>
          </select>
        </div>
      </div>

      {/* Patient List */}
      {allPatients.length === 0 ? (
        /* Requirement #15: Empty State if no elderly patients */
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">ยังไม่มีผู้สูงอายุในความดูแล</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              คุณสามารถกดปุ่ม "+ เพิ่มผู้สูงอายุ" ด้านบนเพื่อเพิ่มรายชื่อผู้สูงอายุที่ต้องดูแล
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-2xl text-xs inline-flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>+ เพิ่มผู้สูงอายุ</span>
          </button>
        </div>
      ) : filteredPatients.length === 0 ? (
        /* Requirement #15: Empty State if search yields no results */
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto">
            <UserX className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">ไม่พบผู้สูงอายุตามเงื่อนไขที่ระบุ</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            ลองเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรองสิทธิ์เป็น "สิทธิ์ทั้งหมด"
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setPermFilter('all');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            ล้างคำค้นหา
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPatients.map(patient => (
            <div
              key={patient.id}
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all space-y-3 group"
            >
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="space-y-0.5 cursor-pointer flex-1" onClick={() => handlePatientClick(patient)}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition-colors">
                      {patient.firstName} {patient.lastName}
                    </h3>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                      {patient.age} ปี
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{formatAddress(patient.address)}</span>
                  </p>
                </div>
                <div>{renderBadge(patient.id)}</div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {patient.phone || '081-234-5678'}
                </span>

                <div className="flex items-center gap-2">
                  <VoiceReaderButton
                    textToRead={`ผู้สูงอายุ คุณ${patient.firstName} ${patient.lastName} อายุ ${patient.age} ปี ที่อยู่ ${formatAddress(patient.address)}`}
                    size="sm"
                    label="ฟัง"
                  />

                  {/* Requirement #12: "ลบ" button with confirmation modal */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingPatientId(patient.id);
                    }}
                    className="px-2 py-1 text-red-600 hover:bg-red-50 font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs"
                    title="ลบรายชื่อผู้สูงอายุ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ลบ</span>
                  </button>

                  <button
                    onClick={() => handlePatientClick(patient)}
                    className="font-bold text-blue-700 group-hover:translate-x-1 transition-transform flex items-center gap-1 cursor-pointer text-xs"
                  >
                    <span>เลือกบุคคล</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Requirement #11: Modal Form for "+ เพิ่มผู้สูงอายุ" */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">เพิ่มผู้สูงอายุในความดูแล</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddPatient} className="space-y-4 text-xs">
              {/* Name & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ชื่อ *</label>
                  <input
                    type="text"
                    required
                    placeholder="สมชาย"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">นามสกุล *</label>
                  <input
                    type="text"
                    required
                    placeholder="ใจดี"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">เบอร์โทรศัพท์</label>
                <input
                  type="tel"
                  placeholder="081-234-5678"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* BirthDate & Age */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <BirthDateInput
                  value={birthDate}
                  age={age}
                  onChange={(iso, calcAge) => {
                    setBirthDate(iso);
                    setAge(calcAge);
                  }}
                  onAgeChange={(newAge) => setAge(newAge)}
                />
              </div>

              {/* Address Fields */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block text-xs">ข้อมูลที่อยู่</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">บ้านเลขที่</label>
                    <input
                      type="text"
                      placeholder="12/3"
                      value={houseNo}
                      onChange={e => setHouseNo(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">ซอย</label>
                    <input
                      type="text"
                      placeholder="สุขใจ"
                      value={soi}
                      onChange={e => setSoi(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">หมู่</label>
                    <input
                      type="text"
                      placeholder="1"
                      value={moo}
                      onChange={e => setMoo(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">ตำบล</label>
                    <input
                      type="text"
                      value={subdistrict}
                      onChange={e => setSubdistrict(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">อำเภอ</label>
                    <input
                      type="text"
                      value={district}
                      onChange={e => setDistrict(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">จังหวัด</label>
                    <input
                      type="text"
                      value={province}
                      onChange={e => setProvince(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Health Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">โรคประจำตัว (คั่นด้วยจุลภาค)</label>
                  <input
                    type="text"
                    placeholder="ความดันโลหิตสูง, เบาหวาน"
                    value={diseases}
                    onChange={e => setDiseases(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">การแพ้ยา</label>
                  <input
                    type="text"
                    placeholder="พาราเซตามอล, เพนิซิลลิน"
                    value={allergies}
                    onChange={e => setAllergies(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              {/* Patient Status with full descriptions */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <PatientStatusSelector
                  value={patientStatus}
                  onChange={(st) => setPatientStatus(st)}
                  otherStatusText={otherStatusText}
                  onOtherTextChange={(txt) => setOtherStatusText(txt)}
                />
              </div>

              {/* Caregiver Info */}
              <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-3">
                <span className="font-bold text-blue-900 block text-xs">ข้อมูลญาติ/ผู้ดูแล</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">ชื่อผู้ดูแล</label>
                    <input
                      type="text"
                      placeholder="สมหญิง"
                      value={cgFirstName}
                      onChange={e => setCgFirstName(e.target.value)}
                      className="w-full p-2 bg-white border border-blue-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">นามสกุลผู้ดูแล</label>
                    <input
                      type="text"
                      placeholder="ใจดี"
                      value={cgLastName}
                      onChange={e => setCgLastName(e.target.value)}
                      className="w-full p-2 bg-white border border-blue-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">เบอร์โทรผู้ดูแล</label>
                    <input
                      type="tel"
                      placeholder="081-999-8888"
                      value={cgPhone}
                      onChange={e => setCgPhone(e.target.value)}
                      className="w-full p-2 bg-white border border-blue-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">ความสัมพันธ์</label>
                    <input
                      type="text"
                      placeholder="บุตร/หลาน"
                      value={cgRelation}
                      onChange={e => setCgRelation(e.target.value)}
                      className="w-full p-2 bg-white border border-blue-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md"
                >
                  บันทึกข้อมูลผู้สูงอายุ
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Requirement #12: Delete Confirmation Modal */}
      {deletingPatientId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">ยืนยันการลบผู้สูงอายุคนนี้หรือไม่?</h3>
              <p className="text-xs text-slate-500">
                เมื่อยืนยันแล้ว รายชื่อผู้สูงอายุท่านนี้จะถูกถอนออกจากความดูแลของ อสม.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  removeElderlyFromVHV(deletingPatientId);
                  setDeletingPatientId(null);
                  showToast('ลบรายชื่อผู้สูงอายุเรียบร้อยแล้ว');
                }}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md"
              >
                ยืนยันการลบ
              </button>
              <button
                onClick={() => setDeletingPatientId(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permission Dialog */}
      {promptPatient && (
        <VhvPermissionDialog
          patientName={`${promptPatient.firstName} ${promptPatient.lastName}`}
          isOpen={true}
          onSelectPermission={handleSelectPermission}
        />
      )}
    </div>
  );
};
