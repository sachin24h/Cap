
import { CaptionStyle, VoiceName } from './types';

export const DEFAULT_STYLE: CaptionStyle = {
  fontSize: 28,
  color: '#ffffff',
  backgroundColor: '#000000',
  backgroundOpacity: 0.6,
  borderRadius: 8,
  padding: 12,
  positionY: 85,
  fontWeight: 'bold',
  fontFamily: 'system-ui',
  textAlign: 'center',
  shadow: true,
  border: false,
  uppercase: false,
  letterSpacing: 0,
  lineHeight: 1.2,
  glow: false,
  maxWordsPerLine: 5,
  multiLine: true
};

export const PRESETS: Record<string, Partial<CaptionStyle>> = {
  'Cinematic': {
    fontFamily: 'Georgia',
    fontWeight: 'normal',
    uppercase: true,
    letterSpacing: 2,
    backgroundColor: 'transparent',
    shadow: true,
    fontSize: 22,
    positionY: 90
  },
  'Modern Bold': {
    fontFamily: 'Impact',
    fontWeight: 'bold',
    uppercase: true,
    fontSize: 42,
    backgroundColor: '#ffcc00',
    color: '#000000',
    backgroundOpacity: 1,
    borderRadius: 4,
    padding: 16,
    positionY: 80
  },
  'Minimalist': {
    fontFamily: 'Helvetica',
    fontWeight: 'normal',
    fontSize: 24,
    backgroundColor: 'transparent',
    color: '#ffffff',
    shadow: false,
    border: false,
    positionY: 85
  },
  'Reels Pro': {
    fontFamily: 'Arial Black',
    fontWeight: 'extra-bold',
    fontSize: 36,
    color: '#ffffff',
    backgroundColor: '#6366f1',
    backgroundOpacity: 1,
    borderRadius: 16,
    padding: 20,
    glow: true,
    positionY: 75
  }
};

export const SYSTEM_FONTS = [
  'system-ui', 'Inter', 'Bebas Neue', 'Impact', 'Arial Black', 'Helvetica', 'Georgia', 'Courier New', 'Roboto Mono', 'Lexend', 'Montserrat'
];

export const VOICES: { name: VoiceName; desc: string }[] = [
  { name: 'Kore', desc: 'Professional & Direct' },
  { name: 'Puck', desc: 'Friendly & Casual' },
  { name: 'Charon', desc: 'Deep & Authoritative' },
  { name: 'Fenrir', desc: 'Warm & Calming' },
  { name: 'Zephyr', desc: 'Fast & Energetic' }
];

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi-en', name: 'Hinglish (Roman Script)' },
  { code: 'hi', name: 'Hindi (हिंदी)' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' }
];
