import { GradeCurriculum } from './types';

export const ACADEMIC_CURRICULUM: GradeCurriculum[] = [
  {
    grade: 3,
    label: 'Grade 3 (Primary 3)',
    stage: 'Lower Basic',
    subjects: [
      {
        name: 'Mathematics',
        lessons: [
          {
            title: 'Place Value & Numeration',
            description: 'Place values up to 10,000, expanded notation, and number sense.',
            query: 'Primary 3 Mathematics Place Value',
          },
          {
            title: 'Basic Operations',
            description: 'Addition and subtraction with renaming; multiplication tables 1–12.',
            query: 'Primary 3 Mathematics Operations',
          },
          {
            title: 'Fractions & Geometry',
            description: 'Proper and improper fractions; 2D shapes, polygons, and perimeter.',
            query: 'Primary 3 Mathematics Fractions Geometry',
          },
          {
            title: 'Measurement & Statistics',
            description: 'Units of length, mass, capacity, and introduction to bar charts.',
            query: 'Primary 3 Mathematics Measurement',
          },
        ],
      },
      {
        name: 'English Studies',
        lessons: [
          {
            title: 'Grammar & Punctuation',
            description: 'Parts of speech (nouns, pronouns, verbs, adjectives) and basic punctuation.',
            query: 'Primary 3 English Grammar Punctuation',
          },
          {
            title: 'Literacy & Phonics',
            description: 'Narrative paragraphs, guided reading comprehension, spelling rules, and phonics.',
            query: 'Primary 3 English Phonics Reading',
          },
        ],
      },
      {
        name: 'Basic Science & Technology (BST)',
        lessons: [
          {
            title: 'Basic Science',
            description: 'Living and non-living things, plant parts, human sensory systems, and soil types.',
            query: 'Primary 3 Basic Science Living Things',
          },
          {
            title: 'Basic Technology & ICT',
            description: 'Simple machines (levers, pulleys) and computer hardware (mouse, keyboard, monitor).',
            query: 'Primary 3 Computer Hardware Machines',
          },
          {
            title: 'Physical & Health Education',
            description: 'Athletic fundamentals, body movements, and personal safety rules.',
            query: 'Primary 3 Physical Health Education',
          },
        ],
      },
      {
        name: 'National Values Education (NVE)',
        lessons: [
          {
            title: 'Social & Civic Studies',
            description: 'Family structures, duties of family members, and community leadership.',
            query: 'Primary 3 Social Studies Family',
          },
          {
            title: 'Civic Identity',
            description: 'National symbols (flag, anthem, coat of arms) and environmental cleanliness.',
            query: 'Primary 3 Civic Education National Symbols',
          },
        ],
      },
      {
        name: 'Pre-Vocational Studies (PVS)',
        lessons: [
          {
            title: 'Agricultural Science & Home Economics',
            description: 'Introduction to crop farming, farm animals, personal hygiene, and home care.',
            query: 'Primary 3 Agricultural Science Hygiene',
          },
        ],
      },
      {
        name: 'Cultural & Creative Arts (CCA)',
        lessons: [
          {
            title: 'Arts, Crafts & Performing Arts',
            description: 'Basic drawing, local crafts, rhythm in music, and performing arts.',
            query: 'Primary 3 Creative Arts Music',
          },
        ],
      },
    ],
  },
  {
    grade: 4,
    label: 'Grade 4 (Primary 4)',
    stage: 'Middle Basic',
    subjects: [
      {
        name: 'Mathematics',
        lessons: [
          {
            title: 'Operations & Numeration',
            description: 'Operations up to 10,000, multi-digit multiplication, and long division.',
            query: 'Primary 4 Mathematics Operations',
          },
          {
            title: 'Fractions & Measurement',
            description: 'Equivalent fractions, comparing fractions, length, mass, and time calculations.',
            query: 'Primary 4 Mathematics Fractions Measurement',
          },
          {
            title: 'Geometry & Data',
            description: 'Properties of 2D shapes, perimeter calculations, data collection, and bar graphs.',
            query: 'Primary 4 Mathematics Geometry Data',
          },
        ],
      },
      {
        name: 'English Studies',
        lessons: [
          {
            title: 'Grammar & Structure',
            description: 'Adverbs, prepositions, conjunctions, and basic subject-verb agreement.',
            query: 'Primary 4 English Grammar Structure',
          },
          {
            title: 'Composition & Reading',
            description: 'Descriptive writing, story structure, passage analysis, and vocabulary.',
            query: 'Primary 4 English Composition Reading',
          },
        ],
      },
      {
        name: 'Basic Science & Technology (BST)',
        lessons: [
          {
            title: 'Basic Science',
            description: 'Human digestive system, plant classification, and environmental cleanliness.',
            query: 'Primary 4 Basic Science Digestive System Plants',
          },
          {
            title: 'Technology & ICT',
            description: 'Care of simple tools, computer input/output devices, and digital safety rules.',
            query: 'Primary 4 Technology Computer Devices',
          },
          {
            title: 'Physical & Health Education',
            description: 'Fundamental movement skills, track events, and safety practices.',
            query: 'Primary 4 Physical Health Safety',
          },
        ],
      },
      {
        name: 'National Values Education (NVE)',
        lessons: [
          {
            title: 'Social & Civic Studies',
            description: 'Community values, civic duties of citizens, highway code, and road safety.',
            query: 'Primary 4 Civic Education Road Safety',
          },
        ],
      },
      {
        name: 'Pre-Vocational Studies (PVS)',
        lessons: [
          {
            title: 'Agriculture & Home Economics',
            description: 'Classification of crops, farm tools, simple kitchen equipment, and hygiene.',
            query: 'Primary 4 Agriculture Kitchen Equipment',
          },
        ],
      },
      {
        name: 'Cultural & Creative Arts (CCA)',
        lessons: [
          {
            title: 'Arts & Music',
            description: 'Pattern designing, traditional musical instruments, drama, and role-play.',
            query: 'Primary 4 Creative Arts Pattern Music',
          },
        ],
      },
    ],
  },
  {
    grade: 5,
    label: 'Grade 5 (Primary 5)',
    stage: 'Middle Basic',
    subjects: [
      {
        name: 'Mathematics',
        lessons: [
          {
            title: 'Numeration & Decimals',
            description: 'Roman numerals up to 1,000; decimals, percentages, and basic ratios.',
            query: 'Primary 5 Mathematics Decimals Ratios',
          },
          {
            title: 'Factors & Financial Math',
            description: 'LCM and HCF; money transactions, profit and loss calculations.',
            query: 'Primary 5 Mathematics Factors Profit Loss',
          },
          {
            title: 'Geometry & Measurement',
            description: 'Area and volume of cubes and cuboids, line properties, and angle types.',
            query: 'Primary 5 Mathematics Geometry Volume',
          },
        ],
      },
      {
        name: 'English Studies',
        lessons: [
          {
            title: 'Grammar & Concord',
            description: 'Tenses (present/past continuous, perfect) and subject-verb agreement.',
            query: 'Primary 5 English Grammar Tenses',
          },
          {
            title: 'Composition & Oral English',
            description: 'Formal vs. informal letters, figures of speech (similes, metaphors), and speech sounds.',
            query: 'Primary 5 English Formal Letters Figures of Speech',
          },
        ],
      },
      {
        name: 'Basic Science & Technology (BST)',
        lessons: [
          {
            title: 'Science & Health',
            description: 'Skeletal and circulatory systems, environmental changes (erosion, pollution), and drug abuse awareness.',
            query: 'Primary 5 Basic Science Body Systems Environment',
          },
          {
            title: 'Technology & Software',
            description: 'Forms of energy (heat, light, sound), operating systems, and word processing basics.',
            query: 'Primary 5 Technology Energy Software',
          },
          {
            title: 'Physical & Health Education',
            description: 'Field events, gymnastics, and community health education.',
            query: 'Primary 5 Physical Education Gymnastics',
          },
        ],
      },
      {
        name: 'National Values Education (NVE)',
        lessons: [
          {
            title: 'Civic & Social Rights',
            description: 'National unity, civic obligations, arms of government, and child trafficking awareness.',
            query: 'Primary 5 Civic Education Government Rights',
          },
        ],
      },
      {
        name: 'Pre-Vocational Studies (PVS)',
        lessons: [
          {
            title: 'Agriculture & Home Economics',
            description: 'Soil fertility, animal husbandry basics, clothing maintenance, and meal preparation.',
            query: 'Primary 5 Agriculture Soil Husbandry Meal Prep',
          },
        ],
      },
      {
        name: 'Cultural & Creative Arts (CCA)',
        lessons: [
          {
            title: 'Visual Arts & Music',
            description: 'Craft making, motif design, traditional dances, and musical notes.',
            query: 'Primary 5 Creative Arts Craft Dance Notes',
          },
        ],
      },
    ],
  },
  {
    grade: 6,
    label: 'Grade 6 (Primary 6)',
    stage: 'Middle Basic',
    subjects: [
      {
        name: 'Mathematics',
        lessons: [
          {
            title: 'Decimals, Ratios & Percentages',
            description: 'Advanced decimals, percentage increase/decrease, ratios, and proportions.',
            query: 'Primary 6 Mathematics Decimals Percentages Ratios',
          },
          {
            title: 'Geometry & Probability',
            description: 'Area of composite shapes, volume of 3D solids, angle measurement, average, and simple probability.',
            query: 'Primary 6 Mathematics Geometry Probability',
          },
          {
            title: 'Pre-Algebra',
            description: 'Simple algebraic symbols and linear open sentences.',
            query: 'Primary 6 Mathematics Algebra Open Sentences',
          },
        ],
      },
      {
        name: 'English Studies',
        lessons: [
          {
            title: 'Advanced Grammar',
            description: 'Direct and indirect speech, complex sentence structures, and relative clauses.',
            query: 'Primary 6 English Speech Clauses Grammar',
          },
          {
            title: 'Essays & Rhetoric',
            description: 'Persuasive essays, argumentative writing, summary techniques, and comprehension.',
            query: 'Primary 6 English Essays Comprehension Summary',
          },
        ],
      },
      {
        name: 'Basic Science & Technology (BST)',
        lessons: [
          {
            title: 'Science & Energy',
            description: 'Basic electricity and simple circuits, environmental conservation, and energy conversion.',
            query: 'Primary 6 Basic Science Electricity Energy',
          },
          {
            title: 'Computer Studies',
            description: 'Software applications, internet fundamentals, and online safety/ethics.',
            query: 'Primary 6 Computer Software Internet Safety',
          },
          {
            title: 'Physical & Health Education',
            description: 'Ball games, physical fitness assessment, safety, and first aid.',
            query: 'Primary 6 Physical Education Fitness First Aid',
          },
        ],
      },
      {
        name: 'National Values Education (NVE)',
        lessons: [
          {
            title: 'Civic & Security Education',
            description: 'Human rights, crime prevention, security agencies, and constitutional obligations.',
            query: 'Primary 6 Civic Education Security Rights',
          },
        ],
      },
      {
        name: 'Pre-Vocational Studies (PVS)',
        lessons: [
          {
            title: 'Agriculture & Home Economics',
            description: 'Farm record keeping, agricultural pests, consumer education, and meal planning.',
            query: 'Primary 6 Agriculture Pests Meal Planning',
          },
        ],
      },
      {
        name: 'Cultural & Creative Arts (CCA)',
        lessons: [
          {
            title: 'Arts & Theater',
            description: 'Perspective drawing, theater staging, music composition basics, and cultural heritage.',
            query: 'Primary 6 Creative Arts Perspective Staging',
          },
        ],
      },
    ],
  },
  {
    grade: 7,
    label: 'Grade 7 (JSS 1)',
    stage: 'Upper Basic',
    subjects: [
      {
        name: 'Mathematics',
        lessons: [
          {
            title: 'Number Bases & Arithmetic',
            description: 'Number bases (binary), fractions, decimals, and percentages.',
            query: 'JSS 1 Mathematics Binary Fractions Decimals',
          },
          {
            title: 'Algebra & Equations',
            description: 'Algebraic expressions and simple linear equations.',
            query: 'JSS 1 Mathematics Algebra Linear Equations',
          },
          {
            title: 'Geometry & Statistics',
            description: 'Perimeter and area of plane shapes, angles (parallel lines, triangles), data collection, and presentation.',
            query: 'JSS 1 Mathematics Geometry Statistics',
          },
        ],
      },
      {
        name: 'Basic Science',
        lessons: [
          {
            title: 'Environmental & Physical Science',
            description: 'Family health, environmental pollution, living vs. non-living classification, states of matter, kinetic theory, force, and energy.',
            query: 'JSS 1 Basic Science Matter Kinetic Energy',
          },
        ],
      },
      {
        name: 'Basic Technology',
        lessons: [
          {
            title: 'Technical Foundations',
            description: 'Safety workshop rules, properties of wood, metals, and plastics, hand tools, and freehand sketching.',
            query: 'JSS 1 Basic Technology Hand Tools Sketching',
          },
        ],
      },
      {
        name: 'Computer Studies / ICT',
        lessons: [
          {
            title: 'Digital Foundations',
            description: 'Computer generations, hardware and software concepts, operating systems, and keyboarding skills.',
            query: 'JSS 1 ICT Computer Generations Keyboarding',
          },
        ],
      },
      {
        name: 'Business Studies',
        lessons: [
          {
            title: 'Business Concepts',
            description: 'Office procedures, organization departments, clerical roles, and introduction to bookkeeping.',
            query: 'JSS 1 Business Studies Office Bookkeeping',
          },
        ],
      },
      {
        name: 'English Studies',
        lessons: [
          {
            title: 'Language & Composition',
            description: 'Parts of speech mastery, paragraph development, narrative writing, phonetics, and comprehension.',
            query: 'JSS 1 English Grammar Composition Phonetics',
          },
        ],
      },
      {
        name: 'Social Studies & Civic Education',
        lessons: [
          {
            title: 'Civic & Social Values',
            description: 'Social environment, citizenship, values, cultural diversity, and Nigerian history.',
            query: 'JSS 1 Social Studies Citizenship History',
          },
        ],
      },
    ],
  },
  {
    grade: 8,
    label: 'Grade 8 (JSS 2)',
    stage: 'Upper Basic',
    subjects: [
      {
        name: 'Mathematics',
        lessons: [
          {
            title: 'Number Operations & Algebra',
            description: 'Directed numbers, expansion, factorization, and linear equations in two operations.',
            query: 'JSS 2 Mathematics Directed Numbers Factorization',
          },
          {
            title: 'Geometry & Data',
            description: "Pythagoras' theorem, volume and surface area of cylinders/prisms, angles of elevation/depression, frequency tables, and pie charts.",
            query: 'JSS 2 Mathematics Pythagoras Geometry Pie Charts',
          },
        ],
      },
      {
        name: 'Basic Science',
        lessons: [
          {
            title: 'Biology & Chemistry Basics',
            description: 'Human reproduction, growth changes, skeletal/respiratory systems, periodic table overview, work, energy, power, and thermal energy transfer.',
            query: 'JSS 2 Basic Science Periodic Table Body Systems Energy',
          },
        ],
      },
      {
        name: 'Basic Technology',
        lessons: [
          {
            title: 'Technical Drawing & Processing',
            description: 'First-angle orthographic projections, geometric constructions, timber conversion/seasoning, and electricity transmission.',
            query: 'JSS 2 Basic Technology Projections Timber Electricity',
          },
        ],
      },
      {
        name: 'Computer Studies / ICT',
        lessons: [
          {
            title: 'Software & Web Basics',
            description: 'Word processing, graphics presentation tools, computer ethics, internet browsing, and search strategies.',
            query: 'JSS 2 ICT Word Processing Presentation Internet',
          },
        ],
      },
      {
        name: 'Business Studies',
        lessons: [
          {
            title: 'Bookkeeping & Commerce',
            description: 'Double-entry bookkeeping (cash book, ledgers, journals), consumer rights, and entrepreneurship.',
            query: 'JSS 2 Business Studies Bookkeeping Ledgers Commerce',
          },
        ],
      },
      {
        name: 'English Studies',
        lessons: [
          {
            title: 'Grammar & Writing',
            description: 'Active and passive voice, formal letters, expository composition, stress, and intonation.',
            query: 'JSS 2 English Passive Voice Formal Letters Stress',
          },
        ],
      },
      {
        name: 'Social Studies & Civic Education',
        lessons: [
          {
            title: 'Governance & Rights',
            description: 'Arms of government, rule of law, national consciousness, and human rights education.',
            query: 'JSS 2 Civic Education Rule of Law Rights',
          },
        ],
      },
    ],
  },
  {
    grade: 9,
    label: 'Grade 9 (JSS 3)',
    stage: 'Upper Basic',
    subjects: [
      {
        name: 'Mathematics',
        lessons: [
          {
            title: 'Equations & Variation',
            description: 'Simultaneous linear equations, quadratic equations by factor method, and variation (direct/inverse).',
            query: 'JSS 3 Mathematics Simultaneous Quadratic Variation',
          },
          {
            title: 'Trigonometry & Finance',
            description: 'Trigonometry (sine, cosine, tangent), circle geometry, compound interest, financial arithmetic, and measures of central tendency.',
            query: 'JSS 3 Mathematics Trigonometry Circle Geometry Compound Interest',
          },
        ],
      },
      {
        name: 'Basic Science',
        lessons: [
          {
            title: 'Advanced Science Foundations',
            description: 'Genetics and heredity, crude oil and petrochemicals, metals and non-metals, light/sound waves, magnetism, and electrical circuits.',
            query: 'JSS 3 Basic Science Genetics Petrochemicals Magnetism',
          },
        ],
      },
      {
        name: 'Basic Technology',
        lessons: [
          {
            title: 'Applied Engineering',
            description: 'Machine tools, mechanisms (gears, belts, cams), building construction basics, and maintenance.',
            query: 'JSS 3 Basic Technology Mechanisms Building Construction',
          },
        ],
      },
      {
        name: 'Computer Studies / ICT',
        lessons: [
          {
            title: 'Programming & Data',
            description: 'Algorithm design, flowcharts, introductory programming, spreadsheet calculations, and database concepts.',
            query: 'JSS 3 ICT Algorithms Programming Spreadsheets',
          },
        ],
      },
      {
        name: 'Business Studies',
        lessons: [
          {
            title: 'Financial Accounting & Commerce',
            description: 'Trial balance, final accounts of sole traders, business communication, and commercial careers.',
            query: 'JSS 3 Business Studies Trial Balance Final Accounts',
          },
        ],
      },
      {
        name: 'English Studies',
        lessons: [
          {
            title: 'Rhetoric & Literature',
            description: 'Argumentative essays, speech writing, literary analysis (prose, poetry, drama), and summary writing.',
            query: 'JSS 3 English Argumentative Essays Literature Summary',
          },
        ],
      },
      {
        name: 'Social Studies & Civic Education',
        lessons: [
          {
            title: 'State & Global Governance',
            description: 'State and federal government systems, international relations, economic development, and social issues.',
            query: 'JSS 3 Social Studies Governance International Relations',
          },
        ],
      },
    ],
  },
  {
    grade: 10,
    label: 'Grade 10 (SS 1)',
    stage: 'Senior Secondary',
    subjects: [
      {
        name: 'General Mathematics',
        lessons: [
          {
            title: 'Core Mathematics',
            description: 'Modular arithmetic, indices, logarithms, sets and Venn diagrams, quadratic equations, surface areas and volumes of spheres/cones, circle geometry, and acute angle trigonometry.',
            query: 'SS 1 Mathematics Logarithms Sets Quadratic Spheres Trigonometry',
          },
        ],
      },
      {
        name: 'English Language',
        lessons: [
          {
            title: 'Composition & Analysis',
            description: 'Narrative and descriptive essays, summary writing techniques, comprehension analysis, clause analysis, and concord.',
            query: 'SS 1 English Essays Summary Clauses Concord',
          },
        ],
      },
      {
        name: 'Physics (Science)',
        lessons: [
          {
            title: 'Mechanics & Thermal Physics',
            description: "Units, dimensions, kinematics, rectilinear acceleration, scalar/vector quantities, projectile motion, Hooke's law, temperature, and thermal expansion.",
            query: 'SS 1 Physics Kinematics Vectors Projectile Hooke Expansion',
          },
        ],
      },
      {
        name: 'Chemistry (Science)',
        lessons: [
          {
            title: 'Chemical Principles',
            description: 'Nature of matter, atomic structure, bonding, periodic table, stoichiometry, mole concept, gas laws, and acids, bases, and salts.',
            query: 'SS 1 Chemistry Atomic Structure Stoichiometry Gas Laws Acids',
          },
        ],
      },
      {
        name: 'Biology (Science)',
        lessons: [
          {
            title: 'Cell & Organismal Biology',
            description: 'Cell structure and organization, classification of living organisms, plant/animal nutrition, transport systems, and respiration.',
            query: 'SS 1 Biology Cell Structure Nutrition Transport Respiration',
          },
        ],
      },
      {
        name: 'Economics (Commercial / Humanities)',
        lessons: [
          {
            title: 'Microeconomics & Production',
            description: 'Scarcity, choice, scale of preference, demand/supply mechanics, elasticity, production theory, and Malthusian population theory.',
            query: 'SS 1 Economics Scarcity Demand Supply Elasticity Production',
          },
        ],
      },
      {
        name: 'Financial Accounting (Commercial)',
        lessons: [
          {
            title: 'Accounting Fundamentals',
            description: 'Double-entry bookkeeping, trading, profit and loss account, balance sheet basics, and bank reconciliation statements.',
            query: 'SS 1 Accounting Double Entry Trading Account Balance Sheet',
          },
        ],
      },
      {
        name: 'Government (Humanities)',
        lessons: [
          {
            title: 'Political Science Basics',
            description: 'Power, authority, legitimacy, sovereignty, political ideologies (democracy, socialism), constitutions, and arms of government.',
            query: 'SS 1 Government Sovereignty Democracy Constitutions',
          },
        ],
      },
      {
        name: 'Civic Education & ICT',
        lessons: [
          {
            title: 'Civic Values & Data Processing',
            description: 'Citizenship values, democratic processes, data processing concepts, computer hardware, and software architecture.',
            query: 'SS 1 Civic Education Data Processing Hardware',
          },
        ],
      },
    ],
  },
  {
    grade: 11,
    label: 'Grade 11 (SS 2)',
    stage: 'Senior Secondary',
    subjects: [
      {
        name: 'General Mathematics',
        lessons: [
          {
            title: 'Advanced Algebra & Geometry',
            description: 'Logarithms (negative characteristics), linear inequalities, simultaneous linear/quadratic equations, circle theorems, sequence and series (AP/GP), 2D vectors, and probability.',
            query: 'SS 2 Mathematics Inequalities Circle Theorems Sequence Series Vectors Probability',
          },
        ],
      },
      {
        name: 'English Language',
        lessons: [
          {
            title: 'Speech & Advanced Composition',
            description: 'Formal speech writing, argumentative/expository essays, complex clause structure, active/passive voice, phrasal verbs, stress, and intonation.',
            query: 'SS 2 English Speech Writing Expository Essays Phrasal Verbs',
          },
        ],
      },
      {
        name: 'Physics (Science)',
        lessons: [
          {
            title: 'Waves, Electricity & Optics',
            description: "Wave properties (reflection, refraction, sound, light), lenses, optical instruments, electric fields, Coulomb's/Ohm's/Kirchhoff's laws, SHM, and magnetic fields.",
            query: 'SS 2 Physics Waves Lenses Electric Fields Kirchhoff SHM Magnetism',
          },
        ],
      },
      {
        name: 'Chemistry (Science)',
        lessons: [
          {
            title: 'Physical & Inorganic Chemistry',
            description: 'Redox reactions, electrolysis, reaction rates, chemical equilibrium, thermochemistry, water, solubility, and non-metals (C, N, S, O).',
            query: 'SS 2 Chemistry Redox Electrolysis Reaction Rates Equilibrium Non-metals',
          },
        ],
      },
      {
        name: 'Biology (Science)',
        lessons: [
          {
            title: 'Physiology & Ecology',
            description: 'Excretion, homeostasis, nervous coordination, sense organs, ecology (biomes, food webs, population), and plant/mammalian reproduction.',
            query: 'SS 2 Biology Homeostasis Nervous System Ecology Reproduction',
          },
        ],
      },
      {
        name: 'Economics (Commercial / Humanities)',
        lessons: [
          {
            title: 'Macroeconomics & Banking',
            description: 'Market structures (competition, monopoly, oligopoly), national income accounting (GDP, GNP), money, central banking, monetary policy, and inflation.',
            query: 'SS 2 Economics Market Structures National Income Banking Inflation',
          },
        ],
      },
      {
        name: 'Financial Accounting (Commercial)',
        lessons: [
          {
            title: 'Financial Statements & Adjustments',
            description: 'Correction of errors, suspense account, partnership accounts (goodwill, revaluation), company accounts (shares/debentures), and control accounts.',
            query: 'SS 2 Accounting Errors Partnership Accounts Shares Debentures',
          },
        ],
      },
      {
        name: 'Government (Humanities)',
        lessons: [
          {
            title: 'Systems & Colonial History',
            description: 'Electoral systems, political parties, pressure groups, civil service, and pre-colonial Nigerian systems (Hausa-Fulani, Yoruba, Igbo).',
            query: 'SS 2 Government Electoral Systems Pre-colonial Nigeria',
          },
        ],
      },
      {
        name: 'Civic Education & ICT',
        lessons: [
          {
            title: 'Rights & Database Systems',
            description: 'Rule of law, human trafficking awareness, database management systems, data security, and ethics.',
            query: 'SS 2 Civic Education Database Systems Data Security',
          },
        ],
      },
    ],
  },
  {
    grade: 12,
    label: 'Grade 12 (SS 3)',
    stage: 'Senior Secondary',
    subjects: [
      {
        name: 'General Mathematics',
        lessons: [
          {
            title: 'Pre-Calculus & Applied Mathematics',
            description: 'Matrices, determinants, coordinate geometry (straight lines, gradients), calculus basics (differentiation/integration), bearings, spherical geometry, and ogives.',
            query: 'SS 3 Mathematics Matrices Coordinate Geometry Calculus Bearings Ogives',
          },
        ],
      },
      {
        name: 'English Language',
        lessons: [
          {
            title: 'Advanced Rhetoric & Exam Mastery',
            description: 'Advanced summary/comprehension, register analysis, essay synthesis, critical literary appreciation, and oral examination skills.',
            query: 'SS 3 English Advanced Summary Literary Appreciation Register Analysis',
          },
        ],
      },
      {
        name: 'Physics (Science)',
        lessons: [
          {
            title: 'Modern & Quantum Physics',
            description: 'Electromagnetic induction, alternating current (AC circuits, RLC), atomic models, radioactivity, half-life, wave-particle duality, and energy quantization.',
            query: 'SS 3 Physics Induction AC Circuits Radioactivity Duality Quantization',
          },
        ],
      },
      {
        name: 'Chemistry (Science)',
        lessons: [
          {
            title: 'Organic & Analytical Chemistry',
            description: 'Hydrocarbons, alkanols, alkanoic acids, esters, fats/oils, polymers, metallurgy (Fe, Cu, Al extraction), volumetric and qualitative analysis.',
            query: 'SS 3 Chemistry Organic Hydrocarbons Polymers Metallurgy Volumetric Analysis',
          },
        ],
      },
      {
        name: 'Biology (Science)',
        lessons: [
          {
            title: 'Genetics, Evolution & Ecology',
            description: "Genetics, Mendel's laws, chromosomes, DNA structure, variation, evolution, natural selection, and environmental conservation.",
            query: 'SS 3 Biology Genetics Mendel DNA Variation Evolution Conservation',
          },
        ],
      },
      {
        name: 'Economics (Commercial / Humanities)',
        lessons: [
          {
            title: 'Public Finance & Global Economy',
            description: 'Public finance, taxation, government budgets, international trade (comparative advantage, balance of payments), economic planning, IMF, and World Bank.',
            query: 'SS 3 Economics Public Finance Taxation International Trade IMF World Bank',
          },
        ],
      },
      {
        name: 'Financial Accounting (Commercial)',
        lessons: [
          {
            title: 'Advanced & Public Accounting',
            description: 'Incomplete records/single entry, manufacturing accounts, non-profit organization accounts, and public sector accounting.',
            query: 'SS 3 Accounting Incomplete Records Manufacturing Non-profit Public Sector',
          },
        ],
      },
      {
        name: 'Government (Humanities)',
        lessons: [
          {
            title: 'Constitutional History & Foreign Policy',
            description: 'Colonial administration (indirect rule), constitutional history of Nigeria (1922 Clifford to 1999), federalism, foreign policy, AU, ECOWAS, and UN.',
            query: 'SS 3 Government Colonial Rule Nigerian Constitution Federalism Foreign Policy',
          },
        ],
      },
      {
        name: 'Civic Education & ICT',
        lessons: [
          {
            title: 'Civic Leadership & Advanced Systems',
            description: 'Civil society roles, global security issues, computer networking, web design basics, and system maintenance.',
            query: 'SS 3 Civic Education Networking Web Design Systems Maintenance',
          },
        ],
      },
    ],
  },
];

