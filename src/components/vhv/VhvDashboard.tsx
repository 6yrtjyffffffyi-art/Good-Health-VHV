import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PatientProfile, AppointmentRequest } from '../../types';
import {
  ShieldCheck,
  Calendar,
  HeartPulse,
  Building2,
  Stethoscope,
  Pill,
  ShieldAlert,
  ClipboardList,
  CheckCircle2,
  Clock,
  XCircle,
  Megaphone,
  Sparkles,
  Eye,
  Send,
  UserCheck,
  PhoneCall,
  MapPin,
  Plus,
  ChevronRight,
  User,
  AlertCircle,
  Map,
  FileSpreadsheet
} from 'lucide-react';
import { VhvElderlyListView } from './VhvElderlyListView';
import { VhvHealthDetailView } from './VhvHealthDetailView';
import { VoiceReaderButton } from '../common/VoiceReaderButton';

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

const VHV_MENU_CARDS: MenuCardItem[] = [
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

export const VhvDashboard: React.FC = () => {
  const {
    currentUser,
    currentVhvProfile,
    appointments,
    updateAppointmentStatus,
    publishAnnouncement,
    showToast,
    activeTab,
    setActiveTab
  } = useApp();

  // Navigation flow states
  const [viewState, setViewState] = useState<'dashboard' | 'elderly_list' | 'patient_detail'>('dashboard');
  const [activeMenu, setActiveMenu] = useState<MenuKey>('nhso');
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null);

  // Today's Checkup Queue modal state
  const [selectedApp, setSelectedApp] = useState<AppointmentRequest | null>(null);
  const [viewAppDetail, setViewAppDetail] = useState<AppointmentRequest | null>(null);
  const [proposedTime, setProposedTime] = useState('11:00');

  // AI Announcement Generator States
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('การดูแลรักษาสุขภาพผู้สูงอายุในช่วงฤดูฝน');
  const [aiTargetGroup, setAiTargetGroup] = useState('ผู้สูงอายุและผู้ป่วยความดันโลหิตสูง');
  const [aiDetails, setAiDetails] = useState('รักษาร่างกายให้อบอุ่น ระวังอุบัติเหตุลื่นล้มในบ้าน และตรวจวัดความดันโลหิตสม่ำเสมอ');
  const [aiStep, setAiStep] = useState<'input' | 'draft' | 'preview'>('input');
  const [aiDraftTitle, setAiDraftTitle] = useState('');
  const [aiDraftContent, setAiDraftContent] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  const vhvName = currentVhvProfile
    ? `${currentVhvProfile.firstName} ${currentVhvProfile.lastName}`
    : currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : 'สมพร แก้วมณี';

  // Card click handler -> Opens Elderly List for selected topic
  const handleMenuClick = (key: MenuKey) => {
    setActiveMenu(key);
    setViewState('elderly_list');
  };

  // Patient select handler from Elderly List -> Opens Patient Health Details
  const handleSelectPatient = (patient: PatientProfile) => {
    setSelectedPatient(patient);
    setViewState('patient_detail');
  };

  const getMenuTitle = (key: MenuKey): string => {
    const card = VHV_MENU_CARDS.find(c => c.key === key);
    return card ? card.title : 'ข้อมูลสุขภาพ';
  };

  // AI Draft generator call
  const handleGenerateAiDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAi(true);

    try {
      const res = await fetch('/api/ai/announcement-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          targetGroup: aiTargetGroup,
          details: aiDetails,
        }),
      });

      const data = await res.json();
      if (data.success && data.draft) {
        setAiDraftTitle(data.draft.title || aiTopic);
        setAiDraftContent(data.draft.content || aiDetails);
        setAiStep('draft');
        showToast('สร้างยกร่างประกาศด้วย AI สำเร็จ');
      } else {
        setAiDraftTitle(`ประกาศ อสม.: ${aiTopic}`);
        setAiDraftContent(
          `เรียน พ่อแม่พี่น้องผู้สูงอายุและผู้รับบริการสุขภาพชุมชนทุกท่าน\n\n${aiDetails}\n\nหากท่านมีข้อสงสัยหรือต้องการตรวจสุขภาพเพิ่มเติม สามารถติดต่อ อสม. ประจำหมู่บ้านได้ตลอดเวลาครับ/ค่ะ`
        );
        setAiStep('draft');
      }
    } catch {
      setAiDraftTitle(`ประกาศ อสม.: ${aiTopic}`);
      setAiDraftContent(
        `เรียน พ่อแม่พี่น้องผู้สูงอายุและผู้รับบริการสุขภาพชุมชนทุกท่าน\n\n${aiDetails}\n\nด้วยความห่วงใยจาก อสม. ประจำชุมชน`
      );
      setAiStep('draft');
    } finally {
      setLoadingAi(false);
    }
  };

  const handlePublishAnnouncement = () => {
    publishAnnouncement({
      title: aiDraftTitle,
      content: aiDraftContent,
      authorName: `อสม. ${vhvName}`,
      date: new Date().toISOString().split('T')[0],
      targetGroup: aiTargetGroup,
    });
    setAiStep('input');
    setAiDraftTitle('');
    setAiDraftContent('');
    setShowAiModal(false);
  };

  // RENDER PHASE 2: ELDERLY PATIENT LIST VIEW
  if (viewState === 'elderly_list') {
    return (
      <div className="max-w-5xl mx-auto">
        <VhvElderlyListView
          menuTitle={getMenuTitle(activeMenu)}
          menuKey={activeMenu}
          onSelectPatient={handleSelectPatient}
          onBackToMenu={() => setViewState('dashboard')}
        />
      </div>
    );
  }

  // RENDER PHASE 3: PATIENT HEALTH DETAIL VIEW
  if (viewState === 'patient_detail' && selectedPatient) {
    return (
      <div className="max-w-5xl mx-auto">
        <VhvHealthDetailView
          patient={selectedPatient}
          patientId={selectedPatient.id}
          menuKey={activeMenu}
          initialTab={activeMenu}
          onBack={() => setViewState('elderly_list')}
        />
      </div>
    );
  }

  // RENDER PHASE 1: MAIN VHV DASHBOARD VIEW
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-8">
      {/* Top Banner / Greeting with distinct VHV Royal Blue & Sky Theme */}
      <div className="bg-gradient-to-r from-blue-950 via-sky-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-200/50 space-y-4 border border-sky-800/40">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-blue-800/80 border border-blue-600/60 text-white shadow-xs">
            <ShieldAlert className="w-4 h-4 text-cyan-300" />
            บทบาท: อสม. (สาธารณสุขชุมชน)
          </span>
          <span className="text-xs text-sky-200 font-bold bg-white/10 px-3 py-1 rounded-full">
            📍 พื้นที่รับผิดชอบ: รพ.สต.สุเทพ • อ.เมือง จ.เชียงใหม่
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              สวัสดีคุณ <span className="text-amber-300">{vhvName}</span>
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm mt-1 font-medium max-w-xl leading-relaxed">
              ยินดีต้อนรับสู่ระบบงาน อสม. เลือก 1 ใน 6 เมนูด้านล่าง หรือใช้เครื่องมือภาคสนามเพื่อติดตามและบันทึกข้อมูลสุขภาพของผู้สูงอายุในชุมชน
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <VoiceReaderButton
              textToRead={`สวัสดีคุณ ${vhvName} ยินดีต้อนรับสู่ระบบงาน อสม. ชุมชน รพ.สต.สุเทพ คุณสามารถเลือก 1 ใน 6 เมนู ได้แก่ เช็กสิทธิรักษา ปฏิทินชุมชน บันทึกสัญญาณชีพ สถานพยาบาลใกล้ฉัน บันทึกอาการ และยาที่ใช้ประจำ เพื่อดูแลสุขภาพผู้สูงอายุ`}
              label="ฟังเสียงอ่าน อสม."
              size="md"
              className="bg-white/15 hover:bg-white/25 text-white border border-white/20 shadow-xs"
            />
          </div>
        </div>

        {/* Community Coverage Quick Stats Bar */}
        <div className="pt-3 border-t border-sky-800/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-white/10 rounded-xl p-2.5 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-sky-300" />
            <div>
              <div className="text-[10px] text-sky-200">ผู้สูงอายุในเขต</div>
              <div className="font-extrabold text-white text-sm">8 ท่าน</div>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <div>
              <div className="text-[10px] text-sky-200">ติดสังคม</div>
              <div className="font-extrabold text-white text-sm">5 ท่าน (62%)</div>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div>
              <div className="text-[10px] text-sky-200">ติดบ้าน</div>
              <div className="font-extrabold text-white text-sm">2 ท่าน (25%)</div>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <div>
              <div className="text-[10px] text-sky-200">ติดเตียง</div>
              <div className="font-extrabold text-white text-sm">1 ท่าน (13%)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 6-Card Grid Menu (Cute, Clean & Senior/Worker Friendly) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-6 bg-blue-600 rounded-full inline-block" />
            6 เมนูหลักสำหรับ อสม.
          </h2>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            แตะเลือกเมนูเพื่อเข้าสู่รายชื่อผู้สูงอายุ
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {VHV_MENU_CARDS.map(card => {
            const Icon = card.icon;
            return (
              <button
                key={card.key}
                onClick={() => handleMenuClick(card.key)}
                className={`p-5 rounded-3xl border-2 text-left transition-all duration-200 cursor-pointer shadow-xs hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between group relative overflow-hidden ${card.colorClass}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover:scale-110 ${card.iconBgClass}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 bg-white/90 border border-slate-200 text-slate-700 text-[11px] font-extrabold rounded-full shadow-2xs">
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-medium">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
                  <span>เปิดดูรายชื่อผู้สูงอายุ</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fieldwork & Reporting Tools */}
      <div className="bg-slate-50 rounded-3xl p-5 border-2 border-slate-200 space-y-3">
        <h3 className="text-sm font-black text-slate-800">เครื่องมือปฏิบัติงานภาคสนาม & ชุมชน</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('gis_map')}
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex items-center gap-3 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
              <Map className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">แผนที่ปักหมุดบ้าน (GPS Map)</h4>
              <p className="text-[11px] text-slate-500 truncate">พิกัด GPS ตำแหน่งบ้าน ติดสังคม/ติดบ้าน/ติดเตียง</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex items-center gap-3 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">ส่งออกรายงานสรุป & รายบุคคล</h4>
              <p className="text-[11px] text-slate-500 truncate">แบบรวมส่ง อสม./รพ.สต. และประวัติรายบุคคล</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setShowAiModal(true)}
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-purple-400 hover:shadow-md transition-all cursor-pointer flex items-center gap-3 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">สร้างประกาศด้วย AI</h4>
              <p className="text-[11px] text-slate-500 truncate">ยกร่างข่าวสารสุขภาพอัตโนมัติ</p>
            </div>
          </button>
        </div>
      </div>

      {/* AI Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border-2 border-purple-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-black text-slate-900">ผู้ช่วยสร้างประกาศด้วย AI (อสม.)</h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {aiStep === 'input' && (
              <form onSubmit={handleGenerateAiDraft} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">หัวข้อประกาศ</label>
                  <input
                    type="text"
                    required
                    value={aiTopic}
                    onChange={e => setAiTopic(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">กลุ่มเป้าหมาย</label>
                  <input
                    type="text"
                    required
                    value={aiTargetGroup}
                    onChange={e => setAiTargetGroup(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">สาระสำคัญ / รายละเอียด</label>
                  <textarea
                    rows={3}
                    required
                    value={aiDetails}
                    onChange={e => setAiDetails(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingAi}
                  className="w-full py-3.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-2xl text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-purple-200"
                >
                  {loadingAi ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'สร้างยกร่างประกาศด้วย AI'}
                </button>
              </form>
            )}

            {aiStep === 'draft' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">หัวข้อที่ AI ยกร่าง</label>
                  <input
                    type="text"
                    value={aiDraftTitle}
                    onChange={e => setAiDraftTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">เนื้อหาประกาศ</label>
                    <VoiceReaderButton
                      textToRead={`${aiDraftTitle}. ${aiDraftContent}`}
                      label="ฟังเสียงประกาศ"
                      size="sm"
                    />
                  </div>
                  <textarea
                    rows={6}
                    value={aiDraftContent}
                    onChange={e => setAiDraftContent(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handlePublishAnnouncement}
                    className="flex-1 py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-2xl text-sm transition-all cursor-pointer shadow-md shadow-purple-200"
                  >
                    เผยแพร่ประกาศทันที
                  </button>
                  <button
                    onClick={() => setAiStep('input')}
                    className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm cursor-pointer"
                  >
                    แก้ไขใหม่
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
