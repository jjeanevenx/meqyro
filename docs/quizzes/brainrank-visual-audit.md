# BrainRank visual question audit

Audit scope: all 24 questions in `src/content/quizzes/brainrank.ts`, the generated SQL seed, database metadata, public contracts, scoring, React renderers, CSS, and the four supported locales.

## Summary

| Category | Count |
| --- | ---: |
| TEXTUAL | 5 |
| NUMERIC | 7 |
| LOGICAL | 8 |
| ROTATION | 1 |
| MATRIX | 1 |
| MIXED | 1 |
| COUNTING | 1 |
| Visual corrections required | 4 |
| Corrected | 4 |
| Removed for ambiguity | 0 |
| Pending | 0 |

The 20 non-visual questions remain text-based because their reasoning object is language, arithmetic, or symbolic comparison rather than a missing figure. BR_ATT_03 and BR_ATT_04 intentionally remain typographic attention tasks.

## Visual items

| Code | Type | Issue | Fix | Mobile | Desktop | Status |
| --- | --- | --- | --- | --- | --- | --- |
| BR_PAT_02 | ROTATION | Rule and answer were described in words | SVG arrow sequence and visual distractors | Pass | Pass | Fixed |
| BR_PAT_03 | MATRIX | Matrix was flattened into a sentence and font glyphs | Real 3×3 SVG matrix with a missing cell | Pass | Pass | Fixed |
| BR_PAT_04 | MIXED | Rule leaked; polygon reflection was visually ambiguous | Vertex progression plus alternating position marker, with four intentional distractors | Pass | Pass | Fixed |
| BR_SPD_01 | COUNTING | Font glyphs were embedded in the prompt; two figures tied for least frequent | SVG figure group with unique counts and visual answers | Pass | Pass | Fixed |

## Per-question classification

| Codes | Classification | Visual required | Result |
| --- | --- | --- | --- |
| BR_PAT_01 | NUMERIC | No | Pass |
| BR_PAT_02 | ROTATION | Yes | Fixed |
| BR_PAT_03 | MATRIX | Yes | Fixed |
| BR_PAT_04 | MIXED | Yes | Fixed |
| BR_LOG_01–04 | LOGICAL | No | Pass |
| BR_NUM_01–04 | NUMERIC | No | Pass |
| BR_ATT_01–04 | TEXTUAL | No | Pass |
| BR_PRB_01–04 | LOGICAL | No | Pass |
| BR_SPD_01 | COUNTING | Yes | Fixed |
| BR_SPD_02, BR_SPD_04 | NUMERIC | No | Pass |
| BR_SPD_03 | TEXTUAL | No | Pass |

Scoring remains server-owned and compares option IDs. Visual metadata never contains correctness, and accessibility labels identify options neutrally without describing orientation, count, or correctness.

Rendered QA passed at 360×800, 390×844, 430×932, 768×1024, 1366×768, 1440×900, and 1920×1080 with no horizontal overflow or console errors. Selection enables Continue, keyboard radio navigation works, and Back restores the selected option.
