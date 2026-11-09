'use strict';
// Verifies the vendored engine (src/engine/CHONY_FINAL45_calculator.js) against the
// shipped aggregate exports. Adapted from the package's test_CHONY_FINAL45_calculator.cjs.
// Run: npm test
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const enginePath = path.join(__dirname, '..', 'src', 'engine', 'CHONY_FINAL45_calculator.js');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(enginePath, 'utf8'), sandbox, { timeout: 2000 });
const engine = sandbox.CHONYFinal45;

let checks = 0;
const check = (v, m) => { checks++; assert.ok(v, m); };
const equal = (a, e, m) => { checks++; assert.deepEqual(a, e, m); };
const near = (a, e, tol = 1e-12, m = 'Numeric mismatch') =>
  check(Number.isFinite(a) && Math.abs(a - e) <= tol, `${m}: ${a} vs ${e} (tol=${tol})`);
const run = (inputs, mode = 'corrections') =>
  mode === 'radiographs' ? engine.calculateFromRadiographs(inputs) : engine.calculateFromCorrections(inputs);
function error(inputs, field, code, mode = 'corrections') {
  let caught;
  try { run(inputs, mode); } catch (e) { caught = e; }
  check(caught && caught.name === 'CHONYInputError', `Expected CHONYInputError for ${field}/${code}`);
  equal(caught.field, field, 'Wrong error field');
  equal(caught.code, code, 'Wrong error code');
}
function csv(name) {
  const content = fs.readFileSync(path.join(__dirname, 'data', name), 'utf8').replace(/^﻿/, '');
  const rows = []; let row = [], field = '', quoted = false;
  for (let i = 0; i < content.length; i++) {
    const c = content[i];
    if (c === '"') { if (quoted && content[i + 1] === '"') { field += '"'; i++; } else quoted = !quoted; }
    else if (c === ',' && !quoted) { row.push(field); field = ''; }
    else if ((c === '\n' || c === '\r') && !quoted) {
      if (c === '\r' && content[i + 1] === '\n') i++;
      row.push(field); field = ''; if (row.some(x => x !== '')) rows.push(row); row = [];
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  const headers = rows.shift();
  return rows.map(v => Object.fromEntries(headers.map((h, i) => [h, v[i]])));
}

// Coefficients exactly as published in the README / model.json
const model = engine.model;
equal(engine.modelVersion, 'CHONY-FINAL45-5P-SANDERS-CAT-2026-11-06');
equal(model.intercept, -5.46216);
equal(Object.fromEntries(model.terms.map(t => [t.sourceTerm, t.coefficient])), {
  baseline_cobb: 0.191268, wear: -0.195699, ibcc: -0.005381, avtc: -0.030268, cat_s2: 1.287284, cat_s46: 0.451141,
});
equal(model.marginalReferenceRanges.ibccPercent[1], 185.714286);
equal(model.marginalReferenceRanges.avtcPercent[0], -50.490731);
check(Object.isFrozen(model) && Object.isFrozen(model.terms), 'Model must be immutable');

// Reference example: 4.7%
const x = { baselineSandersStage: 3, baselineCobbDegrees: 30, averageWearHoursPerDay: 12, ibccPercent: 60, avtcPercent: 20 };
const ref = run(x);
near(ref.probability, 0.047392995403105424);
equal(ref.riskPercent.toFixed(1), '4.7');
near(run({ ...x, baselineSandersStage: 2 }).logOdds - ref.logOdds, 1.287284);
const p4 = run({ ...x, baselineSandersStage: 4 });
for (const s of [5, 6]) near(run({ ...x, baselineSandersStage: s }).probability, p4.probability);

// Radiograph mode fixtures (from CHONY_FINAL45_test_cases.json)
const raw = { baselineSandersStage: 3, baselineCobbDegrees: 30, averageWearHoursPerDay: 12, inBraceCobbDegrees: 12, baselineAvt: 25, inBraceAvt: 20 };
for (const [b, a] of [[25, 20], [-25, -20], [25, -20], [-25, 20]])
  near(run({ ...raw, baselineAvt: b, inBraceAvt: a }, 'radiographs').probability, ref.probability);
near(run({ ...raw, inBraceCobbDegrees: 0, inBraceAvt: 0 }, 'radiographs').probability, 0.00354944594263825);
const over = run({ ...raw, inBraceCobbDegrees: -18 }, 'radiographs');
near(over.ibccPercent, 160); near(over.probability, 0.028227418901091476);
const worse = run({ ...raw, inBraceCobbDegrees: 40, inBraceAvt: 30 }, 'radiographs');
near(worse.ibccPercent, -33.333333333333336); near(worse.avtcPercent, -20); near(worse.probability, 0.21622857991542999);

// Invalid inputs
for (const key of Object.keys(x)) {
  for (const v of [NaN, Infinity, -Infinity, '', '3', true, [], {}]) error({ ...x, [key]: v }, key, 'FINITE_NUMBER_REQUIRED');
  error({ ...x, [key]: null }, key, 'REQUIRED');
  const missing = { ...x }; delete missing[key]; error(missing, key, 'REQUIRED');
}
for (const s of [0, 1, 7, 8, -1, 2.5]) error({ ...x, baselineSandersStage: s }, 'baselineSandersStage', 'SANDERS_OUT_OF_SCOPE');
for (const c of [0, -1, 45, 50]) error({ ...x, baselineCobbDegrees: c }, 'baselineCobbDegrees', 'BASELINE_COBB_OUT_OF_SCOPE');
for (const w of [-0.1, 24.1]) error({ ...x, averageWearHoursPerDay: w }, 'averageWearHoursPerDay', 'WEAR_OUT_OF_RANGE');
error({ ...x, avtcPercent: 100.1 }, 'avtcPercent', 'AVTC_ABOVE_100');
error({ ...x, inBraceCobbDegrees: 12 }, 'inBraceCobbDegrees', 'UNEXPECTED_FIELD');
error({ ...raw, avtcPercent: 20 }, 'avtcPercent', 'UNEXPECTED_FIELD', 'radiographs');
error({ ...raw, baselineAvt: 0 }, 'baselineAvt', 'ZERO_AVT_DENOMINATOR', 'radiographs');
check(run({ ...x, baselineSandersStage: 6 }).warnings.some(w => w.code === 'SPARSE_STAGE_6'));
check(run({ ...x, averageWearHoursPerDay: 24 }).warnings.some(w => w.field === 'averageWearHoursPerDay'));

// 324 manuscript scenarios (six-decimal export, 1e-5) and 270 heatmap cells (1e-12)
const scen = csv('manuscript_scenarios.csv'); equal(scen.length, 324);
let maxScen = 0;
for (const s of scen) {
  const p = run({ baselineSandersStage: +s.Sanders_stage, baselineCobbDegrees: +s.baseline_cobb,
    averageWearHoursPerDay: +s.observed_wear, ibccPercent: +s.IBCC_percent, avtcPercent: +s.AVTc_percent }).probability;
  maxScen = Math.max(maxScen, Math.abs(p - +s.fitted_risk)); near(p, +s.fitted_risk, 1e-5, 'Manuscript scenario');
}
const heat = csv('updated_heatmap_grid.csv'); equal(heat.length, 270);
let maxHeat = 0;
for (const s of heat) {
  const r = run({ baselineSandersStage: +s.Sanders, baselineCobbDegrees: +s.baseline_cobb,
    averageWearHoursPerDay: +s.wear, ibccPercent: +s.ibcc, avtcPercent: +s.avtc });
  maxHeat = Math.max(maxHeat, Math.abs(r.probability - +s.fitted_probability));
  near(r.probability, +s.fitted_probability, 1e-12, 'Heatmap cell');
  equal(r.riskPercent < 1 ? '<1' : String(Math.round(r.riskPercent)), s.display_percent, 'Heatmap display');
}

console.log(`PASS — ${checks} assertions. 324 scenarios (max diff ${maxScen.toExponential(2)}), 270 heatmap cells (max diff ${maxHeat.toExponential(2)}).`);
