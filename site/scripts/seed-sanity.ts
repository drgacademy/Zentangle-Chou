/**
 * One-time migration: pushes the seed data in src/data/{artworks,tangles}.json
 * into a Sanity dataset.
 *
 * Usage:
 *   1. Set up .env.local with SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_WRITE_TOKEN
 *   2. Run: pnpm tsx scripts/seed-sanity.ts
 *
 * Idempotent: uses deterministic _id derived from slug/title so re-running
 * doesn't create duplicates.
 */
import { createClient } from '@sanity/client';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET ?? 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error('Missing env: SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN required');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const docId = (kind: string, slug: string) => `${kind}-${slug}`;

async function seedTangles() {
  const file = join(__dirname, '..', 'src', 'data', 'tangles.json');
  const tangles = JSON.parse(readFileSync(file, 'utf-8')) as any[];

  console.log(`Seeding ${tangles.length} tangles…`);

  const tx = client.transaction();
  for (const t of tangles) {
    const slug = slugify(t.nameEn || t.slug?.current || t._id);
    const _id = docId('tangle', slug);
    tx.createOrReplace({
      _id,
      _type: 'tangle',
      nameEn: t.nameEn,
      nameZh: t.nameZh,
      slug: { _type: 'slug', current: slug },
      creator: t.creator,
      firstPublished: t.firstPublished,
      difficulty: t.difficulty,
      categories: t.categories,
      steps: (t.steps ?? []).map((s: any) => ({
        _key: Math.random().toString(36).slice(2),
        instructionZh: s.instructionZh,
        instructionEn: s.instructionEn,
      })),
      whyImportant: t.whyImportant,
    });
  }
  await tx.commit();
}

async function seedArtworks() {
  const file = join(__dirname, '..', 'src', 'data', 'artworks.json');
  const artworks = JSON.parse(readFileSync(file, 'utf-8')) as any[];

  console.log(`Seeding ${artworks.length} artworks…`);

  const tx = client.transaction();
  for (const a of artworks) {
    const slug = slugify(a.titleEn);
    const _id = docId('artwork', slug);
    tx.createOrReplace({
      _id,
      _type: 'artwork',
      title: { zh: a.titleZh, en: a.titleEn },
      slug: { _type: 'slug', current: slug },
      description: {
        zh: [{ _key: 'z', _type: 'block', children: [{ _type: 'span', text: a.descZh }] }],
        en: [{ _key: 'e', _type: 'block', children: [{ _type: 'span', text: a.descEn }] }],
      },
      date: a.date,
      techniques: a.techniques,
      featured: a.featured,
      tangles: (a.tangles ?? []).map((name: string) => ({
        _key: Math.random().toString(36).slice(2),
        _type: 'reference',
        _ref: docId('tangle', slugify(name)),
      })),
    });
  }
  await tx.commit();
}

async function main() {
  await seedTangles();
  await seedArtworks();
  console.log('✓ Seeding complete.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
