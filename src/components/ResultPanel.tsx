import type { EngineError, EngineResult, EngineWarning, Mode } from '../engine/chony';
import { referenceRange } from '../engine/chony';
import { LABELS } from '../fields';
import { PieChart } from './PieChart';

const UNITS: Record<string, string> = {
  baselineCobbDegrees: '°', averageWearHoursPerDay: ' h/day', ibccPercent: '%', avtcPercent: '%',
};
const fmt = (n: number) => String(Math.round(n * 10) / 10);

function warningText(w: EngineWarning): string {
  if (w.code === 'OUTSIDE_ELIGIBLE_COHORT_MARGINAL_RANGE') {
    const range = referenceRange(w.field);
    const label = LABELS[w.field] ?? w.field;
    return range
      ? `${label} is outside the range seen in the study cohort (${fmt(range[0])} to ${fmt(range[1])}${UNITS[w.field] ?? ''}), so treat this estimate with extra caution.`
      : w.message;
  }
  return w.message;
}

function errorText(e: EngineError): string {
  const label = LABELS[e.field] ?? 'every measurement';
  if (e.code === 'REQUIRED') return `Add a value for ${label} to see the estimate.`;
  if (e.code === 'FINITE_NUMBER_REQUIRED') return `${label} needs to be a number.`;
  return e.message;
}

interface Props {
  mode: Mode;
  result: EngineResult | null;
  error: EngineError | null;
  blank: boolean;
}

export function ResultPanel({ mode, result, error, blank }: Props) {
  const pct = result?.riskPercent ?? null;

  return (
    <section className="result" id="result" aria-live="polite" aria-labelledby="result-title">
      <h2 id="result-title" className="result__title">Estimated probability</h2>

      <div className="result__figure">
        <PieChart percent={pct} />
        <div className="result__value">
          <span className="result__number">{pct === null ? '—' : pct.toFixed(1)}</span>
          {pct !== null && <span className="result__pct">%</span>}
        </div>
      </div>

      {result ? (
        <>
          <p className="result__sentence">
            chance the major curve measures <strong>45° or more</strong> at final available follow-up.
          </p>
          <ul className="legend">
            <li><span className="legend__dot legend__dot--slice" />45° or more <b>{result.riskPercent.toFixed(1)}%</b></li>
            <li><span className="legend__dot legend__dot--rest" />Below 45° <b>{(100 - result.riskPercent).toFixed(1)}%</b></li>
          </ul>
          {mode === 'radiographs' && (
            <p className="result__derived">
              Corrections from the radiographs: IBCC {result.ibccPercent.toFixed(1)}%, AVTc {result.avtcPercent.toFixed(1)}%
            </p>
          )}
          {result.warnings.length > 0 && (
            <ul className="result__warnings">
              {result.warnings.map((w) => <li key={w.code + w.field}>{warningText(w)}</li>)}
            </ul>
          )}
          <p className="result__note">
            Follow-up length varied between patients, so this has no fixed time horizon. It is not a surgery risk.
          </p>
        </>
      ) : (
        <p className={blank ? 'result__empty' : 'result__error'} role={blank ? undefined : 'alert'}>
          {blank || !error ? 'Fill in the measurements to see the estimate.' : errorText(error)}
        </p>
      )}

      <button type="button" className="btn btn--primary result__print" onClick={() => window.print()} disabled={!result}>
        Print or save as PDF
      </button>
    </section>
  );
}
