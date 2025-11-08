
import React from 'react';

const CheckSquareIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="9 11 12 14 22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
);

const ListIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="8" x2="21" y1="6" y2="6"/>
        <line x1="8" x2="21" y1="12" y2="12"/>
        <line x1="8" x2="21" y1="18" y2="18"/>
        <line x1="3" x2="3.01" y1="6" y2="6"/>
        <line x1="3" x2="3.01" y1="12" y2="12"/>
        <line x1="3" x2="3.01" y1="18" y2="18"/>
    </svg>
);


interface PlanCardProps {
  items: string[];
}

const PlanCard: React.FC<PlanCardProps> = ({ items }) => {
  return (
    <div className="bg-surface rounded-lg border border-slate-700 shadow-xl p-6">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-brand-secondary/20 rounded-full mr-4">
            <ListIcon className="h-6 w-6 text-brand-secondary" />
        </div>
        <h3 className="text-xl font-bold text-text-primary">Today's Action Plan</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <CheckSquareIcon className="h-5 w-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
            <span className="text-text-secondary">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlanCard;
