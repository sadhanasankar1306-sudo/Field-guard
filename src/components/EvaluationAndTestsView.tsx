import React, { useState } from 'react';
import { CheckCircle2, Play, RefreshCw, ShieldCheck, XCircle } from 'lucide-react';
import { AutomatedTestCaseResult } from '../shared/diagnosisTypes';
import {
  BENCHMARK_VS_FIELD_METRICS,
  DATASET_PROVENANCE,
  OPEN_SET_REJECTION_EVALUATION,
  SELECTIVE_RISK_COVERAGE_CURVE,
  TOP_CONFUSION_PAIRS,
} from '../shared/evaluationData';
import { MODEL_CALIBRATION_CONFIG, SUPPORTED_PLANTS } from '../shared/plantConfig';

export const EvaluationAndTestsView: React.FC = () => {
  const [testResults, setTestResults] = useState<AutomatedTestCaseResult[] | null>(null);
  const [runningTests, setRunningTests] = useState<boolean>(false);
  const [testExecutedAt, setTestExecutedAt] = useState<string | null>(null);
  const [testError, setTestError] = useState<string | null>(null);

  const handleRun18Tests = async () => {
    setRunningTests(true);
    setTestError(null);
    try {
      const res = await fetch('/api/test-suite', { method: 'POST' });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      setTestResults(data.results || []);
      setTestExecutedAt(data.executedAtIso || new Date().toISOString());
    } catch (err: any) {
      setTestError(err?.message || 'Failed to execute backend automated test suite.');
    } finally {
      setRunningTests(false);
    }
  };

  const passedCount = testResults ? testResults.filter((r) => r.passed).length : 0;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs text-slate-500 font-mono">
            Model: {MODEL_CALIBRATION_CONFIG.modelVersion} · Seed: {DATASET_PROVENANCE.randomSeed}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Scientific Evaluation & 18-Case Automated Verification Suite
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Classification accuracy on clean benchmark backgrounds does not guarantee field reliability. FieldGuard AI evaluates closed-set classification, temperature-scaled calibration, selective risk vs. coverage, and open-set rejection separately.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRun18Tests}
          disabled={runningTests}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          {runningTests ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Running 18 Verification Cases...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run All 18 Automated Test Cases
            </>
          )}
        </button>
      </div>

      {/* Interactive 18-Case Automated Test Runner Output */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Live End-to-End Automated Test Suite (18 Required Scenarios)
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Executes all 18 required test cases directly against the backend validation, quality, leaf verification, open-set rejection, and follow-up modules.
            </p>
          </div>
          {testResults && (
            <div className="font-mono tabular-nums text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              Passed: {passedCount} / {testResults.length} · Executed {new Date(testExecutedAt!).toLocaleTimeString()}
            </div>
          )}
        </div>

        {testError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800">
            Error running test suite: {testError}
          </div>
        )}

        {!testResults ? (
          <div className="p-8 bg-slate-50 border border-slate-200 rounded-lg text-center space-y-3">
            <ShieldCheck className="w-8 h-8 text-emerald-700 mx-auto" />
            <div className="text-sm font-semibold text-slate-900">
              Ready to Execute Reproducible 18-Case Verification Suite
            </div>
            <p className="text-xs text-slate-600 max-w-xl mx-auto">
              Click "Run All 18 Automated Test Cases" above to run live tests covering healthy & diseased supported plants, unsupported species (Banana), unfamiliar diseases, blurry/dark images, non-leaf photos, corrupted JPEG headers, disguised PDFs, missing uploads, model failure 503s, timeouts, follow-up refinement, and concurrent requests.
            </p>
            <button
              type="button"
              onClick={handleRun18Tests}
              disabled={runningTests}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              Execute 18 Test Cases Now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Scenario & Test ID</th>
                  <th className="py-2.5 px-3">Expected Behavior</th>
                  <th className="py-2.5 px-3">Actual Status & Gate</th>
                  <th className="py-2.5 px-3 text-right">Time</th>
                  <th className="py-2.5 px-3 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {testResults.map((tc) => (
                  <tr key={tc.testId} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-3 font-mono tabular-nums text-slate-500">
                      {String(tc.caseNumber).padStart(2, '0')}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">{tc.title}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{tc.testId} · {tc.category}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-xs">
                      <div>{tc.expectedBehavior}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{tc.verificationDetails}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums text-slate-800">
                      <div>{tc.actualStatusLabel}</div>
                      <div className="text-[11px] text-slate-500">
                        Gate: {tc.actualRejectionCategory}
                        {tc.calibratedConfidence !== null
                          ? ` · Conf: ${(tc.calibratedConfidence * 100).toFixed(1)}%`
                          : ''}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-600">
                      {tc.latencyMs} ms
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      {tc.passed ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-semibold">
                          <XCircle className="w-3.5 h-3.5" /> FAIL
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Benchmark vs Real-World Field Performance Comparison */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[BENCHMARK_VS_FIELD_METRICS.cleanBenchmark, BENCHMARK_VS_FIELD_METRICS.realWorldField].map(
          (m, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div>
                <div className="text-xs text-slate-500 font-mono">
                  n = {m.sampleCount.toLocaleString()} images · Independent Test Split
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{m.splitName}</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono tabular-nums">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[11px] text-slate-500">Top-1 Accuracy</div>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">
                    {(m.top1Accuracy * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[11px] text-slate-500">Macro F1</div>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">
                    {(m.macroF1 * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[11px] text-slate-500">Macro Precision</div>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">
                    {(m.macroPrecision * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[11px] text-slate-500">Macro Recall</div>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">
                    {(m.macroRecall * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 font-mono tabular-nums">
                <span>Calibrated ECE: {(m.expectedCalibrationError * 100).toFixed(2)}%</span>
                <span>·</span>
                <span>Brier Score: {m.brierScore.toFixed(3)}</span>
                <span>·</span>
                <span>Mean Latency: {m.meanInferenceLatencyMs} ms (p95: {m.p95InferenceLatencyMs} ms)</span>
              </div>
            </div>
          )
        )}
      </section>

      {/* Selective Risk vs Coverage & Temperature Calibration */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Selective Classification Risk vs. Prediction Coverage (Field Split)
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Demonstrates how abstaining and routing ambiguous cases to follow-up questions reduces diagnostic error rate from 14.4% (unfiltered) to 3.6% at the Outcome A threshold (p &ge; 0.72).
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse text-xs font-mono tabular-nums">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <th className="py-2.5 px-3">Confidence Threshold</th>
                  <th className="py-2.5 px-3 text-right">Prediction Coverage</th>
                  <th className="py-2.5 px-3 text-right">Abstained / Borderline</th>
                  <th className="py-2.5 px-3 text-right">Selective Accuracy</th>
                  <th className="py-2.5 px-3 text-right">Selective Risk (Error)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {SELECTIVE_RISK_COVERAGE_CURVE.map((row) => (
                  <tr
                    key={row.confidenceThreshold}
                    className={
                      row.confidenceThreshold === 0.72 ? 'bg-emerald-50/70 font-semibold' : ''
                    }
                  >
                    <td className="py-2.5 px-3">
                      {row.confidenceThreshold.toFixed(2)}
                      {row.confidenceThreshold === 0.72 && ' (Outcome A Policy)'}
                    </td>
                    <td className="py-2.5 px-3 text-right">{row.coveragePercent.toFixed(1)}%</td>
                    <td className="py-2.5 px-3 text-right">{row.abstainedPercent.toFixed(1)}%</td>
                    <td className="py-2.5 px-3 text-right text-emerald-800">
                      {row.selectiveAccuracyPercent.toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-right text-rose-700">
                      {row.selectiveRiskErrorPercent.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Dataset Provenance & Leakage Prevention
          </h3>
          <div className="space-y-2.5 text-xs text-slate-700">
            <div>
              <span className="font-semibold text-slate-900">Dataset:</span> {DATASET_PROVENANCE.name}
            </div>
            <div>
              <span className="font-semibold text-slate-900">Licensing:</span> {DATASET_PROVENANCE.license}
            </div>
            <div className="font-mono tabular-nums bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
              <div>Images Inspected: {DATASET_PROVENANCE.totalImagesInspected.toLocaleString()}</div>
              <div>Near-Duplicates Removed (pHash &le; 4): {DATASET_PROVENANCE.duplicatesRemovedByPhash.toLocaleString()}</div>
              <div>
                Splits: Train {DATASET_PROVENANCE.sessionGroupedSplits.train.toLocaleString()} · Val{' '}
                {DATASET_PROVENANCE.sessionGroupedSplits.validation.toLocaleString()} · Benchmark{' '}
                {DATASET_PROVENANCE.sessionGroupedSplits.benchmarkTest.toLocaleString()} · Field{' '}
                {DATASET_PROVENANCE.sessionGroupedSplits.realWorldFieldTest.toLocaleString()}
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong className="text-slate-800">Split Isolation Policy:</strong>{' '}
              {DATASET_PROVENANCE.leakagePreventionPolicy}
            </p>
          </div>
        </div>
      </section>

      {/* Open-Set & Unknown-Input Rejection Performance */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Unknown-Input & Out-of-Distribution Rejection Performance
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Evaluated across 1,410 out-of-domain inputs (non-leaf photos, unsupported plant species, unseen diseases/abiotic disorders, and degraded quality images).
            </p>
          </div>
          <div className="font-mono tabular-nums text-xs text-slate-800">
            Open-Set AUROC: <strong>{OPEN_SET_REJECTION_EVALUATION.aurocPercent}%</strong> · FPR@95%TPR:{' '}
            <strong>{OPEN_SET_REJECTION_EVALUATION.fprAt95TprPercent}%</strong>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <th className="py-2.5 px-3">Out-of-Distribution Category</th>
                <th className="py-2.5 px-3 text-right">Samples</th>
                <th className="py-2.5 px-3 text-right">True Rejection Rate</th>
                <th className="py-2.5 px-3 text-right">False Acceptance</th>
                <th className="py-2.5 px-3">Primary Rejection Mechanism & Known Limitation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {OPEN_SET_REJECTION_EVALUATION.categories.map((cat, i) => (
                <tr key={i}>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{cat.category}</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">{cat.sampleCount}</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-emerald-800 font-semibold">
                    {cat.trueRejectionRatePercent.toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-rose-700">
                    {cat.falseAcceptanceRatePercent.toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    <div className="font-medium text-slate-800">{cat.rejectionMechanism}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{cat.notes}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Per-Plant Performance & Top Confusion Pairs */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Performance by Supported Plant Species (9 Crops)
          </h3>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse text-xs font-mono tabular-nums">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <th className="py-2 px-3">Crop Species</th>
                  <th className="py-2 px-3 text-right">Classes</th>
                  <th className="py-2 px-3 text-right">Val N</th>
                  <th className="py-2 px-3 text-right">Benchmark F1</th>
                  <th className="py-2 px-3 text-right">Field F1</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {Object.values(SUPPORTED_PLANTS).map((p) => (
                  <tr key={p.id}>
                    <td className="py-2 px-3 font-sans">
                      <span className="font-semibold text-slate-900">{p.commonName}</span>
                      <span className="text-slate-500 block text-[11px] italic">{p.scientificName}</span>
                    </td>
                    <td className="py-2 px-3 text-right">{p.supportedClassIds.length}</td>
                    <td className="py-2 px-3 text-right">{p.validationSampleCount}</td>
                    <td className="py-2 px-3 text-right">{(p.speciesLevelF1Benchmark * 100).toFixed(1)}%</td>
                    <td className="py-2 px-3 text-right font-semibold text-emerald-800">
                      {(p.speciesLevelF1Field * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Primary Inter-Class Confusion Matrix Pairs & Mitigations
          </h3>
          <div className="space-y-3 text-xs">
            {TOP_CONFUSION_PAIRS.map((pair, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center justify-between font-mono tabular-nums">
                  <span className="font-semibold text-slate-900">
                    {pair.trueClassId} &harr; {pair.confusedWithClassId}
                  </span>
                  <span className="text-rose-700 font-semibold">
                    Confusion: {pair.errorRatePercent}%
                  </span>
                </div>
                <p className="text-slate-600">{pair.morphologicalReason}</p>
                <p className="text-emerald-800 font-medium">
                  Mitigation: {pair.mitigationInFieldGuard}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
