# Design QA — BrainRank “Campo Cognitivo”

**Source visual truth:** `C:\Users\ingev\.codex\generated_images\01a0d6e2-4c8b-7162-ae48-9ef52e5fe5a3\exec-c40ded72-3f0d-47f7-bc9b-cfbf06b43783.png`  
**Implementation:** `http://127.0.0.1:4173/`  
**Browser comparison evidence:** `http://127.0.0.1:4173/qa.html` (reference and browser-rendered implementation in one frame)  
**State:** landing, iPhone runtime, PT-BR  
**Viewport:** browser 1400 × 1200; phone screen measured at 393 × 852 CSS px, deviceScaleFactor 1  
**Source pixels:** 852 × 1856; normalized in comparison to 426 × 928 (0.5×)  
**Implementation pixels:** live browser render at 393 × 852 CSS px inside protected device frame

## Findings

No actionable P0, P1 or P2 differences remain.

- Fonts and typography: Manrope reproduces the geometric, high-contrast hierarchy; weight, wrapping and letter spacing match the selected direction closely. Runtime status typography is intentionally template-owned.
- Spacing and layout: brand, hero, fact row, six dimensions and CTA retain the source order and visual rhythm. The protected phone frame reduces the apparent canvas slightly but does not change app-owned hierarchy.
- Colors and tokens: near-white, navy, cobalt and mint map consistently to the source. Contrast remains legible.
- Image quality: the hero is a dedicated 900 × 1200 raster asset derived from the selected direction; crop and blue technical overlays match the source. No CSS/div art substitutes the portrait.
- Copy and content: required BrainRank copy, duration, free-result promise, CTA and disclaimer are present.
- Icons: one Radix icon family is used consistently; no handcrafted SVG or text-glyph substitutes.
- Accessibility: semantic buttons/radios, labels, visible focus, minimum 44 px targets and reduced-motion handling are present.

## Comparison history

### Pass 1

- [P1] Hero portrait was almost entirely outside the visible right edge.
- Fix: moved the dedicated raster asset from `right: -193px` to `right: -12px`, reduced the asset width and tuned opacity.
- Post-fix evidence: `/qa.html` shows the face, orbits and cobalt/mint nodes occupying the same right-hand region as the source without replacing the left-hand hierarchy.

### Pass 2

- No actionable P0/P1/P2 differences.
- Full-view comparison was sufficient because the key fine-detail region—the hero portrait and overlaid typography—is large and readable in the side-by-side frame.

## Primary interactions tested

- Landing → start.
- Three demonstrative questions, selection state and disabled/enabled continue action.
- Back-stack transitions.
- E-mail field with simulated mobile keyboard.
- Free result → premium offer.
- Checkout pending state → simulated server confirmation.
- Premium report.

## Console

No application console errors observed in the in-app browser during the tested flow.

## Follow-up polish

- P3: replace remote Google Fonts import with a bundled font before production hardening.
- P3: refine the locale control into its eventual selector once MarketContext exists.

final result: passed
