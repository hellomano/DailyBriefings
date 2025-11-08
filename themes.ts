export interface Theme {
  id: string;
  name: string;
  colors: {
    'brand-primary': string;
    'brand-secondary': string;
    'background': string;
    'surface': string;
    'text-primary': string;
    'text-secondary': string;
  };
}

export const themes: Record<string, Theme> = {
  defaultDark: {
    id: 'defaultDark',
    name: 'Default Dark',
    colors: {
      'brand-primary': '#4f46e5',
      'brand-secondary': '#7c3aed',
      'background': '#0f172a',
      'surface': '#1e293b',
      'text-primary': '#f8fafc',
      'text-secondary': '#cbd5e1',
    },
  },
  defaultLight: {
    id: 'defaultLight',
    name: 'Default Light',
    colors: {
      'brand-primary': '#4f46e5',
      'brand-secondary': '#7c3aed',
      'background': '#f8fafc',
      'surface': '#ffffff',
      'text-primary': '#1e293b',
      'text-secondary': '#64748b',
    },
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    colors: {
      'brand-primary': '#f97316',
      'brand-secondary': '#ef4444',
      'background': '#1e1b4b',
      'surface': '#312e81',
      'text-primary': '#fef3c7',
      'text-secondary': '#a5b4fc',
    },
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    colors: {
      'brand-primary': '#16a34a',
      'brand-secondary': '#ca8a04',
      'background': '#f0fdf4',
      'surface': '#ffffff',
      'text-primary': '#14532d',
      'text-secondary': '#57534e',
    },
  },
};
