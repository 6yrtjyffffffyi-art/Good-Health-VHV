import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Megaphone,
  Sparkles,
  Send,
  Eye,
  Calendar,
  User,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  PlusCircle,
  ListFilter
} from 'lucide-react';
import { VoiceReaderButton } from '../common/VoiceReaderButton';

export const VhvAnnouncementsPageView: React.FC = () => {
  const {
    currentUser,
    currentVhvProfile,
    announcements,
    publishAnnouncement,
    showToast
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'create' | 'list'>('create');

  // AI Announcement Generator Form States
  const [aiTopic, setAiTopic] = useState('การดูแลรักษาสุขภาพผู้สูงอายุในช่วงฤดูฝน');
  const [aiTargetGroup, setAiTargetGroup] = useState('ผู้สูงอายุและผู้ป่วยโรคเรื้อรัง (ความดัน/เบาหวาน)');
  const [aiDetails, setAiDetails] = useState('รักษาร่างกายให้อบอุ่น ระวังอุบัติเหตุลื่นล้มในบ้าน ดื่มน้ำอุ่น และตรวจวัดความดันโลหิตสม่ำเสมอ');
  const [aiDraftTitle, setAiDraftTitle] = useState('');
  const [aiDraftContent, setAiDraftContent] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [hasGeneratedDraft, setHasGeneratedDraft] = useState(false);

  const vhvName = currentVhvProfile
    ? `${currentVhvProfile.firstName} ${currentVhvProfile.lastName}`
    : currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : 'อสม.';

  // Quick prompt templates
  const templates = [
    {
      topic: 'ตรวจคัดกรองเบาหวานและความดันโลหิตฟรี',
      target: 'ผู้สูงอายุ 60 ปีขึ้นไปในหมู่บ้าน',
      details: 'ตรวจวัดระดับน้ำตาลในเลือด ตรวจความดันโลหิต พร้อมรับคำปรึกษาจากทีมแพทย์และ อสม. วันเสาร์นี้ ณ ศาลาประชาคม'
    },
    {
      topic: 'ระวังไข้เลือดออกและการกำจัดแหล่งเพาะพันธุ์ยุงลาย',
      target: 'ประชาชนและทุกครัวเรือนในหมู่บ้าน',
      details: 'คว่ำภาชนะที่มีน้ำขัง ใส่ทรายอะเบทในอ่างน้ำ และนอนกางมุ้งเพื่อป้องกันยุงลายกัด'
    },
    {
      topic: 'คำแนะนำการรับประทานยาและป้องกันภาวะขาดน้ำในหน้าร้อน',
      target: 'ผู้สูงอายุและผู้ดูแล',
      details: 'จิบน้ำบ่อยๆ หลีกเลี่ยงแดดจัด ทานยาตรงเวลา และสังเกตอาการวิงเวียนหน้ามืด'
    }
  ];

  // AI Draft generator call
  const handleGenerateAiDraft = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoadingAi(true);

    try {
      const res = await fetch('/api/ai/announcement-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          targetGroup: aiTargetGroup,
          keyDetails: aiDetails,
          authorName: vhvName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiDraftTitle(data.title || `ประกาศ: ${aiTopic}`);
        setAiDraftContent(data.content || '');
      } else {
        // High quality fallback draft
        setAiDraftTitle(`📢 ข่าวสารสุขภาพชุมชน: ${aiTopic}`);
        setAiDraftContent(
          `เรียน พี่น้องประชาชนและ${aiTargetGroup}ทุกท่าน\n\n` +
          `ขอแจ้งข้อมูลและคำแนะนำการดูแลสุขภาพ เรื่อง "${aiTopic}"\n\n` +
          `📌 ข้อควรปฏิบัติและรายละเอียดสำคัญ:\n` +
          `1. ${aiDetails}\n` +
          `2. หากมีอาการผิดปกติ วิงเวียน หรือไม่สบายตัว สามารถติดต่อ อสม. หรือ รพ.สต. ใกล้บ้านได้ทันที\n` +
          `3. สำหรับท่านที่มียาประจำตัว ขอให้รับประทานยาตามที่แพทย์สั่งอย่างต่อเนื่อง\n\n` +
          `ด้วยความห่วงใยจากทีม อสม. ประจำชุมชน\nผู้ประกาศ: อสม. ${vhvName}`
        );
      }
      setHasGeneratedDraft(true);
      showToast('AI ยกร่างประกาศสุขภาพเรียบร้อยแล้ว');
    } catch (err) {
      console.warn('AI generate error, using smart fallback', err);
      setAiDraftTitle(`📢 ประกาศสุขภาพ: ${aiTopic}`);
      setAiDraftContent(
        `เรียน ${aiTargetGroup}\n\nเรื่อง: ${aiTopic}\n\n` +
        `ทาง อสม. ขอแจ้งให้ทราบเกี่ยวกับ ${aiDetails}\n` +
        `หากมีข้อสงสัยหรือต้องการตรวจสุขภาพเพิ่มเติม สามารถติดต่อ อสม. ได้ตลอดเวลาครับ/ค่ะ\n\n` +
        `ผู้แจ้ง: อสม. ${vhvName}`
      );
      setHasGeneratedDraft(true);
      showToast('สร้างร่างข้อความประกาศสำเร็จ');
    } finally {
      setLoadingAi(false);
    }
  };

  const handlePublish = () => {
    const finalTitle = aiDraftTitle.trim() || `ประกาศ: ${aiTopic}`;
    const finalContent = aiDraftContent.trim() || aiDetails;

    if (!finalTitle || !finalContent) {
      showToast('กรุณากรอกหัวข้อและเนื้อหาประกาศ');
      return;
    }

    publishAnnouncement({
      title: finalTitle,
      content: finalContent,
      authorName: `อสม. ${vhvName}`,
      authorRole: 'VHV',
      category: 'health_alert',
      targetGroup: aiTargetGroup,
      isPinned: true
    });

    showToast('📢 เผยแพร่ประกาศสุขภาพสู่ชุมชนสำเร็จแล้ว');
    setActiveSubTab('list');
    setHasGeneratedDraft(false);
    setAiDraftTitle('');
    setAiDraftContent('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-100/50 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-white/15 border border-white/20 text-white backdrop-blur-xs">
            <Megaphone className="w-4 h-4 text-amber-300" />
            <span>ศูนย์กระจายข่าวสารสุขภาพชุมชน</span>
          </div>
          <span className="text-xs text-blue-200 font-medium">
            ผู้ปฏิบัติงาน: อสม. {vhvName}
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            สร้างและเผยแพร่ประกาศสุขภาพ
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 opacity-90 max-w-2xl">
            กระจายข่าวสาร สิทธิประโยชน์สุขภาพ แจ้งเตือนโรคระบาดตามฤดูกาล หรือกิจกรรมตรวจสุขภาพให้ผู้สูงอายุและคนในชุมชนรับทราบโดยตรง
          </p>
        </div>

        {/* Tab Switcher inside banner */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => setActiveSubTab('create')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'create'
                ? 'bg-white text-blue-950 shadow-md scale-102'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>สร้างประกาศใหม่ (พร้อม AI ยกร่าง)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('list')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'list'
                ? 'bg-white text-blue-950 shadow-md scale-102'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>ประกาศที่เผยแพร่แล้ว ({announcements.length})</span>
          </button>
        </div>
      </div>

      {/* CREATE ANNOUNCEMENT TAB */}
      {activeSubTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form & Prompt inputs (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-6 bg-blue-600 rounded-full inline-block" />
                กรอกข้อมูลประกาศ
              </h2>
              <span className="text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full font-bold">
                มี AI ช่วยเรียบเรียง
              </span>
            </div>

            {/* Quick Templates */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                หรือเลือกจากตัวอย่างหัวข้อยอดนิยม:
              </label>
              <div className="flex flex-wrap gap-2">
                {templates.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setAiTopic(tpl.topic);
                      setAiTargetGroup(tpl.target);
                      setAiDetails(tpl.details);
                      setHasGeneratedDraft(false);
                    }}
                    className="text-[11px] px-3 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 text-slate-600 rounded-xl font-medium transition-all text-left cursor-pointer"
                  >
                    • {tpl.topic}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleGenerateAiDraft} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  1. หัวข้อประกาศ / เรื่องที่ต้องการแจ้ง *
                </label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={e => setAiTopic(e.target.value)}
                  placeholder="เช่น ตรวจสุขภาพประจำเดือน, ข้อควรระวังไข้เลือดออก..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  2. กลุ่มเป้าหมายผู้รับข่าวสาร *
                </label>
                <input
                  type="text"
                  value={aiTargetGroup}
                  onChange={e => setAiTargetGroup(e.target.value)}
                  placeholder="เช่น ผู้สูงอายุทุกท่าน, ผู้ป่วยเบาหวาน-ความดัน, ประชาชนในหมู่บ้าน..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  3. ข้อมูลและข้อความสำคัญที่ต้องการเน้น *
                </label>
                <textarea
                  rows={4}
                  value={aiDetails}
                  onChange={e => setAiDetails(e.target.value)}
                  placeholder="พิมพ์ประเด็นสำคัญ วันที่ เวลา สถานที่ หรือคำแนะนำสุขภาพ..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                  required
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loadingAi}
                  className="flex-1 py-3.5 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 hover:opacity-95 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md shadow-blue-200 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>{loadingAi ? 'AI กำลังยกร่างข้อความ...' : 'ให้ AI ช่วยเรียบเรียงประกาศให้อัตโนมัติ'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAiDraftTitle(`ประกาศ: ${aiTopic}`);
                    setAiDraftContent(aiDetails);
                    setHasGeneratedDraft(true);
                  }}
                  className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  เขียนเองโดยตรง
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Draft Editor & Preview (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  กล่องข้อความประกาศ (แก้ไขได้)
                </h3>
                {hasGeneratedDraft && (
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    พร้อมเผยแพร่
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    หัวข้อเรื่องที่ปรากฏในแอป
                  </label>
                  <input
                    type="text"
                    value={aiDraftTitle}
                    onChange={e => setAiDraftTitle(e.target.value)}
                    placeholder={hasGeneratedDraft ? '' : 'หัวข้อจะปรากฏที่นี่หลังกด AI หรือพิมพ์เอง'}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    เนื้อหาประกาศฉบับเต็ม
                  </label>
                  <textarea
                    rows={8}
                    value={aiDraftContent}
                    onChange={e => setAiDraftContent(e.target.value)}
                    placeholder={hasGeneratedDraft ? '' : 'เนื้อหาประกาศที่ผ่านการเรียบเรียงแล้วจะแสดงที่นี่ สามารถปรับแก้คำพูดได้ตามต้องการ'}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed font-normal"
                  />
                </div>
              </div>

              {/* Publish Action Button & Draft Voice Preview */}
              <div className="pt-2 space-y-2">
                {aiDraftContent.trim() && (
                  <div className="flex items-center justify-between p-3 bg-teal-50/70 border border-teal-200 rounded-2xl">
                    <span className="text-xs font-semibold text-teal-900">
                      ลองฟังเสียงอ่านข้อความร่างก่อนเผยแพร่:
                    </span>
                    <VoiceReaderButton
                      textToRead={`${aiDraftTitle}. ${aiDraftContent}`}
                      label="ฟังเสียงร่างประกาศ"
                      size="sm"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={handlePublish}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-2xl text-sm shadow-md shadow-emerald-200 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>เผยแพร่ประกาศสู่ชุมชนทันที</span>
                </button>
                <p className="text-[11px] text-center text-slate-400 mt-2">
                  ประกาศนี้จะแสดงในหน้าประกาศของผู้สูงอายุและผู้ดูแลทุกคนในชุมชน
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PUBLISHED ANNOUNCEMENTS LIST TAB */}
      {activeSubTab === 'list' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-6 bg-purple-600 rounded-full inline-block" />
              ประกาศทั้งหมดที่เผยแพร่แล้ว ({announcements.length} รายการ)
            </h2>

            <button
              onClick={() => setActiveSubTab('create')}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ สร้างประกาศใหม่</span>
            </button>
          </div>

          {announcements.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                <Megaphone className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">ยังไม่มีประกาศในระบบ</h3>
              <p className="text-xs text-slate-500">
                คุณสามารถสร้างประกาศแรกได้ง่ายๆ โดยกดที่ปุ่ม "+ สร้างประกาศใหม่"
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {announcements.map((ann, idx) => (
                <div
                  key={ann.id || idx}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-blue-300 transition-all space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 font-bold rounded-full text-[11px]">
                          📢 ข่าวสารชุมชน
                        </span>
                        {ann.targetGroup && (
                          <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 font-medium rounded-full text-[11px] flex items-center gap-1">
                            <Users className="w-3 h-3 text-purple-600" />
                            {ann.targetGroup}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        {ann.title}
                      </h3>
                    </div>

                    <div className="text-right text-xs text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{ann.createdAt || 'เผยแพร่แล้ว'}</span>
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/70 p-4 rounded-2xl border border-slate-200/50">
                    {ann.content}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-blue-600" />
                        <span>ผู้ประกาศ: <strong className="text-slate-800">{ann.authorName}</strong></span>
                      </div>
                      <VoiceReaderButton
                        textToRead={`ประกาศเรื่อง ${ann.title}. ${ann.content}`}
                        label="ฟังเสียงประกาศ"
                        size="sm"
                      />
                    </div>

                    <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold border border-emerald-200">
                      ● เผยแพร่อยู่บนกระดานข่าว
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
