# Academic module: rules and acceptance criteria

## Records

Student: display name, school, grade, curriculum and explicit demo flag. Term: academic year/name/start/end. Course: student and term links, name/code/teacher/level/credits, official report-card original/source and policy.

Assessment: stable ID; immutable student/term/course links; title/date/type/category; original grade and status; included/reviewed flags; retake attempt; source/external ID; feedback, next step, topics and comparable-series label.

## Calculation

Only active, included, reviewed, graded numeric records participate.

- Total points within category: sum(scores) / sum(maxima) × 100.
- Equal percentages within category: mean(score / maximum × 100).
- Category weights total 100%. Initial editable template: Homework 20%, Quizzes 20%, Tests 40%, Final exam 20%. Course total stays disabled until policy confirmation.
- Empty categories: withhold total until every positive-weight category is represented (default), or explicitly renormalise represented categories. Formula: sum(category percent × original weight) / represented weight.
- Show original-weight coverage. Coverage is NOT the proportion of all school work completed; unrecorded assignments are unknown.

Example: Homework 90%, Tests 70%, others empty → 60% coverage. Strict policy displays no total; available-category policy gives (90×20 + 70×40)/60 = 76.7%, provisional.

Pending/missing/absent/exempt never become zero. A teacher-assigned zero must be graded numeric 0 with a positive maximum. Exempt records are not counted as unfinished. Letter/comment grades are preserved without invented conversion. Optional school grade bands use unrounded percentages at thresholds.

Official report-card grades remain separate. No GPA inference from AP/Honors or credits; no assumed rounding/drop-lowest/extra-credit/best-retake policy. Retakes use separate attempts and explicitly chosen inclusion flags.

## Corrections and evidence

Creation/edit/archive/restore keeps a timestamp, revision and snapshot. Corrections need a reason; stale edits fail. Archiving removes a result from calculation and is reversible. Used categories cannot be removed, even for archived results.

Evidence is private PDF/JPEG/PNG, nominal maximum 10 files per result and 10 MB each. Content signatures are checked; this is not antivirus or authenticity verification. Uploading files does not create or alter grades automatically.

## CSV contract

Headers: `title,date,type,category,status,score_type,score,maximum,grade,include,feedback,next_step,topics,source,external_id,attempt,series`.

Required: title/date/type/category/status/score_type. Date is YYYY-MM-DD. Numeric graded rows need score/maximum; letter rows need grade; comment rows need feedback. Category accepts configured name or ID. Type: homework/quiz/test/exam/project/participation. Status: graded/pending/missing/absent/exempt. Score type: numeric/letter/comment. Include: true/false or 1/0 (default true); attempt defaults to 1.

Preview precedes explicit confirmation. Maximum 200 rows; validate all new rows before one database transaction. Invalid rows block confirmation. Dedupe is course + external ID when present; otherwise course/date/normalised title/type/attempt. Archived results also prevent duplicates. Existing records are corrected through editing.

CSV export follows current filters and adds reviewed/archived columns. Formula-like text is neutralised. CSV is not full-fidelity backup/restore. JSON export covers current records and attachment metadata only; files are downloaded individually, histories viewed per result.

## Acceptance criteria

| Scenario | Expected |
|---|---|
| Reload after saving | Data and corrections persist |
| Unequal maximum scores | Points and equal-percentage means differ correctly |
| Missing/pending/absent | Excluded, never silently zero |
| Actual numeric zero | Included as zero |
| Unreviewed record | Visible, excluded from calculation |
| Empty category | Policy respected, coverage visible |
| Duplicate import | No second stored record |
| Invalid batch row | No partial insert of new rows |
| Correction/stale edit | History added / conflict returned |
| Archive/restore | Excluded / included according to flags |
| Protected evidence | Owner can download; anonymous request rejected |
| Small viewport | Usable controls, tables scroll within their panel |

The term view is not an official transcript or validated predictor of future attainment.
