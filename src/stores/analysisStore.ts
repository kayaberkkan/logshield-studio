import { create } from 'zustand';
import type { AnalysisResult, RedactionSettings, Category, MaskMode, PreviewData } from '../types';

interface AnalysisStore {
  
  filePath: string | null;
  fileName: string | null;
  fileSizeBytes: number | null;

  analysisResult: AnalysisResult | null;

  sanitizedPreview: PreviewData | null;

  settings: RedactionSettings;

  isAnalyzing: boolean;
  isExporting: boolean;
  error: string | null;

  setFilePath: (path: string) => void;
  setAnalysisResult: (result: AnalysisResult) => void;
  setSanitizedPreview: (preview: PreviewData) => void;
  toggleCategory: (category: Category) => void;
  setMaskMode: (mode: MaskMode) => void;
  setIsAnalyzing: (v: boolean) => void;
  setIsExporting: (v: boolean) => void;
  setError: (msg: string | null) => void;
  reset: () => void;
}

const DEFAULT_SETTINGS: RedactionSettings = {
  enabled_categories: [
    'db_connection',
    'auth_header',
    'bearer_token',
    'jwt',
    'password_field',
    'email',
    'ipv4',
  ],
  mask_mode: 'StableAlias',
};

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  filePath: null,
  fileName: null,
  fileSizeBytes: null,
  analysisResult: null,
  sanitizedPreview: null,
  settings: DEFAULT_SETTINGS,
  isAnalyzing: false,
  isExporting: false,
  error: null,

  setFilePath: (path) =>
    set({
      filePath: path,
      fileName: path.split('/').pop() ?? path,
    }),

  setAnalysisResult: (result) =>
    set({
      analysisResult: result,
      fileSizeBytes: result.file_size_bytes,
      fileName: result.file_name,
      sanitizedPreview: result.preview,
    }),

  setSanitizedPreview: (preview) => set({ sanitizedPreview: preview }),

  toggleCategory: (category) =>
    set((state) => {
      const current = state.settings.enabled_categories;
      const next = current.includes(category)
        ? current.filter((c) => c !== category)
        : [...current, category];
      return { settings: { ...state.settings, enabled_categories: next } };
    }),

  setMaskMode: (mode) =>
    set((state) => ({
      settings: { ...state.settings, mask_mode: mode },
    })),

  setIsAnalyzing: (v) => set({ isAnalyzing: v }),
  setIsExporting: (v) => set({ isExporting: v }),
  setError: (msg) => set({ error: msg }),

  reset: () =>
    set({
      filePath: null,
      fileName: null,
      fileSizeBytes: null,
      analysisResult: null,
      sanitizedPreview: null,
      settings: DEFAULT_SETTINGS,
      isAnalyzing: false,
      isExporting: false,
      error: null,
    }),
}));
