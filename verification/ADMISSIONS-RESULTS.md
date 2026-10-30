# Admissions module checks — 29 October 2026

- TypeScript: passed.
- Domain tests: 30 academic/reference/admissions tests plus 8 preserved concept tests passed (38 total). Admissions tests cover catalog/round consistency, future-year estimates, fixed official reference deadlines, backward dates, honest CV export, ICS line folding and completion exclusion, validation, student relationships and custom milestones.
- Synthetic localhost API: passed authenticated save/read, evidence and custom milestone persistence, revision history, cross-origin rejection, invalid student/academic references, invalid application rounds and stale revision rejection.
- Browser on localhost: selected future intake2030 and Northwestern/Dartmouth regular rounds for a synthetic QA student; saved and reloaded; confirmed evidence form adds a completed experience and saved CV export contains source status. Added a personal deadline and confirmed saved date2029-08-15.
- Browser layout: desktop and390px mobile screenshots in verification/admissions; mobile viewport390px and document width390px (no horizontal overflow). Temporary viewport reset.
- Browser date input: native ISO setValue succeeded; generic locator fill did not populate the date input on this IAB backend. Form correctly rejected the empty date and accepted the valid native input.
- No real student plan was automatically created or altered. Synthetic QA records remain confined to the local development database and are excluded from source and deployment.
- Production publication is verified separately by the Sites deployment terminal response.

Coverage limits: current institutional research plus selected course exceptions, not a complete degree inventory. No invented historical AP distributions or admission probability. Later entry-cycle dates remain estimates.
