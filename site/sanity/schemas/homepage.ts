import { defineField, defineType } from 'sanity';

export const homepage = defineType({
  name: 'homepage',
  title: '首頁設定',
  type: 'document',
  __experimental_actions: ['update', 'publish'], // singleton
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero 標題',
      type: 'object',
      fields: [
        { name: 'zh', type: 'string', title: '中文', initialValue: '一筆一畫,皆是可能' },
        { name: 'en', type: 'string', title: 'English', initialValue: 'Every stroke, a possibility' },
      ],
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero 副標',
      type: 'object',
      fields: [
        { name: 'zh', type: 'string', title: '中文' },
        { name: 'en', type: 'string', title: 'English' },
      ],
    }),
    defineField({
      name: 'aboutIntro',
      title: '關於禪繞畫 (Section)',
      type: 'object',
      fields: [
        { name: 'zh', type: 'array', of: [{ type: 'block' }], title: '中文' },
        { name: 'en', type: 'array', of: [{ type: 'block' }], title: 'English' },
      ],
    }),
    defineField({
      name: 'quote',
      title: '引言',
      type: 'object',
      fields: [
        { name: 'zh', type: 'text', rows: 3, title: '中文' },
        { name: 'en', type: 'text', rows: 3, title: 'English' },
      ],
    }),
    defineField({
      name: 'quoteAuthor',
      title: '引言作者',
      type: 'string',
    }),
    defineField({
      name: 'featuredArtworks',
      title: '精選作品 (顯示在首頁)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'artwork' }] }],
      validation: r => r.max(6),
    }),
  ],
  preview: { prepare: () => ({ title: '首頁設定' }) },
});

export const aboutPage = defineType({
  name: 'aboutPage',
  title: '關於頁',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'title',
      type: 'object',
      title: '標題',
      fields: [
        { name: 'zh', type: 'string', title: '中文' },
        { name: 'en', type: 'string', title: 'English' },
      ],
    }),
    defineField({
      name: 'body',
      type: 'object',
      title: '內文',
      fields: [
        { name: 'zh', type: 'array', of: [{ type: 'block' }], title: '中文' },
        { name: 'en', type: 'array', of: [{ type: 'block' }], title: 'English' },
      ],
    }),
    defineField({ name: 'portrait', title: '個人照', type: 'image', options: { hotspot: true } }),
  ],
  preview: { prepare: () => ({ title: '關於頁' }) },
});

export const siteSettings = defineType({
  name: 'siteSettings',
  title: '網站設定',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'siteTitle',
      type: 'object',
      title: '網站名稱',
      fields: [
        { name: 'zh', type: 'string', title: '中文' },
        { name: 'en', type: 'string', title: 'English' },
      ],
    }),
    defineField({
      name: 'siteDescription',
      type: 'object',
      title: '網站描述',
      fields: [
        { name: 'zh', type: 'text', rows: 3, title: '中文' },
        { name: 'en', type: 'text', rows: 3, title: 'English' },
      ],
    }),
    defineField({
      name: 'social',
      type: 'array',
      title: '社群連結',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: '名稱' },
            { name: 'url', type: 'url', title: '網址' },
          ],
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: '網站設定' }) },
});
