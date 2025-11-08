import React from 'react';
import { themes, Theme } from '../themes';

const PaletteIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125s.148-.836.437-1.125c.29-.289.438-.652.438-1.125s-.148-.836-.437-1.125c-.29-.289-.438-.652-.438-1.125s.148-.836.437-1.125c.29-.289.438-.652.438-1.125s-.148-.836-.437-1.125c-.29-.289-.438-.652-.438-1.125C13.648 2.746 12.926 2 12 2z" />
    </svg>
);


interface ThemeSwitcherProps {
    currentTheme: Theme;
    onThemeChange: (theme: Theme) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, onThemeChange }) => {
    
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const themeId = event.target.value;
        const newTheme = themes[themeId];
        if (newTheme) {
            onThemeChange(newTheme);
        }
    };

    return (
        <div className="relative inline-flex items-center">
            <PaletteIcon className="absolute left-3 h-5 w-5 text-text-secondary pointer-events-none" />
            <select
                value={currentTheme.id}
                onChange={handleSelectChange}
                className="pl-10 pr-4 py-2 appearance-none bg-surface border border-slate-700 rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary cursor-pointer"
                aria-label="Select a theme"
            >
                {Object.values(themes).map((theme) => (
                    <option key={theme.id} value={theme.id}>
                        {theme.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ThemeSwitcher;
