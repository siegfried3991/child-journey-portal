# Platform, WeChat, deployment and privacy investigation

Research checked: 20 October 2026. This is an implementation recommendation, not a claim that a production service, WeChat integration or legal review has been completed. Only synthetic student records should be in the demonstration and repository.

## Recommended decision

Build the main portal as a responsive web application using TypeScript, React, Vite, HTML, CSS and SVG. Use Node.js 24 LTS for the development toolchain, with pinned dependency versions and a lockfile. Node's release page currently lists 24 as LTS and 26 as Current. Vite's documented minimum is Node 20.19+ or 22.12+, with some templates requiring newer versions. [Node releases](https://nodejs.org/en/about/previous-releases), [Vite guide](https://vite.dev/guide/).

Use original, simple SVG classroom/home/community scenes and a small avatar. The scene should illustrate the timetable context, not assert the child's live location. Use ordinary HTML for assignments, results, evidence, route comparisons and forms. The school emblem is a configurable private asset, displayed only where the family is entitled to use it. Do not copy the named commercial games' art, characters, UI assets, audio or code.

React's documentation permits a build-tool setup but notes that it leaves routing, data fetching and other framework decisions to the project. This tradeoff is reasonable for a modest authenticated dashboard; adopt a more integrated framework later only if a concrete requirement justifies it. [React build guidance](https://react.dev/learn/build-a-react-app-from-scratch).

### Engine decision matrix — project assessment

| Approach | Strength for this portal | Main cost | Decision |
|---|---|---|---|
| React + HTML/CSS/SVG | Accessible text, mobile forms, charts, printing and simple scenes share one interface | Need to implement modest animations | Use for MVP |
| React + Phaser | Sprite animation, a walkable map, small interactive activities | A second renderer and event bridge; canvas accessibility requires an HTML equivalent | Add only when a specific interaction needs it |
| Godot web export | Full scene editor and richer game mechanics | WebAssembly/WebGL requirements and separate engine workflow; a poor fit for predominantly records and forms | Do not choose for the initial portal |
| Plain HTML/CSS/JavaScript | Small, inspectable demonstration with no build dependencies | Becomes harder to maintain as forms, permissions and data grow | Appropriate for the synthetic concept demo |

Phaser's framework is MIT-licensed and can be used commercially; retain its required licence notices. Its official templates include React + Vite and TypeScript. Treat a chosen release as a pinned dependency rather than assuming an old tutorial describes the current version. [Phaser licence](https://phaser.io/download/license), [official project templates](https://docs.phaser.io/phaser/getting-started/project-templates).

Godot is MIT-licensed. Its current stable documentation says web exports require WebAssembly and WebGL 2.0, Godot 4 C# projects cannot currently export to web, and single-threaded export is preferred/default; threaded export needs special headers and cross-origin isolation. These are reasons to test on actual phones, not proof it cannot work. No performance comparison of the engines on the user's devices has been conducted. [Godot licence](https://godotengine.org/license/), [stable web-export documentation](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html).

## What “WeChat compatible” should mean

**Release 1: a mobile website opened from a WeChat message, bookmark or QR code.** The normal website should work without making WeChat identity mandatory. Use an ordinary HTTPS URL, same-origin authenticated API, explicit log-in/log-out and a mobile layout. A PWA is optional and must not be a dependency for core use. Browser install prompts, service workers, push notifications, camera behaviour, PDF downloads and cookie persistence must not be assumed to work identically inside WeChat.

**Release 2: optional WeChat-specific features.** A customised share card or WeChat identity integration requires separate platform integration. Tencent's official product guide confirms that H5 pages calling WeChat's JS interfaces need a configured and verified JS-interface security domain; the guide also documents separate business-domain and webpage-authorisation-domain configuration. This is distinct from merely viewing a web link. [Tencent domain configuration guide](https://cloud.tencent.com/document/product/1301/100434).

Implementation design: keep the AppSecret and any access-token/ticket work on the server, constrain allowed signing URLs, validate the login callback state, and link a WeChat identity to an already-authorised family membership. A WeChat account identifier is not evidence of parental authority. Share cards should have a generic title and illustration by default; a share URL must not encode grades, names or permanent access tokens.

**Release 3: a WeChat Mini Program only if demand warrants it.** This is a separate platform deliverable, not the automatic result of making a website responsive. Investigate native Mini Program screens versus an approved web-view container, account ownership, allowed category, privacy declarations, domain configuration, filing and review before committing to it. Reuse the server API and data model; do not assume the React browser UI or a Godot export can be copied directly into Mini Program runtime.

Verification limitation: the following first-party Weixin developer pages could not be retrieved by the research browser in this run. Their precise current account eligibility, quotas and review conditions therefore remain an explicit implementation check in the actual account, rather than asserted facts here:

- [Weixin JS-SDK documentation](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html)
- [Weixin webpage authorisation](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html)
- [Weixin Mini Program network configuration](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)
- [Weixin web-view component](https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html)

Do not substitute Tencent's separate Super App as a Service documentation for Weixin account eligibility rules; they are different products.

### WeChat acceptance checklist

Test the real deployed hostname in current iOS and Android WeChat, Safari and Chrome, on the actual mainland and Hong Kong networks the family uses. Record device, OS, WeChat version, network, date and outcome. Exercise initial load; log-in and return from authentication; browser back; 200% text zoom; portrait/landscape; assignment filtering; route editing; upload with explicit progress and retry; PDF open/download; session expiry; log-out; reopening a private link; and restricted access from another family account. A desktop mobile viewport is useful but does not certify WeChat compatibility or mainland reachability.

Bundle fonts/icons locally or use system fonts. Avoid mandatory third-party font/CDN/script requests. Keep the initial interface small and defer optional scenes and attachments. Provide a text/list alternative to every chart. Respect reduced-motion settings. Show a retry screen if an API cannot be reached rather than displaying stale grades as current.

## GitHub, hosting and region choices

GitHub is suitable for source control, issue tracking, project documentation and a demonstration containing fictional records. GitHub Pages serves static HTML/CSS/JavaScript. GitHub's limits say Pages should not be used for sensitive transactions such as transmitting passwords and it is not intended to host a commercial SaaS. Therefore the recommended production family portal is a separately hosted authenticated application; a private source repository is not a substitute for access control on a deployed site. [What GitHub Pages is](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

| Deployment | Good initial use | Tradeoffs and unresolved checks |
|---|---|---|
| Local or static synthetic demo | Review navigation and visual concept | No multi-device private record service; no claim of durable backup |
| GitHub + separate Hong Kong-hosted app/API/database/storage | Small private pilot if the chosen users' network tests pass | Cross-border data review for mainland collection; inspect all provider/subprocessor regions, backup and support paths |
| Mainland-hosted app/API/database/storage | Service intended primarily for mainland families or schools | Provider onboarding, ICP/domain requirements and service classification; choose domestic-accessible dependencies |
| Separate mainland and Hong Kong deployments | Later organisational expansion | More cost; tenancy routing and selective transfer policy; avoid automatic replication of children's records across regions |

Tencent's hosting documentation states that using its Hong Kong servers does not require mainland ICP filing, while mainland-server website deployment does. This is hosting-provider guidance, not a universal exemption for every app or service. The MIIT regulation governs non-commercial internet information service filing, and the 2023 APP notice includes Mini Program distribution and additional requirements for specified service categories. A family organiser and a commercial education platform are different operating models; classify the actual service and account before launch. Do not generalise that “educational content always needs the same licence” or that “Hong Kong hosting removes every mainland obligation.” [Tencent filing resources](https://cloud.tencent.cn/document/product/243/18908), [MIIT non-commercial filing regulation, 2024 revision](https://ynca.miit.gov.cn/zwgk/zcwj/flfg/art/2024/art_2e96227c42924af9b49b7f13b81fd124.html), [MIIT APP filing notice](https://www.miit.gov.cn/jgsj/xgj/wjfb/art/2023/art_dd783a581c9644a4aee10afa582811db.html).

No host is represented as guaranteeing access from all mainland networks. Test the complete path — site, API, identity service, email/SMS delivery and object storage — before choosing a region. Do not buy infrastructure merely to display the concept. Quote hosting after expected families, file volume, region, backup retention, notifications and operational support are known; free engine licensing does not mean zero hosting or maintenance cost.

## Proposed production architecture

```text
WeChat browser / mobile or desktop web
             |
      HTTPS web application
             |
   authenticated TypeScript API
      /          |           \
PostgreSQL   private files   background jobs
      \          |           /
      permission checks + audit events

Optional Phaser scene receives view data only.
It never owns grades, permissions or route decisions.
```

The database should hold families/memberships, students, curriculum/enrolments, assignments, attempts/results, observations and evidence, interests, exploration activities, official taxonomy versions, proposed mappings, qualification/programme requirements, route versions and review decisions. Store file metadata and permissions in the database; binaries in private object storage. Keep each official source URL, retrieved date, applicable intake/version, and mapping author/rationale. A syllabus or university rule changes independently of a child's record.

A managed Postgres/auth/storage service can shorten a pilot, provided its region and transfer terms fit. Supabase is one candidate, not a preselected deployment. Its documentation requires row-level security on exposed tables; file storage also has its own policies. A regional Node/Postgres/private-object-storage stack is a viable alternative where deployment control matters. [Supabase row security](https://supabase.com/docs/guides/database/postgres/row-level-security), [Supabase storage policies](https://supabase.com/docs/guides/storage/security/access-control).

Build the important calculations as ordinary typed domain functions with tests: preserve original grade scales; distinguish missing, submitted and graded; use only comparable assessments for trends; distinguish unknown prerequisites from failures; version route assumptions; require confirmation before a changed route becomes active. Never derive an admission probability or a personality diagnosis from these records without a separately justified and validated method.

Import in stages: manual entry and agreed CSV first; PDF/OCR assisted extraction with a review queue second; documented school-system APIs only after access is authorised and supported. A visible school login page does not establish API access, integration permission or permission to bulk copy records. Preserve provenance and links to the original record. Idempotent imports should not double-count the same exam or assignment.

## Child-data design and operating scope

The legal scope depends on the operator, users, location and processing activities. Mainland PIPL Article 72 excludes natural persons processing data for personal/family affairs; that should not automatically be extended to a hosted provider's own processing or a service offered to schools. Where PIPL applies, under-14 personal information is sensitive, and Article 31 requires parent/guardian consent and dedicated handling rules. Articles 38–39 concern overseas provision. [PIPL text, especially Articles 28–31, 38–39 and 72](https://www.cac.gov.cn/2021-08/20/c_1631050028355286.htm).

The 2024 cross-border rules include exemptions and thresholds, but the general low-volume exemption concerns non-sensitive information; it is unsafe to infer that a small child-data service is automatically exempt. Determine the applicable mechanism and any exemption for the actual data flow before sending real records to an overseas backend or AI processor. [CAC official explanation of the 2024 cross-border rules](https://www.cac.gov.cn/2024-03/22/c_1712776611649184.htm).

Hong Kong's PCPD highlights children's limited ability to appreciate over-sharing and recommends age-appropriate protection. Its principles cover collection, accuracy/retention, use, security, openness, access and correction; domestic-purpose exemptions also exist, so organisational deployment should be reviewed separately from a parent's private records. [PCPD guidance for services targeting children](https://www.pcpd.org.hk/english/resources_centre/publications/files/guidance_children_e.pdf), [PCPD principle overview](https://www.pcpd.org.hk/childrenprivacy/en/six_data_protection_principles/six_data_protection_principles.html), [PCPD exemptions table](https://www.pcpd.org.hk/misc/files/table1_e.pdf).

The following are recommended product requirements, not a statement that each is a statutory rule in every setting:

- Private by default, no public student search, no class rankings, no advertising SDKs and no automatic public portfolio.
- Adult owner, student and invited mentor roles with tested access to only their authorised child and evidence. A “child view” toggle in a parent's session is not a security boundary.
- Invite expiry/revocation, session revocation, password recovery, rate limits and parent MFA. Server enforcement for every read, write and file operation.
- Explicit child-friendly visibility labels: “my reflection”, “shared with parent”, “shared with mentor”. Do not promise confidentiality inconsistent with actual guardian access and safeguarding duties.
- Collect grade/year instead of full birth date where sufficient; avoid identity documents, precise live location, diagnoses and sensitive family notes unless a defined necessary function needs them.
- No “morality”, “loyalty” or overall child-quality score. Ethical growth uses contextual observations and the child's reflection; a disagreement is not a permanent trait label.
- Allow corrections and alternative interpretations while preserving proportionate audit history. Explain what changed, who changed it and why.
- Private object buckets, short-lived download access, file type/size controls, malware handling, metadata stripping where appropriate, encrypted transport and backups, and no credentials/student content in logs.
- Define retention by record purpose, deletion handling including backup expiry, export of both records and evidence files, incident response and restore testing.
- AI, if added, only drafts summaries or alternatives from approved sources. Give users a review step and provenance; do not automatically send attachments or private reflections to an external model, or use them for training by default.

## Delivery sequence and gates

1. **Design validation:** synthetic data; validate navigation, Chinese terminology, original grade display, interest exploration and editable route scenarios. Confirm age/curriculum and guardian/student visibility needs.
2. **Private family pilot:** choose region and operator; implement identity, memberships, database, private files, consent/notice, records import and export. Pass cross-family denial tests and a backup restore before real uploads.
3. **Evidence and route pilot:** review official mappings with an educator/counsellor; test missing prerequisites, changed intake rules, conflicting observations and route rollback. Verify that an exam result never silently closes a future option.
4. **WeChat release:** test real devices and networks and resolve account/domain requirements for any WeChat-specific feature. Keep normal web access working if WeChat integration is unavailable.
5. **School/multiple-family expansion:** revisit operator responsibilities, contracts, region/transfer rules, support, access segregation, incident response and hosting costs. Add a Mini Program only when its benefit exceeds its extra operation and review work.

Indicative planning estimate for one experienced full-stack developer: concept demo in several days; a narrowly scoped private family pilot in roughly 6–10 weeks; school integrations, Mini Program approval and multi-region deployment are separately estimated. These are planning assumptions, not a quotation or verified schedule. Security, import quality and data modelling are likely to dominate effort more than the rudimentary scene art.

## Evidence limitations

No real student account, school integration, WeChat account entitlement, production host or billing has been inspected or configured. No mainland network or physical-phone acceptance testing was performed during research. The engine comparison is an engineering fit assessment based on official documentation, not a measured benchmark. Legal notes identify relevant issues and boundaries; deployment scope must be settled before an applicability conclusion is made.
