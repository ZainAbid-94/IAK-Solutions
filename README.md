# IAK Solutions — Vercel deployment package

The approved five-page IAK Solutions website, prepared as a static website for Vercel. The design, company profile content and public phone number are retained. Touch Display/Screen and AI-Powered Voice Agent remain excluded.

## Deploy through the Vercel dashboard

1. Unzip this package.
2. Create a GitHub repository and upload **the contents** of the extracted folder. `vercel.json`, `package.json`, `scripts/` and `public/` must be at the repository root.
3. In Vercel, choose **Add New > Project** and import the repository.
4. Use these settings if the dashboard asks:

| Setting | Value |
| --- | --- |
| Framework Preset | Other |
| Root Directory | Repository root (`./`) |
| Build Command | `npm run build` |
| Output Directory | `public` |
| Install Command | Leave empty; no dependencies to install |
| Environment Variables | None required |

These deployment settings are supplied in `vercel.json`. Deploy the project and review its assigned URL before attaching the client domain.

An alternative, if you already use the Vercel CLI, is to run `npx vercel` from this folder for a preview deployment, then `npx vercel --prod` when ready to publish production.

## Connect the existing Hostinger domain later

Add the exact domain in the Vercel project's domain settings. Apply the DNS records that **Vercel shows for this project** in Hostinger's DNS management. Do not hard-code old example IP addresses or change email records. The domain stays registered with Hostinger and still needs renewal there.

## Local preview and checks

Requires Node.js 22 or newer. There are no third-party runtime dependencies.

```sh
npm run build
npm test
npm start
```

Visit `http://localhost:3000` after starting the local preview. Use `PORT` to choose a different port if needed. The local server supports clean routes like `/services` and custom 404 responses. It is a preview utility; Vercel serves the files directly from `public/`.

## What changed for Vercel

- Root-relative asset links and extensionless page URLs.
- Static deployment configuration and dependency-free build validation.
- Branded `404.html` page and `robots.txt`.
- Basic browser security headers and short asset caching.
- Local preview and route checks.
- Only `public/` is published; WordPress PHP files, source PDF and tooling are not part of the public output.

## Editing and client handover

This package does **not** include a WordPress dashboard or a client CMS. The client can update HTML files through their repository, which triggers a deployment when linked to Vercel, but that requires working with HTML. If they need visual, nontechnical editing, a CMS must be added as a separate step. See `EDITING-GUIDE.md` for the file map and current editing workflow.

Contact currently uses telephone links. There is no enquiry form, email sending service, authentication or database. The profile did not supply a real email address or full street address, so these have not been invented.

## Validation status

The build checks and local HTTP tests passed for all five pages, ten retained services, links and anchors, assets, clean URL redirects, custom 404 responses and public-file isolation. Browser visual QA was not available in this environment. A live Vercel deployment has not been made or verified. Confirm the deployed page layout, phone number and project permissions before client launch.

## References

- [Vercel project configuration](https://vercel.com/docs/project-configuration/vercel-json)
- [Vercel static custom 404 pages](https://vercel.com/kb/guide/custom-404-page)

Use the client's appropriate Vercel plan for their business website; this package does not change Vercel's plan eligibility or billing terms.
