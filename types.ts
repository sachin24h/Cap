
export interface Caption {
  id: string;
  start: number; // in seconds
  end: number;   // in seconds
  text: string;
}

export type FontStyle = string; // Now allowing any system font string

export interface CaptionStyle {
  fontSize: number;
  color: string;
  backgroundColor: string;
  backgroundOpacity: number;
  borderRadius: number; // in px
  padding: number; // in px
  positionY: number; // 0 to 100% from top
  fontWeight: 'normal' | 'bold' | 'extra-bold';
  fontFamily: FontStyle;
  textAlign: 'left' | 'center' | 'right';
  shadow: boolean;
  border: boolean;
  uppercase: boolean;
  letterSpacing: number;
  lineHeight: number;
  glow: boolean;
  maxWordsPerLine: number;
  multiLine: boolean;
}

export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  GENERATING = 'GENERATING',
  GENERATING_VOICE = 'GENERATING_VOICE',
  EDITING = 'EDITING'
}

export type VoiceName = 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';
