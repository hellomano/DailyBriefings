import React, { useState, useCallback, useMemo } from 'react';
import { streamDailyBriefing } from './services/geminiService';
import type { DailyBriefing, ServiceKey, CalendarEvent } from './types';
import Header from './components/Header';
import DataSources from './components/DataSources';
import GenerateButton from './components/GenerateButton';
import BriefingCard from './components/BriefingCard';
import PlanCard from './components/PlanCard';
import CalendarCard from './components/CalendarCard';
import Loader from './components/Loader';
import ErrorDisplay from './components/ErrorDisplay';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [connectedServices, setConnectedServices] = useState<Record<ServiceKey, boolean>>({
    gmail: false,
    linkedin: false,
    facebook: false,
    instagram: false,
    techcrunch: false,
    calendar: false,
  });
  const [fullResponseText, setFullResponseText] = useState<string>('');

  const handleConnectionToggle = (service: ServiceKey) => {
    // In a real app, this would initiate the OAuth flow.
    // For this demo, we'll just toggle the connection status.
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

  const handleGenerateBriefing = useCallback(async () => {
    if (!hasConnectedServices) {
      alert("Please connect at least one service to generate a briefing.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setFullResponseText('');
    try {
      const activeServices = Object.entries(connectedServices)
        .filter(([, isConnected]) => isConnected)
        .map(([key]) => key as ServiceKey);

      await streamDailyBriefing(
        activeServices,
        (chunk) => {
          setFullResponseText(prev => prev + chunk);
        },
        () => {
          setIsLoading(false);
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setIsLoading(false);
    }
  }, [connectedServices, hasConnectedServices]);

  const parsedData = useMemo((): DailyBriefing & { showCards: boolean } => {
    const briefingMatch = fullResponseText.match(/BRIEFING_START(.*?)BRIEFING_END/s);
    const briefing = briefingMatch ? briefingMatch[1].trim() : '';

    const plan: string[] = [];
    const planRegex = /PLAN_ITEM:(.*)/g;
    let match;
    while ((match = planRegex.exec(fullResponseText)) !== null) {
      if (match[1]) {
        plan.push(match[1].trim());
      }
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

    const showCards = fullResponseText.trim().length > 0;

    return { briefing, plan, calendar, showCards };
  }, [fullResponseText, connectedServices.calendar]);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center my-8">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">Connect Your Accounts</h2>
            <p className="text-lg text-text-secondary">Connect your services to generate a summarized briefing and actionable plan for your day.</p>
          </div>
          
          <DataSources connectedServices={connectedServices} onConnectionToggle={handleConnectionToggle} />

          <div className="flex justify-center my-12">
             <GenerateButton onClick={handleGenerateBriefing} isLoading={isLoading} disabled={!hasConnectedServices} />
          </div>

          {isLoading && !parsedData.showCards && <Loader />}
          {error && <ErrorDisplay message={error} />}

          {parsedData.showCards && (
             <div className="space-y-8 animate-fade-in">
                <BriefingCard content={parsedData.briefing} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <PlanCard items={parsedData.plan} />
                    {parsedData.calendar.length > 0 && <CalendarCard items={parsedData.calendar} />}
                </div>
            </div>
          )}

          {!isLoading && !parsedData.showCards && !error && (
             <div className="text-center p-8 bg-surface rounded-lg border border-slate-700">
                <p className="text-text-secondary">
                  {hasConnectedServices 
                    ? "Click the button above to generate your daily briefing."
                    : "Please connect one or more services to begin."
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