// Temporary script: matches imagens_produto files to product_variants by slug/SKU
// Run with: node scripts/sync-images.mjs
import { createClient } from '@supabase/supabase-js';
import { readdirSync } from 'fs';
import { join, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://qhzfpampacitsianmlpw.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoemZwYW1wYWNpdHNpYW5tbHB3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjYyODEzNywiZXhwIjoyMDc4MjA0MTM3fQ.koAB1hB5hysMt4ShOKSoX6CvrPcHXs06w_8sWEU8lDQ';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Build a set of available images: { stem -> filename }
const imgDir = join(__dirname, '..', 'public', 'imagens_produto');
const files = readdirSync(imgDir);
const byFilename = new Map(); // lowercase stem → original filename
for (const f of files) {
  const stem = basename(f, extname(f)).toLowerCase();
  byFilename.set(stem, f);
}
console.log(`Found ${files.length} images in imagens_produto/`);

// Fetch all variants
const { data: variants, error } = await supabase
  .from('product_variants')
  .select('id, sku, url_slug, main_image_url');

if (error) {
  console.error('Error fetching variants:', error.message);
  process.exit(1);
}
console.log(`Found ${variants.length} product variants in DB`);

// Sort image stems longest-first so we prefer the most specific match
const sortedStems = [...byFilename.keys()].sort((a, b) => b.length - a.length);

function findBestImage(slug, sku) {
  const s = (slug ?? '').toLowerCase();
  const k = (sku ?? '').toLowerCase();
  // 1. Exact match on slug or SKU
  if (byFilename.has(s)) return byFilename.get(s);
  if (byFilename.has(k)) return byFilename.get(k);
  // 2. Slug starts-with image stem (e.g. slug has size suffix appended)
  for (const stem of sortedStems) {
    if (s.startsWith(stem + '-') || s.startsWith(stem + '_')) return byFilename.get(stem);
  }
  // 3. Image stem starts-with slug (slug is shorter than filename for some reason)
  for (const stem of sortedStems) {
    if (stem.startsWith(s + '-') || stem.startsWith(s + '_')) return byFilename.get(stem);
  }
  // 4. Image stem starts-with SKU (handles _Tecnico, _2, _3 suffix variants)
  for (const stem of sortedStems) {
    if (stem.startsWith(k + '_') || stem.startsWith(k + '-')) return byFilename.get(stem);
  }
  return null;
}

const updates = [];
const unmatched = [];

for (const v of variants) {
  const matchedFile = findBestImage(v.url_slug, v.sku);
  if (matchedFile) {
    updates.push({ id: v.id, main_image_url: `/imagens_produto/${matchedFile}` });
  } else {
    unmatched.push({ id: v.id, sku: v.sku, slug: v.url_slug });
  }
}

console.log(`\nMatched: ${updates.length} | Unmatched: ${unmatched.length}`);

if (updates.length > 0) {
  console.log('\nSample matches:');
  updates.slice(0, 5).forEach(u => console.log(` id=${u.id} → ${u.main_image_url}`));

  // Update in batches of 50
  for (let i = 0; i < updates.length; i += 50) {
    const batch = updates.slice(i, i + 50);
    for (const u of batch) {
      const { error: e } = await supabase
        .from('product_variants')
        .update({ main_image_url: u.main_image_url })
        .eq('id', u.id);
      if (e) console.error(`  Failed id=${u.id}: ${e.message}`);
    }
    console.log(`  Updated batch ${Math.floor(i/50)+1}`);
  }
  console.log('Done updating matched variants.');
}

if (unmatched.length > 0) {
  console.log('\nUnmatched variants (no image file found):');
  unmatched.forEach(u => console.log(`  id=${u.id} sku=${u.sku} slug=${u.slug}`));
}
