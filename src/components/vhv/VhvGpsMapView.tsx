import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PatientProfile } from '../../types';
import {
  MapPin,
  Users,
  Navigation,
  Phone,
  ShieldCheck,
  Activity,
  AlertTriangle,
  ChevronRight,
  Filter,
  ExternalLink,
  Home,
  CheckCircle2,
  Info,
  Compass,
  Crosshair,
  LocateFixed
} from 'lucide-react';
import { formatAddress } from '../../utils/addressUtils';
import { VoiceReaderButton } from '../common/VoiceReaderButton';

interface VhvGpsMapViewProps {
  onSelectPatient?: (patient: PatientProfile) => void;
}

export const VhvGpsMapView: React.FC<VhvGpsMapViewProps> = ({ onSelectPatient }) => {
  const { allPatients, vitalSignsRecords, showToast } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'ติดสังคม' | 'ติดบ้าน' | 'ติดเตียง'>('all');
  const [activePatient, setActivePatient] = useState<PatientProfile | null>(allPatients[0] || null);

  // Group categorization
  const getPatientCategory = (patient: PatientProfile): 'ติดสังคม' | 'ติดบ้าน' | 'ติดเตียง' => {
    if (patient.status === 'ติดเตียง') return 'ติดเตียง';
    if (patient.status === 'ต้องติดตามเป็นพิเศษ' || patient.status === 'มีผู้ดูแล') return 'ติดบ้าน';
    return 'ติดสังคม';
  };

  // Mock geographic positions in the village for GPS visualization
  const getVillageGpsCoords = (index: number) => {
    const coordsMap = [
      { x: 32, y: 38, lat: 18.7903, lng: 98.9612, code: 'GPS-M2-01' },
      { x: 58, y: 25, lat: 18.7925, lng: 98.9645, code: 'GPS-M2-02' },
      { x: 45, y: 68, lat: 18.7880, lng: 98.9630, code: 'GPS-M2-03' },
      { x: 75, y: 60, lat: 18.7895, lng: 98.9680, code: 'GPS-M2-04' },
      { x: 20, y: 70, lat: 18.7865, lng: 98.9590, code: 'GPS-M2-05' },
      { x: 70, y: 35, lat: 18.7940, lng: 98.9660, code: 'GPS-M2-06' },
      { x: 38, y: 82, lat: 18.7850, lng: 98.9620, code: 'GPS-M2-07' },
      { x: 82, y: 45, lat: 18.7932, lng: 98.9695, code: 'GPS-M2-08' },
    ];
    return coordsMap[index % coordsMap.length];
  };

  const filteredPatients = allPatients.filter(p => {
    if (selectedFilter === 'all') return true;
    return getPatientCategory(p) === selectedFilter;
  });

  const getPinColor = (cat: 'ติดสังคม' | 'ติดบ้าน' | 'ติดเตียง') => {
    if (cat === 'ติดเตียง') return 'bg-rose-500 text-white ring-4 ring-rose-200';
    if (cat === 'ติดบ้าน') return 'bg-amber-500 text-white ring-4 ring-amber-200';
    return 'bg-emerald-500 text-white ring-4 ring-emerald-200';
  };

  const handleOpenGoogleMapsGps = (patient: PatientProfile, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const gps = getVillageGpsCoords(index);
    // Open Google Maps with exact GPS coordinates
    const url = `https://www.google.com/maps/search/?api=1&query=${gps.lat},${gps.lng}`;
    window.open(url, '_blank');
  };

  const activePatientIndex = activePatient ? allPatients.findIndex(p => p.id === activePatient.id) : 0;
  const currentGps = getVillageGpsCoords(activePatientIndex >= 0 ? activePatientIndex : 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-blue-900 rounded-3xl p-6 text-white shadow-xl shadow-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-bold">
            <LocateFixed className="w-3.5 h-3.5 text-emerald-300" />
            ระบบระบุพิกัด GPS ประจำหลังคาเรือน (GPS Coordinate Tracking)
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-300" />
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              แผนที่ปักหมุดบ้านพิกัด GPS (GPS Map)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-2xl">
            ระบุพิกัด GPS ตำแหน่งบ้านจริงและสถานะสุขภาพของผู้สูงอายุในชุมชน ช่วยให้อสม. วางแผนเส้นทางลงพื้นที่และนำทางไปยังบ้านผู้ป่วยได้อย่างแม่นยำ
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <VoiceReaderButton
            textToRead="หน้าแผนที่ปักหมุดบ้านพิกัด GPS ผู้สูงอายุในชุมชน รพ.สต.สุเทพ แสดงตำแหน่งบ้านและพิกัดละติจูดลองจิจูด พร้อมระบบนำทางด้วย Google Maps"
            label="ฟังเสียงแนะนำ"
            size="md"
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-700" />
          <span className="text-xs font-bold text-slate-800">กลุ่มสุขภาพเป้าหมาย:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ทั้งหมด ({allPatients.length})
          </button>
          <button
            onClick={() => setSelectedFilter('ติดสังคม')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'ติดสังคม'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            กลุ่มติดสังคม ({allPatients.filter(p => getPatientCategory(p) === 'ติดสังคม').length})
          </button>
          <button
            onClick={() => setSelectedFilter('ติดบ้าน')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'ติดบ้าน'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            กลุ่มติดบ้าน ({allPatients.filter(p => getPatientCategory(p) === 'ติดบ้าน').length})
          </button>
          <button
            onClick={() => setSelectedFilter('ติดเตียง')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'ติดเตียง'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            กลุ่มติดเตียง ({allPatients.filter(p => getPatientCategory(p) === 'ติดเตียง').length})
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Visual Map + Patient Quick Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Map Canvas Container */}
        <div className="lg:col-span-2 bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-xl relative min-h-[440px] flex flex-col justify-between overflow-hidden">
          {/* Simulated Village Map Background Layer */}
          <div className="absolute inset-0 opacity-25 pointer-events-none">
            {/* Grid Lines */}
            <div className="w-full h-full bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
            {/* Road Paths Simulation */}
            <svg className="absolute inset-0 w-full h-full stroke-slate-700/60 stroke-2 fill-none">
              <path d="M 50 20 Q 200 150 450 120 T 800 300" strokeDasharray="6,6" />
              <path d="M 120 400 Q 300 250 550 350 T 780 100" strokeDasharray="4,4" />
            </svg>
          </div>

          {/* Map Title Overlay */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
            <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-700 text-white text-xs flex items-center gap-2 shadow-md">
              <Home className="w-4 h-4 text-sky-400" />
              <span>หมู่ 2 ต.สุเทพ อ.เมือง จ.เชียงใหม่</span>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-1.5 py-0.5 rounded">GPS Active</span>
            </div>

            <span className="text-[11px] text-slate-300 bg-slate-800/80 px-3 py-1 rounded-xl border border-slate-700">
              แตะหมุดบ้านเพื่อดูพิกัด GPS & นำทาง
            </span>
          </div>

          {/* Pins on Village Map */}
          <div className="relative w-full h-72 my-auto">
            {filteredPatients.map((patient, index) => {
              const coords = getVillageGpsCoords(index);
              const cat = getPatientCategory(patient);
              const isSelected = activePatient?.id === patient.id;

              return (
                <div
                  key={patient.id}
                  onClick={() => setActivePatient(patient)}
                  style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 z-20 group ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-115'
                  }`}
                >
                  {/* Pin Node */}
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs shadow-lg transition-transform ${getPinColor(
                      cat
                    )} ${isSelected ? 'ring-4 ring-white shadow-xl' : ''}`}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>

                  {/* Pin Label Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-slate-900/95 text-white text-[10px] font-bold px-2.5 py-1 rounded-xl whitespace-nowrap shadow-md pointer-events-none opacity-90 group-hover:opacity-100 border border-slate-700">
                    <span className="text-sky-300 mr-1">📍</span>
                    {patient.firstName} ({cat})
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Legend & GPS Status */}
          <div className="relative z-10 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs text-white">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>ติดสังคม</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span>ติดบ้าน</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span>ติดเตียง</span>
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-300 font-mono">
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span>พิกัด GPS WGS84 Datum</span>
            </div>
          </div>
        </div>

        {/* Selected Patient Details Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          {activePatient ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    getPatientCategory(activePatient) === 'ติดเตียง'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : getPatientCategory(activePatient) === 'ติดบ้าน'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  กลุ่ม{getPatientCategory(activePatient)}
                </span>
                <span className="text-xs text-slate-400 font-bold">อายุ {activePatient.age} ปี</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {activePatient.firstName} {activePatient.lastName}
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{formatAddress(activePatient.address)}</span>
                </p>
              </div>

              {/* GPS Coordinates Box */}
              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 space-y-1 text-xs text-sky-950 font-mono">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1 text-sky-800">
                    <Crosshair className="w-3.5 h-3.5 text-sky-600" />
                    พิกัด GPS ประจำบ้าน:
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded border border-sky-300 text-[10px] text-sky-700 font-bold">
                    {currentGps.code}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-slate-700 pt-0.5">
                  Lat: {currentGps.lat}° N, Lng: {currentGps.lng}° E
                </div>
              </div>

              {/* Patient Contacts & Medical Conditions */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-blue-700" />
                    เบอร์โทรศัพท์:
                  </span>
                  <a href={`tel:${activePatient.phone}`} className="font-bold text-blue-700 hover:underline">
                    {activePatient.phone}
                  </a>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">โรคประจำตัว:</span>
                  <span className="font-bold text-slate-800 text-right">
                    {activePatient.diseases?.join(', ') || 'ไม่มี'}
                  </span>
                </div>

                {activePatient.caregiverContacts?.[0] && (
                  <div className="flex items-center justify-between border-t border-slate-200 pt-1.5">
                    <span className="text-slate-500">ผู้ดูแล:</span>
                    <span className="font-semibold text-slate-700">
                      {activePatient.caregiverContacts[0].name} ({activePatient.caregiverContacts[0].relationship})
                    </span>
                  </div>
                )}
              </div>

              {/* Navigation Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={e => handleOpenGoogleMapsGps(activePatient, activePatientIndex, e)}
                  className="w-full py-3 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-200 transition-all cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>นำทางด้วย Google Maps (พิกัด GPS)</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </button>

                {onSelectPatient && (
                  <button
                    type="button"
                    onClick={() => onSelectPatient(activePatient)}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-200 transition-all cursor-pointer"
                  >
                    <span>ดูประวัติและบันทึกสัญญาณชีพ</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs">
              เลือกหมุดบนแผนที่เพื่อดูข้อมูลและพิกัด GPS
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
