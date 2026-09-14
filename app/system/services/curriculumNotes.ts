import { Article } from '../types';

export const CURRICULUM_NOTES_MAP: Record<string, Article> = {
  // ==========================================
  // GRADE 3 (PRIMARY 3)
  // ==========================================
  'primary 3 mathematics place value': {
    title: 'Place Value & Numeration (Primary 3 Mathematics)',
    category: 'Mathematics',
    gradeLabel: 'Grade 3 (Primary 3)',
    isCurriculumNote: true,
    intro: 'Lesson Objectives: At the end of this lesson, you will be able to identify place values up to 10,000 (Thousands, Hundreds, Tens, Units), write numbers in expanded form, and state the value of any digit in a 4-digit number.',
    funFact: '📌 Key Memory Rule: Moving one position to the left in a number increases its value by 10 times. (10 Units = 1 Ten, 10 Tens = 1 Hundred, 10 Hundreds = 1 Thousand).',
    sections: [
      {
        subtitle: '1. Core Definitions & Key Vocabulary',
        content: `• Place Value: The position or place of a digit in a number, which determines its value.\n• Digit: Any of the symbols 0, 1, 2, 3, 4, 5, 6, 7, 8, or 9 used to form numbers.\n• Expanded Form: Writing a number as the sum of the values of its digits (e.g., 4,325 = 4,000 + 300 + 20 + 5).`
      },
      {
        subtitle: '2. Detailed Lesson Notes & Worked Examples',
        content: `Understanding 4-Digit Place Value Columns:\nTh = Thousands | H = Hundreds | T = Tens | U = Units\n\nExample 1: Find the place value of each digit in 7,842.\n• 7 is in the Thousands place → Value = 7,000\n• 8 is in the Hundreds place → Value = 800\n• 4 is in the Tens place → Value = 40\n• 2 is in the Units place → Value = 2\n\nExample 2: Write 5,069 in expanded form.\n5,069 = 5 Thousands + 0 Hundreds + 6 Tens + 9 Units = 5,000 + 60 + 9.`
      },
      {
        subtitle: '3. Key Revision Takeaways',
        content: `• Always count place value positions starting from right to left: Units → Tens → Hundreds → Thousands.\n• The digit zero (0) serves as a placeholder to hold a column position.`
      },
      {
        subtitle: '4. Practice Exercises & Solutions',
        content: `Question 1: What is the value of 6 in 6,431?\nSolution: 6 is in the Thousands column, so its value is 6,000.\n\nQuestion 2: Write 3,408 in expanded form.\nSolution: 3,000 + 400 + 8.\n\nQuestion 3: Which digit is in the Tens place in 9,152?\nSolution: Digit 5.`
      }
    ],
    relatedTopics: ['Basic Operations', 'Fractions & Geometry', 'Measurement & Statistics'],
    quiz: [
      {
        question: 'What is the place value of 8 in 4,821?',
        options: ['8 Units', '8 Tens', '8 Hundreds', '8 Thousands'],
        correctAnswer: 2,
        explanation: 'In 4,821, digit 8 is in the Hundreds column (4 Thousands, 8 Hundreds, 2 Tens, 1 Unit).'
      },
      {
        question: 'What is 2,000 + 500 + 30 + 7 written as a single number?',
        options: ['2,537', '2,503', '25,370', '2,357'],
        correctAnswer: 0,
        explanation: 'Combining 2 Thousands + 5 Hundreds + 3 Tens + 7 Units gives 2,537.'
      },
      {
        question: 'In the number 9,045, what digit holds the Hundreds position?',
        options: ['9', '0', '4', '5'],
        correctAnswer: 1,
        explanation: 'Digit 0 is in the Hundreds position (9 Thousands, 0 Hundreds, 4 Tens, 5 Units).'
      }
    ]
  },

  'primary 3 mathematics operations': {
    title: 'Basic Operations: Addition, Subtraction & Multiplication (Primary 3)',
    category: 'Mathematics',
    gradeLabel: 'Grade 3 (Primary 3)',
    isCurriculumNote: true,
    intro: 'Lesson Objectives: Learn to add and subtract 3-digit and 4-digit numbers with renaming (regrouping/carrying/borrowing), and master multiplication tables from 1 to 12.',
    funFact: '📌 Key Memory Rule: In addition, order does not matter (3 + 5 = 5 + 3). In subtraction, order ALWAYS matters (8 - 3 ≠ 3 - 8).',
    sections: [
      {
        subtitle: '1. Core Definitions',
        content: `• Sum: The result obtained by adding two or more numbers together.\n• Difference: The result obtained when subtracting one number from another.\n• Product: The result of multiplying two numbers.`
      },
      {
        subtitle: '2. Detailed Lesson Notes & Step-by-Step Solutions',
        content: `Adding with Regrouping (Carrying):\nSolve 2,348 + 1,475:\n  Th  H  T  U\n   2  3  4  8\n+  1  4  7  5\n-------------\n   3  8  2  3\nSteps: 8+5=13 (write 3, carry 1). 4+7+1=12 (write 2, carry 1). 3+4+1=8. 2+1=3. Result = 3,823.\n\nSubtracting with Borrowing:\nSolve 5,432 - 2,185 = 3,247.`
      },
      {
        subtitle: '3. Practice Exercises',
        content: `Problem 1: Calculate 4,582 + 3,239.\nAnswer: 7,821.\n\nProblem 2: Calculate 6,240 - 2,815.\nAnswer: 3,425.`
      }
    ],
    relatedTopics: ['Place Value & Numeration', 'Fractions & Geometry'],
    quiz: [
      {
        question: 'What is the sum of 1,450 and 2,380?',
        options: ['3,830', '3,730', '3,800', '3,930'],
        correctAnswer: 0,
        explanation: '1,450 + 2,380 = 3,830.'
      }
    ]
  },

  'primary 3 english grammar punctuation': {
    title: 'Grammar & Punctuation (Primary 3 English Studies)',
    category: 'English Studies',
    gradeLabel: 'Grade 3 (Primary 3)',
    isCurriculumNote: true,
    intro: 'Lesson Objectives: Identify parts of speech (Nouns, Pronouns, Verbs, Adjectives) and correctly apply punctuation marks (Capital Letters, Full Stops, Commas, Question Marks).',
    funFact: '📌 Key Memory Rule: Every proper noun (names of people, places, days, months) MUST begin with a capital letter!',
    sections: [
      {
        subtitle: '1. Parts of Speech Overview',
        content: `• Noun: A naming word for a person, place, animal, or thing (e.g., Ada, Abuja, Dog, Chair).\n• Pronoun: A word used in place of a noun (e.g., he, she, it, they, we).\n• Verb: An action or doing word (e.g., run, eat, write, sleep).\n• Adjective: A word that describes a noun (e.g., tall, red, beautiful, quick).`
      },
      {
        subtitle: '2. Punctuation Rules & Examples',
        content: `• Capital Letter (A, B, C): Used at the start of a sentence and for proper nouns.\n• Full Stop (.): Used at the end of a statement sentence.\n• Question Mark (?): Used at the end of an asking sentence.\n• Comma (,): Used to separate items in a list or pause in a sentence.\n\nExample: "Ada bought apples, oranges, and bananas in Lagos."`
      },
      {
        subtitle: '3. Practice Questions',
        content: `Identify the adjective in: "The clever boy solved the math problem."\nAnswer: "clever" (describes the boy).`
      }
    ],
    relatedTopics: ['Literacy & Phonics', 'Language & Composition'],
    quiz: [
      {
        question: 'Which word in "The fast rabbit ran into the hole" is an adjective?',
        options: ['rabbit', 'fast', 'ran', 'hole'],
        correctAnswer: 1,
        explanation: '"fast" describes the noun rabbit, so it is an adjective.'
      }
    ]
  },

  'primary 3 basic science living things': {
    title: 'Living & Non-Living Things (Primary 3 Basic Science)',
    category: 'Basic Science',
    gradeLabel: 'Grade 3 (Primary 3)',
    isCurriculumNote: true,
    intro: 'Lesson Objectives: Distinguish between living and non-living things using the characteristics of life (MR NIGER D), observe plant parts, and classify soil types.',
    funFact: '📌 Key Memory Rule: Remember MR NIGER D — Movement, Respiration, Nutrition, Irritability, Growth, Excretion, Reproduction, Death.',
    sections: [
      {
        subtitle: '1. Characteristics of Living Things',
        content: `Living things are organisms that possess life. They exhibit 8 characteristics:\n1. Movement: Ability to change position or location.\n2. Respiration: Breathing and producing energy from food.\n3. Nutrition: Feeding to obtain energy.\n4. Irritability: Responding to changes in the environment.\n5. Growth: Increasing in size and height.\n6. Excretion: Removing waste products from the body.\n7. Reproduction: Producing young ones of their own kind.\n8. Death: End of life process.`
      },
      {
        subtitle: '2. Plant Parts & Soil Types',
        content: `Main Parts of a Flowering Plant:\n• Roots: Anchor plant in soil and absorb water/nutrients.\n• Stem: Supports leaves and transports water.\n• Leaves: Make food for the plant through photosynthesis.\n• Flowers & Seeds: Enable reproduction.\n\nSoil Types:\n• Sandy Soil: Coarse particles, drains water quickly.\n• Clay Soil: Very fine particles, holds a lot of water.\n• Loamy Soil: Mixture of sand and clay with humus; best soil for farming.`
      }
    ],
    relatedTopics: ['Basic Science & Technology', 'Agriculture & Home Economics'],
    quiz: [
      {
        question: 'Which soil type is best for growing crops because it retains moisture and nutrients?',
        options: ['Sandy Soil', 'Clay Soil', 'Loamy Soil', 'Gravel'],
        correctAnswer: 2,
        explanation: 'Loamy soil contains a balanced mixture of sand, clay, and rich organic matter (humus).'
      }
    ]
  },

  // ==========================================
  // GRADE 7 (JSS 1)
  // ==========================================
  'jss 1 mathematics binary fractions decimals': {
    title: 'Number Bases & Arithmetic (JSS 1 Mathematics)',
    category: 'Mathematics',
    gradeLabel: 'Grade 7 (JSS 1)',
    isCurriculumNote: true,
    intro: 'Lesson Objectives: Convert between base 10 (decimal) and base 2 (binary), simplify fractions, convert fractions to decimals and percentages, and calculate percentage values.',
    funFact: '📌 Key Memory Rule: Binary (Base 2) uses only TWO digits: 0 and 1. Computers process all data in binary!',
    sections: [
      {
        subtitle: '1. Core Definitions',
        content: `• Decimal System (Base 10): Number system using 10 digits (0–9).\n• Binary System (Base 2): Number system using 2 digits (0 and 1).\n• Fraction: A part of a whole, written as Numerator / Denominator.`
      },
      {
        subtitle: '2. Step-by-Step Conversions & Worked Examples',
        content: `Converting Base 10 to Base 2 (Repeated Division by 2):\nConvert 13 in base 10 to binary:\n13 ÷ 2 = 6 r 1\n 6 ÷ 2 = 3 r 0\n 3 ÷ 2 = 1 r 1\n 1 ÷ 2 = 0 r 1\nReading remainders upward → 13₁₀ = 1101₂.\n\nConverting Binary to Base 10:\nConvert 1101₂ to Base 10:\n= (1 × 2³) + (1 × 2²) + (0 × 2¹) + (1 × 2⁰)\n= 8 + 4 + 0 + 1 = 13₁₀.`
      },
      {
        subtitle: '3. Practice Exercises',
        content: `Exercise 1: Convert 25₁₀ to binary.\nSolution: 25 ÷ 2 = 12 r1; 12 ÷ 2 = 6 r0; 6 ÷ 2 = 3 r0; 3 ÷ 2 = 1 r1; 1 ÷ 2 = 0 r1. Answer: 11001₂.\n\nExercise 2: Express 3/5 as a percentage.\nSolution: (3/5) × 100% = 60%.`
      }
    ],
    relatedTopics: ['Algebra & Equations', 'Geometry & Statistics'],
    quiz: [
      {
        question: 'What is the binary representation of decimal number 9?',
        options: ['1001₂', '1010₂', '1100₂', '1111₂'],
        correctAnswer: 0,
        explanation: '9 = 8 + 1 = (1 × 2³) + (0 × 2²) + (0 × 2¹) + (1 × 2⁰) = 1001₂.'
      }
    ]
  },

  'jss 1 basic science matter kinetic energy': {
    title: 'States of Matter, Kinetic Theory & Energy (JSS 1 Basic Science)',
    category: 'Basic Science',
    gradeLabel: 'Grade 7 (JSS 1)',
    isCurriculumNote: true,
    intro: 'Lesson Objectives: Explain the three states of matter, describe the kinetic theory of matter, understand environmental pollution, and differentiate kinetic and potential energy.',
    funFact: '📌 Key Memory Rule: Energy cannot be created or destroyed, only transformed from one form to another (Law of Conservation of Energy).',
    sections: [
      {
        subtitle: '1. Three States of Matter & Kinetic Theory',
        content: `Matter is anything that has mass and occupies space.\n\n1. Solid: Fixed shape and volume. Particles packed tightly in rigid arrangements, vibrating in fixed positions.\n2. Liquid: Fixed volume, takes shape of container. Particles close together but can move/slide past each other.\n3. Gas: No fixed shape or volume. Particles far apart and move rapidly in all directions at high speeds.`
      },
      {
        subtitle: '2. Force, Work, and Energy Forms',
        content: `• Force: A push or pull acting on an object (measured in Newtons, N).\n• Work Done: Work = Force × Distance moved in direction of force (Jules, J).\n• Potential Energy (PE): Stored energy due to position (PE = mgh).\n• Kinetic Energy (KE): Energy possessed by a body due to its motion (KE = ½ mv²).`
      }
    ],
    relatedTopics: ['Basic Technology', 'Biology & Chemistry Basics'],
    quiz: [
      {
        question: 'Which state of matter has no definite shape and no definite volume?',
        options: ['Solid', 'Liquid', 'Gas', 'Crystal'],
        correctAnswer: 2,
        explanation: 'Gas particles move freely to fill any container, possessing no fixed shape or volume.'
      }
    ]
  },

  // ==========================================
  // GRADE 10 (SS 1)
  // ==========================================
  'ss 1 mathematics logarithms sets quadratic spheres trigonometry': {
    title: 'Core Mathematics: Indices, Logarithms, Sets & Quadratics (SS 1)',
    category: 'General Mathematics',
    gradeLabel: 'Grade 10 (SS 1)',
    isCurriculumNote: true,
    intro: 'Lesson Objectives: Master laws of indices and logarithms, solve set problems using Venn diagrams, solve quadratic equations, calculate sphere/cone volumes, and apply acute angle trigonometry.',
    funFact: '📌 Key Memory Rule: Logarithm Laws: log(A × B) = log A + log B, log(A / B) = log A - log B, and log(Aⁿ) = n log A.',
    sections: [
      {
        subtitle: '1. Laws of Indices & Logarithms',
        content: `Indices Laws:\n• aᵐ × aⁿ = aᵐ⁺ⁿ\n• aᵐ ÷ aⁿ = aᵐ⁻ⁿ\n• (aᵐ)ⁿ = aᵐⁿ\n• a⁰ = 1 (a ≠ 0)\n• a⁻ⁿ = 1 / aⁿ\n\nLogarithm Laws (Base b):\n• log_b(x · y) = log_b(x) + log_b(y)\n• log_b(x / y) = log_b(x) - log_b(y)\n• log_b(xⁿ) = n · log_b(x)\n• log_b(b) = 1`
      },
      {
        subtitle: '2. Quadratic Equations & Spheres Geometry',
        content: `Solving Quadratic Equations (ax² + bx + c = 0):\nMethod 1: Factorization\nMethod 2: Quadratic Formula: x = [ -b ± √(b² - 4ac) ] / (2a)\n\nGeometry Formulas:\n• Surface Area of a Sphere = 4πr²\n• Volume of a Sphere = (4/3)πr³\n• Volume of a Cone = (1/3)πr²h`
      },
      {
        subtitle: '3. Practice Worked Example',
        content: `Solve x² - 5x + 6 = 0.\nSolution by Factorization:\nFind two numbers that multiply to +6 and add to -5 → (-2 and -3).\n(x - 2)(x - 3) = 0 → x = 2 or x = 3.`
      }
    ],
    relatedTopics: ['Advanced Algebra & Geometry', 'Pre-Calculus & Applied Mathematics'],
    quiz: [
      {
        question: 'What are the roots of the quadratic equation x² - 7x + 12 = 0?',
        options: ['x = 3, 4', 'x = -3, -4', 'x = 2, 6', 'x = -2, -6'],
        correctAnswer: 0,
        explanation: 'Factorizing: (x - 3)(x - 4) = 0 gives roots x = 3 and x = 4.'
      }
    ]
  },

  'ss 1 physics kinematics vectors projectile hooke expansion': {
    title: 'Mechanics, Vectors & Thermal Expansion (SS 1 Physics)',
    category: 'Physics',
    gradeLabel: 'Grade 10 (SS 1)',
    isCurriculumNote: true,
    intro: 'Lesson Objectives: Apply equations of uniform acceleration, resolve vectors, analyze projectile motion, verify Hooke’s Law of elasticity, and calculate thermal expansion coefficients.',
    funFact: '📌 Key Memory Rule: The 3 Equations of Linear Motion:\n1) v = u + at\n2) s = ut + ½ at²\n3) v² = u² + 2as',
    sections: [
      {
        subtitle: '1. Kinematics & Equations of Motion',
        content: `Variables:\n• u = Initial velocity (m/s)\n• v = Final velocity (m/s)\n• a = Acceleration (m/s²)\n• t = Time (s)\n• s = Displacement / Distance (m)\n\nEquations:\n1) v = u + at\n2) s = ut + ½ at²\n3) v² = u² + 2as\n4) s = ½ (u + v) t`
      },
      {
        subtitle: '2. Hooke’s Law & Elasticity',
        content: `Hooke's Law states that provided the elastic limit is not exceeded, the extension (e) produced in an elastic material is directly proportional to the applied force (F).\nF = k · e\nWhere:\n• F = Force applied (N)\n• k = Stiffness or spring constant (N/m)\n• e = Extension (m)\n\nElastic Potential Energy stored in spring = ½ k e² = ½ F e.`
      },
      {
        subtitle: '3. Worked Numerical Example',
        content: `A car accelerates uniformly from rest at 2 m/s² for 5 seconds. Find its final velocity and distance traveled.\n\nSolution:\nu = 0, a = 2 m/s², t = 5 s\nv = u + at = 0 + (2 × 5) = 10 m/s.\ns = ut + ½ at² = 0 + ½(2)(5²) = 25 meters.`
      }
    ],
    relatedTopics: ['Waves, Electricity & Optics', 'Modern & Quantum Physics'],
    quiz: [
      {
        question: 'A spring has a spring constant of 200 N/m. How much force is required to extend it by 0.05 m?',
        options: ['10 N', '40 N', '100 N', '1000 N'],
        correctAnswer: 0,
        explanation: 'F = k × e = 200 N/m × 0.05 m = 10 N.'
      }
    ]
  },

  'ss 1 chemistry atomic structure stoichiometry gas laws acids': {
    title: 'Chemical Principles: Atomic Structure, Gas Laws & Acids (SS 1 Chemistry)',
    category: 'Chemistry',
    gradeLabel: 'Grade 10 (SS 1)',
    isCurriculumNote: true,
    intro: 'Lesson Objectives: Understand subatomic particles (protons, neutrons, electrons), balance chemical equations, apply Gas Laws (Boyle’s, Charles’s, General Gas Equation), and master Acids, Bases, and Salts.',
    funFact: '📌 Key Memory Rule: Gas Laws Summary:\n• Boyle’s Law: P₁V₁ = P₂V₂ (at constant Temperature)\n• Charles’s Law: V₁/T₁ = V₂/T₂ (at constant Pressure)\n• Ideal Gas Equation: P V = n R T',
    sections: [
      {
        subtitle: '1. Atomic Structure & Subatomic Particles',
        content: `An atom consists of three main subatomic particles:\n1. Proton: Positive charge (+1), mass = 1 amu, located in nucleus.\n2. Neutron: Neutral charge (0), mass = 1 amu, located in nucleus.\n3. Electron: Negative charge (-1), negligible mass, orbits nucleus in shells.\n\nDefinitions:\n• Atomic Number (Z): Number of protons in nucleus.\n• Mass Number (A): Number of protons + neutrons.\n• Isotopes: Atoms of same element with same atomic number but different mass numbers.`
      },
      {
        subtitle: '2. Gas Laws & Ideal Gas Equation',
        content: `• Boyle's Law: Pressure is inversely proportional to volume at constant temperature (P₁V₁ = P₂V₂).\n• Charles's Law: Volume is directly proportional to absolute temperature in Kelvin at constant pressure (V₁/T₁ = V₂/T₂).\n• General Gas Equation: (P₁V₁)/T₁ = (P₂V₂)/T₂.`
      },
      {
        subtitle: '3. Acids, Bases & Salts',
        content: `• Acid: Substance that produces hydrogen ions (H⁺) as the only positive ion in aqueous solution (e.g., HCl, H₂SO₄).\n• Base: Substance that produces hydroxide ions (OH⁻) in solution or reacts with acid to form salt and water.\n• Neutralization Reaction: Acid + Base → Salt + Water.`
      }
    ],
    relatedTopics: ['Physical & Inorganic Chemistry', 'Organic & Analytical Chemistry'],
    quiz: [
      {
        question: 'A gas occupies 4.0 liters at 2.0 atm pressure. What is its volume if pressure increases to 4.0 atm at constant temperature?',
        options: ['1.0 L', '2.0 L', '8.0 L', '16.0 L'],
        correctAnswer: 1,
        explanation: 'Applying Boyle’s Law P₁V₁ = P₂V₂: (2.0)(4.0) = (4.0)V₂ → V₂ = 8.0 / 4.0 = 2.0 L.'
      }
    ]
  },

  // ==========================================
  // GRADE 11 (SS 2)
  // ==========================================
  'ss 2 physics waves lenses electric fields kirchhoff shm magnetism': {
    title: 'Waves, Optics, Electricity & Kirchhoff’s Laws (SS 2 Physics)',
    category: 'Physics',
    gradeLabel: 'Grade 11 (SS 2)',
    isCurriculumNote: true,
    intro: 'Lesson Objectives: Study wave parameters (v = f λ), lens refraction equations, Simple Harmonic Motion (SHM), Ohm’s and Kirchhoff’s Circuit Laws, and magnetic fields.',
    funFact: '📌 Key Memory Rule: Wave Equation: Velocity (v) = Frequency (f) × Wavelength (λ). Kirchhoff’s Current Law: Total current entering a junction = Total current leaving the junction.',
    sections: [
      {
        subtitle: '1. Wave Motion & Optics',
        content: `Wave Equation: v = f · λ\nWhere:\n• v = wave speed (m/s)\n• f = frequency (Hz)\n• λ = wavelength (m)\n\nThin Lens Formula:\n(1 / f) = (1 / u) + (1 / v)\nWhere f = focal length, u = object distance, v = image distance.\nMagnification (m) = v / u.`
      },
      {
        subtitle: '2. Electricity & Kirchhoff’s Laws',
        content: `• Ohm's Law: V = I · R\n• Kirchhoff's First Law (Current Law): ∑ I_in = ∑ I_out (Conservation of Charge).\n• Kirchhoff's Second Law (Voltage Law): In any closed loop, algebraic sum of EMFs = sum of IR drops (Conservation of Energy).`
      }
    ],
    relatedTopics: ['Mechanics & Thermal Physics', 'Modern & Quantum Physics'],
    quiz: [
      {
        question: 'A radio station broadcasts at a frequency of 100 MHz (10⁸ Hz). Given speed of light c = 3 × 10⁸ m/s, what is the wavelength?',
        options: ['0.3 m', '3.0 m', '30 m', '300 m'],
        correctAnswer: 1,
        explanation: 'λ = v / f = (3 × 10⁸ m/s) / (10⁸ Hz) = 3.0 meters.'
      }
    ]
  },

  'ss 2 chemistry redox electrolysis reaction rates equilibrium non-metals': {
    title: 'Redox, Electrolysis & Chemical Equilibrium (SS 2 Chemistry)',
    category: 'Chemistry',
    gradeLabel: 'Grade 11 (SS 2)',
    isCurriculumNote: true,
    intro: 'Lesson Objectives: Master oxidation states, Faraday’s Laws of Electrolysis, reaction rate factors, Le Chatelier’s Principle of equilibrium, and properties of non-metals.',
    funFact: '📌 Key Memory Rule: OIL RIG — Oxidation Is Loss of electrons, Reduction Is Gain of electrons!',
    sections: [
      {
        subtitle: '1. Redox Reactions & Oxidation States',
        content: `• Oxidation: Gain of oxygen, loss of hydrogen, loss of electrons, or increase in oxidation number.\n• Reduction: Loss of oxygen, gain of hydrogen, gain of electrons, or decrease in oxidation number.\n• Oxidizing Agent: Electron acceptor (itself reduced).\n• Reducing Agent: Electron donor (itself oxidized).`
      },
      {
        subtitle: '2. Faraday’s Laws of Electrolysis',
        content: `• Faraday's First Law: Mass (m) of substance liberated at electrode is directly proportional to electric charge (Q) passed.\nm = z · Q = z · I · t\nWhere m = mass (g), z = electrochemical equivalent (g/C), I = current (A), t = time (s).\n• Faraday constant (F) = 96,500 Coulombs per mole of electrons.`
      }
    ],
    relatedTopics: ['Chemical Principles', 'Organic & Analytical Chemistry'],
    quiz: [
      {
        question: 'In the reaction Zn + Cu²⁺ → Zn²⁺ + Cu, which species is oxidized?',
        options: ['Zn', 'Cu²⁺', 'Zn²⁺', 'Cu'],
        correctAnswer: 0,
        explanation: 'Zinc loses 2 electrons (oxidation number increases from 0 to +2), so Zn is oxidized.'
      }
    ]
  },

  // ==========================================
  // GRADE 12 (SS 3)
  // ==========================================
  'ss 3 mathematics matrices coordinate geometry calculus bearings ogives': {
    title: 'Calculus, Matrices & Coordinate Geometry (SS 3 Mathematics)',
    category: 'General Mathematics',
    gradeLabel: 'Grade 12 (SS 3)',
    isCurriculumNote: true,
    intro: 'Lesson Objectives: Solve matrix determinants and inverses, find straight line gradients and equations, apply differentiation and integration basics, solve bearing problems, and plot cumulative frequency curves (ogives).',
    funFact: '📌 Key Memory Rule: Basic Calculus Rules:\n• Differentiation: d/dx (xⁿ) = n · xⁿ⁻¹\n• Integration: ∫ xⁿ dx = (xⁿ⁺¹ / (n + 1)) + C (n ≠ -1)',
    sections: [
      {
        subtitle: '1. Differentiation & Integration Fundamentals',
        content: `Differentiation (Rate of Change / Gradient of Curve):\n• If y = a xⁿ, then dy/dx = a · n xⁿ⁻¹.\n• Example: If y = 3x⁴, dy/dx = 3 × 4x³ = 12x³.\n\nIntegration (Antiderivative / Area under Curve):\n• ∫ a xⁿ dx = [ a xⁿ⁺¹ / (n + 1) ] + C.\n• Example: ∫ 6x² dx = (6x³ / 3) + C = 2x³ + C.`
      },
      {
        subtitle: '2. Matrices & Determinants',
        content: `For a 2x2 Matrix A = [[a, b], [c, d]]:\n• Determinant |A| = (ad - bc)\n• Inverse A⁻¹ = (1 / |A|) · [[d, -b], [-c, a]], provided |A| ≠ 0.`
      },
      {
        subtitle: '3. Worked Example',
        content: `Find the derivative of y = 5x³ - 4x² + 7x - 2.\n\nSolution:\ndy/dx = (5 × 3)x² - (4 × 2)x + 7 - 0 = 15x² - 8x + 7.`
      }
    ],
    relatedTopics: ['Core Mathematics', 'Advanced Algebra & Geometry'],
    quiz: [
      {
        question: 'What is the derivative dy/dx of function y = 4x³?',
        options: ['12x²', '12x³', '4x²', 'x⁴'],
        correctAnswer: 0,
        explanation: 'dy/dx = 4 × 3x³⁻¹ = 12x².'
      }
    ]
  },

  'ss 3 physics induction ac circuits radioactivity duality quantization': {
    title: 'Electromagnetic Induction, AC Circuits & Modern Quantum Physics (SS 3 Physics)',
    category: 'Physics',
    gradeLabel: 'Grade 12 (SS 3)',
    isCurriculumNote: true,
    intro: 'Lesson Objectives: Master Faraday’s and Lenz’s laws of induction, analyze RLC alternating current circuits, understand radioactive decay (half-life), wave-particle duality, and energy quantization (E = hf).',
    funFact: '📌 Key Memory Rule: Photoelectric Effect & Energy Quantization: Photon Energy E = h · f = h · (c / λ), where h = Planck’s constant (6.63 × 10⁻³⁴ J·s).',
    sections: [
      {
        subtitle: '1. Electromagnetic Induction & Transformers',
        content: `• Faraday's Law: Induced EMF in a circuit is directly proportional to rate of change of magnetic flux linkage.\n• Lenz's Law: Direction of induced current opposes the change producing it.\n• Transformer Formula: (V_p / V_s) = (N_p / N_s) = (I_s / I_p)\nWhere V = voltage, N = number of turns, I = current, p = primary, s = secondary.`
      },
      {
        subtitle: '2. Radioactivity & Half-Life',
        content: `Radioactive Decay Law: N(t) = N₀ · (½)^(t / T_half)\nWhere N₀ = initial quantity, t = elapsed time, T_half = half-life.\n\nEmissions:\n• Alpha particle (α): Helium nucleus (⁴₂He), high ionizing power.\n• Beta particle (β): Fast electron (⁰₋₁e), moderate penetration.\n• Gamma ray (γ): High energy electromagnetic photon, highest penetration.`
      },
      {
        subtitle: '3. Worked Numerical Example',
        content: `A radioactive isotope has a half-life of 10 days. How much of a 100g sample remains after 30 days?\n\nSolution:\nNumber of half-lives n = 30 / 10 = 3.\nRemaining mass = 100 × (½)³ = 100 / 8 = 12.5 grams.`
      }
    ],
    relatedTopics: ['Mechanics & Thermal Physics', 'Waves, Electricity & Optics'],
    quiz: [
      {
        question: 'A transformer has 500 primary turns and 50 secondary turns. If primary voltage is 220V, what is the secondary voltage?',
        options: ['22 V', '44 V', '110 V', '2200 V'],
        correctAnswer: 0,
        explanation: 'V_s = V_p × (N_s / N_p) = 220 × (50 / 500) = 22 Volts.'
      }
    ]
  },

  'ss 3 chemistry organic hydrocarbons polymers metallurgy volumetric analysis': {
    title: 'Organic Chemistry, Polymers & Volumetric Analysis (SS 3 Chemistry)',
    category: 'Chemistry',
    gradeLabel: 'Grade 12 (SS 3)',
    isCurriculumNote: true,
    intro: 'Lesson Objectives: Study functional groups (alkanes, alkenes, alkynes, alkanols, alkanoic acids, esters), polymer synthesis, industrial metallurgy (extraction of Fe, Cu, Al), and volumetric titration calculations.',
    funFact: '📌 Key Memory Rule: Titration Stoichiometry Equation:\n(C_a · V_a) / (C_b · V_b) = n_a / n_b\nWhere C = concentration (mol/dm³), V = volume (cm³), n = stoichiometric mole coefficients from balanced equation.',
    sections: [
      {
        subtitle: '1. Organic Functional Groups',
        content: `• Alkanes (C_n H₂n+₂): Saturated hydrocarbons (single C-C bonds).\n• Alkenes (C_n H₂n): Unsaturated hydrocarbons (double C=C bond).\n• Alkynes (C_n H₂n-₂): Unsaturated hydrocarbons (triple C≡C bond).\n• Alkanols (R-OH): Hydroxyl functional group (e.g., Ethanol CH₃CH₂OH).\n• Alkanoic Acids (R-COOH): Carboxyl functional group (e.g., Ethanoic acid CH₃COOH).\n• Esters (R-COO-R'): Formed by Esterification (Alkanol + Alkanoic Acid → Ester + Water).`
      },
      {
        subtitle: '2. Volumetric Analysis & Titration Formula',
        content: `Formula: (C_a · V_a) / (C_b · V_b) = n_a / n_b\n\nExample Problem:\n25.0 cm³ of 0.10 mol/dm³ NaOH is neutralized by 20.0 cm³ of HCl solution. Find concentration of HCl (C_a).\n\nReaction: HCl + NaOH → NaCl + H₂O (n_a = 1, n_b = 1)\n(C_a × 20.0) / (0.10 × 25.0) = 1 / 1\nC_a × 20.0 = 2.5 → C_a = 2.5 / 20.0 = 0.125 mol/dm³.`
      }
    ],
    relatedTopics: ['Chemical Principles', 'Physical & Inorganic Chemistry'],
    quiz: [
      {
        question: 'What type of reaction produces an ester and water from an alcohol and a carboxylic acid?',
        options: ['Saponification', 'Esterification', 'Fermentation', 'Polymierization'],
        correctAnswer: 1,
        explanation: 'Esterification is the reaction between an alkanol (alcohol) and an alkanoic acid.'
      }
    ]
  }
};

/**
 * Normalizes query string for matching curriculum notes map
 */
export const normalizeCurriculumKey = (query: string): string => {
  return query.trim().toLowerCase().replace(/\s+/g, ' ');
};

/**
 * Generates dynamic academic curriculum notes for any grade/subject query
 */
export const getDynamicCurriculumNote = (query: string): Article | null => {
  const normalized = normalizeCurriculumKey(query);
  
  // Direct match from curated dictionary
  if (CURRICULUM_NOTES_MAP[normalized]) {
    return CURRICULUM_NOTES_MAP[normalized];
  }

  // Partial key match
  for (const [key, article] of Object.entries(CURRICULUM_NOTES_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return article;
    }
  }

  // Fallback: Check if query matches a curriculum pattern (e.g. "Primary 3", "JSS 1", "SS 2", "Mathematics", "Science")
  const curriculumPattern = /(primary\s*\d|jss\s*\d|ss\s*\d|grade\s*\d+)/i;
  if (curriculumPattern.test(query)) {
    // Generate clean dynamic curriculum study note template
    const titleMatch = query.replace(/(primary|jss|ss|grade)\s*\d+/gi, '').trim();
    const cleanTitle = titleMatch ? titleMatch.toUpperCase() : query;
    return {
      title: `${query} — Academic Lesson Notes`,
      category: 'Academic Curriculum',
      gradeLabel: query,
      isCurriculumNote: true,
      intro: `Lesson Objectives: Overview and core academic curriculum study notes for ${query}. Master key definitions, formulas, step-by-step worked examples, and revision takeaways.`,
      funFact: `📌 Key Memory Concept: Consolidate core formulas, key terms, and laws for exam preparation in ${query}.`,
      sections: [
        {
          subtitle: '1. Core Curriculum Definitions & Concepts',
          content: `• Essential Vocabulary: Key terms, standard definitions, and core principles aligned with national curriculum benchmarks.\n• Background Context: Fundamental theories and prerequisites required for mastering ${query}.`
        },
        {
          subtitle: '2. Detailed Lesson Explanations & Step-by-Step Examples',
          content: `• In-Depth Analysis: Comprehensive explanation of rules, processes, or mathematical steps.\n• Worked Examples: Detailed step-by-step sample problems demonstrating method, calculation, and reasoning.`
        },
        {
          subtitle: '3. Key Revision Takeaways & Exam Summary',
          content: `• Important formulas, memory rules, and summary bullet points.\n• Common exam pitfalls to avoid when answering test questions.`
        },
        {
          subtitle: '4. Practice Exercises & Solutions',
          content: `• Self-assessment practice exercises designed to test understanding and reinforce learning goals.`
        }
      ],
      relatedTopics: ['Academic Curriculum', 'Mathematics', 'Basic Science', 'English Studies'],
      quiz: [
        {
          question: `What is a fundamental objective when studying ${query}?`,
          options: [
            'Understanding key definitions, formulas, and step-by-step applications',
            'Memorizing unrelated trivia without understanding',
            'Ignoring curriculum standards',
            'Skipping practice exercises'
          ],
          correctAnswer: 0,
          explanation: 'Curriculum study notes focus on mastering core definitions, rules, and step-by-step problem-solving methods.'
        }
      ]
    };
  }

  return null;
};
