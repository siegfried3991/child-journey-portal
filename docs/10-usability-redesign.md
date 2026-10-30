# Family portal usability redesign

Research checked 30 October 2026. Applied to the independent private Cloudflare portal; the retained old Sites deployment is separate.

## Structure

Home is a short entry point, with three primary task groups:

- Current results → report cards, subject trends, assignments and exams, revision arrangements.
- University admissions → preparation routes, university choices, timeline and evidence, using the existing planner tabs.
- Activities and external exams → activity/summer learning records, achievements, external assessments.

Original documents and student settings are utility links. A subject is a third-level destination inside results. Keep existing school-results, applications and subject-trends hash links valid. Only the active primary group exposes its children. Opening a different group uses the existing unsaved-plan guard.

Activities and external exam screens surface the existing summer-learning and MAP records. They do not claim that general activity or exam-management workflows have been built. Achievements surface existing application-plan evidence. Revision arrangements surface existing next-step notes; external revision-system integration remains future work.

## Reading order

- Home: primary destinations, school-reported course marks, genuine pending items.
- Report card: populated columns only; subject names link to trends. Comments and originals on demand, not repeated per numeric cell. School-reported aggregate values remain labelled as reported.
- Subject overview: G7 onward annual table. Annual means retain a brief basis label.
- Subject detail: filters, chart, persistent selected-result panel, expandable equivalent data table, then optional calculation/source detail. Source identifiers do not dominate labels. Hover, tap, keyboard selection and previous/next controls use the same details panel. English branches may be isolated. Missing periods stay absent from the chart. Text grades remain inspectable without numerical conversion.
- Export: preserve visible values and PNG saving; local generation, no new data service.

## Design choices

Retain the existing forest-green family-archive identity, white reading panels, quiet grey-green rules and system Chinese/Latin font stack. Use larger marks and a stable reading panel as the emphasis. Align labels and tables left; reserve colour for series and selected state. Avoid adding scores, ability rankings, admission probabilities or arbitrary targets. Charts remain 0–100 and need no difficulty calibration claim.

## Research and application

- [NN/g: Progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/): important choices first, advanced/rare functions on demand. Applied as three task groups and collapsed source/method panels.
- [AERO: Engaging families in secondary school](https://www.edresearch.edu.au/guides-resources/practice-guides/engaging-families-support-student-learning-secondary-school): concise, personalised learning-focused updates. Applied as course marks and actual next steps rather than lengthy system descriptions.
- [EEF: Working with parents](https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/supporting-parents): learning-linked, positive dialogue. Applied as records supporting a discussion, without assigning a child a global score.
- [USWDS: Data visualizations](https://designsystem.digital.gov/components/data-visualizations/): common chart types, limited concepts, text alternatives and manual checks. Applied as line charts plus accessible equivalent tables and plain selected-value panels.
- [UK Government Analysis Function: Testing dashboards](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-testing-dashboards-for-design-and-accessibility/): legible labels, clear selection, consistent layout and underlying data downloads. Applied as enlarged point targets, persistent selection, keyboard controls, CSV and PNG exports.

These are design principles, not evidence that this particular portal improves attainment. Verify navigation, original marks, deep links, filtering, point inspection, mobile layout and exports against the live result before calling the redesign complete.
