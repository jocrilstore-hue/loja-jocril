---
name: design-reviewer
description: Comprehensive design critique and steering tool for websites, landing pages, UI components, and AI-generated visual interfaces.
---

# Design Reviewer

Systematic design critique combining usability heuristics, visual design principles, conversion optimization, accessibility standards, and emotional design evaluation.

This tool is especially useful for evaluating **AI-generated design output** and producing **clear guidance for improving the next iteration**.

It works within the **AI Operating System (AI_OS)** and integrates with other skills such as:

- Architect Advisor (strategy / architecture)
- My Precious (prompt engineering)

---

# AI OS Integration

This skill operates inside the AI Operating System.

At session start the system may load:

- AI_OS/AI_OPERATING_SYSTEM.md
- AI_OS/MODEL_SELECTION_GUIDE.md
- AI_OS/AI_DECISION_LOG.md

Session continuity is handled globally through:

- AI_OS/SESSION-PROMPTS/AI_SESSION_START.md
- AI_OS/SESSION-PROMPTS/SESSION_HANDOFF_TEMPLATE.md

Design Reviewer focuses **only on design evaluation and iteration steering**.

---

# Critique Philosophy

## Goal-Oriented, Not Opinion-Based

Every critique point must connect to real outcomes:

- user comprehension
- usability
- readability
- trust
- emotional tone
- conversion potential

Avoid subjective statements without explanation.

---

## Specific and Actionable

Weak feedback:

"The typography feels off."

Strong feedback:

"Body text appears around 14px with tight line spacing, which creates reading fatigue. Increase to approximately 16–18px with ~1.5–1.6 line height for better readability."

---

## Prioritized by Impact

Classify issues as:

Critical — blocks comprehension or primary action

Major — significantly harms usability or hierarchy

Minor — improves polish and clarity

---

# Review Process

## Step 1 — Understand Context

Before critiquing determine:

- Target audience
- Primary goal of the page
- Design stage

Possible stages:

- Early concept (~30%)
- Refined draft (~60%)
- Final polish (~90%)

If context is unclear, ask **one concise question**.

---

# Step 2 — Identify AI Generation Patterns

If the design appears AI-generated, evaluate common weaknesses.

Look for:

- generic hero layouts
- weak visual hierarchy
- inconsistent spacing rhythm
- decorative overload
- unclear CTA priority
- repeated sections without strategic purpose
- typography scale inconsistencies
- visually polished but strategically unclear layouts

Load reference if necessary:

references/ai-design-failure-patterns.md

---

# Step 3 — Evaluation Layers

Evaluate using layered analysis.

Load references **only when relevant**.

### 1. First Impression (5‑Second Test)

Ask:

- What is this page about?
- What action should users take?
- What emotional tone does it create?

If unclear within 5 seconds → clarity problem.

---

### 2. Usability Heuristics

Load:

references/usability-heuristics.md

---

### 3. Don't Make Me Think

Load:

references/dont-make-me-think.md

Evaluate:

- scanability
- navigation clarity
- visual noise
- trunk test

---

### 4. Psychology Principles

Load:

references/psychology-principles.md

Evaluate:

- attention capture
- motivation triggers
- trust cues
- cognitive load

---

### 5. Typography

Load:

references/typography.md

Evaluate:

- type scale
- line height
- readability
- hierarchy clarity
- alignment
- measure

---

### 6. Color

Load:

references/color.md

Evaluate:

- palette consistency
- contrast
- hierarchy
- emotional tone
- accessibility

---

### 7. Grid & Alignment

Load:

references/grid-alignment.md

Evaluate:

- layout structure
- container consistency
- alignment edges
- spacing rhythm

---

### 8. Visual Hierarchy

Load:

references/visual-hierarchy.md

Evaluate:

- emphasis
- grouping
- contrast
- scale

---

### 9. Refactoring UI

Load:

references/refactoring-ui.md

Evaluate:

- spacing systems
- component consistency
- border vs shadow usage
- card patterns

---

### 10. Conversion Clarity

Load:

references/landing-page-audit.md

Evaluate:

- value proposition clarity
- CTA prominence
- trust signals
- friction points

---

### 11. Accessibility

Load:

references/accessibility.md

Check:

- WCAG contrast
- readable font sizes
- interaction clarity
- semantic structure

---

### 12. Sensitive Topics

Load only if relevant:

references/trauma-informed.md

Used for:

- healthcare
- crisis
- trauma
- mental health

---

# Step 4 — Structure the Critique

Use this format:

Design Review: [Name]

Overview

1‑2 sentence overall evaluation.

---

What’s Working

• strength + why it works

---

🔴 Critical Issues

Issue
Problem
Impact
Fix

---

🟡 Major Issues

Issue
Problem
Impact
Fix

---

🟢 Minor Suggestions

Suggestion
What to improve
How to improve

---

AI Generation Patterns

List patterns typical of AI layouts if observed.

---

Questions That Affect Direction

Ask only if they change the design direction.

---

# Step 5 — Steering for Next Iteration

Provide concrete instructions.

Format:

Critical
• instruction

Major
• instruction

Minor
• instruction

Avoid vague instructions such as:

- "make it nicer"
- "make it pop"

---

# Step 6 — Prompt for Next Iteration

Generate a concise prompt that another model can use.

Example:

Improve the design with the following changes:

- [instruction]
- [instruction]
- [instruction]

---

# Model Recommendation

For large UI systems or complex design reviews:

High reasoning → strongest reasoning model available

Balanced design review → general reasoning model

Quick critique → fast balanced model

If the user needs prompt engineering → suggest using **My Precious**.

---

# Session Continuity

If the design review is part of a larger workflow:

- respect decisions already recorded in AI_DECISION_LOG.md
- check whether a relevant handoff exists
- record major design decisions if necessary

Use:

AI_OS/SESSION-PROMPTS/SESSION_HANDOFF_TEMPLATE.md

to close significant sessions.

---

# Reference Files

Load only when necessary:

references/usability-heuristics.md
references/dont-make-me-think.md
references/psychology-principles.md
references/typography.md
references/color.md
references/grid-alignment.md
references/visual-hierarchy.md
references/refactoring-ui.md
references/landing-page-audit.md
references/accessibility.md
references/trauma-informed.md
references/quick-checks.md
references/ai-design-failure-patterns.md
