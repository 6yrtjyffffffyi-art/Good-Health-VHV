import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface VoiceReaderButtonProps {
  textToRead: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  forceShow?: boolean;
}

export const VoiceReaderButton: React.FC<VoiceReaderButtonProps> = ({
  textToRead,
  label = 'ฟังเสียงอ่าน',
  size = 'md',
  className = '',
  forceShow = false,
}) => {
  const { voiceReaderEnabled } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
      setIsSupported(false);
    }
  }, []);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isSupported || (!voiceReaderEnabled && !forceShow)) {
    return null;
  }

  const handleToggleSpeech = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSupported) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any other ongoing speech

    // Clean text by stripping extra symbols for natural Thai speech
    const cleanText = textToRead
      .replace(/[#*•_~`]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'th-TH';
    utterance.rate = 0.9; // Natural pace for Thai speech
    utterance.pitch = 1.0;

    // Try to find a Thai voice if available
    const voices = window.speechSynthesis.getVoices();
    const thaiVoice = voices.find(v => v.lang.includes('th') || v.name.toLowerCase().includes('thai'));
    if (thaiVoice) {
      utterance.voice = thaiVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-2 text-xs sm:text-sm gap-2',
    lg: 'px-4 py-2.5 text-sm font-bold gap-2',
  };

  return (
    <button
      type="button"
      onClick={handleToggleSpeech}
      className={`inline-flex items-center rounded-2xl font-bold transition-all cursor-pointer shadow-xs ${
        sizeClasses[size]
      } ${
        isPlaying
          ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse shadow-md shadow-amber-200'
          : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200'
      } ${className}`}
      title={isPlaying ? 'หยุดการอ่านออกเสียง' : 'กดเพื่อให้ระบบอ่านออกเสียง'}
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-4 h-4 text-white" />
          <span>{isPlaying ? 'กำลังอ่าน (กดเพื่อหยุด)' : label}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-teal-700" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
