/* CHONY Calc — final available Cobb >=45. Research prototype.
 * Model specification and source precision are embedded below. No network or storage.
 * Browser global: CHONYFinal45. CommonJS: require('./CHONY_FINAL45_calculator.js').
 */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CHONYFinal45 = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const model = {
  "schemaVersion": "1.0.0",
  "modelVersion": "CHONY-FINAL45-5P-SANDERS-CAT-2026-11-06",
  "name": "CHONY Calc — final available Cobb ≥45°",
  "modelType": "Ridge logistic regression; unpenalized intercept",
  "releaseStatus": "Research prototype; internal validation only",
  "defaultPredictionVariant": "raw_full_data_fit",
  "outcome": {
    "label": "Final available major Cobb ≥45°",
    "baselineEligibility": "Baseline major Cobb <45°",
    "timeHorizon": "Final available follow-up; varies by patient",
    "fixedTimeHorizon": false,
    "surgeryEndpoint": false,
    "outcomeSelectedExploratorily": true
  },
  "cohort": {
    "sourceRows": 107,
    "endpointEligibleN": 105,
    "endpointEligibleEvents": 13,
    "primaryCompleteCaseN": 98,
    "primaryEvents": 13,
    "baselineSandersStages": [
      2,
      3,
      4,
      5,
      6
    ],
    "baselineSandersStageCounts": {
      "2": 16,
      "3": 57,
      "4": 14,
      "5": 10,
      "6": 1
    },
    "clinicalContext": "AIS bracing research cohort; no eligible patient below age 10",
    "followUpYearsEligible105": {
      "median": 2.166667,
      "min": 0.325804,
      "max": 5.25
    },
    "eligibilityNotGeneralBracingIndication": true
  },
  "clinicalPredictorCount": 5,
  "designSlopeCount": 6,
  "coefficientPrecision": {
    "source": "Six-decimal aggregate coefficient export",
    "fullPrecisionFitAvailable": false,
    "calculations": "Use these decimals as shipped, with double precision; round only for display",
    "sourceScenarioAbsoluteProbabilityTolerance": 1e-05
  },
  "intercept": -5.46216,
  "terms": [
    {
      "sourceTerm": "baseline_cobb",
      "input": "baselineCobbDegrees",
      "coefficient": 0.191268,
      "unit": "1 degree",
      "transform": "identity"
    },
    {
      "sourceTerm": "wear",
      "input": "averageWearHoursPerDay",
      "coefficient": -0.195699,
      "unit": "1 observed hour/day",
      "transform": "identity"
    },
    {
      "sourceTerm": "ibcc",
      "input": "ibccPercent",
      "coefficient": -0.005381,
      "unit": "1 percentage point",
      "transform": "identity"
    },
    {
      "sourceTerm": "avtc",
      "input": "avtcPercent",
      "coefficient": -0.030268,
      "unit": "1 percentage point",
      "transform": "identity"
    },
    {
      "sourceTerm": "cat_s2",
      "input": "baselineSandersStage",
      "coefficient": 1.287284,
      "unit": "indicator",
      "transform": "stage === 2 ? 1 : 0"
    },
    {
      "sourceTerm": "cat_s46",
      "input": "baselineSandersStage",
      "coefficient": 0.451141,
      "unit": "indicator",
      "transform": "stage in [4,5,6] ? 1 : 0"
    }
  ],
  "sandersCoding": {
    "reference": 3,
    "stage2Indicator": [
      2
    ],
    "stage46Indicator": [
      4,
      5,
      6
    ]
  },
  "link": "expit(eta) = 1 / (1 + exp(-eta))",
  "correctionFormulas": {
    "ibccPercent": "100 * (baselineCobbDegrees - inBraceCobbDegrees) / baselineCobbDegrees",
    "avtcPercent": "100 * (abs(baselineAvt) - abs(inBraceAvt)) / abs(baselineAvt)",
    "signedCobbPreserved": true,
    "avtUsesMagnitudes": true,
    "negativeCorrectionsPreserved": true,
    "baselineDenominatorsMustBeNonzero": true
  },
  "inputRules": {
    "baselineCobbDegrees": {
      "type": "number",
      "exclusiveMin": 0,
      "exclusiveMax": 45
    },
    "averageWearHoursPerDay": {
      "type": "number",
      "min": 0,
      "max": 24,
      "timing": "Observed average over the bracing course; AverageHoursWornFT"
    },
    "baselineSandersStage": {
      "type": "integer",
      "enum": [
        2,
        3,
        4,
        5,
        6
      ]
    },
    "ibccPercent": {
      "type": "number",
      "units": "percentage points; enter 60 for 60%"
    },
    "avtcPercent": {
      "type": "number",
      "max": 100,
      "units": "percentage points; enter 20 for 20%"
    },
    "inBraceCobbDegrees": {
      "type": "number",
      "signed": true
    },
    "baselineAvt": {
      "type": "number",
      "nonzero": true,
      "units": "same linear unit as inBraceAvt"
    },
    "inBraceAvt": {
      "type": "number",
      "units": "same linear unit as baselineAvt"
    },
    "allNumbersMustBeFinite": true,
    "numericStringsAccepted": false,
    "missingValuesImputed": false,
    "unknownInputFieldsAccepted": false
  },
  "marginalReferenceRanges": {
    "sourcePopulation": "All 105 endpoint-eligible records; not exact 98-case fit support or joint support",
    "sourceFile": "16_table1_numeric_full_and_by_outcome.csv",
    "action": "Warn only; do not clamp or claim validity within the ranges",
    "baselineCobbDegrees": [
      14.76,
      42.0
    ],
    "averageWearHoursPerDay": [
      0.8,
      21.5
    ],
    "ibccPercent": [
      0.0,
      185.714286
    ],
    "avtcPercent": [
      -50.490731,
      73.94958
    ]
  },
  "output": {
    "probability": "0–1",
    "riskPercent": "0–100",
    "displayDecimalPlaces": 1,
    "clinicalRiskCategory": null,
    "quintileAssignment": null,
    "recommendedWearHours": null
  },
  "recalibrationApplied": false,
  "restrictions": [
    "Whole-course wear is not known at brace initiation.",
    "Scenario differences are associations, not causal treatment effects or recommended wear hours.",
    "No external validation or individual prediction interval is supplied.",
    "Do not use first-CV quintiles as fixed calculator risk bands.",
    "No automatic low/medium/high label or treatment recommendation is implemented."
  ]
};
  function freeze(value) {
    if (value && typeof value === 'object') {
      Object.keys(value).forEach(key => freeze(value[key]));
      Object.freeze(value);
    }
    return value;
  }
  freeze(model);
  class CHONYInputError extends Error {
    constructor(field, code, message) {
      super(message); this.name = 'CHONYInputError'; this.field = field; this.code = code;
    }
  }
  function fail(field, code, message) { throw new CHONYInputError(field, code, message); }
  function shape(input, allowed) {
    if (!input || typeof input !== 'object' || Array.isArray(input))
      fail('input', 'INVALID_OBJECT', 'Provide an input object.');
    for (const key of Object.keys(input)) {
      if (!allowed.includes(key)) fail(key, 'UNEXPECTED_FIELD', 'Unexpected field for this input mode: ' + key);
    }
  }
  function number(input, field) {
    if (!Object.prototype.hasOwnProperty.call(input, field) || input[field] === null || input[field] === undefined)
      fail(field, 'REQUIRED', 'Enter ' + field + '.');
    const value = input[field];
    if (typeof value !== 'number' || !Number.isFinite(value))
      fail(field, 'FINITE_NUMBER_REQUIRED', field + ' must be a finite number; blanks and numeric strings are not accepted.');
    return value;
  }
  function common(input) {
    const stage = number(input, 'baselineSandersStage');
    if (!Number.isInteger(stage) || ![2,3,4,5,6].includes(stage))
      fail('baselineSandersStage', 'SANDERS_OUT_OF_SCOPE', 'Use an integer baseline Sanders stage from 2 through 6.');
    const cobb = number(input, 'baselineCobbDegrees');
    if (!(cobb > 0 && cobb < 45))
      fail('baselineCobbDegrees', 'BASELINE_COBB_OUT_OF_SCOPE', 'Baseline major Cobb must be greater than 0 and less than 45 degrees.');
    const wear = number(input, 'averageWearHoursPerDay');
    if (!(wear >= 0 && wear <= 24))
      fail('averageWearHoursPerDay', 'WEAR_OUT_OF_RANGE', 'Observed average wear must be between 0 and 24 hours/day.');
    return { baselineSandersStage: stage, baselineCobbDegrees: cobb, averageWearHoursPerDay: wear };
  }
  function warningList(x) {
    const list = [];
    for (const key of ['baselineCobbDegrees','averageWearHoursPerDay','ibccPercent','avtcPercent']) {
      const range = model.marginalReferenceRanges[key];
      if (x[key] < range[0] || x[key] > range[1]) list.push({
        field: key, code: 'OUTSIDE_ELIGIBLE_COHORT_MARGINAL_RANGE',
        message: key + ' is outside the observed marginal range in the 105-person eligible cohort (' + range.join(' to ') + '). Joint support and applicability are unverified.'
      });
    }
    if (x.baselineSandersStage === 6) list.push({field:'baselineSandersStage',code:'SPARSE_STAGE_6',
      message:'Only one stage-6 patient was in the primary cohort. Stages 4–6 share a pooled coefficient.'});
    return list;
  }
  function predict(x, mode) {
    if (!Number.isFinite(x.ibccPercent) || !Number.isFinite(x.avtcPercent))
      fail('corrections', 'NUMERIC_OVERFLOW', 'Correction calculation exceeded the finite numeric range.');
    if (x.avtcPercent > 100)
      fail('avtcPercent', 'AVTC_ABOVE_100', 'AVTc cannot exceed 100% with the magnitude-based definition.');
    const indicators = {cat_s2: x.baselineSandersStage === 2 ? 1 : 0,
                        cat_s46: x.baselineSandersStage >= 4 ? 1 : 0};
    const values = {baseline_cobb:x.baselineCobbDegrees,wear:x.averageWearHoursPerDay,
                    ibcc:x.ibccPercent,avtc:x.avtcPercent,...indicators};
    let eta = model.intercept;
    for (const term of model.terms) eta += term.coefficient * values[term.sourceTerm];
    if (!Number.isFinite(eta)) fail('input', 'NUMERIC_OVERFLOW', 'Log odds exceeded the finite numeric range.');
    const exponential = Math.exp(-Math.abs(eta));
    const p = eta >= 0 ? 1 / (1 + exponential) : exponential / (1 + exponential);
    return {
      modelVersion:model.modelVersion, predictionVariant:model.defaultPredictionVariant,
      outcome:model.outcome.label, inputMode:mode, probability:p, riskPercent:100*p,
      logOdds:eta, ibccPercent:x.ibccPercent, avtcPercent:x.avtcPercent,
      sandersIndicators:indicators, inputs:{...x}, warnings:warningList(x)
    };
  }
  const shared = ['baselineSandersStage','baselineCobbDegrees','averageWearHoursPerDay'];
  function calculateFromCorrections(input) {
    shape(input, [...shared,'ibccPercent','avtcPercent']);
    const x = common(input);
    x.ibccPercent = number(input, 'ibccPercent');
    x.avtcPercent = number(input, 'avtcPercent');
    return predict(x, 'corrections');
  }
  function calculateFromRadiographs(input) {
    shape(input, [...shared,'inBraceCobbDegrees','baselineAvt','inBraceAvt']);
    const x = common(input);
    const inCobb = number(input, 'inBraceCobbDegrees');
    const baseAvt = number(input, 'baselineAvt');
    const inAvt = number(input, 'inBraceAvt');
    if (baseAvt === 0) fail('baselineAvt', 'ZERO_AVT_DENOMINATOR', 'Baseline AVT must be nonzero to calculate percentage correction.');
    x.ibccPercent = 100 * (x.baselineCobbDegrees - inCobb) / x.baselineCobbDegrees;
    x.avtcPercent = 100 * (Math.abs(baseAvt) - Math.abs(inAvt)) / Math.abs(baseAvt);
    const result = predict(x, 'radiographs');
    result.radiographs = {inBraceCobbDegrees:inCobb,baselineAvt:baseAvt,inBraceAvt:inAvt};
    return result;
  }
  return Object.freeze({model, modelVersion:model.modelVersion, CHONYInputError,
                        calculateFromCorrections, calculateFromRadiographs});
});
