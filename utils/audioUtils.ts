// This decodes a base64 string into a Uint8Array.
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// This decodes raw PCM audio data into an AudioBuffer that the browser can play.
// The Gemini Live API returns raw audio, not a standard file format like .wav or .mp3.
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


// A global AudioContext to avoid creating multiple contexts.
// The TTS model outputs at a 24000 sample rate.
// FIX: Cast window to `any` to allow access to vendor-prefixed `webkitAudioContext` for older browser compatibility, resolving TypeScript error.
const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

/**
 * Plays audio from a base64 encoded string.
 * @param base64EncodedAudioString The base64 encoded audio data from the API.
 */
export async function playAudio(base64EncodedAudioString: string): Promise<void> {
    try {
        const decodedBytes = decode(base64EncodedAudioString);
        
        // The TTS audio is single-channel (mono).
        const audioBuffer = await decodeAudioData(decodedBytes, audioContext, 24000, 1);
        
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        
        return new Promise((resolve) => {
            source.onended = () => resolve();
            source.start(0);
        });

    } catch(error) {
        console.error("Failed to play audio:", error);
        throw new Error("Could not play the generated audio.");
    }
}
