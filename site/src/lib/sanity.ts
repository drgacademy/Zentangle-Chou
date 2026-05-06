/**
 * Sanity client and fetch helpers.
 *
 * The site is statically built (output: 'static'), so all Sanity queries run
 * at build time only. Visitors never hit Sanity directly.
 *
 * If SANITY_PROJECT_ID is unset (e.g. on first clone before the user wires up
 * a real project), every fetch helper returns null/[]. Callers should fall
 * back to the legacy JSON files in src/data/ until migration is complete.
 */
import { createClient, type SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = import.meta.env.SANITY_PROJECT_ID;
const dataset = import.meta.env.SANITY_DATASET ?? 'production';
const apiVersion = '2024-01-01';
const token = import.meta.env.SANITY_API_READ_TOKEN;

let _client: SanityClient | null = null;

export function getSanityClient(): SanityClient | null {
  if (!projectId) return null;
  if (_client) return _client;
  _client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: !token,
    perspective: 'published',
  });
  return _client;
}

export const sanityEnabled = (): boolean => Boolean(projectId);

const builder = projectId ? imageUrlBuilder({ projectId, dataset }) : null;

export function urlFor(source: any): string {
  if (!builder || !source) return '';
  try {
    return builder.image(source).auto('format').fit('max').url();
  } catch {
    return '';
  }
}

export async function fetchArtworks() {
  const client = getSanityClient();
  if (!client) return null;
  return client.fetch<Artwork[]>(
    `*[_type == "artwork"] | order(date desc) {
      _id,
      "id": _id,
      "slug": slug.current,
      title,
      description,
      mainImage,
      thumbnail,
      date,
      "tangles": tangles[]->{ "name": nameEn, "slug": slug.current },
      techniques,
      featured
    }`
  );
}

export async function fetchTangles() {
  const client = getSanityClient();
  if (!client) return null;
  return client.fetch<Tangle[]>(
    `*[_type == "tangle"] | order(nameEn asc) {
      _id,
      "slug": slug.current,
      nameEn,
      nameZh,
      creator,
      firstPublished,
      difficulty,
      categories,
      steps,
      whyImportant
    }`
  );
}

export async function fetchVideos() {
  const client = getSanityClient();
  if (!client) return null;
  return client.fetch<Video[]>(
    `*[_type == "video"] | order(order asc, _createdAt desc) {
      _id,
      title,
      youtubeUrl,
      youtubeId,
      description,
      featured,
      order
    }`
  );
}

export async function fetchHomepage() {
  const client = getSanityClient();
  if (!client) return null;
  return client.fetch<Homepage | null>(
    `*[_type == "homepage"][0] {
      heroTitle,
      heroSubtitle,
      aboutIntro,
      quote,
      quoteAuthor,
      "featuredArtworks": featuredArtworks[]->{
        "id": _id,
        title,
        mainImage,
        "tangles": tangles[]->{"name": nameEn}
      }
    }`
  );
}

export async function fetchAboutPage() {
  const client = getSanityClient();
  if (!client) return null;
  return client.fetch<AboutPage | null>(
    `*[_type == "aboutPage"][0] { title, body, portrait }`
  );
}

export async function fetchSiteSettings() {
  const client = getSanityClient();
  if (!client) return null;
  return client.fetch<SiteSettings | null>(
    `*[_type == "siteSettings"][0] { siteTitle, siteDescription, social }`
  );
}

// ---- Types ----

export interface LocalizedString { zh?: string; en?: string }

export interface Artwork {
  _id: string;
  id: string;
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  mainImage?: any;
  thumbnail?: any;
  date: string;
  tangles: Array<{ name: string; slug: string }>;
  techniques: string[];
  featured: boolean;
}

export interface Tangle {
  _id: string;
  slug: string;
  nameEn: string;
  nameZh: string;
  creator?: string;
  firstPublished?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  categories: string[];
  steps: Array<{ instructionZh?: string; instructionEn?: string }>;
  whyImportant?: LocalizedString;
}

export interface Video {
  _id: string;
  title: LocalizedString;
  youtubeUrl: string;
  youtubeId: string;
  description?: LocalizedString;
  featured: boolean;
  order: number;
}

export interface Homepage {
  heroTitle?: LocalizedString;
  heroSubtitle?: LocalizedString;
  aboutIntro?: LocalizedString;
  quote?: LocalizedString;
  quoteAuthor?: string;
  featuredArtworks?: Array<{ id: string; title: LocalizedString; mainImage?: any; tangles?: Array<{ name: string }> }>;
}

export interface AboutPage {
  title?: LocalizedString;
  body?: LocalizedString;
  portrait?: any;
}

export interface SiteSettings {
  siteTitle?: LocalizedString;
  siteDescription?: LocalizedString;
  social?: Array<{ label: string; url: string }>;
}

export function youtubeIdFromUrl(url: string): string | null {
  if (!url) return null;
  const m =
    url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/) ||
    url.match(/^([A-Za-z0-9_-]{11})$/);
  return m ? m[1] : null;
}
