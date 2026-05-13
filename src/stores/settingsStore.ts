import { create } from 'zustand';
import type { Language } from '../i18n';
import type { Category } from '../types';

type Theme = 'dark' | 'light';
type MaskMode = 'FullRedaction' | 'StableAlias';

interface SettingsStore {
  theme: Theme;
  setTheme: (t: Theme) => void;
  
  language: Language;
  setLanguage: (l: Language) => void;

  enabledCategories: Category[];
  maskMode: MaskMode;
  toggleCategory: (category: Category) => void;
  setMaskMode: (mode: MaskMode) => void;
  getSettingsForRust: () => any;
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  theme: 'dark',
  setTheme: (t) => {
    applyTheme(t);
    set({ theme: t });
  },

  language: 'en',
  setLanguage: (l) => set({ language: l }),

  enabledCategories: [
    'db_connection', 'url_sensitive_param', 'auth_header', 'bearer_token', 
    'jwt', 'api_key_like', 'password_field', 'email', 'ipv4', 'ipv6'
  ],
  maskMode: 'StableAlias',

  toggleCategory: (category) => set((state) => ({
    enabledCategories: state.enabledCategories.includes(category)
      ? state.enabledCategories.filter((c) => c !== category)
      : [...state.enabledCategories, category]
  })),

  setMaskMode: (mode) => set({ maskMode: mode }),

  getSettingsForRust: () => ({
    enabled_categories: get().enabledCategories,
    mask_mode: get().maskMode
  })
}));

applyTheme('dark');
