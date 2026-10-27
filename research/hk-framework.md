# Hong Kong qualifications, competencies and education pathways

Research checked: 20 October 2026. Primary sources only. This is a product-design reference, not a qualification assessment or individual admissions recommendation. No student's curriculum, grades, residency or career choice has been assumed.

## 1. What 香港資歷評審 should mean in this product

Several distinct systems must remain separate in the interface and database:

| System | What it does | Appropriate portal use |
|---|---|---|
| 香港資歷架構 (HKQF) | Organises quality-assured academic, vocational, professional and continuing-education qualifications into seven levels | Describe a course or awarded qualification, and explain pathways |
| 資歷級別通用指標 (GLD) | Describes learning outcomes across four domains | Reference tags for designing evidence-based learning observations |
| 香港學術及職業資歷評審局 (HKCAAVQ) | Serves as Accreditation Authority and Qualifications Register Authority | Identify the responsible authority; link accreditation evidence |
| 資歷名冊 (QR) | Lists qualifications recognised under HKQF | Verify programme/qualification identity, level, credits and registration dates |
| 《能力標準說明》 (SCS) | Industry-specific competency specifications | Connect a career exploration to relevant professional tasks |
| 《通用能力標準說明》 (SGC) | Cross-industry competency references | Enrich communication, language, technology and numeracy learning goals |
| 職業階梯 (VQP) | Maps progression within occupational areas using required competencies | Source material for possible career route nodes |

The framework and institutional roles are described by [HKQF](https://www.hkqf.gov.hk/en/about-hkqf) and [HKCAAVQ](https://hkcaavq.edu.hk/en/accreditation/). The QF webpage notes exceptions for institutions with self-accrediting status, so the product must not imply that every registered university programme receives individual HKCAAVQ accreditation. SCS, SGC and VQP are explained in [HKQF's applications guide](https://www.hkqf.gov.hk/en/application-of-qf-deliverables).

**Product decision:** a child's homework, parent observation or portal badge must never be displayed as an awarded QF qualification. Use “參考香港資歷架構的學習範疇” and “校內／家庭觀察”; reserve “QF Level” and “QF credits” for verified recognised qualifications or their published requirements.

HKCAAVQ's separate **學歷評估 / Qualifications Assessment** service considers completed qualifications awarded outside Hong Kong. It provides an opinion on comparability with a Hong Kong qualification; it is not a daily developmental assessment. Its current guidance excludes, among other things, incomplete qualifications, professional-body memberships and work experience from that service. [HKCAAVQ assessment process](https://iportal.hkcaavq.edu.hk/process-of-assessment).

## 2. Use the four GLD domains as a reference lens

The current official QF page links the 2018 revised GLD. Its four Chinese headings are:

| Official domain | Proposed child-facing name | Example evidence, invented for this portal |
|---|---|---|
| 知識及智能 | 理解與思考 | Explains why an experiment produced a result and distinguishes observation from inference |
| 過程 | 方法與實踐 | Plans a fair test, uses materials safely and revises the procedure |
| 自主性及問責性 | 自主與責任 | Records what they did independently, seeks help appropriately and explains a mistake |
| 溝通、資訊及通訊科技及運算 | 表達、數碼與數理 | Presents a graph, cites a source and adapts an explanation for another audience |

Official labels: [資歷架構級別](https://www.hkqf.gov.hk/tc/qf-level). The examples and child-facing headings are our adaptation, not official GLD assessments.

The [2018 GLD and explanatory notes](https://www.hkqf.gov.hk/files/record/qf-lvl-resources/6/The%20revised%20GLD%20and%20the%20Explanatory%20Notes_Chi_April_2018-1703059802.pdf) distinguish levels through complexity, contexts, responsibility and performance. They describe qualifications, not a child's age or fixed intelligence. A strong essay alone cannot establish an overall QF level; similarly, a lower grade cannot reduce a child's identity or worth.

A useful private progress scale is therefore separate: **未有證據 → 在協助下嘗試 → 按指引完成 → 能獨立完成 → 能遷移及解釋**. Label this “本平台觀察階段”, not QF levels. Record task difficulty, support received, context, date and observer beside each observation. Let children and teachers disagree with a parent interpretation; keep both perspectives.

## 3. SCS and SGC: where the detailed abilities come from

SCS is structured as Units of Competency (UoCs), with code, level, learning volume, scope, performance expectations and assessment requirements. SGC currently covers communication skills, English, Chinese (including Cantonese and Putonghua), information technology and numeracy. VQP connects job roles and needed competencies. [HKQF applications](https://www.hkqf.gov.hk/en/application-of-qf-deliverables).

The current [communication SGC PDF](https://www.hkqf.gov.hk/files/record/fileupload/584/Communication_Skills-1745834040.pdf) is particularly relevant: it contains 26 units at QF levels 2–5 across interpersonal, team, organisational, digital, crisis and creative communication. Example reference codes include 111501L2 for active listening, 111503L3 for emotional understanding and empathy, 111505L4 for constructive feedback, and 111523L3 for storytelling. These are professional reference units; school activities may supply related evidence without satisfying their workplace assessment criteria.

Suggested crosswalk record:

```text
child_skill_id: listening
framework: HKQF_SGC
source_unit: 111501L2
relationship: related_learning_theme
official_assessment_claim: false
local_task: Summarise a teammate's idea before offering your own
evidence: teacher rubric + child reflection
```

This is a many-to-many, human-reviewed relationship. Do not equate an ILO occupation code with a QF level or infer that one hobby qualifies someone for an occupation. Keep the official unit's wording, version and URL separately from an age-appropriate local task.

The [ICT SCS page](https://www.hkqf.gov.hk/ict/en/scs) offers detailed branches and topic downloads, including software services, digital media, operations, AI, information security and data science. Its prose totals and displayed subtotals are not fully consistent in the current page. Import individual codes from the chosen source version, validate duplicates and counts, and do not hard-code an unverified total. No verified public bulk API was identified in this research.

## 4. Qualification levels, credits and recognition limits

The award-title scheme places associate degrees and higher diplomas at QF 4, bachelor's degrees at QF 5, master's degrees at QF 6 and doctorates at QF 7. Certificates and diplomas can span levels; the title alone is not enough to identify the level. Check the exact qualification record. [Official award-title scheme](https://hkqf.gov.hk/files/record/fileupload/454/HKQF_ATS_C_2012_10-1716697599.pdf).

One QF credit represents ten **notional** learning hours, including the learning and assessment effort expected for the outcome. This is a programme-volume measure, not an automatic reward for logging ten hours. [QF Credit](https://www.hkqf.gov.hk/en/qf-credit).

**資歷學分累積及轉移 (CAT)** can support recognition of prior learning and reduce repeated study. Admission and credit transfer remain separate decisions of receiving institutions. A route edge must therefore say “may apply / subject to assessment” unless a specific current articulation agreement establishes the terms. [CAT policy and 2024 guidance](https://www.hkqf.gov.hk/en/qf-cat).

**過往資歷認可 (RPL)** recognises workplace competencies of industry practitioners through appointed assessment agencies, with qualifications at QF levels 1–4. It is a later-life route, not a mechanism by which parents certify schoolchildren. Recognition of professional qualifications is another distinct assessed route; ordinary membership alone is insufficient. [HKQF assessment routes](https://www.hkqf.gov.hk/en/thru-assessment).

QR entries have registration validity periods. The product should retain the period applicable to the learner's intake, plus an immutable verification snapshot; an expired listing must not automatically erase a qualification already earned. The official upload guidance controls registration dates and stresses database accuracy. [QR guidance, November 2025](https://www.hkqr.gov.hk/HKQRPRD/export/sites/default/.content/attachment/en/VQ_QR-Guidance-Notes_PAA-Operators_en.pdf). Interpretation of an individual award remains with the provider/authority.

## 5. Education pathways to represent

The portal should support parallel routes and switches, not a single ranking from school to an elite university. EDB's current local-study overview includes degrees, subdegrees, vocational/foundation diplomas, in-service training, applied education and repeating Secondary 6. [EDB local further study](https://lifeplanning.edb.gov.hk/tc/study/local-further-study/).

| Route | Example progression | Rule to show beside the route |
|---|---|---|
| HKDSE academic | Senior secondary → suitable degree programme | Verify curriculum, subjects, admission year and local/non-local status |
| International curriculum | IB / GCE or International A-level / US school plus relevant external examinations → institution's international/direct route | Compare within that institution's accepted qualification rules; do not invent a universal grade conversion |
| Subdegree | Associate degree / higher diploma → employment, senior-year entry or top-up degree | Subsequent entry, credit exemption and duration depend on the receiving programme |
| Vocational/applied | VTC diploma/foundation route → higher diploma → relevant applied or other degree | Preserve required bridging courses and programme-specific admission conditions |
| Apprenticeship | Classroom study + employer training → assessed trade competence and further study possibilities | Verify trade, age, contract, programme and eligibility requirements |
| Alternative preparation | Applied education diploma or repeated school study → eligible further-study route | Show exact recognition scope and prerequisites |
| Change direction | Trial experience → new subject/course choice → revised route | Preserve completed transferable learning and record the student's reason |

The routes above are a design synthesis; they do not promise places or automatic credit transfer.

### HKDSE versus international applications

[JUPAS eligibility](https://web.jupas.edu.hk/en/eligibility/) requires relevant HKDSE results/registration and qualifying identity status, among other conditions. Applicants who do not qualify must check direct/non-JUPAS arrangements with each institution. The [official eligibility chart](https://www.jupas.edu.hk/f/page/267/SummaryChartonEligibilityforApplicationviaJUPAS_en.pdf) separates local/non-local status and combinations of results. Do not infer status from citizenship or school location alone.

As an example of why curriculum-specific rules matter, [HKU's international admissions page](https://admissions.hku.hk/apply/international-qualifications) distinguishes international and other national qualifications, with separate programme conditions. Its [2026 admissions standards](https://admissions.hku.hk/sites/default/files/2025-10/HKU-International-Admissions-Information-2026.pdf) differentiate IB, A-level and SAT/AP combinations and explicitly do not guarantee admission above published thresholds. That document is **2026-intake evidence**, not a rule to silently reuse for later admissions. The portal must link current intake pages and display “待更新” when the intended year is not yet published.

### Applied learning and career trials

Hong Kong **應用學習 (ApL)** is a senior-secondary elective offering practical and theoretical exposure. Its six study areas span creativity, media, business/law, services, applied science and engineering/production. EDB also lists junior and senior taster programmes, with school-mediated application processes. [EDB Applied Learning](https://www.edb.gov.hk/en/curriculum-development/cross-kla-studies/applied-learning/index.html). The 2026 event dates on that page are historical as of this report; they are examples of event types, not currently bookable recommendations.

Suggested portal experiences: observe a demonstration, interview a practitioner, complete a safe small project, then reflect on interest, energy, difficulty and desire to repeat. A single trial is exploration evidence, not a career verdict. Local school/provider accessibility must be checked individually.

### Vocational routes

[VTC admissions](https://www.vtc.edu.hk/admission/en) covers degrees, higher diplomas and vocational/foundation qualifications, with differing entry stages. [VTC Earn & Learn](https://apprenticeship.vtc.edu.hk/en/earn-and-learn-scheme/what-is-earn-and-learn-scheme) combines apprenticeship learning and employer participation with scheme support. Treat allowances as dated eligibility-dependent information, not guaranteed family income. A current [network engineering example](https://www.vtc.edu.hk/earnlearn/html/en/industry/s3/Information%20Technology%20-%20Network%20Engineering%20and%20Security.html) specifically requires relevant bridging courses for progression from its DVE-ELS qualification to higher diploma study; this is why route edges need conditions.

**應用教育文憑 (DAE)** is distinct from ApL. EDB's FAQ describes a QF 3 qualification for Secondary 6 leavers or adults meeting the age condition, with specified completion, language and articulation requirements. Its recognition comparisons with HKDSE depend on successful completion and, for mathematics inclusion, the Maths Plus course. Do not label it “a complete HKDSE equivalent”. The current page states a recognition period covering 2026/27–2028/29. [EDB DAE FAQ](https://www.edb.gov.hk/en/edu-system/other-edu-training/vocational-other-edu-program/Diploma%20of%20Applied%20Education/Frequently%20Asked%20Questions/index.html).

Applied degrees are a real option within the vocational/professional pathway: the [EDB announcement for the 2026/27 SSSDP cohort](https://www.info.gov.hk/gia/general/202509/09/P2025090900348.htm) includes designated applied-degree programmes. Admission, subsidies and professional accreditation must be checked per programme and intake.

## 6. Implementation requirements derived from the research

These are proposed product rules, not official framework prescriptions:

1. Keep five separate entities: school result; observed skill evidence; self-reported interest; course requirement; awarded qualification. Never average them into a single child score.
2. Preserve grades in their original scale, with subject, curriculum, assessment type, marking rubric, date, weight and evidence. Only calculate trends across explicitly comparable assessments.
3. Each pathway requirement stores: institution, programme, intake year, applicant category, required subjects, grade rule, language rule, application route, deadline/time zone, fees/currency, source URL, verified date, effective dates and reviewer.
4. Each edge stores whether it is an example, published possibility, formal agreement or confirmed individual offer. A counsellor may override a suggestion but must record why.
5. Route states: **有興趣 / 正在探索 / 已確認要求 / 正在準備 / 待覆核 / 已申請 / 已獲錄取 / 已轉向**. Do not call an aspiration “on track” if prerequisites or current evidence are unknown.
6. Recalculate a draft scenario after a new report card, subject change, location/budget change, missed deadline or change in interest. Show old/new differences and ask the child/family to adopt the revision; do not silently replace aspirations.
7. Treat wellbeing, belonging, ethics and service as their own evidence-rich areas. Record context, reflection, repair and next action. Do not issue a moral score, diagnose from behaviour, or equate extroversion with social skill.
8. Monthly family conversation: what was enjoyable, what became easier, what support is needed, what to try next. Termly pathway review; requirement refresh before a subject choice/application and whenever a cited source changes.
9. No automatic conversion from logged activity hours to QF credits, from local skill stages to QF levels, from ISCO skill level to school achievement, or from programme entry minimum to admission probability.

## 7. Source freshness and remaining gaps

- Research accessed 2026-10-20. The GLD is explicitly the 2018 revision; CAT links 2024 guidance. These are document editions, not research dates.
- Several HKQF pages show a generic last-revision footer of 7 July 2024 while containing later agency appointment dates or more recent linked files. Store each document's edition and access date independently; do not assume that footer proves the currency of every item.
- EDB local-study overview shows 16 September 2025 as its last modification. VTC example above says information as of May 2026. Admissions are intake-specific.
- The current communication SGC PDF was accessed through the live HKQF page; no explicit publication date was found in extracted text. Do not derive publication date from the URL timestamp.
- No validated complete machine-readable crosswalk exists in this research between ISCO occupations, HK SCS units and the portal's proposed child skills. Such mappings require an editorial review process and must remain labelled as interpretations.
- No individual QR programme was selected or credential verified. No automatic API, licence for bulk republication, institution integration or real student record was tested.
- Child age, curriculum, actual grades, residence classification, languages, learning support needs, interests and family budget are still needed before personalised pathways can be presented as actionable.
