# Evidence, abilities and pathway decisions

Status: implementation specification, version 1.0. Research checked 20 October 2026. Companion research: `research/hk-framework.md`. Ability catalogue: `data/abilities.json`, catalogue version 1, exactly 50 original portal abilities.

## 1. Product boundary

The portal connects what a student has done, what the evidence supports, what the student wants to explore and what a published route requires. It does not diagnose a child, certify professional competence, award QF credits or predict admission chances.

Keep **school results**, **skill observations**, **student interests**, **route requirements** and **earned qualifications** separate. A completed homework can contribute evidence to several abilities, but its grade must never automatically increase a personality, ethics or QF score. The overview presents a short evidence-backed narrative and next actions, with the underlying records one tap away.

Official reference boundaries:

- HKQF's four GLD domains describe qualification learning outcomes. Using their themes for school observations is our product adaptation. [HKQF domains](https://www.hkqf.gov.hk/tc/qf-level).
- SCS/SGC units and VQP are useful reference material for work-related learning and routes; a local task is not an assessment of the complete professional unit. [HKQF applications](https://www.hkqf.gov.hk/en/application-of-qf-deliverables).
- QF credits measure notional learning volume, rather than elapsed activity time. [QF credit](https://www.hkqf.gov.hk/en/qf-credit).
- Admission and credit transfer are distinct institutional decisions. [CAT](https://www.hkqf.gov.hk/en/qf-cat).

## 2. Semantic data model

All private rows carry `id`, `family_id`, `created_at`, `created_by`, `updated_at` and an optimistic-lock `revision`. Child records also carry `student_id`. Use stable opaque IDs, ISO dates and IANA time zones. Preserve source text and original attachments separately from interpreted fields. A nullable value is unknown unless an explicit status explains otherwise; zero is a real value.

| Entity | Required semantic fields | Relationships and constraints |
|---|---|---|
| `StudentProfileVersion` | effective date; display name; age band or optional birth date; school stage; curriculum track; teaching languages; country/region; learner preferences; consent/sharing controls | Snapshot versions; no inferred nationality or legal residency. Keep sensitive dates and support notes out of ordinary exports |
| `ApplicantContextVersion` | target jurisdiction; application/intake year; qualification route; local/non-local/unknown status; status evidence; effective date | Separate from everyday child profile. Residency classification is per jurisdiction/intake, verified by a human, not inferred from passport, school or IP address |
| `CourseEnrollment` | provider; school subject; academic year/term; curriculum; course/level code; start/end dates | One subject can have several enrolments across schools/years |
| `Assessment` | enrolment; type (`homework`, `quiz`, `test`, `exam`, `project`, `practice`); title; issue/due dates; grading-policy version; assessed objectives; stakes | Completion status separate from grade and submission status |
| `AssessmentAttempt` | assessment; attempt number; work date; submission date; result status; original mark/grade; scale version; marker; accommodations/support context; evidence links | First attempt, retake and corrected work remain distinct. A correction never silently replaces the original |
| `GradeScaleVersion` | scale kind; ordered categories or numeric bounds; direction; allowed precision; missing/result statuses; curriculum/provider; effective dates | Defines percentages, rubric categories, letter grades, AP scores, IB grades and HKDSE categories separately |
| `GradingPolicyVersion` | aggregation method; weights; exclusions; missing/retake rules; rounding stage; source; effective date | Human-confirmed school policy only; retain policy used for each historical calculation |
| `RubricCriterionResult` | attempt; criterion; rubric version; original criterion mark/category; comment; assessor | Provides the evidence for an ability interpretation. A total mark alone is insufficient |
| `EvidenceArtifact` | type; private storage reference; content hash; owner/uploader; captured date; origin; authenticity status; sharing scope; optional page/time locator | Authenticity status: `unverified`, `reviewed`, `issuer_verified`, `disputed`. Do not imply that a hash proves authenticity |
| `EvidenceLink` | artifact; linked entity; locator; purpose; added by | Many-to-many. An attachment does not itself imply assessment or consent to publish |
| `AbilityDefinition` | stable ID; Chinese/English name; category; local description; catalogue version | Exact IDs from `data/abilities.json`; all 50 are portal-defined, not official HKQF/ISCO abilities |
| `SkillObservation` | ability; task/context; observable behaviour; support received; observation date; observer and role; local stage or `not_assessed`; evidence; interpretation; child response; review status | Distinguish direct observation, child reflection and second-hand report. Multiple viewpoints may coexist |
| `ObservationReview` | observation; reviewer; decision; reason; date; superseded interpretation if any | `draft`, `reviewed`, `disputed`, `withdrawn`; never overwrite the child's differing account |
| `AbilitySummary` | student; ability; window; referenced observations; recent supported stage; context coverage; evidence count; summary method version | Derived, reproducible view. No arithmetic average of ordinal stages; no total across abilities |
| `Reflection` | author; prompt; optional text; optional self-reported feeling/interest; date; visibility | Voluntary. No sentiment analysis or mental-health diagnosis in MVP |
| `InterestStatement` | child-selected field/activity; curiosity strength or descriptive label; liked/disliked aspects; date; wants-to-repeat; optional evidence | Interest may be high with low attainment, or low with high attainment; both are valid |
| `AspirationVersion` | child-authored goal; motivation; chosen status; horizon; alternatives; created/adopted dates | A future profession is provisional. Allow “still exploring” and goals unrelated to paid work |
| `ActivityExperience` | activity; field/occupation references; expected learning; date; accessibility; adult supervision; participation state; reflection | Attendance is participation evidence, not competence. Do not rank costlier activities above free ones |
| `FrameworkReference` | framework; official code/URI; title; edition; publisher; source URL; accessed date; official level if applicable | Store ISCO codes, GLD domains, SCS/SGC UoCs and qualifications as distinct framework types |
| `FrameworkCrosswalk` | local ability; reference; relationship; rationale; context constraint; reviewer; version | Relationships: `related_theme`, `partial_task_overlap`, `verified_qualification_reference`. Never auto-generate equivalence |
| `QualificationAward` | issuer; award title; award date; original qualification identifier; evidence; verification status; optional QR ID/QF level/credits and applicable registration period | Only records an actual award. Planned course and unit references belong elsewhere |
| `ProgrammeVersion` | provider; programme; jurisdiction; qualification; delivery mode/language; duration; intake; application route; official source snapshot | Programme versions can coexist for different intakes and applicant categories |
| `RequirementSetVersion` | programme/route; complete scope; intake; applicant applicability; structured expression; authoritative sources; effective/review dates; human review | Versioned immutable input to evaluation; details below |
| `RequirementEvaluation` | requirement version; student snapshot; engine version; evaluated timestamp; result; per-predicate evidence/reasons | Derived, immutable. No offer or prediction fields |
| `PathwayNode` / `PathwayEdge` | node kind; source/target; requirement version; claim type; transfer conditions; uncertainty; review date | Graph includes school choices, experience, qualification, application and professional practice. No assumption every edge is guaranteed |
| `PathwayPlanVersion` | aspiration; chosen graph subset; constraints; actions; assumptions; evaluations; adoption record | Draft revisions do not replace the adopted plan |
| `NextAction` | student-chosen objective; action; due/review date; support owner; linked evidence gap; success observation; state | Limit active suggestions to a manageable number; allow pause/decline without penalty |
| `AuditEvent` | actor; action; entity/revision; timestamp; reason; before/after references | Records imports, reviews, route adoption and corrections. Deletion also follows the privacy/retention policy; do not retain erased private text in audit payloads |

Store source snapshots with title, publisher, URL, fetched date, edition/intake, relevant excerpt/locator and content hash. Store only the permitted material needed to substantiate a rule. A linked webpage is evidence of a published requirement, not proof that a learner meets it.

## 3. Grades and comparability

### Original results

`result_status` is one of `not_yet_assessed`, `pending`, `graded`, `absent`, `exempt`, `missing_submission`, `withdrawn`, `invalidated`. A school may explicitly award zero for missing work; record the school's zero plus the relevant status/policy. The portal must not invent that zero.

For numeric marks, keep `raw_value`, `maximum`, `minimum`, `unit`, `precision` and `scale_id`. For categorical grades, keep `original_label` and the official ordered category ID. HKDSE `5`, `5*`, `5**`, IB subject grades and AP grades are distinct categories/scales. Predicted grades carry `is_predicted=true`, predicting source and date, and must never satisfy a requirement for an actual award unless that requirement explicitly accepts predictions for that stage.

### Valid comparisons

An assessment belongs to a `comparison_series_id` only after a teacher or authorised adult confirms that it measures sufficiently comparable objectives with the same scale and appropriately comparable difficulty/context. Store that decision and rationale. Different accommodations or access arrangements do not automatically invalidate a comparison; obtain context-sensitive review rather than penalising support.

| Situation | Permitted display/calculation |
|---|---|
| Same assessment, corrected submission | Side-by-side attempts; labelled improvement on that task |
| Comparable assessment series | Trend within that series, sample count, dates and method |
| Same numeric bounds, different content/difficulty | Original marks side-by-side; no asserted mastery trend merely because both are percentages |
| Different subjects/curricula | Separate panels; no combined “intelligence” or universal grade |
| Official aggregate defined by school | Reproduce the published policy, label coverage and included assessments |
| Missing weights or uncertain policy | Show provisional individual results and “aggregate unavailable” |
| Published external conversion | Preserve source/version and purpose; never silently reuse for another institution or admission year |

For a valid weighted numeric aggregation, use `sum(weight × normalized_score) / sum(included_weight)`, where normalization is authorised by the scale/policy and the denominator follows the school's missing-work policy. For a scale explicitly defined as points from zero to maximum, `normalized_score = raw / maximum`. Otherwise use the scale's declared transformation, never guess. Report coverage, e.g. “3 of 4 assessments; remaining result pending”. Do not silently renormalise pending weight unless the school policy specifies it. Keep full precision until the policy's rounding step.

A chart may display normalized percentages for inspection only if it states the original marks and that percentage alone does not establish comparable difficulty. Avoid green/red career judgements from one low test.

## 4. Local observations and whole-child development

Local stages are `trying_with_support` (在協助下嘗試), `following_guidance` (按指引完成), `independent_in_context` (在此情境能獨立完成), and `transfer_and_explain` (能在新情境運用及解釋). `not_assessed` (未有足夠證據) is a separate missing state, not stage zero. These are not age norms or HKQF levels.

Every reviewed stage must link to observable behaviour, a defined task and support context. An introductory task cannot establish advanced competence in the whole field. The default summary shows the latest reviewed, undisputed observation in context; broader claims require evidence across contexts and a reviewer explanation. Newer contradictory evidence shows “情境有差異，待討論”, rather than choosing whichever result looks better. No automatic age-based decay or demotion.

Whole-child views include learning, relationships/belonging, responsibility/ethical reasoning, creative/practical exploration, autonomy and wellbeing. Wellbeing is a voluntary check-in and support conversation. Ethical reflection records a situation, affected people, choices, reasons, consequences, repair and next action. Examples: crediting sources; admitting an error; asking permission; respecting a refusal; sharing group work fairly. Never assign “morality 78/100”, infer dishonesty from a low mark, grade family beliefs, or create a compliance leaderboard. Social skill does not mean popularity or extroversion. Disability, neurodiversity, language learning and contextual support must not be converted into character deficits.

## 5. Cautious mapping of all 50 abilities to GLD themes

Codes below are product shorthand for official domains: **K** 知識及智能; **P** 過程; **A** 自主性及問責性; **C** 溝通、資訊及通訊科技及運算. The four names come from [HKQF](https://www.hkqf.gov.hk/tc/qf-level). The mappings are editorial proposals, not official equivalences or attainment claims. No QF numeric level is attached.

`theme` means the local skill commonly offers relevant learning evidence. `context_only` means attach a domain only when a particular task supports the rationale. `unmapped_core` means the central developmental attribute is not treated as a GLD competence; a related task may still map. All mappings require a versioned editorial review before production use. They never award additional points for having more tags.

| Ability ID | 中文 | Proposed domains | Relation / required evidence focus |
|---|---|---|---|
| reading | 閱讀 | K, C | theme — understanding and communicating meaning from a text |
| writing | 寫作 | C, K | theme — communicating an organised, supported idea |
| listening | 聆聽 | C | theme — accurately interpreting and responding to another person |
| speaking | 口述 | C | theme — explaining something clearly to an audience |
| public-speaking | 演說 | C, P | theme — preparing and delivering an audience-appropriate presentation |
| reasoned-debate | 論辯 | K, C | theme — reasoning with evidence and responding respectfully |
| additional-language | 外語 | C | theme — practical understanding/expression in a named language |
| storytelling | 敘事 | C, K | theme — organising and communicating a coherent account |
| arithmetic | 運算 | C, K | theme — applying and explaining a calculation |
| reasoning | 推理 | K | theme — drawing justified conclusions |
| spatial | 空間 | K, P | theme — interpreting and applying spatial relationships |
| statistics | 統計 | C, K | theme — representing and interpreting data with limitations |
| observation | 觀察 | K, P | theme — noticing and recording relevant evidence |
| experimentation | 實驗 | P, K, A | theme — testing a question and taking responsibility for procedure |
| verification | 查證 | K, C | theme — evaluating sources and explaining reliability |
| problem-solving | 解難 | K, P | theme — testing options and checking outcomes |
| digital-literacy | 數碼 | C, P | theme — purposeful, safe use of digital tools |
| programming | 編程 | P, K, C | theme — creating, debugging and explaining a functioning program |
| ai-literacy | 智用 | K, C, A | theme — checking generated content, disclosing use and protecting information |
| engineering | 工程 | P, K | theme — designing and testing against a task constraint |
| making | 製作 | P | theme — selecting materials and executing a documented process |
| repair | 修繕 | P, A | theme — safe, appropriate supervised repair and knowing when to stop |
| drawing | 繪畫 | P, C | context_only — technique or communicating an intended visual idea; aesthetic preference is not a GLD result |
| design | 設計 | K, P, C | theme — responding to a user's need and explaining design choices |
| music | 音樂 | P, C | context_only — demonstrated musical process or communication; taste is outside this mapping |
| performance | 表演 | P, C | context_only — rehearsed technique or expressive intention, not confidence inferred from personality |
| visual-media | 影像 | C, P | theme — creating a purposeful visual narrative with consent and attribution |
| ideation | 創想 | K, P | theme — generating and comparing possible approaches |
| focus | 專注 | A, P | context_only — choosing supports and sustaining a specific task; no diagnosis or trait ranking |
| planning | 規劃 | P, A | theme — arranging steps/resources and reviewing progress |
| time-management | 時間 | A, P | theme — estimating, prioritising and adjusting a task schedule |
| execution | 執行 | P, A | theme — completing a chosen task with its support context recorded |
| organization | 整理 | P, A | theme — maintaining a useful method for materials/information |
| reflection | 反思 | K, A | theme — using evidence to identify an improvement |
| emotional-regulation | 調適 | — (A only when task-specific) | unmapped_core — emotional wellbeing is not qualification attainment; a chosen coping strategy can be described without a score |
| empathy | 同理 | C, A | context_only — responding to another person's expressed needs; do not claim knowledge of inner feelings |
| cooperation | 合作 | A, C, P | theme — coordinating contributions and communicating in a group |
| negotiation | 協商 | C, K | theme — explaining needs and finding workable agreement |
| leadership | 領導 | A, C | theme — supporting and coordinating others, without equating authority with worth |
| social-connection | 交往 | C only when task-specific | unmapped_core — friendship/belonging is not a qualification; respectful interaction can provide related evidence |
| helpfulness | 助人 | A, C | context_only — identifying wanted help and following through; never moral ranking |
| self-care | 自理 | A, P | context_only — managing a chosen daily process; record age/context/support, no medical judgement |
| cooking | 烹飪 | P, K, A | theme — following a safe process and explaining ingredients/hygiene choices |
| financial-literacy | 理財 | C, K, A | theme — interpreting a budget and explaining trade-offs in a learning task |
| enterprise | 商貿 | K, P, C | theme — investigating needs and testing a cost/pricing idea |
| gardening | 種植 | P, K | theme — following care procedures and explaining observed changes |
| safety | 安全 | A, P, K | theme — identifying a risk, choosing a safer action and seeking help |
| coordination | 協調 | P only when task-specific | unmapped_core — motor development is not a QF rating; a defined technique can be observed |
| endurance | 耐力 | — | unmapped_core — retain a voluntary activity log outside GLD scoring; no health inference |
| sport | 運動 | P, K, A | context_only — a named technique, tactical explanation or fair participation in context |

For production, convert this table into reviewed `FrameworkCrosswalk` records rather than adding official-looking fields to the original catalogue. `emotional-regulation`, `social-connection`, `coordination` and `endurance` must remain usable without any GLD link. None of the 50 is required to be assessed; “not explored” is a valid state.

## 6. Versioned requirements and three-state evaluation

### Requirement-set contract

Each immutable version contains:

```text
id / version / supersedes_id
provider_id / programme_id / route_id
jurisdiction / intake_year / admissions_round
curriculum_and_qualification_routes[]
applicant_categories[] with official definitions and evidence needed
local_status_rule / residency_effective_date
language_of_instruction / language_requirements
requirement_expression (all, any, at_least, predicate)
subject_identity_rules / accepted_grade_scales / exam_sitting_rules
predicted_or_actual_result_policy / retake_policy
nonacademic_requirements (portfolio, interview, experience, age if applicable)
application_channel / deadline_instant / deadline_time_zone
professional_registration_conditions where applicable
source_snapshot_ids[] / issued_date / effective_from / effective_to
scope_status (complete_for_this_check | partial | uncertain)
reviewed_by / reviewed_at / refresh_due_at / source_change_state
```

Fees, budget and preferred location are planning constraints, not academic eligibility unless the authoritative rule makes them a formal condition. Keep a qualification's admission requirement separate from professional registration, practice rights, immigration eligibility and later employment. The rules of each later step need their own sources.

### Applicability first

Before checking grades, match jurisdiction, programme, intake/round, curriculum route and applicant category. A version intended for HKDSE local applicants cannot evaluate an AP non-local application. If context is missing or ambiguous, return `unknown` and explain the missing classification. An inapplicable version is excluded from evaluation, not recorded as a failed child requirement. When no applicable verified version remains, the route is `unknown`.

JUPAS eligibility depends on results and identity conditions; it cannot be inferred solely from school location. [JUPAS](https://web.jupas.edu.hk/en/eligibility/). Institution-specific standards may differ between IB, A-level and SAT/AP and by intake; meeting a published threshold is not an admission guarantee. [HKU international admissions](https://admissions.hku.hk/apply/international-qualifications).

### Result vocabulary

| Stored result | Interface label | Exact meaning |
|---|---|---|
| `eligible` | 符合已列明要求 | Complete, current and applicable reviewed requirements are satisfied by acceptable evidence for the stated check. This is not an offer or admission probability |
| `not_demonstrated` | 尚未符合已列明要求 | Acceptable evidence establishes that at least one necessary requirement is currently unmet, or a formal stage is confirmed incomplete; show precisely which and the available next steps |
| `unknown` | 資料不足／待核實 | Evidence, rule completeness, applicability, source currency or interpretation prevents a supported conclusion |

Never display `eligible` by itself without the scope, e.g. “符合已列明的2029入學學術要求；錄取另行決定”. Distinguish `academic_entry`, `application_ready`, `credit_transfer` and `professional_registration` checks. Passing one does not pass the others. Application/offer/acceptance/enrolment are separate factual workflow states supported by their own records.

### Deterministic logic

Each predicate returns a value plus `reason_code`, input IDs, source locator and any unresolved data. Required evidence absent from the portal is `unknown`, not failure. A transcript proving a grade below the published minimum is `not_demonstrated`. A confirmed not-yet-earned prerequisite is `not_demonstrated` for a current-readiness check, with “not yet earned” rather than “cannot achieve”. A predicted result is `unknown` when the rule requires final results. Disputed, invalidated or unreviewed extraction cannot satisfy a predicate.

- `all`: any `not_demonstrated` ⇒ `not_demonstrated`; otherwise any `unknown` ⇒ `unknown`; otherwise `eligible`.
- `any`: any `eligible` ⇒ `eligible`; otherwise any `unknown` ⇒ `unknown`; otherwise `not_demonstrated`.
- `at_least(n)`: if eligible count ≥ n, `eligible`; if eligible + unknown count < n, `not_demonstrated`; otherwise `unknown`.
- A source-level gate runs before the expression: incomplete scope, stale/changed source awaiting review, unresolved applicability or conflicting authoritative rules ⇒ **overall `unknown`**. Preserve individual known shortfalls as findings even when the overall result is unknown.
- A closed application round is a separate application-readiness predicate; it does not erase an academic qualification or change its grade.
- Round numeric values only according to the cited rule. Equality at a threshold passes when the rule says “at least”. Do not add tolerances without an explicit rule.
- Do not infer probability, rank, “safety school”, or a predicted future result from this logic.

Each evaluation is reproducible from immutable requirement, input and engine versions. Human reviewers may correct data or clarify a rule through a new version, but cannot flip the result without recording the new evidence/rule. A scenario with hypothetical grades uses a distinct `scenario_id`, visible “假設情境” styling and separate storage; it never modifies actual records.

## 7. Human-reviewed route revision

Trigger a draft review when a final result changes, a new comparable assessment identifies a support need, a child changes interests, a subject changes, a requirement/source changes, a deadline approaches/passes, or the family changes a planning constraint. One low homework score alone produces a learning-support suggestion, not an automatic career exclusion.

Processing sequence:

1. Capture an immutable input snapshot and current adopted plan version.
2. Re-evaluate only the affected, applicable requirement sets; mark stale or missing sources unknown.
3. Generate a deterministic change set: new evidence, changed predicates, missing facts, expired conditions, completed transferable learning and affected actions. Stable-sort by route ID and predicate ID so equal inputs produce equal output.
4. Suggest actions using explicit rules. Examples: missing final language evidence → obtain result or ask the institution about alternatives; below a published subject requirement → review accepted retake/bridging routes; reduced interest → offer a different trial rather than an attainment penalty.
5. Display the existing and proposed route side-by-side, including rationale, source, time/cost changes and reversibility. Do not hide an aspirational route merely because requirements are not yet met.
6. Parent/counsellor reviews source interpretation; student discusses the direction. The plan adopts only after the authorised family member confirms the exact draft revision and records the child's agreement, disagreement or preference to defer. This is a product workflow, not an external consent assertion.
7. Save a new adopted version, retain the prior plan and support rollback. Reject adoption if inputs changed since the draft; re-evaluate before review.

Every pathway edge has a claim type: `illustrative`, `published_possibility`, `formal_articulation_agreement`, or `confirmed_individual_decision`. An agreement needs the applicable intake, subject match, grade/credit conditions and source. A published route remains conditional until the receiving institution makes the relevant decision. Credit transfer and admission remain separate. [CAT](https://www.hkqf.gov.hk/en/qf-cat).

## 8. Worked example — synthetic, not a real child's record

**Student:** 林同學, age 15, an unnamed international secondary programme, interested in explaining environmental problems through data and pictures. The child has not selected a university or profession. Jurisdiction/local status for eventual applications is unknown.

**Homework:** “Which school spaces are hottest?” Attempt 1 receives **17/25** on a school-created project rubric. Marking breakdown: data collection 4/5; graph labels/units 2/5; interpretation 4/5; explanation 4/5; source notes 3/5. The portal shows the original total and five criteria. No previous task is confirmed comparable, so it does not draw a performance trend.

**Evidence and observations:**

| Evidence | Supported observation | Local ability and GLD theme | What it does not establish |
|---|---|---|---|
| Teacher-marked graph, page 2 | Chose a suitable chart after one prompt; omitted two units | `statistics`: following guidance; C/K | General mathematical ability, a QF level, or a future admission result |
| Notebook entries over three days | Recorded temperature at the agreed times with reminders | `observation`: following guidance; K/P | Independent performance across other contexts |
| Two-minute explanation recorded with permission | Explained a limitation and answered a classmate's question | `speaking`: independent in this context; C | A personality/confidence score |
| Child's voluntary reflection | “I enjoyed explaining the pictures more than collecting readings” | Interest statement about visual communication | Proof the child should abandon science |

**Next action:** within one week, revise graph axes/units and give a one-minute explanation of what the data cannot prove. Success evidence is the corrected graph plus the child's explanation, reviewed by the teacher. The corrected attempt remains linked to the first; it is not a new exam score. A second small data task in another context can later test transfer. The child may instead request a different format or more support.

**Possible directions:**

- **Route A: environmental/data investigation.** Try a supervised citizen-science or school investigation project, review relevant school subject options, and later identify specific science/data programmes. Formal entry assessment is `unknown`: no target programme/intake rules or actual leaving qualification are available.
- **Route B: visual communication/design.** Try a two-poster explanation of the same environmental issue, obtain audience feedback, build a small portfolio, and later compare design/media courses. Formal entry assessment is also `unknown`; the homework is portfolio exploration evidence, not admission evidence.
- **Route C: practical technical work.** Visit a supervised college taster or workshop, then compare a relevant diploma/higher-diploma route and its possible degree articulation. Keep bridging and transfer conditions as explicit future checks. This is an equal exploratory option, not a consequence or penalty for 17/25.

**Revision event:** the graph correction improves that task, and the child chooses another poster activity. A new draft adds one design experience while retaining the environmental route. It does not convert 17/25 to a percentage of “career readiness”, upgrade a QF level or delete an academic ambition. Family review records whether to adopt the draft and sets a four-week reflection date.

For rule-engine fixtures only, use a fictional programme with explicit synthetic requirements and sources: verified required grade exactly at threshold → `eligible`; verified lower grade → `not_demonstrated`; missing final grade → `unknown`; even with a passing grade, an unreviewed new requirement version → overall `unknown`. These fixtures must never appear as real institution advice.

## 9. Acceptance criteria

### Evidence and grades

1. Importing 17/25 preserves 17, 25, the original rubric and the source; zero, missing, exempt and pending display differently.
2. A missing result never becomes zero unless a recorded school policy explicitly supplies that grade.
3. Two assessments with equal denominators cannot automatically join a comparison series. A reviewer action and rationale are required.
4. A retake/correction preserves both attempts and uses only the attempt specified by the versioned school/admission policy.
5. AP, IB and HKDSE scales remain distinct; categorical labels such as 5** survive round-trip import/export unchanged.
6. A weighted aggregate with unknown policy or weights is unavailable; a valid aggregate shows policy, rounding, included records and coverage.
7. Clicking a skill summary opens the observations, exact evidence locators, support context and author. No stage appears without reviewed evidence.
8. Disputed observations remain visible to authorised reviewers but cannot silently establish a qualification/entry predicate. A withdrawal recalculates derived views.
9. All 50 catalogue IDs are represented exactly once in the mapping table. No mapping stores an awarded QF level. Unmapped-core abilities remain usable.
10. No screen/API field provides an overall child score, ethics score, popularity score or psychological diagnosis. Interest and attainment can disagree without either being overwritten.

### Requirements and pathway changes

11. A local-HKDSE requirement version does not evaluate an international/non-local application. Missing applicability returns unknown with a reason.
12. Required original/actual evidence cannot be satisfied by a prediction, simulation, unverified attachment or unreviewed extraction unless the rule explicitly permits that type and stage.
13. AND/OR/at-least truth tables pass all three-state combinations; exact-threshold, duplicate-result, retake and multi-sitting fixtures follow the declared rule.
14. Partial, changed or stale requirements prevent overall eligible status. The UI exposes stale-source date and known shortfalls without asserting final ineligibility.
15. Identical inputs, requirement versions and engine version produce identical results and explanation IDs; changes create a new evaluation rather than mutating the old one.
16. Academic eligibility, application readiness, credit transfer, offer and enrolment remain distinct. Expired application rounds do not invalidate earned grades or qualifications.
17. Every explanation links both the rule's authoritative source and the student's relevant evidence, with access controls enforced separately.
18. A draft route never becomes adopted automatically. Adoption checks the base-plan/input revision and fails cleanly when outdated.
19. A family can retain an aspiration despite a presently unmet requirement; alternatives show required steps and uncertainty without promised admission.
20. Scenario grades never enter actual transcripts, observations or awarded-qualification records. Scenario exports are visibly marked hypothetical.
21. Every adopted route has version history, reason, reviewer, child's recorded perspective and rollback. A deleted personal record is removed from derived views and retained snapshots according to the retention policy.
22. Student, sibling and family boundaries are enforced by the storage/API layer, including attachments and exports; hiding a panel is not authorisation.

## 10. MVP implementation order

First ship manual/CSV assessment entry with original scales, evidence uploads with review, the 50-ability catalogue, voluntary reflections and two or three family-authored aspirations. Add requirements through a small reviewed catalogue, three-state checks and versioned route drafts. Automated extraction, institution integrations and large-scale occupation-to-competency crosswalks follow only after provenance, permissions, correction and evaluation tests work. Source refresh is a review queue; it must not silently replace active rules.
