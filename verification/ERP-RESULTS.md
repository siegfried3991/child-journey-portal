# ERP verification — 26 October 2026

Scope: Phase 1 school-academic implementation, local synthetic records only.

## Completed checks

- TypeScript check passed.
- 17 academic-domain tests passed: weighting, unequal denominators, incomplete categories, confirmed policies, zero/non-numeric/unreviewed/archived records, grade thresholds, validation, parent relations, category removal, duplicate detection, CSV parsing/preview and formula-neutralised export.
- 8 preserved concept-domain/data tests passed after moving the original demonstration to `public/concept`.
- Initial schema migration applied successfully to local D1.
- API smoke checks passed: anonymous rejection, spoofed identity-header rejection, cross-origin rejection, record creation, duplicate rejection, correction, stale-edit conflict, invalid parent rejection, archive/restore, preserved historical zero score, atomic import, PNG round-trip, owner download, anonymous download rejection, missing-file rejection and invalid-format rejection.
- Browser checks: empty onboarding, explicit example creation, course overview/gradebook, manual result entry, correction with history, CSV preview and duplicate exclusion, import confirmation, and reload persistence.
- Desktop and 360px/390px mobile screenshots inspected. Page width equals viewport width at both mobile sizes; the assessment dialog stays within the screen. No browser error/warning logs were captured in the checked session.

## Release boundaries

Local mock identity and synthetic storage checks do not prove production authentication on every device. Physical WeChat iOS/Android, mainland/HK networks and multi-user collaboration have not been tested. No existing school account was connected; no real child results were imported. No formal security audit, malware scan, backup/restore drill or high-concurrency load test has been performed.

The static concept remains available as prior research; only the ERP academic module is implemented in this release. Deployment completion is reported separately from the native Sites deployment result.
