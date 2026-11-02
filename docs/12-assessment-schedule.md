# Assessment schedule

Current Results → Assessment Schedule is a date-grouped list of forthcoming quizzes, tests, exams and LEQs. The learning home shows the next ten scheduled entries for the selected student and term. Upcoming includes today in Asia/Shanghai, excludes cancelled/taken events, and leaves past dates in the history filter without assuming an exam occurred.

Owners can create or edit dates, subjects, titles, types, scope, notes, source, preparation state and schedule state. Viewers only read. Batch JSON preview validates all rows, injects the selected student/term and skips existing stable identifiers. The backend dedupe key includes student and term and is protected by the existing unique constraint. Ownership, immutable student/term references, optimistic revisions and saved audit snapshots use the shared ERP record infrastructure.

Scheduled assessments are a separate record kind, with no score or grade fields. They never contribute to school results or trends. Unknown scope and preparation remain unfilled/unmarked; no clock time or notification is invented. The existing free Workers/D1 services suffice without a migration. Private import files stay outside the source repository.

Tests cover invalid dates, rejecting score fields, date boundaries in Shanghai, active/cancelled/taken/past filtering, student/term isolation and deduplication. Validation includes TypeScript, full tests, production build and authenticated live persistence checks.
