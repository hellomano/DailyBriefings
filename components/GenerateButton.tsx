import React from 'react';

const LoaderIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const WandIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 4V2m0 14v-2m-7.5.5L6 13M20 9l-1.5-.5M3 11l1.5.5m11 .5L17 13m-2-5l1.5-.5M6 7l-1.5.5" />
    <path d="M9 22l3-8-8-3 8-3-3 8 3 8-8 3z" />
  </svg>
);

interface GenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick, isLoading, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className="inline-flex items-center justify-center px-8 py-4 font-semibold text-lg text-white bg-brand-primary rounded-full shadow-lg transition-all duration-300 ease-in-out hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
    >
      {isLoading ? (
        <>
          <LoaderIcon className="animate-spin -ml-1 mr-3 h-5 w-5" />
          Generating...
        </>
      ) : (
        <>
          <WandIcon className="-ml-1 mr-3 h-5 w-5" />
          Generate My Daily Briefing
        </>
      )}
    </button>
  );
};

export default GenerateButton;
