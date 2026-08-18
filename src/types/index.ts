export type Role = 'PATIENT' | 'CAREGIVER' | 'VHV';

export type DeviceType = 'phone' | 'tablet' | 'desktop';

export type FontSize = 'small' | 'normal' | 'large' | 'extralarge';

export type LocationPermissionState = 'prompt' | 'granted' | 'granted_once' | 'denied';

export type VhvPermissionState = 'granted' | 'granted_once' | 'denied';

export interface UserAccount {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: string;
  isAdmin?: boolean;
  adminRole?: string;
}

export interface CaregiverContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface PatientProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: string;
  age: number;
  address: {
    province: string;
    district: string;
    subdistrict: string;
    houseNo: string;
    alley?: string;
    moo?: string;
  };
  diseases: string[];
  otherDisease?: string;
  allergies?: string;
  currentMedicationsText?: string;
  notes?: string;
  status: 'ติดสังคม' | 'ติดบ้าน' | 'ติดเตียง' | 'ช่วยเหลือตัวเองได้' | 'มีผู้ดูแล' | 'อยู่บ้าน' | 'อยู่โรงพยาบาล' | 'ต้องติดตามเป็นพิเศษ' | 'อื่นๆ';
  otherStatusText?: string;
  caregiverContacts: CaregiverContact[];
  vhvPermission?: VhvPermissionState;
  locationPermission?: LocationPermissionState;
}

export interface CaregiverProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  address?: string;
  houseNo?: string;
  alley?: string;
  moo?: string;
  subdistrict?: string;
  district?: string;
  province?: string;
  managedPatients: PatientProfile[];
}

export interface VhvCenter {
  id: string;
  name: string;
  subdistrict: string;
  district: string;
  province: string;
  postalCode?: string;
  lat?: number;
  lng?: number;
  phone?: string;
}

export interface VHVProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  province: string;
  district: string;
  subdistrict: string;
  houseNo: string;
  alley?: string;
  moo?: string;
  organization: string;
  vhvCode: string;
  centerProvince?: string;
  centerDistrict?: string;
  centerSubdistrict?: string;
  idCardPhotoUrl?: string;
  assignedElderlyIds: string[];
}

export interface VitalSignRecord {
  id: string;
  patientId: string;
  systolic: number; // ความดันตัวบน (บังคับ)
  diastolic: number; // ความดันตัวล่าง (บังคับ)
  pulse?: number; // ชีพจร
  oxygen?: number; // ออกซิเจน SpO2
  temperature?: number; // อุณหภูมิ
  recordedAt: string; // ISO String หรือ YYYY-MM-DD THH:mm
}

export interface SymptomRecord {
  id: string;
  patientId: string;
  symptoms: string[];
  otherSymptom?: string;
  duration: '30 นาที' | '1 ชั่วโมง' | '2 ชั่วโมง' | 'อื่นๆ';
  otherDurationText?: string;
  timePeriod: 'เช้า 06:00–11:59' | 'เที่ยง 12:00–12:59' | 'บ่าย 13:00–15:59' | 'เย็น 16:00–18:59' | 'ค่ำ 19:00–23:59' | 'ดึก 00:00–05:59';
  recordedAt: string;
  notes?: string;
}

export interface MedicationItem {
  id: string;
  patientId: string;
  drugNameTH: string;
  drugNameEN?: string;
  dosage: string; // e.g., '250 mg', '500 mg', '5 mg', etc.
  timings: string[]; // e.g., ['เช้า', 'เย็น', 'หลังอาหาร']
  instructions?: string;
  createdAt: string;
  tradeName?: string;
  genericName?: string;
  category?: string; // กลุ่มยา เช่น ยาลดความดัน, ยาเบาหวาน, ยาแก้ปวด
  indication?: string; // สรรพคุณ
  caution?: string; // ข้อควรระวัง / ผลข้างเคียง
  frequency?: string;
  mealTimings?: string[];
  notes?: string;
}

export interface NhsoRecord {
  patientId: string;
  entitlementType: 'บัตรทอง' | 'ประกันสังคม' | 'ข้าราชการ' | 'อื่นๆ';
  serviceUnit: string;
  recordedAt: string;
}

export interface TodoItem {
  id: string;
  patientId: string;
  title: string;
  completed: boolean;
  date: string;
}

export type AppointmentStatus = 'รอตรวจสอบ' | 'อนุมัติแล้ว' | 'ปฏิเสธ' | 'เสนอเวลาใหม่';

export interface AppointmentRequest {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  vhvId: string;
  date: string;
  time: string;
  symptoms: string;
  cause: string;
  notes?: string;
  status: AppointmentStatus;
  proposedTime?: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  time: string;
  timePeriod: string;
  authorName: string;
  authorRole?: string;
  targetGroup?: string;
  category?: string;
  isPinned?: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'APPOINTMENT' | 'ANNOUNCEMENT' | 'SOS' | 'SYSTEM';
  read: boolean;
  createdAt: string;
}

export interface SOSAlert {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  lat: number;
  lng: number;
  locationName: string;
  time: string;
  status: 'ACTIVE' | 'RESOLVED';
}

export interface HospitalInfo {
  id: string;
  name: string;
  type: string;
  distanceKm: number;
  phone: string;
  address: string;
  lat: number;
  lng: number;
  mapUrl: string;
}

// Fixed constant datasets required by prompt
export const CHRONIC_DISEASES = [
  'ความดันโลหิตสูง',
  'เบาหวาน',
  'ไขมันในเลือดสูง',
  'โรคหัวใจ',
  'โรคไตเรื้อรัง',
  'โรคข้อเสื่อม',
  'โรคกระดูกพรุน',
  'โรคหลอดเลือดสมอง',
  'โรคปอดเรื้อรัง',
  'โรคเกาต์',
] as const;

export const PATIENT_STATUSES = [
  'อยู่บ้าน',
  'อยู่โรงพยาบาล',
  'ติดเตียง',
  'ช่วยเหลือตัวเองได้',
  'มีผู้ดูแล',
  'ต้องติดตามเป็นพิเศษ',
  'อื่นๆ',
] as const;

export const ELDERLY_SYMPTOMS = [
  'เวียนศีรษะ / หน้ามืด',
  'ปวดศีรษะ',
  'แน่นหน้าอก / หายใจลำบาก',
  'ปวดข้อ / ปวดเข่า',
  'อ่อนแรงครึ่งซีก / ชาตามมือเท้า',
  'ปวดท้อง / ท้องอืด',
  'เบื่ออาหาร / น้ำหนักลด',
  'นอนไม่หลับ / กระสับกระส่าย',
  'ไอเรื้อรัง / มีเสมหะ',
  'ปัสสาวะบ่อย / ขัด',
  'ท้องผูก / ท้องเสีย',
  'มองเห็นภาพซ้อน / ตาพร่ามัว',
  'หูอื้อ / ได้ยินไม่ชัด',
  'ทรงตัวลำบาก / หกล้ม',
  'ซึม / สับสน / หลงลืม',
] as const;

export const TIME_PERIODS = [
  'เช้า 06:00–11:59',
  'เที่ยง 12:00–12:59',
  'บ่าย 13:00–15:59',
  'เย็น 16:00–18:59',
  'ค่ำ 19:00–23:59',
  'ดึก 00:00–05:59',
] as const;

export const SAMPLE_MEDICATIONS = [
  { th: 'ยาลดความดันโลหิต (อะมโลดิพีน)', en: 'Amlodipine', defaultDosage: '5 mg' },
  { th: 'ยาลดความดันโลหิต (เอ็นอะลาพริล)', en: 'Enalapril', defaultDosage: '10 mg' },
  { th: 'ยาลดน้ำตาลในเลือด (เมตฟอร์มิน)', en: 'Metformin', defaultDosage: '500 mg' },
  { th: 'ยาลดน้ำตาลในเลือด (กลิเมพิไรด์)', en: 'Glimepiride', defaultDosage: '2 mg' },
  { th: 'ยาลดไขมันในเลือด (ซิมวาสแตติน)', en: 'Simvastatin', defaultDosage: '20 mg' },
  { th: 'ยาลดไขมันในเลือด (อะตอร์วาสแตติน)', en: 'Atorvastatin', defaultDosage: '10 mg' },
  { th: 'ยาต้านเกล็ดเลือด (แอสไพริน)', en: 'Aspirin', defaultDosage: '81 mg' },
  { th: 'ยาต้านเกล็ดเลือด (คลอพิโดเกรล)', en: 'Clopidogrel', defaultDosage: '75 mg' },
  { th: 'ยาแก้ปวดลดอักเสบ (พาราเซตามอล)', en: 'Paracetamol', defaultDosage: '500 mg' },
  { th: 'ยารักษาโรคข้อเสื่อม (กลูโคซามีน)', en: 'Glucosamine', defaultDosage: '500 mg' },
  { th: 'ยาบำรุงกระดูก (แคลเซียมคาร์บอเนต)', en: 'Calcium Carbonate', defaultDosage: '1000 mg' },
  { th: 'วิตามินดี 3', en: 'Vitamin D3', defaultDosage: '20000 IU' },
  { th: 'ยาลดกรดในกระเพาะ (โอเมพราโซล)', en: 'Omeprazole', defaultDosage: '20 mg' },
  { th: 'ยาขยายหลอดลม (ซัลบูทามอล)', en: 'Salbutamol', defaultDosage: '100 mcg' },
  { th: 'ยาลดกรดยูริกโรคเกาต์ (อัลโลพูรินอล)', en: 'Allopurinol', defaultDosage: '100 mg' },
] as const;
