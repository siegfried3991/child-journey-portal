# Verification results — 20 October 2026

## Passed

- JavaScript syntax check for `dist/app.js`.
- Eight Node domain/data tests: low result prompts support without disqualification; uncertain interest prompts exploration; capacity reduces task; invalid/missing scores are rejected; simultaneous reasons retained; original grade scales preserved; duplicate/unknown observations do not inflate coverage; 50 unique skills and 15 families.
- In-app browser desktop check at 1280 × 900: classroom/home scene changes; homework completion updates remaining count; examination filter retains the original 34/40; evidence detail displays context; skill grid contains 50 cards and evidence filter contains 12.
- Scenario interaction: minimum sample score + uncertain interest + low available time shows all three reasons. Choosing route B requires the local review action; the revision retains the score/action and scenario values persist after selection. This is a fictional choice, not a real education decision.
- Career exploration: 15 family cards load; adding a trial changes its button to “已加入體驗清單”. The official-major-group index and coverage statement are available separately.
- All six portal views at 390 × 844 had document width equal to viewport width (390): no page-wide horizontal overflow. The academic table scrolls within its own container.
- Home at 360 × 800 had document width 360. Research report at 360 loaded five main sections and three expandable investigations with document width 360.
- Report source-investigation navigation opens the corresponding details element. Report can be read without an app backend.
- Browser console returned no captured error/warning entries at the final check.
- Desktop and mobile dashboard screenshots saved and desktop visual layout inspected. Temporary viewport override reset.
- ILO research review validated 43 distinct illustrative ISCO-08 unit codes and tightened role labels. This covers 8 of 10 major groups; groups 9 and 0 have no specific occupation card. All 10 appear in the reference index.
- The evidence specification includes all 50 ability IDs once, matching the catalogue.

## Not tested / not implemented

Physical iOS/Android WeChat, mainland network reachability, actual authentication, family-level authorisation, production database/storage, school imports/integrations, complete taxonomy ingestion, actual recognised awards, individual admissions requirements, backup restore, PDF print pagination and full accessibility audit. Responsive desktop testing is not WeChat certification.

The prototype intentionally keeps all mutations in memory and resets on reload. No actual child's records were used. Publication state is reported separately after deployment; these checks establish the local concept, not a secure production student-record system.
