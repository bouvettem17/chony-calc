// Typed wrapper around the shipped CHONY engine. The math lives ONLY in
// CHONY_FINAL45_calculator.js (verbatim from the model package) — never re-implement it here.
import * as umd from './CHONY_FINAL45_calculator.js';

export type Mode = 'corrections' | 'radiographs';
export type SandersStage = 2 | 3 | 4 | 5 | 6;

export interface EngineWarning {
  field: string;
  code: string;
  message: string;
}

export interface EngineResult {
  modelVersion: string;
  inputMode: Mode;
  probability: number;
  riskPercent: number;
  logOdds: number;
  ibccPercent: number;
  avtcPercent: number;
  warnings: EngineWarning[];
}

export interface EngineError {
  field: string;
  code: string;
  message: string;
}

interface Engine {
  modelVersion: string;
  model: {
    marginalReferenceRanges: Record<string, [number, number] | string>;
  };
  calculateFromCorrections(input: Record<string, number | null>): EngineResult;
  calculateFromRadiographs(input: Record<string, number | null>): EngineResult;
}

// Build: bundler wraps the UMD as CommonJS -> default export. Dev: it sets the global.
const engine: Engine =
  (globalThis as unknown as { CHONYFinal45?: Engine }).CHONYFinal45 ??
  ((umd as unknown as { default?: Engine }).default as Engine);
if (!engine?.calculateFromCorrections) throw new Error('CHONY engine failed to load');

export const MODEL_VERSION = engine.modelVersion;

export function referenceRange(field: string): [number, number] | null {
  const r = engine.model.marginalReferenceRanges[field];
  return Array.isArray(r) ? r : null;
}

export const FIELDS_BY_MODE: Record<Mode, string[]> = {
  corrections: ['baselineSandersStage', 'baselineCobbDegrees', 'averageWearHoursPerDay', 'ibccPercent', 'avtcPercent'],
  radiographs: [
    'baselineSandersStage', 'baselineCobbDegrees', 'averageWearHoursPerDay',
    'inBraceCobbDegrees', 'baselineAvt', 'inBraceAvt',
  ],
};

/** Blank text -> null (engine reports REQUIRED). Never Number(''), which silently becomes 0. */
export function parseField(text: string): number | null {
  return text.trim() === '' ? null : Number(text);
}

export type Outcome = { ok: true; result: EngineResult } | { ok: false; error: EngineError };

export function calculate(mode: Mode, values: Record<string, string>): Outcome {
  const input: Record<string, number | null> = {};
  for (const key of FIELDS_BY_MODE[mode]) input[key] = parseField(values[key] ?? '');
  try {
    const result = mode === 'radiographs'
      ? engine.calculateFromRadiographs(input)
      : engine.calculateFromCorrections(input);
    return { ok: true, result };
  } catch (e) {
    const err = e as Partial<EngineError> & { name?: string };
    if (err.name !== 'CHONYInputError') throw e;
    return { ok: false, error: { field: err.field ?? 'input', code: err.code ?? 'UNKNOWN', message: err.message ?? 'Invalid input.' } };
  }
}
