
import React, { useRef, useEffect, useState } from 'react';
import { Caption, CaptionStyle } from '../types';

interface VideoPlayerProps {
  videoUrl: string | null;
  captions: Caption[];
  style: CaptionStyle;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  captions, 
  style, 
  currentTime, 
  onTimeUpdate 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeCaption, setActiveCaption] = useState<Caption | null>(null);

  useEffect(() => {
    const current = captions.find(c => currentTime >= c.start && currentTime <= c.end);
    setActiveCaption(current || null);
  }, [currentTime, captions]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      onTimeUpdate(videoRef.current.currentTime);
    }
  };

  if (!videoUrl) {
    return (
      <div className="w-full aspect-video bg-neutral-900 flex items-center justify-center rounded-2xl border border-neutral-800 shadow-inner">
        <div className="text-center">
          <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-neutral-700">
            <svg className="w-8 h-8 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="text-neutral-400 font-medium">No Video Loaded</p>
          <p className="text-neutral-600 text-sm mt-1">Upload a file to start editing</p>
        </div>
      </div>
    );
  }

  const getCaptionStyles = (): React.CSSProperties => {
    const r = parseInt(style.backgroundColor.slice(1,3), 16);
    const g = parseInt(style.backgroundColor.slice(3,5), 16);
    const b = parseInt(style.backgroundColor.slice(5,7), 16);
    
    return {
      fontSize: `${style.fontSize}px`,
      color: style.color,
      backgroundColor: `rgba(${r}, ${g}, ${b}, ${style.backgroundOpacity})`,
      top: `${style.positionY}%`,
      fontWeight: style.fontWeight === 'extra-bold' ? 900 : style.fontWeight,
      fontFamily: style.fontFamily,
      textAlign: style.textAlign,
      textShadow: style.shadow 
        ? `2px 2px 4px rgba(0,0,0,0.8)${style.glow ? `, 0 0 20px ${style.color}` : ''}`
        : style.glow ? `0 0 15px ${style.color}` : 'none',
      border: style.border ? `2px solid ${style.color}` : 'none',
      textTransform: style.uppercase ? 'uppercase' : 'none',
      letterSpacing: `${style.letterSpacing}px`,
      lineHeight: style.lineHeight,
      padding: `${style.padding}px`,
      borderRadius: `${style.borderRadius}px`,
      maxWidth: '85%',
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      pointerEvents: 'none',
      transition: 'all 0.1s ease-out',
      zIndex: 50,
      wordWrap: 'break-word',
      display: 'inline-block'
    };
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden group shadow-2xl border border-neutral-800 ring-1 ring-white/5">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        controls
      />
      
      {activeCaption && (
        <div className="absolute inset-0 flex flex-col pointer-events-none">
          <div style={getCaptionStyles()}>
            {activeCaption.text}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
