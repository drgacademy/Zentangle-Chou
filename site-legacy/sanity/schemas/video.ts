import { defineField, defineType } from 'sanity';

const YOUTUBE_REGEX = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/;

function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const m = url.match(YOUTUBE_REGEX) || url.match(/^([A-Za-z0-9_-]{11})$/);
  return m ? m[1] : null;
}

export const video = defineType({
  name: 'video',
  title: '影片 / Video',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '標題',
      type: 'object',
      fields: [
        { name: 'zh', title: '中文', type: 'string', validation: r => r.required() },
        { name: 'en', title: 'English', type: 'string' },
      ],
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube 網址',
      type: 'url',
      description: '貼上完整 YouTube 連結即可,系統會自動抽出影片 ID。',
      validation: r =>
        r.required().custom(value => {
          if (!value || typeof value !== 'string') return '必須提供網址';
          return extractYoutubeId(value) ? true : '不是有效的 YouTube 網址';
        }),
    }),
    defineField({
      name: 'youtubeId',
      title: 'YouTube ID (auto)',
      type: 'string',
      readOnly: true,
      description: '由 youtubeUrl 自動推算,不需手動填寫。',
    }),
    defineField({
      name: 'description',
      title: '說明',
      type: 'object',
      fields: [
        { name: 'zh', title: '中文', type: 'text', rows: 3 },
        { name: 'en', title: 'English', type: 'text', rows: 3 },
      ],
    }),
    defineField({
      name: 'order',
      title: '排序',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'featured',
      title: '精選',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title.zh', subtitle: 'youtubeUrl' },
  },
});

export { extractYoutubeId };
