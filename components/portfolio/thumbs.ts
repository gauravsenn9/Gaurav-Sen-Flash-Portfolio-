const files = import.meta.glob('../../assets/thumbs/*.asset.json', { eager: true, import: 'default' }) as Record<string, { url: string }>;
const pick = (k: string) => files[`../../assets/thumbs/${k}.asset.json`]?.url;
export const thumbFor = (slug: string) => pick(slug);
export const videoFor = (slug: string) => pick(`video-${slug}`);
