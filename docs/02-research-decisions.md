# Research decisions and important boundaries

Checked 20 October 2026. Detailed source notes are in `research/ilo.md`, `research/hk-framework.md` and `research/platform.md`.

## Findings that materially change the design

1. **ILO is a work classification, not a developmental rubric.** Keep official codes for a reference index and use a separate child-friendly exploration taxonomy. A code can represent a cluster of jobs. Do not claim the demonstration includes all jobs.
2. **香港資歷評審 is not a single set of child traits.** HKQF, HKCAAVQ, QR, SCS, SGC, VQP, CAT and RPL have different purposes. Use exact terms. A school activity may relate to a competency theme without satisfying professional assessment conditions.
3. **Aspirations should change without being erased.** Store interest, exposure, demonstrated learning, application requirements and earned qualifications independently. Draft route changes from evidence and obtain human review before adopting them.
4. **A web portal fits the task better than an engine-first game.** Most interactions are forms, filters, tables, evidence and pathway comparisons. SVG is enough for the requested classroom illustration. Phaser is a free optional rendering layer if richer gameplay later earns its complexity. Godot remains technically possible but adds web-export constraints without solving the core problem.
5. **GitHub and WeChat address different problems.** GitHub can version code and research. A deployed authenticated app handles private student data. An H5 page can be designed for WeChat's browser, but real-device testing and account/domain checks are separate work. A Mini Program is an additional product, not a checkbox.
6. **Public guidance is not an individual admissions decision.** Requirements belong to a programme, intake and applicant category. Unknown evidence remains unknown. Minimum requirements do not predict offers. AP/IB/A-level/HKDSE scales must not be converted with an invented universal formula.

## Scope of this completed research

The investigation reviewed official ILO taxonomy and revision information; Hong Kong QF/GLD, assessment authority, register, competency specifications and pathway material; education-route examples; whole-person and career-guidance references; free-engine and modern web documentation; GitHub hosting boundaries; Tencent/Weixin integration issues; and relevant mainland/Hong Kong privacy guidance.

It produced a working sample portal, a product design, a proposed 50-ability catalogue, career-exploration examples, an evidence/pathway specification and a phased implementation plan. This is comprehensive product research within those boundaries, not a review of every occupation, every university, every national school system or every legal regime.

## Evidence limitations to carry into development

- No actual student record, curriculum, account, grade or interest was inspected. No school-platform integration exists.
- The full ISCO machine-readable corpus was not successfully retrieved by the research tools. Code examples are a reviewed seed; dataset rights and completeness remain ingestion work.
- Official Weixin developer pages were not retrievable in this run. Tencent documentation supports domain setup, but precise account entitlements and review conditions require verification in the eventual account.
- No physical iPhone/Android WeChat or mainland-network test has occurred. A mobile browser viewport is a design check only.
- No institution/programme was selected for a real application. Some linked examples concern a past or current intake; each source's applicable year must remain visible.
- No recognised qualification was verified for the student. QF-themed evidence tags are interpretations, not endorsements or equivalence determinations.
- Legal applicability depends on personal/family use versus service operation, geography and data flows. The research identifies boundaries and launch questions; it does not pronounce a universal compliance result.
- Technology choices are an engineering assessment. No head-to-head game-engine performance benchmark was run.

## Source handling

Keep URL, document title, issuing body, edition/publication date where known, accessed date, applicable intake, rights status and claim supported. Separate a document's revision date from the date it was retrieved. Mark a cached source stale when its intake changes. Keep official data separate from editorial mappings and record rationale/reviewer on each mapping. Do not republish entire third-party corpora until item-specific reuse terms are confirmed.

## What to build first

Start with a single-family private pilot: manually verified schoolwork, evidence attachments, student reflections, a small curated occupation set and two or three versioned routes. Make export, deletion, restore and household permissions work before integrations. Validate the experience with the student as well as the parent. Expand the occupation catalogue and detailed programme paths only as their sources and mappings are reviewed.
