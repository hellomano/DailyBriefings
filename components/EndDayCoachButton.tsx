import React from 'react';

const LoaderIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const MicIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" x2="12" y1="19" y2="23"/>
    </svg>
);


interface EndDayCoachButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

const EndDayCoachButton: React.FC<EndDayCoachButtonProps> = ({ onClick, isLoading }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="inline-flex items-center justify-center px-6 py-4 font-semibold text-md text-white bg-indigo-600 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
      aria-label="Start End of Day Coaching Session"
    >
      {isLoading ? (
        <>
          <LoaderIcon className="animate-spin -ml-1 mr-3 h-5 w-5" />
          Loading...
        </>
      ) : (
        <>
          <MicIcon className="-ml-1 mr-3 h-5 w-5" />
          End of Day Coach
        </>
      )}
    </button>
  );
};

export default EndDayCoachButton;
