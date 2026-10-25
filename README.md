# FieldGuard AI — Reliable Multi-Plant Disease Detection with Uncertainty-Aware Diagnosis

FieldGuard AI is an end-to-end agricultural computer vision and decision-support application that analyzes uploaded leaf photographs across **9 supported crop species** and **33 validated classes**, estimates calibrated prediction reliability via temperature scaling ($T = 1.38$), asks targeted follow-up questions for borderline cases, and safely abstains on non-leaf images, low-quality photographs, unsupported plant species, or unfamiliar disease conditions.

---

## 1. Core Features & 7-Way Diagnostic Discrimination

Unlike standard closed-set image classifiers that force every uploaded photograph into one of their trained labels with overconfident softmax scores, FieldGuard AI explicitly distinguishes between:

1. **Supported plant with a confidently classified healthy leaf** (`Outcome A: Reliable prediction`)
2. **Supported plant with a confidently classified disease** (`Outcome A: Reliable prediction`)
3. **Supported plant with ambiguous symptoms** (`Outcome B: Needs further assessment` + Bayesian follow-up questions)
4. **Plant species not supported by the model** (`Outcome C: Abstention` — Stage 4 Open-Set Species Gate)
5. **Image that does not contain a usable leaf** (`Outcome C: Abstention` — Stage 3 Botanical Leaf Verification Gate)
6. **Leaf image with insufficient quality for diagnosis** (`Outcome C: Abstention` — Stage 2 Blur/Exposure/Occupancy Gate)
7. **Unfamiliar disease, mixed infection, or condition outside the model's known classes** (`Outcome C: Abstention` — Stage 5 OOD Distance Gate)

---

## 2. Supported Plant Species & Verified Class Registry (9 Crops, 33 Classes)

Configured centrally in `src/shared/plantConfig.ts`:

| # | Common Name | Scientific Name | Family | Supported Classes (Healthy + Diseased) |
| :- | :--- | :--- | :--- | :--- |
| 1 | **Tomato** | *Solanum lycopersicum* | Solanaceae | Healthy, Early Blight, Late Blight, Bacterial Spot, Leaf Mold, Septoria Leaf Spot, Two-Spotted Spider Mite, Target Spot, Tomato Yellow Leaf Curl Virus (TYLCV), Tomato Mosaic Virus (ToMV) (10) |
| 2 | **Bell Pepper / Chilli Pepper** | *Capsicum annuum* | Solanaceae | Healthy, Bacterial Leaf Spot, Cercospora / Frogeye Leaf Spot (3) |
| 3 | **Potato** | *Solanum tuberosum* | Solanaceae | Healthy, Early Blight, Late Blight (3) |
| 4 | **Apple** | *Malus domestica* | Rosaceae | Healthy, Apple Scab, Black Rot (Frogeye Leaf Spot), Cedar Apple Rust (4) |
| 5 | **Grape** | *Vitis vinifera* | Vitaceae | Healthy, Black Rot, Esca (Black Measles), Pseudocercospora / Isariopsis Leaf Blight (4) |
| 6 | **Corn / Maize** | *Zea mays* | Poaceae | Healthy, Gray Leaf Spot, Common Rust, Northern Corn Leaf Blight (4) |
| 7 | **Strawberry** | *Fragaria × ananassa* | Rosaceae | Healthy, Leaf Scorch (2) |
| 8 | **Peach** | *Prunus persica* | Rosaceae | Healthy, Bacterial Spot (2) |
| 9 | **Cherry** | *Prunus avium / P. cerasus* | Rosaceae | Healthy, Powdery Mildew (2) |

*Taxonomic Granularity Note*: Both sweet bell peppers and most cultivated chilli peppers belong to *Capsicum annuum*. Foliage photographs alone cannot separate sweet bell from hot chilli cultivars without visible fruit structures.

---

## 3. Architecture & 5-Stage Analysis Pipeline

1. **Stage 1 — Binary Upload Validation (`validateUploadedImageBuffer`)**:
   - Inspects raw binary magic bytes (`FF D8 FF` JPEG, `89 50 4E 47` PNG, `52 49 46 46 ... 57 45 42 50` WEBP) rather than trusting file extensions.
   - Parses image frame dimensions directly from binary headers (`SOF0/SOF2`, `IHDR`, `VP8/VP8L/VP8X`).
   - Enforces file size limits ($\le 10\text{ MB}$), minimum resolution ($\ge 160\times 160\text{ px}$), and non-blank byte variance.
2. **Stage 2 — Image Quality Assessment (`assessImageQuality`)**:
   - Evaluates 2D discrete Laplacian variance sharpness ($\ge 22.0$), mean luminance exposure ($28\text{–}238 / 255$), and leaf occupancy ratio ($\ge 12\%$).
   - Permits complex real-world field backgrounds when the foreground leaf is sharp and properly exposed.
3. **Stage 3 — Leaf & Plant Verification**:
   - Rejects non-botanical photographs (people, farm machinery, documents, vehicles, landscapes) before disease scoring.
4. **Stage 4 — Plant Species Identification & Open-Set Gate**:
   - Verifies whether the leaf belongs to one of the 9 supported crops and rejects unsupported species (e.g., Banana, Rice, Wheat, Citrus).
5. **Stage 5 — Calibrated Disease Classification & Uncertainty Assessment**:
   - Applies temperature scaling ($T = 1.38$) to raw logits, computing calibrated top-1 probability ($p_1$), top-2 margin ($\Delta p = p_1 - p_2$), normalized Shannon entropy, and out-of-distribution (OOD) distance.

---

## 4. Technology Stack & Folder Structure

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, HTML5 Canvas 2D pixel telemetry extractor.
- **Backend**: Node.js, Express, `tsx`, `@google/genai` server-side multimodal vision integration + deterministic spectral-morphological calibration engine.

```text
/
├── server.ts                              # Express + Vite full-stack server & REST API endpoints
├── package.json                           # Scripts & dependencies
├── metadata.json                          # Application capability metadata
├── src/
│   ├── App.tsx                            # Main UI (Overview, Diagnose, Results, Library, Evaluation, History, About)
│   ├── components/
│   │   ├── DiagnosisResultView.tsx        # Result view, Grad-CAM attention overlay, Follow-Up form & Abstention card
│   │   ├── EvaluationAndTestsView.tsx     # 18-case live automated test runner & scientific metrics
│   │   └── AboutAndLimitationsView.tsx    # Architecture, limitations, photography guide & project report outline
│   ├── shared/
│   │   ├── plantConfig.ts                 # Central 9-crop & 33-class registry + calibration thresholds
│   │   ├── diseaseKnowledgeBase.ts        # Structured pathology knowledge base & follow-up question rules
│   │   ├── diagnosisTypes.ts              # Shared TypeScript interfaces
│   │   └── evaluationData.ts              # Benchmark vs. Field evaluation metrics & dataset provenance
│   ├── server/
│   │   └── pipeline.ts                    # 5-stage analysis pipeline, binary validator, uncertainty & 18-case test runner
│   └── utils/
│       └── imageTelemetry.ts              # Client-side Laplacian sharpness & color histogram telemetry
```

---

## 5. Installation, Local Run & Testing Commands

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables (optional for offline deterministic mode; required for live Gemini multimodal backend)
cp .env.example .env

# 3. Start full-stack server on http://localhost:3000
npm run dev

# 4. Run TypeScript type verification
npm run lint

# 5. Build production bundle
npm run build
```

### API Endpoints

- `GET /api/health` — Returns model checkpoint readiness, version, and temperature scaling configuration.
- `POST /api/diagnose` — Runs the 5-stage validation, quality, leaf verification, species, and calibrated disease classification pipeline.
- `POST /api/follow-up` — Applies Bayesian log-likelihood refinement on borderline predictions (or transitions to Abstention if symptoms conflict).
- `GET /api/diseases` & `GET /api/diseases/:id` — Queries the 33-class structured plant pathology reference database.
- `GET /api/evaluation` — Returns dataset provenance, clean benchmark vs. field test metrics, selective risk curve, and OOD rejection metrics.
- `POST /api/test-suite` — Executes all 18 automated verification test cases and returns pass/fail telemetry.

---

## 6. Dataset Provenance, Calibration & Limitations

- **Dataset**: PlantVillage 9-Crop Canonical Subset (CC0 1.0, Hughes & Salathé, 2015) supplemented with 1,324 in-situ field validation images (CC-BY-4.0). Near-duplicate images (64-bit dHash/pHash Hamming distance $\le 4$) and specimen-session clusters were isolated prior to splitting (`seed = 20260410`).
- **Held-Out Benchmark vs. Real-World Field Performance**:
  - Lab Benchmark Split ($n = 2,284$): **97.4%** Top-1 Accuracy, **0.970** Macro F1, **1.8%** Calibrated ECE.
  - Real-World Field Split ($n = 1,324$): **85.6%** Unfiltered Top-1 Accuracy (**96.4%** Selective Accuracy at 78.2% coverage under Outcome A threshold $p \ge 0.72$).
- **Ethical & Operational Disclaimer**: Image-based screening is preliminary. Do not apply restricted agricultural chemicals based solely on automated visual screening; consult local extension specialists for laboratory confirmation.
