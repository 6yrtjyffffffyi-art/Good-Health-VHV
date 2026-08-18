export interface PatientStatusDetail {
  key: string;
  label: string;
  badge: string;
  shortDesc: string;
  fullDesc: string;
  example: string;
  emoji: string;
  colorClass: string;
  activeBorderClass: string;
  badgeBg: string;
}

export const PATIENT_STATUS_CONFIG: Record<string, PatientStatusDetail> = {
  'อยู่บ้าน': {
    key: 'อยู่บ้าน',
    label: 'อยู่บ้าน',
    badge: 'พักอาศัยที่บ้าน',
    shortDesc: 'พักอาศัยที่บ้านตนเอง/ครอบครัว สามารถใช้ชีวิตประจำวันในบ้านได้',
    fullDesc: 'ผู้สูงอายุ/ผู้ป่วยที่พักอาศัยอยู่ในบ้านของตนเองหรือครอบครัว มีสภาพแวดล้อมที่คุ้นเคย สามารถทำกิจวัตรประจำวันส่วนใหญ่ได้ในบริเวณบ้าน อาจต้องการการดูแลเป็นครั้งคราว',
    example: 'เช่น ผู้สูงอายุที่อยู่บ้าน ทำกับข้าว เดินรอบบ้านได้ มีลูกหลานแวะเวียนมาดูแล',
    emoji: '🏡',
    colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    activeBorderClass: 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-300',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  'อยู่โรงพยาบาล': {
    key: 'อยู่โรงพยาบาล',
    label: 'อยู่โรงพยาบาล',
    badge: 'พักรักษาตัวใน รพ.',
    shortDesc: 'พักรักษาตัวอยู่ที่โรงพยาบาล / รพ.สต. หรือสถานพยาบาล',
    fullDesc: 'ผู้ป่วยที่กำลังนอนพักรักษาตัวหรือแอดมิท (Admit) อยู่ในโรงพยาบาลศูนย์ โรงพยาบาลอำเภอ หรือ รพ.สต. อยู่ระหว่างการรักษาและดูแลอย่างใกล้ชิดจากแพทย์และพยาบาล',
    example: 'เช่น ผู้ป่วยนอนพักฟื้นหลังผ่าตัด หรือมีภาวะแทรกซ้อนที่ต้องให้ยาทางสายน้ำเกลือใน รพ.',
    emoji: '🏥',
    colorClass: 'text-blue-700 bg-blue-50 border-blue-200',
    activeBorderClass: 'border-blue-500 bg-blue-50/70 ring-2 ring-blue-300',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  'ติดเตียง': {
    key: 'ติดเตียง',
    label: 'ติดเตียง',
    badge: 'ช่วยเหลือตัวเองไม่ได้',
    shortDesc: 'ไม่สามารถลุกเดินได้ ต้องนอนบนเตียงเป็นหลัก ต้องการการดูแล 24 ชม.',
    fullDesc: 'ผู้ป่วยหรือผู้สูงอายุที่มีข้อจำกัดทางร่างกายรุนแรง ไม่สามารถลุกนั่งหรือเดินได้เอง ต้องนอนอยู่บนเตียงเป็นส่วนใหญ่ ต้องการผู้ดูแลคอยช่วยเหลือการกินยา ป้อนอาหาร พลิกตัว และสุขอนามัยตลอดเวลา',
    example: 'เช่น ผู้ป่วยอัมพาตครึ่งท่อนล่าง, ผู้ป่วยระยะพักฟื้นหลอดเลือดสมองรุนแรงที่ต้องใส่สายให้อาหาร',
    emoji: '🛏️',
    colorClass: 'text-rose-700 bg-rose-50 border-rose-200',
    activeBorderClass: 'border-rose-500 bg-rose-50/70 ring-2 ring-rose-300',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
  },
  'ช่วยเหลือตัวเองได้': {
    key: 'ช่วยเหลือตัวเองได้',
    label: 'ช่วยเหลือตัวเองได้',
    badge: 'กิจวัตรปกติ',
    shortDesc: 'สุขภาพแข็งแรง ลุกเดิน ทำกิจวัตรประจำวัน และทานยาได้ด้วยตนเอง',
    fullDesc: 'ผู้สูงอายุที่ยังมีสมรรถภาพทางกายที่ดี สามารถเดิน อาบน้ำ แต่งตัว ทานอาหาร และจัดยาประจำตัวทานเองได้ตามปกติ ไม่จำเป็นต้องมีผู้ดูแลประกบตลอดเวลา',
    example: 'เช่น ผู้สูงอายุวัย 60-75 ปีที่ยังเดินคล่อง ไปตลาดเองได้ มีเพียงโรคประจำตัวที่ต้องทานยาคุม',
    emoji: '🚶',
    colorClass: 'text-teal-700 bg-teal-50 border-teal-200',
    activeBorderClass: 'border-teal-500 bg-teal-50/70 ring-2 ring-teal-300',
    badgeBg: 'bg-teal-100 text-teal-800 border-teal-300',
  },
  'ติดสังคม': {
    key: 'ติดสังคม',
    label: 'ติดสังคม',
    badge: 'ร่วมกิจกรรมชุมชน',
    shortDesc: 'สุขภาพแข็งแรง ออกไปร่วมกิจกรรมชุมชน งานบุญ หรือชมรมผู้สูงอายุได้',
    fullDesc: 'ผู้สูงอายุที่มีสุขภาพร่างกายและจิตใจแจ่มใส สามารถเดินทางไปนอกบ้านเพื่อพบปะเพื่อนบ้าน ไปวัด ทำบุญ หรือร่วมกิจกรรมของชมรมผู้สูงอายุในหมู่บ้านได้อย่างต่อเนื่อง',
    example: 'เช่น สมาชิกชมรมผู้สูงอายุ ไปทำบุญทุกวันพระ ไปออกกำลังกายตอนเช้าที่ลานชุมชน',
    emoji: '🤝',
    colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    activeBorderClass: 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-300',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  'ติดบ้าน': {
    key: 'ติดบ้าน',
    label: 'ติดบ้าน',
    badge: 'ต้องการการดูแลบางส่วน',
    shortDesc: 'เคลื่อนไหวได้จำกัด อยู่แต่ในบ้านเป็นหลัก ช่วยเหลือตัวเองได้บางส่วน',
    fullDesc: 'ผู้สูงอายุที่เคลื่อนไหวได้ช้าลง มีอาการปวดเข่าหรือทรงตัวลำบาก ไม่ออกไปนอกบ้านหากไม่มีคนพาไป สามารถเดินในบ้านได้แต่ต้องการความช่วยเหลือในกิจกรรมหนักหรือเวลาเดินทางไป รพ.',
    example: 'เช่น ผู้สูงอายุที่มีอาการข้อเข่าเสื่อม ต้องใช้ไม้เท้า เดินช้า อยู่แต่ในบ้าน ไม่กล้าออกไปข้างนอกคนเดียว',
    emoji: '🏠',
    colorClass: 'text-amber-700 bg-amber-50 border-amber-200',
    activeBorderClass: 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-300',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  'มีผู้ดูแล': {
    key: 'มีผู้ดูแล',
    label: 'มีผู้ดูแล',
    badge: 'มีญาติ/ผู้ดูแลใกล้ชิด',
    shortDesc: 'มีญาติหรือผู้ดูแลประจำคอยจัดยา ดูแลอาหาร และพาไปพบแพทย์',
    fullDesc: 'ผู้สูงอายุหรือผู้ป่วยที่มีบุตรหลาน ญาติ หรือผู้ดูแลหลักคอยให้ความช่วยเหลือด้านการจัดเตรียมยา วัดความดัน/น้ำตาล พาไปตามนัดของแพทย์ และช่วยตัดสินใจเรื่องสุขภาพ',
    example: 'เช่น ผู้สูงอายุที่มีลูกสาวอยู่บ้านเดียวกัน คอยจัดยาเช้า-เย็น และพาไปตรวจตามนัด รพ.สต.',
    emoji: '👨‍👩‍👧',
    colorClass: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    activeBorderClass: 'border-indigo-500 bg-indigo-50/70 ring-2 ring-indigo-300',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  },
  'ต้องติดตามเป็นพิเศษ': {
    key: 'ต้องติดตามเป็นพิเศษ',
    label: 'ต้องติดตามเป็นพิเศษ',
    badge: 'อสม. ติดตามใกล้ชิด',
    shortDesc: 'มีความเสี่ยงสูง เช่น ความดัน/น้ำตาลแกว่ง เสี่ยงหกล้ม หรืออยู่คนเดียว',
    fullDesc: 'ผู้สูงอายุที่มีภาวะสุขภาพต้องเฝ้าระวัง เช่น มีประวัติลื่นล้มบ่อย ควบคุมความดันโลหิตหรือน้ำตาลไม่ได้ มีภาวะซึมเศร้า หรืออยู่บ้านเพียงลำพัง ทำให้ อสม. และทีมสุขภาพต้องลงพื้นที่ตรวจเยี่ยมถี่กว่าปกติ',
    example: 'เช่น ผู้สูงอายุวัย 82 ปีอยู่คนเดียว ความดันโลหิตสูงกว่า 160 บ่อยครั้ง อสม. ต้องแวะเยี่ยมสัปดาห์ละ 2-3 ครั้ง',
    emoji: '⚠️',
    colorClass: 'text-purple-700 bg-purple-50 border-purple-200',
    activeBorderClass: 'border-purple-500 bg-purple-50/70 ring-2 ring-purple-300',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  'อื่นๆ': {
    key: 'อื่นๆ',
    label: 'อื่นๆ',
    badge: 'ระบุสถานะเพิ่มเติม',
    shortDesc: 'ลักษณะความเป็นอยู่อื่นๆ นอกเหนือจากตัวเลือกข้างต้น',
    fullDesc: 'สถานะหรือลักษณะความเป็นอยู่ที่ไม่ได้ระบุไว้ในหมวดหมู่หลัก สามารถพิมพ์คำอธิบายเพิ่มเติมตามบริบทจริงของผู้สูงอายุได้',
    example: 'เช่น กำลังอยู่ในระหว่างย้ายที่พักชั่วคราว, อยู่ศูนย์ฟื้นฟูชุมชน ฯลฯ',
    emoji: '📝',
    colorClass: 'text-slate-700 bg-slate-50 border-slate-200',
    activeBorderClass: 'border-slate-500 bg-slate-50/70 ring-2 ring-slate-300',
    badgeBg: 'bg-slate-200 text-slate-800 border-slate-300',
  },
};

export const ALL_STATUS_KEYS = Object.keys(PATIENT_STATUS_CONFIG);

export const getStatusDetail = (statusName: string): PatientStatusDetail => {
  if (PATIENT_STATUS_CONFIG[statusName]) {
    return PATIENT_STATUS_CONFIG[statusName];
  }
  return {
    key: statusName || 'อยู่บ้าน',
    label: statusName || 'อยู่บ้าน',
    badge: 'ข้อมูลสถานะ',
    shortDesc: 'สถานะการดูแลสุขภาพ',
    fullDesc: statusName || 'สถานะการดูแลสุขภาพของผู้ป่วย/ผู้สูงอายุ',
    example: '',
    emoji: '📋',
    colorClass: 'text-slate-700 bg-slate-50 border-slate-200',
    activeBorderClass: 'border-slate-400 bg-slate-50',
    badgeBg: 'bg-slate-100 text-slate-700 border-slate-300',
  };
};
