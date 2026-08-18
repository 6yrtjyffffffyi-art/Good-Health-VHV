import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  X,
  Heart,
  Activity,
  Calendar,
  MapPin,
  Stethoscope,
  Pill,
  ShieldCheck,
  AlertTriangle,
  User,
  Volume2,
  Users,
  ClipboardList,
  Sparkles,
  FileSpreadsheet,
  Map,
  CheckCircle2,
  Phone,
  ChevronRight,
  Info,
  Sliders,
  LogOut,
  Edit3
} from 'lucide-react';
import { VoiceReaderButton } from './VoiceReaderButton';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'PATIENT' | 'CAREGIVER' | 'VHV' | 'PROFILE';
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
  initialTab
}) => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'PATIENT' | 'CAREGIVER' | 'VHV' | 'PROFILE'>('PATIENT');
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    } else if (currentUser?.role) {
      setActiveTab(currentUser.role as 'PATIENT' | 'CAREGIVER' | 'VHV');
    }
  }, [initialTab, currentUser, isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (dontShowAgain && currentUser?.role) {
      try {
        localStorage.setItem(`app_seen_guide_${currentUser.role}`, 'true');
      } catch (e) {
        console.warn('Cannot save guide preference', e);
      }
    }
    onClose();
  };

  const getRoleBadge = (tab: string) => {
    switch (tab) {
      case 'PATIENT':
        return { label: 'ผู้สูงอายุ', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'CAREGIVER':
        return { label: 'ผู้ดูแล', color: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'VHV':
        return { label: 'อสม.', color: 'bg-purple-100 text-purple-800 border-purple-300' };
      default:
        return { label: 'โปรไฟล์ & ตั้งค่า', color: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-700 text-white p-5 sm:p-6 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-inner">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">คู่มือการใช้งานระบบ</h2>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs">
                  เวอร์ชันใช้งานจริง
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-100 mt-0.5">
                คำแนะนำและขั้นตอนการใช้งานระบบสำหรับผู้สูงอายุ ผู้ดูแล และ อสม.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <VoiceReaderButton
              textToRead={
                activeTab === 'PATIENT'
                  ? 'คู่มือการใช้งานสำหรับผู้สูงอายุ ระบบประกอบด้วย 6 เมนูหลักขนาดใหญ่ บันทึกสัญญาณชีพ ตรวจสอบสิทธิ สปสช. ดูตารางยา ปฏิทินชุมชน และปุ่มขอความช่วยเหลือฉุกเฉิน SOS'
                  : activeTab === 'CAREGIVER'
                  ? 'คู่มือสำหรับผู้ดูแล ช่วยให้คุณติดตามสุขภาพ บันทึกยา สัญญาณชีพ และจัดการสิทธิ์การเข้าถึงข้อมูลของ อสม.'
                  : activeTab === 'VHV'
                  ? 'คู่มือสำหรับ อสม. รวบรวมฟังก์ชัน 6 เมนูตรวจสุขภาพ แผนที่ปักหมุดพิกัด GPS ระบบส่งออกรายงานสรุปส่ง รพ.สต. และรายงานประวัติเฉพาะบุคคล'
                  : 'คู่มือโปรไฟล์และการตั้งค่า แนะนำวิธีแก้ไขข้อมูลส่วนตัว โรคประจำตัว สิทธิการรักษา และการปรับขนาดตัวอักษร'
              }
              label="ฟังคู่มือ"
              size="md"
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
            />
            <button
              onClick={handleClose}
              className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="ปิดคู่มือ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 p-2 sm:px-6 border-b border-slate-200 flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('PATIENT')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'PATIENT'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-700 hover:bg-white hover:text-emerald-700'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>1. คู่มือผู้สูงอายุ</span>
          </button>

          <button
            onClick={() => setActiveTab('CAREGIVER')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'CAREGIVER'
                ? 'bg-blue-700 text-white shadow-md'
                : 'text-slate-700 hover:bg-white hover:text-blue-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>2. คู่มือผู้ดูแล</span>
          </button>

          <button
            onClick={() => setActiveTab('VHV')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'VHV'
                ? 'bg-purple-700 text-white shadow-md'
                : 'text-slate-700 hover:bg-white hover:text-purple-700'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>3. คู่มือ อสม.</span>
          </button>

          <button
            onClick={() => setActiveTab('PROFILE')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'PROFILE'
                ? 'bg-slate-800 text-white shadow-md'
                : 'text-slate-700 hover:bg-white hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>4. คู่มือโปรไฟล์ & ตั้งค่า</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-slate-800">
          {/* TAB 1: PATIENT GUIDE */}
          {activeTab === 'PATIENT' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-emerald-900">
                  <strong className="font-bold">หน้าจอออกแบบสำหรับผู้สูงอายุโดยเฉพาะ:</strong> ปุ่มกดขนาดใหญ่ ตัวอักษรอ่านง่าย มีระบบเสียงอ่านภาษาไทย และปุ่มขอความช่วยเหลือฉุกเฉิน SOS
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Step 1 */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 transition-all space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-sm">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">1</span>
                    <span>6 เมนูหลักดูแลสุขภาพ</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    หน้าแรกแสดง 6 การ์ดขนาดใหญ่ ได้แก่ ตรวจสอบสิทธิ สปสช., ปฏิทินนัดหมาย, บันทึกสัญญาณชีพ, สถานพยาบาลใกล้ฉัน, บันทึกอาการผิดปกติ และรายการยาประจำ
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 transition-all space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-sm">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">2</span>
                    <span>บันทึกความดันและชีพจร</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    กดเมนู "3. บันทึกสัญญาณชีพ" เพื่อกรอกค่าความดันตัวบน (SYS), ตัวล่าง (DIA) และชีพจร ระบบจะแสดงแถบสีเขียว/เหลือง/แดง แปลผลสุขภาพอัตโนมัติ
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 transition-all space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-sm">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">3</span>
                    <span>การตรวจสิทธิและค้นหาโรงพยาบาล</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    กดเมนู "1. เช็กสิทธิรักษา" เพื่อดูสิทธิ สปสช. และหน่วยบริการประจำ หรือกด "4. สถานพยาบาลใกล้ฉัน" เพื่อโทรออกหรือกดนำทางด้วย Google Maps
                  </p>
                </div>

                {/* Step 4 */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 transition-all space-y-2">
                  <div className="flex items-center gap-2 text-rose-700 font-extrabold text-sm">
                    <span className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-xs">4</span>
                    <span>ปุ่มขอความช่วยเหลือฉุกเฉิน SOS</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    ปุ่มสีแดง <strong className="text-rose-600">"SOS"</strong> ด้านบนขวา กดเพื่อส่งสัญญาณเตือนไปยังผู้ดูแลและ อสม. ทันที พร้อมปุ่มโทรสายด่วน 1669
                  </p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs sm:text-sm text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-amber-700" />
                  <span>เคล็ดลับการฟังเสียงอ่าน:</span>
                </div>
                <p className="text-amber-800">
                  หากตัวหนังสือเล็กหรืออ่านไม่สะดวก ให้มองหาปุ่มรูปลำโพง <strong>"ฟังเสียง"</strong> หรือแตะเปิดสวิตช์ <strong>"อ่านเสียง: เปิด"</strong> ที่แถบด้านบนสุด
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: CAREGIVER GUIDE */}
          {activeTab === 'CAREGIVER' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-blue-900">
                  <strong className="font-bold">ระบบสำหรับผู้ดูแล (Caregiver):</strong> ช่วยให้คุณสามารถดูแลผู้สูงอายุได้หลายท่านพร้อมกัน ติดตามสัญญาณชีพ และบริหารจัดการสิทธิ์การเข้าถึงข้อมูลของ อสม.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all space-y-2">
                  <div className="flex items-center gap-2 text-blue-700 font-extrabold text-sm">
                    <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">1</span>
                    <span>สลับดูแลผู้สูงอายุและเพิ่มรายชื่อ</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    คุณสามารถเลือกสลับดูข้อมูลผู้สูงอายุที่ดูแลได้จากแถบด้านบน หรือกดปุ่ม <strong>"+ เพิ่มผู้สูงอายุที่ดูแล"</strong> เพื่อเพิ่มคนในครอบครัว
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all space-y-2">
                  <div className="flex items-center gap-2 text-blue-700 font-extrabold text-sm">
                    <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">2</span>
                    <span>ติดตามสัญญาณชีพ & ยาประจำ</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    ตรวจเช็คประวัติความดันโลหิต ชีพจร อาการผิดปกติ และจัดการเวลาทานยา พร้อมรับการแจ้งเตือนเมื่อค่าผิดปกติ
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all space-y-2">
                  <div className="flex items-center gap-2 text-blue-700 font-extrabold text-sm">
                    <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">3</span>
                    <span>การจัดการสิทธิ์ อสม. (PDPA)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    สามารถกดเลือก <strong>"อนุญาตให้ อสม. ดูแล"</strong> หรือ <strong>"ระงับสิทธิ์ชั่วคราว"</strong> ได้ตลอดเวลาตามความยินยอมของครอบครัว
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all space-y-2">
                  <div className="flex items-center gap-2 text-blue-700 font-extrabold text-sm">
                    <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">4</span>
                    <span>การแจ้งเตือนฉุกเฉิน & ติดต่อ อสม.</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    เมื่อผู้สูงอายุกด SOS ระบบจะส่งข้อความแจ้งเตือนมายังผู้ดูแลทันที และมีเบอร์ติดต่อ อสม. ประจำเขตเพื่อประสานงานได้อย่างรวดเร็ว
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VHV GUIDE */}
          {activeTab === 'VHV' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl flex items-start gap-3">
                <Info className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-purple-900">
                  <strong className="font-bold">ระบบปฏิบัติงานภาคสนามสำหรับ อสม.:</strong> รองรับการดูแลผู้สูงอายุในเขตรับผิดชอบ การตรวจสุขภาพ 6 เมนู แผนที่ปักหมุดพิกัด GPS และระบบออกรายงานสรุปส่ง รพ.สต.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-purple-400 transition-all space-y-2">
                  <div className="flex items-center gap-2 text-purple-700 font-extrabold text-sm">
                    <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs">1</span>
                    <span>จัดการรายชื่อผู้สูงอายุ & ขอสิทธิ์</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    เลือก 1 ใน 6 เมนูตรวจสุขภาพ จากนั้นกดเลือกผู้สูงอายุ หรือกด <strong>"+ เพิ่มผู้สูงอายุ"</strong> / <strong>"ลบ"</strong> พร้อมระบบขอสิทธิ์อนุญาตเข้าถึงข้อมูล
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-purple-400 transition-all space-y-2">
                  <div className="flex items-center gap-2 text-purple-700 font-extrabold text-sm">
                    <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs">2</span>
                    <span>แผนที่ปักหมุดพิกัด GPS</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    เข้าเมนู <strong>"แผนที่ปักหมุด GPS"</strong> เพื่อดูตำแหน่งบ้านจำแนกตามกลุ่ม (ติดสังคม/ติดบ้าน/ติดเตียง) และกดนำทางด้วย Google Maps ผ่านพิกัด GPS จริง
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-purple-400 transition-all space-y-2">
                  <div className="flex items-center gap-2 text-purple-700 font-extrabold text-sm">
                    <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs">3</span>
                    <span>ออกรายงานสรุปส่ง อสม. & รายบุคคล</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    เข้าเมนู <strong>"ออกรายงาน"</strong> สามารถเลือกได้ทั้ง <strong>"รายงานสรุปแบบรวมสำหรับส่ง อสม./รพ.สต."</strong> หรือ <strong>"รายงานประวัติเฉพาะบุคคล"</strong> พร้อมปุ่มพิมพ์และส่งออก CSV
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-purple-400 transition-all space-y-2">
                  <div className="flex items-center gap-2 text-purple-700 font-extrabold text-sm">
                    <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs">4</span>
                    <span>สร้างประกาศชุมชนด้วย AI</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    กดปุ่ม <strong>"สร้างประกาศด้วย AI"</strong> เพื่อให้ระบบช่วยยกร่างข่าวสารสุขภาพ แจกจ่ายข้อมูลการนัดฉีดวัคซีน และกิจกรรมชุมชนได้อย่างรวดเร็ว
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE & SETTINGS GUIDE */}
          {activeTab === 'PROFILE' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl flex items-start gap-3">
                <Info className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-slate-900">
                  <strong className="font-bold">คู่มือการจัดการโปรไฟล์และตั้งค่าระบบ:</strong> ทุกบทบาทสามารถแก้ไขข้อมูลส่วนตัว ปรับการแสดงผล และตั้งค่าความปลอดภัยได้จากหน้าโปรไฟล์
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-400 transition-all space-y-2">
                  <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm">
                    <Edit3 className="w-4 h-4 text-blue-700" />
                    <span>1. แก้ไขข้อมูลส่วนตัวและที่อยู่</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    แตะเมนู <strong>"โปรไฟล์"</strong> แล้วกด <strong>"แก้ไขข้อมูล"</strong> เพื่ออัปเดตชื่อ นามสกุล เบอร์โทรศัพท์ บ้านเลขที่ หมู่บ้าน ตำบล และเบอร์ผู้ติดต่อฉุกเฉิน
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-400 transition-all space-y-2">
                  <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>2. โรคประจำตัวและสิทธิการรักษา</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    ระบุโรคประจำตัว ประวัติการแพ้ยา และสิทธิการรักษาพยาบาล สปสช. เพื่อให้ อสม. และแพทย์ช่วยเหลือได้อย่างถูกต้องแม่นยำ
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-400 transition-all space-y-2">
                  <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm">
                    <Sliders className="w-4 h-4 text-purple-600" />
                    <span>3. การปรับขนาดตัวอักษรหน้าจอ</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    กดปุ่ม <span className="font-bold px-1.5 py-0.5 bg-slate-100 rounded text-slate-800">ก</span>, <span className="font-bold px-1.5 py-0.5 bg-slate-100 rounded text-slate-800">ก+</span>, หรือ <span className="font-bold px-1.5 py-0.5 bg-slate-100 rounded text-slate-800">ก++</span> ด้านบนเพื่อขยายขนาดตัวหนังสือให้อ่านง่ายสบายตา
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-400 transition-all space-y-2">
                  <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm">
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>4. การสลับบทบาทหรือออกจากระบบ</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    สามารถกดปุ่ม <strong>"เปลี่ยนบทบาท"</strong> หรือ <strong>"ออกจากระบบ"</strong> ได้จากเมนูด้านบนหรือในหน้าโปรไฟล์ได้อย่างปลอดภัย
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 sm:px-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={e => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
            />
            <span>เข้าใจแล้ว ไม่ต้องแสดงคู่มือนี้อัตโนมัติอีกเมื่อเข้าสู่ระบบ (เปิดดูได้จากเมนูด้านบนตลอดเวลา)</span>
          </label>

          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-6 py-3 bg-blue-700 hover:bg-blue-800 active:scale-95 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md shadow-blue-200 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>เริ่มต้นใช้งาน</span>
          </button>
        </div>
      </div>
    </div>
  );
};
