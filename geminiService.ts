
import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";
import { Message, AppSettings, PersonaType } from "../types";
import { getSystemInstruction, APP_MODELS } from "../constants";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const sendMessageToTomm = async (
  history: Message[],
  currentMessage: string,
  settings: AppSettings,
  persona: PersonaType = 'standard'
): Promise<{ text: string; audio?: string; suggestions?: string[] }> => {
  const ai = getAIClient();
  const systemInstruction = getSystemInstruction(
    settings.assistantMode,
    settings.personality,
    settings.answerStyle,
    settings.language,
    persona
  );

  const contents = history.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  contents.push({
    role: 'user',
    parts: [{ text: currentMessage }]
  });

  try {
    const modelName = persona === 'coding' || settings.assistantMode === 'coding' ? APP_MODELS.PRO : APP_MODELS.CHAT;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    let fullText = response.text || "";
    let suggestions: string[] = [];

    if (fullText.includes("SUGGESTIONS:")) {
      const parts = fullText.split("SUGGESTIONS:");
      fullText = parts[0].trim();
      suggestions = parts[1].split(",").map(s => s.trim().replace(/^"|"$/g, ''));
    }

    let audio = undefined;
    if (settings.voiceEnabled && fullText) {
      try {
        const ttsResponse = await ai.models.generateContent({
          model: APP_MODELS.TTS,
          contents: [{ parts: [{ text: fullText }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { 
                  voiceName: settings.voiceName || 'Kore' 
                },
              },
            },
          },
        });
        audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      } catch (e) {
        console.error("TTS Error", e);
      }
    }

    return { text: fullText, audio, suggestions };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Waduh, koneksi Tomm AI lagi terganggu. Coba lagi sebentar ya!" };
  }
};

export const decodeAudio = async (base64: string, ctx: AudioContext) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  const dataInt16 = new Int16Array(bytes.buffer);
  const frameCount = dataInt16.length;
  const buffer = ctx.createBuffer(1, frameCount, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
};
