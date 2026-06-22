# Test Specifications

## Unit Tests (Vitest + React Testing Library)

### DecisionLogger.test.tsx
- [ ] renders without crash
- [ ] text input is auto-focused on mount
- [ ] confidence slider defaults to 5
- [ ] typing a decision and clicking "Log It" calls onLog with correct payload (text, confidence, timestamp)
- [ ] empty decision text shows inline validation message and does not submit
- [ ] confidence slider value updates as user drags
- [ ] submit button shows the current confidence number (e.g. "Log It — 7/10 gut")

### DecisionList.test.tsx
- [ ] renders without crash
- [ ] displays "No decisions yet" when list is empty
- [ ] renders each decision with text, confidence badge, and timestamp
- [ ] clicking "Right" on a pending decision marks it resolved-correct
- [ ] clicking "Wrong" on a pending decision marks it resolved-incorrect
- [ ] shows calibration score (Gut Accuracy: X%) when 3+ decisions have outcomes
- [ ] calibration score correctly computes: (high-confidence decisions that were right) / (total resolved decisions)

### useDecisions.test.ts
- [ ] initializes with empty array when localStorage is empty
- [ ] addDecision persists to localStorage and returns updated list
- [ ] resolveDecision updates outcome and persists
- [ ] survives page reload (reads from localStorage on init)
- [ ] does not duplicate entries when called with same decision text

## User Journey Tests

### Primary Workflow
1. App loads → decision text field is focused, confidence slider at 5, history shows "No decisions yet"
2. User types "Cut the freemium tier, go paid-only" → drags slider to 8 → clicks "Log It"
3. Decision appears in history with "8/10" badge and timestamp; input clears and re-focuses
4. User reloads page → logged decision is still visible (localStorage persistence)
5. User clicks "Right" on the decision → status changes, calibration score appears after 3+ resolved

### Calibration Workflow
1. User logs 5 decisions with varying confidence (some 1-3, some 7-10)
2. User marks 3 of them as "Right" or "Wrong"
3. Calibration score appears showing "Gut Accuracy: X%"
4. User can see that their high-confidence calls were right more often than low-confidence ones (or not)

## Acceptance Criteria Checklist
(Reviewer verifies these against PRD.md features)
- [ ] AC: User can type a decision, drag the confidence slider, hit "Log It," and see the decision appear in the history list below within the same viewport, persisted across page reloads via localStorage.
- [ ] AC: After marking at least 3 decisions with outcomes, a calibration ratio appears showing "Gut Accuracy: X%" comparing high-confidence-correct vs. total resolved decisions.
