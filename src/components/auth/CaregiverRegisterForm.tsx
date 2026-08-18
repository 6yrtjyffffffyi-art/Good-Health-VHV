import React, { useState } from 'react';
import { ArrowLeft, User, MapPin, Shield, Plus, Trash2, Phone } from 'lucide-react';
import { PatientProfile } from '../../types';

interface CaregiverRegisterFormProps {
  initialData?: { firstName: string; lastName: string; phone: string };
  onBack: () => void;
  onSubmit?: (data: any) => void;
}

export const CaregiverRegisterForm: React.FC<CaregiverRegisterFormProps> = ({
  initialData,
  onBack,
  onSubmit,
}) => {
  const [firstName, setFirstName] = useState(initialData?.firstName || '');
  const [lastName, setLastName] = useState(initialData?.lastName || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [address, setAddress] = useState('');

  // Managed Elderly Patients (up to 5)
  const [managedPatients, setManagedPatients] = useState<Partial<PatientProfile>[]>([
    {
      firstName: '',
      lastName: '',
      phone: '',
      age: '' as any,
      status: 'ช่วยเหลือตัวเองได้',
      diseases: [],
    },
  ]);

  const handleAddPatient = () => {
    if (managedPatients.length >= 5) return;
    setManagedPatients(prev => [
      ...prev,
      { firstName: '', lastName: '', phone: '', age: '' as any, status: 'ช่วยเหลือตัวเองได้', diseases: [] },
    ]);
  };

  const handleRemovePatient = (idx: number) => {
    setManagedPatients(prev => prev.filter((_, i) => i !== idx));
  };

  const handlePatientChange = (idx: number, field: string, val: any) => {
    setManagedPatients(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: val };
      return updated;
    });
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.replace(/\D/g, ''),
      address,
      managedPatients: managedPatients.map((p, idx) => ({
        id: `patient-cg-${Date.now()}-${idx}`,
        userId: `user-patient-cg-${Date.now()}-${idx}`,
        firstName: p.firstName || 'ผู้ป่วย',
        lastName: p.lastName || 'ในดูแล',
        phone: p.phone || '0800000000',
        birthDate: '1955-01-01',
        age: p.age || 70,
        address: { province: 'เชียงใหม่', district: 'เมืองเชียงใหม่', subdistrict: 'สุเทพ', houseNo: '1' },
        diseases: p.diseases || ['ความดันโลหิตสูง'],
        status: p.status || 'อยู่บ้าน',
        caregiverContacts: [{ name: `${firstName.trim()} ${lastName.trim()}`, phone: phone.replace(/\D/g, ''), relationship: 'ผู้ดูแลหลัก' }],
      })),
    });
  };

  return (
    <div className="max-w-2xl w-full mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 my-6 space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer bg-slate-100 px-3 py-1.5 rounded-xl"
      >
        <ArrowLeft className="w-4 h-4" />
        ย้อนกลับ
      </button>

      <div className="border-b border-slate-200 pb-4 space-y-1">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
          ลงทะเบียน: ผู้ดูแล / ญาติ
        </span>
        <h2 className="text-2xl font-black text-slate-900 pt-1">ข้อมูลผู้ดูแล / ญาติ</h2>
        <p className="text-xs text-slate-500">
          สามารถเพิ่มข้อมูลผู้ป่วย/ผู้สูงอายุที่คุณดูแลได้สูงสุด 5 คน เพื่อติดตามสุขภาพอย่างใกล้ชิด
        </p>
      </div>

      <form onSubmit={handleSubmitForm} className="space-y-6">
        {/* Caregiver Personal Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            ข้อมูลผู้ดูแลหลัก
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ชื่อจริง <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="วิชัย"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                นามสกุล <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="ใจดี"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                เบอร์โทรศัพท์ (10 หลัก) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="0898765432"
                  className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ที่อยู่ผู้ดูแล</label>
            <input
              type="text"
              required
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-blue-600"
            />
          </div>
        </div>

        {/* Managed Patients (up to 5) */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              ข้อมูลผู้ป่วยในความดูแล (สูงสุด 5 คน)
            </h3>
            {managedPatients.length < 5 && (
              <button
                type="button"
                onClick={handleAddPatient}
                className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                เพิ่มผู้ป่วย
              </button>
            )}
          </div>

          {managedPatients.map((p, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>ผู้ป่วยคนที่ {idx + 1}</span>
                {managedPatients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePatient(idx)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="ชื่อผู้ป่วย"
                  required
                  value={p.firstName || ''}
                  onChange={e => handlePatientChange(idx, 'firstName', e.target.value)}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                />
                <input
                  type="text"
                  placeholder="นามสกุล"
                  required
                  value={p.lastName || ''}
                  onChange={e => handlePatientChange(idx, 'lastName', e.target.value)}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                />
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="เบอร์โทรศัพท์"
                  value={p.phone || ''}
                  onChange={e => handlePatientChange(idx, 'phone', e.target.value.replace(/\D/g, ''))}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">อายุ (ปี)</label>
                  <input
                    type="number"
                    value={p.age || 70}
                    onChange={e => handlePatientChange(idx, 'age', Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">สถานะผู้ป่วย</label>
                  <select
                    value={p.status || 'อยู่บ้าน'}
                    onChange={e => handlePatientChange(idx, 'status', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="อยู่บ้าน">อยู่บ้าน</option>
                    <option value="อยู่โรงพยาบาล">อยู่โรงพยาบาล</option>
                    <option value="ติดเตียง">ติดเตียง</option>
                    <option value="ช่วยเหลือตัวเองได้">ช่วยเหลือตัวเองได้</option>
                    <option value="ต้องติดตามเป็นพิเศษ">ต้องติดตามเป็นพิเศษ</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-base shadow-lg shadow-blue-200 transition-all cursor-pointer"
        >
          บันทึกการลงทะเบียนผู้ดูแล
        </button>
      </form>
    </div>
  );
};
