# Implementation and delivery plan

Version: 20 October 2026. Audience: family sponsor, product designer and implementation team.

This document separates the reviewable demonstration from the proposed service that would hold actual student records. The demonstration is not a production record system.

## 1. Current demonstration and production decision

| Area | Demonstration | Proposed production service |
|---|---|---|
| Interface | Buildless HTML, CSS, SVG and JavaScript in `dist/` | TypeScript, React and Vite |
| Data | Fictional sample records; browser memory only | PostgreSQL with authenticated family access |
| Changes | Temporary; refresh restores the demonstration | Validated writes, audit events and backups |
| Files | Sample information only | Private object storage with controlled downloads |
| Hosting | Private Sites review target; actual publication state is reported separately | Region-selected HTTPS application, API, database and storage |
| Purpose | Review the dashboard, education records, exploration and route changes | Reliable day-to-day tracking across authorised devices |

No game engine is required. Use SVG for simple scenes, portraits and map elements; keep text, tables, forms and charts in ordinary web interface components. A future Phaser scene may receive display data through an adapter, but it must never become the owner of grades, assessment rules, permissions or plans. The design language can be inspired by strategy games while using original artwork and interaction details.

Recommended development environment: a supported macOS, Windows or Linux workstation; Git; Node.js 24 LTS; npm with a committed lockfile; editor and browser developer tools. Use TypeScript for client, API contracts and domain logic, SQL for migrations and permissions, and HTML/CSS/SVG for the interface. Pin exact package versions at project initiation and update deliberately. Node 24 is currently LTS; Vite documents minimum Node versions below it. [Node releases](https://nodejs.org/en/about/previous-releases), [Vite guide](https://vite.dev/guide/).

React + Vite is a deliberate fit for a private dashboard without public search-engine requirements. React's own guidance explains that a build-tool setup leaves additional framework decisions to the application. If requirements later include extensive server rendering, reassess that choice rather than adding complexity prematurely. [React build guidance](https://react.dev/learn/build-a-react-app-from-scratch).

## 2. Production architecture and repository structure

```text
Mobile/desktop browser, including tested WeChat browsers
                     |
             HTTPS application
                     |
           authenticated Node API
             /       |       \
    PostgreSQL   private files   job worker
             \       |       /
         authorisation and audit events
```

A managed backend can replace individual components if its deployment region, access controls, contracts, backups and export facilities meet the requirements. Supabase is one candidate; a regional Node/PostgreSQL/private-object-storage deployment is another. Do not select a cloud region solely from where its website is hosted: database, files, backups, logs, support access and optional AI processing all matter.

Recommended future structure:

```text
apps/
  web/                    React interface, mobile navigation, charts and scenes
  api/                    authentication integration, validated API, file access
  worker/                 imports, approved extraction and scheduled reviews
packages/
  domain/                 grades, observations, route rules and versioning
  contracts/              request/response schemas shared by client and API
  ui/                     reusable accessible interface components
  reference-data/         versioned official classifications and source metadata
db/
  migrations/             schema, constraints and authorisation policies
  tests/                  family isolation and transaction tests
tests/
  journeys/               end-to-end user workflows
  fixtures/               synthetic records only
docs/                     product, data, operations and source documentation
infra/                    deployment templates and environment examples
dist/                     generated release output; current buildless demo
```

Do not overwrite the current concept demonstration until the production implementation has equivalent reviewable journeys. Use separate development, staging and production environments and distinct credentials. Production backups and private attachments must never enter a repository, build artifact or public preview.

Core entities should include family, membership, student, school enrolment, curriculum, course, assignment, submission/attempt, assessment result, observation, evidence, interest, activity, taxonomy version, proposed mapping, pathway requirement, route version, review decision and audit event. Preserve an official requirement's source URL, applicable intake, checked date and status independently of the student's progress.

The domain layer must distinguish participation from competence, an observation from a certified qualification, and a possible route from an admission promise. A new result may raise a review suggestion; it must not silently change the child's active goal.

## 3. Family isolation, access and storage

Every student-owned row belongs to a family and student. A server verifies membership for every operation. The database must also enforce row access or an equivalently tested policy; a hidden button or difficult-to-guess identifier is insufficient. Shared occupational/qualification reference data can be globally readable, while family-created mappings and notes stay within their authorised scope.

| Role | Initial scope | Restrictions |
|---|---|---|
| Family owner/guardian | Manage own family, invite members, enter records, approve sharing and exports | No access to another family; administrative privileges do not cross tenants |
| Student | Read agreed records, state interests, add reflection and propose changes | Cannot alter teacher-issued marks or source requirements; visibility is explained |
| Invited mentor | Explicitly shared student and record categories, optionally time-limited | No family-wide access by default; no invitation or role administration |
| Service operator | Operational metadata normally; exceptional support access only when justified | Separate privileged account; logged, limited and revocable access |

For the first private family pilot, an adult owner with manual entry is sufficient; implement independent student and mentor accounts only when their permission model is complete. A child-view switch inside the parent's authenticated session is presentation, not an independent security boundary. Do not describe a reflection as private from parents unless the actual policy and implementation support that promise.

Memberships require revocation and expiry where applicable. Enforce least privilege for privileged keys, restrict service accounts, use parent MFA where available, rate-limit authentication and support secure recovery. Prefer secure same-origin session handling; never put long-lived access tokens in shared URLs. Validate file access again when issuing short-lived download links.

Files use private buckets, non-identifying object keys, a metadata record linked to the student, upload size/type limits and a malware-handling policy. Logs should contain record IDs and operational status rather than homework text, grades, names or access tokens. Define retention, deletion including backup expiry, encrypted transport/storage, key handling and incident response. Export must include evidence files as well as database records.

If Supabase is selected, enable and test row-level security on exposed tables and separate storage policies. Its documentation explains that table grants and policies both affect access and that storage requires its own controls. Merely enabling authentication does not make every record private. [Database security documentation](https://supabase.com/docs/guides/database/postgres/row-level-security), [storage access controls](https://supabase.com/docs/guides/storage/security/access-control).

## 4. Getting reliable records into the portal

Start with manual entry and an agreed CSV template. Record the original grade, maximum/scale, assessment type, date, course, teacher/source, weighting if known, and whether a mark is provisional, final or corrected. Missing is different from zero; submitted is different from marked. Never combine different exam systems or incomparable assessments into a misleading average.

The import workflow is:

1. Select student and source; upload only the intended document or file.
2. Parse into a preview with original rows/pages and suspected duplicates.
3. Show each proposed record, extracted field and ambiguity; nothing is yet authoritative.
4. An authorised adult confirms or corrects the proposed entries.
5. Commit a validated batch with import ID, source reference, reviewer and timestamps.
6. Report added, updated, skipped and rejected items; allow correction or reversal without erasing provenance.

A file hash plus source identifiers and assessment context can help find duplicates, but should not replace user review where source identifiers are absent. Re-importing an unchanged batch must not create duplicate assignments, marks, activities or progress credit. Corrected marks need revision history and a visible reason.

PDF/image extraction is a later assisted step, not a promise of accurate OCR. Retain the source page/region; mark uncertain fields, unsupported scales and unreadable content. Redact unnecessary identifiers. If an external OCR or AI service is considered, review the data flow and provider terms before actual records are sent. Require human verification of marks and deadlines regardless of model confidence.

Cialfo, school portals, Teams or other systems require documented access and a supported integration route. No Cialfo API entitlement or school-system integration has been verified for this project. A signed-in browser page does not establish API access or permission to bulk extract student records. Use user-provided exports first; do not store school passwords in the application.

## 5. Hosting and WeChat delivery

GitHub can hold source, documentation, issues and synthetic fixtures. GitHub Pages is static hosting, and GitHub advises against sensitive transactions there; do not host the private record workflow on Pages. A private repository does not automatically make the published website private. [GitHub Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

| Variant | Appropriate use | Decision before real data |
|---|---|---|
| Private Sites demonstration | Family reviews fictional screens and workflows | Verify actual visibility; explain that demo changes are temporary |
| GitHub source + Hong Kong-hosted production services | A private pilot where actual network tests pass | Operator responsibilities, provider regions, mainland-to-HK data flow, backups and support access |
| GitHub source + mainland-hosted production services | Mainland-oriented operation | Hosting/domain/ICP requirements, appropriate service classification and accessible dependencies |
| Separate mainland/HK deployments | Larger service with a concrete regional need | Tenant routing, transfer decisions, region-specific operations and costs; no default cross-region replication |

Tencent's published hosting requirements distinguish mainland resources requiring filing from Hong Kong resources; this does not establish that every app or service is exempt from all other requirements when hosted in Hong Kong. The MIIT APP filing notice includes Mini Program distribution. Determine the actual operator and service category rather than inferring a licensing conclusion from the portal's education theme. [Tencent hosting resources](https://cloud.tencent.cn/document/product/243/18908), [MIIT APP filing notice](https://www.miit.gov.cn/jgsj/xgj/wjfb/art/2023/art_dd783a581c9644a4aee10afa582811db.html).

### WeChat release matrix

| Release capability | Build approach | Evidence required for release |
|---|---|---|
| Open and use the portal from a message or QR code | Normal responsive HTTPS website with ordinary authentication | Current iOS/Android WeChat on intended mainland/HK networks; full task completion |
| Custom WeChat share presentation or native JS features | Optional JS-SDK adapter | Actual account entitlement, verified security domain, working server signing, generic non-sensitive sharing |
| WeChat identity login | Optional identity integration, linked to an authorised family membership | Account entitlement, verified callback domain, state validation, recovery and account-linking tests |
| Mini Program | Separate product deliverable reusing server contracts | Account/category eligibility, domains, privacy declarations, filing/review and physical-device validation |
| PWA install/offline/push | Optional enhancement | Proven behaviour in each target browser; core workflows remain usable without it |

Tencent's official H5 guide verifies JS-interface security-domain setup and distinguishes webpage-authorisation-domain configuration. Precise Weixin account eligibility was not established in this research because the relevant Weixin developer pages could not be retrieved. Verify those conditions in the actual account before committing to a feature. [Tencent H5 domain guide](https://cloud.tencent.com/document/product/1301/100434).

The test matrix must cover initial load, authentication and return, back navigation, file upload/retry, document viewing, session expiry, logout, reopening a private link, network failure, text zoom and reduced motion. Log device/OS/WeChat version, network, hostname, date and outcome. A desktop mobile viewport does not certify WeChat compatibility. No claim of guaranteed mainland reachability is made; test the site, API, identity provider, message delivery and file storage together.

## 6. Backlog and acceptance gates

| Stage | Concrete deliverables | Acceptance gate |
|---|---|---|
| A. Validate the concept | Parent/student journeys; terminology; sample academic records; occupation exploration; route comparison | Family can find a homework, explain its status, inspect evidence and propose a route change without assistance; all data visibly fictional |
| B. Establish private records | Authentication; family membership; student/course schema; manual entry; audit; private files | Anonymous access denied; family A cannot read/write/download family B data; revoked membership loses access; no privileged secret in browser bundle |
| C. Reliable academic tracking | CSV preview/import; duplicates; original scales; missing/zero distinction; revisions | A known fixture reconciles exactly; unchanged re-import is idempotent; corrected result retains provenance; incomparable marks are not pooled |
| D. Evidence and exploration | Observations, reflections, evidence links, interests, activity record and reference mappings | Every competence claim exposes evidence/context; missing evidence stays unknown; custom mappings cannot appear as official certification |
| E. Editable pathways | Versioned requirements; alternative routes; review queue; change reasons; rollback | Changed intake rule or result produces a review suggestion; approval needed to activate an amended route; history and alternatives remain accessible |
| F. Operable family pilot | Notices; permissions; export/deletion; backup/restore; incident procedure; support contact | Restore works in a clean environment; complete export includes files; deletion policy demonstrated; real records enter only after access controls pass |
| G. WeChat release | Region/network/device matrix; performance tuning; file handling and session tests | Intended physical devices complete the full flow using the deployed hostname; no unresolved access or data-exposure failure |
| H. Expansion | Independent student/mentor roles, supported school integrations, optional Mini Program | Separate estimate and review of operator duties, contracts, privacy, scale and account eligibility |

Meaningful automated tests should cover grading semantics, duplicate imports, transactional writes, route version approval and isolation. Use a small set of browser journeys for actual user outcomes; add accessibility checks and manual keyboard/text-resize verification. Do not write tests that merely repeat the wording of the interface.

Reference data needs ongoing ownership: identify who checks qualification/programme rules, what triggers a refresh and how an outdated source is marked. A future reminder or scheduled check is a proposed feature, not an automation created by this plan.

## 7. Planning effort and cost drivers

The following is a planning envelope for one experienced full-stack developer working with timely family feedback and a narrow first-family scope. It is neither a quotation nor a delivery commitment.

| Workstream | Developer days |
|---|---:|
| Scope, curriculum model, permissions and detailed design | 3–5 |
| Production foundation and deployment | 6–10 |
| Academic records and reviewed import | 6–9 |
| Evidence, exploration and route versioning | 6–10 |
| Family controls, export, restore and security validation | 6–9 |
| Device/network validation and release fixes | 4–7 |
| **Total initial private pilot** | **31–50** |

Allow approximately 6–10 working weeks, plus external account/filing delays where applicable. The current demonstration removes some concept uncertainty but is not a partially completed secure backend. School integrations, automated OCR, independent student/mentor roles and Mini Program implementation are separately scoped.

For budgeting, calculate development cost as 31–50 days multiplied by the agreed day rate. For a small private pilot, a provisional operating allowance of HK$300–1,500 per month can be used for planning discussions only; obtain current region-specific quotes before purchase. This allowance is not a verified package price and excludes development, ongoing support, legal review, school licences, heavy OCR/AI use and unusual storage/traffic.

The main operating cost drivers are database size and availability, private file volume and downloads, backup retention/restore, hosting region, monitoring, email/SMS delivery, identity features and support. Prefer a modest storage policy and reviewed imports over expensive automation before usage is known. Free React/Phaser/Godot licences do not eliminate operation and maintenance costs.

## 8. Open decisions before a real-data pilot

Confirm the child's age/year and curriculum; parent/student visibility; locations of use; initial source exports; operator and hosting region; permissible data transfers; retention/export expectations; and whether ordinary WeChat web access is sufficient. The project can continue with synthetic data while these are resolved.

Mainland PIPL includes a personal/family-affairs exception, but it should not be assumed to exempt a provider or school service. Where PIPL applies, under-14 records are sensitive; the general small-volume cross-border exemption does not simply cover all sensitive information. Hong Kong also has domestic-purpose exemptions and child-privacy guidance. Scope and data flow therefore need an applicability check before deployment, rather than blanket conclusions. [PIPL](https://www.cac.gov.cn/2021-08/20/c_1631050028355286.htm), [CAC cross-border explanation](https://www.cac.gov.cn/2024-03/22/c_1712776611649184.htm), [PCPD child-service guidance](https://www.pcpd.org.hk/english/resources_centre/publications/files/guidance_children_e.pdf), [PCPD exemptions](https://www.pcpd.org.hk/misc/files/table1_e.pdf).

Additional technical evidence, source limitations and engine comparison are recorded in `research/platform.md`.
