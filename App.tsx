import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { streamDailyBriefing, getCoachingSession, generateImage, generateVideo, generateAudio } from './services/geminiService';
import type { DailyBriefing, ServiceKey, CalendarEvent, MediaContent, CoachingSession } from './types';
import { playAudio } from './utils/audioUtils';
import Header from './components/Header';
import Integrations from './components/DataSources';
import GenerateButton from './components/GenerateButton';
import EndDayCoachButton from './components/EndDayCoachButton';
import BriefingCard from './components/BriefingCard';
import PlanCard from './components/PlanCard';
import CalendarCard from './components/CalendarCard';
import Loader from './components/Loader';
import ErrorDisplay from './components/ErrorDisplay';
import MediaCarousel from './components/MediaCarousel';
import VeoApiKeySelector from './components/VeoApiKeySelector';
import CoachingModal from './components/CoachingModal';
import { themes, Theme } from './themes';

interface MediaPrompt {
  service: ServiceKey;
  type: 'image' | 'video' | 'audio';
  prompt: string;
}

const AnimatedCard: React.FC<{ children: React.ReactNode; delay: number; isVisible: boolean }> = ({ children, delay, isVisible }) => {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => setShouldRender(true), delay);
            return () => clearTimeout(timer);
        } else {
            setShouldRender(false);
        }
    }, [isVisible, delay]);

    return (
        <div className={`transition-opacity duration-500 ${shouldRender ? 'opacity-100' : 'opacity-0'}`} style={{ animation: shouldRender ? `fade-in-up 0.5s ${delay}ms both ease-out` : 'none' }}>
            {children}
        </div>
    );
};


const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCoaching, setIsCoaching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const savedThemeId = localStorage.getItem('themeId');
    return themes[savedThemeId || 'defaultDark'] || themes.defaultDark;
  });

  const [connectedServices, setConnectedServices] = useState<Record<ServiceKey, boolean>>({
    gmail: false,
    linkedin: false,
    facebook: false,
    instagram: false,
    techcrunch: false,
    calendar: false,
    hinge: false,
    tinder: false,
    bumble: false,
    googlenews: false,
    applenews: false,
  });
  
  // State for streaming and final parsed data
  const [fullResponseText, setFullResponseText] = useState<string>('');
  const [isStreamComplete, setIsStreamComplete] = useState<boolean>(false);
  
  // State for media generation
  const [media, setMedia] = useState<MediaContent[]>([]);
  const [isGeneratingMedia, setIsGeneratingMedia] = useState<boolean>(false);
  const [mediaPrompts, setMediaPrompts] = useState<MediaPrompt[]>([]);
  const [needsVeoKey, setNeedsVeoKey] = useState<boolean>(false);

  // State for coaching modal
  const [coachingSession, setCoachingSession] = useState<CoachingSession | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value as string);
    });
    localStorage.setItem('themeId', currentTheme.id);
  }, [currentTheme]);

  const handleConnectionToggle = (service: ServiceKey) => {
    setConnectedServices(prev => {
        const newStatus = !prev[service];
        alert(
            newStatus 
                ? `Connecting to ${service}...\nIn a real app, this would open an OAuth login window.`
                : `Disconnecting from ${service}...`
        );
        return { ...prev, [service]: newStatus };
    });
  };

  const hasConnectedServices = useMemo(() => {
    return Object.values(connectedServices).some(status => status);
  }, [connectedServices]);

  const parseAndSetMediaPrompts = useCallback(() => {
    const prompts: MediaPrompt[] = [];
    const mediaRegex = /MEDIA_PROMPT::(.*?)::(.*?)::(.*)/g;
    let match;
    while ((match = mediaRegex.exec(fullResponseText)) !== null) {
      if (match[1] && match[2] && match[3]) {
        prompts.push({
          service: match[1].trim() as ServiceKey,
          type: match[2].trim() as 'image' | 'video' | 'audio',
          prompt: match[3].trim(),
        });
      }
    }
    setMediaPrompts(prompts);
  }, [fullResponseText]);

  const handleGenerateBriefing = useCallback(async () => {
    if (!hasConnectedServices) {
      alert("Please integrate at least one service to generate a briefing.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setFullResponseText('');
    setMedia([]);
    setMediaPrompts([]);
    setNeedsVeoKey(false);
    setIsStreamComplete(false);
    try {
      const activeServices = Object.entries(connectedServices)
        .filter(([, isConnected]) => isConnected)
        .map(([key]) => key as ServiceKey);

      await streamDailyBriefing(
        activeServices,
        (chunk) => setFullResponseText(prev => prev + chunk),
        () => {
          setIsLoading(false);
          setIsStreamComplete(true);
          parseAndSetMediaPrompts();
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setIsLoading(false);
    }
  }, [connectedServices, hasConnectedServices, parseAndSetMediaPrompts]);
  
  const handleCoachSession = useCallback(async () => {
    setIsCoaching(true);
    setError(null);
    try {
        const sessionData = await getCoachingSession();
        setCoachingSession(sessionData);
        await playAudio(sessionData.audioB64);
    } catch(err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred during coaching session.');
    } finally {
        setIsCoaching(false);
    }
  }, []);

  const generateAllMedia = useCallback(async () => {
    if (mediaPrompts.length === 0) return;
    
    setIsGeneratingMedia(true);
    setMedia(mediaPrompts.map(p => ({ ...p, status: 'loading' })));

    const mediaPromises = mediaPrompts.map(async (prompt, index) => {
      try {
        let url;
        if (prompt.type === 'image') {
          url = await generateImage(prompt.prompt);
        } else if (prompt.type === 'video') {
          url = await generateVideo(prompt.prompt);
        } else if (prompt.type === 'audio') {
          url = await generateAudio(prompt.prompt);
        }
        setMedia(prev => prev.map((item, i) => i === index ? { ...item, status: 'done', url } : item));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        if (errorMessage.includes('Requested entity was not found')) {
          setNeedsVeoKey(true);
        }
        setMedia(prev => prev.map((item, i) => i === index ? { ...item, status: 'error', error: errorMessage } : item));
      }
    });

    await Promise.all(mediaPromises);
    setIsGeneratingMedia(false);
    setMediaPrompts([]); // Clear prompts after processing
  }, [mediaPrompts]);
  
  useEffect(() => {
    const handleMediaGeneration = async () => {
        if (mediaPrompts.length === 0 || !isStreamComplete) return;

        const hasVideo = mediaPrompts.some(p => p.type === 'video');
        if (hasVideo && !needsVeoKey) {
            // @ts-ignore
            const hasKey = await window.aistudio.hasSelectedApiKey();
            if (!hasKey) {
                setNeedsVeoKey(true);
                return;
            }
        }
        generateAllMedia();
    };
    handleMediaGeneration();
  }, [mediaPrompts, isStreamComplete, needsVeoKey, generateAllMedia]);

  const parsedData = useMemo((): DailyBriefing & { showCards: boolean } => {
    const briefingMatch = fullResponseText.match(/BRIEFING_START(.*?)(BRIEFING_END|PLAN_ITEM:|CALENDAR_ITEM:|$)/s);
    const briefing = briefingMatch ? briefingMatch[1].trim() : '';
    const plan: string[] = [];
    const planRegex = /PLAN_ITEM:(.*)/g;
    let match;
    while ((match = planRegex.exec(fullResponseText)) !== null) {
      if (match[1]) plan.push(match[1].trim());
    }
    const calendar: CalendarEvent[] = [];
    if (connectedServices.calendar) {
      const calendarRegex = /CALENDAR_ITEM:(.*)/g;
      while((match = calendarRegex.exec(fullResponseText)) !== null) {
        if(match[1]) {
          const parts = match[1].trim().split('|');
          if (parts.length === 3) {
            const timeParts = parts[0].trim().split('-');
            if (timeParts.length === 2) {
              calendar.push({
                startTime: timeParts[0].trim(),
                endTime: timeParts[1].trim(),
                title: parts[1].trim(),
                description: parts[2].trim(),
              });
            }
          }
        }
      }
    }
    const showCards = !!briefing || plan.length > 0 || calendar.length > 0;
    return { briefing, plan, calendar, showCards };
  }, [fullResponseText, connectedServices.calendar]);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center my-8">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">Create Your Custom Feed</h2>
            <p className="text-lg text-text-secondary">Integrate your favorite services to build a personalized news and updates feed.</p>
          </div>
          
          <Integrations connectedServices={connectedServices} onConnectionToggle={handleConnectionToggle} />

          <div className="flex justify-center items-center my-12 space-x-4">
             <GenerateButton onClick={handleGenerateBriefing} isLoading={isLoading} disabled={!hasConnectedServices} />
             {isStreamComplete && !isLoading && (
                <EndDayCoachButton onClick={handleCoachSession} isLoading={isCoaching} />
             )}
          </div>

          {isLoading && !parsedData.showCards && <Loader />}
          {error && <ErrorDisplay message={error} />}
          
          {coachingSession && (
            <CoachingModal
              session={coachingSession}
              onClose={() => setCoachingSession(null)}
            />
          )}

          {needsVeoKey && (
             <VeoApiKeySelector onKeySelected={() => {
                setNeedsVeoKey(false);
                generateAllMedia();
             }} />
          )}

          {parsedData.showCards && (
             <div className="space-y-8">
                <AnimatedCard isVisible={parsedData.showCards} delay={0}>
                    <BriefingCard content={parsedData.briefing} />
                </AnimatedCard>
                <AnimatedCard isVisible={parsedData.showCards} delay={100}>
                    <MediaCarousel media={media} isGenerating={isGeneratingMedia} />
                </AnimatedCard>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <AnimatedCard isVisible={parsedData.showCards} delay={200}>
                        <PlanCard items={parsedData.plan} />
                    </AnimatedCard>
                    {parsedData.calendar.length > 0 && 
                        <AnimatedCard isVisible={parsedData.showCards} delay={300}>
                            <CalendarCard items={parsedData.calendar} />
                        </AnimatedCard>
                    }
                </div>
            </div>
          )}

          {!isLoading && !parsedData.showCards && !error && (
             <div className="text-center p-8 bg-surface rounded-lg border border-slate-700">
                <p className="text-text-secondary">
                  {hasConnectedServices 
                    ? "Click 'Get My Briefing' to start your day."
                    : "Please integrate one or more services to begin."
                  }
                </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;