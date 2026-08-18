import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Calendar,
  Activity,
  MapPin,
  Stethoscope,
  Pill,
  Megaphone,
  UserCheck,
  ChevronRight,
  Sparkles,
  Heart,
  Volume2
} from 'lucide-react';
import { VoiceReaderButton } from '../common/VoiceReaderButton';

export const PatientDashboard: React.FC = () => {
  const { currentPatientProfile, announcements, setActiveTab, navigateToHealthSubTab, vitalSigns, medications } = useApp();

  const firstName = currentPatientProfile?.firstName || 'สมศรี';
  const lastName = currentPatientProfile?.lastName || 'ใจดี';
  const status = currentPatientProfile?.status || 'ช่วยเหลือตัวเองได้';
  const diseases = currentPatientProfile?.diseases || [];

  const patientVitals = currentPatientProfile
    ? vitalSigns.filter(v => v.patientId === currentPatientProfile.id)
    : vitalSigns;
  const latestVital = patientVitals[0];

  const patientMeds = currentPatientProfile
    ? medications.filter(m => m.patientId === currentPatientProfile.id)
    : medications;

  const latestAnnouncement = announcements[0];

  const handleCardClick = (cardId: string) => {
    if (cardId === 'hospitals') {
      setActiveTab('hospitals');
    } else if (cardId === 'nhso' || cardId === 'calendar' || cardId === 'vitals' || cardId === 'symptoms' || cardId === 'meds') {
      navigateToHealthSubTab(cardId as any);
    } else {
      setActiveTab('health');
    }
  };

  const getStatusColor = (st: string) => {
    if (st.includes('ติดเตียง')) return 'bg-rose-100 text-rose-800 border-rose-300';
    if (st.includes('ติดบ้าน')) return 'bg-amber-100 text-amber-800 border-amber-300';
    if (st.includes('ติดสังคม')) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  // 6 Main Categories - Clear, Large, Senior-Friendly
  const cards = [
    {
      id: 'nhso',
      number: '1',
      title: 'เช็กสิทธิรักษาพยาบาล',
      badge: 'สปสช. / บัตรทอง',
      shortInfo: 'ตรวจสิทธิรักษา และ รพ. ที่มีสิทธิ',
      icon: ShieldCheck,
      colorBg: 'bg-blue-600',
      cardBorder: 'hover:border-blue-500 bg-gradient-to-br from-blue-50/60 to-white',
      textColor: 'text-blue-700',
    },
    {
      id: 'vitals',
      number: '2',
      title: 'บันทึกความดันและชีพจร',
      badge: latestVital ? `${latestVital.systolic}/${latestVital.diastolic} mmHg` : 'ตรวจวัดสุขภาพ',
      shortInfo: latestVital ? `วัดล่าสุด: ชีพจร ${latestVital.pulse || '-'} ครั้ง/นาที` : 'บันทึกความดันและอัตราเต้นหัวใจ',
      icon: Activity,
      colorBg: 'bg-rose-600',
      cardBorder: 'hover:border-rose-500 bg-gradient-to-br from-rose-50/60 to-white',
      textColor: 'text-rose-700',
    },
    {
      id: 'meds',
      number: '3',
      title: 'ยาประจำตัวและเวลาทาน',
      badge: `${patientMeds.length} รายการยา`,
      shortInfo: 'ดูชื่อยา ขนาดรับประทาน และวิธีใช้',
      icon: Pill,
      colorBg: 'bg-purple-600',
      cardBorder: 'hover:border-purple-500 bg-gradient-to-br from-purple-50/60 to-white',
      textColor: 'text-purple-700',
    },
    {
      id: 'symptoms',
      number: '4',
      title: 'ประเมินอาการไม่สบาย',
      badge: '15 อาการสำคัญ',
      shortInfo: 'บันทึกอาการผิดปกติเพื่อแจ้ง อสม./แพทย์',
      icon: Stethoscope,
      colorBg: 'bg-amber-600',
      cardBorder: 'hover:border-amber-500 bg-gradient-to-br from-amber-50/60 to-white',
      textColor: 'text-amber-700',
    },
    {
      id: 'calendar',
      number: '5',
      title: 'ปฏิทินและวันนัดหมาย',
      badge: 'นัดตรวจสุขภาพ',
      shortInfo: 'ดูวันนัดพบแพทย์และกิจกรรมในชุมชน',
      icon: Calendar,
      colorBg: 'bg-indigo-600',
      cardBorder: 'hover:border-indigo-500 bg-gradient-to-br from-indigo-50/60 to-white',
      textColor: 'text-indigo-700',
    },
    {
      id: 'hospitals',
      number: '6',
      title: 'สถานพยาบาลใกล้บ้าน',
      badge: 'รพ.สต. / รพ.',
      shortInfo: 'เบอร์โทรและแผนที่นำทางสถานพยาบาล',
      icon: MapPin,
      colorBg: 'bg-emerald-600',
      cardBorder: 'hover:border-emerald-500 bg-gradient-to-br from-emerald-50/60 to-white',
      textColor: 'text-emerald-700',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-8">
      {/* Top Greeting Banner: Senior-Friendly, Warm Emerald/Teal Theme */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-emerald-700/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-800/80 text-emerald-100 border border-emerald-600/60 shadow-xs">
                <UserCheck className="w-4 h-4 text-emerald-300" />
                บทบาท: ผู้สูงอายุ / ผู้รับบริการ
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-amber-400 text-slate-950 shadow-xs">
                สถานะ: {status}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              สวัสดีคุณตา/คุณยาย <span className="text-amber-300 font-black">{firstName} {lastName}</span>
            </h1>

            <p className="text-sm text-emerald-100 flex items-center gap-2 flex-wrap font-medium">
              {currentPatientProfile?.age && <span>อายุ <strong>{currentPatientProfile.age}</strong> ปี</span>}
              {diseases.length > 0 && <span>• โรคประจำตัว: <strong>{diseases.join(', ')}</strong></span>}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <VoiceReaderButton
              textToRead={`สวัสดีคุณ ${firstName} ${lastName} สถานะสุขภาพของคุณคือ ${status} มีโรคประจำตัว ${diseases.join(', ') || 'ไม่มี'} กรุณาเลือก 1 ใน 6 เมนูด้านล่าง เพื่อดูข้อมูลและบันทึกสุขภาพ`}
              size="md"
              label="ฟังเสียงอ่าน"
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 shadow-xs"
            />
            <button
              onClick={() => setActiveTab('profile')}
              className="px-4 py-2.5 bg-white hover:bg-emerald-50 text-emerald-950 font-extrabold rounded-2xl text-xs sm:text-sm shadow-md transition-all cursor-pointer border border-white/40"
            >
              ✏️ ข้อมูลของฉัน
            </button>
          </div>
        </div>
      </div>

      {/* Senior Health Snapshot Strip (สรุปข้อมูลสุขภาพด่วนสำหรับผู้สูงอายุ) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Vital Blood Pressure */}
        <div
          onClick={() => navigateToHealthSubTab('vitals')}
          className="bg-white p-4 rounded-2xl border border-emerald-150 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center gap-3.5 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Activity className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-slate-400">ความดันโลหิตล่าสุด</span>
            <div className="text-base font-extrabold text-slate-900 truncate">
              {latestVital ? `${latestVital.systolic}/${latestVital.diastolic} mmHg` : 'ยังไม่ได้วัดวันนี้'}
            </div>
            <span className="text-[10px] text-emerald-700 font-bold group-hover:underline">
              {latestVital ? `ชีพจร ${latestVital.pulse || '-'} ครั้ง/นาที` : 'กดเพื่อบันทึก →'}
            </span>
          </div>
        </div>

        {/* Regular Medications */}
        <div
          onClick={() => navigateToHealthSubTab('meds')}
          className="bg-white p-4 rounded-2xl border border-emerald-150 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center gap-3.5 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Pill className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-slate-400">ยาประจำตัว</span>
            <div className="text-base font-extrabold text-slate-900 truncate">
              {patientMeds.length > 0 ? `มียาประจำตัว ${patientMeds.length} ขนาน` : 'ไม่มียาประจำตัว'}
            </div>
            <span className="text-[10px] text-purple-700 font-bold group-hover:underline">
              ดูเวลาทานยา & คำเตือน →
            </span>
          </div>
        </div>

        {/* Health Care Right */}
        <div
          onClick={() => navigateToHealthSubTab('nhso')}
          className="bg-white p-4 rounded-2xl border border-emerald-150 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center gap-3.5 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-slate-400">สิทธิการรักษา</span>
            <div className="text-base font-extrabold text-slate-900 truncate">
              บัตรทอง (สปสช.)
            </div>
            <span className="text-[10px] text-blue-700 font-bold group-hover:underline">
              ตรวจสอบสิทธิและ รพ. →
            </span>
          </div>
        </div>
      </div>

      {/* Concise Announcement Notice */}
      {latestAnnouncement && (
        <div
          onClick={() => setActiveTab('announcements')}
          className="bg-amber-50 border-2 border-amber-300 hover:border-amber-400 rounded-2xl p-4 flex items-center justify-between gap-3 cursor-pointer shadow-xs transition-all group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Megaphone className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-extrabold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-md">
                ข่าวสารชุมชนล่าสุด
              </span>
              <p className="text-sm sm:text-base font-bold text-slate-900 truncate mt-0.5">
                {latestAnnouncement.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-xs sm:text-sm font-extrabold text-amber-900">
            <span className="hidden sm:inline">กดอ่านประกาศ</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      )}

      {/* 6 MAIN CATEGORY CARDS - Large, Clean, Direct */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-6 bg-blue-700 rounded-full" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              เลือกเมนูสุขภาพ (6 หมวดหลัก)
            </h2>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-slate-500 hidden sm:inline">
            กดที่กล่องเพื่อเข้าดูรายละเอียด
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {cards.map(card => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`p-5 sm:p-6 rounded-3xl border-2 border-slate-200 ${card.cardBorder} shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 group overflow-hidden`}
              >
                <div className="space-y-3">
                  {/* Top Bar: Big Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md ${card.colorBg} group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <VoiceReaderButton
                        textToRead={`เมนูที่ ${card.number} ${card.title} ${card.shortInfo}`}
                        size="sm"
                      />
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 shadow-xs">
                        {card.badge}
                      </span>
                    </div>
                  </div>

                  {/* Title & Short Info */}
                  <div className="space-y-1">
                    <h3 className={`text-lg sm:text-xl font-extrabold text-slate-900 group-hover:${card.textColor} transition-colors flex items-center gap-2`}>
                      <span className="text-slate-400 text-sm font-black">{card.number}.</span>
                      <span>{card.title}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                      {card.shortInfo}
                    </p>
                  </div>
                </div>

                {/* Big Senior-Friendly Button Action */}
                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs sm:text-sm font-extrabold text-blue-700 group-hover:translate-x-1 transition-transform">
                  <span>กดเพื่อดูรายละเอียด</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
