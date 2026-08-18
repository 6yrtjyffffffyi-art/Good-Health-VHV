import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NEARBY_HOSPITALS } from '../../data/mockSeedData';
import { MapPin, Phone, Navigation, AlertTriangle, Plus, Minus, ShieldAlert } from 'lucide-react';
import { VoiceReaderButton } from '../common/VoiceReaderButton';
import { VhvPermissionState } from '../../types';

interface NearbyHospitalsViewProps {
  patientId?: string;
  readOnly?: boolean;
  permission?: VhvPermissionState;
}

export const NearbyHospitalsView: React.FC<NearbyHospitalsViewProps> = () => {
  const { currentPatientProfile, locationPermission, userCoords, setLocationPermission } = useApp();
  const [zoomLevel, setZoomLevel] = useState(14);
  const isLocationActive = locationPermission === 'granted' || locationPermission === 'granted_once';

  const patientName = currentPatientProfile?.firstName
    ? `${currentPatientProfile.firstName} ${currentPatientProfile.lastName}`
    : 'สมชาย ใจดี (Somchai Jaidee)';

  const handleOpenGoogleMaps = (lat: number, lng: number, name: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Top Header matching mockup image */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-1 text-slate-800 hover:text-blue-900 transition-colors"
            title="กลับ"
          >
            <span className="text-2xl font-bold">←</span>
          </button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Nearby Hospitals
            </h2>
            <div className="text-slate-600 text-xs sm:text-sm font-semibold mt-0.5">
              <span>Patient Location: {patientName}</span>
            </div>
          </div>
        </div>

        {/* Edit Allowed Badge */}
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Edit Allowed</span>
          </span>
        </div>
      </div>

      {/* Interactive Map Preview Card */}
      <div className="bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden shadow-xs relative h-48 sm:h-64 flex items-center justify-center">
        {/* Map Background Canvas Representation */}
        <div className="absolute inset-0 bg-[#e5e3df] opacity-90">
          <svg className="w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Roads */}
            <path d="M-20,100 Q150,50 300,120 T600,80 T900,150" fill="none" stroke="#ffffff" strokeWidth="12" />
            <path d="M180,-20 L220,300" fill="none" stroke="#fed7aa" strokeWidth="8" />
            <path d="M450,-20 L400,300" fill="none" stroke="#ffffff" strokeWidth="10" />
            {/* Green park area */}
            <circle cx="280" cy="180" r="50" fill="#dcfce7" />
          </svg>
        </div>

        {/* Center Hospital / User Pin */}
        <div className="relative z-10 flex flex-col items-center animate-bounce">
          <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
            <MapPin className="w-5 h-5" />
          </div>
          <span className="mt-1 px-2.5 py-0.5 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold rounded-md shadow-xs">
            {patientName}
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="absolute right-3 bottom-3 z-10 flex flex-col gap-1 bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 1, 18))}
            className="p-2 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer border-b border-slate-100"
            title="ขยาย"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 1, 10))}
            className="p-2 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            title="ย่อ"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Medical Centers Section */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 px-1">
          Medical Centers ({NEARBY_HOSPITALS.length})
        </h3>

        <div className="space-y-3">
          {NEARBY_HOSPITALS.map((hosp, idx) => {
            const isEmergency = idx === 0 || hosp.type?.includes('โรงพยาบาลศูนย์') || hosp.type?.includes('ทั่วไป');
            const travelMins = Math.round(hosp.distanceKm * 3.5 + 4);

            return (
              <div
                key={hosp.id}
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3.5 hover:shadow-md transition-all"
              >
                {/* Title Row: Name + Emergency badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-base sm:text-lg text-slate-900">
                        {hosp.name}
                      </h4>
                      {isEmergency && (
                        <span className="px-2.5 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-black tracking-wider uppercase rounded-md">
                          EMERGENCY
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      📍 {hosp.distanceKm} km away • {hosp.address}
                    </p>
                  </div>
                </div>

                {/* Travel Time Estimate */}
                <div className="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
                  <span>🚗</span>
                  <span>~{travelMins} mins travel time</span>
                </div>

                {/* Action Buttons: Navigate (Navy) & Call (Outline) */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleOpenGoogleMaps(hosp.lat, hosp.lng, hosp.name)}
                    className="flex-1 py-2.5 px-4 bg-[#0f3d69] hover:bg-[#0c2f55] text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Navigation className="w-4 h-4 fill-white" />
                    <span>Navigate</span>
                  </button>

                  <a
                    href={`tel:${hosp.phone}`}
                    className="flex-1 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs text-center"
                  >
                    <Phone className="w-4 h-4 text-slate-600" />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
