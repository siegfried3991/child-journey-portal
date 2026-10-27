# 成長志 / Child Journey — research-led product design

Prepared 20 October 2026. This is a fresh design for the expanded brief, with a working synthetic demonstration. The previous starter pack remains intact. The 50 proposed Chinese abilities have been retained as editable product vocabulary; they are not official game attributes or a psychometric instrument.

## Decision in one paragraph

Build a private, mobile-first **learning and life-planning portal with a light game-like presentation**. The home page should answer: **What is happening now? What is changing? What does the student want to explore? What is the next useful step?** Use ILO ISCO-08 as the occupation reference, Hong Kong QF/SCS/SGC as qualification and competency reference material, and dated schoolwork, projects, feedback and student reflections as the actual evidence. Use ordinary web components and original SVG scenes first. Keep several possible futures visible and revise plans together when interests, circumstances or results change.

## What “based on ILO and 香港資歷評審” means

There is no single official framework that measures a child's whole development and maps it mechanically to a career. The product therefore needs separate layers:

| Layer | Official or proposed? | It answers | It must not imply |
|---|---|---|---|
| ILO ISCO-08 occupations | Official reference | What types of work exist, and what tasks do they involve? | A career-fit score, intelligence ranking or complete industry list |
| HKQF and qualifications register | Official reference | What recognised qualification is this, at which level, for which period? | That a parent or this app can award a qualification |
| SCS / SGC / vocational pathways | Official reference | Which work-related competencies and progressions are described? | That school activities satisfy professional assessment requirements |
| 50 child skills and 15 exploration families | Original product design | What can this student practise and try? | An ILO/HKCAAVQ-endorsed child assessment |
| Evidence and aspirations | Student/family/school records | What actually happened, what does the student think, what next? | A permanent label or guaranteed future outcome |

ISCO-08 contains 10 major groups, 43 sub-major groups, 130 minor groups and 436 unit groups; a unit group can contain numerous job titles. Its skill levels describe occupational requirements, not the child's personal level. The published revision timetable targets discussion of a near-final draft in 2028. Continue using an explicit ISCO-08 version until a successor is actually adopted and migrated. [ILO overview](https://isco.ilo.org/en/isco-08/), [revision programme](https://isco.ilo.org/en/news/).

The Hong Kong qualifications system has seven levels. Its GLD domains are **知識及智能；過程；自主性及問責性；溝通、資訊及通訊科技及運算**. These provide a useful organisation of evidence, but official qualification recognition and daily learning observations need different records and visual labels. [Hong Kong QF levels](https://www.hkqf.gov.hk/tc/qf-level).

## The student should remain a person, not a total score

The homepage should show eight complementary areas. They need different forms of evidence rather than a universal 0–100 score:

| Area | What to retain | Useful display and next action |
|---|---|---|
| Academic learning / 學業 | Subject, curriculum, task, attempts, original grade/rubric, feedback and correction | Comparable subject trend; unfinished tasks; one specific misconception to address |
| Inquiry and making / 探究與創作 | Questions, experiments, drafts, prototypes and explanations | Before/after work; what changed and why |
| Communication / 表達與溝通 | Writing, speaking, listening, audience and language context | Evidence cards showing independence and the next challenge |
| Relationships / 人際與歸屬 | Contextual cooperation, listening, conflict repair and student perspective | Narrative examples; discuss support and belonging, not popularity counts |
| Values and responsibility / 價值與責任 | Decisions, reasons, commitments, effects on others, reflection and repair | A reflective journal; never a morality, obedience or loyalty score |
| Self-management / 自主與調適 | Planning, help-seeking, organisation and strategies tried | A small routine to test; record environmental support, not blame |
| Daily life and wellbeing / 生活與身心 | Optional student check-in, rest, activity, practical independence and support preferences | Conversation prompts and manageable workload; no diagnosis from grades or behaviour |
| Exploration and purpose / 興趣與方向 | Exposure, actual experience, interest before/after, values and aspirations | Breadth of opportunities and a next experience; keep uncertainty legitimate |

CASEL identifies self-awareness, self-management, social awareness, relationship skills and responsible decision-making as interconnected areas of social-emotional learning. These can inform the questions the portal asks; the proposed interface is not a validated CASEL assessment. [CASEL framework](https://casel.org/CASEL-sel-framework-11-2020/).

Hong Kong EDB describes life planning as ongoing self-understanding, planning, reflection and revision connected to whole-person development. Its values-education guidance supports contextual discussion and judgement. The portal should let a family or school select relevant values and retain their source, rather than treating all cultural, civic or political attitudes as measurable attributes. [EDB life planning](https://lifeplanning.edb.gov.hk/en/school-administration/what-is-life-planning.html), [EDB values education](https://www.edb.gov.hk/en/curriculum-development/4-key-tasks/moral-civic/).

## Screen design

### 1. 成長總覽 — the home screen

Use an original classroom/home/community illustration, with an age-appropriate avatar and a configurable school emblem on the right. The demonstration uses a fictional 15-year-old and a fictional emblem. A production scene follows a timetable or manual setting; it is not proof of the student's physical location. On small screens the scene becomes a short banner and essential records remain ordinary selectable text.

The first screen contains: current chapter or exploration theme; a short quotation written by the student; imminent tasks; the latest actionable feedback; evidence coverage across domains; the next low-cost experience; and a link to compare future routes. “12 of 50 skills have evidence” is a coverage indicator, not “24% of a complete person”. No radar chart is used to imply that incomparable qualities share a measurement scale.

### 2. 學習記錄 — from individual homework to patterns

Record homework, tests and examinations independently. Preserve absent, exempt, ungraded, late, missing, submitted and graded as distinct states. Keep raw numerator/denominator or school grade; a B+ and 34/40 should not silently become a blended average. Teachers' weighting and conversion rules belong to a specific course, not a universal setting. Resits and corrections are linked attempts, not extra independent tests.

Clicking an item opens original evidence, teacher feedback, linked learning objectives, the student's reflection, support received and the next action. Charts compare explicitly comparable series and show sample size and assessment dates. A changed syllabus, grading scale or assessment difficulty should break or annotate a trend.

### 3. 能力圖鑑 — 50 Chinese abilities

Group abilities into eight manageable areas; show all 50 on demand, not all on the homepage. An observation captures task, date, context, observer, student response, support and limitations. Proposed descriptions such as “with guidance”, “independent in this task” and “transferred to a new situation” remain separate from QF levels. Missing evidence is not low ability.

The existing original list includes reading/writing/listening, reasoning/experimentation, programming/making, art/design, planning/reflection, empathy/cooperation, daily-life skills and movement. The detailed bilingual catalogue accompanies the project as JSON and in this report. The labels may be renamed with the child; no ability should become a fixed identity.

### 4. 職業探索 — the work world as discoverable territories

Provide a complete official major-group index and an editorial activity-led navigation. The demonstration has 15 exploration families with selected unit-code examples; it is not the complete ISCO catalogue. Occupations can appear in several families. Keep industry, sector, occupation, work setting and skills as separate tags; a hospital employs many kinds of workers.

Every territory should offer a low-cost home/school activity, a practitioner conversation, a visit or workshop type, an age-adjusted project and a reflection prompt. Public-service and armed-forces occupation references can be explained in the full index without making weapons or combat activities part of child exploration. Paid activities should not receive more status than accessible school/community alternatives. Show costs, access needs, travel, language, adult supervision and eligibility before suggesting a real event.

Research supports repeated exploration, experiences of work and conversations about futures. The OECD evidence is largely associative and cannot establish that any particular activity will cause success for this child. [OECD career guidance](https://www.oecd.org/en/topics/career-guidance.html).

### 5. 未來路線 — several futures, visible conditions

Start with the student's statement: “I want to make useful things”, “I care about animals”, “I enjoy explaining”, or “I am still exploring”. Translate it into two or three candidate routes with a shared near-term experiment, not a prematurely fixed job.

Show each route as: **now → subject/experience choices → programme/training → subsequent options**. Each link has conditions, source, intake year, review date, cost/time considerations and uncertainty. Display academic, applied/vocational, apprenticeship and exploratory routes without status ranking. Course entry, credit transfer, professional recognition and actual offers are different milestones.

When new results or circumstances arrive, generate a proposed change with its reason and alternatives. The student/family review it, retain the old version, and can reverse the decision. A low result should first prompt attention to learning needs, context and support; it should never silently erase an aspiration. See the evidence-and-pathways specification for the exact rules.

### 6. 家庭回顧 / portfolio — production feature

A weekly five-minute view: one accomplishment, one difficulty, one request for support and one next step. A term review: compare work samples and revisit route assumptions. Student-authored reflections stay visibly distinct from teacher/parent observations. Formal sharing is an intentional, scoped export with expiry and preview; grades and private notes are absent from a default WeChat share card.

## Gentle game mechanics

Borrow the feeling of chapters, an explorable map, quests, a journal and visible completed projects. Do not reuse commercial assets or make achievements depend on relentless daily streaks. The demo deliberately has no numerical “total level”. A future reward can acknowledge completing a reflection or trying something new, with no inference that more clicks or hours equal skill. No public leaderboard, paid-experience multiplier, punishment for rest, or permanent label from a bad week.

## Personalisation assumptions and open inputs

The demonstration is Traditional Chinese and uses invented secondary-school records. It does not identify the user's child, curriculum or school. The first real configuration needs age/year, curriculum, current subjects, reporting scales, student interests, target regions, languages, learning/access supports, household time/budget, who can see what and whether the app is for one family or a school. Residency/application category must be verified for admissions routes, not inferred from school location.

Prototype decisions do not require those answers. Personalised admission routes and real-data deployment do.

## Definition of success

A parent can understand the present situation within one minute; a student can see their own voice and choices; every suggested action has an explanation; every purported qualification or admission rule has a source; and the family can change direction without losing history. Launch success is demonstrated with observed usability and secure record handling, not the number of badges issued.
