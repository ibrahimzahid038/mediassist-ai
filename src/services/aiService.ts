import type { SymptomAnalysis, ChatMessage, RiskLevel } from '../types';
import { generateId, sleep } from '../lib/utils';
import axios from 'axios';
import { DISEASE_SYMPTOMS_MAP, FEW_SHOT_SAMPLES } from './compiledDataset';

// AI Configuration
const AI_CONFIG = {
  apiKey: import.meta.env.VITE_AI_API_KEY || '',
  apiUrl: import.meta.env.VITE_AI_API_URL || 'https://generativelanguage.googleapis.com/v1beta',
  model: import.meta.env.VITE_AI_MODEL || 'gemini-2.0-flash',
};

// Authentication helper supporting standard API keys and custom developer keys (e.g. starting with AQ or AIzaSy)
function getApiCallConfig(apiKey: string) {
  // Use the modern, secure headers-only approach (removes ?key= from the URL query to support the new AQ key format)
  const url = `${AI_CONFIG.apiUrl}/models/${AI_CONFIG.model}:generateContent`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-goog-api-key': apiKey
  };

  return { url, headers };
}

// Symptom database for local analysis
const SYMPTOM_DATABASE: Record<string, {
  conditions: string[];
  risk: RiskLevel;
  specialist: string;
  precautions: string[];
}> = {
  'headache': {
    conditions: ['Tension Headache', 'Migraine', 'Sinusitis', 'Dehydration'],
    risk: 'low',
    specialist: 'Neurologist',
    precautions: ['Rest in a quiet, dark room', 'Stay hydrated', 'Apply cold compress', 'Avoid screen time'],
  },
  'fever': {
    conditions: ['Common Cold', 'Influenza', 'COVID-19', 'Bacterial Infection'],
    risk: 'medium',
    specialist: 'General Physician',
    precautions: ['Monitor temperature regularly', 'Stay hydrated', 'Rest adequately', 'Take acetaminophen if needed'],
  },
  'chest pain': {
    conditions: ['Angina', 'Acid Reflux (GERD)', 'Muscle Strain', 'Anxiety/Panic Attack'],
    risk: 'high',
    specialist: 'Cardiologist',
    precautions: ['Seek immediate medical attention', 'Do not ignore chest pain', 'Avoid physical exertion', 'Note timing and triggers'],
  },
  'shortness of breath': {
    conditions: ['Asthma', 'Anxiety', 'Pneumonia', 'Heart Failure'],
    risk: 'high',
    specialist: 'Pulmonologist',
    precautions: ['Sit upright', 'Use inhaler if prescribed', 'Seek emergency care if severe', 'Monitor oxygen levels'],
  },
  'cough': {
    conditions: ['Common Cold', 'Bronchitis', 'Allergies', 'Asthma'],
    risk: 'low',
    specialist: 'Pulmonologist',
    precautions: ['Stay hydrated', 'Use honey and warm liquids', 'Avoid irritants', 'Cover mouth when coughing'],
  },
  'fatigue': {
    conditions: ['Iron Deficiency Anemia', 'Thyroid Disorder', 'Sleep Disorder', 'Depression'],
    risk: 'low',
    specialist: 'Endocrinologist',
    precautions: ['Maintain regular sleep schedule', 'Eat balanced meals', 'Exercise regularly', 'Manage stress'],
  },
  'nausea': {
    conditions: ['Gastritis', 'Food Poisoning', 'Pregnancy', 'Motion Sickness'],
    risk: 'low',
    specialist: 'Gastroenterologist',
    precautions: ['Eat bland foods', 'Stay hydrated with small sips', 'Avoid strong odors', 'Rest in ventilated area'],
  },
  'dizziness': {
    conditions: ['Vertigo (BPPV)', 'Low Blood Pressure', 'Inner Ear Infection', 'Dehydration'],
    risk: 'medium',
    specialist: 'ENT Specialist',
    precautions: ['Sit or lie down immediately', 'Avoid sudden movements', 'Stay hydrated', 'Avoid driving'],
  },
  'abdominal pain': {
    conditions: ['Gastritis', 'Appendicitis', 'IBS', 'Kidney Stones'],
    risk: 'medium',
    specialist: 'Gastroenterologist',
    precautions: ['Note location and type of pain', 'Avoid heavy meals', 'Apply warm compress', 'Seek care if severe'],
  },
  'joint pain': {
    conditions: ['Osteoarthritis', 'Rheumatoid Arthritis', 'Gout', 'Injury/Strain'],
    risk: 'low',
    specialist: 'Rheumatologist',
    precautions: ['Apply ice/heat therapy', 'Rest affected joint', 'Gentle stretching', 'Anti-inflammatory diet'],
  },
  'skin rash': {
    conditions: ['Allergic Dermatitis', 'Eczema', 'Psoriasis', 'Fungal Infection'],
    risk: 'low',
    specialist: 'Dermatologist',
    precautions: ['Avoid scratching', 'Keep area clean and dry', 'Use gentle moisturizer', 'Identify possible allergens'],
  },
  'anxiety': {
    conditions: ['Generalized Anxiety Disorder', 'Panic Disorder', 'Social Anxiety', 'Stress Response'],
    risk: 'medium',
    specialist: 'Psychiatrist',
    precautions: ['Practice deep breathing', 'Limit caffeine intake', 'Regular exercise', 'Consider therapy/counseling'],
  },
  'difficulty breathing': {
    conditions: ['Asthma Attack', 'Allergic Reaction', 'Pulmonary Embolism', 'Heart Attack'],
    risk: 'critical',
    specialist: 'Emergency Medicine',
    precautions: ['CALL EMERGENCY SERVICES IMMEDIATELY', 'Sit upright', 'Loosen tight clothing', 'Use emergency medications if available'],
  },
  'severe chest pain': {
    conditions: ['Heart Attack', 'Pulmonary Embolism', 'Aortic Dissection', 'Pneumothorax'],
    risk: 'critical',
    specialist: 'Emergency Medicine',
    precautions: ['CALL 911/EMERGENCY IMMEDIATELY', 'Chew aspirin if not allergic', 'Do not drive yourself', 'Stay calm and still'],
  },
  'loss of consciousness': {
    conditions: ['Syncope', 'Seizure', 'Stroke', 'Cardiac Arrest'],
    risk: 'critical',
    specialist: 'Emergency Medicine',
    precautions: ['CALL EMERGENCY SERVICES', 'Place in recovery position', 'Check breathing and pulse', 'Do not leave unattended'],
  },
  'back pain': {
    conditions: ['Muscle Strain', 'Herniated Disc', 'Sciatica', 'Kidney Infection'],
    risk: 'low',
    specialist: 'Orthopedist',
    precautions: ['Apply ice for first 48 hours', 'Gentle stretching', 'Maintain good posture', 'Avoid heavy lifting'],
  },
  'sore throat': {
    conditions: ['Viral Pharyngitis', 'Strep Throat', 'Tonsillitis', 'Laryngitis'],
    risk: 'low',
    specialist: 'ENT Specialist',
    precautions: ['Gargle with warm salt water', 'Stay hydrated', 'Rest your voice', 'Use throat lozenges'],
  },
  'insomnia': {
    conditions: ['Primary Insomnia', 'Sleep Apnea', 'Anxiety', 'Depression'],
    risk: 'low',
    specialist: 'Sleep Specialist',
    precautions: ['Maintain consistent sleep schedule', 'Limit screen time before bed', 'Avoid caffeine after noon', 'Create calming bedtime routine'],
  },
};

// Emergency keywords
const EMERGENCY_KEYWORDS = [
  'severe chest pain', 'difficulty breathing', 'loss of consciousness',
  'stroke', 'heart attack', 'seizure', 'uncontrolled bleeding',
  'severe allergic reaction', 'anaphylaxis', 'suicidal thoughts',
  'overdose', 'poisoning', 'severe burns', 'paralysis',
];

function detectEmergency(symptoms: string[]): boolean {
  const combined = symptoms.join(' ').toLowerCase();
  return EMERGENCY_KEYWORDS.some(keyword => combined.includes(keyword));
}

function calculateRiskLevel(symptoms: string[]): RiskLevel {
  if (detectEmergency(symptoms)) return 'critical';
  
  let maxRisk: RiskLevel = 'low';
  const riskOrder: RiskLevel[] = ['low', 'medium', 'high', 'critical'];
  
  for (const symptom of symptoms) {
    const key = symptom.toLowerCase().trim();
    for (const [dbKey, data] of Object.entries(SYMPTOM_DATABASE)) {
      if (key.includes(dbKey) || dbKey.includes(key)) {
        const currentIndex = riskOrder.indexOf(data.risk);
        const maxIndex = riskOrder.indexOf(maxRisk);
        if (currentIndex > maxIndex) {
          maxRisk = data.risk;
        }
      }
    }
  }
  
  // Multiple symptoms increase risk
  if (symptoms.length >= 4 && maxRisk === 'low') maxRisk = 'medium';
  if (symptoms.length >= 6 && maxRisk === 'medium') maxRisk = 'high';
  
  return maxRisk;
}

export async function analyzeSymptoms(symptoms: string[]): Promise<SymptomAnalysis> {
  const isEmergency = detectEmergency(symptoms);
  const riskLevel = calculateRiskLevel(symptoms);

  // If Gemini API Key is available, perform real structured AI diagnosis grounded on our dataset!
  if (AI_CONFIG.apiKey) {
    try {
      // Retrieve active few-shots matching the symptoms for localized grounding
      const matchedFewShots = FEW_SHOT_SAMPLES.filter(sample =>
        symptoms.some(sym => sample.input.toLowerCase().includes(sym.toLowerCase()))
      ).slice(0, 3);

      const contents = [
        ...matchedFewShots.map(sample => [
          { role: 'user', parts: [{ text: sample.input }] },
          { role: 'model', parts: [{ text: sample.output }] }
        ]).flat(),
        {
          role: 'user',
          parts: [{
            text: `Perform a diagnostic analysis for the following user symptoms: ${symptoms.join(', ')}.
Provide a complete, clinically sound, structured report.
Your output MUST be a valid JSON object matching this schema exactly:
{
  "conditions": [
    {
      "name": "Specific condition name matched from your dataset rules",
      "probability": 0.85,
      "description": "Short explanation of the condition and why it fits these symptoms."
    }
  ],
  "risk_level": "low" | "medium" | "high" | "critical",
  "precautions": ["precaution 1", "precaution 2"],
  "next_steps": ["next step 1", "next step 2"],
  "lifestyle_recommendations": ["lifestyle recommendation 1", "lifestyle recommendation 2"],
  "confidence_score": 0.95,
  "specialist_type": "The exact specialist field suitable for these symptoms",
  "emergency_warning": "Immediate red-flag warning if high-risk / emergency, else null"
}`
          }]
        }
      ];

      const systemInstruction = `You are MediAssist AI, a professional medical diagnostic and conversational triage engine.
You are grounded strictly on an official dataset of 41 unique conditions and their symptom profiles:
${JSON.stringify(DISEASE_SYMPTOMS_MAP, null, 2)}

Instructions:
1. Compare the patient's symptoms (${symptoms.join(', ')}) against the mapped symptoms of these 41 conditions.
2. Order matched conditions by diagnostic probability.
3. Calculate the risk_level based on symptom matches (assign 'critical' if matching heart attack, stroke, severe breathing difficulties, etc.).
4. Recommend actionable precautions, next steps (like seeing a specific specialist), and lifestyle advice.
5. You MUST return a single, valid JSON object following the requested schema. No markdown formatting outside of JSON, no backticks, just raw JSON.`;

      const { url, headers } = getApiCallConfig(AI_CONFIG.apiKey);
      const response = await axios.post(url, {
        contents,
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          responseMimeType: "application/json"
        }
      }, { headers });

      const responseText = response.data.candidates[0].content.parts[0].text;
      const parsedAnalysis: SymptomAnalysis = JSON.parse(responseText);

      // Clean or append emergency flags if needed
      if (isEmergency && parsedAnalysis.risk_level !== 'critical') {
        parsedAnalysis.risk_level = 'critical';
      }
      if (isEmergency && !parsedAnalysis.emergency_warning) {
        parsedAnalysis.emergency_warning = '⚠️ EMERGENCY ALERT: Your symptoms indicate a potentially life-threatening condition. Please call emergency services (911) immediately or go to the nearest emergency room.';
      }

      return parsedAnalysis;
    } catch (error) {
      console.error("Gemini Diagnostic API call failed, falling back to local diagnostic engine.", error);
    }
  }

  // Simulate AI processing delay for local mock
  await sleep(1500 + Math.random() * 1000);

  // Gather conditions from database
  const allConditions: { name: string; probability: number; description: string }[] = [];
  const allPrecautions: string[] = [];
  let specialist = 'General Physician';
  
  for (const symptom of symptoms) {
    const key = symptom.toLowerCase().trim();
    for (const [dbKey, data] of Object.entries(SYMPTOM_DATABASE)) {
      if (key.includes(dbKey) || dbKey.includes(key)) {
        data.conditions.forEach((condition, i) => {
          if (!allConditions.find(c => c.name === condition)) {
            allConditions.push({
              name: condition,
              probability: Math.max(0.3, 0.85 - i * 0.15 - Math.random() * 0.1),
              description: `Condition commonly associated with ${dbKey} according to dataset profiling.`,
            });
          }
        });
        allPrecautions.push(...data.precautions);
        specialist = data.specialist;
      }
    }
  }

  // If no matches found, provide general analysis
  if (allConditions.length === 0) {
    allConditions.push(
      { name: 'General Health Concern', probability: 0.6, description: 'Your symptoms require further medical evaluation for accurate diagnosis.' },
      { name: 'Stress-Related Condition', probability: 0.4, description: 'Symptoms may be related to stress or lifestyle factors.' },
    );
    allPrecautions.push('Monitor symptoms closely', 'Stay hydrated', 'Get adequate rest', 'Consult a healthcare provider');
  }

  // Sort by probability
  allConditions.sort((a, b) => b.probability - a.probability);

  const nextSteps = [
    `Schedule an appointment with a ${specialist}`,
    'Keep a detailed symptom diary',
    'Monitor for any changes or worsening',
    isEmergency ? 'SEEK IMMEDIATE EMERGENCY MEDICAL ATTENTION' : 'Follow up within 1-2 weeks if symptoms persist',
    'Bring this report to your healthcare provider',
  ];

  const lifestyleRecommendations = [
    'Maintain a balanced diet rich in fruits and vegetables',
    'Engage in at least 30 minutes of moderate exercise daily',
    'Ensure 7-9 hours of quality sleep per night',
    'Practice stress management techniques like meditation',
    'Stay well-hydrated throughout the day',
    'Limit alcohol consumption and avoid smoking',
  ];

  // Deduplicate precautions
  const uniquePrecautions = [...new Set(allPrecautions)].slice(0, 6);

  const analysis: SymptomAnalysis = {
    conditions: allConditions.slice(0, 5),
    risk_level: riskLevel,
    precautions: uniquePrecautions,
    next_steps: nextSteps,
    lifestyle_recommendations: lifestyleRecommendations,
    confidence_score: Math.round((0.65 + Math.random() * 0.25) * 100) / 100,
    specialist_type: specialist,
  };

  if (isEmergency) {
    analysis.emergency_warning = '⚠️ EMERGENCY ALERT: Your symptoms indicate a potentially life-threatening condition. Please call emergency services (911) immediately or go to the nearest emergency room. Do not delay seeking care.';
  }

  return analysis;
}

// Chat AI responses
const CHAT_RESPONSES: Record<string, string[]> = {
  greeting: [
    "Hello! I'm your MediAssist AI healthcare assistant. I'm here to help you with general health information, symptom guidance, and wellness tips. How can I assist you today?",
    "Welcome to MediAssist AI! I'm your virtual healthcare companion. I can help with symptom analysis, health questions, and wellness advice. What would you like to know?",
  ],
  symptoms: [
    "I understand you're experiencing some symptoms. Could you describe them in more detail? Include information like:\n\n- **When** did the symptoms start?\n- **How severe** are they on a scale of 1-10?\n- **What makes them** better or worse?\n- **Any other symptoms** you're experiencing?\n\nThis will help me provide better guidance.",
    "Thank you for sharing your symptoms. For a comprehensive analysis, I recommend using our **AI Symptom Checker** tool, which can provide detailed condition analysis and recommendations.\n\nIn the meantime, here are some general tips:\n- Monitor your symptoms closely\n- Stay hydrated and rest\n- Seek immediate care if symptoms worsen significantly",
  ],
  medication: [
    "Regarding medication questions, I want to emphasize that I cannot prescribe or recommend specific medications. However, I can provide general information:\n\n- Always consult your healthcare provider before starting any medication\n- Take medications as prescribed\n- Report any side effects to your doctor\n- Keep a medication log\n\nWould you like me to help you with anything else?",
  ],
  mental_health: [
    "Mental health is just as important as physical health. Here are some supportive resources:\n\n🧠 **Self-care practices:**\n- Practice mindfulness meditation (even 5 minutes helps)\n- Maintain social connections\n- Exercise regularly\n- Establish a consistent sleep routine\n\n💚 **Professional support:**\n- Consider speaking with a therapist or counselor\n- Crisis helpline: **988 Suicide & Crisis Lifeline**\n- Text HOME to **741741** for the Crisis Text Line\n\nYou're not alone, and seeking help is a sign of strength.",
  ],
  diet: [
    "Great question about nutrition! Here are evidence-based dietary guidelines:\n\n🥗 **Daily essentials:**\n- 5+ servings of fruits and vegetables\n- Whole grains over refined grains\n- Lean proteins (fish, poultry, legumes)\n- Healthy fats (olive oil, nuts, avocados)\n\n💧 **Hydration:** Aim for 8 glasses of water daily\n\n⚠️ **Limit:** Added sugars, saturated fats, and sodium\n\nWould you like specific dietary advice for a particular health condition?",
  ],
  exercise: [
    "Regular physical activity is crucial for good health! Here are WHO recommendations:\n\n🏃 **Adults (18-64):**\n- 150-300 minutes of moderate activity per week\n- OR 75-150 minutes of vigorous activity\n- Muscle-strengthening activities 2+ days/week\n\n🧘 **Great starter activities:**\n- Brisk walking\n- Swimming\n- Cycling\n- Yoga\n\n**Remember:** Start slowly and gradually increase intensity. Consult your doctor before beginning a new exercise program if you have any health conditions.",
  ],
  sleep: [
    "Sleep is essential for your overall health and well-being. Here are some tips:\n\n😴 **Sleep hygiene tips:**\n- Aim for 7-9 hours per night\n- Keep a consistent sleep schedule\n- Create a dark, cool, quiet environment\n- Avoid screens 1 hour before bed\n- Limit caffeine after 2 PM\n- Avoid heavy meals before bed\n\n⚠️ **When to see a doctor:**\n- Persistent insomnia (3+ nights/week)\n- Excessive daytime sleepiness\n- Snoring with breathing pauses\n- Restless legs at night",
  ],
  default: [
    "Thank you for your question! While I'm an AI health assistant, I always recommend consulting with qualified healthcare professionals for personalized medical advice.\n\nHere's what I can help you with:\n- 🔍 **Symptom Analysis** - Use our AI Symptom Checker\n- 💬 **Health Information** - Ask about conditions, nutrition, exercise\n- 📊 **Wellness Tips** - Daily health recommendations\n- 📋 **Reports** - Generate health reports\n\nWhat would you like to explore?",
  ],
};

function categorizeMessage(message: string): string {
  const lower = message.toLowerCase();
  if (lower.match(/\b(hi|hello|hey|good morning|good evening|good afternoon)\b/)) return 'greeting';
  if (lower.match(/\b(symptom|pain|ache|hurt|sore|fever|cough|headache|nausea|dizzy)\b/)) return 'symptoms';
  if (lower.match(/\b(medicine|medication|drug|prescription|dosage|pill|tablet)\b/)) return 'medication';
  if (lower.match(/\b(mental|anxiety|depress|stress|sad|worry|panic|mood|emotional)\b/)) return 'mental_health';
  if (lower.match(/\b(diet|nutrition|food|eat|vitamin|supplement|meal|calorie)\b/)) return 'diet';
  if (lower.match(/\b(exercise|workout|fitness|gym|run|walk|sport|physical activity)\b/)) return 'exercise';
  if (lower.match(/\b(sleep|insomnia|tired|fatigue|rest|nap|wake)\b/)) return 'sleep';
  return 'default';
}

export async function getChatResponse(message: string, chatHistory: ChatMessage[] = []): Promise<string> {
  console.log("💬 getChatResponse called.");
  console.log("🔑 API Key configured in frontend:", AI_CONFIG.apiKey ? `Loaded (starts with ${AI_CONFIG.apiKey.slice(0, 10)}...)` : "NOT loaded (running offline mode)");

  // If Gemini API Key is available, perform real-time AI conversation grounded on our dataset!
  if (AI_CONFIG.apiKey) {
    try {
      const lowerMessage = message.toLowerCase();
      
      // Match relevant few-shot examples from Kaggle dataset based on keywords
      const matchedSamples = FEW_SHOT_SAMPLES.filter(sample => {
        const inputLower = sample.input.toLowerCase();
        // Check if message mentions any unique symptom words from the few-shot inputs
        return lowerMessage.split(' ').some(word => 
          word.length > 4 && inputLower.includes(word)
        );
      }).slice(0, 3); // Retrieve up to 3 relevant context grounding pairs

      // Construct few-shots contents formatting
      const fewShotPrompts = matchedSamples.map(sample => [
        { role: 'user', parts: [{ text: sample.input }] },
        { role: 'model', parts: [{ text: sample.output }] }
      ]).flat();

      // Format multi-turn conversation history
      const historyPrompts = chatHistory.slice(-10).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.message }]
      }));

      // Assemble full payload
      const contents = [
        ...fewShotPrompts,
        ...historyPrompts,
        { role: 'user', parts: [{ text: message }] }
      ];

      const systemInstruction = `You are MediAssist AI, a professional medical diagnostic and conversational triage engine.
You are grounded strictly on an official dataset of 41 primary clinical conditions and their diagnostic symptom profiles:
${JSON.stringify(DISEASE_SYMPTOMS_MAP, null, 2)}

Conversational Guidelines:
1. Provide extremely helpful, medically sound, and compassionate advice.
2. If the user mentions symptoms, compare them with your 41 dataset profiles. Guide them and discuss potential conditions naturally.
3. Be professional and clear. Always remind users that you are an AI assistant and that they should consult standard healthcare professionals for serious medical conditions.
4. Keep emergency detection active: if the user mentions high-risk elements (e.g. chest pain, numbness on one side, severe breathlessness, altered consciousness), immediately advise them to seek emergency services (911) without delay.`;

      const { url, headers } = getApiCallConfig(AI_CONFIG.apiKey);
      
      console.log("🌐 Sending request to Google Gemini API at:", url.split('?')[0]);
      
      const response = await axios.post(url, {
        contents,
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        }
      }, { headers });

      console.log("✅ Live Gemini Response received successfully!");
      return response.data.candidates[0].content.parts[0].text;
    } catch (error: any) {
      console.error("❌ Gemini Chat API call failed!");
      if (error.response) {
        console.error("Server Error Status:", error.response.status);
        console.error("Server Error Response:", error.response.data);
        if (error.response.data && error.response.data.error) {
          console.error("📢 GOOGLE API ERROR MESSAGE:", error.response.data.error.message);
        }
      } else {
        console.error("Error Message:", error.message);
      }
      console.warn("⚠️ Falling back to offline local chat categorizer (pre-made responses).");
    }
  }

  // Simulate AI processing delay for local mock
  await sleep(1000 + Math.random() * 1000);
  
  const category = categorizeMessage(message);
  const responses = CHAT_RESPONSES[category] || CHAT_RESPONSES.default;
  const response = responses[Math.floor(Math.random() * responses.length)];
  
  return response;
}

// Suggested prompts for the chatbot
export const SUGGESTED_PROMPTS = [
  { text: "What are common cold symptoms?", icon: "🤧" },
  { text: "How can I improve my sleep?", icon: "😴" },
  { text: "Tips for managing stress", icon: "🧘" },
  { text: "What's a healthy diet plan?", icon: "🥗" },
  { text: "How much exercise do I need?", icon: "🏃" },
  { text: "When should I see a doctor?", icon: "🏥" },
  { text: "How to boost immunity?", icon: "🛡️" },
  { text: "Mental health resources", icon: "💚" },
];

// Symptom categories for the checker
export const SYMPTOM_CATEGORIES = {
  general: ['Fever', 'Fatigue', 'Weight Loss', 'Chills', 'Night Sweats', 'Loss of Appetite'],
  respiratory: ['Cough', 'Shortness of Breath', 'Wheezing', 'Sore Throat', 'Runny Nose', 'Chest Congestion'],
  cardiovascular: ['Chest Pain', 'Heart Palpitations', 'Swelling in Legs', 'Dizziness', 'Fainting'],
  neurological: ['Headache', 'Dizziness', 'Numbness', 'Tremors', 'Memory Issues', 'Blurred Vision'],
  gastrointestinal: ['Nausea', 'Vomiting', 'Abdominal Pain', 'Diarrhea', 'Constipation', 'Bloating'],
  musculoskeletal: ['Joint Pain', 'Back Pain', 'Muscle Weakness', 'Stiffness', 'Swelling'],
  dermatological: ['Skin Rash', 'Itching', 'Hives', 'Dry Skin', 'Bruising', 'Skin Discoloration'],
  psychological: ['Anxiety', 'Depression', 'Insomnia', 'Mood Swings', 'Irritability', 'Panic Attacks'],
};

// Wellness tips
export const WELLNESS_TIPS = [
  {
    id: '1',
    title: 'Stay Hydrated',
    description: 'Drink at least 8 glasses of water daily to maintain optimal body functions and energy levels.',
    category: 'Hydration',
    icon: '💧',
  },
  {
    id: '2',
    title: 'Morning Stretches',
    description: 'Start your day with 10 minutes of stretching to improve flexibility and reduce muscle tension.',
    category: 'Exercise',
    icon: '🧘',
  },
  {
    id: '3',
    title: 'Mindful Breathing',
    description: 'Practice 4-7-8 breathing technique: inhale 4s, hold 7s, exhale 8s. Reduces stress and anxiety.',
    category: 'Mental Health',
    icon: '🌬️',
  },
  {
    id: '4',
    title: 'Colorful Plate',
    description: 'Aim for 5 different colors on your plate each meal for a diverse range of nutrients.',
    category: 'Nutrition',
    icon: '🌈',
  },
  {
    id: '5',
    title: 'Screen Break',
    description: 'Follow the 20-20-20 rule: every 20 min, look at something 20 feet away for 20 seconds.',
    category: 'Eye Health',
    icon: '👁️',
  },
  {
    id: '6',
    title: 'Quality Sleep',
    description: 'Create a sleep-friendly environment: cool, dark, and quiet. Aim for 7-9 hours nightly.',
    category: 'Sleep',
    icon: '🌙',
  },
];
