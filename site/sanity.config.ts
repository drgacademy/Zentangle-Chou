/**
 * Sanity Studio config — used by the `sanity` CLI to run the admin dashboard.
 *
 * Setup:
 *   1. Run `npx sanity init` (one time) to create a Sanity project.
 *   2. Copy the resulting projectId / dataset values into .env.local.
 *   3. `pnpm sanity dev` starts the studio at http://localhost:3333
 *   4. `pnpm sanity deploy` publishes it to <project>.sanity.studio
 *
 * The Studio dependencies (`sanity`, `@sanity/vision`, `styled-components`) are
 * not installed by default to keep the production build slim. Install them
 * with `pnpm add -D sanity @sanity/vision styled-components` when you're
 * ready to set up the admin.
 */
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemas';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

export default defineConfig({
  name: 'zentangle-chou',
  title: 'Zentangle Chou',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: S =>
        S.list()
          .title('內容')
          .items([
            S.listItem().title('首頁').child(S.document().schemaType('homepage').documentId('homepage')),
            S.listItem().title('關於頁').child(S.document().schemaType('aboutPage').documentId('aboutPage')),
            S.listItem().title('網站設定').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.documentTypeListItem('artwork').title('作品'),
            S.documentTypeListItem('tangle').title('圖樣字典'),
            S.documentTypeListItem('video').title('影片'),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
