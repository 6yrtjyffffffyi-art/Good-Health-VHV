import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles, HelpCircle, Check } from 'lucide-react';

interface BirthDateInputProps {
  value: string; // ISO string 'YYYY-MM-DD' or formatted text
  age?: number | string;
  onChange: (isoDate: string, calculatedAge: number) => void;
  onAgeChange?: (age: number) => void;
  required?: boolean;
  className?: string;
  label?: string;
  helpText?: string;
}

export const BirthDateInput: React.FC<BirthDateInputProps> = ({
  value,
  age,
  onChange,
  onAgeChange,
  required = false,
  className = '',
  label = 'วัน เดือน ปีเกิด (พิมพ์ได้โดยตรง)',
  helpText = 'สามารถพิมพ์เป็น วัน/เดือน/ปี พ.ศ. (เช่น 15/08/2495) หรือ ค.ศ. (15/08/1952) หรือระบุเฉพาะปีเกิดได้เลย'
}) => {
  // Input mode: 'typing' (text) vs 'triplet' (Day Month Year fields)
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [manualAge, setManualAge] = useState<string>(age !== undefined ? String(age) : '');
  const [isBeYear, setIsBeYear] = useState(true); // true = พ.ศ., false = ค.ศ.
  const [textInput, setTextInput] = useState('');

  // Initialize from value prop
  useEffect(() => {
    if (value) {
      if (value.includes('-')) {
        const parts = value.split('-');
        if (parts.length === 3) {
          const y = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10);
          const d = parseInt(parts[2], 10);

          if (!isNaN(y)) {
            const beYear = y + 543;
            setYear(String(beYear));
            setMonth(m ? String(m).padStart(2, '0') : '01');
            setDay(d ? String(d).padStart(2, '0') : '01');
            setTextInput(`${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${beYear}`);

            const currentYear = new Date().getFullYear();
            const calculatedAge = Math.max(0, currentYear - y);
            setManualAge(String(calculatedAge));
          }
        }
      } else if (value.includes('/')) {
        setTextInput(value);
      }
    }
  }, [value]);

  // Synchronize manual age if parent updates it
  useEffect(() => {
    if (age !== undefined && age !== '') {
      setManualAge(String(age));
    }
  }, [age]);

  // Calculate and emit ISO date and age from Day/Month/Year components
  const updateDateFromParts = (d: string, m: string, y: string) => {
    let yearNum = parseInt(y.trim(), 10);
    if (isNaN(yearNum)) return;

    // Convert Buddhist Era to Gregorian if needed (if > 2300, assume BE)
    let ceYear = yearNum;
    if (yearNum > 2300) {
      ceYear = yearNum - 543;
    }

    const currentYear = new Date().getFullYear();
    const calculatedAge = Math.max(0, currentYear - ceYear);

    const monthNum = parseInt(m, 10) || 1;
    const dayNum = parseInt(d, 10) || 1;

    const formattedMonth = String(Math.min(12, Math.max(1, monthNum))).padStart(2, '0');
    const formattedDay = String(Math.min(31, Math.max(1, dayNum))).padStart(2, '0');
    const isoString = `${ceYear}-${formattedMonth}-${formattedDay}`;

    setManualAge(String(calculatedAge));
    onChange(isoString, calculatedAge);
    onAgeChange?.(calculatedAge);
  };

  // Handle direct single string typing (e.g. "15/08/2495" or "15 08 2495" or "2495")
  const handleTextInputChange = (val: string) => {
    setTextInput(val);

    // Clean input and try to parse
    const clean = val.replace(/[^0-9/.-]/g, '');
    const tokens = clean.split(/[/.-]/).filter(Boolean);

    if (tokens.length === 3) {
      // Day, Month, Year
      const d = tokens[0];
      const m = tokens[1];
      const y = tokens[2];
      setDay(d);
      setMonth(m);
      setYear(y);
      updateDateFromParts(d, m, y);
    } else if (tokens.length === 1 && tokens[0].length === 4) {
      // Only 4-digit Year (e.g. 2495 or 1952)
      const y = tokens[0];
      setYear(y);
      setMonth('01');
      setDay('01');
      updateDateFromParts('01', '01', y);
    }
  };

  // Handle direct age typing (e.g. typing 70 calculates approx birth year)
  const handleAgeInputChange = (newAgeStr: string) => {
    setManualAge(newAgeStr);
    const ageNum = parseInt(newAgeStr, 10);
    if (!isNaN(ageNum) && ageNum >= 0 && ageNum <= 125) {
      const currentYear = new Date().getFullYear();
      const ceYear = currentYear - ageNum;
      const beYear = ceYear + 543;

      const d = day || '15';
      const m = month || '06';
      setDay(d);
      setMonth(m);
      setYear(String(beYear));
      setTextInput(`${d}/${m}/${beYear}`);

      const isoString = `${ceYear}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      onChange(isoString, ageNum);
      onAgeChange?.(ageNum);
    }
  };

  const thaiMonths = [
    { num: '01', name: 'มกราคม' },
    { num: '02', name: 'กุมภาพันธ์' },
    { num: '03', name: 'มีนาคม' },
    { num: '04', name: 'เมษายน' },
    { num: '05', name: 'พฤษภาคม' },
    { num: '06', name: 'มิถุนายน' },
    { num: '07', name: 'กรกฎาคม' },
    { num: '08', name: 'สิงหาคม' },
    { num: '09', name: 'กันยายน' },
    { num: '10', name: 'ตุลาคม' },
    { num: '11', name: 'พฤศจิกายน' },
    { num: '12', name: 'ธันวาคม' },
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {manualAge && (
          <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
            อายุคำนวณได้: {manualAge} ปี
          </span>
        )}
      </div>

      {/* Direct 3-part Typing Fields: วัน / เดือน / ปี พ.ศ. */}
      <div className="grid grid-cols-12 gap-2">
        {/* วันที่ (Day) */}
        <div className="col-span-3 sm:col-span-3">
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">วัน (1-31)</label>
          <input
            type="number"
            min={1}
            max={31}
            placeholder="เช่น 15"
            value={day}
            onChange={e => {
              const val = e.target.value;
              setDay(val);
              updateDateFromParts(val, month, year);
            }}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-center focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>

        {/* เดือน (Month) */}
        <div className="col-span-5 sm:col-span-5">
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">เดือนเกิด</label>
          <select
            value={month}
            onChange={e => {
              const val = e.target.value;
              setMonth(val);
              updateDateFromParts(day, val, year);
            }}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
          >
            <option value="">-- เลือกเดือน --</option>
            {thaiMonths.map(m => (
              <option key={m.num} value={m.num}>
                {m.num} - {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* ปีเกิด (Year พ.ศ. / ค.ศ.) */}
        <div className="col-span-4 sm:col-span-4">
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            ปีเกิด (พ.ศ. หรือ ค.ศ.)
          </label>
          <input
            type="number"
            placeholder="เช่น 2495"
            value={year}
            onChange={e => {
              const val = e.target.value;
              setYear(val);
              updateDateFromParts(day, month, val);
            }}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-center text-blue-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>
      </div>

      {/* Alternative Full-Text typing box & Age box */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
        <div className="sm:col-span-2">
          <div className="relative">
            <input
              type="text"
              placeholder="พิมพ์เป็นข้อความ เช่น 15/08/2495 หรือ 2495"
              value={textInput}
              onChange={e => handleTextInputChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:border-blue-500 outline-none"
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            {helpText}
          </p>
        </div>

        {/* Direct Age adjustment */}
        <div>
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold text-slate-600">หรือระบุอายุ (ปี):</span>
          </div>
          <input
            type="number"
            min={0}
            max={120}
            placeholder="เช่น 70"
            value={manualAge}
            onChange={e => handleAgeInputChange(e.target.value)}
            className="w-full mt-0.5 p-2 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs font-black text-center text-emerald-900 focus:bg-white focus:border-emerald-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
};
