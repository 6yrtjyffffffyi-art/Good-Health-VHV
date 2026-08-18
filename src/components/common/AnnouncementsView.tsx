import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Megaphone, Search, Calendar, ShieldCheck, UserCheck } from 'lucide-react';
import { VoiceReaderButton } from './VoiceReaderButton';

export const AnnouncementsView: React.FC = () => {
  const { announcements } = useApp();
  const [query, setQuery] = useState('');

  const filtered = announcements.filter(
    a => a.title.includes(query) || a.content.includes(query) || ((a as any).targetGroup && (a as any).targetGroup.includes(query))
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-100 space-y-3">
        <div className="flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-amber-300 animate-bounce" />
          <h2 className="text-2xl font-bold">ประกาศและข่าวสารสาธารณสุขชุมชน</h2>
        </div>
        <p className="text-xs sm:text-sm text-blue-100 leading-relaxed opacity-90">
          รับทราบข้อมูลการดูแลสุขภาพ คำแนะนำ และข่าวสารกิจกรรมจาก อสม. ประจำหมู่บ้าน
        </p>

        {/* Search */}
        <div className="relative pt-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-5" />
          <input
            type="text"
            placeholder="ค้นหาประกาศตามหัวข้อ หรือเนื้อหา..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white text-slate-900 rounded-2xl text-xs font-medium placeholder-slate-400 shadow-inner"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
            ไม่พบประกาศที่ตรงกับคำค้นหา
          </div>
        ) : (
          filtered.map(ann => (
            <div
              key={ann.id}
              className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3 hover:border-teal-300 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full">
                  กลุ่มเป้าหมาย: {(ann as any).targetGroup || 'ทุกคนในชุมชน'}
                </span>
                <div className="flex items-center gap-2">
                  <VoiceReaderButton
                    textToRead={`ประกาศเรื่อง ${ann.title} โดย ${ann.authorName} วันที่ ${ann.date} รายละเอียด ${ann.content}`}
                    size="sm"
                    label="ฟังประกาศ"
                  />
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {ann.date}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900">{ann.title}</h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {ann.content}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-teal-800">ผู้ออกประกาศ: {ann.authorName}</span>
                <span className="text-[11px] text-slate-400">ระบบสุขภาพชุมชน อสม.</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
