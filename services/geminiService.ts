
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Caption, VoiceName } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  /**
   * High-Performance Mac-optimized Base64 Encoder
   * Uses memory-safe chunks to handle videos up to 200MB without tab crashes.
   */
  private async fileToRawBase64(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    const len = bytes.byteLength;
    const chunkSize = 16384; // Doubled chunk size for Mac power

    for (let i = 0; i < len; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, chunk as any);
    }
    
    const base64 = btoa(binary);
    // Explicitly nullify for memory recovery
    (bytes as any) = null;
    (arrayBuffer as any) = null;
    return base64;
  }

  async generateCaptions(videoFile: File, targetLanguage: string): Promise<Caption[]> {
    let pureBase64: string | null = await this.fileToRawBase64(videoFile);

    const languageInstruction = targetLanguage === 'hi-en' 
      ? "Hinglish (Hindi written in Roman script). Use trendy, conversational Hinglish (e.g., 'Gazab content hai bhai!', 'Check out karo'). Suitable for Instagram Reels." 
      : targetLanguage;

    try {
      const aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const response = await aiClient.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              {
                inlineData: {
                  data: pureBase64,
                  mimeType: videoFile.type
                }
              },
              {
                text: `TRANSCRIPTION PIPELINE:
                1. Language: ${languageInstruction}.
                2. Structure: JSON array of objects.
                3. Rules: Max 4 words per segment. High-impact phrasing. No emojis unless requested.
                4. Keys: "start", "end", "text".`
              }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                start: { type: Type.NUMBER },
                end: { type: Type.NUMBER },
                text: { type: Type.STRING }
              },
              required: ["start", "end", "text"]
            }
          }
        }
      });

      pureBase64 = null; // Instant release for Mac memory

      const text = response.text || '[]';
      const result = JSON.parse(text);
      
      return result.map((cap: any, index: number) => ({
        ...cap,
        id: `cap-${Date.now()}-${index}`
      }));
    } catch (error: any) {
      pureBase64 = null;
      console.error("Pipeline Breakdown:", error);
      throw new Error("Mac Pipeline Error: The AI engine was overwhelmed. Try a 30-60 second clip first.");
    }
  }

  async generateSpeech(text: string, voice: VoiceName): Promise<string> {
    const aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Narrate with emotion: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("Dubbing failed.");
    return base64Audio;
  }
}

export const geminiService = new GeminiService();
