# Implementation and operations

## Runtime and storage

React/TypeScript use the official Sites Vinext starter and Vite. Cloudflare Worker routes validate requests and use platform-provided identity. D1 stores typed record envelopes and revisions; R2 stores evidence. No student data is in Git or localStorage.

This follows the existing Sites environment and replaces the earlier concept's proposed PostgreSQL baseline with D1. A future regional deployment can replace storage adapters, but needs its own authentication. Keep domain validation/calculation independent of transport.

| Table | Purpose | Constraints |
|---|---|---|
| erp_records | Typed JSON records and indexed parent context | Record ID, owner-scoped dedupe, revision |
| erp_changes | Revision snapshots | Unique record/revision; owner-scoped retrieval |
| erp_attachments | File metadata and opaque R2 key | Owner/result validation |

JSON bodies use Zod schemas. References are application-validated, not SQLite foreign keys. Student/term/course links cannot change after creation. Used category IDs cannot be removed. For school-wide scale, introduce dedicated relational tables, database references and pagination. This release explicitly errors beyond 10,000 records per account; it is a family ledger, not a school SIS.

## Internal endpoints

- GET `/api/erp`: owner-scoped snapshot, private/no-store.
- GET `/api/erp?history=<recordId>`: owner-scoped history.
- POST `/api/erp`: save/archive/import/demo.
- POST `/api/attachments`: multipart recordId/file.
- GET `/api/attachments/<id>`: ownership-checked download, attachment disposition, nosniff and restrictive CSP.

All require identity; mutation origin is checked. The production gateway must strip client-supplied identity headers and inject trusted ones. The starter's local mock strips spoofed headers and works only on localhost. No client-side service credentials are used.

Creation and audit insertion share a transaction. Imports validate first, then use one D1 batch. Updates use expected revisions; stale updates fail. R2 upload precedes metadata insertion; metadata failure attempts to remove the orphan. Attachment deletion UI and attachment revision history are not implemented.

## Current operational boundaries

Owner-private deployment is retained. Changing Site audience does not itself confer shared ownership of student data. No public integration API, webhook or revision-system service account is enabled. No offline writes/cache; failure is shown with retry.

No automatic full backup, recovery UI, retention service or account deletion workflow has been added. JSON export excludes history and binaries. These operational features need explicit design before a wider rollout. File signature validation is not malware scanning.

Mobile HTML is implemented; actual WeChat authentication/upload/download and regional network checks remain outstanding. This is not a Mini Program.

## Release procedure

1. Open the existing managed source checkout and preserve project ID and audience.
2. Run TypeScript/domain/API checks and desktop/mobile UI checks with synthetic data.
3. Generate/review/apply migrations locally. Deployed migrations are immutable.
4. Build using the Sites helper; package Worker, migration and binding declarations together.
5. Commit/push exact source and deploy its matching archive. Pending/building/publishing is not completion.
6. Keep local databases, uploads, credentials and QA state excluded. Distinguish deployment success from authenticated production write testing.

## Revision-system contract: proposal only

Outgoing task: student_id, course_id, assessment_id, stable topic_id, task type, due date, creator and approval. Returned practice attempt: independent ID, external-system ID, timestamp, source and idempotency key. Never overwrite school grades. Inspect the existing system before implementing; current free-text topics are mapping placeholders.
