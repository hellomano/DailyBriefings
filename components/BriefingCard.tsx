import React, { useState } from 'react';

const NewspaperIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4"/>
        <path d="M4 9h16"/>
        <path d="M4 15h16"/>
        <path d="M10 3v18"/>
    </svg>
);

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
);


interface BriefingCardProps {
  content: string;
}

const BriefingCard: React.FC<BriefingCardProps> = ({ content }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy briefing.');
    }
  };


  return (
    <div className="bg-surface rounded-lg border border-slate-700 shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
            <div className="p-2 bg-brand-primary/20 rounded-full mr-4">
                <NewspaperIcon className="h-6 w-6 text-brand-primary" />
            </div>
            <h3 className="text-xl font-bold text-text-primary">Your Daily Briefing</h3>
        </div>
        <button
          onClick={handleCopy}
          className="text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
          title="Copy to clipboard"
          disabled={isCopied || !content}
        >
          {isCopied ? (
            <span className="text-sm text-green-400">Copied!</span>
          ) : (
            <CopyIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
        {content}
      </p>
    </div>
  );
};

export default BriefingCard;