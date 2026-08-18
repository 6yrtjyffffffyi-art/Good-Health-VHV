import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, AlertCircle, Clock, CheckCircle2, 
  XCircle, UserPlus, BookOpen, Lock, Phone, User, LogOut,
  Edit3, Trash2, ToggleLeft, ToggleRight, Database, PlusCircle,
  ArrowLeft, Gem, Sparkles, ArrowRight, Activity, Users, HeartPulse
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';

export interface AdminUser {
  id: string | number;
  name: string;
  phone: string;
  role: 'Diamond' | 'Platinum' | 'Ruby' | 'Sapphire' | 'Emerald' | string;
  status: 'Active' | 'Suspended';
  approvedDate: string;
  username?: string;
  passcode?: string;
}

// 💎 บัญชี Super Admin ถาวรของคุณ (บัญชีเดียวเริ่มต้น)
export const SUPER_ADMIN: AdminUser = {
  id: 'super-admin-001',
  username: 'bungbung999',
  passcode: '1089717',
  name: 'Super Diamond Admin',
  role: 'Diamond',
  phone: '080-000-0000',
  status: 'Active',
  approvedDate: '2026-01-01'
};

export const ADMIN_ROLES = [
  { id: 'Diamond', name: '💎 Diamond Admin (สิทธิ์สูงสุด)' },
  { id: 'Platinum', name: '⚪ Platinum Admin (ผู้ดูแลระดับสูง)' },
  { id: 'Ruby', name: '🔴 Ruby Admin (จัดการเคส SOS 24 ชม.)' },
  { id: 'Sapphire', name: '🔵 Sapphire Admin (จัดการข้อมูลสัญญาณชีพ)' },
  { id: 'Emerald', name: '🟢 Emerald Admin (ผู้ช่วยแอดมิน/ตรวจสอบ)' },
];

interface AutoRememberAdminSystemProps {
  onBack?: () => void;
}

export default function AutoRememberAdminSystem({ onBack }: AutoRememberAdminSystemProps) {
  const { enterAppAsAdmin, allPatients, allCaregivers, allVhvs } = useApp();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [adminRequests, setAdminRequests] = useState<{ id: number; name: string; phone: string }[]>([]);
  
  // 📁 รายชื่อแอดมินในระบบ (เริ่มต้นมีแค่ Super Admin คุณคนเดียว ไม่มีการแอบเพิ่มคนอื่น)
  const [approvedAdmins, setApprovedAdmins] = useState<AdminUser[]>([SUPER_ADMIN]);
  
  // Form Inputs ล็อกอิน/สมัคร
  const [inputName, setInputName] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  const [inputUsername, setInputUsername] = useState('');
  const [inputPasscode, setInputPasscode] = useState('');
  
  // States ควบคุมระบบ
  const [isPending, setIsPending] = useState(false);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState('Platinum');

  // Modal States สำหรับ "คุณเพิ่มแอดมินเอง"
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminPhone, setNewAdminPhone] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('Platinum');
  const [newAdminPasscode, setNewAdminPasscode] = useState('');

  // Modal State สำหรับแก้ไขยศ
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [editAdminRole, setEditAdminRole] = useState('Platinum');

  // 🧠 1. ระบบจดจำเครื่องถาวร (localStorage)
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('remembered_admin_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error('Error reading remembered admin user:', err);
    }
  }, []);

  // ⏳ Timer Cooldown 10 นาที (600 วินาที)
  useEffect(() => {
    let timer: any;
    if (cooldownTime > 0) {
      timer = setInterval(() => setCooldownTime((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldownTime]);

  const saveUserToDevice = (userData: AdminUser) => {
    setCurrentUser(userData);
    localStorage.setItem('remembered_admin_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('remembered_admin_user');
  };

  // ➕ ฟังก์ชันที่คุณเป็นคนกดเพิ่มแอดมินด้วยตัวเองจากหน้าข้อมูลส่วนตัว!
  const handleManualAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminPhone.trim()) {
      alert('กรุณากรอกชื่อและเบอร์โทรศัพท์ให้ครบถ้วน');
      return;
    }

    const createdAdmin: AdminUser = {
      id: Date.now(),
      name: newAdminName.trim(),
      phone: newAdminPhone.trim(),
      role: newAdminRole,
      passcode: newAdminPasscode.trim() || '1234', // ถ้าระบุรหัสผ่านก็จะใช้ตามนั้น
      status: 'Active',
      approvedDate: new Date().toISOString().split('T')[0]
    };

    setApprovedAdmins(prev => [...prev, createdAdmin]);
    alert(`เพิ่มแอดมินคุณ ${newAdminName} ยศ ${newAdminRole} สำเร็จเรียบร้อยแล้ว!`);
    
    // รีเซ็ตค่าฟอร์มและปิด Modal
    setNewAdminName('');
    setNewAdminPhone('');
    setNewAdminPasscode('');
    setShowAddModal(false);
  };

  // 📝 คนทั่วไปส่งคำขอสมัครแอดมิน
  const handleApplyAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldownTime > 0) return;

    if (!inputName.trim() || !inputPhone.trim()) {
      alert('กรุณากรอกชื่อและเบอร์โทรศัพท์ให้ครบถ้วน');
      return;
    }

    if (rejectedCount >= 3) {
      setCooldownTime(600);
      return;
    }

    const newRequest = {
      id: Date.now(),
      name: inputName.trim(),
      phone: inputPhone.trim(),
    };

    setAdminRequests(prev => [...prev, newRequest]);
    setIsPending(true);
  };

  // 🔑 ล็อกอินเข้าสู่ระบบ
  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Super Admin bungbung999
    if (inputUsername === SUPER_ADMIN.username && inputPasscode === SUPER_ADMIN.passcode) {
      saveUserToDevice(SUPER_ADMIN);
      setErrorMessage('');
      return;
    }

    // ล็อกอิน Admin ที่ถูกเพิ่ม/อนุมัติแล้ว
    const cleanPhone = inputPhone.replace(/\D/g, '');
    const foundAdmin = approvedAdmins.find(
      (a) => a.name.trim() === inputName.trim() && a.phone.replace(/\D/g, '') === cleanPhone && a.status === 'Active'
    );

    if (foundAdmin) {
      saveUserToDevice(foundAdmin);
      setErrorMessage('');
    } else {
      handleRejectedAction();
    }
  };

  const handleRejectedAction = () => {
    const newCount = rejectedCount + 1;
    setRejectedCount(newCount);
    setIsPending(false);

    if (newCount >= 3) {
      setCooldownTime(600);
    } else {
      setErrorMessage('ข้อมูลการเข้าสู่ระบบ ไม่ถูกต้อง');
    }
  };

  // 🔔 Super Admin กด [1. อนุมัติ] หรือ [2. ไม่อนุมัติ]
  const handleProcessRequest = (requestId: number, isApprove: boolean) => {
    const request = adminRequests.find((r) => r.id === requestId);
    if (!request) return;

    if (isApprove) {
      const newAdmin: AdminUser = {
        id: Date.now(),
        name: request.name,
        phone: request.phone,
        role: selectedRole,
        status: 'Active',
        approvedDate: new Date().toISOString().split('T')[0]
      };
      setApprovedAdmins(prev => [...prev, newAdmin]);
      alert(`อนุมัติคุณ ${request.name} เป็นแอดมินยศ ${selectedRole} เรียบร้อยแล้ว`);
    } else {
      alert(`ปฏิเสธคำขอของ คุณ ${request.name} เรียบร้อยแล้ว`);
    }

    setAdminRequests(prev => prev.filter((r) => r.id !== requestId));
  };

  // 🛠️ ปรับแต่งข้อมูลแอดมิน
  const handleToggleStatus = (adminId: string | number) => {
    setApprovedAdmins(prev => prev.map(admin => {
      if (admin.id === adminId && admin.username !== SUPER_ADMIN.username) {
        const newStatus: 'Active' | 'Suspended' = admin.status === 'Active' ? 'Suspended' : 'Active';
        return { ...admin, status: newStatus };
      }
      return admin;
    }));
  };

  const handleDeleteAdmin = (adminId: string | number) => {
    const targetAdmin = approvedAdmins.find(a => a.id === adminId);
    if (targetAdmin?.username === SUPER_ADMIN.username) {
      alert("ไม่สามารถลบบัญชี Super Admin ถาวรได้!");
      return;
    }

    if (window.confirm(`คุณต้องการลบแอดมิน ${targetAdmin?.name} ออกจากระบบใช่หรือไม่?`)) {
      setApprovedAdmins(prev => prev.filter(a => a.id !== adminId));
    }
  };

  const handleSaveEditRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;

    setApprovedAdmins(prev => prev.map(admin => {
      if (admin.id === editingAdmin.id) {
        return { ...admin, role: editAdminRole };
      }
      return admin;
    }));

    alert(`อัปเดตยศของ ${editingAdmin.name} เป็น ${editAdminRole} สำเร็จเรียบร้อยแล้ว`);
    setEditingAdmin(null);
  };

  // ---------------------------------------------------------------------------
  // ⏳ หน้าจอ 1: ติด Cooldown 10 นาที
  // ---------------------------------------------------------------------------
  if (cooldownTime > 0) {
    const minutes = Math.floor(cooldownTime / 60);
    const seconds = cooldownTime % 60;
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full text-center space-y-4 border border-rose-200">
          <Clock className="w-16 h-16 text-red-500 mx-auto animate-pulse" />
          <h2 className="text-xl font-bold text-gray-800">รอดำเนินการใหม่ในอีก 10 นาที</h2>
          <p className="text-sm text-gray-500">
            ระบบทำการล็อกชั่วคราวเนื่องจากมีการกรอกข้อมูลไม่ถูกต้องซ้ำหลายครั้ง
          </p>
          <div className="text-3xl font-mono font-bold text-red-600 bg-red-50 py-3 rounded-xl border border-red-200 shadow-inner">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds} นาที
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="w-full py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
            >
              กลับหน้าหลัก
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // ⏳ หน้าจอ 2: หน้ารอการอนุมัติ
  // ---------------------------------------------------------------------------
  if (isPending) {
    return (
      <div className="min-h-screen bg-blue-50/50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-4 border border-blue-100">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto text-blue-600 shadow-xs">
            <Clock className="w-8 h-8 animate-spin text-blue-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">หน้ารอการอนุมัติ</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            ระบบส่งข้อมูลของคุณ <span className="font-bold text-blue-700">{inputName}</span> ให้แอดมินระดับสูงสุดแล้ว
          </p>
          <button 
            type="button"
            onClick={() => setIsPending(false)}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-200 transition cursor-pointer">
            ยกเลิก / กลับหน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 🖥️ หน้าจอ 3: หน้าใช้งานหลัก (มีปุ่มให้คุณเพิ่มแอดมินเอง)
  // ---------------------------------------------------------------------------
  if (currentUser) {
    const isSuperAdmin = currentUser.role === 'Diamond' || currentUser.username === SUPER_ADMIN.username;

    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-wrap justify-between items-center gap-4 border border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {currentUser.role} Admin
                </span>
                {onBack && (
                  <button
                    onClick={onBack}
                    className="text-xs text-slate-500 hover:text-slate-800 underline font-medium cursor-pointer"
                  >
                    กลับสู่หน้าแอปหลัก
                  </button>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mt-2">ยินดีต้อนรับ, {currentUser.name}</h1>
              <p className="text-xs text-gray-500">เบอร์โทรศัพท์: {currentUser.phone}</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={() => enterAppAsAdmin(currentUser, 'VHV')}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-xs hover:from-blue-700 hover:to-indigo-700 transition shadow-md cursor-pointer"
                title="เข้าสู่หน้าแอปพลิเคชันหลักในโหมดแอดมิน"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>🚀 เข้าสู่แอปหลัก</span>
              </button>
              <button 
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-medium text-sm hover:bg-red-100 transition cursor-pointer">
                <LogOut className="w-4 h-4" /> ออกจากระบบ
              </button>
            </div>
          </div>

          {/* 🚀 บล็อกเข้าสู่แอปหลัก ควบคุมและดู/แก้ไขข้อมูล 3 บทบาท (อสม., ผู้สูงอายุ, ผู้ดูแล) */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white p-6 rounded-3xl shadow-xl space-y-4 border border-blue-500/30">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-inner">
                  <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wider">
                      SUPER ADMIN CONTROLLER
                    </span>
                    <span className="text-xs text-blue-200">สิทธิ์แก้ไขข้อมูลระดับสูงสุด</span>
                  </div>
                  <h2 className="text-xl font-black text-white mt-0.5">
                    เข้าสู่แอปหลักเพื่อดูและแก้ไขข้อมูล 3 บทบาท
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => enterAppAsAdmin(currentUser, 'VHV')}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-black text-xs sm:text-sm rounded-2xl transition-all shadow-lg hover:shadow-cyan-500/25 flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span>🚀 ไปยังแอปหลัก (โหมด อสม. เต็มระบบ)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-blue-100/80 leading-relaxed">
              แอดมินระดับสูงสุดสามารถเข้าดูและแก้ไขข้อมูลของทั้ง 3 บทบาทได้อย่างอิสระ มีฟีเจอร์เหมือน อสม. ทุกอย่าง ทั้งคิวตรวจเยี่ยม ทะเบียนผู้สูงอายุ ({allPatients.length} ท่าน) สัญญาณชีพ แผนที่พิกัดบ้าน รายงานสถิติ การแจ้งเตือน SOS 24 ชม. และสลับบทบาทได้ทันที
            </p>

            {/* 3 Interactive Cards for 3 Roles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              {/* 1. VHV Card */}
              <div 
                onClick={() => enterAppAsAdmin(currentUser, 'VHV')}
                className="bg-white/10 hover:bg-white/15 border border-white/10 hover:border-blue-400/60 rounded-2xl p-4 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">🏥</span>
                    <span className="text-[10px] font-black px-2 py-0.5 bg-blue-500/30 text-cyan-200 rounded-full border border-blue-400/40">
                      ฟังก์ชันครบทุกเมนู
                    </span>
                  </div>
                  <h3 className="font-black text-sm text-white group-hover:text-cyan-300 transition-colors">
                    1. บทบาท อสม. (VHV Full Control)
                  </h3>
                  <p className="text-[11px] text-blue-200/80 mt-1 line-clamp-2">
                    ดู/แก้ไขข้อมูลผู้สูงอายุทุกคน ({allPatients.length} คน) บันทึกสัญญาณชีพ คิวตรวจ แผนที่ GIS ประกาศชุมชน
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-cyan-300">
                  <span>เข้าสู่บทบาท อสม.</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* 2. Patient Card */}
              <div 
                onClick={() => enterAppAsAdmin(currentUser, 'PATIENT')}
                className="bg-white/10 hover:bg-white/15 border border-white/10 hover:border-emerald-400/60 rounded-2xl p-4 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">👵</span>
                    <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-500/30 text-emerald-200 rounded-full border border-emerald-400/40">
                      มุมมองผู้สูงอายุ/ผู้ป่วย
                    </span>
                  </div>
                  <h3 className="font-black text-sm text-white group-hover:text-emerald-300 transition-colors">
                    2. บทบาท ผู้สูงอายุ / ผู้ป่วย
                  </h3>
                  <p className="text-[11px] text-blue-200/80 mt-1 line-clamp-2">
                    ดู/แก้ไขสิทธิ สปสช. สัญญาณชีพ ยาประจำตัว บันทึกอาการ ปฏิทินนัดหมาย และปุ่มส่งสัญญาณฉุกเฉิน SOS
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-emerald-300">
                  <span>เข้าสู่บทบาท ผู้สูงอายุ</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* 3. Caregiver Card */}
              <div 
                onClick={() => enterAppAsAdmin(currentUser, 'CAREGIVER')}
                className="bg-white/10 hover:bg-white/15 border border-white/10 hover:border-purple-400/60 rounded-2xl p-4 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">👨‍👩‍👦</span>
                    <span className="text-[10px] font-black px-2 py-0.5 bg-purple-500/30 text-purple-200 rounded-full border border-purple-400/40">
                      มุมมองผู้ดูแล/ญาติ
                    </span>
                  </div>
                  <h3 className="font-black text-sm text-white group-hover:text-purple-300 transition-colors">
                    3. บทบาท ผู้ดูแล / ญาติ
                  </h3>
                  <p className="text-[11px] text-blue-200/80 mt-1 line-clamp-2">
                    ติดตามและแก้ไขข้อมูลผู้สูงอายุในความดูแล แจ้งเตือนนัดหมาย และรับการแจ้งเตือน SOS ทันที
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-purple-300">
                  <span>เข้าสู่บทบาท ผู้ดูแล</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* 🔔 คำขออนุมัติแอดมิน (เฉพาะ Super Admin) */}
          {isSuperAdmin && (
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-bold text-amber-900">
                  การแจ้งเตือน: คำขออนุมัติแอดมินใหม่ ({adminRequests.length})
                </h2>
              </div>

              <div className="mb-4 bg-white p-4 rounded-xl border border-amber-100">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  เลือกยศอัญมณีล่วงหน้าสำหรับอนุมัติคำขอถัดไป:
                </label>
                <select 
                  value={selectedRole} 
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-amber-400">
                  {ADMIN_ROLES.filter(r => r.id !== 'Diamond').map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              {adminRequests.length === 0 ? (
                <p className="text-sm text-amber-700">ไม่มีคำขอที่รอการอนุมัติในขณะนี้</p>
              ) : (
                <div className="space-y-3">
                  {adminRequests.map((req) => (
                    <div key={req.id} className="bg-white p-4 rounded-xl border flex flex-wrap justify-between items-center gap-2 shadow-2xs">
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{req.name}</p>
                        <p className="text-xs text-gray-500">เบอร์โทร: {req.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          type="button"
                          onClick={() => handleProcessRequest(req.id, true)}
                          className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition cursor-pointer shadow-xs">
                          <CheckCircle2 className="w-4 h-4" /> 1. อนุมัติ
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleProcessRequest(req.id, false)}
                          className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition cursor-pointer shadow-xs">
                          <XCircle className="w-4 h-4" /> 2. ไม่อนุมัติ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 📊 หน้าตารางข้อมูลแอดมิน + ปุ่มให้คุณกดเพิ่มแอดมินเอง */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm space-y-4 border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5 text-blue-600">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    ข้อมูลและจัดการทีมแอดมิน ({approvedAdmins.length} ท่าน)
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    ระบบสิทธิ์อัญมณี 5 ระดับ และการควบคุมสิทธิ์รายบุคคล
                  </p>
                </div>
              </div>
              
              {/* ➕ ปุ่มเพิ่มแอดมินใหม่ (ให้คุณกดเพิ่มเอง) */}
              {isSuperAdmin && (
                <button 
                  type="button"
                  onClick={() => {
                    setNewAdminName('');
                    setNewAdminPhone('');
                    setNewAdminRole('Platinum');
                    setNewAdminPasscode('');
                    setShowAddModal(true);
                  }}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-2xl text-xs font-bold transition shadow-sm cursor-pointer shrink-0">
                  <PlusCircle className="w-4 h-4" /> 
                  <span>+ เพิ่มข้อมูลแอดมินใหม่</span>
                </button>
              )}
            </div>

            {/* 📱 1. MOBILE DATA CARDS (แสดงผลบนมือถือเท่านั้น - ห้ามใช้ <table> บนมือถือ) */}
            <div className="block md:hidden space-y-3">
              {approvedAdmins.map((admin) => {
                const isOwner = admin.username === SUPER_ADMIN.username;
                const roleBadgeColor = 
                  admin.role === 'Diamond' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                  admin.role === 'Platinum' ? 'bg-slate-100 text-slate-800 border-slate-300' :
                  admin.role === 'Ruby' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                  admin.role === 'Sapphire' ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300';

                return (
                  <div 
                    key={admin.id} 
                    className="bg-slate-50/80 hover:bg-white rounded-2xl p-4 border border-slate-200 shadow-xs transition-all space-y-3"
                  >
                    {/* Top Row: Name + Edit Arrow */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <strong className="text-sm font-black text-slate-900 block">
                            {admin.name}
                          </strong>
                          {isOwner && (
                            <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md font-bold">
                              👑 เจ้าของระบบ
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-black border ${roleBadgeColor}`}>
                            💎 {admin.role} Admin
                          </span>
                          {admin.status === 'Active' ? (
                            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> ใช้งานอยู่
                            </span>
                          ) : (
                            <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> ระงับสิทธิ์
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right Edit Arrow/Button */}
                      {isSuperAdmin && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAdmin(admin);
                            setEditAdminRole(admin.role);
                          }}
                          className="p-2 bg-white hover:bg-blue-50 text-blue-600 rounded-xl border border-slate-200 shadow-xs transition cursor-pointer shrink-0"
                          title="แก้ไขยศแอดมิน"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Middle Detail: Phone and Date */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">เบอร์โทรศัพท์</span>
                        <a href={`tel:${admin.phone}`} className="font-mono font-bold text-slate-700 hover:text-blue-600 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {admin.phone}
                        </a>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">วันที่อนุมัติ/บันทึก</span>
                        <span className="text-slate-600 font-medium block mt-0.5">
                          {admin.approvedDate || '2026-01-01'}
                        </span>
                      </div>
                    </div>

                    {/* Mobile Action Bar */}
                    {isSuperAdmin && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAdmin(admin);
                            setEditAdminRole(admin.role);
                          }}
                          className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer border border-blue-200"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>เปลี่ยนยศ</span>
                        </button>

                        {!isOwner && (
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(admin.id)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer border ${
                              admin.status === 'Active'
                                ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                            }`}
                          >
                            {admin.status === 'Active' ? 'ระงับ' : 'เปิดใช้งาน'}
                          </button>
                        )}

                        {!isOwner && (
                          <button
                            type="button"
                            onClick={() => handleDeleteAdmin(admin.id)}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl transition cursor-pointer border border-rose-200"
                            title="ลบแอดมิน"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 💻 2. DESKTOP DATA TABLE (แสดงผลบนจอคอมพิวเตอร์ Tablet / Desktop) */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 text-xs font-bold border-b border-slate-200">
                    <th className="p-3.5">1. ชื่อ-นามสกุล</th>
                    <th className="p-3.5">2. เบอร์โทรศัพท์</th>
                    <th className="p-3.5">3. ยศอัญมณี</th>
                    <th className="p-3.5">4. สถานะ</th>
                    <th className="p-3.5">5. วันที่อนุมัติ/บันทึก</th>
                    <th className="p-3.5 text-center">6. การจัดการ / ปรับแต่ง</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                  {approvedAdmins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-blue-50/40 transition">
                      <td className="p-3.5 font-bold text-slate-900">
                        {admin.name}
                        {admin.username === SUPER_ADMIN.username && (
                          <span className="ml-2 text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md font-bold">
                            👑 เจ้าของระบบ
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 font-mono">{admin.phone}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black border ${
                          admin.role === 'Diamond' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                          admin.role === 'Platinum' ? 'bg-slate-100 text-slate-800 border-slate-300' :
                          admin.role === 'Ruby' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                          admin.role === 'Sapphire' ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}>
                          💎 {admin.role} Admin
                        </span>
                      </td>
                      <td className="p-3.5">
                        {admin.status === 'Active' ? (
                          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> ใช้งานอยู่
                          </span>
                        ) : (
                          <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg font-bold inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> ระงับสิทธิ์
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-500">{admin.approvedDate || '2026-01-01'}</td>
                      <td className="p-3.5 text-center">
                        {isSuperAdmin ? (
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              type="button"
                              onClick={() => {
                                setEditingAdmin(admin);
                                setEditAdminRole(admin.role);
                              }}
                              title="เปลี่ยนยศแอดมิน"
                              className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition cursor-pointer border border-blue-200 shadow-xs flex items-center gap-1 font-bold text-xs">
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>แก้ไข</span>
                            </button>

                            {admin.username !== SUPER_ADMIN.username && (
                              <button 
                                type="button"
                                onClick={() => handleToggleStatus(admin.id)}
                                title={admin.status === 'Active' ? 'ระงับสิทธิ์' : 'เปิดใช้งาน'}
                                className={`p-2 rounded-xl transition cursor-pointer border shadow-xs ${
                                  admin.status === 'Active' 
                                    ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200' 
                                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                                }`}>
                                {admin.status === 'Active' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                              </button>
                            )}

                            {admin.username !== SUPER_ADMIN.username && (
                              <button 
                                type="button"
                                onClick={() => handleDeleteAdmin(admin.id)}
                                title="ลบแอดมิน"
                                className="p-2 bg-rose-50 text-rose-700 rounded-xl hover:bg-rose-100 transition cursor-pointer border border-rose-200 shadow-xs">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[10px]">ไม่มีสิทธิ์แก้ไข</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 📖 คู่มือการใช้งาน */}
          <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4 border border-blue-100">
            <div className="flex items-center gap-2 text-blue-600">
              <BookOpen className="w-6 h-6" />
              <h2 className="text-lg font-bold text-gray-800">คู่มือการใช้งานระบบแอดมิน (Admin Manual)</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
              <div className="p-4 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
                <p className="font-bold text-gray-800 text-sm flex items-center gap-1">💎 สิทธิ์ Super Admin (bungbung999)</p>
                <p>• สามารถกดปุ่ม "+ เพิ่มข้อมูลแอดมินใหม่" เพื่อป้อนชื่อ เบอร์โทร และยศแอดมินเข้าสู่ระบบด้วยตนเองได้ทันที</p>
                <p>• ตรวจสอบและอนุมัติคำขอที่ส่งมาจากหน้าหลักได้</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
                <p className="font-bold text-gray-800 text-sm">🛡️ สิทธิ์ Admin ทั่วไป</p>
                <p>• ดูแลจัดการระบบและข้อมูลเคส SOS ตามขอบเขตสิทธิ์ยศของตนเอง</p>
              </div>
            </div>
          </div>

        </div>

        {/* ➕ Modal สำหรับให้คุณกดเพิ่มข้อมูลแอดมินใหม่เอง */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl border border-gray-200">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-lg font-bold text-gray-800">➕ ป้อนข้อมูลเพิ่มแอดมินใหม่</h3>
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)} 
                  className="text-gray-400 hover:text-gray-600 text-lg font-bold cursor-pointer">
                  ✕
                </button>
              </div>

              <form onSubmit={handleManualAddAdmin} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">ชื่อ-นามสกุล แอดมิน</label>
                  <input 
                    type="text" 
                    required
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    placeholder="เช่น คุณสมชาย สายชล"
                    className="w-full p-2.5 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                  <input 
                    type="tel" 
                    required
                    value={newAdminPhone}
                    onChange={(e) => setNewAdminPhone(e.target.value)}
                    placeholder="เช่น 081-234-5678"
                    className="w-full p-2.5 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">เลือกยศอัญมณี</label>
                  <select 
                    value={newAdminRole}
                    onChange={(e) => setNewAdminRole(e.target.value)}
                    className="w-full p-2.5 border rounded-xl text-xs bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500">
                    {ADMIN_ROLES.filter(r => r.id !== 'Diamond').map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">ตั้งรหัสผ่านแก้ไข (Edit PIN / Passcode)</label>
                  <input 
                    type="password" 
                    maxLength={6}
                    value={newAdminPasscode}
                    onChange={(e) => setNewAdminPasscode(e.target.value)}
                    placeholder="กำหนดรหัส 4-6 หลัก (ถ้าไม่ใส่จะตั้งเป็น 1234)"
                    className="w-full p-2.5 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-2 pt-3">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="w-1/2 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition cursor-pointer">
                    ยกเลิก
                  </button>
                  <button 
                    type="submit"
                    className="w-1/2 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition cursor-pointer shadow-xs">
                    บันทึกข้อมูลแอดมิน
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ✏️ Modal สำหรับแก้ไขยศแอดมิน */}
        {editingAdmin && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl border border-gray-200">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-lg font-bold text-gray-800">✏️ แก้ไขยศแอดมิน: {editingAdmin.name}</h3>
                <button 
                  type="button" 
                  onClick={() => setEditingAdmin(null)} 
                  className="text-gray-400 hover:text-gray-600 text-lg font-bold cursor-pointer">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEditRole} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">ชื่อแอดมิน</label>
                  <input 
                    type="text" 
                    disabled
                    value={editingAdmin.name}
                    className="w-full p-2.5 border rounded-xl text-xs bg-gray-100 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">เลือกยศอัญมณีใหม่</label>
                  <select 
                    value={editAdminRole}
                    onChange={(e) => setEditAdminRole(e.target.value)}
                    className="w-full p-2.5 border rounded-xl text-xs bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500">
                    {ADMIN_ROLES.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 pt-3">
                  <button 
                    type="button"
                    onClick={() => setEditingAdmin(null)}
                    className="w-1/2 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition cursor-pointer">
                    ยกเลิก
                  </button>
                  <button 
                    type="submit"
                    className="w-1/2 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition cursor-pointer shadow-xs">
                    บันทึกการเปลี่ยนยศ
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 📝 หน้าจอ 4: หน้าหลัก เข้าสู่ระบบ / สมัคร
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full space-y-6 border border-gray-200 my-6">
        
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-700 transition cursor-pointer bg-slate-100 px-3 py-1.5 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับสู่หน้าหลัก
          </button>
        )}

        <div className="text-center space-y-1">
          <ShieldCheck className="w-12 h-12 text-blue-600 mx-auto" />
          <h1 className="text-xl font-bold text-gray-800">เข้าสู่ระบบ / ลงทะเบียนแอดมิน</h1>
          <p className="text-xs text-gray-500">กรอกข้อมูลส่วนตัวเพื่อส่งคำขอหรือเข้าใช้งาน</p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleApplyAdmin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">ชื่อ-นามสกุล</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input 
                type="text" 
                value={inputName} 
                onChange={(e) => setInputName(e.target.value)}
                placeholder="กรอกชื่อของคุณ"
                className="w-full pl-9 pr-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">เบอร์โทรศัพท์</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input 
                type="tel" 
                value={inputPhone} 
                onChange={(e) => setInputPhone(e.target.value)}
                placeholder="กรอกเบอร์โทรศัพท์"
                className="w-full pl-9 pr-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button 
              type="submit"
              className="w-1/2 py-2.5 bg-blue-600 text-white font-medium text-xs rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-1 cursor-pointer">
              <UserPlus className="w-4 h-4" /> ส่งคำขออนุมัติ
            </button>
            <button 
              type="button"
              onClick={() => handleLogin()}
              className="w-1/2 py-2.5 bg-slate-800 text-white font-medium text-xs rounded-xl hover:bg-slate-900 transition flex items-center justify-center gap-1 cursor-pointer">
              <ShieldCheck className="w-4 h-4" /> ล็อกอิน Admin
            </button>
          </div>
        </form>

        <div className="border-t pt-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">สำหรับ Super Admin (ควบคุมสูงสุด)</p>
          <div className="space-y-2">
            <input 
              type="text" 
              placeholder="Username" 
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
              className="w-full p-2 border rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <input 
              type="password" 
              placeholder="Passcode" 
              value={inputPasscode}
              onChange={(e) => setInputPasscode(e.target.value)}
              className="w-full p-2 border rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <button 
              type="button"
              onClick={() => handleLogin()}
              className="w-full py-2 bg-gray-800 text-white rounded-lg text-xs font-medium hover:bg-gray-900 transition flex items-center justify-center gap-1 cursor-pointer">
              <Lock className="w-3 h-3" /> เข้าสู่ระบบด้วย Super Admin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
