import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  CLASS_BY_ID,
  MODEL_CALIBRATION_CONFIG,
  MODEL_CLASSES,
  SUPPORTED_PLANTS,
} from './src/shared/plantConfig';
import {
  DISEASE_KNOWLEDGE_BASE,
  FOLLOW_UP_QUESTIONS,
  PRELIMINARY_SCREENING_DISCLAIMER,
} from './src/shared/diseaseKnowledgeBase';
import {
  BENCHMARK_VS_FIELD_METRICS,
  DATASET_PROVENANCE,
  OPEN_SET_REJECTION_EVALUATION,
  SELECTIVE_RISK_COVERAGE_CURVE,
  TOP_CONFUSION_PAIRS,
} from './src/shared/evaluationData';
import {
  executeFullDiagnosisPipeline,
  processFollowUpRefinement,
  runAll18AutomatedTests,
} from './src/server/pipeline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelBootTimestamp = new Date().toISOString();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Allow up to 15MB JSON body so 10MB base64-encoded image uploads can be validated cleanly by Stage 1
  app.use(express.json({ limit: '16mb' }));

  // Security & CORS headers
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    next();
  });

  // 1. GET /api/health
  app.get('/api/health', (_req: Request, res: Response) => {
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
  app.get('/api/plants', (_req: Request, res: Response) => {
    res.status(200).json({
      supportedPlants: Object.values(SUPPORTED_PLANTS),
      modelClasses: MODEL_CLASSES,
      calibrationConfig: MODEL_CALIBRATION_CONFIG,
    });
  });

  // 3. GET /api/diseases
  app.get('/api/diseases', (req: Request, res: Response) => {
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
  app.get('/api/diseases/:id', (req: Request, res: Response) => {
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
  app.post('/api/diagnose', async (req: Request, res: Response) => {
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
  app.post('/api/follow-up', (req: Request, res: Response) => {
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
  app.get('/api/evaluation', (_req: Request, res: Response) => {
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

  // 8. POST /api/test-suite (Runs all 18 required test cases)
  app.post('/api/test-suite', async (_req: Request, res: Response) => {
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

  // Global JSON payload error handler (e.g. >16MB body)
  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    if (err && err.type === 'entity.too.large') {
      res.status(413).json({
        outcomeCode: 'OUTCOME_C_ABSTENTION',
        statusLabel: 'Unable to diagnose reliably',
        rejectionCategory: 'INVALID_UPLOAD_OR_CORRUPTED',
        abstentionMessage: 'Uploaded file exceeds the maximum allowed payload size (10 MB limit). Please resize or compress the photograph and try again.',
      });
      return;
    }
    next(err);
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FieldGuard AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
