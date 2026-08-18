import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { DeviceFrameWrapper } from './components/common/DeviceFrameWrapper';

// Auth Components
import { WelcomeScreen } from './components/auth/WelcomeScreen';
import { RoleSelection } from './components/auth/RoleSelection';
import { LoginRegisterForm } from './components/auth/LoginRegisterForm';
import { PatientRegisterForm } from './components/auth/PatientRegisterForm';
import { CaregiverRegisterForm } from './components/auth/CaregiverRegisterForm';
import { VhvRegisterForm } from './components/auth/VhvRegisterForm';
import { LocationPermissionModal } from './components/auth/LocationPermissionModal';

// Patient Components
import { PatientDashboard } from './components/patient/PatientDashboard';
import { VitalSignsView } from './components/patient/VitalSignsView';
import { SymptomsView } from './components/patient/SymptomsView';
import { MedicationsView } from './components/patient/MedicationsView';
import { NhsoView } from './components/patient/NhsoView';
import { CalendarView } from './components/patient/CalendarView';
import { NearbyHospitalsView } from './components/patient/NearbyHospitalsView';

// Caregiver Components
import { CaregiverDashboard } from './components/caregiver/CaregiverDashboard';

// VHV Components
import { VhvDashboard } from './components/vhv/VhvDashboard';
import { VhvQueuePageView } from './components/vhv/VhvQueuePageView';
import { VhvElderlyPageView } from './components/vhv/VhvElderlyPageView';
import { VhvAnnouncementsPageView } from './components/vhv/VhvAnnouncementsPageView';
import { VhvGpsMapView } from './components/vhv/VhvGpsMapView';
import { VhvReportExportView } from './components/vhv/VhvReportExportView';

// Common Views
import { AnnouncementsView } from './components/common/AnnouncementsView';
import { ProfileView } from './components/common/ProfileView';
import { UserGuideModal } from './components/common/UserGuideModal';
import AutoRememberAdminSystem from './components/admin/AutoRememberAdminSystem';
import { AdminSuperControlBar } from './components/admin/AdminSuperControlBar';

import { Role } from './types';

function AppContent() {
  const {
    currentUser,
    hasChosenDevice,
    markDeviceChosen,
    activeTab,
    setActiveTab,
    locationPermission,
    setLocationPermission,
    registerNewAccount,
    patientHealthSubTab,
    setPatientHealthSubTab,
    isUserGuideOpen,
    setIsUserGuideOpen,
    userGuideInitialTab,
    isAdminMode,
  } = useApp();

  // Auth Flow States
  const [authStep, setAuthStep] = useState<'device' | 'welcome' | 'role_select' | 'login' | 'register_form' | 'admin'>('welcome');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [registeredUserData, setRegisteredUserData] = useState<{ firstName: string; lastName: string; phone: string }>({
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [isAdminManagerModalOpen, setIsAdminManagerModalOpen] = useState(false);

  const handleRegisterSubmit = (profileData: any) => {
    if (!selectedRole) return;
    registerNewAccount(
      {
        phone: profileData.phone || registeredUserData.phone,
        firstName: profileData.firstName || registeredUserData.firstName,
        lastName: profileData.lastName || registeredUserData.lastName,
        role: selectedRole,
      },
      profileData
    );
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
        {authStep === 'welcome' && (
          <WelcomeScreen
            onLoginClick={() => setAuthStep('login')}
            onRegisterClick={() => setAuthStep('role_select')}
            onAdminClick={() => setAuthStep('admin')}
          />
        )}

        {authStep === 'admin' && (
          <div className="w-full max-w-5xl">
            <AutoRememberAdminSystem onBack={() => setAuthStep('welcome')} />
          </div>
        )}

        {authStep === 'role_select' && (
          <RoleSelection
            selectedRole={selectedRole}
            onSelectRole={role => setSelectedRole(role)}
            onBack={() => setAuthStep('welcome')}
            onNext={() => setAuthStep('register_form')}
          />
        )}

        {authStep === 'login' && (
          <LoginRegisterForm
            onBack={() => setAuthStep('welcome')}
            onAdminClick={() => setAuthStep('admin')}
            onProceedToRoleSelection={(userData) => {
              if (userData) {
                setRegisteredUserData({
                  firstName: userData.firstName || '',
                  lastName: userData.lastName || '',
                  phone: userData.phone || '',
                });
                if (userData.role) {
                  setSelectedRole(userData.role);
                }
              }
              setAuthStep('role_select');
            }}
          />
        )}

        {authStep === 'register_form' && selectedRole === 'PATIENT' && (
          <PatientRegisterForm
            initialData={registeredUserData}
            onBack={() => setAuthStep('role_select')}
            onSubmit={handleRegisterSubmit}
          />
        )}

        {authStep === 'register_form' && selectedRole === 'CAREGIVER' && (
          <CaregiverRegisterForm
            initialData={registeredUserData}
            onBack={() => setAuthStep('role_select')}
            onSubmit={handleRegisterSubmit}
          />
        )}

        {authStep === 'register_form' && selectedRole === 'VHV' && (
          <VhvRegisterForm
            initialData={registeredUserData}
            onBack={() => setAuthStep('role_select')}
            onSubmit={handleRegisterSubmit}
          />
        )}
      </div>
    );
  }

  // Location permission prompt banner modal
  const showLocationModal = locationPermission === 'prompt';

  return (
    <>
      {showLocationModal && (
        <LocationPermissionModal
          onAllow={() => setLocationPermission('granted')}
          onAllowOnce={() => setLocationPermission('granted_once')}
          onDeny={() => setLocationPermission('denied')}
        />
      )}

      <Header />

      {/* Super Admin 3-Role Switching Control Bar */}
      <AdminSuperControlBar onOpenAdminManager={() => setIsAdminManagerModalOpen(true)} />

      <DeviceFrameWrapper>
        {/* PATIENT VIEWS */}
        {currentUser.role === 'PATIENT' && (
          <>
            {activeTab === 'dashboard' && <PatientDashboard />}

            {activeTab === 'health' && (
              <div className="space-y-6 max-w-5xl mx-auto">
                {/* Back to 6-Menu Dashboard Header */}
                <div className="flex items-center justify-between bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-xs">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-extrabold rounded-xl text-sm flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                  >
                    <span>⬅</span>
                    <span>กลับหน้าหลัก (6 เมนู)</span>
                  </button>

                  <span className="text-xs sm:text-sm font-extrabold text-slate-600 hidden sm:inline">
                    หมวดหมู่ข้อมูลสุขภาพผู้สูงอายุ
                  </span>
                </div>

                {/* Senior-Friendly Health Sub-tab Bar */}
                <div className="bg-white rounded-3xl p-3 shadow-xs border-2 border-slate-200 flex sm:grid sm:grid-cols-5 gap-2 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setPatientHealthSubTab('nhso')}
                    className={`py-3 px-4 sm:px-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shrink-0 sm:shrink ${
                      patientHealthSubTab === 'nhso'
                        ? 'bg-blue-700 text-white shadow-md'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span className="text-sm">🛡️</span>
                    <span className="whitespace-nowrap">1. สิทธิ สปสช.</span>
                  </button>

                  <button
                    onClick={() => setPatientHealthSubTab('vitals')}
                    className={`py-3 px-4 sm:px-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shrink-0 sm:shrink ${
                      patientHealthSubTab === 'vitals'
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span className="text-sm">💓</span>
                    <span className="whitespace-nowrap">2. สัญญาณชีพ</span>
                  </button>

                  <button
                    onClick={() => setPatientHealthSubTab('meds')}
                    className={`py-3 px-4 sm:px-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shrink-0 sm:shrink ${
                      patientHealthSubTab === 'meds'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span className="text-sm">💊</span>
                    <span className="whitespace-nowrap">3. ยาประจำตัว</span>
                  </button>

                  <button
                    onClick={() => setPatientHealthSubTab('symptoms')}
                    className={`py-3 px-4 sm:px-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shrink-0 sm:shrink ${
                      patientHealthSubTab === 'symptoms'
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span className="text-sm">🩺</span>
                    <span className="whitespace-nowrap">4. บันทึกอาการ</span>
                  </button>

                  <button
                    onClick={() => setPatientHealthSubTab('calendar')}
                    className={`py-3 px-4 sm:px-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shrink-0 sm:shrink ${
                      patientHealthSubTab === 'calendar'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span className="text-sm">📅</span>
                    <span className="whitespace-nowrap">5. ปฏิทินนัดหมาย</span>
                  </button>
                </div>

                {patientHealthSubTab === 'vitals' && <VitalSignsView />}
                {patientHealthSubTab === 'symptoms' && <SymptomsView />}
                {patientHealthSubTab === 'meds' && <MedicationsView />}
                {patientHealthSubTab === 'nhso' && <NhsoView />}
                {patientHealthSubTab === 'calendar' && <CalendarView />}
              </div>
            )}

            {activeTab === 'hospitals' && (
              <div className="space-y-6 max-w-5xl mx-auto">
                <div className="flex items-center justify-between bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-xs">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-extrabold rounded-xl text-sm flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                  >
                    <span>⬅</span>
                    <span>กลับหน้าหลัก (6 เมนู)</span>
                  </button>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-600">
                    6. สถานพยาบาลใกล้บ้าน
                  </span>
                </div>
                <NearbyHospitalsView />
              </div>
            )}

            {activeTab === 'announcements' && (
              <div className="space-y-6 max-w-5xl mx-auto">
                <div className="flex items-center justify-between bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-xs">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-extrabold rounded-xl text-sm flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                  >
                    <span>⬅</span>
                    <span>กลับหน้าหลัก (6 เมนู)</span>
                  </button>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-600">
                    ประกาศและข่าวสารชุมชน
                  </span>
                </div>
                <AnnouncementsView />
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6 max-w-5xl mx-auto">
                <div className="flex items-center justify-between bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-xs">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-extrabold rounded-xl text-sm flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                  >
                    <span>⬅</span>
                    <span>กลับหน้าหลัก (6 เมนู)</span>
                  </button>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-600">
                    ข้อมูลส่วนตัวและสุขภาพ
                  </span>
                </div>
                <ProfileView />
              </div>
            )}
          </>
        )}

        {/* CAREGIVER VIEWS */}
        {currentUser.role === 'CAREGIVER' && (
          <>
            {(activeTab === 'dashboard' || activeTab === 'patients') && <CaregiverDashboard />}
            {activeTab === 'announcements' && <AnnouncementsView />}
            {activeTab === 'hospitals' && <NearbyHospitalsView />}
            {activeTab === 'profile' && <ProfileView />}
          </>
        )}

        {/* VHV VIEWS */}
        {currentUser.role === 'VHV' && (
          <>
            {activeTab === 'dashboard' && <VhvDashboard />}
            {activeTab === 'queue' && <VhvQueuePageView />}
            {activeTab === 'elderly' && <VhvElderlyPageView />}
            {activeTab === 'gis_map' && <VhvGpsMapView />}
            {activeTab === 'reports' && <VhvReportExportView />}
            {activeTab === 'announcements' && <VhvAnnouncementsPageView />}
            {activeTab === 'hospitals' && <NearbyHospitalsView />}
            {activeTab === 'profile' && <ProfileView />}
          </>
        )}
      </DeviceFrameWrapper>

      {/* Global Role-Based User Guide Modal */}
      <UserGuideModal
        isOpen={isUserGuideOpen}
        onClose={() => setIsUserGuideOpen(false)}
        initialTab={userGuideInitialTab}
      />

      {/* Admin Management System Modal Overlay */}
      {isAdminManagerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-slate-100 rounded-3xl max-w-6xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 shadow-2xl relative border-2 border-slate-300">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500">ระบบบริหารจัดการแอดมิน (Super Diamond Control)</span>
              <button
                type="button"
                onClick={() => setIsAdminManagerModalOpen(false)}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs cursor-pointer transition"
              >
                ✕ ปิดหน้าต่าง
              </button>
            </div>
            <AutoRememberAdminSystem onBack={() => setIsAdminManagerModalOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
