import projectData from '@/data/projects.json';
import siteData from '@/data/site.json';
import socialPreview from '@/assets/social-preview.jpg.asset.json';
export const projects = projectData;
export type Project = (typeof projects)[number];
export const site = siteData;
export const publicUrl = (import.meta.env['VITE_PUBLIC_SITE_URL'] || site.publicUrl).replace(/\/$/, '');
export const staging = import.meta.env.DEV || import.meta.env['VITE_SITE_NOINDEX'] === 'true';
export function seo(title: string, description: string, path: string) {
  const url = `${publicUrl}${path}`;
  return {
    meta: [{ title }, { name: 'description', content: description }, { property: 'og:title', content: title }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { property: 'og:url', content: url }, { name: 'twitter:card', content: 'summary_large_image' }, { property: 'og:image', content: `${publicUrl}${socialPreview.url}` }, { name: 'twitter:image', content: `${publicUrl}${socialPreview.url}` }, { name: 'robots', content: staging ? 'noindex, nofollow' : 'index, follow' }],
    links: [{ rel: 'canonical', href: url }],
  };
}
export function JsonLd({ value }: { value: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(value).replace(/</g, '\\u003c') }} />;
}
