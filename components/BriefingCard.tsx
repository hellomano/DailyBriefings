
import React from 'react';

const NewspaperIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4"/>
        <path d="M4 9h16"/>
        <path d="M4 15h16"/>
        <path d="M10 3v18"/>
    </svg>
);

interface BriefingCardProps {
  content: string;
}

const BriefingCard: React.FC<BriefingCardProps> = ({ content }) => {
  return (
    <div className="bg-surface rounded-lg border border-slate-700 shadow-xl p-6">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-brand-primary/20 rounded-full mr-4">
            <NewspaperIcon className="h-6 w-6 text-brand-primary" />
        </div>
        <h3 className="text-xl font-bold text-text-primary">Your Daily Briefing</h3>
      </div>
      <p className="text-text-secondary leading-relaxed">
        {content}
      </p>
    </div>
  );
};

export default BriefingCard;
