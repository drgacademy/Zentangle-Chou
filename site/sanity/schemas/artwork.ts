import { defineField, defineType } from 'sanity';

export const artwork = defineType({
  name: 'artwork',
  title: '作品 / Artwork',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '標題 (Title)',
      type: 'object',
      fields: [
        { name: 'zh', title: '中文', type: 'string', validation: r => r.required() },
        { name: 'en', title: 'English', type: 'string', validation: r => r.required() },
      ],
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      options: { source: 'title.en', maxLength: 96 },
      validation: r => r.required(),
    }),
    defineField({
      name: 'description',
      title: '描述 (Description)',
      type: 'object',
      fields: [
        { name: 'zh', title: '中文', type: 'array', of: [{ type: 'block' }] },
        { name: 'en', title: 'English', type: 'array', of: [{ type: 'block' }] },
      ],
    }),
    defineField({
      name: 'mainImage',
      title: '主圖 (Main image)',
      type: 'image',
      options: { hotspot: true },
      description: '若不上傳,網站會根據 tangles 自動生成程式化禪繞 SVG 作為佔位。',
    }),
    defineField({
      name: 'thumbnail',
      title: '縮圖 (Thumbnail)',
      type: 'image',
      options: { hotspot: true },
      description: '可留空,系統將自動從主圖裁切。',
    }),
    defineField({
      name: 'date',
      title: '完成日期',
      type: 'date',
      validation: r => r.required(),
    }),
    defineField({
      name: 'tangles',
      title: '使用的圖樣 (Tangles)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tangle' }] }],
    }),
    defineField({
      name: 'techniques',
      title: '技法',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Line variation', value: 'line-variation' },
          { title: 'Shading', value: 'shading' },
          { title: 'Layering', value: 'layering' },
          { title: 'White space', value: 'white-space' },
          { title: 'Density contrast', value: 'density-contrast' },
          { title: 'Organic flow', value: 'organic-flow' },
        ],
      },
    }),
    defineField({
      name: 'featured',
      title: '精選作品',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  orderings: [
    { title: '日期 (新→舊)', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title.zh', subtitle: 'date', media: 'mainImage' },
  },
});
