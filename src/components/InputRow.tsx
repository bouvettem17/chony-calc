import type { CSSProperties } from 'react';
import type { FieldSpec } from '../fields';
import { parseField } from '../engine/chony';

interface Props {
  spec: FieldSpec;
  value: string;
  invalid: boolean;
  onChange: (value: string) => void;
}

/** Label and short help, a filled slider, and an exact number box. */
export function InputRow({ spec, value, invalid, onChange }: Props) {
  const id = `in-${spec.key}`;
  const helpId = `${id}-help`;
  const parsed = parseField(value);
  const finite = parsed !== null && Number.isFinite(parsed);
  const s = spec.slider;
  const sliderValue = s ? (finite ? Math.min(s.max, Math.max(s.min, parsed)) : s.min) : 0;
  const fill = s && finite ? ((sliderValue - s.min) / (s.max - s.min)) * 100 : 0;

  return (
    <div className={`field${invalid ? ' field--invalid' : ''}`}>
      <div className="field__text">
        <label htmlFor={id} className="field__label">{spec.label}</label>
        <p id={helpId} className="field__help">{spec.help}</p>
      </div>

      <div className="field__controls">
        {s ? (
          <input
            type="range"
            className="slider"
            tabIndex={-1}
            aria-hidden="true"
            min={s.min}
            max={s.max}
            step={s.step}
            value={sliderValue}
            style={{ '--fill': `${fill}%` } as CSSProperties}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <span />
        )}
        <div className="numbox">
          <input
            id={id}
            type="number"
            inputMode="decimal"
            step="any"
            value={value}
            placeholder="–"
            aria-describedby={helpId}
            aria-invalid={invalid || undefined}
            onChange={(e) => onChange(e.target.value)}
          />
          {spec.unit && <span className="numbox__unit">{spec.unit}</span>}
        </div>
      </div>
    </div>
  );
}
