# 成長志 · Student Development ERP

A web portal for keeping school results, source evidence and learning progress in one private student record. The portal supports **US-style school records**, school-published results, subject trends from Grade 7 onward, and a customizable US/UK/Hong Kong admissions planner. Full activity, achievement and revision-system management remain planned modules.

This repository publishes the **source code only**. It includes fictional examples and synthetic test fixtures. Real student records, report cards, uploaded photographs, storage contents, runtime credentials and the deployed Site identity are excluded. No GitHub Pages website is configured.

## Implemented features

- Student profiles, academic-year/term containers and courses, including unknown dates, credits and category weights.
- Homework, quizzes, tests, exams, projects and class participation, with original numeric scores, letter grades and comments.
- Editable category weights and total-points or equal-percentage calculations; unconfirmed rules withhold the overall calculated grade.
- Separate graded, pending, missing, absent, exempt and score-not-shown states. A blank score remains blank.
- Report library for historical quarter/final grades, current snapshots, handwritten progress, MAP RIT/percentile records and summer mastery ratings.
- School-published quarter/year-end results, original report attachments and teacher comments, kept separate from calculations.
- Clickable subject trends with Grade 7/8/9 annual summaries and quarter drill-down. School-reported subject YTD takes priority; otherwise the simple mean of available quarters is labelled as calculated. Split English courses share earlier English history.
- US/UK/Hong Kong admissions routes with common preparation in Grades 9–10, later branching, editable milestones, university comparisons and source-linked timelines. Future-cycle dates remain estimates.
- Explicit estimated dates and parent-confirmed corrections in imported reference data.
- Source-linked attachments, checksum-verified reference uploads, source-photo deduplication and repeat-safe imports.
- Teacher feedback, next steps, topics, comparable-assessment charts and CSV preview/export.
- Revision history, correction reasons, stale-edit protection, archive/restore and owner-scoped storage.

The original game-inspired concept and source-backed ILO/Hong Kong QF research remain under `public/concept/`, `docs/` and `research/`. The ERP uses ordinary web interfaces; no game engine is required.

Download the current source using GitHub’s **Code → Download ZIP**. The obsolete initial snapshot archive and its expansion workflow have been removed.

## Stack

React, TypeScript, Vinext, Vite, Zod, Cloudflare Workers, D1 and R2. Node.js 24 is used for development. Dependencies are locked in `package-lock.json`.

## Run locally

```sh
npm ci
cp .dev.vars.example .dev.vars
npm run build
# First database setup only; do not replay an applied migration:
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_clammy_iron_man.sql
npm run dev -- --port 5174 --hostname 127.0.0.1
```

The documented portable development profile uses a localhost-only mock identity. The first local sign-in starts with an empty database. The example button creates a separate fictional student. The import-service example configuration is for local development; replace placeholders before use and keep `.dev.vars` untracked.

## Checks

```sh
npx tsc --noEmit
node --experimental-strip-types --test tests/academic.test.ts tests/reference.test.ts tests/admissions.test.ts tests/routes.test.ts tests/school-report.test.ts tests/subject-trends.test.ts
node --test verification/domain.test.mjs
# Requires the localhost preview at port 5174; creates synthetic test records:
node tests/api-smoke.mjs
```

The 50 domain tests cover admissions routes, school-report imports, subject annual/quarter trends, as well as weighting, blank scores, preserved letter grades, relationship validation, duplicates, CSV parsing, deterministic imports, source references and estimated dates. The eight preserved concept tests cover its fictional data and exploration rules.

## Independent full private deployment

A GitHub-to-Cloudflare deployment path is prepared in [deployment/README.md](deployment/README.md), including a separate signed-JWT authentication boundary and a deployment workflow disabled until account configuration is complete. It requires a new Cloudflare account, a free D1 database and Access setup. The existing private portal continues running separately; live data migration is not yet performed. The standalone free profile stores small private attachments in D1 (10 MB per file, 64 MB evidence budget) without an R2 subscription.

## Production hosting

This is a full-stack application. GitHub stores the code; GitHub Pages cannot provide its Worker APIs, authentication, D1 database or R2 evidence storage.

For a new Sites deployment, register your own private Site and add its assigned `project_id` to `.openai/hosting.json`, preserving the D1/R2 binding names. This source snapshot deliberately has no live project ID. Production requires the Sites gateway to validate sign-in and inject trusted identity headers. Never expose this Worker on another host while trusting arbitrary client-supplied identity headers; a different host needs its own authentication adapter.

Store server configuration and secrets in the hosting platform. Do not commit data exports or evidence. The reference import service requires its separate server secret in addition to the hosting access boundary. Follow [reference import operations](docs/08-academic-reference-import.md).

## Project guide

| Path | Purpose |
| --- | --- |
| `app/` | Portal interface, report library and API routes |
| `lib/erp/` | Validation, calculations, reference conversion and storage operations |
| `db/`, `drizzle/` | D1 schema and immutable migrations |
| `tests/` | Synthetic domain and API checks |
| `docs/05-erp-structure.md` | ERP structure and phase boundaries |
| `docs/06-academic-module.md` | Academic rules and acceptance criteria |
| `docs/07-erp-implementation.md` | Runtime, identity and release operations |
| `docs/08-academic-reference-import.md` | Evidence-linked import workflow |
| `docs/09-university-applications.md` | Admissions planning, dates and research boundaries |
| `research/` | ILO, Hong Kong qualifications and platform investigations |
| `public/concept/` | Preserved fictional concept and research report |

## Current limits

No school-portal auto-sync, OCR, GPA conversion, drop-lowest/extra-credit engine, teacher collaboration, full backup/restore UI or automatic revision-system synchronization is implemented. Standardized-assessment and summer records can be viewed in the report library; their full ERP management modules are reserved for later development.

Official grades remain separate from calculated values. Marks do not become a general ability, ethics or career-suitability score. ILO occupations and Hong Kong qualifications support future exploration; the app does not award recognized credentials.

Responsive mobile HTML is implemented. Physical iOS/Android WeChat authentication and file handling, mainland/Hong Kong connectivity, full accessibility and security audits, and recovery drills still need validation. This is not a WeChat Mini Program.

## Third-party material

Package dependencies retain their own licenses. Existing notices for vendored assets and the Sites integration are preserved, including `vendor/shadcn-tailwind-4.13.0.LICENSE.md` and `scripts/vite/sites-vite-plugin.LICENSE`. No art or engine code from the games that inspired the concept is included. No additional project license is selected by this publication.
