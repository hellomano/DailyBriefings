import React from 'react';
import { CalendarEvent } from '../types';

const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
        <line x1="16" x2="16" y1="2" y2="6"/>
        <line x1="8" x2="8" y1="2" y2="6"/>
        <line x1="3" x2="21" y1="10" y2="10"/>
    </svg>
);

const AddToCalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M8 2v4"/>
        <path d="M16 2v4"/>
        <rect width="18" height="18" x="3" y="4" rx="2"/>
        <path d="M3 10h18"/>
        <path d="M12 16h-4"/>
        <path d="M16 16h-4"/>
        <path d="M12 16v4"/>
    </svg>
);


interface CalendarCardProps {
  items: CalendarEvent[];
}

// Helper to format date and time for Google Calendar URL
const formatGoogleCalendarDate = (date: Date, time: string): string => {
    const [hours, minutes] = time.split(':');
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
};

const handleAddToCalendar = (item: CalendarEvent) => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const startTime = formatGoogleCalendarDate(startDate, item.startTime);
    const endTime = formatGoogleCalendarDate(endDate, item.endTime);

    const url = new URL('https://www.google.com/calendar/render');
    url.searchParams.set('action', 'TEMPLATE');
    url.searchParams.set('text', item.title);
    url.searchParams.set('dates', `${startTime}/${endTime}`);
    url.searchParams.set('details', item.description);
    
    window.open(url.toString(), '_blank');
};


const CalendarCard: React.FC<CalendarCardProps> = ({ items }) => {
  return (
    <div className="bg-surface rounded-lg border border-slate-700 shadow-xl p-6">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-purple-600/20 rounded-full mr-4">
            <CalendarIcon className="h-6 w-6 text-purple-400" />
        </div>
        <h3 className="text-xl font-bold text-text-primary">Today's Schedule</h3>
      </div>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={index} className="flex items-start p-3 bg-background/50 rounded-md">
            <div className="w-24 text-right mr-4 flex-shrink-0">
                <p className="font-bold text-brand-secondary">{item.startTime}</p>
                <p className="text-sm text-text-secondary">to {item.endTime}</p>
            </div>
            <div className="border-l border-slate-600 pl-4 flex-grow">
                <h4 className="font-semibold text-text-primary">{item.title}</h4>
                <p className="text-sm text-text-secondary">{item.description}</p>
                <button 
                  onClick={() => handleAddToCalendar(item)}
                  className="mt-2 inline-flex items-center text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                    <AddToCalendarIcon className="h-4 w-4 mr-1" />
                    Add to Google Calendar
                </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarCard;