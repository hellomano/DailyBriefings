import React from 'react';

interface VeoApiKeySelectorProps {
  onKeySelected: () => void;
}

const KeyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
    </svg>
);

const VeoApiKeySelector: React.FC<VeoApiKeySelectorProps> = ({ onKeySelected }) => {
  const handleClick = async () => {
    // This call opens the AI Studio dialog for key selection
    // @ts-ignore
    await window.aistudio.openSelectKey();
    // After the dialog is closed, we assume the user has made a selection and call the callback.
    onKeySelected();
  };

  return (
    <div className="text-center p-6 bg-surface rounded-lg border border-yellow-500/50 my-8 animate-fade-in">
      <div className="flex flex-col items-center">
        <div className="p-3 bg-yellow-500/20 rounded-full mb-4">
            <KeyIcon className="h-8 w-8 text-yellow-400" />
        </div>
        <h3 className="text-xl font-bold text-yellow-300 mb-2">API Key Required for Video</h3>
        <p className="text-text-secondary mb-4 max-w-prose">
          To generate videos with Google's Veo model, please select an API key. Video generation is an advanced feature and may incur costs.
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">
            Learn more about billing
          </a>.
        </p>
        <button 
          onClick={handleClick} 
          className="inline-flex items-center justify-center px-6 py-2 font-semibold text-white bg-yellow-600 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-yellow-500 transform hover:scale-105"
        >
          Select API Key
        </button>
      </div>
    </div>
  );
};

export default VeoApiKeySelector;
