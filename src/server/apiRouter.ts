import { Router, Request, Response } from 'express';
import {
  CLASS_BY_ID,
  MODEL_CALIBRATION_CONFIG,
  MODEL_CLASSES,
  SUPPORTED_PLANTS,
} from '../shared/plantConfig';
import {
  DISEASE_KNOWLEDGE_BASE,
  FOLLOW_UP_QUESTIONS,
  PRELIMINARY_SCREENING_DISCLAIMER,
} from '../shared/diseaseKnowledgeBase';
import {
  BENCHMARK_VS_FIELD_METRICS,
  DATASET_PROVENANCE,
  OPEN_SET_REJECTION_EVALUATION,
  SELECTIVE_RISK_COVERAGE_CURVE,
  TOP_CONFUSION_PAIRS,
} from '../shared/evaluationData';
import {
  executeFullDiagnosisPipeline,
  processFollowUpRefinement,
  runAll18AutomatedTests,
} from './pipeline';

export const apiRouter = Router();

const modelBootTimestamp = new Date().toISOString();

// 1. GET /api/health
apiRouter.get('/health', (_req: Request, res: Response) => {
  const geminiConfigured = Boolean(
    process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' &&
      process.env.GEMINI_API_KEY.trim() !== ''
  );
  res.status(200).json({
    status: 'healthy',
    service: 'FieldGuard AI Diagnostic Engine',
    modelLoaded: true,
    modelBootTimestamp,
    modelVersion: MODEL_CALIBRATION_CONFIG.modelVersion,
    architecture: MODEL_CALIBRATION_CONFIG.architecture,
    supportedPlantsCount: Object.keys(SUPPORTED_PLANTS).length,
    supportedClassesCount: MODEL_CLASSES.length,
    temperatureScalingFactor: MODEL_CALIBRATION_CONFIG.temperatureScalingFactor,
    visionEngineReady: true,
    multimodalGeminiConfigured: geminiConfigured,
  });
});

// 2. GET /api/plants
apiRouter.get('/plants', (_req: Request, res: Response) => {
  res.status(200).json({
    supportedPlants: Object.values(SUPPORTED_PLANTS),
    modelClasses: MODEL_CLASSES,
    calibrationConfig: MODEL_CALIBRATION_CONFIG,
  });
});

// 3. GET /api/diseases
apiRouter.get('/diseases', (req: Request, res: Response) => {
  const plantFilter = typeof req.query.plantId === 'string' ? req.query.plantId.toLowerCase() : null;
  const categoryFilter = typeof req.query.category === 'string' ? req.query.category : null;
  const search = typeof req.query.q === 'string' ? req.query.q.toLowerCase().trim() : '';

  let entries = Object.values(DISEASE_KNOWLEDGE_BASE);
  if (plantFilter && plantFilter !== 'all') {
    entries = entries.filter((e) => e.plantId === plantFilter);
  }
  if (categoryFilter && categoryFilter !== 'all') {
    entries = entries.filter((e) => e.causalCategory === categoryFilter);
  }
  if (search) {
    entries = entries.filter(
      (e) =>
        e.commonName.toLowerCase().includes(search) ||
        e.scientificAgent.toLowerCase().includes(search) ||
        e.typicalVisibleSymptoms.some((s) => s.toLowerCase().includes(search))
    );
  }

  res.status(200).json({
    count: entries.length,
    disclaimer: PRELIMINARY_SCREENING_DISCLAIMER,
    diseases: entries,
  });
});

// 4. GET /api/diseases/:id
apiRouter.get('/diseases/:id', (req: Request, res: Response) => {
  const rawId = decodeURIComponent(req.params.id);
  const entry = DISEASE_KNOWLEDGE_BASE[rawId];
  if (!entry) {
    res.status(404).json({
      error: 'Disease class not found in supported knowledge base',
      requestedId: rawId,
      note: 'FieldGuard AI only returns treatment and management guidance for validated classes in its 9-crop registry.',
    });
    return;
  }
  res.status(200).json({
    disease: entry,
    classDefinition: CLASS_BY_ID[rawId] || null,
    disclaimer: PRELIMINARY_SCREENING_DISCLAIMER,
  });
});

// 5. POST /api/diagnose
apiRouter.post('/diagnose', async (req: Request, res: Response) => {
  try {
    const {
      imageBase64,
      filename,
      mimeType,
      scenarioHint,
      clientTelemetry,
      simulateModelFailure,
    } = req.body || {};

    let imageBuffer: Buffer | null = null;
    if (typeof imageBase64 === 'string' && imageBase64.length > 0) {
      const cleanedBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
      imageBuffer = Buffer.from(cleanedBase64, 'base64');
    }

    const { httpStatus, response } = await executeFullDiagnosisPipeline({
      imageBuffer,
      mimeType,
      filename,
      scenarioHint,
      clientTelemetry,
      simulateModelFailure: Boolean(simulateModelFailure),
    });

    res.status(httpStatus).json(response);
  } catch (err: any) {
    console.error('Operational error in POST /api/diagnose:', err?.message || err);
    res.status(500).json({
      error: 'Internal diagnostic pipeline error',
      message: 'An unexpected error occurred while processing the leaf image. No private image was stored.',
    });
  }
});

// 6. POST /api/follow-up
apiRouter.post('/follow-up', (req: Request, res: Response) => {
  try {
    const { diagnosisId, previousResponse, answers, confirmedPlantId } = req.body || {};
    if (!previousResponse || typeof previousResponse !== 'object') {
      res.status(400).json({
        error: 'Missing previousResponse payload for follow-up refinement.',
      });
      return;
    }

    const updated = processFollowUpRefinement({
      diagnosisId: diagnosisId || previousResponse.diagnosisId,
      previousResponse,
      answers: answers || {},
      confirmedPlantId,
    });

    res.status(200).json(updated);
  } catch (err: any) {
    console.error('Operational error in POST /api/follow-up:', err?.message || err);
    res.status(500).json({
      error: 'Failed to process follow-up assessment',
    });
  }
});

// 7. GET /api/evaluation
apiRouter.get('/evaluation', (_req: Request, res: Response) => {
  res.status(200).json({
    datasetProvenance: DATASET_PROVENANCE,
    calibrationConfig: MODEL_CALIBRATION_CONFIG,
    benchmarkVsFieldMetrics: BENCHMARK_VS_FIELD_METRICS,
    selectiveRiskCurve: SELECTIVE_RISK_COVERAGE_CURVE,
    openSetRejectionEvaluation: OPEN_SET_REJECTION_EVALUATION,
    topConfusionPairs: TOP_CONFUSION_PAIRS,
    supportedPlants: Object.values(SUPPORTED_PLANTS),
    followUpQuestionCatalog: FOLLOW_UP_QUESTIONS,
  });
});

// 8. POST /api/test-suite (Runs all 18 automated test cases)
apiRouter.post('/test-suite', async (_req: Request, res: Response) => {
  try {
    const results = await runAll18AutomatedTests();
    const passedCount = results.filter((r) => r.passed).length;
    res.status(200).json({
      executedAtIso: new Date().toISOString(),
      totalCases: results.length,
      passedCount,
      failedCount: results.length - passedCount,
      allPassed: passedCount === results.length,
      results,
    });
  } catch (err: any) {
    res.status(500).json({
      error: 'Automated test suite execution failed',
      details: err?.message || 'Unknown error',
    });
  }
});
