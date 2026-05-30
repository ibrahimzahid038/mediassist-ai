// This file is auto-generated from dataset.jsonl. Do not edit directly.

export interface FewShotSample {
  input: string;
  output: string;
}

// Complete mapping of all 41 unique diseases to their primary diagnostic symptoms from the Kaggle dataset
export const DISEASE_SYMPTOMS_MAP: Record<string, string[]> = {
  "Fungal infection": [
    "itching",
    "skin rash",
    "nodal skin eruptions",
    "dischromic  patches"
  ],
  "Allergy": [
    "continuous sneezing",
    "shivering",
    "chills",
    "watering from eyes"
  ],
  "GERD": [
    "stomach pain",
    "acidity",
    "ulcers on tongue",
    "vomiting",
    "cough",
    "chest pain"
  ],
  "Chronic cholestasis": [
    "itching",
    "vomiting",
    "yellowish skin",
    "nausea",
    "loss of appetite",
    "abdominal pain",
    "yellowing of eyes"
  ],
  "Drug Reaction": [
    "itching",
    "skin rash",
    "stomach pain",
    "burning micturition",
    "spotting  urination"
  ],
  "Peptic ulcer diseae": [
    "vomiting",
    "loss of appetite",
    "abdominal pain",
    "passage of gases",
    "internal itching",
    "indigestion"
  ],
  "AIDS": [
    "muscle wasting",
    "patches in throat",
    "high fever",
    "extra marital contacts"
  ],
  "Diabetes": [
    "fatigue",
    "weight loss",
    "restlessness",
    "lethargy",
    "irregular sugar level",
    "blurred and distorted vision",
    "obesity",
    "excessive hunger",
    "increased appetite",
    "polyuria"
  ],
  "Gastroenteritis": [
    "vomiting",
    "sunken eyes",
    "dehydration",
    "diarrhoea"
  ],
  "Bronchial Asthma": [
    "fatigue",
    "cough",
    "high fever",
    "breathlessness",
    "family history",
    "mucoid sputum"
  ],
  "Hypertension": [
    "headache",
    "chest pain",
    "dizziness",
    "loss of balance",
    "lack of concentration"
  ],
  "Migraine": [
    "acidity",
    "indigestion",
    "headache",
    "blurred and distorted vision",
    "excessive hunger",
    "stiff neck",
    "depression",
    "irritability",
    "visual disturbances"
  ],
  "Cervical spondylosis": [
    "back pain",
    "weakness in limbs",
    "neck pain",
    "dizziness",
    "loss of balance"
  ],
  "Paralysis (brain hemorrhage)": [
    "vomiting",
    "headache",
    "weakness of one body side",
    "altered sensorium"
  ],
  "Jaundice": [
    "itching",
    "vomiting",
    "fatigue",
    "weight loss",
    "high fever",
    "yellowish skin",
    "dark urine",
    "abdominal pain"
  ],
  "Malaria": [
    "chills",
    "vomiting",
    "high fever",
    "sweating",
    "headache",
    "nausea",
    "muscle pain",
    "diarrhoea"
  ],
  "Chicken pox": [
    "itching",
    "skin rash",
    "fatigue",
    "lethargy",
    "high fever",
    "headache",
    "loss of appetite",
    "mild fever",
    "swelled lymph nodes",
    "malaise",
    "red spots over body"
  ],
  "Dengue": [
    "skin rash",
    "chills",
    "joint pain",
    "vomiting",
    "fatigue",
    "high fever",
    "headache",
    "nausea",
    "loss of appetite",
    "pain behind the eyes",
    "back pain",
    "muscle pain",
    "red spots over body",
    "malaise"
  ],
  "Typhoid": [
    "chills",
    "vomiting",
    "fatigue",
    "high fever",
    "nausea",
    "constipation",
    "abdominal pain",
    "diarrhoea",
    "toxic look (typhos)",
    "belly pain",
    "headache"
  ],
  "hepatitis A": [
    "joint pain",
    "vomiting",
    "yellowish skin",
    "dark urine",
    "nausea",
    "loss of appetite",
    "abdominal pain",
    "diarrhoea",
    "mild fever",
    "yellowing of eyes",
    "muscle pain"
  ],
  "Hepatitis B": [
    "itching",
    "fatigue",
    "lethargy",
    "yellowish skin",
    "dark urine",
    "loss of appetite",
    "abdominal pain",
    "yellow urine",
    "yellowing of eyes",
    "malaise",
    "receiving blood transfusion",
    "receiving unsterile injections"
  ],
  "Hepatitis C": [
    "fatigue",
    "yellowish skin",
    "nausea",
    "loss of appetite",
    "family history",
    "yellowing of eyes"
  ],
  "Hepatitis D": [
    "joint pain",
    "vomiting",
    "fatigue",
    "yellowish skin",
    "dark urine",
    "nausea",
    "loss of appetite",
    "abdominal pain",
    "yellowing of eyes"
  ],
  "Hepatitis E": [
    "joint pain",
    "vomiting",
    "fatigue",
    "high fever",
    "yellowish skin",
    "dark urine",
    "nausea",
    "loss of appetite",
    "abdominal pain",
    "yellowing of eyes",
    "coma",
    "stomach bleeding",
    "acute liver failure"
  ],
  "Alcoholic hepatitis": [
    "vomiting",
    "yellowish skin",
    "abdominal pain",
    "swelling of stomach",
    "distention of abdomen",
    "history of alcohol consumption",
    "fluid overload"
  ],
  "Tuberculosis": [
    "chills",
    "vomiting",
    "fatigue",
    "weight loss",
    "cough",
    "high fever",
    "breathlessness",
    "sweating",
    "loss of appetite",
    "mild fever",
    "yellowing of eyes",
    "swelled lymph nodes",
    "malaise",
    "phlegm",
    "chest pain",
    "blood in sputum"
  ],
  "Common Cold": [
    "continuous sneezing",
    "chills",
    "fatigue",
    "cough",
    "high fever",
    "headache",
    "swelled lymph nodes",
    "malaise",
    "phlegm",
    "throat irritation",
    "redness of eyes",
    "sinus pressure",
    "runny nose",
    "congestion",
    "chest pain",
    "loss of smell",
    "muscle pain"
  ],
  "Pneumonia": [
    "chills",
    "fatigue",
    "cough",
    "high fever",
    "breathlessness",
    "sweating",
    "malaise",
    "chest pain",
    "fast heart rate",
    "rusty sputum",
    "phlegm"
  ],
  "Dimorphic hemmorhoids(piles)": [
    "constipation",
    "pain during bowel movements",
    "pain in anal region",
    "bloody stool",
    "irritation in anus"
  ],
  "Heart attack": [
    "vomiting",
    "breathlessness",
    "sweating",
    "chest pain"
  ],
  "Varicose veins": [
    "fatigue",
    "cramps",
    "bruising",
    "obesity",
    "swollen legs",
    "swollen blood vessels",
    "prominent veins on calf"
  ],
  "Hypothyroidism": [
    "fatigue",
    "weight gain",
    "cold hands and feets",
    "mood swings",
    "lethargy",
    "dizziness",
    "puffy face and eyes",
    "enlarged thyroid",
    "brittle nails",
    "swollen extremeties",
    "depression",
    "irritability",
    "abnormal menstruation"
  ],
  "Hyperthyroidism": [
    "fatigue",
    "mood swings",
    "weight loss",
    "restlessness",
    "sweating",
    "diarrhoea",
    "fast heart rate",
    "excessive hunger",
    "muscle weakness",
    "irritability",
    "abnormal menstruation"
  ],
  "Hypoglycemia": [
    "vomiting",
    "fatigue",
    "anxiety",
    "sweating",
    "headache",
    "nausea",
    "blurred and distorted vision",
    "excessive hunger",
    "slurred speech",
    "irritability",
    "palpitations",
    "drying and tingling lips"
  ],
  "Osteoarthristis": [
    "joint pain",
    "neck pain",
    "knee pain",
    "hip joint pain",
    "swelling joints",
    "painful walking"
  ],
  "Arthritis": [
    "muscle weakness",
    "stiff neck",
    "swelling joints",
    "movement stiffness",
    "painful walking"
  ],
  "(vertigo) Paroymsal  Positional Vertigo": [
    "vomiting",
    "headache",
    "nausea",
    "spinning movements",
    "loss of balance",
    "unsteadiness"
  ],
  "Acne": [
    "skin rash",
    "pus filled pimples",
    "blackheads",
    "scurring"
  ],
  "Urinary tract infection": [
    "burning micturition",
    "bladder discomfort",
    "foul smell of urine",
    "continuous feel of urine"
  ],
  "Psoriasis": [
    "skin rash",
    "joint pain",
    "skin peeling",
    "silver like dusting",
    "small dents in nails",
    "inflammatory nails"
  ],
  "Impetigo": [
    "skin rash",
    "high fever",
    "blister",
    "red sore around nose",
    "yellow crust ooze"
  ]
};

// Curated representative few-shot samples spanning all 41 diagnostic conditions (grounding datasets)
export const FEW_SHOT_SAMPLES: FewShotSample[] = [
  {
    "input": "I am experiencing the following symptoms: itching, skin rash, nodal skin eruptions, dischromic  patches. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Fungal infection."
  },
  {
    "input": "I am experiencing the following symptoms: skin rash, nodal skin eruptions, dischromic  patches. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Fungal infection."
  },
  {
    "input": "I am experiencing the following symptoms: continuous sneezing, shivering, chills, watering from eyes. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Allergy."
  },
  {
    "input": "I am experiencing the following symptoms: shivering, chills, watering from eyes. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Allergy."
  },
  {
    "input": "I am experiencing the following symptoms: stomach pain, acidity, ulcers on tongue, vomiting, cough, chest pain. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: GERD."
  },
  {
    "input": "I am experiencing the following symptoms: stomach pain, ulcers on tongue, vomiting, cough, chest pain. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: GERD."
  },
  {
    "input": "I am experiencing the following symptoms: itching, vomiting, yellowish skin, nausea, loss of appetite, abdominal pain, yellowing of eyes. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Chronic cholestasis."
  },
  {
    "input": "I am experiencing the following symptoms: vomiting, yellowish skin, nausea, loss of appetite, abdominal pain, yellowing of eyes. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Chronic cholestasis."
  },
  {
    "input": "I am experiencing the following symptoms: itching, skin rash, stomach pain, burning micturition, spotting  urination. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Drug Reaction."
  },
  {
    "input": "I am experiencing the following symptoms: itching, stomach pain, burning micturition, spotting  urination. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Drug Reaction."
  },
  {
    "input": "I am experiencing the following symptoms: vomiting, loss of appetite, abdominal pain, passage of gases, internal itching. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Peptic ulcer diseae."
  },
  {
    "input": "I am experiencing the following symptoms: vomiting, indigestion, abdominal pain, passage of gases, internal itching. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Peptic ulcer diseae."
  },
  {
    "input": "I am experiencing the following symptoms: muscle wasting, patches in throat, high fever, extra marital contacts. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: AIDS."
  },
  {
    "input": "I am experiencing the following symptoms: patches in throat, high fever, extra marital contacts. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: AIDS."
  },
  {
    "input": "I am experiencing the following symptoms: fatigue, weight loss, restlessness, lethargy, irregular sugar level, blurred and distorted vision, obesity, excessive hunger, increased appetite, polyuria. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Diabetes ."
  },
  {
    "input": "I am experiencing the following symptoms: fatigue, weight loss, restlessness, lethargy, irregular sugar level, blurred and distorted vision, obesity, excessive hunger, increased appetite, polyuria. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Diabetes ."
  },
  {
    "input": "I am experiencing the following symptoms: vomiting, sunken eyes, dehydration, diarrhoea. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Gastroenteritis."
  },
  {
    "input": "I am experiencing the following symptoms: vomiting, sunken eyes, dehydration, diarrhoea. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Gastroenteritis."
  },
  {
    "input": "I am experiencing the following symptoms: fatigue, cough, high fever, breathlessness, family history, mucoid sputum. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Bronchial Asthma."
  },
  {
    "input": "I am experiencing the following symptoms: cough, high fever, breathlessness, family history, mucoid sputum. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Bronchial Asthma."
  },
  {
    "input": "I am experiencing the following symptoms: headache, chest pain, dizziness, loss of balance, lack of concentration. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Hypertension ."
  },
  {
    "input": "I am experiencing the following symptoms: chest pain, dizziness, loss of balance, lack of concentration. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Hypertension ."
  },
  {
    "input": "I am experiencing the following symptoms: acidity, indigestion, headache, blurred and distorted vision, excessive hunger, stiff neck, depression, irritability, visual disturbances. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Migraine."
  },
  {
    "input": "I am experiencing the following symptoms: indigestion, headache, blurred and distorted vision, excessive hunger, stiff neck, depression, irritability, visual disturbances. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Migraine."
  },
  {
    "input": "I am experiencing the following symptoms: back pain, weakness in limbs, neck pain, dizziness, loss of balance. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Cervical spondylosis."
  },
  {
    "input": "I am experiencing the following symptoms: back pain, weakness in limbs, neck pain, dizziness, loss of balance. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Cervical spondylosis."
  },
  {
    "input": "I am experiencing the following symptoms: vomiting, headache, weakness of one body side, altered sensorium. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Paralysis (brain hemorrhage)."
  },
  {
    "input": "I am experiencing the following symptoms: vomiting, headache, weakness of one body side, altered sensorium. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Paralysis (brain hemorrhage)."
  },
  {
    "input": "I am experiencing the following symptoms: itching, vomiting, fatigue, weight loss, high fever, yellowish skin, dark urine, abdominal pain. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Jaundice."
  },
  {
    "input": "I am experiencing the following symptoms: itching, vomiting, fatigue, weight loss, high fever, yellowish skin, dark urine, abdominal pain. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Jaundice."
  },
  {
    "input": "I am experiencing the following symptoms: chills, vomiting, high fever, sweating, headache, nausea, muscle pain. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Malaria."
  },
  {
    "input": "I am experiencing the following symptoms: chills, vomiting, high fever, sweating, headache, nausea, diarrhoea, muscle pain. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Malaria."
  },
  {
    "input": "I am experiencing the following symptoms: itching, skin rash, fatigue, lethargy, high fever, headache, loss of appetite, mild fever, swelled lymph nodes, malaise, red spots over body. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Chicken pox."
  },
  {
    "input": "I am experiencing the following symptoms: skin rash, fatigue, lethargy, high fever, headache, loss of appetite, mild fever, swelled lymph nodes, malaise, red spots over body. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Chicken pox."
  },
  {
    "input": "I am experiencing the following symptoms: skin rash, chills, joint pain, vomiting, fatigue, high fever, headache, nausea, loss of appetite, pain behind the eyes, back pain, muscle pain, red spots over body. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Dengue."
  },
  {
    "input": "I am experiencing the following symptoms: skin rash, chills, joint pain, vomiting, fatigue, high fever, headache, nausea, loss of appetite, pain behind the eyes, back pain, malaise, red spots over body. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Dengue."
  },
  {
    "input": "I am experiencing the following symptoms: chills, vomiting, fatigue, high fever, nausea, constipation, abdominal pain, diarrhoea, toxic look (typhos), belly pain. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Typhoid."
  },
  {
    "input": "I am experiencing the following symptoms: chills, vomiting, fatigue, high fever, headache, constipation, abdominal pain, diarrhoea, toxic look (typhos), belly pain. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Typhoid."
  },
  {
    "input": "I am experiencing the following symptoms: joint pain, vomiting, yellowish skin, dark urine, nausea, loss of appetite, abdominal pain, diarrhoea, mild fever, yellowing of eyes, muscle pain. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: hepatitis A."
  },
  {
    "input": "I am experiencing the following symptoms: joint pain, vomiting, yellowish skin, dark urine, nausea, loss of appetite, abdominal pain, diarrhoea, mild fever, yellowing of eyes, muscle pain. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: hepatitis A."
  },
  {
    "input": "I am experiencing the following symptoms: itching, fatigue, lethargy, yellowish skin, dark urine, loss of appetite, abdominal pain, yellow urine, yellowing of eyes, malaise, receiving blood transfusion, receiving unsterile injections. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Hepatitis B."
  },
  {
    "input": "I am experiencing the following symptoms: itching, fatigue, lethargy, yellowish skin, dark urine, loss of appetite, abdominal pain, yellow urine, yellowing of eyes, malaise, receiving blood transfusion, receiving unsterile injections. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Hepatitis B."
  },
  {
    "input": "I am experiencing the following symptoms: fatigue, yellowish skin, nausea, loss of appetite, family history. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Hepatitis C."
  },
  {
    "input": "I am experiencing the following symptoms: fatigue, yellowish skin, nausea, loss of appetite, yellowing of eyes, family history. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Hepatitis C."
  },
  {
    "input": "I am experiencing the following symptoms: joint pain, vomiting, fatigue, yellowish skin, dark urine, nausea, loss of appetite, abdominal pain, yellowing of eyes. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Hepatitis D."
  },
  {
    "input": "I am experiencing the following symptoms: vomiting, fatigue, yellowish skin, dark urine, nausea, loss of appetite, abdominal pain, yellowing of eyes. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Hepatitis D."
  },
  {
    "input": "I am experiencing the following symptoms: joint pain, vomiting, fatigue, high fever, yellowish skin, dark urine, nausea, loss of appetite, abdominal pain, yellowing of eyes, coma, stomach bleeding. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Hepatitis E."
  },
  {
    "input": "I am experiencing the following symptoms: joint pain, vomiting, fatigue, high fever, yellowish skin, dark urine, nausea, loss of appetite, abdominal pain, yellowing of eyes, acute liver failure, coma, stomach bleeding. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Hepatitis E."
  },
  {
    "input": "I am experiencing the following symptoms: vomiting, yellowish skin, abdominal pain, swelling of stomach, distention of abdomen, history of alcohol consumption, fluid overload. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Alcoholic hepatitis."
  },
  {
    "input": "I am experiencing the following symptoms: vomiting, yellowish skin, abdominal pain, swelling of stomach, distention of abdomen, history of alcohol consumption, fluid overload. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Alcoholic hepatitis."
  },
  {
    "input": "I am experiencing the following symptoms: chills, vomiting, fatigue, weight loss, cough, high fever, breathlessness, sweating, loss of appetite, mild fever, yellowing of eyes, swelled lymph nodes, malaise, phlegm, chest pain, blood in sputum. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Tuberculosis."
  },
  {
    "input": "I am experiencing the following symptoms: chills, vomiting, fatigue, weight loss, cough, high fever, breathlessness, sweating, loss of appetite, mild fever, yellowing of eyes, swelled lymph nodes, malaise, phlegm, chest pain, blood in sputum. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Tuberculosis."
  },
  {
    "input": "I am experiencing the following symptoms: continuous sneezing, chills, fatigue, cough, high fever, headache, swelled lymph nodes, malaise, phlegm, throat irritation, redness of eyes, sinus pressure, runny nose, congestion, chest pain, loss of smell, muscle pain. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Common Cold."
  },
  {
    "input": "I am experiencing the following symptoms: continuous sneezing, chills, fatigue, cough, high fever, headache, swelled lymph nodes, malaise, phlegm, throat irritation, redness of eyes, sinus pressure, runny nose, congestion, chest pain, loss of smell, muscle pain. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Common Cold."
  },
  {
    "input": "I am experiencing the following symptoms: chills, fatigue, cough, high fever, breathlessness, sweating, malaise, chest pain, fast heart rate, rusty sputum. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Pneumonia."
  },
  {
    "input": "I am experiencing the following symptoms: chills, fatigue, cough, high fever, breathlessness, sweating, malaise, phlegm, chest pain, fast heart rate, rusty sputum. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Pneumonia."
  },
  {
    "input": "I am experiencing the following symptoms: constipation, pain during bowel movements, pain in anal region, bloody stool, irritation in anus. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Dimorphic hemmorhoids(piles)."
  },
  {
    "input": "I am experiencing the following symptoms: constipation, pain during bowel movements, pain in anal region, bloody stool, irritation in anus. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Dimorphic hemmorhoids(piles)."
  },
  {
    "input": "I am experiencing the following symptoms: vomiting, breathlessness, sweating, chest pain. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Heart attack."
  },
  {
    "input": "I am experiencing the following symptoms: vomiting, breathlessness, sweating, chest pain. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Heart attack."
  },
  {
    "input": "I am experiencing the following symptoms: fatigue, cramps, bruising, obesity, swollen legs, swollen blood vessels, prominent veins on calf. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Varicose veins."
  },
  {
    "input": "I am experiencing the following symptoms: fatigue, cramps, bruising, obesity, swollen legs, swollen blood vessels, prominent veins on calf. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Varicose veins."
  },
  {
    "input": "I am experiencing the following symptoms: fatigue, weight gain, cold hands and feets, mood swings, lethargy, dizziness, puffy face and eyes, enlarged thyroid, brittle nails, swollen extremeties, depression, irritability, abnormal menstruation. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Hypothyroidism."
  },
  {
    "input": "I am experiencing the following symptoms: fatigue, weight gain, cold hands and feets, mood swings, lethargy, dizziness, puffy face and eyes, enlarged thyroid, brittle nails, swollen extremeties, depression, irritability, abnormal menstruation. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Hypothyroidism."
  },
  {
    "input": "I am experiencing the following symptoms: fatigue, mood swings, weight loss, restlessness, sweating, diarrhoea, fast heart rate, excessive hunger, muscle weakness, irritability, abnormal menstruation. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Hyperthyroidism."
  },
  {
    "input": "I am experiencing the following symptoms: fatigue, mood swings, weight loss, restlessness, sweating, diarrhoea, fast heart rate, excessive hunger, muscle weakness, irritability, abnormal menstruation. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Hyperthyroidism."
  },
  {
    "input": "I am experiencing the following symptoms: vomiting, fatigue, anxiety, sweating, headache, nausea, blurred and distorted vision, excessive hunger, slurred speech, irritability, palpitations. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Hypoglycemia."
  },
  {
    "input": "I am experiencing the following symptoms: vomiting, fatigue, anxiety, sweating, headache, nausea, blurred and distorted vision, excessive hunger, drying and tingling lips, slurred speech, irritability, palpitations. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Hypoglycemia."
  },
  {
    "input": "I am experiencing the following symptoms: joint pain, neck pain, knee pain, hip joint pain, swelling joints, painful walking. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Osteoarthristis."
  },
  {
    "input": "I am experiencing the following symptoms: joint pain, neck pain, knee pain, hip joint pain, swelling joints, painful walking. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Osteoarthristis."
  },
  {
    "input": "I am experiencing the following symptoms: muscle weakness, stiff neck, swelling joints, movement stiffness, painful walking. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Arthritis."
  },
  {
    "input": "I am experiencing the following symptoms: muscle weakness, stiff neck, swelling joints, movement stiffness, painful walking. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Arthritis."
  },
  {
    "input": "I am experiencing the following symptoms: vomiting, headache, nausea, spinning movements, loss of balance, unsteadiness. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: (vertigo) Paroymsal  Positional Vertigo."
  },
  {
    "input": "I am experiencing the following symptoms: vomiting, headache, nausea, spinning movements, loss of balance, unsteadiness. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: (vertigo) Paroymsal  Positional Vertigo."
  },
  {
    "input": "I am experiencing the following symptoms: skin rash, pus filled pimples, blackheads, scurring. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Acne."
  },
  {
    "input": "I am experiencing the following symptoms: skin rash, pus filled pimples, blackheads, scurring. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Acne."
  },
  {
    "input": "I am experiencing the following symptoms: burning micturition, bladder discomfort, foul smell of urine, continuous feel of urine. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Urinary tract infection."
  },
  {
    "input": "I am experiencing the following symptoms: burning micturition, bladder discomfort, foul smell of urine, continuous feel of urine. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Urinary tract infection."
  },
  {
    "input": "I am experiencing the following symptoms: skin rash, joint pain, skin peeling, silver like dusting, small dents in nails, inflammatory nails. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Psoriasis."
  },
  {
    "input": "I am experiencing the following symptoms: skin rash, joint pain, skin peeling, silver like dusting, small dents in nails, inflammatory nails. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Psoriasis."
  },
  {
    "input": "I am experiencing the following symptoms: skin rash, high fever, blister, red sore around nose, yellow crust ooze. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Impetigo."
  },
  {
    "input": "I am experiencing the following symptoms: skin rash, high fever, blister, red sore around nose, yellow crust ooze. What is my potential condition?",
    "output": "Based on the provided presentation pattern, your symptoms match the diagnostic presentation profile for: Impetigo."
  }
];
