# Gaurav Sen — Flash portfolio

Updated from the supplied source ZIP and Gaurav_Sen_Cspo_Resume.pdf on 11 October 2026.

## What is included

- 15 individual project pages, including the completed WhatsApp Directory overview.
- All 67 files found across the 15 project folders linked to their corresponding project pages; the original 64 URLs are preserved.
- Three additional prototype destinations extracted from source documents (current availability not independently verified).
- Latest supplied resume hosted locally at `/resume/Gaurav_Sen_Cspo_Resume.pdf`.
- Career history, education, certifications and skills taken from that resume.
- 23 bundled media files: portraits, branded project thumbnails, sharing image and walkthrough videos. These no longer depend on Lovable-only asset URLs.
- Existing Flash entrance, lightning cursor, light/dark mode and motion controls retained.
- LinkedIn, email and Topmate links retained.

## Important: this is not a WordPress theme

This source is a React / TanStack Start application. It runs on Node.js or an appropriate deployment adapter. It cannot be uploaded through WordPress Appearance → Themes, and it is not visually editable in Elementor. Native Elementor editing requires a separate WordPress rebuild. Do not upload this package into a WordPress installation expecting it to become a theme.

## Quick start

Use Node 22.12 or newer (tested on Node 24).

```sh
npm ci
npm run dev
```

Production:

```sh
npm run build
npm start
```

The start command runs `.output/server/index.mjs`. The host can supply `PORT`.

## Upload to GitHub

1. Download and extract this ZIP.
2. Create an empty repository, or back up your existing source before replacing it.
3. Upload the extracted files and folders, not the ZIP itself. `package.json` must appear at the repository root.
4. If browser upload limits are reached, upload folders in batches or use GitHub Desktop to add the extracted folder and publish the repository.
5. Include `public/media`, `public/resume`, `src`, `scripts`, configuration files and `package-lock.json`. Do not upload `node_modules`, `.output`, real `.env` files or API keys.

This package does not include a GitHub remote or publish anything to your account. You do not need a new repository if you intend to update the same application; a separate repository is safer if your existing one powers another live site.

## Hostinger Node.js hosting

Use a plan with Node.js Web Apps support, not the WordPress theme uploader.

- Connect the GitHub repository or use Hostinger's Node.js ZIP import.
- Choose a compatible Node version (22.12+; Node 24 recommended if available).
- Install: `npm ci`
- Build: `npm run build`
- Start: `npm start`
- If asked for the entry file: `.output/server/index.mjs`
- Set `NITRO_PRESET=node-server`.
- Set `VITE_PUBLIC_SITE_URL` to your actual HTTPS domain **before building**.
- Set `VITE_SITE_NOINDEX=true` for staging; remove it for the public launch and rebuild.

The exact Hostinger account workflow depends on the plan. Hostinger deployment has not been executed here. Official guide: https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/

The default public URL remains the supplied Lovable address because no final custom domain was provided. Replace it in the hosting environment or `src/data/site.json`; rebuilding updates canonical URLs, robots and sitemap.

For Vercel, set `NITRO_PRESET=vercel` and use the appropriate server deployment workflow. The Node build was tested; the Vercel adapter was not tested. Do not deploy `.output/public` alone: project routes need server rendering.

## Edit content

- `src/data/profile.json`: resume-based career, education, certifications and skills.
- `src/data/site.json`: contact, booking, resume and default domain.
- `src/data/projects.json`: project narratives, labels and resource links.
- `src/styles.css`: theme and responsive styles.
- `public/resume/Gaurav_Sen_Cspo_Resume.pdf`: replace using the same filename to update the downloadable CV.
- `public/media`: bundled photos, thumbnails and videos; corresponding asset JSON files reference these local URLs.

WorkRadar remains a portfolio-stage concept with a prototype, not a claim of production adoption. WhatsApp findings explicitly reflect the small survey sample. Resume claims are user-supplied, not independently employment-verified.

## Optional Flash AI

Flash AI is hidden by default because an external GitHub deployment has no Lovable API credential. To enable it, configure a server-only `LOVABLE_API_KEY` and build with `VITE_ENABLE_FLASH_AI=true`. The route now includes the supplied resume data as well as the case studies. Its inherited Lovable gateway/model configuration has not been live-tested; confirm access and add hosting-level rate limits before enabling a public paid endpoint. The portfolio does not require AI to function.

## Verification in this update

- Production Node build passed.
- TypeScript check passed.
- Four existing automated tests passed, updated for 70 resources total.
- Homepage, project index, all 15 case studies and the resume returned HTTP 200 from the production server.
- Unknown project returned HTTP 404.
- All 23 downloaded media files matched source-declared byte sizes.
- 67/67 project source files had anyone-with-link reader permissions at the time checked. No sharing permissions were changed.
- Readable text retrieved from 50 documents; one additional scanned survey was OCR processed and its interface chart visually reviewed. The remaining 16 non-text files are linked and access-checked, not claimed as fully viewed/transcribed.
- Browser visual QA could not run because the browser download failed in this environment. No new Lighthouse, animation playback or mobile screenshot results are claimed.

See `docs/drive-audit.json` and `docs/runtime-checks.json` for the checks. Original source-document copies and research respondent details are not bundled; the website links their existing Drive viewers.
