import React, { useRef, useState, useEffect } from 'react';
import MediaCard from './MediaCard';
import type { MediaContent } from '../types';

const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m15 18-6-6 6-6"/>
    </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m9 18 6-6-6-6"/>
    </svg>
);

interface MediaCarouselProps {
  media: MediaContent[];
  isGenerating: boolean;
}

const MediaCarousel: React.FC<MediaCarouselProps> = ({ media, isGenerating }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    const el = scrollContainerRef.current;
    if (el) {
      const hasOverflow = el.scrollWidth > el.clientWidth;
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 1); // -1 for precision
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      checkScrollability();
      const observer = new ResizeObserver(checkScrollability);
      observer.observe(el);
      el.addEventListener('scroll', checkScrollability);
      return () => {
        observer.disconnect();
        el.removeEventListener('scroll', checkScrollability);
      };
    }
  }, [media]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (el) {
      const scrollAmount = el.clientWidth * 0.9;
      el.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };
  
  const hasVisibleContent = media.some(item => item.status === 'done' || item.status === 'loading' || item.status === 'error');
  if (!isGenerating && media.length === 0 || !hasVisibleContent) {
    return null;
  }

  return (
    <div className="my-8 relative">
      <h3 className="text-xl font-bold text-text-primary mb-4">Visual Updates</h3>
      
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide space-x-6 pb-4 -mx-4 px-4"
      >
        {media.map((item, index) => (
          <div key={`${item.service}-${index}`} className="w-[85%] sm:w-[60%] md:w-[48%] flex-shrink-0 snap-center h-96">
            <MediaCard item={item} />
          </div>
        ))}
      </div>
      
      {canScrollLeft && (
        <button
          onClick={() => handleScroll('left')}
          className="absolute top-1/2 left-0 -translate-y-1/2 bg-surface/80 hover:bg-surface rounded-full p-2 z-10 transition-all shadow-lg border border-slate-600"
          aria-label="Previous item"
        >
          <ChevronLeftIcon className="h-6 w-6 text-text-primary" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => handleScroll('right')}
          className="absolute top-1/2 right-0 -translate-y-1/2 bg-surface/80 hover:bg-surface rounded-full p-2 z-10 transition-all shadow-lg border border-slate-600"
          aria-label="Next item"
        >
          <ChevronRightIcon className="h-6 w-6 text-text-primary" />
        </button>
      )}
    </div>
  );
};

export default MediaCarousel;