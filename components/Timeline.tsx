
import React, { useRef, useState } from 'react';
import { Caption } from '../types';

interface TimelineProps {
  captions: Caption[];
  duration: number;
  currentTime: number;
  onUpdateCaption: (id: string, updates: Partial<Caption>) => void;
  onSeek: (time: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({ captions, duration, currentTime, onUpdateCaption, onSeek }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<{ id: string; type: 'move' | 'start' | 'end' } | null>(null);

  // Pixels per second
  const zoom = 60;

  const handlePointerDown = (e: React.PointerEvent, id: string, type: 'move' | 'start' | 'end') => {
    e.stopPropagation();
    setIsDragging({ id, type });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const scrollLeft = containerRef.current.scrollLeft;
    const x = e.clientX - rect.left + scrollLeft;
    const time = Math.max(0, Math.min(duration, x / zoom));

    const caption = captions.find(c => c.id === isDragging.id);
    if (!caption) return;

    if (isDragging.type === 'start') {
      onUpdateCaption(caption.id, { start: Math.min(time, caption.end - 0.1) });
    } else if (isDragging.type === 'end') {
      onUpdateCaption(caption.id, { end: Math.max(time, caption.start + 0.1) });
    } else if (isDragging.type === 'move') {
      const diff = caption.end - caption.start;
      const newStart = Math.max(0, Math.min(duration - diff, time));
      onUpdateCaption(caption.id, { 
        start: newStart, 
        end: newStart + diff 
      });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(null);
  };

  const handleClickTimeline = (e: React.MouseEvent) => {
    if (!containerRef.current || isDragging) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + containerRef.current.scrollLeft;
    onSeek(Math.min(duration, x / zoom));
  };

  return (
    <div className="w-full bg-neutral-900 border-t border-neutral-800 h-48 flex flex-col relative overflow-hidden z-40">
      {/* Header / Info bar */}
      <div className="h-8 bg-neutral-950 flex items-center justify-between px-4 border-b border-neutral-800 select-none">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Timeline</span>
          <div className="h-3 w-px bg-neutral-800" />
          <span className="text-[10px] font-mono text-neutral-500">
            {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(2).padStart(5, '0')} / {Math.floor(duration / 60)}:{(duration % 60).toFixed(2).padStart(5, '0')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-bold uppercase text-neutral-500 tracking-tighter">Text Layer Active</span>
        </div>
      </div>
      
      {/* Scrollable Track Area */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar relative bg-neutral-950/20"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleClickTimeline}
      >
        <div 
          className="relative h-full" 
          style={{ width: `${duration * zoom}px`, minWidth: '100%' }}
        >
          {/* Track Labels Background */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-neutral-900/80 border-r border-neutral-800 z-30 pointer-events-none flex flex-col">
            <div className="h-10 flex items-center px-3 border-b border-neutral-800/50">
              <span className="text-[8px] font-bold text-neutral-500 uppercase">Ruler</span>
            </div>
            <div className="flex-1 flex items-center px-3">
              <span className="text-[8px] font-bold text-indigo-400 uppercase">Text Layer</span>
            </div>
          </div>

          {/* Time Rulers */}
          <div className="h-10 relative border-b border-neutral-800/50">
            {Array.from({ length: Math.ceil(duration) }).map((_, i) => (
              <div 
                key={i} 
                className="absolute top-0 bottom-0 border-l border-neutral-800/30"
                style={{ left: `${i * zoom}px` }}
              >
                <span className="text-[8px] text-neutral-600 pl-1 pt-1 block">{i}s</span>
              </div>
            ))}
          </div>

          {/* Caption Track Area */}
          <div className="relative flex-1 h-32">
            {captions.map(caption => {
              const isActive = currentTime >= caption.start && currentTime <= caption.end;
              return (
                <div
                  key={caption.id}
                  className={`absolute top-6 h-14 rounded-lg flex items-center justify-center px-4 select-none cursor-move transition-all duration-200 border ring-1 ring-white/5 ${
                    isActive 
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl shadow-indigo-600/30 scale-[1.02] z-20' 
                    : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700 hover:border-neutral-600 z-10'
                  }`}
                  style={{ 
                    left: `${caption.start * zoom}px`, 
                    width: `${(caption.end - caption.start) * zoom}px`
                  }}
                  onPointerDown={(e) => handlePointerDown(e, caption.id, 'move')}
                >
                  <span className="text-[10px] font-bold truncate max-w-full pointer-events-none">
                    {caption.text}
                  </span>

                  {/* Left Resize Handle */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-3 cursor-ew-resize flex items-center justify-center group/h"
                    onPointerDown={(e) => handlePointerDown(e, caption.id, 'start')}
                  >
                    <div className="w-1 h-6 bg-white/20 rounded-full group-hover/h:bg-white/50 transition-colors" />
                  </div>
                  
                  {/* Right Resize Handle */}
                  <div 
                    className="absolute right-0 top-0 bottom-0 w-3 cursor-ew-resize flex items-center justify-center group/h"
                    onPointerDown={(e) => handlePointerDown(e, caption.id, 'end')}
                  >
                    <div className="w-1 h-6 bg-white/20 rounded-full group-hover/h:bg-white/50 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Playhead */}
          <div 
            className="absolute top-0 bottom-0 w-px bg-red-500 z-40 pointer-events-none transition-transform"
            style={{ left: `${currentTime * zoom}px` }}
          >
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg" />
            <div className="absolute top-0 bottom-0 left-[-1px] w-[3px] bg-red-500/30" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
