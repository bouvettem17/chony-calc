import { SANDERS_HELP } from '../fields';

const STAGES = ['2', '3', '4', '5', '6'];

/** Sanders is categorical in this model, so it's a choice of stage rather than a slider. */
export function SandersPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="field">
      <div className="field__text">
        <span id="sanders-label" className="field__label">Sanders stage</span>
        <p id="sanders-help" className="field__help">{SANDERS_HELP}</p>
      </div>
      <div className="segmented" role="radiogroup" aria-labelledby="sanders-label" aria-describedby="sanders-help">
        {STAGES.map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={value === s}
            className={value === s ? 'is-active' : ''}
            onClick={() => onChange(s)}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
