// The model list in its fixed order, for templates that also have an entry's own `models`.
import fs from 'node:fs';
export default JSON.parse(fs.readFileSync(new URL('./models.json', import.meta.url), 'utf8'));
