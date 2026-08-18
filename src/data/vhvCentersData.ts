import { VhvCenter } from '../types';

export const THAILAND_PROVINCES = [
  'กรุงเทพมหานคร',
  'เชียงใหม่',
  'นนทบุรี',
  'ปทุมธานี',
  'สมุทรปราการ',
  'ชลบุรี',
  'ขอนแก่น',
  'นครราชสีมา',
  'ภูเก็ต',
  'สงขลา',
  'สุราษฎร์ธานี',
  'เชียงราย',
  'พิษณุโลก',
  'อุบลราชธานี',
  'อุดรธานี',
  'นครสวรรค์',
  'พระนครศรีอยุธยา',
  'ระยอง',
  'ประจวบคีรีขันธ์',
  'ตรัง',
  'นครปฐม'
];

export const VHV_CENTERS_DATABASE: VhvCenter[] = [
  // Bangkok
  {
    id: 'center-bkk-01',
    name: 'ศูนย์ อสม. ชุมชนบางนา',
    subdistrict: 'บางนา',
    district: 'บางนา',
    province: 'กรุงเทพมหานคร',
    postalCode: '10260',
    lat: 13.6682,
    lng: 100.6042,
    phone: '02-398-0011'
  },
  {
    id: 'center-bkk-02',
    name: 'ศูนย์ อสม. ชุมชนบางนาตราด กม.4',
    subdistrict: 'บางนา',
    district: 'บางนา',
    province: 'กรุงเทพมหานคร',
    postalCode: '10260',
    lat: 13.6655,
    lng: 100.6350,
    phone: '02-398-0022'
  },
  {
    id: 'center-bkk-03',
    name: 'ศูนย์ อสม. ชุมชนคลองเตยพัฒนา',
    subdistrict: 'คลองเตย',
    district: 'คลองเตย',
    province: 'กรุงเทพมหานคร',
    postalCode: '10110',
    lat: 13.7088,
    lng: 100.5601,
    phone: '02-249-1122'
  },
  {
    id: 'center-bkk-04',
    name: 'ศูนย์ อสม. ชุมชนจตุจักรสุขสันต์',
    subdistrict: 'จตุจักร',
    district: 'จตุจักร',
    province: 'กรุงเทพมหานคร',
    postalCode: '10900',
    lat: 13.8164,
    lng: 100.5562,
    phone: '02-513-4455'
  },
  {
    id: 'center-bkk-05',
    name: 'ศูนย์บริการสาธารณสุข 5 กรุงเทพมหานคร (ปทุมวัน)',
    subdistrict: 'รองเมือง',
    district: 'ปทุมวัน',
    province: 'กรุงเทพมหานคร',
    postalCode: '10330',
    lat: 13.7432,
    lng: 100.5218,
    phone: '02-214-1057'
  },
  {
    id: 'center-bkk-06',
    name: 'ศูนย์ อสม. ชุมชนดอนเมืองพัฒนา',
    subdistrict: 'สีกัน',
    district: 'ดอนเมือง',
    province: 'กรุงเทพมหานคร',
    postalCode: '10210',
    lat: 13.9132,
    lng: 100.5910,
    phone: '02-565-3344'
  },
  {
    id: 'center-bkk-07',
    name: 'ศูนย์ อสม. ชุมชนมีนบุรีร่มเย็น',
    subdistrict: 'มีนบุรี',
    district: 'มีนบุรี',
    province: 'กรุงเทพมหานคร',
    postalCode: '10510',
    lat: 13.8139,
    lng: 100.7225,
    phone: '02-540-7788'
  },
  {
    id: 'center-bkk-08',
    name: 'ศูนย์ อสม. ชุมชนวัดกัลยาณมิตร ธนบุรี',
    subdistrict: 'วัดกัลยาณ์',
    district: 'ธนบุรี',
    province: 'กรุงเทพมหานคร',
    postalCode: '10600',
    lat: 13.7391,
    lng: 100.4908,
    phone: '02-466-8899'
  },
  {
    id: 'center-bkk-09',
    name: 'ศูนย์บริการสาธารณสุข 4 ดินแดง',
    subdistrict: 'ดินแดง',
    district: 'ดินแดง',
    province: 'กรุงเทพมหานคร',
    postalCode: '10400',
    lat: 13.7701,
    lng: 100.5587,
    phone: '02-245-2615'
  },
  {
    id: 'center-bkk-10',
    name: 'ศูนย์ อสม. ชุมชนลาดพร้าว 80',
    subdistrict: 'วังทองหลาง',
    district: 'วังทองหลาง',
    province: 'กรุงเทพมหานคร',
    postalCode: '10310',
    lat: 13.7842,
    lng: 100.6015,
    phone: '02-933-2211'
  },

  // Chiang Mai
  {
    id: 'center-cm-01',
    name: 'โรงพยาบาลส่งเสริมสุขภาพตำบล (รพ.สต.) สุเทพ',
    subdistrict: 'สุเทพ',
    district: 'เมืองเชียงใหม่',
    province: 'เชียงใหม่',
    postalCode: '50200',
    lat: 18.7891,
    lng: 98.9567,
    phone: '053-277-889'
  },
  {
    id: 'center-cm-02',
    name: 'ศูนย์ อสม. ชุมชนช้างเผือก ซอย 4',
    subdistrict: 'ช้างเผือก',
    district: 'เมืองเชียงใหม่',
    province: 'เชียงใหม่',
    postalCode: '50300',
    lat: 18.8062,
    lng: 98.9856,
    phone: '053-211-345'
  },
  {
    id: 'center-cm-03',
    name: 'ศูนย์บริการสาธารณสุขศรีภูมิ',
    subdistrict: 'ศรีภูมิ',
    district: 'เมืองเชียงใหม่',
    province: 'เชียงใหม่',
    postalCode: '50200',
    lat: 18.7955,
    lng: 98.9892,
    phone: '053-222-111'
  },
  {
    id: 'center-cm-04',
    name: 'โรงพยาบาลส่งเสริมสุขภาพตำบล แม่ริม',
    subdistrict: 'ริมใต้',
    district: 'แม่ริม',
    province: 'เชียงใหม่',
    postalCode: '50180',
    lat: 18.9145,
    lng: 98.9450,
    phone: '053-297-123'
  },
  {
    id: 'center-cm-05',
    name: 'โรงพยาบาลส่งเสริมสุขภาพตำบล สันทรายหลวง',
    subdistrict: 'สันทรายหลวง',
    district: 'สันทราย',
    province: 'เชียงใหม่',
    postalCode: '50210',
    lat: 18.8520,
    lng: 99.0430,
    phone: '053-491-456'
  },
  {
    id: 'center-cm-06',
    name: 'โรงพยาบาลส่งเสริมสุขภาพตำบล หางดง',
    subdistrict: 'หางดง',
    district: 'หางดง',
    province: 'เชียงใหม่',
    postalCode: '50230',
    lat: 18.6872,
    lng: 98.9180,
    phone: '053-441-234'
  },

  // Nonthaburi
  {
    id: 'center-non-01',
    name: 'โรงพยาบาลส่งเสริมสุขภาพตำบล บางกรวย',
    subdistrict: 'บางกรวย',
    district: 'บางกรวย',
    province: 'นนทบุรี',
    postalCode: '11130',
    lat: 13.8055,
    lng: 100.4720,
    phone: '02-447-1234'
  },
  {
    id: 'center-non-02',
    name: 'ศูนย์บริการสาธารณสุขเทศบาลนครนนทบุรี',
    subdistrict: 'สวนใหญ่',
    district: 'เมืองนนทบุรี',
    province: 'นนทบุรี',
    postalCode: '11000',
    lat: 13.8622,
    lng: 100.5144,
    phone: '02-589-0500'
  },

  // Chonburi
  {
    id: 'center-chon-01',
    name: 'ศูนย์แพทย์ชุมชนเมืองพัทยา',
    subdistrict: 'หนองปรือ',
    district: 'บางละมุง',
    province: 'ชลบุรี',
    postalCode: '20150',
    lat: 12.9236,
    lng: 100.8825,
    phone: '038-420-567'
  },
  {
    id: 'center-chon-02',
    name: 'ศูนย์ อสม. ชุมชนเทศบาลเมืองศรีราชา',
    subdistrict: 'ศรีราชา',
    district: 'ศรีราชา',
    province: 'ชลบุรี',
    postalCode: '20110',
    lat: 13.1737,
    lng: 100.9312,
    phone: '038-322-111'
  },

  // Khon Kaen
  {
    id: 'center-kk-01',
    name: 'ศูนย์แพทย์ชุมชน รพ.ขอนแก่น 1 (กังสดาล)',
    subdistrict: 'ในเมือง',
    district: 'เมืองขอนแก่น',
    province: 'ขอนแก่น',
    postalCode: '40000',
    lat: 16.4442,
    lng: 102.8359,
    phone: '043-241-555'
  },
  {
    id: 'center-kk-02',
    name: 'โรงพยาบาลส่งเสริมสุขภาพตำบล บ้านเป็ด',
    subdistrict: 'บ้านเป็ด',
    district: 'เมืองขอนแก่น',
    province: 'ขอนแก่น',
    postalCode: '40000',
    lat: 16.4290,
    lng: 102.7750,
    phone: '043-246-888'
  },

  // Phuket
  {
    id: 'center-pkt-01',
    name: 'ศูนย์บริการสาธารณสุข 1 เทศบาลนครภูเก็ต',
    subdistrict: 'ตลาดใหญ่',
    district: 'เมืองภูเก็ต',
    province: 'ภูเก็ต',
    postalCode: '83000',
    lat: 7.8804,
    lng: 98.3923,
    phone: '076-211-111'
  },
  {
    id: 'center-pkt-02',
    name: 'โรงพยาบาลส่งเสริมสุขภาพตำบล ป่าตอง',
    subdistrict: 'ป่าตอง',
    district: 'กะทู้',
    province: 'ภูเก็ต',
    postalCode: '83150',
    lat: 7.8970,
    lng: 98.2980,
    phone: '076-340-444'
  }
];

// Haversine formula to calculate distance between two coordinates in kilometers
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // Round to 1 decimal place
}
