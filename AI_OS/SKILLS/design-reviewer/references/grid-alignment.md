# Grid & Alignment Evaluation

Grid consistency is often overlooked but instantly separates amateur from professional design. Audit this systematically.

## Grid Audit Protocol

**Step 1: Extract all container patterns**
For each major section, extract:
- `max-width` value
- `margin` (especially horizontal: auto vs fixed)
- `padding` (especially horizontal edge padding)
- Whether it's centered or edge-aligned

**Step 2: Map sections to patterns**
Create a table like this:

| Section | max-width | margin | padding | Pattern |
|---------|-----------|--------|---------|---------|
| Hero | 1200px | 0 auto | 0 2rem | Centered |
| Features | 1200px | 0 auto | 0 2rem | Centered |
| CTA Card | none | 0 2rem | 3rem | Full-bleed |

**Step 3: Identify inconsistencies and ask questions**

---

## Container Consistency Audit

**The Rule**: All content sections should share the same container pattern unless intentionally breaking out.

**Common Container Patterns**:
| Pattern | CSS | Use Case |
|---------|-----|----------|
| Centered fixed | `max-width: 1200px; margin: 0 auto; padding: 0 2rem` | Most content |
| Full-bleed | `width: 100%; padding: 0 2rem` | Background sections |
| Narrow centered | `max-width: 800px; margin: 0 auto` | Long-form text |
| Breakout | `width: 100vw; margin-left: calc(-50vw + 50%)` | Intentional full-width |

**Red Flags**:
- Different `max-width` values across similar sections
- Mix of `margin: 0 auto` and `margin: 0 Xrem` (centered vs edge-spaced)
- Inconsistent horizontal padding between sections
- Content edges that don't align when scrolling

**Evaluation Questions**:
1. Do all "standard" sections share the same max-width?
2. Is horizontal padding consistent (e.g., all use 2rem)?
3. On wide viewports, do content edges align vertically?

---

## Edge Alignment Test

**The Test**: On a wide viewport (1440px+), draw an imaginary vertical line down the left edge of content. Does it stay consistent?

**How to Check**:
1. Open page at 1440px width
2. Look at left edge of first section's content
3. Scroll down—does every section's content start at the same x-position?
4. Repeat for right edge

**What Misalignment Looks Like**:
- Section A content: starts at 120px from left
- Section B content: starts at 32px from left (full-bleed with margin)
- Section C content: starts at 120px from left

This creates a "jagged" left edge when scrolling.

**When Misalignment is Intentional**:
- Full-bleed sections with distinct background colors
- Hero sections that span full width
- Feature callout cards meant to "break out"
- Image galleries or carousels

**When Misalignment is Likely an Error**:
- Sections with same/similar background color but different widths
- No visual differentiation to signal the breakout
- Only some cards in a series break out
- Inconsistent margins (one section uses 2rem, another uses 1.5rem)

---

## Clarifying Questions to Ask

When you detect potential grid inconsistencies, ASK the designer/user:

**For sections with different max-widths:**
> "I notice [Section A] has max-width: 1200px while [Section B] spans full width with margin: 0 2rem. On wide screens, Section B will be ~240px wider than Section A, and their edges won't align. Was this intentional to make Section B feel more prominent, or should they share the same container?"

**For inconsistent horizontal padding:**
> "Most sections use 2rem horizontal padding, but [Section X] uses 1.5rem. This creates a slight misalignment. Intentional variation or should I standardize to 2rem?"

**For mixed centering strategies:**
> "[Section A] centers with margin: auto while [Section B] uses fixed margins. They'll behave differently at various viewport widths. Which approach should be the standard?"

**For full-bleed sections without visual differentiation:**
> "[Section X] breaks out of the content grid but has the same background color as adjacent sections. Consider adding a background color or border to signal the intentional breakout, or constrain it to match the grid."

---

## Intentional Breakout Checklist

If a section intentionally breaks the grid, verify:

- [ ] It has visual differentiation (background color, border, shadow)
- [ ] The breakout serves a purpose (emphasis, visual rhythm, full-width media)
- [ ] Similar breakout sections are consistent with each other
- [ ] Mobile behavior is defined (breakouts often need different mobile handling)
- [ ] The breakout doesn't create awkward text line lengths

---

## Internal Grid Consistency

Beyond section containers, check grid consistency WITHIN sections:

**Card Grids**:
- Do all cards have the same width?
- Is gap/gutter consistent?
- Do cards align to a shared grid?

**Multi-Column Layouts**:
- Are column widths proportional (e.g., 2:1, 1:1:1)?
- Is the gutter between columns consistent with section padding?
- Do columns align with the overall page grid?

**Nested Containers**:
- Do nested max-widths make sense? (e.g., 800px inside 1200px = centered narrow)
- Is nesting intentional or accidental?

---

## Common Grid Errors

| Error | Symptom | Fix |
|-------|---------|-----|
| Mixed container patterns | Jagged edges when scrolling | Standardize max-width and margin |
| Inconsistent padding | Content "jumps" left/right between sections | Use consistent horizontal padding |
| Orphan breakouts | One section wider for no apparent reason | Either commit to breakout design or constrain |
| Nested container confusion | Unexpected narrow content | Audit parent containers |
| Mobile grid collapse | Desktop grid doesn't translate | Define mobile-specific grid behavior |

---

## Grid Scorecard

| Dimension | Score (1-5) | Notes |
|-----------|-------------|-------|
| Container consistency | | Same pattern across sections |
| Edge alignment | | Left/right edges align vertically |
| Intentional breakouts | | Visually differentiated, purposeful |
| Internal grid consistency | | Cards, columns align properly |
| Mobile adaptation | | Grid translates well to small screens |

**Scoring**:
- 4.5-5.0 = Rock-solid grid system
- 3.5-4.4 = Minor inconsistencies
- 2.5-3.4 = Noticeable alignment issues
- Below 2.5 = No coherent grid system
