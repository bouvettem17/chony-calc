# CHONY Calc (React)

Web front end for the **CHONY-FINAL45** model (final available major Cobb ≥45°).
Research prototype · internal validation only.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173, hot reload while you edit
npm test         # verifies the engine against 324 manuscript scenarios + 270 heatmap cells
npm run build    # static site in dist/ (relative paths, so it can go on any host)
npm run lint
```

## Where things live

| Path | What |
|---|---|
| `src/engine/CHONY_FINAL45_calculator.js` | **The model.** Verbatim copy of the shipped engine. Don't edit; replace the whole file if the model is updated, then run `npm test`. |
| `src/engine/chony.ts` | Typed wrapper: turns form text into engine input (blank becomes "required", never 0) and catches engine errors. |
| `src/fields.ts` | Labels, help text (from UI_COPY.md), slider ranges, example values. |
| `src/components/` | `InputRow` (slider + exact number box), `SandersPicker`, `Disclosure`, `PieChart` (animated, respects reduced motion), `ResultPanel`, `About`. |
| `src/App.tsx` | Layout and state. The result recomputes on every edit, so a stale result can't be on screen. |
| `src/index.css` | All styling. Columbia blue `#B9D9EB` + navy `#1D4F91`; tokens at the top of the file. |
| `tests/` | Engine verification + the exported aggregate CSVs it checks against. |

## Design decisions (from the model package's rules)

- Sanders is categorical in the model, so the UI uses buttons, not a slider.
- Sliders are a convenience only. The number box accepts anything the engine accepts, and out-of-cohort values are calculated with a warning, never clamped.
- No risk bands, quintiles, or "low/medium/high" labels. The output is a continuous probability with the UI_COPY context text.
- No storage, no network calls; fonts are bundled locally.

## Disclosure

`src/components/Disclosure.tsx` gates the calculator behind a disclosure on every page load (no storage, so nothing about the visitor is remembered). The wording is a **draft**. Have your institution's legal/compliance office review it before launch.

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` runs on every push to `main`: install → `npm test` → build → publish `dist/`.
If the engine tests fail, nothing is deployed. One-time setup: repo **Settings → Pages → Source: GitHub Actions**.
