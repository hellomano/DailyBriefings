import { GoogleGenAI, Modality } from "@google/genai";
import type { ServiceKey, CoachingSession } from '../types';

const buildPrompt = (services: ServiceKey[]): string => {
  const includeCalendar = services.includes('calendar');
  const includeDating = services.some(s => ['hinge', 'tinder', 'bumble'].includes(s));
  const includeNews = services.some(s => ['googlenews', 'applenews'].includes(s));
  
  return `
    You are Leela, a world-class executive assistant AI. Your task is to analyze updates from various platforms and provide a concise, professional daily briefing and a prioritized action plan.
    ${includeCalendar ? 'You will also create a detailed, realistic schedule based on the action plan.' : ''}

    I have connected the following services: ${services.join(', ')}.

    Please generate a realistic, simulated summary of morning updates for these connected services. For example:
    - For Gmail, you could mention a few important-sounding email subjects.
    - For LinkedIn, you could mention new messages from professional contacts.
    - For TechCrunch, summarize a few recent, plausible tech headlines.
    - For Google News or Apple News, provide a few top headlines from various categories like world, business, or science.
    - For Hinge, Tinder, or Bumble, you could mention a new match or a funny opening message.

    Based on the simulated information you generate, create the briefing and plan. Follow these instructions VERY CAREFULLY:
    1.  First, create the briefing. It should be a single paragraph. Start the briefing with the exact prefix "BRIEFING_START". End it with the exact prefix "BRIEFING_END".
    2.  After the briefing, create the action plan. It should be a list of 3-5 actionable items.
    3.  Each item in the action plan MUST be on a new line and start with the exact prefix "PLAN_ITEM:".
    
    ${includeCalendar ? `
    4. After the action plan, create a schedule for today's calendar.
    5. Convert the action plan items into a schedule for a typical workday (e.g., 9 AM to 5 PM). Assign realistic time slots.
    6. Proactively add wellness events like a "Bio Break" or a "Walking Meeting" to the schedule.
    7. Each calendar event MUST be on a new line and start with the exact prefix "CALENDAR_ITEM:".
    8. The format for each calendar item MUST be: START_TIME - END_TIME | TITLE | DESCRIPTION. For example: "CALENDAR_ITEM: 09:00 - 10:00 | Draft Q3 Report | Focus on incorporating the latest sales data."
    ` : ''}

    ${(includeDating || includeNews) ? `
    Additionally, generate prompts for media content based on the simulated updates.
    ${includeDating ? 'For EACH connected dating service (like Hinge, Tinder), generate a unique image prompt for a realistic dating profile picture.' : ''}
    ${includeNews ? 'For EACH connected news service (like Google News, Apple News), you MUST generate a unique video prompt for a 30-second news-style video clip summarizing one of the news items you generated, AND an audio prompt that reads one of the headlines aloud.' : ''}
    For each media prompt, use the EXACT format on a new line: MEDIA_PROMPT::[service_key]::[type]::[prompt_text]
    Example: MEDIA_PROMPT::hinge::image::A candid photo of someone laughing at a coffee shop.
    Example: MEDIA_PROMPT::googlenews::video::A dynamic 30-second video showcasing the latest advancements in renewable energy.
    Example: MEDIA_PROMPT::applenews::audio::Apple announces new M4 chips with significant performance gains for AI tasks.
    ` : ''}
  `;
};

export const streamDailyBriefing = async (
  services: ServiceKey[],
  onChunk: (chunk: string) => void,
  onComplete: () => void
): Promise<void> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = buildPrompt(services);

  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    for await (const chunk of response) {
      onChunk(chunk.text);
    }

    onComplete();

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate daily briefing. Please check your API key and try again.");
  }
};

export const getCoachingSession = async (): Promise<CoachingSession> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const coachScript = `
        This is Leela, checking in. It's about that time, so let's wrap up the day. How did everything go? Take a moment and think, what did you do really well today?
        Now, let's shift gears and focus on a strong finish to the evening. I'd encourage you to hit the gym to clear your head. After that, make sure to order a nutritious dinner to refuel.
        And definitely plan to get to sleep around 9 PM. You'll need the rest, because you have to be up at 8 AM sharp to head to SFO for that big Gemini hackathon. Let's make sure you're rested and ready. Have a great night.
    `;
    
    const imagePrompt = "An inspiring and serene image representing focus and end-of-day reflection. A minimalist digital art piece showing a desk with a computer screen glowing softly, overlooking a city at dusk through a large window. The mood is calm, accomplished, and ready for the next day's challenge.";

    try {
        const [audioResponse, imageResponse] = await Promise.all([
            ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text: coachScript }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: 'Kore' }, // A calm, professional voice.
                        },
                    },
                },
            }),
            generateImage(imagePrompt)
        ]);
        
        const base64Audio = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data received from the API.");
        }
        
        return { audioB64: base64Audio, transcript: coachScript, imageUrl: imageResponse };

    } catch (error) {
        console.error("Error calling Gemini APIs for coaching session:", error);
        throw new Error("Failed to generate coaching session. Please try again.");
    }
};

export const generateAudio = async (prompt: string): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data received from the API.");
        }

        // Browsers can't play raw PCM data directly in an <audio> tag.
        // We need to wrap it in a WAV header to create a playable file.
        const pcmToWav = (pcmData: Uint8Array, numChannels: number, sampleRate: number, bitsPerSample: number): Blob => {
            const dataSize = pcmData.length;
            const buffer = new ArrayBuffer(44 + dataSize);
            const view = new DataView(buffer);
            const writeString = (view: DataView, offset: number, string: string) => {
                for (let i = 0; i < string.length; i++) {
                    view.setUint8(offset + i, string.charCodeAt(i));
                }
            };
            const blockAlign = (numChannels * bitsPerSample) / 8;
            const byteRate = sampleRate * blockAlign;
            writeString(view, 0, 'RIFF');
            view.setUint32(4, 36 + dataSize, true);
            writeString(view, 8, 'WAVE');
            writeString(view, 12, 'fmt ');
            view.setUint32(16, 16, true);
            view.setUint16(20, 1, true); // PCM
            view.setUint16(22, numChannels, true);
            view.setUint32(24, sampleRate, true);
            view.setUint32(28, byteRate, true);
            view.setUint16(32, blockAlign, true);
            view.setUint16(34, bitsPerSample, true);
            writeString(view, 36, 'data');
            view.setUint32(40, dataSize, true);
            new Uint8Array(buffer).set(pcmData, 44);
            return new Blob([view], { type: 'audio/wav' });
        }

        const decode = (base64: string): Uint8Array => {
            const binaryString = atob(base64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes;
        }

        const decodedBytes = decode(base64Audio);
        // TTS model returns 16-bit PCM at 24kHz, 1 channel.
        const wavBlob = pcmToWav(decodedBytes, 1, 24000, 16);
        return URL.createObjectURL(wavBlob);

    } catch (error) {
        console.error("Error calling Gemini TTS API:", error);
        throw new Error("Failed to generate audio. Please try again.");
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: prompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: '16:9',
    },
  });
  const base64ImageBytes = response.generatedImages[0].image.imageBytes;
  return `data:image/jpeg;base64,${base64ImageBytes}`;
};

export const generateVideo = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  // Create a new instance right before the call to ensure the latest key is used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `${prompt}, 30 seconds`,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  // Poll for the result of the long-running operation.
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds between checks
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) {
    throw new Error("Video generation failed to produce a download link.");
  }

  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!response.ok) {
    throw new Error("Failed to download the generated video.");
  }

  const videoBlob = await response.blob();
  return URL.createObjectURL(videoBlob);
};