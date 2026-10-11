<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Portfolio architecture
- Keep projects, case-study sections, exact resource URLs and contact identity in src/data so content is editable without layout changes.
- Render all case studies through the validated TanStack /projects/$slug/ route; each known slug has SSR content and unique metadata while unknown slugs return not found.
- Use src/data/site.json and VITE_PUBLIC_SITE_URL as the single public-domain configuration; regenerate sitemap/robots with scripts/generate-seo.mjs when it changes.
- Shared navigation, contact links and accessible motion live in portfolio components; never add a database or sign-in for this public portfolio.
- Keep authentic uploaded portraits as asset pointers and generated art as imported assets; preserve photo identity, and only use 2D parallax until a real rigged model exists.
- Keep the entrance in a shared homepage-only layer with a manually drawn articulated SVG character and one requestAnimationFrame timeline updating SVG nodes directly; shared hand/curtain coordinates keep grips synchronized without per-frame React rendering.
- Keep uploaded homepage walkthroughs in a reusable responsive video component with original MP4 and WebM fallback sources for browser compatibility; resolve uploaded project thumbnails through the shared asset lookup so cards and case-study pages stay consistent.
- Flash AI is a single-session, unsaved chat that streams from a server route grounded only in src/data, which keeps token cost low and prevents invented claims.
