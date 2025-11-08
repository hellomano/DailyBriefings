import React from 'react';
import type { ServiceKey } from './types';

// Fix: Converted JSX to React.createElement to be valid in a .ts file.
const LinkedInIcon: React.FC<{className?: string}> = ({ className }) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "currentColor", className: `text-blue-500 ${className || ''}`.trim() },
    React.createElement('path', { d: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" })
  )
);

// Fix: Converted JSX to React.createElement to be valid in a .ts file.
const FacebookIcon: React.FC<{className?: string}> = ({ className }) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "currentColor", className: `text-blue-600 ${className || ''}`.trim() },
    React.createElement('path', { d: "M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.323-1.325z" })
  )
);

// Fix: Converted JSX to React.createElement to be valid in a .ts file.
const TechCrunchIcon: React.FC<{className?: string}> = ({ className }) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "currentColor", className: `text-green-500 ${className || ''}`.trim() },
        React.createElement('path', { d: "M5.484 19.43v-1.127a.38.38 0 01.378-.378h.813V5.056h-.813a.378.378 0 01-.378-.378V3.55h11.967v1.128a.378.378 0 01-.378.378h-.812v12.869h.812a.378.378 0 01.378.378v1.127H5.484zM9.42 5.056V18.3h5.087V5.056H9.42z" })
    )
);

// Fix: Converted JSX to React.createElement to be valid in a .ts file.
const InstagramIcon: React.FC<{className?: string}> = ({ className }) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "url(#insta-gradient)", className: className },
    React.createElement('defs', null,
      React.createElement('radialGradient', { id: "insta-gradient", cx: "30%", cy: "107%", r: "150%" },
        React.createElement('stop', { offset: "0%", style: { stopColor: '#fdf497' } }),
        React.createElement('stop', { offset: "5%", style: { stopColor: '#fdf497' } }),
        React.createElement('stop', { offset: "45%", style: { stopColor: '#fd5949' } }),
        React.createElement('stop', { offset: "60%", style: { stopColor: '#d6249f' } }),
        React.createElement('stop', { offset: "90%", style: { stopColor: '#285AEB' } })
      )
    ),
    React.createElement('path', { d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.359 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.359-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.359-2.618-6.78-6.98-6.98-1.281-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z" })
  )
);

// Fix: Converted JSX to React.createElement to be valid in a .ts file.
const GmailIcon: React.FC<{className?: string}> = ({ className }) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "currentColor", className: `text-red-500 ${className || ''}`.trim() },
        React.createElement('path', { d: "M24 5.457v13.086c0 .546-.443.993-.993.993H.993A.993.993 0 010 18.543V5.457c0-.236.083-.46.23-.638l11.007-6.588a.992.992 0 011.042-.008l11.493 6.586c.143.082.228.23.228.39v.25zM12 11.538L1.13 5.457h21.74L12 11.538zM1.5 7.028v10.515h21V7.028L12.012 13.5z" })
    )
);

const GoogleCalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "currentColor", className: className },
        React.createElement('path', { fill: "#34A853", d: "M12 24H5c-1.657 0-3-1.343-3-3V7h10v17z" }),
        React.createElement('path', { fill: "#4285F4", d: "M12 24h7c1.657 0 3-1.343 3-3V7H12v17z" }),
        React.createElement('path', { fill: "#FBBC05", d: "M12 7H2V3c0-1.657 1.343-3 3-3h7v7z" }),
        React.createElement('path', { fill: "#EA4335", d: "M12 7h10V3c0-1.657-1.343-3-3-3h-7v7z" }),
        React.createElement('text', { x: "12", y: "17", fill: "white", textAnchor: "middle", fontSize: "10px", fontWeight: "bold" }, new Date().getDate().toString())
    )
);


// Fix: Converted JSX to React.createElement to be valid in a .ts file.
export const services: { key: ServiceKey; name: string; icon: React.ReactNode }[] = [
    { key: 'gmail', name: 'Gmail', icon: React.createElement(GmailIcon, { className: "h-6 w-6" }) },
    { key: 'linkedin', name: 'LinkedIn', icon: React.createElement(LinkedInIcon, { className: "h-6 w-6" }) },
    { key: 'facebook', name: 'Facebook', icon: React.createElement(FacebookIcon, { className: "h-6 w-6" }) },
    { key: 'instagram', name: 'Instagram', icon: React.createElement(InstagramIcon, { className: "h-6 w-6" }) },
    { key: 'techcrunch', name: 'TechCrunch', icon: React.createElement(TechCrunchIcon, { className: "h-6 w-6" }) },
    { key: 'calendar', name: 'Google Calendar', icon: React.createElement(GoogleCalendarIcon, { className: "h-6 w-6" }) },
];