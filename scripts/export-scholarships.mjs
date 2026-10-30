import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read scholarships.ts and extract SCHOLARSHIPS_DATA
const tsContent = fs.readFileSync(path.resolve(__dirname, '../src/data/scholarships.ts'), 'utf8');

// Use a clean JS evaluator by replacing TypeScript typings
const jsContent = tsContent
  .replace(/import\s+.*?;/g, '')
  .replace(/export\s+const\s+SCHOLARSHIPS_DATA:\s*Scholarship\[\]\s*=/, 'const SCHOLARSHIPS_DATA =')
  .replace(/export\s+const\s+DEMO_USER_PROFILE\s*=[\s\S]*$/, '')
  .replace(/as\s+const/g, '');

const evalFn = new Function(jsContent + '; return SCHOLARSHIPS_DATA;');
const data = evalFn();

const outPath = path.resolve(__dirname, '../backend/scholarships.json');
fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8');
console.log(`[OK] Exported ${data.length} scholarships to ${outPath}`);
