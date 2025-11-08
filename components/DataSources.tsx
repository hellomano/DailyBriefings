import React from 'react';
import type { ServiceKey } from '../types';
import { services } from '../data';

interface DataSourcesProps {
  connectedServices: Record<ServiceKey, boolean>;
  onConnectionToggle: (service: ServiceKey) => void;
}

const ConnectionIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/>
    </svg>
)

const DataSources: React.FC<DataSourcesProps> = ({ connectedServices, onConnectionToggle }) => {
  return (
    <div className="bg-surface p-6 rounded-lg border border-slate-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {services.map((service) => {
                const isConnected = connectedServices[service.key];
                return (
                    <div 
                        key={service.key} 
                        className="flex items-center justify-between bg-background/50 p-3 rounded-md border border-slate-600"
                    >
                        <div className="flex items-center">
                           <div className="mr-3">{service.icon}</div>
                           <span className="font-semibold text-text-primary">{service.name}</span>
                        </div>
                        <button 
                            onClick={() => onConnectionToggle(service.key)}
                            className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                isConnected
                                ? 'bg-green-600/20 text-green-300 hover:bg-green-600/40'
                                : 'bg-slate-600 text-text-secondary hover:bg-slate-500'
                            }`}
                        >
                            {isConnected ? 'Connected' : 'Connect'}
                        </button>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default DataSources;
