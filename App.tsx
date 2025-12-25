
import React, { useState, useRef, useEffect } from 'react';
import { AppState, Caption, CaptionStyle, VoiceName } from './types';
import { DEFAULT_STYLE } from './constants';
import { geminiService } from './services/geminiService';
import Sidebar from './components/Sidebar';
import VideoPlayer from './components/VideoPlayer';
import Timeline from './components/Timeline';
import { 
  Upload, Video, AlertCircle, Play, CheckCircle2, 
  Loader2, Zap, Cpu, Settings, Monitor, Download, 
  ArrowRight, X, MousePointer2, Command, LayoutGrid, Compass, Share,
  ChevronRight, Laptop, AppWindow
} from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>(DEFAULT_STYLE);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Detect if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (!isStandalone) {
      setShowInstallPrompt(true);
    }

    if (videoUrl) {
      const v = document.createElement('video');
      v.src = videoUrl;
      v.onloadedmetadata = () => {
        if (!isNaN(v.duration) && v.duration > 0) setDuration(v.duration);
      };
      return () => URL.revokeObjectURL(videoUrl);
    }
  }, [videoUrl]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setError('Please upload a valid video file.');
        return;
      }
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setAppState(AppState.EDITING);
      setError(null);
    }
  };

  const handleGenerateCaptions = async (language: string) => {
    if (!videoFile) return;
    setAppState(AppState.GENERATING);
    setError(null);
    try {
      const generated = await geminiService.generateCaptions(videoFile, language);
      setCaptions(generated);
      setAppState(AppState.EDITING);
    } catch (err: any) {
      setError(err.message || 'AI Pipeline Error.');
      setAppState(AppState.EDITING);
    }
  };

  const handleExportSRT = () => {
    if (captions.length === 0) return;
    
    const formatTime = (seconds: number) => {
      const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
      const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
      const s = Math.floor(seconds % 60).toString().padStart(2, '0');
      const ms = Math.floor((seconds % 1) * 1000).toString().padStart(3, '0');
      return `${h}:${m}:${s},${ms}`;
    };

    let srtContent = '';
    captions.forEach((cap, i) => {
      srtContent += `${i + 1}\n`;
      srtContent += `${formatTime(cap.start)} --> ${formatTime(cap.end)}\n`;
      srtContent += `${cap.text}\n\n`;
    });

    const blob = new Blob([srtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Premiere_Captions.srt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateCaption = (id: string, updates: Partial<Caption>) => {
    setCaptions(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c).sort((a,b) => a.start - b.start));
  };

  const seekTo = (time: number) => {
    const video = document.querySelector('video');
    if (video) {
      video.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#050505] text-[#f5f5f7] overflow-hidden selection:bg-indigo-500/40">
      
      {/* MAC NATIVE INSTALLER UI */}
      {showInstallPrompt && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-4xl w-full bg-[#1e1e1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]">
             {/* Mac Window Header */}
             <div className="h-10 bg-[#323232] flex items-center px-4 justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="text-[11px] font-medium text-neutral-400">CapGenius_Installer.dmg</span>
                <div className="w-12" />
             </div>

             <div className="flex-1 flex bg-[#1e1e1e] relative">
                {/* Visual "Copy to Applications" Simulation */}
                <div className="flex-1 flex flex-col items-center justify-center p-12 border-r border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
                   <div className="flex items-center gap-12 mb-12">
                      <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl">
                        <Video size={48} className="text-white" />
                      </div>
                      <ChevronRight size={32} className="text-neutral-700 animate-pulse" />
                      <div className="w-24 h-24 bg-neutral-800 rounded-3xl flex items-center justify-center border border-white/10 shadow-inner">
                        <LayoutGrid size={48} className="text-neutral-600" />
                      </div>
                   </div>
                   <h2 className="text-xl font-bold text-white mb-2">Install to Mac Applications</h2>
                   <p className="text-neutral-500 text-xs text-center max-w-xs leading-relaxed">
                     To turn this into a native Mac App, follow the steps on the right. No code needed.
                   </p>
                </div>

                {/* Instructions Panel */}
                <div className="w-96 p-8 flex flex-col gap-6 bg-black/20">
                   <div>
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-4">Choose your browser</h3>
                      
                      <div className="space-y-3">
                         <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex items-center gap-3 mb-2">
                               <Compass size={16} className="text-blue-400" />
                               <span className="text-sm font-bold">Safari (Recommended)</span>
                            </div>
                            <p className="text-[11px] text-neutral-400">Click <b>File</b> &gt; <b>Add to Dock...</b> and press Add.</p>
                         </div>

                         <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex items-center gap-3 mb-2">
                               <Laptop size={16} className="text-orange-400" />
                               <span className="text-sm font-bold">Chrome / Edge</span>
                            </div>
                            <p className="text-[11px] text-neutral-400">Click <b>Settings (⋮)</b> &gt; <b>Save and Share</b> &gt; <b>Install...</b></p>
                         </div>
                      </div>
                   </div>

                   <button 
                    onClick={() => setShowInstallPrompt(false)}
                    className="mt-auto w-full py-4 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors"
                   >
                     Continue in Browser
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      <Sidebar 
        captions={captions}
        style={captionStyle} 
        onUpdateStyle={(updates) => setCaptionStyle(prev => ({ ...prev, ...updates }))}
        onUpdateCaption={updateCaption}
        onDeleteCaption={(id) => setCaptions(prev => prev.filter(c => c.id !== id))}
        onSyncTime={(id, type) => updateCaption(id, { [type]: currentTime })}
        onGenerate={handleGenerateCaptions}
        onGenerateVoice={() => {}}
        onExportSRT={handleExportSRT}
        appState={appState}
      />

      <main className="flex-1 flex flex-col h-full bg-black relative">
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#0a0a0a]/80 backdrop-blur-xl z-50">
          <div className="flex items-center gap-6">
            <div className="flex gap-2 mr-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-xl">
                <Video size={14} />
              </div>
              <h1 className="font-black text-[11px] tracking-widest uppercase text-white/90">CapGenius <span className="text-indigo-500">v2.1</span></h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-white/5 rounded-lg text-[9px] font-bold text-neutral-400">
                <AppWindow size={12} className="text-indigo-400" />
                <span>MAC_OS_STANDALONE: ACTIVE</span>
             </div>
             <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-1.5 bg-white text-black rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
             >
                <Upload size={14} />
                Import Video
             </button>
             <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
          </div>
        </header>

        <div className="flex-1 flex flex-col overflow-hidden relative">
          {appState === AppState.GENERATING && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl z-[60] flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 relative mb-8">
                <div className="absolute inset-0 border-4 border-indigo-500 rounded-full animate-ping opacity-20" />
                <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap size={32} className="text-indigo-400 animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter italic">AI Transcription Engine</h2>
              <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">
                Optimized for Apple M-Series
              </p>
            </div>
          )}

          <div className="flex-1 flex flex-col bg-[#050505] relative overflow-hidden">
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <div className="w-full max-w-5xl z-10">
                {videoUrl ? (
                  <VideoPlayer 
                    videoUrl={videoUrl} captions={captions} style={captionStyle}
                    currentTime={currentTime} onTimeUpdate={setCurrentTime}
                  />
                ) : (
                  <div className="text-center p-28 border border-white/5 rounded-[4rem] bg-white/[0.01] shadow-2xl group transition-all hover:bg-white/[0.03]">
                    <div className="w-24 h-24 bg-indigo-600/10 rounded-3xl flex items-center justify-center text-indigo-400 mx-auto mb-8 border border-indigo-500/20 group-hover:scale-110 transition-transform shadow-2xl">
                      <Video size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase italic">Professional Workstation</h2>
                    <p className="text-neutral-500 max-w-xs mx-auto text-[10px] font-bold uppercase tracking-[0.2em] leading-loose mb-10 opacity-60">
                      Upload video to generate captions and export to Premiere Pro (.srt)
                    </p>
                    <button 
                      onClick={() => fileInputRef.current?.click()} 
                      className="px-14 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-neutral-200 active:scale-95 transition-all"
                    >
                      Open Video File
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {videoUrl && duration > 0 && (
            <Timeline 
              captions={captions} 
              duration={duration} 
              currentTime={currentTime}
              onUpdateCaption={updateCaption}
              onSeek={seekTo}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
