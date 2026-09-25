# AUXUZ V3

Premium customer acquisition and automation website for a broad range of modern businesses.

## What changed
- Repositioned for all business niches; no interior-design-specific copy.
- Added a lightweight Three.js hero visual with mobile-safe pixel ratio, reduced geometry and reduced-motion support.
- Navigation now routes to dedicated pages instead of same-page anchor jumps.
- Added Solutions, Services, How It Works, About, Contact and Thank You pages.
- Reworked mobile layouts so content stacks instead of collapsing or disappearing.
- Removed payment language/workflows. No payment is required to submit an enquiry.
- Contact forms submit to FormSubmit and email `contact.auxuz@gmail.com`. The first submission may require email confirmation on FormSubmit.
- If Supabase credentials are configured, the same enquiry is also stored in the CRM. Email submission remains independent so the website can work before CRM setup.
- Kept legal pages and robots.txt.

## Run
```bash
npm install
npm run typecheck
npm run build
npm run dev
```

## Form delivery
The contact form uses FormSubmit's AJAX endpoint. FormSubmit documents this as a no-backend form endpoint that emails submissions to the configured address. The first use requires confirming the receiving email address.

## Three.js performance
The hero uses a small procedural scene rather than models/textures/post-processing. It caps device pixel ratio and uses fewer nodes on mobile. This is intentional: visual impact without turning the landing page into a GPU benchmark.

## Supabase
Optional. Add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Then run the existing schema in `supabase/schema.sql`.
