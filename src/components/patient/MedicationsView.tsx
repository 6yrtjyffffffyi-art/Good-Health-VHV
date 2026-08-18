import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MedicationItem, VhvPermissionState } from '../../types';
import { DRUG_DATABASE, searchAndLinkDrugInfo, getDrugSuggestions, DrugDatabaseItem } from '../../data/medicationDatabase';
import { VoiceReaderButton } from '../common/VoiceReaderButton';
import {
  Pill,
  Plus,
  Edit3,
  Trash2,
  Check,
  ShieldAlert,
  Lock,
  Search,
  Sparkles,
  AlertCircle,
  Clock,
  HelpCircle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  X,
  RefreshCw,
  Info,
  CheckCircle2,
  Layers,
  HeartPulse
} from 'lucide-react';

const MEAL_TIMING_OPTIONS = [
  'เช้า',
  'เที่ยง',
  'เย็น',
  'ก่อนนอน',
  'ก่อนอาหาร',
  'หลังอาหาร',
  'พร้อมอาหาร',
  'เมื่อมีอาการ'
];

const COMMON_DOSAGES = ['5 mg', '10 mg', '20 mg', '50 mg', '100 mg', '500 mg', '1000 mg', '1 เม็ด', '1 แคปซูล', '1 ช้อนโต๊ะ (15 ml)'];
const COMMON_FREQUENCIES = [
  'รับประทานวันละ 1 ครั้ง',
  'รับประทานวันละ 2 ครั้ง (เช้า-เย็น)',
  'รับประทานวันละ 3 ครั้ง (เช้า-เที่ยง-เย็น)',
  'รับประทานวันละ 1 ครั้ง ก่อนนอน',
  'รับประทานทุก 4-6 ชั่วโมง เมื่อมีอาการ',
  'รับประทานเฉพาะเวลาปวด/มีอาการ'
];

const CATEGORY_TABS = [
  'ทั้งหมด',
  'ยาลดความดันโลหิต',
  'ยารักษาโรคเบาหวาน',
  'ยาลดไขมันในเลือด',
  'ยาแก้ปวดและต้านอักเสบ',
  'ยาระบบทางเดินอาหาร',
  'ยาแก้แพ้/ทางเดินหายใจ',
  'บำรุงกระดูก/วิตามิน',
  'อื่นๆ'
];

interface MedicationsViewProps {
  patientId?: string;
  readOnly?: boolean;
  permission?: VhvPermissionState;
}

export const MedicationsView: React.FC<MedicationsViewProps> = ({ patientId, readOnly, permission }) => {
  const { currentPatientProfile, medications = [], addMedication, editMedication, deleteMedication, showToast } = useApp();
  const pId = patientId || currentPatientProfile?.id || 'patient-1';
  const isDenied = permission === 'denied' || readOnly;

  const userMeds = useMemo(() => {
    return (medications || []).filter(m => m && m.patientId === pId);
  }, [medications, pId]);

  // View Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('ทั้งหมด');
  const [expandedMedIds, setExpandedMedIds] = useState<Record<string, boolean>>({});

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMed, setEditingMed] = useState<MedicationItem | null>(null);
  const [deletingMedId, setDeletingMedId] = useState<string | null>(null);
  const [showPermissionWarning, setShowPermissionWarning] = useState(false);

  // Search & Linker State inside Modal
  const [drugSearchQuery, setDrugSearchQuery] = useState('');
  const [isSearchingAi, setIsSearchingAi] = useState(false);
  const [linkedBadge, setLinkedBadge] = useState<string | null>(null);

  // Form Field States
  const [tradeName, setTradeName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [category, setCategory] = useState('ยาลดความดันโลหิต');
  const [indication, setIndication] = useState('');
  const [dosage, setDosage] = useState('5 mg');
  const [frequency, setFrequency] = useState('รับประทานวันละ 1 ครั้ง');
  const [selectedTimings, setSelectedTimings] = useState<string[]>(['เช้า', 'หลังอาหาร']);
  const [caution, setCaution] = useState('');
  const [notes, setNotes] = useState('');

  // Autocomplete suggestions based on modal search
  const suggestions = useMemo(() => {
    if (!drugSearchQuery.trim()) return DRUG_DATABASE.slice(0, 6);
    return getDrugSuggestions(drugSearchQuery, 6);
  }, [drugSearchQuery]);

  const toggleExpandMed = (id: string) => {
    setExpandedMedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTimingToggle = (timing: string) => {
    setSelectedTimings(prev =>
      prev.includes(timing)
        ? prev.filter(t => t !== timing)
        : [...prev, timing]
    );
  };

  // Populate form with linked drug item
  const applyLinkedDrugData = (
    drug: Partial<
      DrugDatabaseItem & {
        tradeName?: string;
        genericName?: string;
        dosage?: string;
        frequency?: string;
        mealTimings?: string[];
        notes?: string;
      }
    >
  ) => {
    const tName = drug.nameTH || drug.tradeName || drugSearchQuery;
    const gName = drug.nameEN || drug.genericName || '';
    const cat = drug.category || 'ยาอื่นๆ';
    const ind = drug.indication || '';
    const dos = drug.defaultDosage || drug.dosage || '1 เม็ด';
    const freq = drug.suggestedFrequency || drug.frequency || 'รับประทานวันละ 1 ครั้ง';
    const timings = drug.suggestedMealTimings || drug.mealTimings || ['เช้า', 'หลังอาหาร'];
    const caut = drug.caution || '';
    const inst = drug.instructions || drug.notes || '';

    setTradeName(tName);
    setGenericName(gName);
    setCategory(cat);
    setIndication(ind);
    setDosage(dos);
    setFrequency(freq);
    setSelectedTimings(timings);
    setCaution(caut);
    setNotes(inst);
    setLinkedBadge(`${tName} (${cat})`);
    showToast(`เชื่อมโยงและเติมข้อมูลยา "${tName}" เรียบร้อยแล้ว`);
  };

  // Handle Selection from Built-in Database
  const handleSelectDatabaseDrug = (drug: DrugDatabaseItem) => {
    applyLinkedDrugData(drug);
    setDrugSearchQuery(drug.nameTH);
  };

  // Handle AI Drug Information Lookup & Auto-Link
  const handleAiLookupAndLink = async (queryText?: string) => {
    const targetQuery = (queryText || drugSearchQuery || tradeName).trim();
    if (!targetQuery) {
      showToast('กรุณาระบุหรือพิมพ์ชื่อยาที่ต้องการค้นหา');
      return;
    }

    setIsSearchingAi(true);

    // 1. Try local exact or fuzzy matching first for speed
    const localMatch = searchAndLinkDrugInfo(targetQuery);
    if (localMatch) {
      setTimeout(() => {
        applyLinkedDrugData(localMatch);
        setIsSearchingAi(false);
      }, 300);
      return;
    }

    // 2. Call server AI Drug Lookup endpoint
    try {
      const res = await fetch('/api/ai/drug-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: targetQuery }),
      });

      const data = await res.json();
      if (data.success && data.drug) {
        const d = data.drug;
        applyLinkedDrugData({
          nameTH: d.tradeName || targetQuery,
          nameEN: d.genericName || '',
          category: d.category || 'ยาอื่นๆ',
          indication: d.indication || '',
          defaultDosage: d.dosage || '1 เม็ด',
          suggestedFrequency: d.frequency || 'รับประทานวันละ 1 ครั้ง',
          suggestedMealTimings: Array.isArray(d.mealTimings) && d.mealTimings.length > 0 ? d.mealTimings : ['เช้า', 'หลังอาหาร'],
          caution: d.caution || '',
          instructions: d.notes || '',
        });
      } else {
        // Fallback gracefully: auto-populate basic info
        setTradeName(targetQuery);
        setCategory('ยาอื่นๆ');
        setLinkedBadge(`${targetQuery} (ยาอื่นๆ)`);
        showToast('ค้นพบข้อมูลพื้นฐาน สามารถปรับแต่งรายละเอียดด้านล่างได้');
      }
    } catch (err) {
      console.warn('AI Drug Lookup error:', err);
      // Fallback
      setTradeName(targetQuery);
      setCategory('ยาอื่นๆ');
      setLinkedBadge(`${targetQuery}`);
      showToast('กรอกข้อมูลยาเรียบร้อย สามารถปรับแก้ขนาดยาและเวลาทานได้');
    } finally {
      setIsSearchingAi(false);
    }
  };

  const handleOpenAddModal = () => {
    if (isDenied) {
      setShowPermissionWarning(true);
      return;
    }
    setEditingMed(null);
    setDrugSearchQuery('');
    setLinkedBadge(null);
    setTradeName('');
    setGenericName('');
    setCategory('ยาลดความดันโลหิต');
    setIndication('');
    setDosage('5 mg');
    setFrequency('รับประทานวันละ 1 ครั้ง');
    setSelectedTimings(['เช้า', 'หลังอาหาร']);
    setCaution('');
    setNotes('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (med: MedicationItem) => {
    if (isDenied) {
      setShowPermissionWarning(true);
      return;
    }
    setEditingMed(med);
    setDrugSearchQuery('');
    setLinkedBadge(null);
    setTradeName(med.tradeName || med.drugNameTH || '');
    setGenericName(med.genericName || med.drugNameEN || '');
    setCategory(med.category || 'ยาอื่นๆ');
    setIndication(med.indication || '');
    setDosage(med.dosage || '1 เม็ด');
    setFrequency(med.frequency || med.instructions || 'รับประทานวันละ 1 ครั้ง');
    setSelectedTimings(med.mealTimings || med.timings || ['เช้า', 'หลังอาหาร']);
    setCaution(med.caution || '');
    setNotes(med.notes || '');
    setShowAddModal(true);
  };

  const handleSaveMed = (e: React.FormEvent) => {
    e.preventDefault();

    if (isDenied) {
      setShowPermissionWarning(true);
      return;
    }

    if (!tradeName.trim()) {
      showToast('กรุณาระบุชื่อยา');
      return;
    }

    const payload = {
      patientId: pId,
      tradeName: tradeName.trim(),
      drugNameTH: tradeName.trim(),
      genericName: genericName.trim(),
      drugNameEN: genericName.trim(),
      category: category || 'ยาอื่นๆ',
      indication: indication.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      mealTimings: selectedTimings,
      timings: selectedTimings,
      caution: caution.trim(),
      instructions: notes.trim() || frequency.trim(),
      notes: notes.trim(),
    };

    if (editingMed) {
      editMedication(editingMed.id, payload);
      showToast('แก้ไขข้อมูลยาเรียบร้อยแล้ว');
    } else {
      addMedication(payload);
      showToast(`บันทึกเพิ่มยา "${tradeName}" เรียบร้อยแล้ว`);
    }

    setShowAddModal(false);
    setEditingMed(null);
  };

  const handleDeleteMed = () => {
    if (deletingMedId) {
      deleteMedication(deletingMedId);
      setDeletingMedId(null);
      showToast('ลบรายการยาเรียบร้อยแล้ว');
    }
  };

  // Filtered list for display
  const filteredMeds = useMemo(() => {
    return userMeds.filter(med => {
      const dName = (med.tradeName || med.drugNameTH || '').toLowerCase();
      const gName = (med.genericName || med.drugNameEN || '').toLowerCase();
      const cat = (med.category || '').toLowerCase();
      const ind = (med.indication || '').toLowerCase();
      const q = searchTerm.toLowerCase().trim();

      const matchesSearch = !q || dName.includes(q) || gName.includes(q) || cat.includes(q) || ind.includes(q);

      let matchesCategory = true;
      if (selectedCategoryTab !== 'ทั้งหมด') {
        if (selectedCategoryTab === 'อื่นๆ') {
          matchesCategory = !['ยาลดความดันโลหิต', 'ยารักษาโรคเบาหวาน', 'ยาลดไขมันในเลือด', 'ยาแก้ปวดและต้านอักเสบ', 'ยาระบบทางเดินอาหาร', 'ยาแก้แพ้/ทางเดินหายใจ', 'บำรุงกระดูก/วิตามิน'].some(c => (med.category || '').includes(c));
        } else {
          matchesCategory = (med.category || '').includes(selectedCategoryTab) || (med.tradeName || '').includes(selectedCategoryTab);
        }
      }

      return matchesSearch && matchesCategory;
    });
  }, [userMeds, searchTerm, selectedCategoryTab]);

  // Overall Speech Text for all medications
  const fullMedicationsSpeech = useMemo(() => {
    if (userMeds.length === 0) return 'ขณะนี้ยังไม่มีรายการยาประจำที่บันทึกไว้ในระบบครับ';
    const itemsText = userMeds.map((m, idx) => {
      const name = m.tradeName || m.drugNameTH;
      const times = (m.mealTimings || m.timings || []).join(' และ ');
      return `รายการที่ ${idx + 1}: ${name} ขนาด ${m.dosage} ${m.frequency || ''} ช่วงเวลา ${times}`;
    }).join('. ');
    return `มีรายการยาทั้งหมด ${userMeds.length} รายการ ดังนี้ครับ: ${itemsText}`;
  }, [userMeds]);

  // Helper for category badge colors
  const getCategoryColor = (catName?: string) => {
    if (!catName) return 'bg-slate-100 text-slate-700 border-slate-200';
    if (catName.includes('ความดัน')) return 'bg-blue-50 text-blue-800 border-blue-200';
    if (catName.includes('เบาหวาน')) return 'bg-amber-50 text-amber-900 border-amber-200';
    if (catName.includes('ไขมัน')) return 'bg-purple-50 text-purple-800 border-purple-200';
    if (catName.includes('แก้ปวด') || catName.includes('อักเสบ')) return 'bg-rose-50 text-rose-800 border-rose-200';
    if (catName.includes('กระเพาะ') || catName.includes('ทางเดินอาหาร')) return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (catName.includes('ภูมิแพ้') || catName.includes('หายใจ')) return 'bg-cyan-50 text-cyan-800 border-cyan-200';
    if (catName.includes('กระดูก') || catName.includes('วิตามิน')) return 'bg-orange-50 text-orange-800 border-orange-200';
    return 'bg-teal-50 text-teal-800 border-teal-200';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Top Navigation Header matching mockup image */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              // Scroll to top or switch tab if needed
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-1 text-slate-800 hover:text-blue-900 transition-colors"
            title="กลับ"
          >
            <span className="text-2xl font-bold">←</span>
          </button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {currentPatientProfile?.firstName
                ? `${currentPatientProfile.firstName} ${currentPatientProfile.lastName}`
                : 'สมชาย ใจดี'}
            </h2>
            <div className="flex items-center gap-1.5 text-slate-600 text-xs sm:text-sm font-semibold mt-0.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>Medication Management</span>
            </div>
          </div>
        </div>

        {/* Edit Allowed / View Only Badge */}
        <div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            isDenied
              ? 'bg-rose-50 text-rose-700 border border-rose-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isDenied ? 'bg-rose-500' : 'bg-emerald-500'}`} />
            <span>{isDenied ? 'View Only (ดูได้อย่างเดียว)' : 'Edit Allowed'}</span>
          </span>
        </div>

        {/* Big Solid Add Medication Button (Matching Navy Pill in Image) */}
        {!isDenied && (
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="w-full py-3 px-6 bg-[#0f3d69] hover:bg-[#0c2f55] active:scale-[0.99] text-white font-bold rounded-full text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>+ Add Medication</span>
          </button>
        )}
      </div>

      {/* Permission Warning if read-only */}
      {isDenied && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-800 text-xs font-medium">
          <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold text-amber-900 block mb-0.5">ดูข้อมูลได้อย่างเดียว (Read-Only)</strong>
            คุณสามารถดูข้อมูลยาได้ แต่ไม่สามารถแก้ไขหรือเพิ่มรายการยาใหม่ได้ เนื่องจากเจ้าของข้อมูลยังไม่ได้เปิดสิทธิ์
          </div>
        </div>
      )}

      {/* Search Bar & Category Filter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200 space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="ค้นหายาตามชื่อ, ชื่อสามัญ, กลุ่มโรค หรือสรรพคุณ..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {CATEGORY_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedCategoryTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                selectedCategoryTab === tab
                  ? 'bg-[#0f3d69] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Medication Cards List - Matching the Exact Mockup Design */}
      <div className="space-y-4">
        {filteredMeds.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300 p-6 space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Pill className="w-7 h-7" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-base">
                {searchTerm || selectedCategoryTab !== 'ทั้งหมด'
                  ? 'ไม่พบรายการยาที่ตรงกับเงื่อนไขการค้นหา'
                  : 'ยังไม่มีรายการยาประจำที่บันทึก'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {searchTerm || selectedCategoryTab !== 'ทั้งหมด'
                  ? 'ลองเปลี่ยนคำค้นหา หรือเลือกแท็บกลุ่มยา "ทั้งหมด"'
                  : 'กดปุ่ม "+ Add Medication" เพื่อเพิ่มยาใหม่พร้อมดึงข้อมูลยาอัตโนมัติ'}
              </p>
            </div>
            {!isDenied && (
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="px-5 py-2.5 bg-[#0f3d69] hover:bg-[#0c2f55] text-white text-xs font-bold rounded-full shadow-sm cursor-pointer transition-all inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                เพิ่มรายการยาใหม่
              </button>
            )}
          </div>
        ) : (
          filteredMeds.map((med, index) => {
            const displayName = med.tradeName || med.drugNameTH || 'ไม่ระบุชื่อยา';
            const displayGeneric = med.genericName || med.drugNameEN || '';
            const displayTimings = med.mealTimings || med.timings || [];
            const displayDosage = med.dosage || '500mg';

            // Left accent color and icon styles matching mockups
            const cardStyles = [
              { border: 'border-l-[#1a56db]', iconBg: 'bg-[#e8f0fe] text-[#1a56db]', type: 'Tablet' },
              { border: 'border-l-[#2a6f78]', iconBg: 'bg-[#e6f4f1] text-[#2a6f78]', type: 'Tablet' },
              { border: 'border-l-[#b45309]', iconBg: 'bg-[#fef3c7] text-[#b45309]', type: 'Injection' },
              { border: 'border-l-[#7c3aed]', iconBg: 'bg-[#f3e8ff] text-[#7c3aed]', type: 'Capsule' }
            ];
            const currentStyle = cardStyles[index % cardStyles.length];

            return (
              <div
                key={med.id}
                className={`bg-white rounded-2xl p-5 border border-slate-200 border-l-[6px] ${currentStyle.border} shadow-xs space-y-3.5 hover:shadow-md transition-all`}
              >
                {/* Header: Circle Icon + Title + Dosage/Type */}
                <div className="flex items-start gap-3.5">
                  <div className={`w-11 h-11 rounded-full ${currentStyle.iconBg} flex items-center justify-center shrink-0`}>
                    <Pill className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {displayName} {displayGeneric ? `(${displayGeneric})` : ''}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {displayDosage} • {currentStyle.type}
                    </p>
                  </div>
                </div>

                {/* Timing Tags Row in sequence matching mockup */}
                {displayTimings.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap text-xs text-slate-600">
                    {displayTimings.map((t: string) => {
                      let tagIcon = '☀️';
                      if (t.includes('เช้า') || t.toLowerCase().includes('morning')) tagIcon = '🌅';
                      else if (t.includes('เย็น') || t.toLowerCase().includes('evening')) tagIcon = '🌙';
                      else if (t.includes('ก่อนนอน') || t.toLowerCase().includes('bedtime')) tagIcon = '🌙';
                      else if (t.includes('อาหาร') || t.toLowerCase().includes('meal')) tagIcon = '🍴';

                      return (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-700"
                        >
                          <span>{tagIcon}</span>
                          <span>{t}</span>
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Full Width Edit Button Outline */}
                {!isDenied && (
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(med)}
                      className="flex-1 py-2 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs sm:text-sm shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingMedId(med.id)}
                      className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200 transition-colors cursor-pointer"
                      title="ลบรายการยา"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ======================================================== */}
      {/* Smart Add / Edit Medication Modal with Drug Auto-Linker  */}
      {/* ======================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingMed ? 'แก้ไขข้อมูลยาประจำ' : 'เพิ่มรายการยาประจำ & ลิงก์ข้อมูลยา'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    พิมพ์ชื่อยา หรือเลือกจากฐานข้อมูลเพื่อดึงข้อมูล สรรพคุณ และขนาดวิธีใช้
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Smart Drug Search & Auto-Linker Section (Active in Add / Edit Mode) */}
            <div className="p-4 bg-teal-50/80 rounded-2xl border border-teal-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  สืบค้นและลิงก์ข้อมูลยาอัตโนมัติ (Search & Auto-Link Drug Info):
                </label>
                {linkedBadge && (
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    ลิงก์สำเร็จ
                  </span>
                )}
              </div>

              {/* Search Bar + AI Lookup Button */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-teal-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={drugSearchQuery}
                    onChange={e => setDrugSearchQuery(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAiLookupAndLink();
                      }
                    }}
                    placeholder="พิมพ์ชื่อยา เช่น Amlodipine, Ponstan, เมตฟอร์มิน, พารา, โอเมพราโซล..."
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-teal-300 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <button
                  type="button"
                  disabled={isSearchingAi || !drugSearchQuery.trim()}
                  onClick={() => handleAiLookupAndLink()}
                  className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shrink-0 shadow-sm cursor-pointer transition-all"
                >
                  {isSearchingAi ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>กำลังดึงข้อมูล...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>ดึงข้อมูลยา & ลิงก์</span>
                    </>
                  )}
                </button>
              </div>

              {/* Suggested Catalog Drugs Dropdown / Chips */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] text-teal-800 font-semibold block">
                  ตัวเลือกยาที่พบบ่อย (กดเพื่อเลือกและกรอกข้อมูลทันที):
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto no-scrollbar">
                  {suggestions.map(drug => (
                    <button
                      key={drug.id}
                      type="button"
                      onClick={() => handleSelectDatabaseDrug(drug)}
                      className="px-2.5 py-1 bg-white hover:bg-teal-600 hover:text-white border border-teal-200 text-teal-900 text-[11px] rounded-lg font-medium transition-colors text-left flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <span>{drug.nameTH}</span>
                      <span className="text-[10px] opacity-75">({drug.defaultDosage})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSaveMed} className="space-y-4 text-xs">
              {/* Trade Name & Generic Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    ชื่อยา (Trade Name / ภาษาไทย) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น ยาลดความดันโลหิต แอมโลดิพีน"
                    value={tradeName}
                    onChange={e => setTradeName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    ชื่อสามัญทางยา (Generic Name / ภาษาอังกฤษ)
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น Amlodipine Besylate"
                    value={genericName}
                    onChange={e => setGenericName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium font-mono focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Category & Indication */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    กลุ่มยา / หมวดหมู่โรค
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="ยาลดความดันโลหิต">ยาลดความดันโลหิต</option>
                    <option value="ยารักษาโรคเบาหวาน">ยารักษาโรคเบาหวาน</option>
                    <option value="ยาลดไขมันในเลือด">ยาลดไขมันในเลือด</option>
                    <option value="ยาต้านเกล็ดเลือด / ลิ่มเลือด">ยาต้านเกล็ดเลือด / ลิ่มเลือด</option>
                    <option value="ยาแก้ปวดและต้านอักเสบ">ยาแก้ปวดและต้านอักเสบ (NSAIDs)</option>
                    <option value="ยาระบบทางเดินอาหาร">ยาระบบทางเดินอาหาร / ลดกรด</option>
                    <option value="ยาแก้แพ้และทางเดินหายใจ">ยาแก้แพ้และทางเดินหายใจ</option>
                    <option value="บำรุงกระดูกและวิตามิน">บำรุงกระดูกและวิตามิน</option>
                    <option value="ยารักษาโรคเกาต์">ยารักษาโรคเกาต์</option>
                    <option value="ยาปฏิชีวนะ / ฆ่าเชื้อ">ยาปฏิชีวนะ / ฆ่าเชื้อ</option>
                    <option value="ยาอื่นๆ">ยาอื่นๆ</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    สรรพคุณ / ข้อบ่งใช้
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น ลดความดันโลหิต และป้องกันอาการแน่นหน้าอก"
                    value={indication}
                    onChange={e => setIndication(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Dosage with quick chips */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-800">
                  ขนาดยา (Dosage) <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="เช่น 5 mg, 500 mg, 1 เม็ด"
                    value={dosage}
                    onChange={e => setDosage(e.target.value)}
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {COMMON_DOSAGES.map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDosage(d)}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md border transition-colors cursor-pointer ${
                        dosage === d
                          ? 'bg-teal-700 text-white border-teal-700'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency with quick chips */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-800">
                  ความถี่ในการรับประทาน (Frequency)
                </label>
                <input
                  type="text"
                  placeholder="เช่น รับประทานวันละ 1 ครั้ง"
                  value={frequency}
                  onChange={e => setFrequency(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-teal-500 focus:outline-none"
                />
                <div className="flex flex-wrap gap-1 pt-1">
                  {COMMON_FREQUENCIES.map(f => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFrequency(f)}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md border transition-colors cursor-pointer ${
                        frequency === f
                          ? 'bg-teal-700 text-white border-teal-700'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meal Timings toggles */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-800">
                  ช่วงเวลาและมื้ออาหาร (Meal Timings):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {MEAL_TIMING_OPTIONS.map(timing => {
                    const isSelected = selectedTimings.includes(timing);
                    return (
                      <button
                        key={timing}
                        type="button"
                        onClick={() => handleTimingToggle(timing)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-teal-700 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        {timing}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Caution & Side effects */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  ข้อควรระวังสำคัญ / ผลข้างเคียงที่ต้องสังเกต (Caution)
                </label>
                <textarea
                  rows={2}
                  placeholder="เช่น รับประทานหลังอาหารทันที หรือระวังอาการข้อเท้าบวม / เวียนศีรษะ"
                  value={caution}
                  onChange={e => setCaution(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              {/* Additional notes */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  คำแนะนำเพิ่มเติมหรือบันทึกช่วยจำ (Notes)
                </label>
                <input
                  type="text"
                  placeholder="เช่น รับประทานสม่ำเสมอทุกวันตอนเช้า ห้ามหยุดยาเอง"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl cursor-pointer transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-2xl shadow-md shadow-teal-200 cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingMed ? 'บันทึกการแก้ไข' : 'บันทึกเพิ่มรายการยา'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingMedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">ยืนยันการลบรายการยา</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              คุณแน่ใจหรือไม่ว่าต้องการลบรายการยานี้ออกจากระบบ? ข้อมูลที่ถูกลบจะไม่สามารถกู้คืนได้
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingMedId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleDeleteMed}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
              >
                ยืนยันลบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permission Warning Dialog */}
      {showPermissionWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">ไม่มีสิทธิ์ในการแก้ไขข้อมูลยา</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              คุณสามารถดูข้อมูลยาได้เท่านั้น ไม่สามารถแก้ไขหรือเพิ่มรายการยาใหม่ เนื่องจากผู้ป่วยหรือเจ้าของข้อมูลยังไม่ได้เปิดสิทธิ์ให้จัดการข้อมูล
            </p>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowPermissionWarning(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                เข้าใจแล้ว
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
