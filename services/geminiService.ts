import { GoogleGenAI } from "@google/genai";
import type { ServiceKey } from '../types';

const buildPrompt = (services: ServiceKey[]): string => {
  const includeCalendar = services.includes('calendar');
  
  return `
    You are a world-class executive assistant AI. Your task is to analyze updates from various platforms and provide a concise, professional daily briefing and a prioritized action plan.
    ${includeCalendar ? 'You will also create a detailed, realistic schedule based on the action plan.' : ''}

    I have connected the following services: ${services.join(', ')}.

    Please generate a realistic, simulated summary of morning updates for these connected services. For example:
    - For Gmail, you could mention a few important-sounding email subjects.
    - For LinkedIn, you could mention new messages from professional contacts.
    - For TechCrunch, summarize a few recent, plausible tech headlines.

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