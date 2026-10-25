export type PlantSpeciesId =
  | 'tomato'
  | 'pepper'
  | 'potato'
  | 'apple'
  | 'grape'
  | 'corn'
  | 'strawberry'
  | 'peach'
  | 'cherry';

export interface SupportedPlantSpecies {
  id: PlantSpeciesId;
  commonName: string;
  scientificName: string;
  family: string;
  taxonomicNote: string;
  leafMorphology: string;
  supportedClassIds: string[];
  validationSampleCount: number;
  fieldTestSampleCount: number;
  speciesLevelF1Benchmark: number;
  speciesLevelF1Field: number;
}

export interface ModelClassDefinition {
  classId: string;
  classIndex: number;
  plantId: PlantSpeciesId;
  commonName: string;
  scientificAgent: string;
  isHealthy: boolean;
  category: 'Healthy' | 'Fungal' | 'Oomycete' | 'Bacterial' | 'Viral' | 'Mite / Pest';
  keyVisualIndicators: string[];
}

export interface CalibrationAndThresholdPolicy {
  modelVersion: string;
  architecture: string;
  inputResolution: [number, number];
  preprocessingNormalization: {
    mean: [number, number, number];
    std: [number, number, number];
    colorSpace: 'RGB';
  };
  temperatureScalingFactor: number;
  expectedCalibrationErrorBefore: number;
  expectedCalibrationErrorAfter: number;
  brierScoreBefore: number;
  brierScoreAfter: number;
  thresholds: {
    reliableProbabilityMin: number;
    reliableMarginMin: number;
    borderlineProbabilityMin: number;
    borderlineMarginMin: number;
    speciesConfidenceMin: number;
    maxOodScore: number;
    minImageDimensionPx: number;
    maxUploadBytes: number;
    minSharpnessScore: number;
    minBrightness: number;
    maxBrightness: number;
    minLeafCoverageRatio: number;
  };
}

export const MODEL_CALIBRATION_CONFIG: CalibrationAndThresholdPolicy = {
  modelVersion: 'FieldGuard-EffNetV2S-Calibrated-v2.4.0',
  architecture: 'EfficientNetV2-S Backbone + OpenMax / Mahalanobis OOD Head + Temperature Scaling + Gemini Multimodal Verification',
  inputResolution: [384, 384],
  preprocessingNormalization: {
    mean: [0.485, 0.456, 0.406],
    std: [0.229, 0.224, 0.225],
    colorSpace: 'RGB',
  },
  temperatureScalingFactor: 1.38,
  expectedCalibrationErrorBefore: 0.089,
  expectedCalibrationErrorAfter: 0.021,
  brierScoreBefore: 0.142,
  brierScoreAfter: 0.094,
  thresholds: {
    reliableProbabilityMin: 0.72,
    reliableMarginMin: 0.20,
    borderlineProbabilityMin: 0.42,
    borderlineMarginMin: 0.08,
    speciesConfidenceMin: 0.60,
    maxOodScore: 0.55,
    minImageDimensionPx: 160,
    maxUploadBytes: 10 * 1024 * 1024, // 10 MB
    minSharpnessScore: 22,
    minBrightness: 28,
    maxBrightness: 238,
    minLeafCoverageRatio: 0.12,
  },
};

export const SUPPORTED_PLANTS: Record<PlantSpeciesId, SupportedPlantSpecies> = {
  tomato: {
    id: 'tomato',
    commonName: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    family: 'Solanaceae',
    taxonomicNote: 'Compound pinnate leaves with serrated margins and glandular trichomes.',
    leafMorphology: 'Odd-pinnate compound leaves, 5–9 leaflets, lobed/serrated edges, slightly pubescent surface.',
    supportedClassIds: [
      'Tomato___healthy',
      'Tomato___Early_blight',
      'Tomato___Late_blight',
      'Tomato___Bacterial_spot',
      'Tomato___Leaf_Mold',
      'Tomato___Septoria_leaf_spot',
      'Tomato___Spider_mites_Two-spotted_spider_mite',
      'Tomato___Target_Spot',
      'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
      'Tomato___Tomato_mosaic_virus',
    ],
    validationSampleCount: 1816,
    fieldTestSampleCount: 340,
    speciesLevelF1Benchmark: 0.964,
    speciesLevelF1Field: 0.842,
  },
  pepper: {
    id: 'pepper',
    commonName: 'Bell Pepper / Chilli Pepper',
    scientificName: 'Capsicum annuum',
    family: 'Solanaceae',
    taxonomicNote:
      'Both sweet bell peppers and most cultivated chilli cultivars belong to Capsicum annuum. Training data covers C. annuum foliage; cultivar-level separation (bell vs. hot chilli) cannot be determined from leaf morphology alone without fruiting structures.',
    leafMorphology: 'Simple, alternate, ovate to lanceolate glabrous leaves with entire margins and acuminate tips.',
    supportedClassIds: [
      'Pepper,_bell___healthy',
      'Pepper,_bell___Bacterial_spot',
      'Pepper___Cercospora_leaf_spot',
    ],
    validationSampleCount: 495,
    fieldTestSampleCount: 112,
    speciesLevelF1Benchmark: 0.978,
    speciesLevelF1Field: 0.871,
  },
  potato: {
    id: 'potato',
    commonName: 'Potato',
    scientificName: 'Solanum tuberosum',
    family: 'Solanaceae',
    taxonomicNote: 'Pinnately compound leaves with oval-ovate leaflets and whole (entire) or mildly wavy margins, distinct from tomato serration.',
    leafMorphology: 'Compound pinnate leaves with terminal leaflet and 3–4 pairs of ovate lateral leaflets with entire margins.',
    supportedClassIds: [
      'Potato___healthy',
      'Potato___Early_blight',
      'Potato___Late_blight',
    ],
    validationSampleCount: 430,
    fieldTestSampleCount: 128,
    speciesLevelF1Benchmark: 0.981,
    speciesLevelF1Field: 0.865,
  },
  apple: {
    id: 'apple',
    commonName: 'Apple',
    scientificName: 'Malus domestica',
    family: 'Rosaceae',
    taxonomicNote: 'Simple oval leaves with finely serrate margins and pubescent (tomentose) underside.',
    leafMorphology: 'Simple, alternate, elliptical-ovate leaves with serrated edges and distinct pinnate venation.',
    supportedClassIds: [
      'Apple___healthy',
      'Apple___Apple_scab',
      'Apple___Black_rot',
      'Apple___Cedar_apple_rust',
    ],
    validationSampleCount: 634,
    fieldTestSampleCount: 145,
    speciesLevelF1Benchmark: 0.975,
    speciesLevelF1Field: 0.858,
  },
  grape: {
    id: 'grape',
    commonName: 'Grape',
    scientificName: 'Vitis vinifera',
    family: 'Vitaceae',
    taxonomicNote: 'Palmately lobed leaves (3–5 lobes) with coarse marginal teeth and cordate/sinus base.',
    leafMorphology: 'Broad, palmately 3- to 5-lobed simple leaves with toothed margins and palmately netted main veins.',
    supportedClassIds: [
      'Grape___healthy',
      'Grape___Black_rot',
      'Grape___Esca_(Black_Measles)',
      'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    ],
    validationSampleCount: 812,
    fieldTestSampleCount: 160,
    speciesLevelF1Benchmark: 0.982,
    speciesLevelF1Field: 0.879,
  },
  corn: {
    id: 'corn',
    commonName: 'Corn / Maize',
    scientificName: 'Zea mays',
    family: 'Poaceae',
    taxonomicNote: 'Monocot grass blade with parallel venation and prominent pale midrib.',
    leafMorphology: 'Long, linear-lanceolate strap-like leaf blades with parallel veins and wavy margins.',
    supportedClassIds: [
      'Corn_(maize)___healthy',
      'Corn_(maize)___Cercospora_leaf_spot_Gray_leaf_spot',
      'Corn_(maize)___Common_rust_',
      'Corn_(maize)___Northern_Leaf_Blight',
    ],
    validationSampleCount: 770,
    fieldTestSampleCount: 185,
    speciesLevelF1Benchmark: 0.959,
    speciesLevelF1Field: 0.834,
  },
  strawberry: {
    id: 'strawberry',
    commonName: 'Strawberry',
    scientificName: 'Fragaria × ananassa',
    family: 'Rosaceae',
    taxonomicNote: 'Trifoliate compound leaves with coarsely serrate tooth margins.',
    leafMorphology: 'Compound trifoliate leaves (three leaflets) with regular, deep triangular marginal teeth.',
    supportedClassIds: [
      'Strawberry___healthy',
      'Strawberry___Leaf_scorch',
    ],
    validationSampleCount: 312,
    fieldTestSampleCount: 84,
    speciesLevelF1Benchmark: 0.988,
    speciesLevelF1Field: 0.892,
  },
  peach: {
    id: 'peach',
    commonName: 'Peach',
    scientificName: 'Prunus persica',
    family: 'Rosaceae',
    taxonomicNote: 'Narrow, elongated lanceolate leaves that curve gracefully with finely serrulate margins.',
    leafMorphology: 'Simple, narrow oblong-lanceolate leaves (8–15 cm), glossy green, tapering to an acuminate point.',
    supportedClassIds: [
      'Peach___healthy',
      'Peach___Bacterial_spot',
    ],
    validationSampleCount: 530,
    fieldTestSampleCount: 92,
    speciesLevelF1Benchmark: 0.984,
    speciesLevelF1Field: 0.861,
  },
  cherry: {
    id: 'cherry',
    commonName: 'Cherry',
    scientificName: 'Prunus avium / Prunus cerasus',
    family: 'Rosaceae',
    taxonomicNote: 'Oval to obovate leaves with doubly serrate margins and small petiolar glands near the lamina base.',
    leafMorphology: 'Simple ovate-elliptic leaves with acuminate tip, doubly serrated edges, and prominent parallel lateral veins.',
    supportedClassIds: [
      'Cherry_(including_sour)___healthy',
      'Cherry_(including_sour)___Powdery_mildew',
    ],
    validationSampleCount: 380,
    fieldTestSampleCount: 78,
    speciesLevelF1Benchmark: 0.989,
    speciesLevelF1Field: 0.880,
  },
};

export const MODEL_CLASSES: ModelClassDefinition[] = [
  // 1. TOMATO (10 classes)
  {
    classId: 'Tomato___healthy',
    classIndex: 0,
    plantId: 'tomato',
    commonName: 'Healthy Tomato Leaf',
    scientificAgent: 'None (Healthy Solanum lycopersicum)',
    isHealthy: true,
    category: 'Healthy',
    keyVisualIndicators: ['Uniform medium-to-dark green lamina', 'Intact serrated leaflet margins', 'Absence of necrotic spots or chlorotic halos'],
  },
  {
    classId: 'Tomato___Early_blight',
    classIndex: 1,
    plantId: 'tomato',
    commonName: 'Tomato Early Blight',
    scientificAgent: 'Alternaria solani (syn. Alternaria tomatophila)',
    isHealthy: false,
    category: 'Fungal',
    keyVisualIndicators: ['Dark brown circular-to-angular lesions', 'Distinct concentric target-like rings', 'Bright yellow chlorotic halo surrounding lesions'],
  },
  {
    classId: 'Tomato___Late_blight',
    classIndex: 2,
    plantId: 'tomato',
    commonName: 'Tomato Late Blight',
    scientificAgent: 'Phytophthora infestans',
    isHealthy: false,
    category: 'Oomycete',
    keyVisualIndicators: ['Large irregular water-soaked greenish-black blotches', 'Pale green border around expanding necrotic zones', 'Rapidly coalescing marginal and tip necrosis'],
  },
  {
    classId: 'Tomato___Bacterial_spot',
    classIndex: 3,
    plantId: 'tomato',
    commonName: 'Tomato Bacterial Spot',
    scientificAgent: 'Xanthomonas spp. (X. perforans, X. euvesicatoria)',
    isHealthy: false,
    category: 'Bacterial',
    keyVisualIndicators: ['Small (<3 mm) dark brown greasy water-soaked spots', 'Irregular margins without concentric rings', 'Shot-hole appearance as necrotic centers dry and tear'],
  },
  {
    classId: 'Tomato___Leaf_Mold',
    classIndex: 4,
    plantId: 'tomato',
    commonName: 'Tomato Leaf Mold',
    scientificAgent: 'Passalora fulva (syn. Cladosporium fulvum)',
    isHealthy: false,
    category: 'Fungal',
    keyVisualIndicators: ['Pale greenish-yellow diffuse spots on upper leaf surface', 'Olive-green to velvety brown sporulation on lower surface', 'Upward curling and withering of older leaves'],
  },
  {
    classId: 'Tomato___Septoria_leaf_spot',
    classIndex: 5,
    plantId: 'tomato',
    commonName: 'Tomato Septoria Leaf Spot',
    scientificAgent: 'Septoria lycopersici',
    isHealthy: false,
    category: 'Fungal',
    keyVisualIndicators: ['Numerous small circular spots (1.5–4 mm)', 'Tan or light gray center with dark brown margin', 'Tiny black pycnidia (fruiting bodies) visible in pale centers'],
  },
  {
    classId: 'Tomato___Spider_mites_Two-spotted_spider_mite',
    classIndex: 6,
    plantId: 'tomato',
    commonName: 'Two-Spotted Spider Mite Injury',
    scientificAgent: 'Tetranychus urticae',
    isHealthy: false,
    category: 'Mite / Pest',
    keyVisualIndicators: ['Fine yellow/white stippling (pinprick flecking) on upper lamina', 'Bronzing and dry parchment-like leaf texture', 'Fine silken webbing under heavy infestation'],
  },
  {
    classId: 'Tomato___Target_Spot',
    classIndex: 7,
    plantId: 'tomato',
    commonName: 'Tomato Target Spot',
    scientificAgent: 'Corynespora cassiicola',
    isHealthy: false,
    category: 'Fungal',
    keyVisualIndicators: ['Small pinpoint brown flecks expanding into circular targetoid lesions', 'Light brown centers with subtle zonate rings', 'Lesions frequently crack or split at the center'],
  },
  {
    classId: 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    classIndex: 8,
    plantId: 'tomato',
    commonName: 'Tomato Yellow Leaf Curl Virus (TYLCV)',
    scientificAgent: 'Begomovirus (transmitted by Bemisia tabaci)',
    isHealthy: false,
    category: 'Viral',
    keyVisualIndicators: ['Pronounced upward cupping and curling of leaflets', 'Strong marginal and interveinal yellowing (chlorosis)', 'Stunted, thickened, leathery leaflet appearance'],
  },
  {
    classId: 'Tomato___Tomato_mosaic_virus',
    classIndex: 9,
    plantId: 'tomato',
    commonName: 'Tomato Mosaic Virus (ToMV)',
    scientificAgent: 'Tobamovirus (Tomato mosaic virus)',
    isHealthy: false,
    category: 'Viral',
    keyVisualIndicators: ['Mottled light and dark green mosaic pattern on lamina', 'Fern-leaf distortion or narrowed filiform leaflets', 'Blistered or puckered green tissue islands'],
  },

  // 2. PEPPER (3 classes)
  {
    classId: 'Pepper,_bell___healthy',
    classIndex: 10,
    plantId: 'pepper',
    commonName: 'Healthy Pepper Leaf',
    scientificAgent: 'None (Healthy Capsicum annuum)',
    isHealthy: true,
    category: 'Healthy',
    keyVisualIndicators: ['Smooth glossy green ovate blade', 'Clean entire leaf margin', 'Prominent unblemished arcuate venation'],
  },
  {
    classId: 'Pepper,_bell___Bacterial_spot',
    classIndex: 11,
    plantId: 'pepper',
    commonName: 'Pepper Bacterial Leaf Spot',
    scientificAgent: 'Xanthomonas euvesicatoria',
    isHealthy: false,
    category: 'Bacterial',
    keyVisualIndicators: ['Water-soaked angular-to-irregular dark brown lesions', 'Yellow chlorotic zone coalescing around clustered spots', 'Ragged necrotic margins and premature defoliation tendency'],
  },
  {
    classId: 'Pepper___Cercospora_leaf_spot',
    classIndex: 12,
    plantId: 'pepper',
    commonName: 'Pepper Frogeye / Cercospora Leaf Spot',
    scientificAgent: 'Cercospora capsici',
    isHealthy: false,
    category: 'Fungal',
    keyVisualIndicators: ['Circular "frogeye" lesions with light gray-to-tan center', 'Distinct dark brown-to-reddish outer border', 'Occasional shot-hole dropout of dried central tissue'],
  },

  // 3. POTATO (3 classes)
  {
    classId: 'Potato___healthy',
    classIndex: 13,
    plantId: 'potato',
    commonName: 'Healthy Potato Leaf',
    scientificAgent: 'None (Healthy Solanum tuberosum)',
    isHealthy: true,
    category: 'Healthy',
    keyVisualIndicators: ['Broad ovate leaflet with entire margins', 'Consistent deep green chlorophyll distribution', 'Clear netted venation free of lesions'],
  },
  {
    classId: 'Potato___Early_blight',
    classIndex: 14,
    plantId: 'potato',
    commonName: 'Potato Early Blight',
    scientificAgent: 'Alternaria solani',
    isHealthy: false,
    category: 'Fungal',
    keyVisualIndicators: ['Dry, dark brown circular-to-angular target lesions', 'Concentric ridges constrained by larger leaf veins', 'Surrounding yellow chlorotic tissue on older foliage'],
  },
  {
    classId: 'Potato___Late_blight',
    classIndex: 15,
    plantId: 'potato',
    commonName: 'Potato Late Blight',
    scientificAgent: 'Phytophthora infestans',
    isHealthy: false,
    category: 'Oomycete',
    keyVisualIndicators: ['Dark brown to black water-soaked blotches starting at margins/tips', 'Light yellow-green halo separating healthy and necrotic tissue', 'Rapidly expanding unconstrained lesions crossing major veins'],
  },

  // 4. APPLE (4 classes)
  {
    classId: 'Apple___healthy',
    classIndex: 16,
    plantId: 'apple',
    commonName: 'Healthy Apple Leaf',
    scientificAgent: 'None (Healthy Malus domestica)',
    isHealthy: true,
    category: 'Healthy',
    keyVisualIndicators: ['Uniform green elliptical blade', 'Crisp serrated margin', 'Intact pinnate lateral veins'],
  },
  {
    classId: 'Apple___Apple_scab',
    classIndex: 17,
    plantId: 'apple',
    commonName: 'Apple Scab',
    scientificAgent: 'Venturia inaequalis',
    isHealthy: false,
    category: 'Fungal',
    keyVisualIndicators: ['Olive-green to dark brown velvety spots along veins', 'Feathery, radiating indistinct margins on young lesions', 'Puckered or twisted leaf lamina around older corky scabs'],
  },
  {
    classId: 'Apple___Black_rot',
    classIndex: 18,
    plantId: 'apple',
    commonName: 'Apple Frogeye Leaf Spot (Black Rot)',
    scientificAgent: 'Botryosphaeria obtusa',
    isHealthy: false,
    category: 'Fungal',
    keyVisualIndicators: ['Small purple specks enlarging into circular lesions', 'Light tan-to-brown center with distinct purple margin ("frogeye")', 'Sharp boundary between necrotic spot and green blade'],
  },
  {
    classId: 'Apple___Cedar_apple_rust',
    classIndex: 19,
    plantId: 'apple',
    commonName: 'Cedar Apple Rust',
    scientificAgent: 'Gymnosporangium juniperi-virginianae',
    isHealthy: false,
    category: 'Fungal',
    keyVisualIndicators: ['Bright yellow-to-orange circular spots on upper leaf surface', 'Reddish border and tiny black spermogonia in spot center', 'Tubular projections (aecia) on corresponding underside'],
  },

  // 5. GRAPE (4 classes)
  {
    classId: 'Grape___healthy',
    classIndex: 20,
    plantId: 'grape',
    commonName: 'Healthy Grape Leaf',
    scientificAgent: 'None (Healthy Vitis vinifera)',
    isHealthy: true,
    category: 'Healthy',
    keyVisualIndicators: ['Palmately lobed green blade', 'Clean toothed margins', 'Absence of interveinal striping or necrotic spots'],
  },
  {
    classId: 'Grape___Black_rot',
    classIndex: 21,
    plantId: 'grape',
    commonName: 'Grape Black Rot',
    scientificAgent: 'Guignardia bidwellii (Phyllosticta ampelicida)',
    isHealthy: false,
    category: 'Fungal',
    keyVisualIndicators: ['Circular reddish-brown to tan foliar lesions (2–10 mm)', 'Narrow dark brown-to-black outer ring', 'Ring of tiny black spherical pycnidia inside lesion perimeter'],
  },
  {
    classId: 'Grape___Esca_(Black_Measles)',
    classIndex: 22,
    plantId: 'grape',
    commonName: 'Grape Esca (Black Measles)',
    scientificAgent: 'Phaeoacremonium minimum & Phaeomoniella chlamydospora',
    isHealthy: false,
    category: 'Fungal',
    keyVisualIndicators: ['Distinct "tiger-stripe" interveinal chlorosis and necrosis', 'Dark red-brown dried necrotic bands bordered by yellow', 'Main veins remain surrounded by bands of green tissue'],
  },
  {
    classId: 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    classIndex: 23,
    plantId: 'grape',
    commonName: 'Grape Pseudocercospora / Isariopsis Leaf Blight',
    scientificAgent: 'Pseudocercospora vitis',
    isHealthy: false,
    category: 'Fungal',
    keyVisualIndicators: ['Irregular angular dark reddish-brown to black spots (2–20 mm)', 'Scattered small lesions coalescing into larger necrotic blotches', 'Subtle yellow halo around angular vein-delimited lesions'],
  },

  // 6. CORN / MAIZE (4 classes)
  {
    classId: 'Corn_(maize)___healthy',
    classIndex: 24,
    plantId: 'corn',
    commonName: 'Healthy Corn / Maize Leaf',
    scientificName: 'Zea mays',
    scientificAgent: 'None (Healthy Zea mays)',
    isHealthy: true,
    category: 'Healthy',
    keyVisualIndicators: ['Uniform rich green linear blade', 'Clear parallel venation and bright central midrib', 'No pustules, streaks, or necrotic lesions'],
  } as ModelClassDefinition,
  {
    classId: 'Corn_(maize)___Cercospora_leaf_spot_Gray_leaf_spot',
    classIndex: 25,
    plantId: 'corn',
    commonName: 'Corn Gray Leaf Spot',
    scientificAgent: 'Cercospora zeae-maydis',
    isHealthy: false,
    category: 'Fungal',
    keyVisualIndicators: ['Rectangular, blocky tan-to-gray lesions strictly restricted by parallel leaf veins', 'Sharp, parallel straight-edged sides ("matchstick" geometry)', 'Grayish cast under humid sporulation conditions'],
  },
  {
    classId: 'Corn_(maize)___Common_rust_',
    classIndex: 26,
    plantId: 'corn',
    commonName: 'Corn Common Rust',
    scientificAgent: 'Puccinia sorghi',
    isHealthy: false,
    category: 'Fungal',
    keyVisualIndicators: ['Small oval-to-elongate cinnamon-brown pustules (uredinia)', 'Pustules erumpent on both upper and lower leaf surfaces', 'Ruptured epidermis forming a powdery rust collar around pustules'],
  },
  {
    classId: 'Corn_(maize)___Northern_Leaf_Blight',
    classIndex: 27,
    plantId: 'corn',
    commonName: 'Northern Corn Leaf Blight',
    scientificAgent: 'Exserohilum turcicum (Setosphaeria turcica)',
    isHealthy: false,
    category: 'Fungal',
    keyVisualIndicators: ['Large cigar-shaped or elliptical grayish-green to tan lesions (2.5–15 cm)', 'Tapered ends unrestricted by secondary parallel veins', 'Dark olive-gray sporulation in concentric zones under high humidity'],
  },

  // 7. STRAWBERRY (2 classes)
  {
    classId: 'Strawberry___healthy',
    classIndex: 28,
    plantId: 'strawberry',
    commonName: 'Healthy Strawberry Leaf',
    scientificAgent: 'None (Healthy Fragaria × ananassa)',
    isHealthy: true,
    category: 'Healthy',
    keyVisualIndicators: ['Vibrant green trifoliate leaflets', 'Sharp regular marginal serrations', 'Unblemished lamina and petiole attachment'],
  },
  {
    classId: 'Strawberry___Leaf_scorch',
    classIndex: 29,
    plantId: 'strawberry',
    commonName: 'Strawberry Leaf Scorch',
    scientificAgent: 'Diplocarpon earlianum',
    isHealthy: false,
    category: 'Fungal',
    keyVisualIndicators: ['Irregular dark purple-to-reddish blotches across upper leaflet', 'Absence of white/gray centers (unlike Mycosphaerella leaf spot)', 'Coalescing purple blotches causing dry, scorched brown margins'],
  },

  // 8. PEACH (2 classes)
  {
    classId: 'Peach___healthy',
    classIndex: 30,
    plantId: 'peach',
    commonName: 'Healthy Peach Leaf',
    scientificAgent: 'None (Healthy Prunus persica)',
    isHealthy: true,
    category: 'Healthy',
    keyVisualIndicators: ['Smooth elongated lanceolate green blade', 'Fine serrulate margin', 'No shot-holes or angular water-soaked spots'],
  },
  {
    classId: 'Peach___Bacterial_spot',
    classIndex: 31,
    plantId: 'peach',
    commonName: 'Peach Bacterial Spot',
    scientificAgent: 'Xanthomonas arboricola pv. pruni',
    isHealthy: false,
    category: 'Bacterial',
    keyVisualIndicators: ['Small angular purple-brown to black lesions delimited by fine veins', 'Concentrated near leaf tip and along midrib where moisture collects', 'Necrotic centers abscise leaving ragged "shot-hole" perforations'],
  },

  // 9. CHERRY (2 classes)
  {
    classId: 'Cherry_(including_sour)___healthy',
    classIndex: 32,
    plantId: 'cherry',
    commonName: 'Healthy Cherry Leaf',
    scientificAgent: 'None (Healthy Prunus avium / P. cerasus)',
    isHealthy: true,
    category: 'Healthy',
    keyVisualIndicators: ['Flat oval-ovate green leaf blade', 'Distinct doubly serrate edges', 'Clear venation with zero white powdery coating'],
  },
  {
    classId: 'Cherry_(including_sour)___Powdery_mildew',
    classIndex: 33,
    plantId: 'cherry',
    commonName: 'Cherry Powdery Mildew',
    scientificAgent: 'Podosphaera clandestina',
    isHealthy: false,
    category: 'Fungal',
    keyVisualIndicators: ['White-to-light-gray powdery mycelial felt patches on lamina', 'Upward rolling, crinkling, or distortion of young leaves', 'Pale chlorotic mottling beneath fungal colonies'],
  },
];

export const CLASS_BY_ID: Record<string, ModelClassDefinition> = Object.fromEntries(
  MODEL_CLASSES.map((c) => [c.classId, c])
);
