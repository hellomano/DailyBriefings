import React, { useRef, useEffect } from 'react';
import type { MediaContent } from '../types';
import { services } from '../data';

interface MediaCardProps {
    item: MediaContent;
}

const MusicIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 18V5l12-2v13"/>
      <circle cx="6" cy="18" r="3"/>
      <circle cx="18" cy="16" r="3"/>
    </svg>
);

const MediaCard: React.FC<MediaCardProps> = ({ item }) => {
  const serviceInfo = services.find(s => s.key === item.service);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Programmatically play the video when it's ready to work around autoplay restrictions
    if (item.status === 'done' && item.type === 'video' && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
        // Autoplay was prevented, but the video is still loaded and can be played with controls.
      });
    }
  }, [item.status, item.type, item.url]);

  const renderContent = () => {
    switch (item.status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center h-full bg-background/50 rounded-md">
            <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-brand-primary"></div>
            <p className="mt-4 text-text-secondary">Generating {item.type}...</p>
            {item.type === 'video' && <p className="text-sm text-text-secondary">(This may take a minute or two)</p>}
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center h-full bg-red-900/50 rounded-md p-4 text-center">
            <p className="text-red-300 font-semibold">Failed to generate {item.type}</p>
            <p className="text-xs text-red-400 mt-2">{item.error}</p>
          </div>
        );
      case 'done':
        if (!item.url) return null;
        if (item.type === 'image') {
          return <img src={item.url} alt={item.prompt} className="w-full h-full object-cover" />;
        }
        if (item.type === 'video') {
          return <video ref={videoRef} src={item.url} controls loop muted playsInline className="w-full h-full object-cover bg-black" />;
        }
        if (item.type === 'audio') {
            return (
              <div className="w-full h-full flex flex-col items-center justify-center bg-background/50 p-4">
                <div className="p-4 bg-brand-secondary/20 rounded-full mb-4">
                  <MusicIcon className="text-brand-secondary" />
                </div>
                <p className="text-text-secondary text-center mb-4 text-sm italic">"{item.prompt}"</p>
                <audio src={item.url} controls className="w-full accent-brand-primary" />
              </div>
            );
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-slate-700 shadow-xl p-4 flex flex-col h-full">
      <div className="flex items-center mb-3">
        {serviceInfo?.icon}
        <h4 className="ml-2 font-semibold text-text-primary">Update from {serviceInfo?.name}</h4>
      </div>
      <div className="flex-grow flex items-center justify-center rounded-md overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};

export default MediaCard;