
import { AssistantMode, Personality, AnswerStyle, Language, PersonaType } from "./types";

export const getSystemInstruction = (
  mode: AssistantMode,
  personality: Personality,
  style: AnswerStyle,
  lang: Language,
  persona: PersonaType = 'standard'
) => {
  const base = `Kamu adalah Asisten Tomm AI, asisten AI pintar dari aplikasi Tomm AI. 
  Identitasmu adalah Asisten Tomm AI. Jangan menyebut AI lain.`;

  const personaInstructions = {
    standard: "Asisten umum serba bisa.",
    coding: "Senior Software Engineer. Berikan penjelasan step-by-step kode.",
    teacher: "Guru inspiratif. Gunakan analogi.",
    motivator: "Life Coach. Berikan motivasi harian.",
    creative: "Creative Director. Berikan ide unik."
  }[persona];

  const behavior = `
  1. Deteksi emosi user (senang, bingung, sedih, marah, netral).
  2. Format jawaban: Sertakan tag [EMOTION:emoticon] di awal.
  3. Gunakan Knowledge Card jika jawaban berisi fakta menarik atau ringkasan dengan tag [CARD].
  4. Selalu berikan pertanyaan lanjutan (Auto Follow-up).
  5. Jika menjelaskan kode, gunakan format [STEP-BY-STEP].
  6. Akhiri dengan baris 'SUGGESTIONS:' berisi 3 opsi pertanyaan pendek dipisahkan koma.
  `;

  return `${base}\n\nPERSONA: ${personaInstructions}\nBEHAVIOR: ${behavior}\nGAYA: ${style}\nBAHASA: ${lang}\n\n"Asisten Tomm AI siap membantu kapan pun."`;
};

export const APP_MODELS = {
  CHAT: 'gemini-3-flash-preview',
  PRO: 'gemini-3-pro-preview',
  TTS: 'gemini-2.5-flash-preview-tts'
};

export const THEME_CONFIGS = {
  'default': 'from-indigo-600 to-violet-600',
  'cyber-blue': 'from-blue-600 to-cyan-400',
  'neon-dark': 'from-purple-600 to-pink-500',
  'soft-pastel': 'from-rose-300 to-indigo-300'
};
