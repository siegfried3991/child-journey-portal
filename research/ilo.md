# ILO occupation reference and child exploration design

Research checked: 20 October 2026. All examples concern a fictional learner. Proposed Chinese labels, exploration families, mappings, activities and product rules below are editorial design, not an ILO standard, assessment or endorsement.

## 1. What the portal should take from ILO

Use **ISCO-08** as the versioned reference for occupations. Its hierarchy contains **10 major groups, 43 sub-major groups, 130 minor groups and 436 unit groups**, represented by one to four digits. A unit group can include several occupation titles; 436 is therefore not a count of every individual job title. ISCO classifies work by tasks and duties, with skill level and specialization helping organize the structure. It does not assess an individual child's character, interests, intelligence or future success. [ILO ISCO-08 overview](https://isco.ilo.org/en/isco-08/)

The official revision page still describes work in progress: a near-final draft is scheduled for discussion at the **2028** International Conference of Labour Statisticians, with availability intended for the **2030** census round. This is a published timetable, not proof of future adoption. I found no adopted replacement in the official sources checked. Keep the data model ready for a new version rather than inventing “ISCO-2026”. [ILO revision notice](https://isco.ilo.org/en/news/)

**Occupation and industry are separate dimensions.** Occupation concerns what a person does; industry concerns the economic activity of the establishment. A software developer can work in a hospital, bank, school or games studio. Store occupation codes separately from optional industry codes; the child-facing exploration categories below deliberately cut across both. [ILOSTAT on economic activities](https://ilostat.ilo.org/methods/concepts-and-definitions/classification-economic-activities/)

## 2. All ten major groups, displayed neutrally

The following Traditional Chinese labels are our explanatory translations of the official English headings, not a claim to be official ILO Chinese terminology. Preserve the English canonical label in the reference database after licensing/import review. These are work categories, not a ranking of people's worth.

| Code | Proposed Chinese label | Portal presentation note |
|---|---|---|
| 1 | 管理人員 | Organizing people and resources appears across many exploration families. |
| 2 | 專業人員 | Include the work involved, not just prestigious titles. |
| 3 | 技術員及輔助專業人員 | Show technical and practical routes alongside university routes. |
| 4 | 文書支援人員 | Include coordination, accurate records and information services. |
| 5 | 服務及銷售人員 | Include care, hospitality, retail and public service contexts. |
| 6 | 農林漁業技術人員 | Include cultivation, stewardship and food systems. |
| 7 | 工藝及相關技術工人 | Make skilled making, maintenance and repair visible. |
| 8 | 廠房及機器操作員、裝配員 | Explore systems and production through safe models and visits. |
| 9 | 基層職業 | Avoid “unskilled” in child-facing copy; describe the actual work respectfully. |
| 0 | 軍人職業 | Retain for classification completeness; learning activities focus on history, service and civic discussion. |

Source for membership and codes: [ILO overview](https://isco.ilo.org/en/isco-08/) and [ISCO-08 Volume I](https://www.ilo.org/ilostat-files/ISCO/newdocs-08-2021/ISCO-08/ISCO-08%20EN%20Vol%201.pdf).

## 3. Proposed fifteen exploration families

These are **child-friendly navigation**, separate from ISCO. Mappings identify relevant examples or portions of the referenced groups, not a declaration that every occupation within a broad group belongs to that family. A single occupation can appear in several families. Store separate mapping rows with scope, reason, source and reviewer. Codes below were checked against the official structure/Volume I; no full occupational corpus has been imported.

| Family | Subfamilies and example roles | Illustrative ISCO links | First practical experience | Reflection prompt |
|---|---|---|---|---|
| 科學與探索 | Natural science, mathematics, laboratory work, field research | Major 2/3; sub-major 21/31 | Ask a testable question about paper airplanes or plant growth; record results and one source of error. | Did I enjoy asking the question, collecting data or explaining the result? |
| 數碼與人工智能 | Software, data, networks, digital products, responsible AI use | Major 2/3; 25/35; minor 251; unit 2512 | Build a small quiz or useful webpage; ask two people to try it; fix one problem. | Did I enjoy building, testing, explaining or helping the user most? |
| 工程、製造與能源 | Mechanical/electrical systems, manufacturing, maintenance, energy | Major 2/3/7/8; 21/31/72/74/81/82 | Build a cardboard bridge to a material budget, test it, redesign it. | Was debugging frustrating, satisfying, or both? What did I change? |
| 建築、空間與城市 | Architecture, landscape, planning, construction, surveying | Major 2/3/7; 21/31/71; minor 216; unit 2161 | Measure a room; draw a scale plan; redesign one area for accessibility. | Whose needs did my design meet or miss? |
| 醫療、健康與照護 | Medicine, nursing, allied health, laboratory support, care | Major 2/3/5; 22/32/53; minor 221; unit 2211 | Attend a qualified youth first-aid session or interview a consenting health worker about their day. | Do I enjoy science, practical care, communication, or some combination? |
| 教育、心理與助人 | Teaching, learning support, psychology, social work | Major 2/3/5; 23/34/53; minor 263 | Teach a younger learner a chosen skill, seek feedback, then try a different explanation. | How did I notice that the other person did or did not understand? |
| 法律、公共事務與社會 | Law, policy, history, public administration, protective services | Major 1/2/3/5; 11/26/33/54; minor 261; unit 2611; optional group 0 reference | Run a mock council on a school issue using several viewpoints and evidence. | Could I explain a view I disagreed with fairly? |
| 商業、金融與創業 | Accounts, enterprise, marketing, purchasing, management, retail | Major 1/2/3/4/5; 12/24/33/43/52 | Design a supervised school fair stall with a simple budget and customer interviews; use pretend money if needed. | Did I prefer making the offer, understanding people, keeping records or organizing? |
| 視覺藝術、設計與工藝 | Painting, illustration, graphic/product design, textiles, craft | Major 2/3/7; minor 216/265/343/731; units 2166/2651 | Answer a real design brief, make two drafts, exhibit them and explain one revision. | Do I enjoy expression, solving a user's problem, or the craft of making? |
| 表演、音樂與舞台 | Acting, music, dance, stage production, sound/light support | Major 2/3/7; minor 265/343/352/731; unit 2655 | Produce a three-minute performance; rotate performer, director and backstage roles. | Which role energized me, and would I repeat the rehearsal work? |
| 語言、媒體與文化 | Writing, journalism, translation, museums, libraries, heritage | Major 2/3/4; minor 262/264/343/441 | Interview a consenting adult; check two claims; produce a short article, podcast or bilingual museum label. | Did I prefer research, listening, writing, editing or presenting? |
| 自然、農業與動物 | Growing food, conservation, forestry, fisheries, animal care | Major 2/3/5/6/9; 21/31/51/61/62/63/92 | Grow a small herb crop, log care and conditions, compare methods; visit a supervised farm or nature centre. | Did I enjoy patient routine care as well as the visible result? |
| 餐飲、旅遊與款待 | Cooking, food production, visitor experience, guiding, hotel operations | Major 1/3/4/5/7/9; 14/42/51/75/94; minor 343; unit 3434 | Plan and prepare an age-safe family meal or a local visitor itinerary with budget and access needs. | Did I like preparation, serving people, explaining a place or coordinating details? |
| 交通、物流與營運 | Transport, aviation/marine roles, dispatch, stock, delivery systems | Major 1/3/4/8/9; 13/31/43/83/93; minor 315/432 | Design a delivery route for a toy town with time and capacity constraints; visit a transport museum. | Did I enjoy sequencing, maintaining accuracy or solving disruptions? |
| 運動、康樂與生活服務 | Coaching, fitness, recreation, event support, personal and community services | Major 1/3/4/5/9; 14/34/41/44/51/91/96; minor 342 | Help plan an inclusive games session; rotate participant, coach and organizer; gather feedback. | Did I most enjoy performing, teaching, adapting activities or looking after the group? |

Occupation references: [ILO structure download page](https://www.ilo.org/resource/isco-08-structure) and [Volume I](https://www.ilo.org/ilostat-files/ISCO/newdocs-08-2021/ISCO-08/ISCO-08%20EN%20Vol%201.pdf). Family names, grouping, tasks and questions are original proposals. They are broad starting coverage, not a finished crosswalk for every unit group.

## 4. Age adaptation and fair access

Use the learner's actual maturity, access needs, consent and school arrangements to adjust these indicative age bands. They are product defaults, not developmental norms.

| Stage | Suitable form | Typical output |
|---|---|---|
| About 6–9 | Play, short demonstrations, family interviews, supervised making, local visits | A drawing, photo of work, voice reflection or one sentence. |
| About 10–13 | Small projects, clubs, structured visits, practitioner talks, teamwork with rotating roles | A small artifact, process notes and a short “try again / curious / not for now” reflection. |
| About 14–17 | Longer projects, practitioner interviews, supervised job shadowing, permitted volunteering and work experience | Portfolio evidence, task/working-condition reflection, questions about qualification routes, next experiment. |

Every family should include a free/home-based option and a low-cost community option. Lack of opportunity is not lack of interest or ability. Do not use expenditure, prestigious provider names or number of paid camps as a progress score. Offer simulation or remote practitioner discussion when a workplace visit is unavailable. For health, construction, machinery and sensitive services, use safe demonstrations or supervised observation instead of exposing the child to professional hazards or confidential records.

ILO career-development materials include career information, mentoring and work exposure as parts of a broader support system. OECD research links teenagers' exploration, workplace exposure and career conversations with later outcomes; these are associations, not individual predictions. The OECD job-shadowing guide commonly discusses ages 13–16, so use formal school/provider safeguards for such visits rather than making them a default for young children. [ILO career development](https://www.ilo.org/career-development-systems), [ILO 2024 handbook](https://www.ilo.org/resource/other/handbook-career-development), [OECD career preparation 2025](https://www.oecd.org/en/publications/the-state-of-global-teenage-career-preparation_d5f8e3f2-en/full-report/component-9.html), [OECD job-shadowing guide](https://www.oecd.org/en/publications/job-shadowing_614f4e25-en.html).

## 5. How this becomes a progress portal

Keep **exposure, interest, demonstrated performance and future plans** separate. A child can be interested but inexperienced, competent but uninterested, or undecided. A suggested record contains:

- Family and optional occupation links; activity date and form; opportunity/access context.
- Child's interest before and after: curious / enjoyed parts / want to repeat / not for now / unsure; no forced answer.
- A concrete artifact or observation, with author and visibility permissions.
- Two or three linked capabilities, each judged against an explicit task rubric; no automatic capability increase because an activity was attended.
- Support needed, degree of independence, feedback and next action.
- Child reflection and adult observation as separate voices, with disagreement retained.

Show exploration breadth as “6 of 15 families tried” only if useful, with an explanation that it is coverage rather than a target or ranking. Within a family, show the chronology and quality of experiences. A current aspiration should be an editable hypothesis, for example “I want to design things that help people,” which can connect to design, engineering, health and community work.

Do not map a school mark directly to an ISCO skill level. Do not infer a fixed career, diagnose traits, produce a universal “career fit percentage”, rank children, or assign a moral score. The portal can explain “This experiment suggests you enjoyed user research; try another project” while keeping its evidence visible.

When circumstances or results change, propose a review: retain the original aspiration, identify the particular requirement affected, distinguish a temporary learning gap from a formal eligibility rule, offer alternative routes, and ask the child/parent/counsellor to select the next plan. A weak exam should never silently delete a career option.

## 6. Import, provenance and licensing

The official [ISCO-08 page](https://isco.ilo.org/en/isco-08/) links to an Excel structure/definitions file, occupational-title index, skill definitions, CSV structure and Volume I. Use a controlled import from the official file, never scrape a random career website or hand-generate the whole taxonomy.

Recommended tables:

1. `reference_release`: publisher, scheme, version, original release, retrieval date, source URL, file checksum, rights notice, licence review state.
2. `occupation_node`: release ID, **string code** preserving leading zeros, hierarchy depth, parent code, canonical title, source locator. Keep translated labels and translation review separately.
3. `occupation_alias`: localized job title and disambiguation note, linked to node; identify national variants separately.
4. `exploration_family`: our ID, localized label, description, family version.
5. `family_occupation_link`: family ID, occupation code, mapping type, scope (`whole_group` or `selected_examples`), rationale, editor, reviewed date.
6. `reference_concordance`: old and new version codes, relationship and source. Preserve historic records; never silently overwrite a recorded code when ISCO changes.

Validate unique codes, complete parent chains, leading zeros, level counts and sampled task descriptions. Use the official occupational-title index and descriptions to resolve ambiguities; titles alone are insufficient. The 2023 companion guide is the implementation reference. [ILO companion guide](https://www.ilo.org/publications/international-standard-classification-occupations-isco-08-companion-guide)

**Rights require file-level verification.** ILO's policy generally applies CC BY 4.0 to qualifying publications/data from 3 May 2023 onward, but older material is not automatically relicensed. Volume I is copyright 2012; a recent upload/crawl date does not change that. Before bundling the full old taxonomy or extensive definitions/translation in a public repository, check the specific dataset terms and obtain clarification/permission if required. Keep source attribution and the prescribed non-endorsement/translation notices where applicable; do not use the ILO emblem as portal branding. This is a release dependency, not a reason to stop designing original activities or showing limited references. [ILO rights policy](https://www.ilo.org/rights-and-permissions)

## 7. Verification limitations and source anomalies

- This research verified the published structure, revision notice and selected code references. It did **not** download, validate or licence-clear a complete 436-unit database.
- The CSV and Excel download links on the current overview returned a tool fetch error during this run. The overview, official PDF structure and Volume I were readable. Retry and checksum the data files during implementation.
- The official resource/history page encountered in search included older draft counts (131 minor / 425 unit groups), whereas the current overview and Volume I give 130 / 436. Use the final structure, not a search snippet.
- The overview's table currently shows skill level 2 for major group 9; the published classification associates elementary occupations with skill level 1. Avoid copying this summary table uncritically; the portal should not expose occupational skill levels as child scores in any event.
- A regional ILO structure PDF appears to repeat “Police inspectors and detectives” at 3411; use Volume I/current canonical definitions for that record and any import validation. The examples in this design do not rely on 3411.
- The revision page describes a future timetable and may lag working-group activity. Recheck before production release and when preparing a new reference version.

## 8. Source ledger

All checked 20 October 2026. Titles and publication dates below refer to the document itself where available, not search-engine crawl dates.

| Source | Purpose | URL |
|---|---|---|
| ILO ISCO-08 overview | Counts, hierarchy, concepts, download entry point | https://isco.ilo.org/en/isco-08/ |
| ILO revision notice | Planned 2028/2030 milestones | https://isco.ilo.org/en/news/ |
| ISCO-08 Volume I, 2012 | Canonical definitions, sample codes, copyright page | https://www.ilo.org/ilostat-files/ISCO/newdocs-08-2021/ISCO-08/ISCO-08%20EN%20Vol%201.pdf |
| ILO structure resource, 13 Sep 2014 | Readable structure download; validate anomalies against Volume I | https://www.ilo.org/resource/isco-08-structure |
| ILO companion guide, 3 Oct 2023 | Implementation guidance | https://www.ilo.org/publications/international-standard-classification-occupations-isco-08-companion-guide |
| ILOSTAT economic-activity classification | Industry dimension | https://ilostat.ilo.org/methods/concepts-and-definitions/classification-economic-activities/ |
| ILO rights and permissions | Dataset/publication reuse rules | https://www.ilo.org/rights-and-permissions |
| ILO career-development systems | Work exposure and broader guidance | https://www.ilo.org/career-development-systems |
| ILO handbook, 12 July 2024 | Adaptable youth-oriented guidance framework | https://www.ilo.org/resource/other/handbook-career-development |
| OECD teenage career preparation, 20 May 2025 | Evidence for exploration, experience and reflection | https://www.oecd.org/en/publications/the-state-of-global-teenage-career-preparation_d5f8e3f2-en/full-report/component-9.html |
| OECD job shadowing, 17 Nov 2022 | Teen workplace-exploration design | https://www.oecd.org/en/publications/job-shadowing_614f4e25-en.html |

## 9. Prototype dataset validation — 20 October 2026

Reviewed every illustrative code in `dist/families.json`: **15 product families, 43 distinct four-digit ISCO-08 unit codes**. All 43 are present in the official classification. The product families intentionally differ slightly from the proposed research taxonomy above; both are editorial navigation layers. The roles are example occupations or concise Chinese explanations, not complete official unit-group titles or an official Chinese translation.

| Prototype family | Unit codes checked |
|---|---|
| 自然科學與研究 | 2131, 2113, 3141 |
| 工程與建造 | 2142, 2161, 3112 |
| 數碼與運算 | 2512, 2511 |
| 設計與視覺藝術 | 2163, 2166, 2651 |
| 環境與農業 | 2133, 6113 |
| 健康與照顧 | 2211, 2221, 5322 |
| 教育與社會服務 | 2341, 2635, 5311 |
| 法律與公共服務 | 2611, 2422, 5411 |
| 表演與媒體敘事 | 2655, 2652, 2642 |
| 商業與創業 | 2431, 1420, 5223 |
| 財務與行政 | 2411, 4110, 4311 |
| 餐飲與旅遊服務 | 5120, 5113, 4224 |
| 工藝與維修 | 7115, 7411, 7231 |
| 運輸與生產系統 | 4323, 8332, 8219 |
| 運動與戶外生活 | 3422, 3421, 3423 |

Sources: [Official ILO structure resource](https://www.ilo.org/resource/isco-08-structure), [downloaded-structure PDF](https://www.ilo.org/sites/default/files/wcmsp5/groups/public/%40americas/%40ro-lima/%40sro-port_of_spain/documents/genericdocument/wcms_306837.pdf), and [Volume I](https://www.ilo.org/ilostat-files/ISCO/newdocs-08-2021/ISCO-08/ISCO-08%20EN%20Vol%201.pdf), including the structure and the 8332/8219 descriptions at PDF pages 344/341 (one-based). This confirms code existence and the fit of the illustrated role, not a complete task-level assessment standard, crosswalk or curriculum.

Clarified overly broad labels in the JSON, including research technician → non-medical life-science technician; technician → civil-engineering technician; doctor → generalist; care worker → home-based care worker; teacher → primary teacher; mechanical repair worker → motor-vehicle repair worker; vehicle operator → heavy-truck driver; assembler → residual other assemblers. Also clarified retail management, shop sales, transport clerical work and building electrical work. Kept 5120 as a cooking-worker example distinct from 3434 in the research examples. No codes were added or removed.

### Precise coverage limits

| Major group | Number of prototype unit codes | Status |
|---|---:|---|
| 1 管理人員 | 1 | Illustrated |
| 2 專業人員 | 21 | Illustrated |
| 3 技術員及輔助專業人員 | 5 | Illustrated |
| 4 文書支援人員 | 4 | Illustrated |
| 5 服務及銷售人員 | 6 | Illustrated |
| 6 農林漁業技術人員 | 1 | Illustrated |
| 7 工藝及相關技術工人 | 3 | Illustrated |
| 8 廠房及機器操作員、裝配員 | 2 | Illustrated |
| 9 基層職業 | 0 | No unit-code example in prototype |
| 0 軍人職業 | 0 | No unit-code example in prototype |

The report's ten-group reference list is complete at major-group level; the UI's example occupation dataset covers **8 of 10 major groups and 43 of 436 unit groups**. It must not be described as all occupations or a complete ILO crosswalk. Group 9 can later be represented respectfully through appropriate community-services examples, while group 0 can remain a neutral reference entry without youth recruitment or weapons activities. The sample is weighted toward professional occupations; broader research should add trades, care, service, agricultural, operations and community work instead of treating this sample distribution as the child's ideal future.
