// Labels and help text adapted from UI_COPY.md in the model package.
export interface FieldSpec {
  key: string;
  label: string;
  help: string;
  unit: string;
  /** Slider range — a convenience only. The number box accepts anything the engine accepts. */
  slider?: { min: number; max: number; step: number };
}

export const SANDERS_HELP = 'Skeletal maturity at the start of bracing.';

export const COBB_FIELD: FieldSpec = {
  key: 'baselineCobbDegrees',
  label: 'Major Cobb angle',
  help: 'Measured before bracing. Must be under 45°.',
  unit: '°',
  slider: { min: 10, max: 44.5, step: 0.5 },
};

export const WEAR_FIELD: FieldSpec = {
  key: 'averageWearHoursPerDay',
  label: 'Average daily brace wear',
  help: 'Hours per day actually worn, averaged over the bracing course.',
  unit: 'h/day',
  slider: { min: 0, max: 24, step: 0.5 },
};

export const CORRECTION_FIELDS: FieldSpec[] = [
  {
    key: 'ibccPercent',
    label: 'Cobb correction (IBCC)',
    help: 'Percent reduction in Cobb in the brace. Enter 60 for 60%.',
    unit: '%',
    slider: { min: -50, max: 190, step: 1 },
  },
  {
    key: 'avtcPercent',
    label: 'AVT correction (AVTc)',
    help: 'Percent reduction in apical vertebral translation. Negative if it worsened.',
    unit: '%',
    slider: { min: -60, max: 100, step: 1 },
  },
];

export const RADIOGRAPH_FIELDS: FieldSpec[] = [
  {
    key: 'inBraceCobbDegrees',
    label: 'In-brace major Cobb',
    help: 'Same curve as baseline. Negative if overcorrected.',
    unit: '°',
    slider: { min: -30, max: 45, step: 0.5 },
  },
  {
    key: 'baselineAvt',
    label: 'Baseline AVT',
    help: 'Any length unit, as long as both AVT values match.',
    unit: '',
  },
  {
    key: 'inBraceAvt',
    label: 'In-brace AVT',
    help: 'Same unit as baseline AVT.',
    unit: '',
  },
];

export const LABELS: Record<string, string> = {
  baselineSandersStage: 'Sanders stage',
  ...Object.fromEntries([COBB_FIELD, WEAR_FIELD, ...CORRECTION_FIELDS, ...RADIOGRAPH_FIELDS].map((f) => [f.key, f.label])),
};

/** Synthetic example from the package README — gives 4.7% in both modes. */
export const EXAMPLE: Record<string, string> = {
  baselineSandersStage: '3',
  baselineCobbDegrees: '30',
  averageWearHoursPerDay: '12',
  ibccPercent: '60',
  avtcPercent: '20',
  inBraceCobbDegrees: '12',
  baselineAvt: '25',
  inBraceAvt: '20',
};
