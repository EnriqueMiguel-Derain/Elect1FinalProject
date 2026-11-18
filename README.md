# Pyesa — Smart Parts. Better Builds.

Pyesa is an individual frontend capstone project for electronics hobbyists, students, and first-time PC builders. It helps users browse computer and electronic parts, track what they own, plan a PC or circuit project, and keep their account inventory organized.

## Technology

- React 19 for the application shell, reusable page components, route state, and event handling
- Vite 7 for local development and production builds
- Tailwind CSS 4 for responsive utility styling, alongside the existing Pyesa design system
- HTML5, CSS3, and modern JavaScript modules
- Supabase Auth and Postgres for optional hosted accounts and per-user data
- Git and GitHub for source control

The current migration keeps the existing feature controllers while React owns the page shell and navigation state. This preserves the working catalog, cart, inventory, account, PC Builder, and Circuit Builder during the move to React.

## Run locally

Install Node.js 20.19+ or 22.12+, then from the project folder:

```bash
npm install
npm run dev
```

Vite prints the local URL. For a production build and local preview:

```bash
npm run build
npm run preview
```

## Supabase setup

1. Add the project URL and publishable key to `js/supabase-config.js`.
2. Run `supabase/setup.sql` in the Supabase SQL Editor.
3. Enable email/password sign-up in Supabase Authentication settings.
4. Set the allowed site and redirect URLs to the local development URL and the deployed domain.

The account balance is a demo value, not a payment method. Never put a Supabase service-role key in this frontend project.

## Project structure

| Path | Purpose |
|---|---|
| `index.html` | Vite document entry |
| `src/main.jsx` | React root |
| `src/App.jsx` | React application shell, reusable page component, route state |
| `src/index.css` | Tailwind entry and existing design stylesheet |
| `legacy-site.html` | Static page markup retained while feature controllers are migrated |
| `js/` | Catalog, inventory, cart, account, builder, and settings feature modules |
| `public/data/catalog.json` | Catalog data and reference links |
| `public/img/` | Local brand assets |
| `supabase/setup.sql` | Account data table, row security, and account creation trigger |
| `docs/PROJECT_DOCUMENTATION.md` | Capstone documentation and evaluation checklist |

## Main features

- Searchable catalog with category and price filters, part details, images, and price references
- Account sign-up/sign-in with per-account inventory, cart, and demo balance when Supabase is configured
- Shopping cart and checkout
- Inventory tracking, return/sell, delivery, comments, and PC/circuit set assembly or disassembly
- PC Builder packages and complete circuit kits, including needed-part indications
- Responsive navigation, settings, form validation, dialogs, and action feedback

## Data and acknowledgements

Catalog records include product reference URLs where available. The website credits BuildCores OpenDB and its CC BY-NC-SA 4.0 license for the PC part specifications it uses. Supabase, React, Vite, Tailwind CSS, and Google Fonts are third-party resources; see `docs/PROJECT_DOCUMENTATION.md` for references.

## Deployment

The repository includes a Vercel build setup through `package.json` and `vite.config.js`. Configure the Vercel project to install dependencies, run `npm run build`, and publish `dist`. Add the Supabase URL and allowed redirect domains before enabling production sign-in. Check that the deployment points to the latest pushed commit after publishing.
