# University applications module

Implemented 29 October 2026 in the owner-private Child Journey Student ERP.

The `大學申請路線` navigation item opens a student-specific plan. `/#applications` selects it on load. No live student plan is created automatically.

## Planning and evidence

- 62 institutions: U.S. News 2027 National Universities through rank50 including ties (51), with Top30 filtering; QS2027 UK8 and HK3.
- Search, region filtering, shortlist and one chosen application round per institution. The institutional checklist, references, tests, late availability, notes and official source links remain visible. The original comparison workbook is downloadable.
- Entry year2027–2040; 2027 is a reference cycle, not an inferred graduation year. Later-year dates are projected reminders, clearly labelled unconfirmed. Dartmouth's January1/2 conflict remains visible. Current pages without a printed year were mapped to2026–27 in the research; programme-level exceptions still require checking.
- Suggested exploration, course selection, sustained work, testing, balanced shortlist and summer-output checkpoints. Backward planning per selected round: requirements120days, recommendations56days, draft42days, records28days, review14days, submission3days before, portal2days after. These buffers are family suggestions, not university rules.
- Optional custom dated milestones for tests, school deadlines, scholarship applications or projects. They are self-entered planning dates, not verified official requirements.
- Task owners, editable family dates, notes and completed states. Published reference deadlines cannot be changed via task overrides. Past foundation checkpoints are labelled for review, rather than counted as missed admissions requirements.
- Changing entry year resets task overrides and completion marks, retaining the shortlist and evidence. Shortlist changes retain task history; only current-route tasks enter the timeline/calendar.
- Experiences record role, date, total hours (nullable), action/outcome/reflection, source and planned/in-progress/completed status. Source-checked is explicitly a parent/student attestation, not independent authentication. No award quotas or admission probability is inferred.
- The CV text export excludes unfinished experiences; linked original academic results retain their original scale and source status. A CV is a preparation record; not all institutions accept a separate CV upload.
- Calendar export uses all-day reminders and excludes completed tasks. It does not assert an exact official cutoff time. JSON export contains current plan state, not evidence binaries or audit history. All exports include current on-screen edits even before save.

## Storage and boundaries

The new `applicationPlan` record kind uses the existing owner-scoped `erp_records` and revision mechanism. Its body contains studentId, entryYear, subject, targets, task overrides, custom milestones, experiences and selected academic record IDs. No new table or schema migration is required. Server validation rejects invalid dates, unknown school/round combinations, duplicate IDs, other-student academic links and invalid checked-evidence claims. Existing stale-edit protection and audit history apply. No student data is placed in localStorage or source control.

A single plan is presented per student, with a deterministic creation ID. Unsaved changes warn on leaving the module, switching student or unloading the page. Save errors remain visible. An archive/restore UI for plans and per-record upload controls are outside this addition; sources may reference existing private evidence or work locations.

## Research limits

The dataset is an institutional comparison with selected subject exceptions, not an exhaustive degree-course inventory. No complete ten-year programme-level AP mean/median/quartile dataset was found. CUHK's pooled2023–2025 lower reference ranges differ from its IB/A-level percentile table; Imperial's specific mean-AP disclosure says not held. The module does not turn minimum requirements, credit policies or scholarship thresholds into admission distributions.

## Verification

- TypeScript check; academic/reference/admissions domain tests and preserved concept tests.
- Synthetic localhost API test: `node tests/admissions-api.mjs`; authenticated save/read, custom milestone and evidence persistence, revision history, cross-origin and relationship rejection, invalid rounds, stale edits.
- Browser: shortlist Northwestern/Dartmouth, future-cycle warning, save/reload, evidence form and CV download. Responsive checks and release outcome recorded separately.

Production access stays owner-private. Synthetic QA records are stored only in the local development database, which is excluded from deployment.
