import React from 'react';
import type { ServiceKey } from '../types';
import { services } from '../data';

interface IntegrationsProps {
  connectedServices: Record<ServiceKey, boolean>;
  onConnectionToggle: (service: ServiceKey) => void;
}

const Integrations: React.FC<IntegrationsProps> = ({ connectedServices, onConnectionToggle }) => {
  return (
    <div className="bg-surface p-6 rounded-lg border border-slate-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {services.map((service) => {
                const isConnected = connectedServices[service.key];
                return (
                    <div 
                        key={service.key} 
                        className="flex flex-col bg-background/50 p-4 rounded-lg border border-slate-600 transition-all duration-300 hover:border-brand-primary hover:shadow-lg hover:shadow-brand-primary/10"
                    >
                        <div className="flex-grow">
                            <div className="flex items-center mb-2">
                                <div className="mr-3">{service.icon}</div>
                                <span className="font-semibold text-text-primary">{service.name}</span>
                            </div>
                            <p className="text-sm text-text-secondary h-16">
                                {service.description}
                            </p>
                        </div>
                        <div className="mt-auto pt-4">
                            <button 
                                onClick={() => onConnectionToggle(service.key)}
                                className={`w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                    isConnected
                                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/40'
                                    : 'bg-slate-600 text-text-secondary hover:bg-slate-500'
                                }`}
                            >
                                {isConnected ? 'Disconnect' : 'Connect'}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default Integrations;