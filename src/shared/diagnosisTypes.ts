import { PlantSpeciesId } from './plantConfig';
import { DiseaseKnowledgeEntry, FollowUpQuestion } from './diseaseKnowledgeBase';

export type DiagnosticOutcomeCode = 'OUTCOME_A_RELIABLE' | 'OUTCOME_B_BORDERLINE' | 'OUTCOME_C_ABSTENTION';

export type DiagnosticStatusLabel =
  | 'Reliable prediction'
  | 'Needs further assessment'
  | 'Unable to diagnose reliably';

export type UncertaintyLevel = 'Low' | 'Moderate' | 'High';

export type RejectionCategory =
  | 'NONE'
  | 'INVALID_UPLOAD_OR_CORRUPTED'
  | 'UNSUPPORTED_FILE_FORMAT'
  | 'INSUFFICIENT_IMAGE_QUALITY'
  | 'NOT_A_LEAF_IMAGE'
  | 'UNSUPPORTED_PLANT_SPECIES'
  | 'UNKNOWN_OR_MIXED_CONDITION'
  | 'LOW_CONFIDENCE_ABSTENTION'
  | 'MODEL_INFERENCE_FAILURE';

export interface ClientImageTelemetry {
  width: number;
  height: number;
  meanBrightness: number; // 0..255
  brightnessStdDev: number;
  laplacianVarianceSharpness: number; // Focus / blur estimate
  greenFoliageRatio: number; // 0..1
  lesionColorRatio: number; // 0..1 (brown/yellow/necrotic pixel ratio)
  centerSubjectOccupancy: number; // 0..1
  dominantRgb: [number, number, number];
}

export interface UploadValidationReport {
  valid: boolean;
  detectedMimeType: string;
  fileSizeBytes: number;
  width: number | null;
  height: number | null;
  magicBytesHex: string;
  hasUsableVisualContent: boolean;
  validationErrors: string[];
}

export interface ImageQualityReport {
  passed: boolean;
  overallQualityScore: number; // 0..100
  sharpnessScore: number;
  sharpnessStatus: 'Sharp' | 'Slightly Soft' | 'Blurry / Out of Focus';
  exposureBrightness: number; // 0..255
  exposureStatus: 'Well Exposed' | 'Underexposed (Too Dark)' | 'Overexposed (Clipped)';
  resolutionStatus: 'Adequate' | 'Low Resolution';
  leafVisibilityRatio: number; // 0..1
  leafVisibilityStatus: 'Clear Leaf Occupancy' | 'Leaf Too Small in Frame' | 'Obstructed / Minimal Leaf';
  complexBackgroundDetected: boolean;
  qualityWarnings: string[];
}

export interface LeafVerificationReport {
  isLeafImage: boolean;
  leafConfidence: number; // 0..1
  detectedObjectSummary: string;
  rejectionReason?: string;
}

export interface SpeciesCandidate {
  plantId: PlantSpeciesId | 'unsupported';
  commonName: string;
  scientificName: string;
  probability: number;
}

export interface SpeciesIdentificationReport {
  isSupportedSpecies: boolean;
  identifiedPlantId: PlantSpeciesId | null;
  commonName: string;
  scientificName: string;
  speciesConfidence: number; // 0..1
  isSpeciesAmbiguous: boolean;
  detectedUnsupportedPlantName?: string;
  candidateSpecies: SpeciesCandidate[];
  taxonomicCaveat?: string;
}

export interface CandidatePrediction {
  classId: string;
  commonName: string;
  scientificAgent: string;
  plantId: PlantSpeciesId;
  isHealthy: boolean;
  rawLogitScore: number;
  uncalibratedSoftmax: number;
  calibratedProbability: number;
}

export interface UncertaintyReport {
  uncertaintyLevel: UncertaintyLevel;
  calibratedTop1Probability: number;
  top1ToTop2Margin: number;
  normalizedShannonEntropy: number; // 0..1
  outOfDistributionScore: number; // 0..1 (lower is more in-distribution)
  temperatureScalingFactor: number;
  isPlantClassConsistent: boolean;
  decisionPolicyExplanation: string;
  datasetLimitationNotes: string[];
}

export interface VisualEvidenceRegion {
  id: string;
  label: string;
  xPercent: number; // 0..100
  yPercent: number; // 0..100
  widthPercent: number; // 0..100
  heightPercent: number; // 0..100
  attentionWeight: number; // 0..1
  observationType: 'Image Observation' | 'Model Saliency Explanation';
  description: string;
}

export interface DiagnosisResponse {
  diagnosisId: string;
  timestampIso: string;
  inferenceLatencyMs: number;
  modelVersion: string;
  inferenceEngineMode: 'Gemini-Vision-Calibrated-Ensemble' | 'Spectral-Morphological-Calibrated-Fallback';
  outcomeCode: DiagnosticOutcomeCode;
  statusLabel: DiagnosticStatusLabel;
  rejectionCategory: RejectionCategory;
  abstentionMessage: string | null;
  recoveryInstructions: string[];

  // Pipeline stage reports
  uploadValidation: UploadValidationReport;
  imageQuality: ImageQualityReport;
  leafVerification: LeafVerificationReport;
  speciesIdentification: SpeciesIdentificationReport;
  uncertainty: UncertaintyReport;

  // Predictions & Visual Evidence
  primaryPrediction: CandidatePrediction | null;
  topCandidates: CandidatePrediction[];
  visualObservations: string[];
  regionsOfInterest: VisualEvidenceRegion[];
  saliencyCaveat: string;

  // Interactive Follow-up (Outcome B)
  followUpRequired: boolean;
  followUpQuestions: FollowUpQuestion[];
  followUpCompleted?: boolean;
  followUpAuditNote?: string;

  // Knowledge Base Entry (when supported plant/condition is identified)
  knowledgeBaseEntry: DiseaseKnowledgeEntry | null;
  nextStepsGuidance: string[];
  disclaimer: string;
}

export interface FollowUpSubmissionRequest {
  diagnosisId: string;
  previousResponse: DiagnosisResponse;
  answers: Record<string, string>; // questionId -> optionValue
  confirmedPlantId?: PlantSpeciesId;
}

export interface AutomatedTestCaseResult {
  caseNumber: number;
  testId: string;
  title: string;
  category: string;
  inputDescription: string;
  expectedBehavior: string;
  actualStatusLabel: DiagnosticStatusLabel | 'HTTP 400 Validation Rejected' | 'HTTP 503 Graceful Failure';
  actualOutcomeCode: string;
  actualRejectionCategory: RejectionCategory;
  calibratedConfidence: number | null;
  uncertaintyLevel: UncertaintyLevel | 'N/A';
  passed: boolean;
  latencyMs: number;
  verificationDetails: string;
}
