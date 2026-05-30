const fs = require('fs');
const path = require('path');

const jsonlPath = path.join(__dirname, '../dataset.jsonl');
const outputPath = path.join(__dirname, '../src/services/compiledDataset.ts');

try {
  const fileContent = fs.readFileSync(jsonlPath, 'utf8');
  const lines = fileContent.split('\n');
  
  const diseaseProfiles = {};
  const fewShotSamples = {};
  let totalProcessed = 0;

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const data = JSON.parse(line);
      const userText = data.contents[0].parts[0].text;
      const modelText = data.contents[1].parts[0].text;
      
      // Extract symptoms
      const symptomsMatch = userText.match(/symptoms:\s*(.*?)\.\s*What is/i);
      const symptoms = symptomsMatch ? symptomsMatch[1].split(',').map(s => s.trim().toLowerCase()) : [];
      
      // Extract disease
      const diseaseMatch = modelText.match(/profile for:\s*(.*?)\.?$/i);
      const disease = diseaseMatch ? diseaseMatch[1].trim() : '';
      
      if (symptoms.length > 0 && disease) {
        totalProcessed++;
        
        // 1. Build symptom sets for each disease
        if (!diseaseProfiles[disease]) {
          diseaseProfiles[disease] = {
            name: disease,
            symptoms: new Set(),
            sampleCount: 0
          };
        }
        symptoms.forEach(s => diseaseProfiles[disease].symptoms.add(s));

        // 2. Select up to 2 representative few-shot samples per disease
        if (!fewShotSamples[disease]) {
          fewShotSamples[disease] = [];
        }
        if (fewShotSamples[disease].length < 2) {
          fewShotSamples[disease].push({
            input: userText,
            output: modelText
          });
        }
      }
    } catch (e) {}
  }

  // Format profiles for serialization
  const profiles = {};
  for (const [name, profile] of Object.entries(diseaseProfiles)) {
    profiles[name] = Array.from(profile.symptoms);
  }

  // Format few-shot samples
  const samples = [];
  for (const diseaseSamples of Object.values(fewShotSamples)) {
    samples.push(...diseaseSamples);
  }

  const outputContent = `// This file is auto-generated from dataset.jsonl. Do not edit directly.

export interface FewShotSample {
  input: string;
  output: string;
}

// Complete mapping of all 41 unique diseases to their primary diagnostic symptoms from the Kaggle dataset
export const DISEASE_SYMPTOMS_MAP: Record<string, string[]> = ${JSON.stringify(profiles, null, 2)};

// Curated representative few-shot samples spanning all 41 diagnostic conditions (grounding datasets)
export const FEW_SHOT_SAMPLES: FewShotSample[] = ${JSON.stringify(samples, null, 2)};
`;

  fs.writeFileSync(outputPath, outputContent, 'utf8');
  console.log(`Successfully compiled!`);
  console.log(`- Processed: ${totalProcessed} lines`);
  console.log(`- Unique conditions: ${Object.keys(diseaseProfiles).length}`);
  console.log(`- Few-shot examples generated: ${samples.length}`);
} catch (e) {
  console.error('Error compiling dataset:', e);
}
