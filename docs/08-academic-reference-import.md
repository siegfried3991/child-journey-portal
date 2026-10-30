# Academic reference import

The private portal stores reviewed source data in D1 and unchanged evidence files in R2. Personal report contents and attachments are uploaded at runtime; they do not enter the source repository, static assets, or deployment archive.

## Records and presentation

The import creates the student, school-year containers with unknown calendar boundaries, courses, individual dated assignments, and a `report` record containing the complete reviewed reference dataset. The report library displays historical quarter/final marks, primary-school grades, current school snapshots, handwritten progress, MAP assessments, summer mastery ratings, and provenance. Category summaries and handwritten progress are not assignments and do not enter weighted grade calculations.

Course credits and category weights accept `null`. Unconfirmed policies never calculate an overall course grade. A numeric result retains its source letter grade. A blank score uses the distinct `unknown` status, with its maximum preserved. Dates explicitly estimated by the parent retain that status in the report dataset and interface.

## Server configuration

- `ERP_WORKSPACE_ID`: stable private workspace namespace for the imported records.
- `ERP_WORKSPACE_EMAIL`: verified owner email granted access to that workspace after ordinary Sites sign-in. Other signed-in users retain their original user-scoped storage. The workspace namespace remains stable if the owner's membership address needs updating.
- `ERP_IMPORT_KEY`: secret used only by the import service. Keep in Sites runtime secrets and send through a request header; never include it in client code or source files.

The database was verified empty before this workspace mapping was introduced. No existing user-owned data was reassigned. Sites audience remains owner-only. Existing browser routes continue to require signed-in identity and same-origin writes.

## Service

`POST /api/academic-import` accepts the reviewed JSON reference using `X-ERP-Import-Key`, in addition to the existing Sites service-access boundary. It validates and constructs the complete record batch before writing. Fixed record IDs make an exact retry idempotent. If an existing imported record differs, it refuses to overwrite revisions. All created records have audit entries.

The same endpoint accepts a multipart `sourceId` and `file`. Each upload must match the expected SHA-256 and byte length; IDs also make file retries idempotent. Files attach to the report-library record, and assignment detail links to the corresponding source attachment. `GET /api/academic-import?verifyFiles=1` verifies stored file checksums and returns the imported records for reconciliation. It requires the import secret.

## Validation

Run the academic and reference domain tests, TypeScript checking, a production build, and local API/browser checks. Verify unauthorized imports are rejected, repeated imports skip existing records, changed imports refuse to overwrite edits, and checksum mismatches are rejected. After deployment, reconcile every live record with the expected converted dataset and every R2 file with its source hash. Native deployment success and live database/file reconciliation are recorded separately from browser sign-in verification.

## Later school reports

`POST /api/school-report` accepts a reviewed `patch` JSON file and matching original PDF through the signed-in, same-origin owner's interface. It checks the student number, source hash/size, reference revision and course/student/year relationships before saving. Existing snapshots, assignments and handwritten evidence remain in the report record. The full quarter table and comments use `published_course_results`; future periods remain absent. The importer updates only the course's school-published fields and original title/teacher/level, retaining course IDs, category policies and assessment records; an additional official course can be created. All record edits use ordinary revision history.

Steps save report, source attachment and course updates separately. If interrupted, refresh and retry the same files; identical records/files are skipped, source-ID collisions with different content are rejected. The UI reports partial completion as a retryable state rather than claiming an atomic import. Reviewed student payloads and PDFs belong outside the source checkout and are uploaded only to private runtime storage.
