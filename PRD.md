# Gut Check — Product Requirements Document

## Problem
Founders make dozens of high-stakes decisions under uncertainty every week. They oscillate between trusting their gut and chasing metrics — with no system to learn which source is actually more reliable for them personally. Without recording decisions and outcomes, founders cannot calibrate their own judgment. They repeat the same intuitive mistakes or drown in data that doesn't move the needle, with no feedback loop to improve.

## Target Users
Early-stage startup founders and solo builders (pre-seed to Series A) who make 5+ consequential decisions per week — pricing, hiring, feature cuts, pivots, partnerships — and have no systematic way to evaluate whether their intuition or their data analysis led to better outcomes.

## Core Feature (default: exactly ONE)
- **Decision Logger**: A frictionless form where a founder records a decision they just made: what they decided, their gut confidence (1-10 slider), and a one-line reasoning. Entries are timestamped and saved. The logger lives directly in the hero viewport — no onboarding, no "create account," just a text field and a slider ready to capture a decision the moment it's made. — Acceptance Criteria: User can type a decision, drag the confidence slider, hit "Log It," and see the decision appear in the history list below within the same viewport, persisted across page reloads via localStorage.

## Should Have (optional — only if the ONE feature requires it)
- **Outcome & Calibration Tracker**: User can mark any past decision as "Right," "Wrong," or "Pending." The app computes a calibration score: the percentage of high-confidence decisions (7+) that turned out correct vs. low-confidence decisions (1-3) that turned out wrong — surfacing whether the founder's gut is actually trustworthy. — Acceptance Criteria: After marking at least 3 decisions with outcomes, a calibration ratio appears showing "Gut Accuracy: X%" comparing high-confidence-correct vs. total resolved decisions.

## Out of Scope (v1)
- **Team/multi-user decision collaboration** — would dilute the single-player focus and add auth complexity. Calibration is deeply personal; team gut-check is a different product.
- **AI-powered decision recommendations** — tempting but introduces a black box that contradicts the product's core thesis (calibrating YOUR judgment, not outsourcing it).
- **Data dashboard / analytics integrations (Stripe, Mixpanel, etc.)** — competitors like Sportlogiq have this, but it shifts the product from "decision journal" to "business intelligence tool." Not core to the promise of self-calibration.
- **Push notifications and reminders** — breaks the "capture in the moment" flow. The product should be a habit you open when a decision is fresh, not a nagging app.

## Success Metrics
- Primary: User logs their first decision in < 20 seconds from page load (zero friction to first value)
- Secondary: At least 30% of logged decisions get an outcome marked within 14 days (indicates the calibration loop is actually being used)

## Design Principles
- **Friction is the enemy**: The hero IS the logger. Text field focused on load. One slider. One button. Done.
- **Data without judgment is noise**: Every screen serves the question "is your gut getting better?" — not vanity charts.
- The hero contains the working ONE feature directly — no "click to start", no scroll-to-section. The decision input field is auto-focused on page load.
