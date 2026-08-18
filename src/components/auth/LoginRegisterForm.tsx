import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import {
  Phone,
  User,
  KeyRound,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Sparkles,
  LogIn,
  UserCheck,
  ShieldCheck,
  Stethoscope,
  CheckCircle2,
  UserPlus
} from 'lucide-react';

interface LoginRegisterFormProps {
  onBack: () => void;
  onProceedToRoleSelection?: (userData?: { firstName: string; lastName: string; phone: string; role?: Role }) => void;
  onAdminClick?: () => void;
}

export const LoginRegisterForm: React.FC<LoginRegisterFormProps> = ({
  onBack,
  onProceedToRoleSelection,
  onAdminClick,
}) => {
  const { loginByPhone, showToast, allUsers } = useApp();

  const [selectedRole, setSelectedRole] = useState<Role>('PATIENT');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [step, setStep] = useState<'info' | 'otp'>('info');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [hasNoAccountError, setHasNoAccountError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Role definitions for selector
  const roleOptions: { id: Role; title: string; subtitle: string; icon: any; activeClass: string; badgeClass: string }[] = [
    {
      id: 'PATIENT',
      title: 'ผู้ป่วย / ผู้สูงอายุ',
      subtitle: 'ตรวจสุขภาพ & บันทึกอาการ',
      icon: UserCheck,
      activeClass: 'border-emerald-600 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-300 shadow-xs',
      badgeClass: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'CAREGIVER',
      title: 'ผู้ดูแล / ญาติ',
      subtitle: 'ติดตามผู้ป่วยในความดูแล',
      icon: ShieldCheck,
      activeClass: 'border-blue-600 bg-blue-50/80 text-blue-950 ring-2 ring-blue-300 shadow-xs',
      badgeClass: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'VHV',
      title: 'อสม.',
      subtitle: 'ดูแลชุมชน & จัดการคิวนัด',
      icon: Stethoscope,
      activeClass: 'border-purple-600 bg-purple-50/80 text-purple-950 ring-2 ring-purple-300 shadow-xs',
      badgeClass: 'bg-purple-100 text-purple-800',
    },
  ];

  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
    setErrorMsg('');
    setHasNoAccountError(false);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setHasNoAccountError(false);

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMsg('กรุณากรอกเบอร์โทรศัพท์มือถือให้ครบ 10 หลัก (เช่น 0812345678)');
      return;
    }

    // Check whether an account exists for this phone number
    const existingUser = allUsers.find(u => u.phone === cleanPhone);

    if (!existingUser) {
      // User does not have an account -> Display RED error message as requested
      setHasNoAccountError(true);
      setErrorMsg('คุณยังไม่เคยมีบัญชี');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      showToast('รหัส OTP ทดสอบถูกส่งแล้ว (รหัสทดสอบ: 123456)');
    }, 350);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setHasNoAccountError(false);

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setErrorMsg('กรุณากรอกรหัส OTP ให้ครบ 6 หลัก');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const cleanPhone = phone.replace(/\D/g, '');
      const result = loginByPhone(cleanPhone, selectedRole);

      if (!result.success) {
        setHasNoAccountError(true);
        setErrorMsg(result.error || 'คุณยังไม่เคยมีบัญชี');
        setStep('info');
      }
    }, 400);
  };

  const handleResendOtp = () => {
    setOtp(['', '', '', '', '', '']);
    showToast('ขอรหัส OTP ใหม่เรียบร้อยแล้ว (รหัสคือ 123456)');
  };

  const handleGoToRegister = () => {
    onProceedToRoleSelection?.({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.replace(/\D/g, ''),
      role: selectedRole,
    });
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-slate-200 my-6 animate-in fade-in zoom-in duration-200">
      <button
        onClick={step === 'otp' ? () => setStep('info') : onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-700 mb-4 transition-colors cursor-pointer bg-slate-100 px-3 py-1.5 rounded-xl"
      >
        <ArrowLeft className="w-4 h-4" />
        ย้อนกลับ
      </button>

      <div className="text-center mb-5 space-y-1">
        <div className="w-13 h-13 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs">
          <LogIn className="w-7 h-7" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          เข้าสู่ระบบ
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          {step === 'info' ? 'เลือกบทบาทและกรอกเบอร์โทรศัพท์เพื่อเข้าใช้งาน' : 'ยืนยันตัวตนด้วยรหัส OTP 6 หลัก'}
        </p>
      </div>

      {/* Red Error Message if user has no account (Explicit requirement) */}
      {hasNoAccountError && (
        <div className="mb-5 p-4 bg-rose-50 border-2 border-rose-400 text-rose-900 rounded-2xl space-y-2 animate-shake shadow-xs">
          <div className="flex items-center gap-2 text-rose-700 font-black text-base sm:text-lg">
            <AlertCircle className="w-6 h-6 shrink-0 text-rose-600" />
            <span>{errorMsg || 'คุณยังไม่เคยมีบัญชี'}</span>
          </div>
          <p className="text-xs text-rose-700 leading-relaxed font-semibold">
            ไม่พบบัญชีผู้ใช้งานเบอร์นี้ในระบบ กรุณาตรวจสอบเบอร์โทรศัพท์ หรือกดปุ่มลงทะเบียนเพื่อสร้างบัญชีใหม่
          </p>
          <button
            type="button"
            onClick={handleGoToRegister}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs mt-1"
          >
            <UserPlus className="w-4 h-4" />
            กดที่นี่เพื่อลงทะเบียนผู้ใช้ใหม่
          </button>
        </div>
      )}

      {/* Standard Error Message if any other validation fails */}
      {errorMsg && !hasNoAccountError && (
        <div className="mb-4 p-3.5 bg-rose-50 border-2 border-rose-300 text-rose-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {step === 'info' ? (
        <div className="space-y-4">
          {/* Role Selection Tabs */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-2">
              เลือกบทบาทที่ต้องการเข้าสู่ระบบ:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {roleOptions.map(r => {
                const Icon = r.icon;
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleChange(r.id)}
                    className={`p-2.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      isSelected
                        ? r.activeClass
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-current' : 'text-slate-500'}`} />
                    <span className="text-xs font-bold leading-tight line-clamp-1">{r.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleNextStep} className="space-y-4 pt-1">
            <div>
              <label className="block text-xs sm:text-sm font-extrabold text-slate-700 mb-1">
                เบอร์โทรศัพท์มือถือ (10 หลัก) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={phone}
                  onChange={e => {
                    setPhone(e.target.value.replace(/\D/g, ''));
                    setHasNoAccountError(false);
                    setErrorMsg('');
                  }}
                  placeholder="0812345678"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-base font-bold text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-extrabold rounded-2xl text-base shadow-lg shadow-blue-200 transition-all cursor-pointer mt-3 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'รับรหัส OTP เพื่อเข้าใช้งาน'
              )}
            </button>
          </form>

          {/* Direct link to Register */}
          <div className="text-center pt-3 border-t border-slate-100 space-y-2">
            <p className="text-xs text-slate-600 font-medium">
              ยังไม่มีบัญชีใช้งานใช่หรือไม่?{' '}
              <button
                type="button"
                onClick={handleGoToRegister}
                className="text-blue-700 font-extrabold hover:underline cursor-pointer"
              >
                ลงทะเบียนผู้ใช้ใหม่
              </button>
            </p>

            {onAdminClick && (
              <button
                type="button"
                onClick={onAdminClick}
                className="text-[11px] font-bold text-slate-700 hover:text-blue-700 flex items-center justify-center gap-1 mx-auto py-1 px-2.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                เข้าสู่ระบบผู้ดูแล / Super Admin Portal
              </button>
            )}
          </div>
        </div>
      ) : (
        /* OTP Step */
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div className="text-center bg-blue-50 p-4 rounded-2xl border border-blue-200 space-y-1">
            <KeyRound className="w-8 h-8 text-blue-700 mx-auto" />
            <p className="text-xs text-blue-900 font-semibold">
              รหัส OTP ส่งไปยังเบอร์โทรศัพท์
            </p>
            <p className="text-base font-extrabold text-blue-950">{phone}</p>
            <span className="inline-block px-2.5 py-0.5 bg-amber-100 text-amber-900 text-[11px] font-bold rounded-md mt-1">
              💡 รหัส OTP สำหรับทดสอบคือ: 123456
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 text-center mb-2">
              รหัส OTP (6 หลัก)
            </label>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => {
                    const val = e.target.value;
                    const newOtp = [...otp];
                    newOtp[idx] = val;
                    setOtp(newOtp);
                  }}
                  className="w-11 h-12 text-center text-xl font-black bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-blue-700 focus:bg-white outline-none"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-700 hover:bg-blue-800 text-white font-extrabold rounded-2xl text-base shadow-lg shadow-blue-200 transition-all cursor-pointer flex items-center justify-center"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              `ยืนยันเข้าสู่ระบบ (${selectedRole === 'VHV' ? 'อสม.' : selectedRole === 'PATIENT' ? 'ผู้สูงอายุ' : 'ผู้ดูแล'})`
            )}
          </button>

          {/* Action Links */}
          <div className="flex items-center justify-between text-xs pt-1 font-bold">
            <button
              type="button"
              onClick={() => setStep('info')}
              className="text-slate-600 hover:text-slate-900 underline cursor-pointer"
            >
              แก้ไขเบอร์โทรศัพท์
            </button>
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-blue-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              ขอรหัส OTP ใหม่
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
