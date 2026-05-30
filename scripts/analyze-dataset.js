const fs = require('fs');
const path = require('path');

const jsonlPath = path.join(__dirname, '../dataset.jsonl');

try {
  const fileContent = fs.readFileSync(jsonlPath, 'utf8');
  const lines = fileContent.split('\n');
  const diseases = new Set();
  let count = 0;

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const data = JSON.parse(line);
      const modelText = data.contents[1].parts[0].text;
      const diseaseMatch = modelText.match(/profile for:\s*(.*?)\.?$/i);
      const disease = diseaseMatch ? diseaseMatch[1].trim() : '';
      if (disease) {
        diseases.add(disease);
        count++;
      }
    } catch (e) {}
  }

  console.log(`Total records processed: ${count}`);
  console.log(`Unique diseases found (${diseases.size}):`);
  console.log(Array.from(diseases));
} catch (e) {
  console.error('Error running analyzer:', e);
}
