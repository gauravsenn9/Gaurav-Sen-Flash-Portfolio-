import {readFileSync,writeFileSync} from 'node:fs';
const site=JSON.parse(readFileSync(new URL('../src/data/site.json',import.meta.url)));
const projects=JSON.parse(readFileSync(new URL('../src/data/projects.json',import.meta.url)));
const domain=(process.env.VITE_PUBLIC_SITE_URL||site.publicUrl).replace(/\/$/,'');
const paths=['/','/projects/',...projects.map(p=>`/projects/${p.slug}/`)];
writeFileSync(new URL('../public/sitemap.xml',import.meta.url),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.map(p=>`\n  <url><loc>${domain}${p}</loc></url>`).join('')+'\n</urlset>\n');
writeFileSync(new URL('../public/robots.txt',import.meta.url),`User-agent: *\n${process.env.VITE_SITE_NOINDEX==='true'?'Disallow: /':'Allow: /'}\nSitemap: ${domain}/sitemap.xml\n`);
console.log(`Generated SEO for ${paths.length} pages at ${domain}`);
