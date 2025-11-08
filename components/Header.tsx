
import React from 'react';

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9 1.9 5.8 1.9-5.8 5.8-1.9-5.8-1.9z" />
    </svg>
);

const Header: React.FC = () => {
  return (
    <header className="p-4 border-b border-slate-800 bg-surface/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-center">
        <SparklesIcon className="text-brand-primary h-8 w-8 mr-3" />
        <h1 className="text-2xl font-bold text-text-primary">
          AI Daily Briefing
        </h1>
      </div>
    </header>
  );
};

export default Header;
