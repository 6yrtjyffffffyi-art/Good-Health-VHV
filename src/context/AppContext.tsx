import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserAccount,
  PatientProfile,
  CaregiverProfile,
  VHVProfile,
  VitalSignRecord,
  SymptomRecord,
  MedicationItem,
  NhsoRecord,
  TodoItem,
  AppointmentRequest,
  Announcement,
  NotificationItem,
  SOSAlert,
  DeviceType,
  FontSize,
  LocationPermissionState,
  VhvPermissionState,
  Role,
  AppointmentStatus,
  HospitalInfo
} from '../types';
import {
  SEED_USERS,
  SEED_PATIENTS,
  SEED_CAREGIVERS,
  SEED_VHVS,
  SEED_VITAL_SIGNS,
  SEED_SYMPTOMS,
  SEED_MEDICATIONS,
  SEED_NHSO_RECORDS,
  SEED_TODOS,
  SEED_APPOINTMENTS,
  SEED_ANNOUNCEMENTS,
  SEED_NOTIFICATIONS,
  NEARBY_HOSPITALS
} from '../data/mockSeedData';

interface AppContextType {
  // Auth & Account State
  currentUser: UserAccount | null;
  currentPatientProfile: PatientProfile | null;
  currentCaregiverProfile: CaregiverProfile | null;
  currentVhvProfile: VHVProfile | null;
  allUsers: UserAccount[];
  allPatients: PatientProfile[];
  allCaregivers: CaregiverProfile[];
  allVhvs: VHVProfile[];

  // Settings & UX State
  deviceType: DeviceType;
  setDeviceType: (dev: DeviceType) => void;
  hasChosenDevice: boolean;
  markDeviceChosen: () => void;
  fontSize: FontSize;
  setFontSize: (fs: FontSize) => void;
  locationPermission: LocationPermissionState;
  setLocationPermission: (st: LocationPermissionState) => void;
  userCoords: { lat: number; lng: number } | null;

  // Active Selected Navigation Tab & SubTab
  activeTab: string;
  setActiveTab: (tab: string) => void;
  patientHealthSubTab: 'vitals' | 'symptoms' | 'meds' | 'nhso' | 'calendar';
  setPatientHealthSubTab: (subTab: 'vitals' | 'symptoms' | 'meds' | 'nhso' | 'calendar') => void;
  navigateToHealthSubTab: (subTab: 'vitals' | 'symptoms' | 'meds' | 'nhso' | 'calendar') => void;

  // Selected Patient (for Caregiver or VHV viewing a patient)
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;

  // VHV Access Permissions
  vhvPermissions: Record<string, VhvPermissionState>;
  getPatientVhvPermission: (patientId: string) => VhvPermissionState | undefined;
  setPatientVhvPermission: (patientId: string, perm: VhvPermissionState) => void;

  // Health Data Records
  vitalSigns: VitalSignRecord[];
  vitalSignsRecords: VitalSignRecord[];
  addVitalSign: (rec: Omit<VitalSignRecord, 'id'>) => void;
  addVitalSignsRecord: (rec: Omit<VitalSignRecord, 'id'>) => void;
  symptoms: SymptomRecord[];
  symptomRecords: SymptomRecord[];
  addSymptomRecord: (rec: Omit<SymptomRecord, 'id'>) => void;
  medications: MedicationItem[];
  addMedication: (med: any) => void;
  updateMedication: (med: MedicationItem) => void;
  editMedication: (id: string, updated: any) => void;
  deleteMedication: (id: string) => void;
  nhsoRecords: Record<string, NhsoRecord>;
  updateNhsoRecord: (rec: NhsoRecord) => void;
  todos: TodoItem[];
  toggleTodo: (id: string) => void;
  addTodo: (patientId: string, title: string, date: string) => void;

  // Appointments & Queue
  appointments: AppointmentRequest[];
  createAppointmentRequest: (req: Omit<AppointmentRequest, 'id' | 'status' | 'createdAt'>) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus, proposedTime?: string) => void;

  // Announcements & AI
  announcements: Announcement[];
  addAnnouncement: (ann: Omit<Announcement, 'id' | 'createdAt'>) => void;
  publishAnnouncement: (ann: any) => void;

  // SOS Emergency
  sosAlerts: SOSAlert[];
  triggerSOS: () => Promise<boolean>;
  resolveSOS: (id: string) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Nearby Hospitals
  hospitals: HospitalInfo[];

  // Auth Operations
  loginByPhone: (phone: string, role?: Role) => { success: boolean; existingAccount?: UserAccount; error?: string };
  registerNewAccount: (
    accountData: { phone: string; firstName: string; lastName: string; role: Role },
    roleProfileData: any
  ) => boolean;
  logout: () => void;

  // VHV Management
  addElderlyToVHV: (patientData: Omit<PatientProfile, 'id' | 'userId'>) => void;
  removeElderlyFromVHV: (patientId: string) => void;

  // Caregiver Management
  addPatientToCaregiver: (patientData: Omit<PatientProfile, 'id' | 'userId'>) => void;
  removePatientFromCaregiver: (caregiverId: string, patientId: string) => void;

  // Profile Management
  updateUserAccount: (updatedData: { firstName: string; lastName: string; phone: string }) => void;
  updatePatientProfile: (patientId: string, data: Partial<PatientProfile>) => void;
  updateVhvProfile: (vhvId: string, data: Partial<VHVProfile>) => void;
  updateCaregiverProfile: (caregiverId: string, data: Partial<CaregiverProfile>) => void;

  // Accessibility / Voice Reader Settings
  voiceReaderEnabled: boolean;
  setVoiceReaderEnabled: (enabled: boolean) => void;

  // User Guide Modal
  isUserGuideOpen: boolean;
  setIsUserGuideOpen: (open: boolean) => void;
  userGuideInitialTab: 'PATIENT' | 'CAREGIVER' | 'VHV' | 'PROFILE';
  openUserGuide: (initialTab?: 'PATIENT' | 'CAREGIVER' | 'VHV' | 'PROFILE') => void;

  // Helper Toast / Dialog Status
  toastMessage: string | null;
  showToast: (msg: string) => void;
  clearToast: () => void;

  // Super Admin Control & Role Switching
  isAdminMode: boolean;
  adminData: any;
  enterAppAsAdmin: (adminUser: any, targetRole?: Role) => void;
  switchAdminRole: (role: Role) => void;
  returnToAdminSystem: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper for safe localStorage parsing
function safeStorageGet<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    return JSON.parse(saved);
  } catch (err) {
    console.warn(`Error reading localStorage key "${key}", using fallback:`, err);
    return fallback;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence Helper Initializers
  const [allUsers, setAllUsers] = useState<UserAccount[]>(() => 
    safeStorageGet('app_users', SEED_USERS)
  );

  const [allPatients, setAllPatients] = useState<PatientProfile[]>(() => 
    safeStorageGet('app_patients', SEED_PATIENTS)
  );

  const [allCaregivers, setAllCaregivers] = useState<CaregiverProfile[]>(() => 
    safeStorageGet('app_caregivers', SEED_CAREGIVERS)
  );

  const [allVhvs, setAllVhvs] = useState<VHVProfile[]>(() => 
    safeStorageGet('app_vhvs', SEED_VHVS)
  );

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => 
    safeStorageGet('app_current_user', null)
  );

  const [hasChosenDevice, setHasChosenDevice] = useState<boolean>(true);

  const getAutoDeviceType = (): DeviceType => {
    if (typeof window === 'undefined') return 'phone';
    const width = window.innerWidth;
    if (width < 768) return 'phone';
    if (width < 1024) return 'tablet';
    return 'desktop';
  };

  const [deviceType, setDeviceTypeState] = useState<DeviceType>(() => {
    try {
      const saved = localStorage.getItem('app_device_type');
      if (saved && ['phone', 'tablet', 'desktop'].includes(saved)) {
        return saved as DeviceType;
      }
      return getAutoDeviceType();
    } catch {
      return 'phone';
    }
  });

  // Auto-detect device type on screen resize
  useEffect(() => {
    const handleResize = () => {
      const detected = getAutoDeviceType();
      setDeviceTypeState(detected);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const setDeviceType = (dev: DeviceType) => {
    setDeviceTypeState(dev);
    setHasChosenDevice(true);
    try {
      localStorage.setItem('app_device_type', dev);
      localStorage.setItem('app_device_chosen', 'true');
    } catch (err) {
      console.warn('Error saving device preference:', err);
    }
  };

  const markDeviceChosen = () => {
    setHasChosenDevice(true);
  };

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    try {
      const saved = localStorage.getItem('app_font_size');
      return (saved as FontSize) || 'normal';
    } catch {
      return 'normal';
    }
  });

  const setFontSize = (fs: FontSize) => {
    setFontSizeState(fs);
    try {
      localStorage.setItem('app_font_size', fs);
    } catch (err) {
      console.warn('Error saving font size preference:', err);
    }
  };

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-font-size', fontSize);
      if (fontSize === 'small') {
        document.documentElement.style.fontSize = '14px';
      } else if (fontSize === 'normal') {
        document.documentElement.style.fontSize = '16px';
      } else if (fontSize === 'large') {
        document.documentElement.style.fontSize = '18.5px';
      } else if (fontSize === 'extralarge') {
        document.documentElement.style.fontSize = '21.5px';
      }
    } catch (err) {
      console.warn('Could not set font size on root:', err);
    }
  }, [fontSize]);

  const [voiceReaderEnabled, setVoiceReaderEnabledState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('app_voice_reader_enabled');
      return saved !== null ? saved === 'true' : true; // Default enabled
    } catch {
      return true;
    }
  });

  const setVoiceReaderEnabled = (enabled: boolean) => {
    setVoiceReaderEnabledState(enabled);
    try {
      localStorage.setItem('app_voice_reader_enabled', String(enabled));
    } catch (err) {
      console.warn('Error saving voice reader preference:', err);
    }
  };

  // User Guide Modal State
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);
  const [userGuideInitialTab, setUserGuideInitialTab] = useState<'PATIENT' | 'CAREGIVER' | 'VHV' | 'PROFILE'>('PATIENT');

  const openUserGuide = (initialTab?: 'PATIENT' | 'CAREGIVER' | 'VHV' | 'PROFILE') => {
    if (initialTab) {
      setUserGuideInitialTab(initialTab);
    } else if (currentUser?.role) {
      setUserGuideInitialTab(currentUser.role as 'PATIENT' | 'CAREGIVER' | 'VHV');
    }
    setIsUserGuideOpen(true);
  };

  const [locationPermission, setLocationPermission] = useState<LocationPermissionState>(() => {
    try {
      const saved = localStorage.getItem('app_loc_perm');
      return (saved as LocationPermissionState) || 'prompt';
    } catch {
      return 'prompt';
    }
  });

  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(() => {
    return { lat: 18.7891, lng: 98.9567 }; // Default Chiang Mai Community Health location
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [patientHealthSubTab, setPatientHealthSubTab] = useState<'vitals' | 'symptoms' | 'meds' | 'nhso' | 'calendar'>('vitals');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const navigateToHealthSubTab = (subTab: 'vitals' | 'symptoms' | 'meds' | 'nhso' | 'calendar') => {
    setPatientHealthSubTab(subTab);
    setActiveTab('health');
  };

  // VHV Permissions State
  const [vhvPermissions, setVhvPermissions] = useState<Record<string, VhvPermissionState>>(() =>
    safeStorageGet('app_vhv_permissions', {
      'patient-1': 'granted',
      'patient-2': 'granted_once',
      'patient-3': 'denied',
    })
  );

  const getPatientVhvPermission = (patientId: string): VhvPermissionState | undefined => {
    return vhvPermissions[patientId];
  };

  const setPatientVhvPermission = (patientId: string, perm: VhvPermissionState) => {
    setVhvPermissions(prev => {
      const updated = { ...prev, [patientId]: perm };
      try {
        localStorage.setItem('app_vhv_permissions', JSON.stringify(updated));
      } catch (err) {
        console.warn('Error saving vhv permissions:', err);
      }
      return updated;
    });
  };

  // Health Data State
  const [vitalSigns, setVitalSigns] = useState<VitalSignRecord[]>(() => 
    safeStorageGet('app_vitals', SEED_VITAL_SIGNS)
  );

  const [symptoms, setSymptoms] = useState<SymptomRecord[]>(() => 
    safeStorageGet('app_symptoms', SEED_SYMPTOMS)
  );

  const [medications, setMedications] = useState<MedicationItem[]>(() => 
    safeStorageGet('app_medications', SEED_MEDICATIONS)
  );

  const [nhsoRecords, setNhsoRecords] = useState<Record<string, NhsoRecord>>(() => 
    safeStorageGet('app_nhso', SEED_NHSO_RECORDS)
  );

  const [todos, setTodos] = useState<TodoItem[]>(() => 
    safeStorageGet('app_todos', SEED_TODOS)
  );

  const [appointments, setAppointments] = useState<AppointmentRequest[]>(() => 
    safeStorageGet('app_appointments', SEED_APPOINTMENTS)
  );

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => 
    safeStorageGet('app_announcements', SEED_ANNOUNCEMENTS)
  );

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => 
    safeStorageGet('app_notifications', SEED_NOTIFICATIONS)
  );

  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>(() => 
    safeStorageGet('app_sos', [])
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('app_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('app_patients', JSON.stringify(allPatients));
  }, [allPatients]);

  useEffect(() => {
    localStorage.setItem('app_caregivers', JSON.stringify(allCaregivers));
  }, [allCaregivers]);

  useEffect(() => {
    localStorage.setItem('app_vhvs', JSON.stringify(allVhvs));
  }, [allVhvs]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('app_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('app_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('app_device_type', deviceType);
  }, [deviceType]);

  useEffect(() => {
    localStorage.setItem('app_font_size', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('app_loc_perm', locationPermission);
  }, [locationPermission]);

  useEffect(() => {
    localStorage.setItem('app_vitals', JSON.stringify(vitalSigns));
  }, [vitalSigns]);

  useEffect(() => {
    localStorage.setItem('app_symptoms', JSON.stringify(symptoms));
  }, [symptoms]);

  useEffect(() => {
    localStorage.setItem('app_medications', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem('app_nhso', JSON.stringify(nhsoRecords));
  }, [nhsoRecords]);

  useEffect(() => {
    localStorage.setItem('app_todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('app_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('app_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('app_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('app_sos', JSON.stringify(sosAlerts));
  }, [sosAlerts]);

  // Handle Geolocation if granted
  useEffect(() => {
    if ((locationPermission === 'granted' || locationPermission === 'granted_once') && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          // Fallback to default Chiang Mai coordinates
          setUserCoords({ lat: 18.7891, lng: 98.9567 });
        }
      );
    }
  }, [locationPermission]);

  // Admin Mode State (Super Admin & Admins)
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('app_is_admin_mode') === 'true';
    } catch {
      return false;
    }
  });

  const [adminData, setAdminData] = useState<any>(() => 
    safeStorageGet('remembered_admin_user', null)
  );

  // Profiles derived for current logged in user
  const currentPatientProfile = currentUser?.role === 'PATIENT'
    ? allPatients.find(p => p.userId === currentUser.id) || (currentUser.isAdmin ? allPatients[0] || null : null)
    : null;

  const currentCaregiverProfile = currentUser?.role === 'CAREGIVER'
    ? allCaregivers.find(c => c.userId === currentUser.id) || (currentUser.isAdmin ? {
        id: 'super-caregiver-001',
        userId: currentUser.id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        phone: currentUser.phone,
        address: 'ศูนย์ประสานงานสุขภาพชุมชน',
        managedPatients: allPatients,
      } : null)
    : null;

  const currentVhvProfile = currentUser?.role === 'VHV'
    ? allVhvs.find(v => v.userId === currentUser.id) || (currentUser.isAdmin ? {
        id: 'super-vhv-001',
        userId: currentUser.id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        phone: currentUser.phone,
        province: 'เชียงใหม่',
        district: 'เมืองเชียงใหม่',
        subdistrict: 'สุเทพ',
        houseNo: '1',
        organization: 'รพ.สต.สุเทพ (ศูนย์ควบคุมระดับสูงสุด)',
        vhvCode: 'SUPER-ADMIN-01',
        assignedElderlyIds: allPatients.map(p => p.id),
      } : null)
    : null;

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const clearToast = () => setToastMessage(null);

  // Super Admin: Enter Main App as specific role with full administrative authority
  const enterAppAsAdmin = (adminUser: any, targetRole: Role = 'VHV') => {
    const adminAccount: UserAccount = {
      id: 'super-admin-001',
      phone: adminUser?.phone || '080-000-0000',
      firstName: adminUser?.name || 'Super Diamond',
      lastName: 'Admin',
      role: targetRole,
      createdAt: new Date().toISOString(),
      isAdmin: true,
      adminRole: adminUser?.role || 'Diamond',
    };

    setIsAdminMode(true);
    setAdminData(adminUser);
    setCurrentUser(adminAccount);
    setActiveTab('dashboard');

    try {
      localStorage.setItem('app_is_admin_mode', 'true');
      localStorage.setItem('remembered_admin_user', JSON.stringify(adminUser));
    } catch (e) {
      console.warn('Error saving admin mode state:', e);
    }

    showToast(`เข้าสู่แอปหลักในโหมด Super Admin (${targetRole === 'VHV' ? 'อสม. ควบคุมเต็มระบบ' : targetRole === 'PATIENT' ? 'ผู้สูงอายุ' : 'ผู้ดูแล'}) เรียบร้อยแล้ว`);
  };

  // Super Admin: Switch between 3 roles anytime
  const switchAdminRole = (newRole: Role) => {
    if (!currentUser) return;
    const updated: UserAccount = {
      ...currentUser,
      role: newRole,
      isAdmin: true,
      adminRole: adminData?.role || currentUser.adminRole || 'Diamond'
    };
    setCurrentUser(updated);
    setActiveTab('dashboard');
    showToast(`สลับสู่มุมมอง ${newRole === 'VHV' ? 'อสม. (จัดการทุกข้อมูล)' : newRole === 'PATIENT' ? 'ผู้สูงอายุ/ผู้ป่วย' : 'ผู้ดูแล/ญาติ'} เรียบร้อยแล้ว`);
  };

  // Return to Admin Management Dashboard
  const returnToAdminSystem = () => {
    setIsAdminMode(false);
    setCurrentUser(null);
    try {
      localStorage.removeItem('app_is_admin_mode');
    } catch {}
  };

  // Login handler with 1 Account = 1 Role check and role switching
  const loginByPhone = (phone: string, role?: Role): { success: boolean; existingAccount?: UserAccount; error?: string } => {
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check for exact matching account
    let existing = allUsers.find(u => u.phone === cleanPhone && (!role || u.role === role));

    // If not found with exact role, check if user exists under this phone in any role
    if (!existing) {
      existing = allUsers.find(u => u.phone === cleanPhone);
    }

    if (existing) {
      let targetUser = existing;

      // If user chose a specific role and it differs from existing account role, update role to user's choice
      if (role && existing.role !== role) {
        targetUser = { ...existing, role };
        setAllUsers(prev => prev.map(u => u.id === existing!.id ? targetUser : u));

        // Also ensure profile exists for the role
        if (role === 'PATIENT' && !allPatients.some(p => p.userId === existing!.id)) {
          const newPatient: PatientProfile = {
            id: `patient-${Date.now()}`,
            userId: existing.id,
            firstName: existing.firstName,
            lastName: existing.lastName,
            phone: cleanPhone,
            birthDate: '1956-05-15',
            age: 70,
            address: {
              province: 'เชียงใหม่',
              district: 'เมืองเชียงใหม่',
              subdistrict: 'สุเทพ',
              houseNo: '123',
            },
            diseases: ['ความดันโลหิตสูง'],
            status: 'ช่วยเหลือตัวเองได้',
            caregiverContacts: [],
          };
          setAllPatients(prev => [...prev, newPatient]);
        } else if (role === 'CAREGIVER' && !allCaregivers.some(c => c.userId === existing!.id)) {
          const newCaregiver: CaregiverProfile = {
            id: `caregiver-${Date.now()}`,
            userId: existing.id,
            firstName: existing.firstName,
            lastName: existing.lastName,
            phone: cleanPhone,
            address: 'เชียงใหม่',
            managedPatients: [],
          };
          setAllCaregivers(prev => [...prev, newCaregiver]);
        } else if (role === 'VHV' && !allVhvs.some(v => v.userId === existing!.id)) {
          const newVhv: VHVProfile = {
            id: `vhv-${Date.now()}`,
            userId: existing.id,
            firstName: existing.firstName,
            lastName: existing.lastName,
            phone: cleanPhone,
            province: 'เชียงใหม่',
            district: 'เมืองเชียงใหม่',
            subdistrict: 'สุเทพ',
            houseNo: '1',
            organization: 'รพ.สต.สุเทพ',
            vhvCode: `VHV-${Math.floor(1000 + Math.random() * 9000)}`,
            assignedElderlyIds: ['patient-1'],
          };
          setAllVhvs(prev => [...prev, newVhv]);
        }
      }

      setCurrentUser(targetUser);
      showToast(`เข้าสู่ระบบสำเร็จ ยินดีต้อนรับคุณ${targetUser.firstName} (${getRoleNameTh(targetUser.role)})`);

      try {
        const hideGuide = localStorage.getItem('app_hide_guide');
        if (hideGuide !== 'true') {
          openUserGuide(targetUser.role);
        }
      } catch (err) {
        console.warn('Error reading guide preference:', err);
      }

      return { success: true, existingAccount: targetUser };
    }

    // No account exists for this phone
    return { success: false, error: 'คุณยังไม่เคยมีบัญชี' };
  };

  const getRoleNameTh = (role: Role) => {
    if (role === 'PATIENT') return 'ผู้ป่วย/ผู้สูงอายุ';
    if (role === 'CAREGIVER') return 'ผู้ดูแล/ญาติ';
    return 'อสม.';
  };

  // Register New Account
  const registerNewAccount = (
    accountData: { phone: string; firstName: string; lastName: string; role: Role },
    roleProfileData: any
  ) => {
    const cleanPhone = accountData.phone.replace(/\D/g, '');
    const existing = allUsers.find(u => u.phone === cleanPhone);

    let userId = existing ? existing.id : `user-${Date.now()}`;
    const targetUser: UserAccount = {
      id: userId,
      phone: cleanPhone,
      firstName: accountData.firstName || (existing ? existing.firstName : 'ผู้ใช้งาน'),
      lastName: accountData.lastName || (existing ? existing.lastName : ''),
      role: accountData.role,
      createdAt: existing ? existing.createdAt : new Date().toISOString(),
    };

    if (existing) {
      setAllUsers(prev => prev.map(u => u.id === existing.id ? targetUser : u));
    } else {
      setAllUsers(prev => [...prev, targetUser]);
    }

    if (accountData.role === 'PATIENT') {
      const existingPatient = allPatients.find(p => p.userId === userId || p.phone === cleanPhone);
      const patientId = existingPatient ? existingPatient.id : `patient-${Date.now()}`;
      const newPatient: PatientProfile = {
        id: patientId,
        userId: userId,
        firstName: accountData.firstName,
        lastName: accountData.lastName,
        phone: cleanPhone,
        birthDate: roleProfileData.birthDate || '1960-01-01',
        age: roleProfileData.age || 66,
        address: roleProfileData.address || {
          province: roleProfileData.province || 'เชียงใหม่',
          district: roleProfileData.district || 'เมืองเชียงใหม่',
          subdistrict: roleProfileData.subdistrict || 'สุเทพ',
          houseNo: roleProfileData.houseNo || '123',
          alley: roleProfileData.alley || '',
          moo: roleProfileData.moo || '',
        },
        diseases: roleProfileData.diseases || [],
        otherDisease: roleProfileData.otherDisease || '',
        allergies: roleProfileData.allergies || '',
        currentMedicationsText: roleProfileData.currentMedicationsText || '',
        notes: roleProfileData.notes || '',
        status: roleProfileData.status || 'อยู่บ้าน',
        caregiverContacts: roleProfileData.caregiverContacts || [],
      };

      if (existingPatient) {
        setAllPatients(prev => prev.map(p => p.id === existingPatient.id ? newPatient : p));
      } else {
        setAllPatients(prev => [...prev, newPatient]);
        // Assign to default VHV
        setAllVhvs(prev => prev.map(v => ({
          ...v,
          assignedElderlyIds: [...v.assignedElderlyIds, patientId],
        })));
      }
    } else if (accountData.role === 'CAREGIVER') {
      const existingCg = allCaregivers.find(c => c.userId === userId || c.phone === cleanPhone);
      const caregiverId = existingCg ? existingCg.id : `caregiver-${Date.now()}`;
      const newCaregiver: CaregiverProfile = {
        id: caregiverId,
        userId: userId,
        firstName: accountData.firstName,
        lastName: accountData.lastName,
        phone: cleanPhone,
        address: roleProfileData.address || 'เชียงใหม่',
        managedPatients: roleProfileData.managedPatients || [],
      };

      if (existingCg) {
        setAllCaregivers(prev => prev.map(c => c.id === existingCg.id ? newCaregiver : c));
      } else {
        setAllCaregivers(prev => [...prev, newCaregiver]);
      }
    } else if (accountData.role === 'VHV') {
      const existingVhv = allVhvs.find(v => v.userId === userId || v.phone === cleanPhone);
      const vhvId = existingVhv ? existingVhv.id : `vhv-${Date.now()}`;
      const newVhv: VHVProfile = {
        id: vhvId,
        userId: userId,
        firstName: accountData.firstName,
        lastName: accountData.lastName,
        phone: cleanPhone,
        province: roleProfileData.province || 'เชียงใหม่',
        district: roleProfileData.district || 'เมืองเชียงใหม่',
        subdistrict: roleProfileData.subdistrict || 'สุเทพ',
        houseNo: roleProfileData.houseNo || '1',
        organization: roleProfileData.organization || 'รพ.สต.สุเทพ',
        vhvCode: roleProfileData.vhvCode || `VHV-${Math.floor(1000 + Math.random() * 9000)}`,
        idCardPhotoUrl: roleProfileData.idCardPhotoUrl || '',
        assignedElderlyIds: roleProfileData.assignedElderlyIds || ['patient-1'],
      };

      if (existingVhv) {
        setAllVhvs(prev => prev.map(v => v.id === existingVhv.id ? newVhv : v));
      } else {
        setAllVhvs(prev => [...prev, newVhv]);
      }
    }

    setCurrentUser(targetUser);
    showToast(`ลงทะเบียนสำเร็จ เข้าสู่บทบาท ${getRoleNameTh(accountData.role)}`);

    // Show User Guide for new user's role
    try {
      const hideGuide = localStorage.getItem('app_hide_guide');
      if (hideGuide !== 'true') {
        openUserGuide(accountData.role);
      }
    } catch (err) {
      console.warn('Error reading guide preference:', err);
    }

    return true;
  };

  // Logout - Must NOT delete user, profile, health data, appointments, medications
  const logout = () => {
    setCurrentUser(null);
    setSelectedPatientId(null);
    setActiveTab('dashboard');
    showToast('ออกจากระบบเรียบร้อยแล้ว');
  };

  // Health Record Handlers
  const addVitalSign = (rec: Omit<VitalSignRecord, 'id'>) => {
    const newRecord: VitalSignRecord = {
      ...rec,
      id: `vital-${Date.now()}`,
    };
    setVitalSigns(prev => [newRecord, ...prev]);
    showToast('บันทึกสัญญาณชีพเรียบร้อยแล้ว');
  };

  const addSymptomRecord = (rec: Omit<SymptomRecord, 'id'>) => {
    const newRecord: SymptomRecord = {
      ...rec,
      id: `sym-${Date.now()}`,
    };
    setSymptoms(prev => [newRecord, ...prev]);
    showToast('บันทึกอาการเรียบร้อยแล้ว');
  };

  const addMedication = (med: Omit<MedicationItem, 'id' | 'createdAt'>) => {
    const newMed: MedicationItem = {
      ...med,
      id: `med-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setMedications(prev => [newMed, ...prev]);
    showToast('เพิ่มรายการยาประจำเรียบร้อยแล้ว');
  };

  const updateMedication = (med: MedicationItem) => {
    setMedications(prev => prev.map(m => m.id === med.id ? med : m));
    showToast('แก้ไขข้อมูลยาเรียบร้อยแล้ว');
  };

  const editMedication = (id: string, updated: any) => {
    setMedications(prev => prev.map(m => m.id === id ? { ...m, ...updated } : m));
    showToast('แก้ไขข้อมูลยาเรียบร้อยแล้ว');
  };

  const deleteMedication = (id: string) => {
    setMedications(prev => prev.filter(m => m.id !== id));
    showToast('ลบรายการยาเรียบร้อยแล้ว');
  };

  const updateNhsoRecord = (rec: NhsoRecord) => {
    setNhsoRecords(prev => ({
      ...prev,
      [rec.patientId]: rec,
    }));
    showToast('บันทึกข้อมูลสิทธิรักษาเรียบร้อยแล้ว');
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTodo = (patientId: string, title: string, date: string) => {
    const newTodo: TodoItem = {
      id: `todo-${Date.now()}`,
      patientId,
      title,
      completed: false,
      date,
    };
    setTodos(prev => [...prev, newTodo]);
    showToast('เพิ่มรายการกิจกรรมในปฏิทินสำเร็จ');
  };

  // Appointment Requests
  const createAppointmentRequest = (req: Omit<AppointmentRequest, 'id' | 'status' | 'createdAt'>) => {
    const newApp: AppointmentRequest = {
      ...req,
      id: `app-${Date.now()}`,
      status: 'รอตรวจสอบ',
      createdAt: new Date().toISOString(),
    };

    setAppointments(prev => [newApp, ...prev]);

    // Send Notification to VHV
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: 'user-vhv-1',
      title: 'คำขอนัดหมายใหม่',
      message: `${req.patientName} ส่งคำขอนัดหมายวันที่ ${req.date} เวลา ${req.time} น.`,
      type: 'APPOINTMENT',
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast('ส่งคำขอนัดหมายถึง อสม. เรียบร้อยแล้ว (สถานะ: รอตรวจสอบ)');
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus, proposedTime?: string) => {
    setAppointments(prev => prev.map(app => {
      if (app.id === id) {
        return {
          ...app,
          status,
          proposedTime: proposedTime || app.proposedTime,
        };
      }
      return app;
    }));

    const targetApp = appointments.find(a => a.id === id);
    if (targetApp) {
      const targetPatient = allPatients.find(p => p.id === targetApp.patientId);
      if (targetPatient) {
        const notif: NotificationItem = {
          id: `notif-${Date.now()}`,
          userId: targetPatient.userId,
          title: `อสม. ตอบรับนัดหมาย: ${status}`,
          message: status === 'เสนอเวลาใหม่'
            ? `อสม. เสนอเวลานัดใหม่เป็น: ${proposedTime}`
            : `คำขอนัดหมายวันที่ ${targetApp.date} ได้รับการ${status}`,
          type: 'APPOINTMENT',
          read: false,
          createdAt: new Date().toISOString(),
        };
        setNotifications(prev => [notif, ...prev]);
      }
    }

    showToast(`อัปเดตสถานะนัดหมายเป็น: ${status}`);
  };

  // Announcements
  const addAnnouncement = (ann: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newAnn: Announcement = {
      ...ann,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setAnnouncements(prev => [newAnn, ...prev]);

    // Notify Patients & Caregivers
    allUsers.filter(u => u.role !== 'VHV').forEach(u => {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}-${u.id}`,
        userId: u.id,
        title: `ประกาศใหม่จาก อสม.: ${ann.title}`,
        message: ann.content.length > 80 ? ann.content.substring(0, 80) + '...' : ann.content,
        type: 'ANNOUNCEMENT',
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications(prev => [notif, ...prev]);
    });

    showToast('เผยแพร่ประกาศข่าวสารสุขภาพชุมชนเรียบร้อยแล้ว');
  };

  // SOS Emergency Trigger
  const triggerSOS = async () => {
    let pName = currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : 'ผู้ป่วย';
    let pPhone = currentUser?.phone || '0812345678';
    let pId = currentPatientProfile?.id || 'patient-1';

    const newSos: SOSAlert = {
      id: `sos-${Date.now()}`,
      patientId: pId,
      patientName: pName,
      patientPhone: pPhone,
      lat: userCoords?.lat || 18.7891,
      lng: userCoords?.lng || 98.9567,
      locationName: 'ต.สุเทพ อ.เมือง จ.เชียงใหม่ (พิกัดฉุกเฉิน)',
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      status: 'ACTIVE',
    };

    setSosAlerts(prev => [newSos, ...prev]);

    // Broadcast to VHV and Caregivers
    allUsers.filter(u => u.role === 'VHV' || u.role === 'CAREGIVER').forEach(u => {
      const notif: NotificationItem = {
        id: `notif-sos-${Date.now()}-${u.id}`,
        userId: u.id,
        title: '🚨 แจ้งเหตุฉุกเฉิน SOS!',
        message: `รับสัญญาณ SOS ขอความช่วยเหลือจาก คุณ${pName} เบอร์โทร ${pPhone}`,
        type: 'SOS',
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications(prev => [notif, ...prev]);
    });

    showToast('ส่งสัญญาณขอความช่วยเหลือ SOS เรียบร้อยแล้ว');
    return true;
  };

  const resolveSOS = (id: string) => {
    setSosAlerts(prev => prev.map(s => s.id === id ? { ...s, status: 'RESOLVED' } : s));
    showToast('เคลียร์สถานะเหตุฉุกเฉินเรียบร้อยแล้ว');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    if (currentUser) {
      setNotifications(prev => prev.filter(n => n.userId !== currentUser.id));
    }
  };

  // VHV Management: Add elderly to care list
  const addElderlyToVHV = (patientData: Omit<PatientProfile, 'id' | 'userId'>) => {
    const patientId = `patient-${Date.now()}`;
    const newPatient: PatientProfile = {
      ...patientData,
      id: patientId,
      userId: `user-unbound-${Date.now()}`,
    };

    setAllPatients(prev => [...prev, newPatient]);

    if (currentVhvProfile) {
      setAllVhvs(prev => prev.map(v => v.id === currentVhvProfile.id ? {
        ...v,
        assignedElderlyIds: [...v.assignedElderlyIds, patientId],
      } : v));
    }

    showToast(`เพิ่มผู้สูงอายุคุณ${patientData.firstName} เข้าสู่การดูแลของ อสม. เรียบร้อยแล้ว`);
  };

  // Remove elderly from VHV care list (Prompt: Must NOT delete patient account)
  const removeElderlyFromVHV = (patientId: string) => {
    if (currentVhvProfile) {
      setAllVhvs(prev => prev.map(v => v.id === currentVhvProfile.id ? {
        ...v,
        assignedElderlyIds: v.assignedElderlyIds.filter(id => id !== patientId),
      } : v));
      showToast('ลบผู้สูงอายุออกจากความดูแลของ อสม. เรียบร้อยแล้ว (บัญชีผู้ป่วยยังคงอยู่)');
    }
  };

  // Caregiver Management: Add patient up to 5
  const addPatientToCaregiver = (patientData: Omit<PatientProfile, 'id' | 'userId'>) => {
    const patientId = `patient-${Date.now()}`;
    const newPatient: PatientProfile = {
      ...patientData,
      id: patientId,
      userId: `user-unbound-${Date.now()}`,
    };

    setAllPatients(prev => [...prev, newPatient]);

    if (currentCaregiverProfile) {
      if (currentCaregiverProfile.managedPatients.length >= 5) {
        showToast('ไม่สามารถเพิ่มผู้ป่วยได้เกิน 5 คน');
        return;
      }

      setAllCaregivers(prev => prev.map(c => c.id === currentCaregiverProfile.id ? {
        ...c,
        managedPatients: [...c.managedPatients, newPatient],
      } : c));
    }

    showToast(`เพิ่มผู้ป่วยคุณ${patientData.firstName} เข้าสู่การดูแลของญาติเรียบร้อยแล้ว`);
  };

  const removePatientFromCaregiver = (caregiverId: string, patientId: string) => {
    setAllCaregivers(prev => prev.map(c => c.id === caregiverId ? {
      ...c,
      managedPatients: c.managedPatients.filter(p => p.id !== patientId),
    } : c));
    showToast('นำผู้ป่วยออกจากรายการดูแลเรียบร้อยแล้ว');
  };

  // Profile Management Handlers
  const updateUserAccount = (updatedData: { firstName: string; lastName: string; phone: string }) => {
    if (!currentUser) return;
    const newCurrentUser: UserAccount = { ...currentUser, ...updatedData };
    setCurrentUser(newCurrentUser);
    setAllUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...updatedData } : u));

    if (currentUser.role === 'PATIENT') {
      setAllPatients(prev => prev.map(p => p.userId === currentUser.id ? { ...p, firstName: updatedData.firstName, lastName: updatedData.lastName, phone: updatedData.phone } : p));
      setAllCaregivers(prev => prev.map(c => ({
        ...c,
        managedPatients: c.managedPatients.map(p => p.userId === currentUser.id ? { ...p, firstName: updatedData.firstName, lastName: updatedData.lastName, phone: updatedData.phone } : p)
      })));
    } else if (currentUser.role === 'VHV') {
      setAllVhvs(prev => prev.map(v => v.userId === currentUser.id ? { ...v, firstName: updatedData.firstName, lastName: updatedData.lastName, phone: updatedData.phone } : v));
    } else if (currentUser.role === 'CAREGIVER') {
      setAllCaregivers(prev => prev.map(c => c.userId === currentUser.id ? { ...c, firstName: updatedData.firstName, lastName: updatedData.lastName, phone: updatedData.phone } : c));
    }
  };

  const updatePatientProfile = (patientId: string, data: Partial<PatientProfile>) => {
    setAllPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return { ...p, ...data };
      }
      return p;
    }));

    // Synchronize inside caregivers' managedPatients
    setAllCaregivers(prev => prev.map(c => ({
      ...c,
      managedPatients: c.managedPatients.map(p => p.id === patientId ? { ...p, ...data } : p)
    })));

    // If this patient is the logged-in patient, sync currentUser account name & phone if modified
    if (currentUser && currentUser.role === 'PATIENT' && currentPatientProfile?.id === patientId) {
      const updatedUser: UserAccount = {
        ...currentUser,
        firstName: data.firstName || currentUser.firstName,
        lastName: data.lastName || currentUser.lastName,
        phone: data.phone || currentUser.phone,
      };
      setCurrentUser(updatedUser);
      setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    }
  };

  const updateVhvProfile = (vhvId: string, data: Partial<VHVProfile>) => {
    setAllVhvs(prev => prev.map(v => v.id === vhvId ? { ...v, ...data } : v));
    if (currentUser && currentUser.role === 'VHV' && currentVhvProfile?.id === vhvId) {
      const updatedUser: UserAccount = {
        ...currentUser,
        firstName: data.firstName || currentUser.firstName,
        lastName: data.lastName || currentUser.lastName,
        phone: data.phone || currentUser.phone,
      };
      setCurrentUser(updatedUser);
      setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    }
  };

  const updateCaregiverProfile = (caregiverId: string, data: Partial<CaregiverProfile>) => {
    setAllCaregivers(prev => prev.map(c => c.id === caregiverId ? { ...c, ...data } : c));
    if (currentUser && currentUser.role === 'CAREGIVER' && currentCaregiverProfile?.id === caregiverId) {
      const updatedUser: UserAccount = {
        ...currentUser,
        firstName: data.firstName || currentUser.firstName,
        lastName: data.lastName || currentUser.lastName,
        phone: data.phone || currentUser.phone,
      };
      setCurrentUser(updatedUser);
      setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentPatientProfile,
        currentCaregiverProfile,
        currentVhvProfile,
        allUsers,
        allPatients,
        allCaregivers,
        allVhvs,
        updateUserAccount,
        updatePatientProfile,
        updateVhvProfile,
        updateCaregiverProfile,
        deviceType,
        setDeviceType,
        hasChosenDevice,
        markDeviceChosen,
        fontSize,
        setFontSize,
        locationPermission,
        setLocationPermission,
        userCoords,
        activeTab,
        setActiveTab,
        patientHealthSubTab,
        setPatientHealthSubTab,
        navigateToHealthSubTab,
        selectedPatientId,
        setSelectedPatientId,
        vhvPermissions,
        getPatientVhvPermission,
        setPatientVhvPermission,
        vitalSigns,
        vitalSignsRecords: vitalSigns,
        addVitalSign,
        addVitalSignsRecord: addVitalSign,
        symptoms,
        symptomRecords: symptoms,
        addSymptomRecord,
        medications,
        addMedication,
        updateMedication,
        editMedication,
        deleteMedication,
        nhsoRecords,
        updateNhsoRecord,
        todos,
        toggleTodo,
        addTodo,
        appointments,
        createAppointmentRequest,
        updateAppointmentStatus,
        announcements,
        addAnnouncement,
        publishAnnouncement: addAnnouncement,
        sosAlerts,
        triggerSOS,
        resolveSOS,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        hospitals: NEARBY_HOSPITALS,
        loginByPhone,
        registerNewAccount,
        logout,
        addElderlyToVHV,
        removeElderlyFromVHV,
        addPatientToCaregiver,
        removePatientFromCaregiver,
        voiceReaderEnabled,
        setVoiceReaderEnabled,
        isUserGuideOpen,
        setIsUserGuideOpen,
        userGuideInitialTab,
        openUserGuide,
        toastMessage,
        showToast,
        clearToast,
        isAdminMode,
        adminData,
        enterAppAsAdmin,
        switchAdminRole,
        returnToAdminSystem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
