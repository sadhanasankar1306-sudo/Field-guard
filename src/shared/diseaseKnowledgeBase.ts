import { PlantSpeciesId } from './plantConfig';

export interface FollowUpQuestionOption {
  value: string;
  label: string;
  favorClassIds: string[];
  disfavorClassIds?: string[];
  evidenceNote: string;
}

export interface FollowUpQuestion {
  id: string;
  question: string;
  rationale: string;
  applicablePlants: PlantSpeciesId[];
  options: FollowUpQuestionOption[];
}

export interface DiseaseKnowledgeEntry {
  classId: string;
  plantId: PlantSpeciesId;
  commonName: string;
  scientificAgent: string;
  causalCategory: 'Healthy' | 'Fungal' | 'Oomycete' | 'Bacterial' | 'Viral' | 'Mite / Pest';
  supportedHostPlants: string[];
  typicalVisibleSymptoms: string[];
  differentialDiagnoses: {
    condition: string;
    distinguishingFeature: string;
  }[];
  favorableConditions: string;
  generalPreventionMeasures: string[];
  appropriateNextSteps: string[];
  referenceSources: {
    title: string;
    institution: string;
    citation: string;
  }[];
}

export const FOLLOW_UP_QUESTIONS: FollowUpQuestion[] = [
  {
    id: 'lesion_geometry',
    question: 'Are the leaf spots circular with concentric rings, angular/blocky along veins, or large irregular blotches?',
    rationale: 'Lesion geometry differentiates targetoid Alternaria lesions from vein-delimited bacterial/Cercospora lesions and unconstrained Phytophthora blight.',
    applicablePlants: ['tomato', 'potato', 'pepper', 'apple', 'grape', 'corn', 'strawberry', 'peach'],
    options: [
      {
        value: 'circular_concentric',
        label: 'Circular with dark concentric target rings',
        favorClassIds: ['Tomato___Early_blight', 'Potato___Early_blight', 'Tomato___Target_Spot'],
        evidenceNote: 'Target-like concentric zonation is characteristic of Alternaria solani and Corynespora cassiicola.',
      },
      {
        value: 'small_circular_pale_center',
        label: 'Small circular spots with pale tan/gray centers and dark borders',
        favorClassIds: [
          'Tomato___Septoria_leaf_spot',
          'Pepper___Cercospora_leaf_spot',
          'Apple___Black_rot',
          'Grape___Black_rot',
        ],
        evidenceNote: 'Frogeye or pale-centered small spots indicate Septoria, Cercospora, or Phyllosticta/Botryosphaeria.',
      },
      {
        value: 'angular_vein_limited',
        label: 'Angular, blocky, or small greasy spots delimited by leaf veins',
        favorClassIds: [
          'Tomato___Bacterial_spot',
          'Pepper,_bell___Bacterial_spot',
          'Peach___Bacterial_spot',
          'Corn_(maize)___Cercospora_leaf_spot_Gray_leaf_spot',
          'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
        ],
        evidenceNote: 'Vein-bounded angular margins are typical of Xanthomonas bacterial spot and maize Gray Leaf Spot.',
      },
      {
        value: 'large_irregular_watersoaked',
        label: 'Large irregular water-soaked blotches or cigar-shaped lesions',
        favorClassIds: [
          'Tomato___Late_blight',
          'Potato___Late_blight',
          'Corn_(maize)___Northern_Leaf_Blight',
        ],
        evidenceNote: 'Large unconstrained water-soaked or elliptical necrotic areas align with Late Blight or Northern Corn Leaf Blight.',
      },
      {
        value: 'powdery_or_stippled_or_curled',
        label: 'No distinct necrotic spots — mainly powdery coating, fine stippling, or leaf curling',
        favorClassIds: [
          'Cherry_(including_sour)___Powdery_mildew',
          'Tomato___Spider_mites_Two-spotted_spider_mite',
          'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
          'Tomato___Tomato_mosaic_virus',
        ],
        evidenceNote: 'Surface mycelia, mite stippling, or viral distortion lack classic necrotic spot borders.',
      },
    ],
  },
  {
    id: 'chlorotic_halo',
    question: 'Is there yellow discoloration (chlorosis) surrounding the spots or between the veins?',
    rationale: 'Presence and pattern of chlorosis helps separate toxin-producing fungal/bacterial pathogens from abiotic burn or rust pustules.',
    applicablePlants: ['tomato', 'potato', 'pepper', 'apple', 'grape', 'corn', 'peach', 'cherry'],
    options: [
      {
        value: 'distinct_yellow_halo',
        label: 'Yes, distinct bright yellow halos surround the dark lesions',
        favorClassIds: [
          'Tomato___Early_blight',
          'Potato___Early_blight',
          'Pepper,_bell___Bacterial_spot',
        ],
        evidenceNote: 'Pronounced yellow halos surround Alternaria lesions and coalescing Xanthomonas spots.',
      },
      {
        value: 'pale_green_watersoaked_margin',
        label: 'A pale yellowish-green water-soaked zone borders large dark blotches',
        favorClassIds: ['Tomato___Late_blight', 'Potato___Late_blight'],
        evidenceNote: 'Active Phytophthora infestans expansion fronts show a pale green halo at lesion margins.',
      },
      {
        value: 'interveinal_striping_or_marginal',
        label: 'Yellowing appears as interveinal tiger-stripes or strong upward marginal yellowing',
        favorClassIds: ['Grape___Esca_(Black_Measles)', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Leaf_Mold'],
        evidenceNote: 'Interveinal striping or marginal chlorosis suggests vascular toxin movement (Esca) or TYLCV.',
      },
      {
        value: 'minimal_or_no_yellowing',
        label: 'No significant yellowing; green tissue borders the spots directly',
        favorClassIds: [
          'Apple___Black_rot',
          'Corn_(maize)___Common_rust_',
          'Strawberry___Leaf_scorch',
          'Tomato___healthy',
          'Pepper,_bell___healthy',
        ],
        evidenceNote: 'Direct transitions from lesion to green lamina are more typical of rust pustules or early scorch.',
      },
    ],
  },
  {
    id: 'canopy_distribution',
    question: 'Where on the plant did these symptoms appear first, and are neighboring leaves affected?',
    rationale: 'Soil-borne splash pathogens progress from lower older leaves upward, whereas vectors and wind-borne mildews often strike new upper growth.',
    applicablePlants: ['tomato', 'potato', 'pepper', 'apple', 'grape', 'corn', 'strawberry', 'peach', 'cherry'],
    options: [
      {
        value: 'lower_older_leaves_first',
        label: 'Started on lower/older leaves near the soil and progressed upward',
        favorClassIds: [
          'Tomato___Early_blight',
          'Potato___Early_blight',
          'Tomato___Septoria_leaf_spot',
          'Tomato___Leaf_Mold',
          'Corn_(maize)___Cercospora_leaf_spot_Gray_leaf_spot',
        ],
        evidenceNote: 'Acropetal (bottom-up) progression is classic for soil/debris-overwintering fungi like Alternaria and Septoria.',
      },
      {
        value: 'upper_young_leaves_first',
        label: 'Primarily affects young expanding leaves at shoot tips',
        favorClassIds: [
          'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
          'Tomato___Tomato_mosaic_virus',
          'Cherry_(including_sour)___Powdery_mildew',
          'Apple___Apple_scab',
        ],
        evidenceNote: 'Apical young foliage is most susceptible to whitefly-vectored TYLCV, Powdery Mildew, and primary Apple Scab.',
      },
      {
        value: 'leaf_tips_and_margins_wet',
        label: 'Concentrated at leaf tips and margins where dew or rain droplets collect',
        favorClassIds: [
          'Tomato___Late_blight',
          'Potato___Late_blight',
          'Peach___Bacterial_spot',
          'Pepper,_bell___Bacterial_spot',
        ],
        evidenceNote: 'Hydrophilic zoospores and bacterial cells accumulate at leaf tips and margins during wet weather.',
      },
    ],
  },
  {
    id: 'growing_environment',
    question: 'Is the plant grown outdoors in open field conditions, in a high-humidity greenhouse/tunnel, or indoors?',
    rationale: 'Microclimate strongly governs sporulation of Passalora fulva (greenhouse leaf mold), spider mites (hot/dry), and rain-splashed bacteria.',
    applicablePlants: ['tomato', 'potato', 'pepper', 'apple', 'grape', 'corn', 'strawberry', 'peach', 'cherry'],
    options: [
      {
        value: 'open_field_wet_cool',
        label: 'Outdoors with recent rain, heavy dew, or cool-to-moderate humidity',
        favorClassIds: [
          'Tomato___Late_blight',
          'Potato___Late_blight',
          'Apple___Apple_scab',
          'Tomato___Septoria_leaf_spot',
          'Pepper,_bell___Bacterial_spot',
        ],
        evidenceNote: 'Free leaf wetness from rain or overhead irrigation drives oomycete and bacterial epidemics.',
      },
      {
        value: 'greenhouse_high_rh',
        label: 'Greenhouse or high tunnel with high relative humidity (>85% RH)',
        favorClassIds: [
          'Tomato___Leaf_Mold',
          'Tomato___Target_Spot',
          'Cherry_(including_sour)___Powdery_mildew',
        ],
        evidenceNote: 'Enclosed high-humidity structures strongly favor Passalora fulva (Tomato Leaf Mold).',
      },
      {
        value: 'hot_dry_dusty',
        label: 'Warm, dry conditions with low rainfall or dusty surroundings',
        favorClassIds: [
          'Tomato___Spider_mites_Two-spotted_spider_mite',
          'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
        ],
        evidenceNote: 'Hot dry weather accelerates spider mite reproduction and whitefly vector movement.',
      },
    ],
  },
];

export const DISEASE_KNOWLEDGE_BASE: Record<string, DiseaseKnowledgeEntry> = {
  Tomato___healthy: {
    classId: 'Tomato___healthy',
    plantId: 'tomato',
    commonName: 'Healthy Tomato Leaf',
    scientificAgent: 'None (Healthy Solanum lycopersicum)',
    causalCategory: 'Healthy',
    supportedHostPlants: ['Tomato (Solanum lycopersicum)'],
    typicalVisibleSymptoms: [
      'Uniform medium-to-deep green coloration across leaflets',
      'Flat, turgid lamina with distinct serrated margins and normal glandular trichomes',
      'Absence of necrotic lesions, chlorotic halos, water-soaking, or mosaic mottling',
    ],
    differentialDiagnoses: [
      {
        condition: 'Latent / Incubation-Stage Infection',
        distinguishingFeature: 'Fungal or bacterial infections within the first 48–96 hours after spore deposition may show no macroscopic symptoms.',
      },
      {
        condition: 'Root / Vascular Wilt (Fusarium or Verticillium)',
        distinguishingFeature: 'Early vascular wilts may show healthy-looking upper leaves while lower stems exhibit internal vascular browning.',
      },
    ],
    favorableConditions: 'Well-drained loam soil (pH 6.0–6.8), balanced fertilization, drip irrigation avoiding prolonged foliage wetness.',
    generalPreventionMeasures: [
      'Maintain adequate plant spacing and pruning for canopy airflow.',
      'Irrigate at the soil line rather than overhead wetting.',
      'Inspect lower leaves weekly for early signs of foliar pathogens or mites.',
    ],
    appropriateNextSteps: [
      'Continue routine integrated pest management (IPM) scouting every 5–7 days.',
      'If wilting, stem cankers, or fruit blemishes are present despite healthy leaves, inspect stems and roots or consult local extension.',
    ],
    referenceSources: [
      {
        title: 'Compendium of Tomato Diseases and Pests (2nd Ed.)',
        institution: 'American Phytopathological Society (APS Press)',
        citation: 'Jones, J. B., Zitter, T. A., Momol, T. M., & Miller, S. A. (2014).',
      },
    ],
  },

  Tomato___Early_blight: {
    classId: 'Tomato___Early_blight',
    plantId: 'tomato',
    commonName: 'Tomato Early Blight',
    scientificAgent: 'Alternaria solani (syn. Alternaria tomatophila)',
    causalCategory: 'Fungal',
    supportedHostPlants: ['Tomato (Solanum lycopersicum)', 'Potato (Solanum tuberosum)', 'Eggplant'],
    typicalVisibleSymptoms: [
      'Circular to angular dark brown-to-black necrotic lesions (3–12 mm)',
      'Characteristic concentric rings inside the lesion creating a "bull\'s-eye" or target appearance',
      'Surrounding yellow chlorotic halo caused by fungal alternaric acid diffusion',
      'Symptoms typically initiate on older lower foliage and progress upward (acropetally)',
    ],
    differentialDiagnoses: [
      {
        condition: 'Septoria Leaf Spot (Septoria lycopersici)',
        distinguishingFeature: 'Septoria spots are smaller (1.5–4 mm), more numerous, with pale tan/gray centers containing black pycnidia rather than dark concentric rings.',
      },
      {
        condition: 'Target Spot (Corynespora cassiicola)',
        distinguishingFeature: 'Target spot lesions often show lighter brown centers that crack open and frequently develop in humid mid-canopy zones.',
      },
      {
        condition: 'Bacterial Spot (Xanthomonas spp.)',
        distinguishingFeature: 'Bacterial spot lesions are smaller (<3 mm), greasy/water-soaked, and lack concentric target rings.',
      },
    ],
    favorableConditions: 'Warm temperatures (24–29 °C / 75–85 °F) alternating with wet periods (rain, heavy dew, or overhead irrigation) and nitrogen/potassium stress.',
    generalPreventionMeasures: [
      'Practice a 2- to 3-year crop rotation away from solanaceous crops (tomato, potato, eggplant, pepper).',
      'Apply organic mulch or plastic mulch to reduce soil-splash of overwintered conidia onto lower leaves.',
      'Prune lower leaves up to 15–20 cm above ground and stake/trellis plants to accelerate foliage drying.',
      'Remove and destroy infected crop residue at the end of the season.',
    ],
    appropriateNextSteps: [
      'Inspect the lower canopy and stems (collar rot phase) to gauge severity across the field.',
      'Avoid working in plants while foliage is wet.',
      'Consult regional agricultural extension guidelines for locally registered protectant or systemic fungicide programs if disease pressure exceeds action thresholds.',
    ],
    referenceSources: [
      {
        title: 'Early Blight of Tomato and Potato',
        institution: 'Cornell University Vegetable MD Online / Extension',
        citation: 'Zitter, T. A., Department of Plant Pathology, Cornell University.',
      },
      {
        title: 'CABI Plantwise Knowledge Bank: Alternaria solani',
        institution: 'CAB International',
        citation: 'CABI Invasive Species Compendium Datasheet 4528.',
      },
    ],
  },

  Tomato___Late_blight: {
    classId: 'Tomato___Late_blight',
    plantId: 'tomato',
    commonName: 'Tomato Late Blight',
    scientificAgent: 'Phytophthora infestans',
    causalCategory: 'Oomycete',
    supportedHostPlants: ['Tomato (Solanum lycopersicum)', 'Potato (Solanum tuberosum)'],
    typicalVisibleSymptoms: [
      'Large, irregular, pale-green to dark water-soaked blotches starting near leaf tips or margins',
      'Lesions rapidly turn dark brown to purplish-black and expand across veins without restriction',
      'Delicate white cottony sporangiophores visible at lesion margins on the underside of leaves during cool, moist mornings',
      'Dark greasy stem lesions and firm, brown, corrugated fruit rot',
    ],
    differentialDiagnoses: [
      {
        condition: 'Early Blight (Alternaria solani)',
        distinguishingFeature: 'Early blight forms dry, discrete target-ring spots constrained by veins, whereas Late Blight forms large water-soaked blotches that cross veins.',
      },
      {
        condition: 'Gray Mold (Botrytis cinerea)',
        distinguishingFeature: 'Botrytis produces dense gray-brown fuzzy conidiophores rather than sparse white peripheral sporangia.',
      },
    ],
    favorableConditions: 'Cool-to-moderate temperatures (12–22 °C / 54–72 °F) combined with high relative humidity (>90%) and prolonged leaf wetness.',
    generalPreventionMeasures: [
      'Plant certified disease-free transplants and eliminate volunteer potato or tomato plants nearby.',
      'Maximize air circulation and avoid overhead irrigation, especially in late afternoon or evening.',
      'Select cultivars carrying validated Ph-2 / Ph-3 late blight resistance genes where available.',
    ],
    appropriateNextSteps: [
      'Treat suspected Late Blight as a high-priority community epidemic risk due to rapid wind-borne sporangia dispersal.',
      'Submit a physical sample or high-resolution macro photos to a state/regional plant diagnostic clinic for confirmation and clonal lineage typing.',
      'Remove severely affected plants in sealed bags if confirmed in small plots, and consult local extension advisories immediately.',
    ],
    referenceSources: [
      {
        title: 'USAblight National Late Blight Monitoring Network',
        institution: 'USDA-NIFA / Land-Grant University Extension',
        citation: 'Fry, W. E. et al., Phytopathology.',
      },
    ],
  },

  Tomato___Bacterial_spot: {
    classId: 'Tomato___Bacterial_spot',
    plantId: 'tomato',
    commonName: 'Tomato Bacterial Spot',
    scientificAgent: 'Xanthomonas perforans / X. euvesicatoria / X. vesicatoria / X. gardneri',
    causalCategory: 'Bacterial',
    supportedHostPlants: ['Tomato (Solanum lycopersicum)', 'Pepper (Capsicum annuum)'],
    typicalVisibleSymptoms: [
      'Small (<3 mm) circular-to-angular water-soaked spots appearing greasy on the underside',
      'Spots turn dark brown to black and remain small without concentric rings',
      'Coalescing lesions lead to yellowing, marginal firing/blighting, and "shot-hole" tearing of dry centers',
    ],
    differentialDiagnoses: [
      {
        condition: 'Bacterial Speck (Pseudomonas syringae pv. tomato)',
        distinguishingFeature: 'Bacterial speck lesions are smaller (<1–2 mm) with prominent bright yellow halos and thrive in cooler weather (<24 °C).',
      },
      {
        condition: 'Septoria Leaf Spot (Septoria lycopersici)',
        distinguishingFeature: 'Septoria spots develop distinct pale gray centers with black pycnidia dots.',
      },
    ],
    favorableConditions: 'Warm temperatures (24–30 °C / 75–86 °F) with driving rain, high humidity, and overhead sprinkler splash.',
    generalPreventionMeasures: [
      'Use pathogen-free certified seed and inspected transplants.',
      'Sanitize stakes, cages, and pruning tools between crops.',
      'Avoid handling, tying, or harvesting plants when foliage is wet with dew or rain.',
    ],
    appropriateNextSteps: [
      'Verify whether raised scabby spots are also present on green fruit sepals or fruit surfaces.',
      'Switch from overhead watering to drip irrigation if applicable.',
      'Consult regional extension specialists regarding bacteriophage, plant activator, or copper-resistance management protocols.',
    ],
    referenceSources: [
      {
        title: 'Bacterial Spot of Tomato and Pepper',
        institution: 'University of Florida IFAS Extension',
        citation: 'Vallad, G. E. et al., UF/IFAS Plant Pathology Department.',
      },
    ],
  },

  Tomato___Leaf_Mold: {
    classId: 'Tomato___Leaf_Mold',
    plantId: 'tomato',
    commonName: 'Tomato Leaf Mold',
    scientificAgent: 'Passalora fulva (syn. Cladosporium fulvum)',
    causalCategory: 'Fungal',
    supportedHostPlants: ['Tomato (Solanum lycopersicum)'],
    typicalVisibleSymptoms: [
      'Diffuse pale greenish-yellow spots lacking sharp margins on the upper leaf surface',
      'Corresponding dense olive-green to grayish-purple velvety fungal sporulation on the abaxial (lower) leaf surface',
      'Infected leaves yellow, curl upward, wither, and hang dry on the stem',
    ],
    differentialDiagnoses: [
      {
        condition: 'Powdery Mildew (Oidium neolycopersici)',
        distinguishingFeature: 'Powdery mildew produces white talcum-like colonies on both leaf surfaces rather than olive-brown velvet on the underside.',
      },
      {
        condition: 'Magnesium Deficiency',
        distinguishingFeature: 'Magnesium deficiency causes symmetric interveinal chlorosis on older leaves without abaxial olive-green fungal velvet.',
      },
    ],
    favorableConditions: 'High relative humidity (>85%) in greenhouses, high tunnels, or dense outdoor canopies at 21–24 °C.',
    generalPreventionMeasures: [
      'Ventilate greenhouses and heat at nightfall to keep relative humidity below 85%.',
      'Select tomato cultivars with Cf resistance genes.',
      'Prune lower foliage to improve air movement through the canopy.',
    ],
    appropriateNextSteps: [
      'Turn the leaf over to inspect the lower surface with a 10x hand lens for olive-brown velvety sporulation.',
      'Increase ventilation and reduce canopy humidity immediately.',
    ],
    referenceSources: [
      {
        title: 'Tomato Leaf Mold Management in High Tunnels and Greenhouses',
        institution: 'University of Minnesota Extension',
        citation: 'Grabowski, M., UMN Extension Yard and Garden.',
      },
    ],
  },

  Tomato___Septoria_leaf_spot: {
    classId: 'Tomato___Septoria_leaf_spot',
    plantId: 'tomato',
    commonName: 'Tomato Septoria Leaf Spot',
    scientificAgent: 'Septoria lycopersici',
    causalCategory: 'Fungal',
    supportedHostPlants: ['Tomato (Solanum lycopersicum)', 'Solanaceous weeds (e.g., horsenettle)'],
    typicalVisibleSymptoms: [
      'Numerous small circular spots (1.5–4 mm diameter) scattered densely across older lower leaves',
      'Spots exhibit light tan or gray centers surrounded by a dark brown margin',
      'Tiny black dot-like pycnidia (fruiting structures) visible inside the gray centers under magnification',
    ],
    differentialDiagnoses: [
      {
        condition: 'Early Blight (Alternaria solani)',
        distinguishingFeature: 'Early blight forms fewer, larger (5–15 mm) dark lesions with target-like concentric rings.',
      },
      {
        condition: 'Bacterial Spot (Xanthomonas spp.)',
        distinguishingFeature: 'Bacterial spots remain uniformly dark brown/greasy without pale gray pycnidial centers.',
      },
    ],
    favorableConditions: 'Moderate temperatures (20–25 °C / 68–77 °F) with frequent rain splash or prolonged high humidity.',
    generalPreventionMeasures: [
      'Eliminate solanaceous weeds (especially Carolina horsenettle and nightshade) around field borders.',
      'Mulch soil beneath plants and stake vines to prevent rain splash from soil debris.',
      'Rotate out of tomatoes for at least 2 years.',
    ],
    appropriateNextSteps: [
      'Examine the pale center of several mature spots with a hand lens (10x–20x) to confirm black pycnidia.',
      'Remove heavily infected lower leaves carefully without shaking spores onto upper foliage.',
    ],
    referenceSources: [
      {
        title: 'Septoria Leaf Spot of Tomato',
        institution: 'Missouri Botanical Garden / Extension Plant Pathology',
        citation: 'APS Compendium of Tomato Diseases.',
      },
    ],
  },

  'Tomato___Spider_mites_Two-spotted_spider_mite': {
    classId: 'Tomato___Spider_mites_Two-spotted_spider_mite',
    plantId: 'tomato',
    commonName: 'Two-Spotted Spider Mite Injury',
    scientificAgent: 'Tetranychus urticae',
    causalCategory: 'Mite / Pest',
    supportedHostPlants: ['Tomato (Solanum lycopersicum)', 'Pepper', 'Strawberry', 'Apple', 'Peach', 'Over 300 host crops'],
    typicalVisibleSymptoms: [
      'Fine pale yellow or whitish stippling (flecking) across the upper leaf surface from stylet feeding',
      'Progressive bronzing, drying, and stippled yellowing of leaflets',
      'Fine silken webbing on leaf undersides and between leaflets under moderate-to-high populations',
    ],
    differentialDiagnoses: [
      {
        condition: 'Ozone / Air Pollution Stipple',
        distinguishingFeature: 'Abiotic ozone flecking lacks mites, cast skins, spherical eggs, and webbing on the abaxial surface.',
      },
      {
        condition: 'Tomato Mosaic Virus',
        distinguishingFeature: 'Viral mosaic shows broad light/dark green islands rather than pinpoint feeding stipples.',
      },
    ],
    favorableConditions: 'Hot (>29 °C / 85 °F), dry weather, dusty field roads, and broad-spectrum insecticide disruption of natural predatory mites.',
    generalPreventionMeasures: [
      'Conserve natural predators (e.g., Phytoseiulus persimilis, Neoseiulus californicus) by avoiding unnecessary pyrethroid applications.',
      'Reduce road dust and maintain adequate soil moisture to avoid plant drought stress.',
    ],
    appropriateNextSteps: [
      'Tap suspect leaves over a sheet of white paper and inspect with a 10x hand lens for moving 0.4 mm mites.',
      'Consult regional IPM guidelines before selecting miticides or biological control releases.',
    ],
    referenceSources: [
      {
        title: 'UC IPM Pest Management Guidelines: Tomato Spider Mites',
        institution: 'University of California Agriculture and Natural Resources',
        citation: 'UC ANR Publication 3470.',
      },
    ],
  },

  Tomato___Target_Spot: {
    classId: 'Tomato___Target_Spot',
    plantId: 'tomato',
    commonName: 'Tomato Target Spot',
    scientificAgent: 'Corynespora cassiicola',
    causalCategory: 'Fungal',
    supportedHostPlants: ['Tomato (Solanum lycopersicum)', 'Pepper', 'Cucumber', 'Soybean'],
    typicalVisibleSymptoms: [
      'Pinpoint brown flecks expanding into circular-to-irregular lesions (up to 10 mm)',
      'Light brown necrotic center with subtle concentric zonation and darker outer ring',
      'Central necrotic tissue often cracks or splits open as lesions age',
    ],
    differentialDiagnoses: [
      {
        condition: 'Early Blight (Alternaria solani)',
        distinguishingFeature: 'Early blight target rings are darker and more strongly ridged; microscopic conidia morphology confirms Corynespora vs. Alternaria.',
      },
    ],
    favorableConditions: 'Warm temperatures (20–30 °C) and extended periods of free moisture inside dense shaded canopies.',
    generalPreventionMeasures: [
      'Prune dense inner foliage to improve airflow and light penetration.',
      'Avoid planting tomatoes adjacent to older infected tomato or cucurbit plantings.',
    ],
    appropriateNextSteps: [
      'Because Target Spot and Early Blight look very similar macroscopically, laboratory microscopy is recommended if precise pathogen identification is needed for resistance management.',
    ],
    referenceSources: [
      {
        title: 'Target Spot of Tomato (Corynespora cassiicola)',
        institution: 'UF/IFAS Extension',
        citation: 'Pernezny, K. et al., PP-K051.',
      },
    ],
  },

  Tomato___Tomato_Yellow_Leaf_Curl_Virus: {
    classId: 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    plantId: 'tomato',
    commonName: 'Tomato Yellow Leaf Curl Virus (TYLCV)',
    scientificAgent: 'Tomato yellow leaf curl virus (Genus Begomovirus)',
    causalCategory: 'Viral',
    supportedHostPlants: ['Tomato (Solanum lycopersicum)', 'Pepper (often symptomless carrier)', 'Common Bean'],
    typicalVisibleSymptoms: [
      'Severe upward cupping and curling of young upper leaflets',
      'Prominent yellowing (chlorosis) along leaflet margins and between veins',
      'Reduced leaflet size, thickened leathery texture, shortened internodes, and flower drop',
    ],
    differentialDiagnoses: [
      {
        condition: 'Physiological Leaf Roll',
        distinguishingFeature: 'Physiological leaf roll affects older lower leaves first (rolling upward without bright yellow chlorosis or stunting).',
      },
      {
        condition: 'Herbicide Drift (2,4-D / Dicamba)',
        distinguishingFeature: 'Growth regulator herbicides cause epinasty and parallel vein strapping rather than bright marginal chlorosis and cupping.',
      },
    ],
    favorableConditions: 'High populations of the silverleaf whitefly vector (Bemisia tabaci) during warm dry seasons.',
    generalPreventionMeasures: [
      'Plant TYLCV-resistant cultivars (carrying Ty-1, Ty-2, or Ty-3 genes).',
      'Use 50-mesh insect exclusion screens in nurseries and reflective silver mulches in open fields.',
      'Establish a host-free period and rogue infected plants early.',
    ],
    appropriateNextSteps: [
      'Inspect leaf undersides for adult whiteflies and nymphs.',
      'Note that fungicides and bactericides have no effect on viral infections; focus on vector management and roguing confirmed early infections.',
    ],
    referenceSources: [
      {
        title: 'UC IPM: Tomato Yellow Leaf Curl',
        institution: 'University of California ANR',
        citation: 'Gilbertson, R. L. et al., UC Davis Plant Pathology.',
      },
    ],
  },

  Tomato___Tomato_mosaic_virus: {
    classId: 'Tomato___Tomato_mosaic_virus',
    plantId: 'tomato',
    commonName: 'Tomato Mosaic Virus (ToMV)',
    scientificAgent: 'Tomato mosaic virus (Genus Tobamovirus)',
    causalCategory: 'Viral',
    supportedHostPlants: ['Tomato (Solanum lycopersicum)', 'Pepper (Capsicum annuum)'],
    typicalVisibleSymptoms: [
      'Mottled mosaic pattern of alternating light yellowish-green and dark green areas on leaves',
      'Leaf blade malformation including curling, puckering, or narrow "fern-leaf" / shoestring distortion',
      'Internal browning of fruit walls in acute infections',
    ],
    differentialDiagnoses: [
      {
        condition: 'Cucumber Mosaic Virus (CMV)',
        distinguishingFeature: 'CMV often produces more extreme filiform "shoestring" leaf blades; serological strip tests (ELISA/lateral flow) distinguish Tobamoviruses from CMV.',
      },
      {
        condition: 'Tomato Brown Rugose Fruit Virus (ToBRFV)',
        distinguishingFeature: 'ToBRFV breaks Tm-2² resistance and requires RT-PCR or specialized lateral-flow confirmation.',
      },
    ],
    favorableConditions: 'Mechanically transmitted rapidly via hands, pruning tools, clothing, and contaminated seed coats.',
    generalPreventionMeasures: [
      'Select cultivars carrying Tm-2² resistance genes.',
      'Wash hands thoroughly and dip pruning tools in disinfectant (e.g., 10% trisodium phosphate or household bleach solution) between plants.',
      'Use certified virus-tested seed.',
    ],
    appropriateNextSteps: [
      'Do not prune or handle suspect plants prior to touching healthy plants.',
      'Use a commercial immunostrip test or state diagnostic lab to confirm Tobamovirus status.',
    ],
    referenceSources: [
      {
        title: 'Tobamoviruses of Tomato and Pepper',
        institution: 'Cornell University Extension',
        citation: 'Zitter, T. A., Vegetable MD Online.',
      },
    ],
  },

  'Pepper,_bell___healthy': {
    classId: 'Pepper,_bell___healthy',
    plantId: 'pepper',
    commonName: 'Healthy Pepper Leaf',
    scientificAgent: 'None (Healthy Capsicum annuum)',
    causalCategory: 'Healthy',
    supportedHostPlants: ['Bell Pepper / Chilli Pepper (Capsicum annuum)'],
    typicalVisibleSymptoms: [
      'Smooth, glossy green ovate-to-lanceolate leaf blade',
      'Intact, flat entire margins without curling or necrotic spots',
      'Clear pinnate venation with uniform chlorophyll coloration',
    ],
    differentialDiagnoses: [
      {
        condition: 'Cultivar Anthocyanin Pigmentation',
        distinguishingFeature: 'Some hot chilli and ornamental Capsicum annuum cultivars naturally display purple-black anthocyanin shading on healthy leaves.',
      },
    ],
    favorableConditions: 'Warm soil (20–30 °C), consistent soil moisture, and well-drained root zone.',
    generalPreventionMeasures: [
      'Use drip irrigation and mulch to prevent soil splash.',
      'Scout undersides of leaves for aphids, thrips, and bacterial water-soaked flecks.',
    ],
    appropriateNextSteps: [
      'Maintain standard crop monitoring; note that leaf morphology alone cannot distinguish sweet bell pepper from chilli cultivars within Capsicum annuum.',
    ],
    referenceSources: [
      {
        title: 'Compendium of Pepper Diseases',
        institution: 'APS Press',
        citation: 'Pernezny, K., Roberts, P. D., Murphy, J. F., & Goldberg, N. P. (2003).',
      },
    ],
  },

  'Pepper,_bell___Bacterial_spot': {
    classId: 'Pepper,_bell___Bacterial_spot',
    plantId: 'pepper',
    commonName: 'Pepper Bacterial Leaf Spot',
    scientificAgent: 'Xanthomonas euvesicatoria (and related Xanthomonas spp.)',
    causalCategory: 'Bacterial',
    supportedHostPlants: ['Bell Pepper & Chilli Pepper (Capsicum annuum)', 'Tomato (Solanum lycopersicum)'],
    typicalVisibleSymptoms: [
      'Small water-soaked angular spots on lower leaf surface turning dark brown to black',
      'Raised pimple-like or corky margins on the underside of lesions',
      'Yellow chlorotic halos coalescing across the blade, leading to severe premature leaf drop (defoliation)',
    ],
    differentialDiagnoses: [
      {
        condition: 'Cercospora / Frogeye Leaf Spot (Cercospora capsici)',
        distinguishingFeature: 'Cercospora lesions are circular with a distinct light gray "frogeye" center and dark border, rather than angular water-soaked spots.',
      },
    ],
    favorableConditions: 'Warm temperatures (24–32 °C) with frequent wind-driven rain or overhead sprinkler irrigation.',
    generalPreventionMeasures: [
      'Plant pepper cultivars with stacked bacterial spot resistance (e.g., Bs1, Bs2, Bs3, Bs5 genes).',
      'Use certified pathogen-tested seed and transplants.',
      'Rotate away from peppers and tomatoes for 2–3 years and eliminate volunteer solanaceous weeds.',
    ],
    appropriateNextSteps: [
      'Inspect fallen leaves at the base of the plant, as pepper bacterial spot rapidly induces abscission of infected leaves.',
      'Avoid overhead watering and consult local extension guidelines for copper-mancozeb or biological bactericide schedules.',
    ],
    referenceSources: [
      {
        title: 'Bacterial Spot of Pepper',
        institution: 'NC State Extension Plant Pathology',
        citation: 'Ritchie, D. F., Vegetable Pathology Factsheets.',
      },
    ],
  },

  Pepper___Cercospora_leaf_spot: {
    classId: 'Pepper___Cercospora_leaf_spot',
    plantId: 'pepper',
    commonName: 'Pepper Frogeye / Cercospora Leaf Spot',
    scientificAgent: 'Cercospora capsici',
    causalCategory: 'Fungal',
    supportedHostPlants: ['Bell Pepper & Chilli Pepper (Capsicum annuum)'],
    typicalVisibleSymptoms: [
      'Circular to oblong lesions (3–10 mm) with light gray to tan centers and dark reddish-brown margins',
      'Concentric rings of tiny dark conidiophore tufts occasionally visible in the pale center',
      'Dried central tissue may drop out, leaving a shot-hole appearance',
    ],
    differentialDiagnoses: [
      {
        condition: 'Bacterial Spot (Xanthomonas euvesicatoria)',
        distinguishingFeature: 'Bacterial spot lesions are angular and water-soaked without a pale whitish-gray center.',
      },
    ],
    favorableConditions: 'Warm, humid weather (25–30 °C) with extended leaf wetness.',
    generalPreventionMeasures: [
      'Use clean seed, wider row spacing, and crop rotation.',
      'Incorporate or remove crop debris promptly after harvest.',
    ],
    appropriateNextSteps: [
      'Verify the characteristic pale "frogeye" center on mature lesions and consult regional extension management guides.',
    ],
    referenceSources: [
      {
        title: 'Frogeye Leaf Spot of Pepper (Cercospora capsici)',
        institution: 'AVRDC World Vegetable Center / Extension Pathology',
        citation: 'Black, L. L. et al., Pepper Diseases: A Field Guide.',
      },
    ],
  },

  Potato___healthy: {
    classId: 'Potato___healthy',
    plantId: 'potato',
    commonName: 'Healthy Potato Leaf',
    scientificAgent: 'None (Healthy Solanum tuberosum)',
    causalCategory: 'Healthy',
    supportedHostPlants: ['Potato (Solanum tuberosum)'],
    typicalVisibleSymptoms: [
      'Compound pinnate leaves with broad oval leaflets and smooth entire margins',
      'Even dark green coloration and crisp venation',
      'No target lesions, water-soaked margins, or interveinal necrosis',
    ],
    differentialDiagnoses: [
      {
        condition: 'Mild Potato Virus Y (PVY) Mosaic',
        distinguishingFeature: 'Certain PVY strains cause subtle faint mottling that requires oblique lighting or ELISA testing to detect.',
      },
    ],
    favorableConditions: 'Cool-to-moderate growing temperatures (15–22 °C) and well-drained hilled soil.',
    generalPreventionMeasures: [
      'Plant certified seed tubers and maintain proper hilling to protect developing tubers.',
    ],
    appropriateNextSteps: [
      'Continue regular field scouting, paying close attention to lower canopy shading and wet field depressions.',
    ],
    referenceSources: [
      {
        title: 'Compendium of Potato Diseases (2nd Ed.)',
        institution: 'APS Press',
        citation: 'Stevenson, W. R., Loria, R., Franc, G. D., & Weingartner, D. P. (2001).',
      },
    ],
  },

  Potato___Early_blight: {
    classId: 'Potato___Early_blight',
    plantId: 'potato',
    commonName: 'Potato Early Blight',
    scientificAgent: 'Alternaria solani',
    causalCategory: 'Fungal',
    supportedHostPlants: ['Potato (Solanum tuberosum)', 'Tomato (Solanum lycopersicum)'],
    typicalVisibleSymptoms: [
      'Dark brown to black dry necrotic spots (2–10 mm) with concentric target-board rings',
      'Lesion expansion is often restricted by larger leaf veins, giving an angular outline',
      'Yellow chlorotic tissue surrounding lesions on lower senescing leaves',
    ],
    differentialDiagnoses: [
      {
        condition: 'Brown Spot (Alternaria alternata)',
        distinguishingFeature: 'Brown spot forms smaller, more irregular dark flecks that coalesce without large concentric bull\'s-eyes.',
      },
      {
        condition: 'Ozone Injury / Nutrient Senescence',
        distinguishingFeature: 'Abiotic speckles lack concentric rings and conidia.',
      },
    ],
    favorableConditions: 'Alternating wet and dry periods at 20–29 °C, especially after tuber bulking begins or when nitrogen/phosphorus is depleted.',
    generalPreventionMeasures: [
      'Maintain balanced crop nutrition (especially nitrogen and phosphorus) to prevent premature canopy senescence.',
      'Rotate out of solanaceous crops and allow tubers skin-set before harvest to prevent tuber infection.',
    ],
    appropriateNextSteps: [
      'Assess whether lesions are confined to the bottom third of the canopy or advancing into the upper canopy.',
      'Consult local potato extension degree-day (P-Day) forecasting models.',
    ],
    referenceSources: [
      {
        title: 'Early Blight of Potato',
        institution: 'University of Idaho / Pacific Northwest Extension',
        citation: 'Wharton, P. & Wood, E., PNW Plant Disease Management Handbook.',
      },
    ],
  },

  Potato___Late_blight: {
    classId: 'Potato___Late_blight',
    plantId: 'potato',
    commonName: 'Potato Late Blight',
    scientificAgent: 'Phytophthora infestans',
    causalCategory: 'Oomycete',
    supportedHostPlants: ['Potato (Solanum tuberosum)', 'Tomato (Solanum lycopersicum)'],
    typicalVisibleSymptoms: [
      'Water-soaked light green to dark brown/black blotches at leaflet tips and margins',
      'Distinct yellowish-green halo bordering rapidly expanding necrotic tissue',
      'White downy sporulation ring on abaxial lesion margin under high humidity',
    ],
    differentialDiagnoses: [
      {
        condition: 'Early Blight (Alternaria solani)',
        distinguishingFeature: 'Early blight lesions are dry, smaller, vein-limited, and display concentric rings rather than water-soaked blotches.',
      },
    ],
    favorableConditions: 'Cool wet weather (10–24 °C) with relative humidity >90% from rain, fog, or center-pivot irrigation.',
    generalPreventionMeasures: [
      'Plant certified disease-free seed tubers and destroy cull piles and volunteer potatoes before emergence.',
      'Maintain soil hills over tubers to prevent sporangia from washing down into the tuber zone.',
    ],
    appropriateNextSteps: [
      'Inspect the underside of fresh lesions early in the morning for white sporulation.',
      'Contact regional potato extension blight hotlines immediately for confirmation and management recommendations.',
    ],
    referenceSources: [
      {
        title: 'Late Blight of Potato and Tomato',
        institution: 'APS Plant Health Instructor',
        citation: 'Fry, W. (2008). Phytophthora infestans: the plant (and R gene) destroyer.',
      },
    ],
  },

  Apple___healthy: {
    classId: 'Apple___healthy',
    plantId: 'apple',
    commonName: 'Healthy Apple Leaf',
    scientificAgent: 'None (Healthy Malus domestica)',
    causalCategory: 'Healthy',
    supportedHostPlants: ['Apple (Malus domestica)', 'Crabapple (Malus spp.)'],
    typicalVisibleSymptoms: [
      'Even medium-to-dark green oval lamina with finely serrated margins',
      'Light pubescence on the lower leaf surface typical of Malus domestica',
      'Free of olive-brown scab velvet, orange rust spots, or frogeye lesions',
    ],
    differentialDiagnoses: [
      {
        condition: 'Early Primary Scab Incubation',
        distinguishingFeature: 'Ascospore infections require 9–17 days after wetting events to produce visible olive lesions.',
      },
    ],
    favorableConditions: 'Orchard sites with good air drainage and winter leaf litter sanitation.',
    generalPreventionMeasures: [
      'Shred or apply urea to fallen orchard leaves in autumn to reduce overwintering fungal inoculum.',
    ],
    appropriateNextSteps: [
      'Continue monitoring orchard degree-day and wetting models (e.g., NEWA / Mills Table) from green tip through petal fall.',
    ],
    referenceSources: [
      {
        title: 'Compendium of Apple and Pear Diseases and Pests (2nd Ed.)',
        institution: 'APS Press',
        citation: 'Sutton, T. B., Aldwinckle, H. S., Agnello, A. M., & Walgenbach, J. F. (2014).',
      },
    ],
  },

  Apple___Apple_scab: {
    classId: 'Apple___Apple_scab',
    plantId: 'apple',
    commonName: 'Apple Scab',
    scientificAgent: 'Venturia inaequalis',
    causalCategory: 'Fungal',
    supportedHostPlants: ['Apple (Malus domestica)', 'Crabapple (Malus spp.)'],
    typicalVisibleSymptoms: [
      'Light olive-green spots with feathery, indistinct margins radiating along veins',
      'Lesions darken to olive-brown or black with a velvety texture as conidia form',
      'Older lesions become raised, corky, and cause dwarfing or puckering of the leaf blade',
    ],
    differentialDiagnoses: [
      {
        condition: 'Frogeye Leaf Spot / Black Rot (Botryosphaeria obtusa)',
        distinguishingFeature: 'Frogeye leaf spot has a sharp purple border and light tan center rather than feathery olive-brown velvet.',
      },
      {
        condition: 'Sooty Blotch (Fruit)',
        distinguishingFeature: 'Sooty blotch is a superficial epicuticular smudge on fruit rather than a foliar lesion.',
      },
    ],
    favorableConditions: 'Spring rain events wetting overwintered leaf litter at 6–24 °C (Mills infection periods).',
    generalPreventionMeasures: [
      'Plant scab-resistant apple cultivars (e.g., Liberty, Enterprise, Honeycrisp shows moderate resistance) where feasible.',
      'Flail-mow fallen leaves in autumn or apply 5% urea solution before leaf drop to accelerate leaf decomposition.',
      'Prune trees annually to open the canopy for rapid drying.',
    ],
    appropriateNextSteps: [
      'Check young cluster leaves and developing fruitlets for secondary conidial infections.',
      'Consult regional tree-fruit extension disease prediction models.',
    ],
    referenceSources: [
      {
        title: 'Apple Scab Biology and Management',
        institution: 'Cornell Fruit Resources / Penn State Extension',
        citation: 'MacHardy, W. E. (1996). Apple Scab: Biology, Epidemiology, and Management.',
      },
    ],
  },

  Apple___Black_rot: {
    classId: 'Apple___Black_rot',
    plantId: 'apple',
    commonName: 'Apple Frogeye Leaf Spot (Black Rot)',
    scientificAgent: 'Botryosphaeria obtusa (Diplodia seriata)',
    causalCategory: 'Fungal',
    supportedHostPlants: ['Apple (Malus domestica)', 'Pear', 'Quince'],
    typicalVisibleSymptoms: [
      'Small purple flecks enlarging into circular lesions (3–6 mm diameter)',
      'Center turns tan-to-light brown while the margin remains purplish, creating a distinct "frogeye" pattern',
      'Small black pycnidia may appear in the necrotic tan center of older spots',
    ],
    differentialDiagnoses: [
      {
        condition: 'Captan / Phytotoxicity Spot',
        distinguishingFeature: 'Chemical injury spots on sensitive cultivars lack fungal pycnidia and uniform purple borders.',
      },
      {
        condition: 'Alternaria Blotch (Alternaria mali)',
        distinguishingFeature: 'Alternaria blotch lesions expand more irregularly along veins and lack classic tan frogeye centers.',
      },
    ],
    favorableConditions: 'Warm temperatures (24–27 °C) with rain splash from dead wood cankers or mummified fruit in the tree.',
    generalPreventionMeasures: [
      'Prune out dead limbs, fire-blighted shoots, and bark cankers during dormant pruning.',
      'Remove all shriveled mummified apples hanging in trees, which serve as primary inoculum reservoirs.',
    ],
    appropriateNextSteps: [
      'Look directly above affected leaf clusters for a mummified fruit or dead branch canker releasing spores in rain.',
    ],
    referenceSources: [
      {
        title: 'Black Rot and Frogeye Leaf Spot of Apple',
        institution: 'Penn State Extension Tree Fruit Guide',
        citation: 'Peter, K. A., Penn State Fruit Research and Extension Center.',
      },
    ],
  },

  Apple___Cedar_apple_rust: {
    classId: 'Apple___Cedar_apple_rust',
    plantId: 'apple',
    commonName: 'Cedar Apple Rust',
    scientificAgent: 'Gymnosporangium juniperi-virginianae',
    causalCategory: 'Fungal',
    supportedHostPlants: ['Apple & Crabapple (telial/aecial host)', 'Eastern Red Cedar / Juniperus virginiana (alternate host)'],
    typicalVisibleSymptoms: [
      'Bright yellow-to-orange circular lesions on the upper (adaxial) leaf surface',
      'Reddish-orange border and clusters of tiny black dots (spermogonia) in the lesion center',
      'Fringed cup-shaped or tubular projections (aecia) emerging on the underside directly beneath upper spots',
    ],
    differentialDiagnoses: [
      {
        condition: 'Quince Rust & Hawthorn Rust',
        distinguishingFeature: 'Hawthorn rust also infects apple leaves with similar orange spots; quince rust primarily infects fruit without prominent foliar lesions.',
      },
    ],
    favorableConditions: 'Spring rains (12–24 °C) causing gelatinous orange telial horns on nearby junipers to release basidiospores.',
    generalPreventionMeasures: [
      'Remove wild Eastern red cedar (Juniperus virginiana) trees or galls within 300–500 meters where practical.',
      'Choose rust-resistant apple varieties (e.g., Redfree, Liberty, Freedom).',
    ],
    appropriateNextSteps: [
      'Inspect the lower leaf surface in mid-to-late summer for tubular aecia to confirm Gymnosporangium infection.',
      'Note that Cedar Apple Rust does not spread from apple leaf to apple leaf; all apple infections originate from junipers in spring.',
    ],
    referenceSources: [
      {
        title: 'Cedar Apple Rust and Related Rust Diseases',
        institution: 'Cornell University / Missouri Botanical Garden',
        citation: 'Aldwinckle, H. S., APS Compendium of Apple and Pear Diseases.',
      },
    ],
  },

  Grape___healthy: {
    classId: 'Grape___healthy',
    plantId: 'grape',
    commonName: 'Healthy Grape Leaf',
    scientificAgent: 'None (Healthy Vitis vinifera)',
    causalCategory: 'Healthy',
    supportedHostPlants: ['Grapevine (Vitis vinifera, Vitis labrusca, hybrid rootstocks)'],
    typicalVisibleSymptoms: [
      'Palmately 3- to 5-lobed green blade with coarse marginal serrations',
      'Clean venation and uniform green lamina free of reddish-brown spots or interveinal striping',
    ],
    differentialDiagnoses: [
      {
        condition: 'Early Downy Mildew Oil Spots (Plasmopara viticola)',
        distinguishingFeature: 'Verify that faint yellowish translucent "oil spots" and white underside down are absent.',
      },
    ],
    favorableConditions: 'Well-trellised vineyard rows with good sun exposure and canopy leaf pulling around the fruit zone.',
    generalPreventionMeasures: [
      'Perform dormant pruning and remove mummified clusters from trellis wires.',
    ],
    appropriateNextSteps: [
      'Continue routine vineyard scouting of shoots, tendrils, and developing berry clusters.',
    ],
    referenceSources: [
      {
        title: 'Compendium of Grape Diseases, Disorders, and Pests (2nd Ed.)',
        institution: 'APS Press',
        citation: 'Wilcox, W. F., Gubler, W. D., & Uyemoto, J. K. (2015).',
      },
    ],
  },

  Grape___Black_rot: {
    classId: 'Grape___Black_rot',
    plantId: 'grape',
    commonName: 'Grape Black Rot',
    scientificAgent: 'Guignardia bidwellii (anamorph Phyllosticta ampelicida)',
    causalCategory: 'Fungal',
    supportedHostPlants: ['Grape (Vitis vinifera, Vitis labrusca)'],
    typicalVisibleSymptoms: [
      'Circular to slightly angular reddish-brown or tan foliar spots (2–10 mm diameter)',
      'Distinct narrow dark brown-to-black border framing each lesion',
      'Diagnostic ring of tiny black pimple-like pycnidia arranged just inside the outer margin of the tan spot',
    ],
    differentialDiagnoses: [
      {
        condition: 'Phomopsis Cane and Leaf Spot (Phomopsis viticola)',
        distinguishingFeature: 'Phomopsis leaf spots are much smaller (<2 mm) with dark centers and bright yellow halos.',
      },
    ],
    favorableConditions: 'Warm wet weather (21–29 °C) from shoot emergence through 4–6 weeks post-bloom.',
    generalPreventionMeasures: [
      'Sanitation is critical: remove all mummified clusters from vines and trellis wires during dormant pruning.',
      'Cultivate or mulch beneath vines before budbreak to bury overwintered mummies on the soil surface.',
    ],
    appropriateNextSteps: [
      'Use a 10x hand lens to verify the ring of black pycnidia inside the tan foliar lesion.',
      'Inspect young berry clusters closely, as berries remain highly susceptible from bloom until veraison begins.',
    ],
    referenceSources: [
      {
        title: 'Black Rot of Grape',
        institution: 'Cornell University / Ohio State Extension',
        citation: 'Wilcox, W. F., NYSAES Grape Disease Factsheet.',
      },
    ],
  },

  'Grape___Esca_(Black_Measles)': {
    classId: 'Grape___Esca_(Black_Measles)',
    plantId: 'grape',
    commonName: 'Grape Esca (Black Measles)',
    scientificAgent: 'Phaeoacremonium minimum, Phaeomoniella chlamydospora & Fomitiporia spp.',
    causalCategory: 'Fungal',
    supportedHostPlants: ['Grape (Vitis vinifera)'],
    typicalVisibleSymptoms: [
      'Striking interveinal "tiger-stripe" pattern on leaves',
      'Dark reddish-brown (red cultivars) or necrotic tan bands between primary veins bordered by bright yellow chlorotic zones',
      'Bands of green tissue remain immediately adjacent to the main veins',
    ],
    differentialDiagnoses: [
      {
        condition: 'Pierce\'s Disease (Xylella fastidiosa)',
        distinguishingFeature: 'Pierce\'s disease causes marginal leaf scorching in concentric zones and matchstick petioles rather than interior interveinal tiger stripes.',
      },
      {
        condition: 'Potassium or Magnesium Deficiency',
        distinguishingFeature: 'Nutrient deficiencies are symmetric across the vine and lack internal trunk wood decay and berry measle spotting.',
      },
    ],
    favorableConditions: 'Trunk wound infections occurring during wet winter pruning events; foliar symptoms express during hot summer water stress.',
    generalPreventionMeasures: [
      'Delay pruning until late winter or use double-pruning techniques when wound susceptibility is lower.',
      'Protect large pruning wounds on cordons and trunks.',
      'Remove dead wood and infected trunks out of the vineyard.',
    ],
    appropriateNextSteps: [
      'Note that foliar tiger stripes are caused by translocated fungal toxins from wood infections inside the trunk or cordon.',
      'Flag affected vines during summer so trunks can be evaluated or renewed during dormant season.',
    ],
    referenceSources: [
      {
        title: 'UC IPM: Esca (Black Measles) of Grape',
        institution: 'University of California ANR',
        citation: 'Gubler, W. D., Rolshausen, P. E. et al., UC Davis Plant Pathology.',
      },
    ],
  },

  'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)': {
    classId: 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    plantId: 'grape',
    commonName: 'Grape Pseudocercospora / Isariopsis Leaf Blight',
    scientificAgent: 'Pseudocercospora vitis (syn. Isariopsis clavispora)',
    causalCategory: 'Fungal',
    supportedHostPlants: ['Grape (Vitis spp.)'],
    typicalVisibleSymptoms: [
      'Irregular angular dark reddish-brown to brownish-black spots (2–20 mm) delimited by small veins',
      'Subtle diffuse yellow halo often surrounds lesions on green leaves',
      'Olive-gray to dark brown synnemata (fungal tufts) on the underside of lesions in humid weather',
    ],
    differentialDiagnoses: [
      {
        condition: 'Grape Black Rot (Guignardia bidwellii)',
        distinguishingFeature: 'Black rot lesions are rounder with light tan centers and a distinct ring of black pycnidia.',
      },
    ],
    favorableConditions: 'Late-season warm, humid conditions in mid-to-late summer.',
    generalPreventionMeasures: [
      'Maintain canopy openness and remove fallen infected leaves after harvest.',
    ],
    appropriateNextSteps: [
      'Assess percentage of canopy defoliation; late-season infections after harvest may require sanitation for the following season.',
    ],
    referenceSources: [
      {
        title: 'Pseudocercospora Leaf Spot of Grape',
        institution: 'APS Compendium of Grape Diseases',
        citation: 'Wilcox, W. F. et al. (2015).',
      },
    ],
  },

  'Corn_(maize)___healthy': {
    classId: 'Corn_(maize)___healthy',
    plantId: 'corn',
    commonName: 'Healthy Corn / Maize Leaf',
    scientificAgent: 'None (Healthy Zea mays)',
    causalCategory: 'Healthy',
    supportedHostPlants: ['Corn / Maize (Zea mays)'],
    typicalVisibleSymptoms: [
      'Long linear-lanceolate deep green leaf blade with crisp parallel venation',
      'Clean pale midrib and intact margins without rectangular or cigar-shaped lesions',
    ],
    differentialDiagnoses: [
      {
        condition: 'Genetic Fleck / Physiological Spots',
        distinguishingFeature: 'Some maize hybrids naturally express harmless pinhead physiological flecking that never elongates or sporulates.',
      },
    ],
    favorableConditions: 'Adequate nitrogen fertility, well-drained soil, and balanced plant population.',
    generalPreventionMeasures: [
      'Scout lower-to-ear leaves around tasseling (VT) through silking (R1).',
    ],
    appropriateNextSteps: [
      'Continue standard agronomic monitoring of ear leaf health.',
    ],
    referenceSources: [
      {
        title: 'Compendium of Corn Diseases (4th Ed.)',
        institution: 'APS Press',
        citation: 'Munkvold, G. P. & White, D. G. (2016).',
      },
    ],
  },

  'Corn_(maize)___Cercospora_leaf_spot_Gray_leaf_spot': {
    classId: 'Corn_(maize)___Cercospora_leaf_spot_Gray_leaf_spot',
    plantId: 'corn',
    commonName: 'Corn Gray Leaf Spot',
    scientificAgent: 'Cercospora zeae-maydis / Cercospora zeina',
    causalCategory: 'Fungal',
    supportedHostPlants: ['Corn / Maize (Zea mays)'],
    typicalVisibleSymptoms: [
      'Distinctly rectangular, blocky tan-to-brown lesions (2–4 mm wide × 1–6 cm long)',
      'Lesion margins are strictly parallel and restricted by secondary longitudinal leaf veins',
      'Lesions turn silvery-gray under humid conditions as conidia are produced',
    ],
    differentialDiagnoses: [
      {
        condition: 'Northern Corn Leaf Blight (Exserohilum turcicum)',
        distinguishingFeature: 'Northern Corn Leaf Blight lesions are much larger (5–15 cm), elliptical/cigar-shaped with tapered ends that cross veins.',
      },
      {
        condition: 'Bacterial Leaf Streak (Xanthomonas vasicola pv. vasculorum)',
        distinguishingFeature: 'Bacterial leaf streak lesions have wavy, irregular long margins and look translucent yellow when backlit.',
      },
    ],
    favorableConditions: 'Warm temperatures (24–30 °C) with prolonged high humidity (>90% for 12+ hours), fog, and continuous no-till corn residue.',
    generalPreventionMeasures: [
      'Select maize hybrids with high Gray Leaf Spot resistance ratings.',
      'Rotate corn with soybean, small grains, or forage crops to allow surface corn residue to decompose.',
    ],
    appropriateNextSteps: [
      'Hold the leaf up to the light: blocky straight-sided opaque edges confirm Gray Leaf Spot vs. wavy backlit bacterial streaks.',
      'Evaluate whether lesions have reached the ear leaf or one leaf below the ear leaf prior to tassel/silking.',
    ],
    referenceSources: [
      {
        title: 'Gray Leaf Spot of Corn',
        institution: 'Crop Protection Network (CPN) / Land-Grant Extension',
        citation: 'Wise, K. et al., CPN-2002.',
      },
    ],
  },

  'Corn_(maize)___Common_rust_': {
    classId: 'Corn_(maize)___Common_rust_',
    plantId: 'corn',
    commonName: 'Corn Common Rust',
    scientificAgent: 'Puccinia sorghi',
    causalCategory: 'Fungal',
    supportedHostPlants: ['Corn / Maize (Zea mays)', 'Oxalis spp. (alternate host)'],
    typicalVisibleSymptoms: [
      'Small circular-to-elongate cinnamon-brown to brick-red pustules (uredinia) scattered across the blade',
      'Pustules erupt through the epidermis on both upper and lower leaf surfaces, leaving a torn epidermis collar',
      'Pustules darken to black as teliospores develop late in the season',
    ],
    differentialDiagnoses: [
      {
        condition: 'Southern Rust (Puccinia polysora)',
        distinguishingFeature: 'Southern rust pustules are smaller, lighter orange-tan, circular, and occur almost exclusively on the upper leaf surface.',
      },
    ],
    favorableConditions: 'Cool-to-moderate temperatures (16–23 °C / 60–75 °F) with heavy dew (~6 hours of leaf wetness).',
    generalPreventionMeasures: [
      'Plant resistant field corn or sweet corn hybrids (Rp-gene or partial polygenic resistance).',
    ],
    appropriateNextSteps: [
      'Check both upper and lower leaf surfaces: pustules on both surfaces indicate Common Rust rather than Southern Rust.',
    ],
    referenceSources: [
      {
        title: 'Common Rust and Southern Rust of Corn',
        institution: 'Purdue University / Crop Protection Network',
        citation: 'CPN-2009 Corn Disease Management.',
      },
    ],
  },

  'Corn_(maize)___Northern_Leaf_Blight': {
    classId: 'Corn_(maize)___Northern_Leaf_Blight',
    plantId: 'corn',
    commonName: 'Northern Corn Leaf Blight',
    scientificAgent: 'Exserohilum turcicum (teleomorph Setosphaeria turcica)',
    causalCategory: 'Fungal',
    supportedHostPlants: ['Corn / Maize (Zea mays)', 'Sorghum', 'Sudangrass'],
    typicalVisibleSymptoms: [
      'Large (2.5–15 cm long) elliptical or "cigar-shaped" grayish-green to tan necrotic lesions',
      'Smooth tapered ends that expand across leaf veins without blocky restriction',
      'Dusty dark olive-gray fungal sporulation forming inside lesions during humid weather',
    ],
    differentialDiagnoses: [
      {
        condition: 'Stewart\'s Wilt (Pantoea stewartii)',
        distinguishingFeature: 'Stewart\'s wilt forms long wavy pale streaks running the length of the leaf with flea beetle feeding scars inside.',
      },
      {
        condition: 'Gray Leaf Spot (Cercospora zeae-maydis)',
        distinguishingFeature: 'Gray leaf spot lesions are smaller and strictly rectangular/vein-bounded.',
      },
    ],
    favorableConditions: 'Moderate temperatures (18–27 °C / 64–80 °F) with heavy dew or rain (6–18 hours of free moisture).',
    generalPreventionMeasures: [
      'Select hybrids with polygenic resistance and/or Ht resistance genes matched to regional pathogen races.',
      'Rotate crops and manage surface corn debris.',
    ],
    appropriateNextSteps: [
      'Scout lower leaves prior to tasseling to determine whether lesions are present on 50% or more of plants.',
    ],
    referenceSources: [
      {
        title: 'Northern Corn Leaf Blight',
        institution: 'Crop Protection Network',
        citation: 'Mueller, D. & Wise, K., CPN-2001.',
      },
    ],
  },

  Strawberry___healthy: {
    classId: 'Strawberry___healthy',
    plantId: 'strawberry',
    commonName: 'Healthy Strawberry Leaf',
    scientificAgent: 'None (Healthy Fragaria × ananassa)',
    causalCategory: 'Healthy',
    supportedHostPlants: ['Strawberry (Fragaria × ananassa)'],
    typicalVisibleSymptoms: [
      'Vibrant green trifoliate leaves with uniform coarse triangular marginal teeth',
      'Clean lamina free of purple blotches, gray-centered spots, or V-shaped marginal necrosis',
    ],
    differentialDiagnoses: [
      {
        condition: 'Autumn / Cold Anthocyanin Reddening',
        distinguishingFeature: 'Cool temperatures naturally turn older outer strawberry leaves uniform reddish-purple without fungal acervuli.',
      },
    ],
    favorableConditions: 'Well-drained raised beds or matted rows with good air movement.',
    generalPreventionMeasures: [
      'Use certified disease-free runner plants and drip irrigation.',
    ],
    appropriateNextSteps: [
      'Continue regular field scouting for mites, tarnished plant bug, and foliar spots.',
    ],
    referenceSources: [
      {
        title: 'Compendium of Strawberry Diseases (2nd Ed.)',
        institution: 'APS Press',
        citation: 'Maas, J. L. (1998).',
      },
    ],
  },

  Strawberry___Leaf_scorch: {
    classId: 'Strawberry___Leaf_scorch',
    plantId: 'strawberry',
    commonName: 'Strawberry Leaf Scorch',
    scientificAgent: 'Diplocarpon earlianum (anamorph Marssonina fragariae)',
    causalCategory: 'Fungal',
    supportedHostPlants: ['Strawberry (Fragaria × ananassa)'],
    typicalVisibleSymptoms: [
      'Numerous small (1–5 mm) irregular dark purple to reddish-purple blotches on the upper leaf surface',
      'Blotches remain dark purple/brown throughout without developing a white or light gray center',
      'Under heavy infection, blotches coalesce and tissue between lesions turns reddish-brown, giving a dry "scorched" appearance',
      'Tiny black glistening acervuli (fruiting bodies) develop in lesion centers',
    ],
    differentialDiagnoses: [
      {
        condition: 'Common Leaf Spot (Mycosphaerella fragariae)',
        distinguishingFeature: 'Common Leaf Spot lesions develop a distinct white-to-light-gray center surrounded by a purple border ("bird\'s-eye" spot), whereas Leaf Scorch blotches stay solid dark purple/brown.',
      },
      {
        condition: 'Phomopsis Leaf Blight (Phomopsis obscurans)',
        distinguishingFeature: 'Phomopsis forms large V-shaped necrotic lesions widening toward the leaflet margin.',
      },
    ],
    favorableConditions: 'Spring and autumn rain splash at 15–26 °C.',
    generalPreventionMeasures: [
      'Renovate perennial strawberry beds after harvest by mowing old foliage and removing/incorporating infected leaves.',
      'Select resistant cultivars and avoid dense, shaded canopies.',
    ],
    appropriateNextSteps: [
      'Inspect mature spots closely: absence of white centers confirms Leaf Scorch over Common Leaf Spot.',
    ],
    referenceSources: [
      {
        title: 'Strawberry Leaf Spot, Leaf Scorch, and Leaf Blight',
        institution: 'Ohio State / Cornell Berry Extension',
        citation: 'Ellis, M. A., OARDC Plant Pathology.',
      },
    ],
  },

  Peach___healthy: {
    classId: 'Peach___healthy',
    plantId: 'peach',
    commonName: 'Healthy Peach Leaf',
    scientificAgent: 'None (Healthy Prunus persica)',
    causalCategory: 'Healthy',
    supportedHostPlants: ['Peach & Nectarine (Prunus persica)'],
    typicalVisibleSymptoms: [
      'Smooth, glossy green oblong-lanceolate blade tapering to an acuminate tip',
      'Finely serrulate margins and normal small petiolar glands near the base of the blade',
    ],
    differentialDiagnoses: [
      {
        condition: 'Healthy Petiolar Nectaries',
        distinguishingFeature: 'Small raised reniform or globose glands at the base of the leaf blade are normal anatomical structures of Prunus persica, not insect galls or disease.',
      },
    ],
    favorableConditions: 'Well-drained sandy loam orchard sites with open-center pruning.',
    generalPreventionMeasures: [
      'Maintain dormant pruning for light penetration and airflow.',
    ],
    appropriateNextSteps: [
      'Continue routine orchard scouting.',
    ],
    referenceSources: [
      {
        title: 'Compendium of Stone Fruit Diseases',
        institution: 'APS Press',
        citation: 'Ogawa, J. M., Zehr, E. I. et al. (1995).',
      },
    ],
  },

  Peach___Bacterial_spot: {
    classId: 'Peach___Bacterial_spot',
    plantId: 'peach',
    commonName: 'Peach Bacterial Spot',
    scientificAgent: 'Xanthomonas arboricola pv. pruni',
    causalCategory: 'Bacterial',
    supportedHostPlants: ['Peach & Nectarine (Prunus persica)', 'Plum', 'Apricot', 'Cherry'],
    typicalVisibleSymptoms: [
      'Small (1–5 mm) angular water-soaked spots strictly delimited by fine leaf veins',
      'Spots turn purple-brown to black and frequently cluster near the leaf tip and midrib where dew drains',
      'Necrotic centers abscise and drop out, leaving angular "shot-hole" perforations, followed by leaf yellowing and drop',
    ],
    differentialDiagnoses: [
      {
        condition: 'Coryneum Blight / Shot Hole (Wilsonomyces carpophilus)',
        distinguishingFeature: 'Fungal shot-hole lesions are rounder (3–10 mm) with concentric tan centers and small dark fungal tufts inside before dropping out.',
      },
      {
        condition: 'Copper / Captan Phytotoxicity',
        distinguishingFeature: 'Chemical shot-hole injury occurs uniformly across sprayed leaf surfaces simultaneously without progressive bacterial water-soaking.',
      },
    ],
    favorableConditions: 'Warm temperatures (24–29 °C) with wind-driven rain, heavy dew, and sandy soils where windblown sand abrades leaves.',
    generalPreventionMeasures: [
      'Select peach cultivars bred for bacterial spot resistance (especially in humid eastern growing regions).',
      'Establish sod row middles and windbreaks to reduce windblown sand injury on foliage.',
    ],
    appropriateNextSteps: [
      'Inspect developing fruit for small sunken water-soaked spots and cracking.',
      'Distinguish angular vein-limited bacterial lesions from circular fungal shot-hole before selecting management interventions.',
    ],
    referenceSources: [
      {
        title: 'Bacterial Spot of Peach and Stone Fruits',
        institution: 'Clemson / Rutgers / Penn State Tree Fruit Extension',
        citation: 'Ritchie, D. F. (1995). Bacterial spot in Compendium of Stone Fruit Diseases.',
      },
    ],
  },

  'Cherry_(including_sour)___healthy': {
    classId: 'Cherry_(including_sour)___healthy',
    plantId: 'cherry',
    commonName: 'Healthy Cherry Leaf',
    scientificAgent: 'None (Healthy Prunus avium / Prunus cerasus)',
    causalCategory: 'Healthy',
    supportedHostPlants: ['Sweet Cherry (Prunus avium)', 'Tart / Sour Cherry (Prunus cerasus)'],
    typicalVisibleSymptoms: [
      'Flat, ovate-elliptic dark green leaf blade with doubly serrate margins',
      'Prominent parallel lateral veins and pair of reddish nectar glands on the petiole',
    ],
    differentialDiagnoses: [
      {
        condition: 'Early Cherry Leaf Spot (Blumeriella jaapii)',
        distinguishingFeature: 'Inspect lower leaves for tiny purple pinpoint spots that precede yellowing in Blumeriella infections.',
      },
    ],
    favorableConditions: 'Well-ventilated orchard canopy.',
    generalPreventionMeasures: [
      'Prune trees for airflow and manage orchard floor leaf litter.',
    ],
    appropriateNextSteps: [
      'Continue standard orchard scouting.',
    ],
    referenceSources: [
      {
        title: 'Compendium of Stone Fruit Diseases',
        institution: 'APS Press',
        citation: 'Ogawa, J. M. et al. (1995).',
      },
    ],
  },

  'Cherry_(including_sour)___Powdery_mildew': {
    classId: 'Cherry_(including_sour)___Powdery_mildew',
    plantId: 'cherry',
    commonName: 'Cherry Powdery Mildew',
    scientificAgent: 'Podosphaera clandestina',
    causalCategory: 'Fungal',
    supportedHostPlants: ['Sweet Cherry (Prunus avium)', 'Tart / Sour Cherry (Prunus cerasus)'],
    typicalVisibleSymptoms: [
      'White to light-gray powdery, felt-like mycelial patches on leaf surfaces (often starting on abaxial surface)',
      'Upward curling, longitudinal rolling, puckering, and stunting of young terminal leaves',
      'Tiny spherical amber-to-black chasmothecia (cleistothecia) embedded in older mycelial mats late in the season',
    ],
    differentialDiagnoses: [
      {
        condition: 'Spray Residue (Kaolin Clay / Lime-Sulfur)',
        distinguishingFeature: 'Inorganic spray deposits do not cause upward leaf curling or show filamentous fungal hyphae under a hand lens.',
      },
    ],
    favorableConditions: 'Warm dry days (20–28 °C) with high relative humidity (>70%) at night; free water is not required for conidial germination after primary infection.',
    generalPreventionMeasures: [
      'Prune out vigorous water sprouts and open the canopy to increase sunlight and air movement.',
      'Avoid excessive nitrogen fertilization that stimulates succulent terminal shoot growth late into summer.',
    ],
    appropriateNextSteps: [
      'Focus scouting on actively growing terminal shoots and water sprouts inside the tree canopy.',
      'Consult regional stone-fruit extension guidelines if fruit infection risk is present.',
    ],
    referenceSources: [
      {
        title: 'Powdery Mildew of Sweet and Sour Cherry',
        institution: 'Washington State University / Michigan State Extension',
        citation: 'Grove, G. G., WSU Tree Fruit Research & Extension.',
      },
    ],
  },
};

export const PRELIMINARY_SCREENING_DISCLAIMER =
  'FieldGuard AI provides preliminary computer-vision screening based on visual leaf characteristics and calibrated uncertainty thresholds. Image classification alone is not a confirmed laboratory diagnosis. Pathogen identification can be confounded by abiotic disorders, nutrient deficiencies, spray injury, viral co-infections, or early incubation stages. Always verify critical crop management decisions with a local agricultural extension specialist or certified plant pathology clinic.';
