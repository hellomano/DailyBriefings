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

export type ServiceKey = 'gmail' | 'linkedin' | 'facebook' | 'instagram' | 'techcrunch' | 'calendar' | 'hinge' | 'tinder' | 'bumble' | 'googlenews' | 'applenews';

export interface MediaContent {
  service: ServiceKey;
  type: 'image' | 'video' | 'audio';
  url?: string;
  status: 'loading' | 'done' | 'error';
  prompt: string;
  error?: string;
}

export interface CoachingSession {
    audioB64: string;
    transcript: string;
    imageUrl: string;
}