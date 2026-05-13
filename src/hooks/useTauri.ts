import { invoke } from '@tauri-apps/api/core';
import type { AnalysisResult, RedactionSettings, PreviewData, ExportResult } from '../types';

export async function analyzeFile(path: string, settings: RedactionSettings): Promise<AnalysisResult> {
  return invoke<AnalysisResult>('analyze_file', { path, settings });
}

export async function getSanitizedPreview(
  path: string,
  settings: RedactionSettings,
): Promise<PreviewData> {
  return invoke<PreviewData>('get_sanitized_preview', { path, settings });
}

export async function exportFile(
  sourcePath: string,
  destPath: string,
  settings: RedactionSettings,
): Promise<ExportResult> {
  return invoke<ExportResult>('export_file', {
    sourcePath,
    destPath,
    settings,
  });
}
