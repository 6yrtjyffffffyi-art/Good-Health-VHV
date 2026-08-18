import React, { useState } from 'react';
import { VitalSignRecord } from '../../types';
import { Sparkles, AlertTriangle, ChevronRight, Activity, Heart, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface AiVitalSignsAnalysisCardProps {
  records: VitalSignRecord[];
  patientName?: string;
}

export const AiVitalSignsAnalysisCard: React.FC<AiVitalSignsAnalysisCardProps> = ({ records, patientName }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!records || records.length === 0) {
    return null;
  }

  // Analyze records trends
  const recentRecords = [...records].slice(0, 5);
  const latest = recentRecords[0];

  const highSystolicCount = recentRecords.filter(r => r.systolic >= 140).length;
  const highDiastolicCount = recentRecords.filter(r => r.diastolic >= 90).length;
  const isHypertensionAlert = highSystolicCount >= 2 || highDiastolicCount >= 2 || (latest && (latest.systolic >= 140 || latest.diastolic >= 90));

  const avgSys = Math.round(recentRecords.reduce((a, b) => a + b.systolic, 0) / recentRecords.length);
  const avgDia = Math.round(recentRecords.reduce((a, b) => a + b.diastolic, 0) / recentRecords.length);

  let statusLevel: 'normal' | 'caution' | 'warning' = 'normal';
  let title = 'แนวโน้มสัญญาณชีพอยู่ในเกณฑ์ปกติ';
  let message = `ค่าความดันโลหิตเฉลี่ยล่าสุดอยู่ที่ ${avgSys}/${avgDia} mmHg อยู่ในระดับที่ควบคุมได้ดี แนะนำให้บันทึกและทานยาตามแพทย์สั่งอย่างต่อเนื่อง`;

  if (isHypertensionAlert) {
    statusLevel = 'warning';
    title = 'ตรวจพบแนวโน้มความดันโลหิตสูงกว่าเกณฑ์';
    message = `จากการวิเคราะห์ 5 ครั้งล่าสุด พบค่าความดันโลหิตเกิน 140/90 mmHg จำนวน ${Math.max(highSystolicCount, highDiastolicCount)} ครั้ง (ล่าสุด ${latest.systolic}/${latest.diastolic} mmHg) แนะนำให้พักผ่อน งดอาหารรสเค็ม และแจ้ง อสม. หรือปรึกษาแพทย์ประจำ รพ.สต.`;
  } else if (avgSys >= 130 || avgDia >= 85) {
    statusLevel = 'caution';
    title = 'ค่าความดันโลหิตอยู่ในเกณฑ์เฝ้าระวัง (Pre-hypertension)';
    message = `ค่าความดันโลหิตเฉลี่ย (${avgSys}/${avgDia} mmHg) เริ่มมีแนวโน้มสูงขึ้นเล็กน้อย แนะนำให้ออกกำลังกายเบาๆ ลดความเครียด และวัดซ้ำเป็นประจำ`;
  }

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-indigo-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-indigo-800 uppercase tracking-wide flex items-center gap-1">
              AI วิเคราะห์แนวโน้มสัญญาณชีพ {patientName ? `(คุณ${patientName})` : ''}
            </span>
            <h4 className="text-sm sm:text-base font-bold text-slate-900">{title}</h4>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-100 cursor-pointer"
        >
          {isExpanded ? 'ย่อข้อความ' : 'ดูรายละเอียด'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-3 pt-1">
          <div
            className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
              statusLevel === 'warning'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : statusLevel === 'caution'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {statusLevel === 'warning' ? (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <p>{message}</p>
            </div>
          </div>

          {/* Mandatory Red Disclaimer Warning per user request */}
          <div className="p-3 bg-red-50/80 border border-red-200 rounded-2xl flex items-start gap-2 text-red-600 font-semibold text-xs leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>
              ⚠️ คำเตือน: ระบบ AI อาจประมวลผลหรือวิเคราะห์ผิดพลาดได้ ข้อมูลนี้เป็นเพียงคำแนะนำเบื้องต้นเท่านั้น ห้ามใช้แทนการวินิจฉัยทางการแพทย์ หากมีอาการผิดปกติรุนแรงโปรดพบแพทย์ทันที
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
