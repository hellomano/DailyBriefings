import React, { useEffect } from 'react';
import type { CoachingSession } from '../types';
import VideoAnimation from './VideoAnimation';

const MicIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" x2="12" y1="19" y2="23"/>
    </svg>
);

interface CoachingModalProps {
  session: CoachingSession;
  onClose: () => void;
}

const CoachingModal: React.FC<CoachingModalProps> = ({ session, onClose }) => {

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-surface rounded-lg border border-slate-700 shadow-2xl w-full max-w-2xl relative flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={session.imageUrl} alt="Inspirational visual for your coaching session" className="w-full h-48 object-cover flex-shrink-0" />
        
        <div className="p-8 flex flex-col flex-grow overflow-hidden">
            <div className="flex items-center mb-6 flex-shrink-0">
                <div className="p-3 bg-indigo-600/20 rounded-full mr-4">
                    <MicIcon className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-text-primary">End of Day Coach</h3>
                    <p className="text-text-secondary">Listen to your personalized advice.</p>
                </div>
            </div>
            
            <div className="text-center my-6 flex-shrink-0">
                <VideoAnimation />
            </div>

            <div className="overflow-y-auto pr-2 flex-grow">
                <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                    {session.transcript}
                </p>
            </div>
            
            <div className="mt-8 text-center flex-shrink-0">
                <button
                  onClick={onClose}
                  className="px-6 py-2 font-semibold text-white bg-brand-primary rounded-full transition-colors hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-brand-primary"
                >
                  Close
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CoachingModal;