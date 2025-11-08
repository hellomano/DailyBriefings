export interface CalendarEvent {
  startTime: string;
  endTime: string;
  title: string;
  description: string;
}

export interface DailyBriefing {
  briefing: string;
  plan: string[];
  calendar: CalendarEvent[];
}

export type ServiceKey = 'gmail' | 'linkedin' | 'facebook' | 'instagram' | 'techcrunch' | 'calendar';