# Extra lessons and progress

The Current Results navigation includes Extra Lessons, scoped to the selected student and academic year. Each lesson has a date, subject, topic, optional school course, tutor, duration and source. Tutor, duration, deadlines and completed counts may remain unknown.

Each homework item keeps its target, actual completed count, completion report and correction/review state separately. Reported completion is not verified completion, a correctness percentage or a school grade. Lesson entries do not enter academic calculations or published-result trends.

Owners can add lessons, edit progress, preview/import JSON, and attach up to 24 original PDFs/JPEGs/PNGs per lesson. Viewers retain read access only. Normal record ownership, relation validation, optimistic revisions and audited snapshots apply. Lesson imports use a stable per-student external identifier and skip existing entries instead of overwriting later progress. Existing result attachment limits remain 10.

Import envelope: `{"format":"child-journey-lessons","version":1,"lessons":[...]}`. The selected student and term are injected on preview; each lesson is validated against `lib/erp/lessons.ts`. Import files and real attachments belong outside the public source repository. Private evidence continues to use the existing D1 store and free-tier quota; this module needs no new service or database migration.

Validation: TypeScript, full domain/auth/evidence tests, production build, and authenticated live lesson import / attachment / reload checks. Synthetic lesson tests cover unknown values, invalid dates, inconsistent counts, cross-student/course links and deduplication.
