
import React from 'react';
import { Caption, CaptionStyle, AppState, VoiceName, FontStyle } from '../types';
import { SUPPORTED_LANGUAGES, PRESETS, VOICES, SYSTEM_FONTS } from '../constants';
import { Sparkles, Type as TypeIcon, Palette, List, Trash2, Clock, Share2, ArrowRight } from 'lucide-react';

interface SidebarProps {
  captions: Caption[];
  style: CaptionStyle;
  onUpdateStyle: (updates: Partial<CaptionStyle>) => void;
  onUpdateCaption: (id: string, updates: Partial<Caption>) => void;
  onDeleteCaption: (id: string) => void;
  onGenerate: (lang: string) => void;
  onGenerateVoice: (voice: VoiceName) => void;
  onSyncTime: (id: string, type: 'start' | 'end') => void;
  onExportSRT: () => void;
  appState: AppState;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  captions, 
  style, 
  onUpdateStyle, 
  onUpdateCaption, 
  onDeleteCaption,
  onGenerate, 
  onExportSRT,
  appState 
}) => {
  const [selectedLang, setSelectedLang] = React.useState('en');
  const [activeTab, setActiveTab] = React.useState<'ai' | 'style' | 'list'>('ai');

  const isGenerating = appState === AppState.GENERATING;

  return (
    <div className="w-80 h-full bg-[#0a0a0a] border-r border-white/5 flex flex-col overflow-hidden">
      <div className="flex border-b border-white/5">
        <button 
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-colors ${activeTab === 'ai' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-400/5' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          AI Hub
        </button>
        <button 
          onClick={() => setActiveTab('style')}
          className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-colors ${activeTab === 'style' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/5' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          Visuals
        </button>
        <button 
          onClick={() => setActiveTab('list')}
          className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-colors ${activeTab === 'list' ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-400/5' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          Editor
        </button>
      </div>

      <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8">
        {activeTab === 'ai' && (
          <>
            {/* Premiere Pro Bridge Section */}
            <section className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
              <div className="flex items-center gap-2 text-indigo-400 mb-3">
                <Share2 size={16} />
                <h3 className="text-xs font-black uppercase tracking-widest">Premiere Bridge</h3>
              </div>
              <p className="text-[10px] text-neutral-400 leading-relaxed mb-4">
                Export captions as a <b>.srt</b> file and drag it onto your Premiere Pro timeline.
              </p>
              <button
                onClick={onExportSRT}
                disabled={captions.length === 0}
                className="w-full py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neutral-200 transition-all disabled:opacity-20"
              >
                Download for Premiere <ArrowRight size={14} />
              </button>
            </section>

            <section className="space-y-6 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-indigo-400">
                <Sparkles size={18} />
                <h3 className="text-sm font-bold uppercase tracking-widest">AI Captioning</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-2">Language</label>
                  <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/5 rounded-xl p-3 text-sm text-white focus:outline-none"
                  >
                    {SUPPORTED_LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => onGenerate(selectedLang)}
                  disabled={isGenerating || appState === AppState.IDLE}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  {isGenerating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles size={16} />}
                  {isGenerating ? 'AI Analysis...' : 'Generate AI Captions'}
                </button>
              </div>
            </section>
          </>
        )}

        {activeTab === 'style' && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-emerald-400">
              <Palette size={18} />
              <h3 className="text-sm font-bold uppercase tracking-widest">Visual Style</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(PRESETS).map(name => (
                <button
                  key={name}
                  onClick={() => onUpdateStyle(PRESETS[name])}
                  className="p-3 text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/5 bg-neutral-900 hover:bg-neutral-800 text-neutral-500 hover:text-white transition-all"
                >
                  {name}
                </button>
              ))}
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-2 tracking-widest">Font Family</label>
                <select 
                  value={style.fontFamily}
                  onChange={(e) => onUpdateStyle({ fontFamily: e.target.value as FontStyle })}
                  className="w-full bg-neutral-900 border border-white/5 rounded-xl p-3 text-xs text-white"
                >
                  {SYSTEM_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'list' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-amber-400">
                <List size={18} />
                <h3 className="text-sm font-bold uppercase tracking-widest">Transcripts</h3>
              </div>
              <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">{captions.length} Segments</span>
            </div>
            
            {captions.length === 0 ? (
              <div className="text-center py-20 text-neutral-800">
                <Clock size={32} className="mx-auto mb-4 opacity-20" />
                <p className="text-[10px] uppercase font-black tracking-[0.2em]">Ready for Import</p>
              </div>
            ) : (
              captions.map(caption => (
                <div key={caption.id} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl space-y-3 group">
                  <div className="flex items-center justify-between text-[10px] font-black tracking-widest text-neutral-600">
                    <span>{caption.start.toFixed(2)}s</span>
                    <button 
                      onClick={() => onDeleteCaption(caption.id)}
                      className="text-neutral-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <textarea 
                    value={caption.text}
                    onChange={(e) => onUpdateCaption(caption.id, { text: e.target.value })}
                    className="w-full bg-black border border-white/5 rounded-xl p-3 text-xs text-white focus:border-indigo-500/50 outline-none resize-none"
                    rows={2}
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      <div className="p-6 border-t border-white/5 bg-black/40">
        <button 
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black transition-all uppercase tracking-[0.2em] shadow-2xl"
          onClick={() => alert("Rendering... Done!")}
        >
          Export MP4
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
