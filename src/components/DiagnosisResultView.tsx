import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  FileWarning,
  HelpCircle,
  Layers,
  RefreshCw,
  ShieldAlert,
  Sliders,
} from 'lucide-react';
import { DiagnosisResponse } from '../shared/diagnosisTypes';

interface DiagnosisResultViewProps {
  result: DiagnosisResponse;
  previewUrl: string;
  filename: string;
  onStartNewScan: () => void;
  onUpdateResult: (updated: DiagnosisResponse) => void;
  onOpenDiseaseInLibrary: (classId: string) => void;
}

export const DiagnosisResultView: React.FC<DiagnosisResultViewProps> = ({
  result,
  previewUrl,
  filename,
  onStartNewScan,
  onUpdateResult,
  onOpenDiseaseInLibrary,
}) => {
  const [showSaliencyOverlay, setShowSaliencyOverlay] = useState<boolean>(true);
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, string>>({});
  const [submittingFollowUp, setSubmittingFollowUp] = useState<boolean>(false);
  const [followUpError, setFollowUpError] = useState<string | null>(null);
  const [imageLoadFailed, setImageLoadFailed] = useState<boolean>(false);

  const isAbstention = result.outcomeCode === 'OUTCOME_C_ABSTENTION';
  const isBorderline = result.outcomeCode === 'OUTCOME_B_BORDERLINE';
  const isReliable = result.outcomeCode === 'OUTCOME_A_RELIABLE';

  const handleFollowUpOptionChange = (questionId: string, value: string) => {
    setFollowUpAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmitFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(followUpAnswers).length === 0) {
      setFollowUpError('Please select at least one symptom observation before recalculating.');
      return;
    }
    setSubmittingFollowUp(true);
    setFollowUpError(null);
    try {
      const response = await fetch('/api/follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diagnosisId: result.diagnosisId,
          previousResponse: result,
          answers: followUpAnswers,
        }),
      });
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }
      const updated: DiagnosisResponse = await response.json();
      onUpdateResult(updated);
    } catch (err: any) {
      setFollowUpError(err?.message || 'Failed to submit follow-up answers.');
    } finally {
      setSubmittingFollowUp(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Diagnostic Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono tabular-nums mb-1.5">
            <span>ID: {result.diagnosisId}</span>
            <span aria-hidden="true">·</span>
            <span>Latency: {result.inferenceLatencyMs} ms</span>
            <span aria-hidden="true">·</span>
            <span>Model: {result.modelVersion}</span>
            <span aria-hidden="true">·</span>
            <span>File: {filename || 'uploaded_specimen'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Diagnostic Assessment Report
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onStartNewScan}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Analyze Another Leaf
          </button>
        </div>
      </div>

      {/* Primary Status Banner (Text-First Semantic Signaling) */}
      <div
        className={`p-5 rounded-xl border ${
          isReliable
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
            : isBorderline
            ? 'bg-amber-50/80 border-amber-200 text-amber-950'
            : 'bg-rose-50/80 border-rose-200 text-rose-950'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            {isReliable && <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />}
            {isBorderline && <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />}
            {isAbstention && <ShieldAlert className="w-6 h-6 text-rose-700 shrink-0 mt-0.5" />}
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider mb-1">
                <span className="font-semibold">Diagnostic Status: {result.statusLabel}</span>
                <span aria-hidden="true">·</span>
                <span>Uncertainty Level: {result.uncertainty.uncertaintyLevel}</span>
                {result.rejectionCategory !== 'NONE' && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>Gate: {result.rejectionCategory}</span>
                  </>
                )}
              </div>
              <p className="text-sm leading-relaxed opacity-90">
                {result.uncertainty.decisionPolicyExplanation}
              </p>
            </div>
          </div>

          {!isAbstention && result.primaryPrediction && (
            <div className="md:text-right shrink-0 font-mono tabular-nums">
              <div className="text-xs text-slate-600">Calibrated Probability (T={result.uncertainty.temperatureScalingFactor})</div>
              <div className="text-2xl font-bold text-slate-900">
                {(result.uncertainty.calibratedTop1Probability * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-slate-600">
                Top-2 Margin: {(result.uncertainty.top1ToTop2Margin * 100).toFixed(1)}%
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main 2-Column Split: Left Image + Pipeline Telemetry, Right Outcome Card + Evidence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Viewport & Saliency Overlay + 5-Stage Gate Checks */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
              <span className="text-xs font-semibold text-slate-700">
                Uploaded Specimen & Model Attention
              </span>
              {result.regionsOfInterest.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowSaliencyOverlay((v) => !v)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {showSaliencyOverlay ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-emerald-700" />
                      Hide Attention Overlay
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      Show Attention Overlay
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="relative aspect-4/3 bg-slate-900 flex items-center justify-center overflow-hidden">
              {previewUrl && !imageLoadFailed ? (
                <>
                  <img
                    src={previewUrl}
                    alt={filename || 'Uploaded leaf specimen for plant disease analysis'}
                    referrerPolicy="no-referrer"
                    onError={() => setImageLoadFailed(true)}
                    className="w-full h-full object-cover"
                  />
                  {showSaliencyOverlay &&
                    result.regionsOfInterest.map((roi) => (
                      <div
                        key={roi.id}
                        style={{
                          left: `${roi.xPercent}%`,
                          top: `${roi.yPercent}%`,
                          width: `${roi.widthPercent}%`,
                          height: `${roi.heightPercent}%`,
                        }}
                        className="absolute border-2 border-amber-400 bg-amber-400/15 rounded-md pointer-events-none transition-opacity"
                      >
                        <div className="bg-slate-950/85 text-white text-[11px] font-mono px-1.5 py-0.5 rounded-br-md inline-block max-w-full truncate">
                          {roi.label} ({Math.round(roi.attentionWeight * 100)}%)
                        </div>
                      </div>
                    ))}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center text-slate-300">
                  <FileWarning className="w-10 h-10 text-rose-400 mb-2" />
                  <p className="text-sm font-medium">No decodable visual frame available</p>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    MIME: {result.uploadValidation.detectedMimeType} · Magic: 0x
                    {result.uploadValidation.magicBytesHex.slice(0, 8) || 'NONE'}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 space-y-2">
              <p className="leading-relaxed">
                <strong className="text-slate-800">Explanation Caveat:</strong> {result.saliencyCaveat}
              </p>
            </div>
          </div>

          {/* 5-Stage Pipeline Verification Telemetry */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-900">
              5-Stage Pipeline Verification Gate Summary
            </h2>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex items-center justify-between gap-4">
                <span className="text-slate-600">1. Binary Upload Validation</span>
                <span className="font-mono tabular-nums font-medium text-slate-900">
                  {result.uploadValidation.valid ? 'PASSED' : 'REJECTED'} ·{' '}
                  {result.uploadValidation.detectedMimeType}{' '}
                  {result.uploadValidation.width && result.uploadValidation.height
                    ? `(${result.uploadValidation.width}×${result.uploadValidation.height} px)`
                    : ''}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between gap-4">
                <span className="text-slate-600">2. Focus & Exposure Quality</span>
                <span className="font-mono tabular-nums font-medium text-slate-900">
                  {result.imageQuality.sharpnessStatus} ({result.imageQuality.sharpnessScore}) ·{' '}
                  {result.imageQuality.exposureStatus}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between gap-4">
                <span className="text-slate-600">3. Botanical Leaf Verification</span>
                <span className="font-mono tabular-nums font-medium text-slate-900">
                  {result.leafVerification.isLeafImage ? 'Verified Leaf' : 'Non-Leaf Rejected'} (
                  {(result.leafVerification.leafConfidence * 100).toFixed(0)}%)
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between gap-4">
                <span className="text-slate-600">4. Open-Set Species Gate</span>
                <span className="font-mono tabular-nums font-medium text-slate-900">
                  {result.speciesIdentification.isSupportedSpecies
                    ? `${result.speciesIdentification.commonName} (${(
                        result.speciesIdentification.speciesConfidence * 100
                      ).toFixed(0)}%)`
                    : 'Unsupported Species'}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between gap-4">
                <span className="text-slate-600">5. OOD Distance & Entropy</span>
                <span className="font-mono tabular-nums font-medium text-slate-900">
                  OOD: {result.uncertainty.outOfDistributionScore.toFixed(2)} (Max 0.55) · H:{' '}
                  {result.uncertainty.normalizedShannonEntropy.toFixed(2)}
                </span>
              </div>
            </div>

            {result.imageQuality.qualityWarnings.length > 0 && (
              <div className="pt-3 border-t border-slate-200 space-y-1.5">
                <div className="text-xs font-semibold text-amber-800">Image Quality Notes:</div>
                {result.imageQuality.qualityWarnings.map((w, i) => (
                  <p key={i} className="text-xs text-slate-600 leading-relaxed">
                    • {w}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Primary Diagnosis / Abstention Card + Follow-Up Questions + Evidence */}
        <div className="lg:col-span-7 space-y-6">
          {/* ABSTENTION CARD (Replaces Prediction Card when Outcome C occurs) */}
          {isAbstention ? (
            <div className="bg-white border border-rose-200 rounded-xl p-6 space-y-5">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-6 h-6 text-rose-700 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-rose-700 font-semibold">
                    Outcome C · Safe Diagnostic Abstention
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    Unable to Diagnose Reliably — Prediction Suppressed
                  </h2>
                </div>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed bg-rose-50/60 p-4 rounded-lg border border-rose-100">
                {result.abstentionMessage}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-xs text-slate-500">Detected Input / Species Context</div>
                  <div className="text-sm font-semibold text-slate-900 mt-1">
                    {result.speciesIdentification.commonName}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    {result.leafVerification.detectedObjectSummary}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 font-mono tabular-nums">
                  <div className="text-xs text-slate-500">Rejection Gate & OOD Telemetry</div>
                  <div className="text-sm font-semibold text-slate-900 mt-1">
                    {result.rejectionCategory}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    OOD Score: {result.uncertainty.outOfDistributionScore.toFixed(2)} · Uncertainty:{' '}
                    {result.uncertainty.uncertaintyLevel}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Recommended Recovery & Next Steps
                </h3>
                <ul className="space-y-1.5 text-sm text-slate-700">
                  {result.nextStepsGuidance.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-mono text-xs text-slate-400 mt-0.5">0{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            /* SUPPORTED PREDICTION CARD (Outcome A or Outcome B) */
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-200">
                <div>
                  <div className="text-xs text-slate-500">
                    Crop: <strong className="text-slate-800">{result.speciesIdentification.commonName}</strong>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    Scientific Name: <em className="text-slate-800">{result.speciesIdentification.scientificName}</em>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mt-1">
                    {result.primaryPrediction?.commonName}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Causal Agent: <em className="font-medium">{result.primaryPrediction?.scientificAgent}</em>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    Status Label: <strong className="text-slate-900">{result.statusLabel}</strong>
                  </p>
                </div>

                {result.primaryPrediction && (
                  <button
                    type="button"
                    onClick={() => onOpenDiseaseInLibrary(result.primaryPrediction!.classId)}
                    className="px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    View Reference Entry
                  </button>
                )}
              </div>

              {result.speciesIdentification.taxonomicCaveat && (
                <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <strong className="text-slate-800">Taxonomic Granularity Note:</strong>{' '}
                  {result.speciesIdentification.taxonomicCaveat}
                </div>
              )}

              {/* Calibrated vs Uncalibrated Probability Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono tabular-nums">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[11px] text-slate-500">Calibrated Prob</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">
                    {(result.uncertainty.calibratedTop1Probability * 100).toFixed(1)}%
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Uncal: {((result.primaryPrediction?.uncalibratedSoftmax ?? 0) * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[11px] text-slate-500">Top-2 Margin</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">
                    {(result.uncertainty.top1ToTop2Margin * 100).toFixed(1)}%
                  </div>
                  <div className="text-[11px] text-slate-500">Min Reliable: 20.0%</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[11px] text-slate-500">Uncertainty</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">
                    {result.uncertainty.uncertaintyLevel}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Entropy: {result.uncertainty.normalizedShannonEntropy.toFixed(2)}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[11px] text-slate-500">OOD Distance</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">
                    {result.uncertainty.outOfDistributionScore.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-slate-500">Cutoff: 0.55</div>
                </div>
              </div>

              {result.followUpAuditNote && (
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs text-emerald-950">
                  <strong>Follow-Up Assessment Log:</strong> {result.followUpAuditNote}
                </div>
              )}
            </div>
          )}

          {/* OUTCOME B: Interactive Follow-Up Questions Module */}
          {result.followUpQuestions.length > 0 && (
            <form
              onSubmit={handleSubmitFollowUp}
              className="bg-amber-50/60 border border-amber-200 rounded-xl p-6 space-y-5"
            >
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Borderline Prediction — Focused Follow-Up Questions
                  </h3>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    Because the top candidate classes have overlapping visual features (margin{' '}
                    {(result.uncertainty.top1ToTop2Margin * 100).toFixed(1)}%), answer the field observations
                    below. Answers apply a validated Bayesian likelihood update and will abstain if observations
                    conflict with supported classes.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {result.followUpQuestions.map((q, qIdx) => (
                  <fieldset
                    key={q.id}
                    className="bg-white border border-slate-200 rounded-lg p-4 space-y-2.5"
                  >
                    <legend className="text-xs font-bold text-slate-900">
                      0{qIdx + 1}. {q.question}
                    </legend>
                    <p className="text-[11px] text-slate-500">{q.rationale}</p>
                    <div className="space-y-1.5 pt-1">
                      {q.options.map((opt) => (
                        <label
                          key={opt.value}
                          className="flex items-start gap-2.5 p-2 rounded-md hover:bg-slate-50 cursor-pointer text-xs text-slate-800"
                        >
                          <input
                            type="radio"
                            name={q.id}
                            value={opt.value}
                            checked={followUpAnswers[q.id] === opt.value}
                            onChange={() => handleFollowUpOptionChange(q.id, opt.value)}
                            className="mt-0.5 accent-emerald-700"
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>

              {followUpError && (
                <p className="text-xs text-rose-700 font-medium">{followUpError}</p>
              )}

              <div className="flex items-center justify-between gap-4 pt-1">
                <span className="text-xs text-slate-600">
                  Answering does not automatically inflate confidence; conflicting evidence triggers abstention.
                </span>
                <button
                  type="submit"
                  disabled={submittingFollowUp}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {submittingFollowUp ? 'Updating Posterior...' : 'Apply Symptom Evidence'}
                </button>
              </div>
            </form>
          )}

          {/* Visual Evidence & Ranked Candidate Conditions */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-700" />
                Distinguished Visual Evidence & Model Observations
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {result.visualObservations.map((obs, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="font-mono text-slate-400 shrink-0">0{idx + 1}.</span>
                    <span className="leading-relaxed">{obs}</span>
                  </li>
                ))}
              </ul>
            </div>

            {result.topCandidates.length > 0 && (
              <div className="pt-5 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-700" />
                    Ranked Candidate Conditions (Temperature-Calibrated Scores)
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">T = {result.uncertainty.temperatureScalingFactor}</span>
                </div>

                <div className="space-y-3">
                  {result.topCandidates.map((cand, idx) => {
                    const pct = (cand.calibratedProbability * 100).toFixed(1);
                    return (
                      <div
                        key={cand.classId}
                        className="p-3 rounded-lg border border-slate-200 bg-slate-50/60"
                      >
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <div>
                            <span className="font-mono text-slate-400 mr-2">#{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => onOpenDiseaseInLibrary(cand.classId)}
                              className="font-semibold text-slate-900 hover:text-emerald-700 hover:underline cursor-pointer"
                            >
                              {cand.commonName}
                            </button>
                            <span className="text-slate-500 ml-2 italic">{cand.scientificAgent}</span>
                          </div>
                          <div className="font-mono tabular-nums font-semibold text-slate-900">
                            {pct}%{' '}
                            <span className="text-[11px] font-normal text-slate-500">
                              (logit {cand.rawLogitScore >= 0 ? `+${cand.rawLogitScore}` : cand.rawLogitScore})
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              idx === 0 ? 'bg-emerald-700' : 'bg-slate-400'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(2, cand.calibratedProbability * 100))}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Agricultural Reference Guidance (Only when a supported class is identified) */}
          {result.knowledgeBaseEntry && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <div className="border-b border-slate-200 pb-3">
                <div className="text-xs text-slate-500">
                  Agricultural Reference Information · Host: {result.knowledgeBaseEntry.supportedHostPlants.join(', ')}
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Management Guidance & Differential Diagnosis for {result.knowledgeBaseEntry.commonName}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900">General Prevention Measures</h4>
                  <ul className="space-y-1.5 text-slate-700">
                    {result.knowledgeBaseEntry.generalPreventionMeasures.map((m, i) => (
                      <li key={i} className="leading-relaxed">• {m}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900">Appropriate Next Steps</h4>
                  <ul className="space-y-1.5 text-slate-700">
                    {result.knowledgeBaseEntry.appropriateNextSteps.map((s, i) => (
                      <li key={i} className="leading-relaxed">• {s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {result.knowledgeBaseEntry.differentialDiagnoses.length > 0 && (
                <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-900">Important Differential Diagnoses (Look-Alikes)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.knowledgeBaseEntry.differentialDiagnoses.map((d, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="font-semibold text-slate-900">{d.condition}</div>
                        <p className="text-slate-600 mt-1 leading-relaxed">{d.distinguishingFeature}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 text-xs text-slate-500 space-y-1">
                <div>
                  <strong className="text-slate-700">Reference Sources:</strong>{' '}
                  {result.knowledgeBaseEntry.referenceSources
                    .map((r) => `${r.title} (${r.institution})`)
                    .join(' · ')}
                </div>
              </div>
            </div>
          )}

          {/* Preliminary Screening & Limitations Footer Box */}
          <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-2">
            <div className="font-semibold text-slate-800">Preliminary Screening Disclaimer & Dataset Limitations</div>
            <p className="leading-relaxed">{result.disclaimer}</p>
            {result.uncertainty.datasetLimitationNotes.map((note, idx) => (
              <p key={idx} className="leading-relaxed text-slate-500">
                • {note}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
