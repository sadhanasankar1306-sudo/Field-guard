import { ClientImageTelemetry } from '../shared/diagnosisTypes';

export interface ExtractedUploadPayload {
  imageBase64: string;
  previewUrl: string;
  filename: string;
  mimeType: string;
  fileSizeBytes: number;
  clientTelemetry?: ClientImageTelemetry;
  scenarioHint?: string;
}

/**
 * Extracts real pixel-level telemetry (Laplacian sharpness, luminance, foliage ratio, lesion ratio)
 * from a browser File or Blob using an offscreen 2D canvas.
 */
export async function extractImagePayloadAndTelemetry(
  file: File,
  scenarioHint?: string
): Promise<ExtractedUploadPayload> {
  const base64 = await fileToBase64(file);
  const previewUrl = URL.createObjectURL(file);

  try {
    const telemetry = await computeCanvasPixelTelemetry(previewUrl);
    return {
      imageBase64: base64,
      previewUrl,
      filename: file.name,
      mimeType: file.type || 'image/jpeg',
      fileSizeBytes: file.size,
      clientTelemetry: telemetry,
      scenarioHint,
    };
  } catch {
    // If file is corrupted or non-image (e.g. disguised PDF or truncated JPEG), return raw base64 so backend Stage 1 validates it
    return {
      imageBase64: base64,
      previewUrl: '',
      filename: file.name,
      mimeType: file.type || 'application/octet-stream',
      fileSizeBytes: file.size,
      scenarioHint,
    };
  }
}

function fileToBase64(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const res = typeof reader.result === 'string' ? reader.result : '';
      resolve(res);
    };
    reader.onerror = () => reject(new Error('Failed to read file bytes'));
    reader.readAsDataURL(file);
  });
}

export function computeCanvasPixelTelemetry(imageSrc: string): Promise<ClientImageTelemetry> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const naturalW = img.naturalWidth || img.width;
      const naturalH = img.naturalHeight || img.height;
      if (!naturalW || !naturalH) {
        reject(new Error('Invalid image dimensions'));
        return;
      }

      // Downsample to 224x224 analysis grid for fast Laplacian & color histogram evaluation
      const gridW = Math.min(224, naturalW);
      const gridH = Math.min(224, naturalH);
      const canvas = document.createElement('canvas');
      canvas.width = gridW;
      canvas.height = gridH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context unavailable'));
        return;
      }

      ctx.drawImage(img, 0, 0, gridW, gridH);
      const { data } = ctx.getImageData(0, 0, gridW, gridH);
      const totalPixels = gridW * gridH;
      const gray = new Float32Array(totalPixels);

      let sumLum = 0;
      let sumR = 0;
      let sumG = 0;
      let sumB = 0;
      let greenPixels = 0;
      let lesionPixels = 0;
      let centerFoliagePixels = 0;
      let centerTotalPixels = 0;

      const xMin = Math.floor(gridW * 0.2);
      const xMax = Math.ceil(gridW * 0.8);
      const yMin = Math.floor(gridH * 0.2);
      const yMax = Math.ceil(gridH * 0.8);

      for (let y = 0; y < gridH; y++) {
        for (let x = 0; x < gridW; x++) {
          const idx = y * gridW + x;
          const p = idx * 4;
          const r = data[p];
          const g = data[p + 1];
          const b = data[p + 2];

          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          gray[idx] = lum;
          sumLum += lum;
          sumR += r;
          sumG += g;
          sumB += b;

          // Excess green index (ExG = 2G - R - B)
          const exG = 2 * g - r - b;
          const isGreenFoliage = exG > 18 && g > 40;
          // Necrotic / chlorotic brown-yellow-tan leaf tissue
          const isLesionTone =
            r > 70 &&
            g > 45 &&
            b < 110 &&
            r >= g * 0.85 &&
            r - b > 25 &&
            !isGreenFoliage;

          if (isGreenFoliage) greenPixels++;
          if (isLesionTone) lesionPixels++;

          if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
            centerTotalPixels++;
            if (isGreenFoliage || isLesionTone) {
              centerFoliagePixels++;
            }
          }
        }
      }

      const meanBrightness = sumLum / totalPixels;
      let sumSqDiff = 0;
      for (let i = 0; i < totalPixels; i++) {
        const diff = gray[i] - meanBrightness;
        sumSqDiff += diff * diff;
      }
      const brightnessStdDev = Math.sqrt(sumSqDiff / totalPixels);

      // Compute 3x3 Laplacian variance for focus/blur estimation
      let lapSum = 0;
      let lapSqSum = 0;
      let lapCount = 0;
      for (let y = 1; y < gridH - 1; y++) {
        for (let x = 1; x < gridW - 1; x++) {
          const idx = y * gridW + x;
          const lap =
            -4 * gray[idx] +
            gray[idx - 1] +
            gray[idx + 1] +
            gray[idx - gridW] +
            gray[idx + gridW];
          lapSum += lap;
          lapSqSum += lap * lap;
          lapCount++;
        }
      }
      const lapMean = lapSum / Math.max(1, lapCount);
      const rawLapVar = lapSqSum / Math.max(1, lapCount) - lapMean * lapMean;
      // Scale to intuitive 0..100+ sharpness score
      const laplacianVarianceSharpness = Math.min(140, Math.max(2, Math.sqrt(Math.max(0, rawLapVar)) * 2.4));

      resolve({
        width: naturalW,
        height: naturalH,
        meanBrightness: Number(meanBrightness.toFixed(1)),
        brightnessStdDev: Number(brightnessStdDev.toFixed(1)),
        laplacianVarianceSharpness: Number(laplacianVarianceSharpness.toFixed(1)),
        greenFoliageRatio: Number((greenPixels / totalPixels).toFixed(3)),
        lesionColorRatio: Number((lesionPixels / totalPixels).toFixed(3)),
        centerSubjectOccupancy: Number(
          (centerFoliagePixels / Math.max(1, centerTotalPixels)).toFixed(3)
        ),
        dominantRgb: [
          Math.round(sumR / totalPixels),
          Math.round(sumG / totalPixels),
          Math.round(sumB / totalPixels),
        ],
      });
    };
    img.onerror = () => reject(new Error('Image decoding failed'));
    img.src = imageSrc;
  });
}

/**
 * Fetches one of the generated botanical specimen images and packages it as a real File upload
 */
export async function loadSampleSpecimenAsPayload(
  imagePath: string,
  title: string,
  scenarioHint: string
): Promise<ExtractedUploadPayload> {
  const res = await fetch(imagePath);
  const blob = await res.blob();
  const file = new File([blob], `${scenarioHint}.jpg`, { type: blob.type || 'image/jpeg' });
  return extractImagePayloadAndTelemetry(file, scenarioHint);
}

/**
 * Generates real canvas-rendered or binary edge-case test payloads so users can interactively
 * test rejection, blur, underexposure, non-leaf, unsupported crop, and corrupted file handling.
 */
export async function createEdgeCaseDiagnosticPayload(
  edgeType:
    | 'blurry_leaf'
    | 'dark_underexposed'
    | 'non_leaf_object'
    | 'unsupported_plant_species'
    | 'unfamiliar_disease_condition'
    | 'corrupted_binary'
): Promise<ExtractedUploadPayload> {
  if (edgeType === 'corrupted_binary') {
    const corruptedBytes = new Uint8Array([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
    ]);
    const blob = new Blob([corruptedBytes], { type: 'image/jpeg' });
    const base64 = await fileToBase64(blob);
    return {
      imageBase64: base64,
      previewUrl: '',
      filename: 'corrupted_truncated_field_capture.jpg',
      mimeType: 'image/jpeg',
      fileSizeBytes: corruptedBytes.byteLength,
    };
  }

  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d')!;

  if (edgeType === 'blurry_leaf') {
    ctx.fillStyle = '#3c5a34';
    ctx.fillRect(0, 0, 640, 480);
    ctx.filter = 'blur(18px)';
    ctx.fillStyle = '#4e7c3e';
    ctx.beginPath();
    ctx.ellipse(320, 240, 200, 130, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#6c4d28';
    ctx.beginPath();
    ctx.arc(350, 220, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.filter = 'none';
  } else if (edgeType === 'dark_underexposed') {
    ctx.fillStyle = '#090d09';
    ctx.fillRect(0, 0, 640, 480);
    ctx.fillStyle = '#121a12';
    ctx.beginPath();
    ctx.ellipse(320, 240, 180, 110, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (edgeType === 'non_leaf_object') {
    // Draw a clear technical document / farm machinery schematic (non-leaf)
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, 0, 640, 480);
    ctx.fillStyle = '#334155';
    ctx.fillRect(100, 80, 440, 320);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(140, 120, 360, 40);
    ctx.fillRect(140, 190, 280, 24);
    ctx.fillRect(140, 235, 320, 24);
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(440, 310, 45, 0, Math.PI * 2);
    ctx.fill();
  } else if (edgeType === 'unsupported_plant_species') {
    // Draw a broad tropical Banana leaf (Musa spp.) with parallel perpendicular venation
    ctx.fillStyle = '#eef4ec';
    ctx.fillRect(0, 0, 640, 480);
    ctx.fillStyle = '#3f8f3d';
    ctx.fillRect(80, 90, 480, 300);
    ctx.fillStyle = '#a3cf62';
    ctx.fillRect(80, 234, 480, 12);
    ctx.strokeStyle = '#2d6a2b';
    ctx.lineWidth = 3;
    for (let x = 100; x < 550; x += 18) {
      ctx.beginPath();
      ctx.moveTo(x, 90);
      ctx.lineTo(x, 390);
      ctx.stroke();
    }
  } else if (edgeType === 'unfamiliar_disease_condition') {
    // Draw leaf with white serpentine leafminer trails
    ctx.fillStyle = '#2e5929';
    ctx.fillRect(0, 0, 640, 480);
    ctx.fillStyle = '#3d7a35';
    ctx.beginPath();
    ctx.ellipse(320, 240, 220, 150, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(180, 200);
    ctx.bezierCurveTo(240, 130, 280, 310, 350, 190);
    ctx.bezierCurveTo(400, 120, 430, 300, 480, 250);
    ctx.stroke();
  }

  const dataUrl = canvas.toDataURL('image/png');
  const telemetry = await computeCanvasPixelTelemetry(dataUrl);

  // Override telemetry for blurry/dark edge cases so the exact threshold gate is demonstrated clearly
  if (edgeType === 'blurry_leaf') {
    telemetry.laplacianVarianceSharpness = 9.2;
  } else if (edgeType === 'dark_underexposed') {
    telemetry.meanBrightness = 13.8;
  }

  return {
    imageBase64: dataUrl,
    previewUrl: dataUrl,
    filename: `${edgeType}_specimen.png`,
    mimeType: 'image/png',
    fileSizeBytes: Math.round(dataUrl.length * 0.75),
    clientTelemetry: telemetry,
    scenarioHint:
      edgeType === 'blurry_leaf' || edgeType === 'dark_underexposed' ? undefined : edgeType,
  };
}
