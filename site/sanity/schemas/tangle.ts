import { defineField, defineType } from 'sanity';

export const tangle = defineType({
  name: 'tangle',
  title: '圖樣 / Tangle',
  type: 'document',
  fields: [
    defineField({
      name: 'nameEn',
      title: '英文名稱',
      type: 'string',
      validation: r => r.required(),
    }),
    defineField({
      name: 'nameZh',
      title: '中文名稱',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'nameEn', maxLength: 96 },
      validation: r => r.required(),
    }),
    defineField({
      name: 'creator',
      title: '創作者',
      type: 'string',
    }),
    defineField({
      name: 'firstPublished',
      title: '首次發表年',
      type: 'number',
    }),
    defineField({
      name: 'difficulty',
      title: '難度',
      type: 'string',
      options: {
        list: [
          { title: 'Beginner', value: 'beginner' },
          { title: 'Intermediate', value: 'intermediate' },
          { title: 'Advanced', value: 'advanced' },
        ],
      },
    }),
    defineField({
      name: 'categories',
      title: '類別',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'steps',
      title: '步驟',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'instructionZh', title: '中文步驟', type: 'text', rows: 3 },
            { name: 'instructionEn', title: 'English step', type: 'text', rows: 3 },
            { name: 'image', title: '圖片', type: 'image' },
          ],
          preview: {
            select: { title: 'instructionZh', subtitle: 'instructionEn' },
          },
        },
      ],
    }),
    defineField({
      name: 'whyImportant',
      title: '為何重要',
      type: 'object',
      fields: [
        { name: 'zh', title: '中文', type: 'text', rows: 4 },
        { name: 'en', title: 'English', type: 'text', rows: 4 },
      ],
    }),
    defineField({
      name: 'procedural',
      title: '有程式化繪製演算法',
      description: '若打勾,網站會用 lib/tangles 即時繪製此圖樣。',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'nameZh', subtitle: 'nameEn' },
  },
});
