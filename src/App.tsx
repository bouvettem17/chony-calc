import { useMemo, useState } from 'react';
import { calculate, FIELDS_BY_MODE, MODEL_VERSION, type Mode } from './engine/chony';
import { COBB_FIELD, CORRECTION_FIELDS, EXAMPLE, RADIOGRAPH_FIELDS, WEAR_FIELD, type FieldSpec } from './fields';
import { InputRow } from './components/InputRow';
import { SandersPicker } from './components/SandersPicker';
import { ResultPanel } from './components/ResultPanel';
import { About } from './components/About';
import { Disclosure } from './components/Disclosure';

const EMPTY: Record<string, string> = { ...Object.fromEntries(Object.keys(EXAMPLE).map((k) => [k, ''])), baselineSandersStage: '3' };

function Mark() {
  return (
    <svg className="brand__mark" viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill="#B9D9EB" />
      <path d="M20 20 L20 2 A18 18 0 0 1 35.6 11 Z" fill="#fff" />
    </svg>
  );
}

export default function App() {
  const [mode, setMode] = useState<Mode>('corrections');
  const [values, setValues] = useState<Record<string, string>>(EXAMPLE);
  const [agreed, setAgreed] = useState(false);

  // Recomputed on every edit, so a stale result can never be on screen.
  const outcome = useMemo(() => calculate(mode, values), [mode, values]);
  const result = outcome.ok ? outcome.result : null;
  const error = outcome.ok ? null : outcome.error;
  const blank = FIELDS_BY_MODE[mode].filter((k) => k !== 'baselineSandersStage').every((k) => !values[k]?.trim());

  const set = (key: string) => (v: string) => setValues((prev) => ({ ...prev, [key]: v }));
  const modeFields = mode === 'corrections' ? CORRECTION_FIELDS : RADIOGRAPH_FIELDS;
  const invalid = (key: string) =>
    !blank && (error?.field === key || (error?.field === 'corrections' && modeFields.some((f) => f.key === key)));
  const row = (f: FieldSpec) => (
    <InputRow key={f.key} spec={f} value={values[f.key]} invalid={invalid(f.key)} onChange={set(f.key)} />
  );

  return (
    <>
      <Disclosure open={!agreed} onAgree={() => setAgreed(true)} />

      <header className="masthead">
        <div className="masthead__inner">
          <a className="brand" href="#top">
            <Mark />
            <span className="brand__text">
              <span className="brand__name">CHONY Calc</span>
              <span className="brand__sub">Scoliosis bracing outcome calculator</span>
            </span>
          </a>
          <nav className="masthead__nav">
            <a href="#about">About the model</a>
            <button type="button" onClick={() => setAgreed(false)}>Disclosure</button>
          </nav>
        </div>
      </header>

      <div className="hero" id="top">
        <div className="hero__inner">
          <span className="tag">For research use</span>
          <h1>How likely is a braced curve to finish at 45° or more?</h1>
          <p>
            Enter the patient’s Sanders stage, curve size, brace wear and in-brace correction to estimate the
            probability that the major curve measures 45° or more at final follow-up.
          </p>
        </div>
      </div>

      <main>
        <div className="card">
          <form className="inputs" onSubmit={(e) => e.preventDefault()} aria-label="Patient measurements">
            <div className="inputs__head">
              <h2>Measurements</h2>
              <div className="inputs__tools">
                <button type="button" className="chip" onClick={() => setValues(EXAMPLE)}>Example</button>
                <button type="button" className="chip" onClick={() => setValues(EMPTY)}>Clear</button>
              </div>
            </div>

            <fieldset className="group">
              <legend>Before bracing</legend>
              <SandersPicker value={values.baselineSandersStage} onChange={set('baselineSandersStage')} />
              {row(COBB_FIELD)}
            </fieldset>

            <fieldset className="group">
              <legend>During bracing</legend>
              {row(WEAR_FIELD)}
              <p className="group__sub">In-brace correction</p>
              <div className="segmented segmented--mode" role="radiogroup" aria-label="How to enter in-brace correction">
                {(['corrections', 'radiographs'] as Mode[]).map((m) => (
                  <button key={m} type="button" role="radio" aria-checked={mode === m}
                    className={mode === m ? 'is-active' : ''} onClick={() => setMode(m)}>
                    {m === 'corrections' ? 'Enter % correction' : 'From radiographs'}
                  </button>
                ))}
              </div>
              {modeFields.map(row)}
            </fieldset>
          </form>

          <ResultPanel mode={mode} result={result} error={error} blank={blank} />
        </div>

        <About />
      </main>

      <footer className="site-footer">
        <div className="site-footer__inner">
          <span className="site-footer__brand"><Mark /> CHONY Calc</span>
          <p>Calculations run in your browser. Nothing you enter is saved or sent.</p>
          <button type="button" onClick={() => setAgreed(false)}>Disclosure</button>
        </div>
        <p className="print-only">Model {MODEL_VERSION}</p>
      </footer>

      <a className="mobile-bar" href="#result" aria-hidden="true" tabIndex={-1}>
        <strong>{result ? `${result.riskPercent.toFixed(1)}%` : '—'}</strong>
        <span>{result ? 'chance of 45° or more' : 'Fill in the measurements'}</span>
        <span className="mobile-bar__go">See result</span>
      </a>
    </>
  );
}
