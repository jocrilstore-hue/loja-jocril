# Typography Evaluation

Typography is the foundation of visual design. Audit this FIRST and THOROUGHLY.

## Typography Audit Protocol

**Step 1: Extract all values**
Before evaluating, extract these from the CSS:
- All `font-size` values (list and count occurrences)
- All `line-height` values
- All `letter-spacing` values
- All `font-family` declarations
- All `font-weight` values
- All `margin-bottom` and `gap` values (for vertical rhythm)

**Step 2: Analyze systematically using sections below**

---

## Type Scale Audit

**The Rule**: Limit to 5-7 font sizes following a consistent ratio.

**Modular Scale Ratios** (pick one):
| Ratio | Name | Scale Example (16px base) |
|-------|------|---------------------------|
| 1.125 | Major Second | 14, 16, 18, 20, 23, 26 |
| 1.200 | Minor Third | 12, 14, 17, 21, 25, 30 |
| 1.250 | Major Third | 12, 15, 19, 24, 30, 37 |
| 1.333 | Perfect Fourth | 12, 16, 21, 28, 37, 50 |
| 1.414 | Augmented Fourth | 11, 16, 23, 32, 45, 64 |
| 1.500 | Perfect Fifth | 11, 16, 24, 36, 54, 81 |

**Red Flags**:
- More than 8 font sizes = scale bloat
- Sizes within 2px of each other (e.g., 13px, 14px, 15px) = visual mud
- No discernible ratio between sizes = arbitrary choices
- Body text below 16px on web = readability issue

**Evaluation Questions**:
1. How many unique font sizes exist? (Count them)
2. Do sizes follow a recognizable ratio?
3. Can you map each size to a clear purpose (display, h1, h2, h3, body, small, tiny)?
4. Are there redundant sizes that could be consolidated?

**Scoring**:
- 5-6 sizes with clear ratio = Excellent
- 7-8 sizes with mostly clear purpose = Good
- 9-10 sizes = Needs consolidation
- 11+ sizes = Critical issue

---

## Line Height (Leading) Audit

**The Rules**:
| Text Type | Line Height | Why |
|-----------|-------------|-----|
| Display/Hero (36px+) | 1.0-1.15 | Large text needs tight leading |
| Headings (24-36px) | 1.15-1.3 | Slightly looser than display |
| Subheadings (18-24px) | 1.25-1.4 | Transitional |
| Body text (14-18px) | 1.5-1.7 | Needs room for eye to track |
| Small/Captions (12-14px) | 1.4-1.6 | Slightly tighter than body |
| Monospace body | 1.6-1.8 | Mono needs MORE leading |
| UI elements (buttons, labels) | 1.0-1.3 | Compact, single-line |

**Red Flags**:
- Body text with line-height below 1.4 = cramped
- Headlines inheriting body line-height (e.g., 1.7) = too loose, looks floating
- No explicit line-height on headings = inconsistent inheritance
- Line-height: 2.0+ anywhere = excessive, wastes space

**Evaluation Questions**:
1. Is line-height explicitly set for each text category?
2. Does body text have 1.5-1.7 line-height?
3. Do headings have tighter line-height (1.1-1.3)?
4. Is line-height adjusted for font type (serif vs sans vs mono)?

---

## Letter Spacing (Tracking) Audit

**The Rules**:
| Context | Letter Spacing | Why |
|---------|---------------|-----|
| Large headlines (48px+) | -0.02em to -0.04em | Tighten to prevent gaps |
| Regular headings | -0.01em to -0.02em | Slight tightening |
| Body text | 0 (default) | Don't touch unless needed |
| ALL CAPS text | +0.05em to +0.15em | MUST add spacing |
| Small caps / labels | +0.03em to +0.1em | Improves legibility |
| Buttons (uppercase) | +0.02em to +0.05em | Subtle opening |

**Red Flags**:
- ALL CAPS with no letter-spacing = cramped, hard to read
- Positive letter-spacing on lowercase body = weird, floaty
- Excessive tracking (+0.2em+) anywhere = text falls apart
- Inconsistent tracking on similar elements

**Evaluation Questions**:
1. Do large headlines have negative tracking?
2. Is ALL CAPS text given positive letter-spacing?
3. Is body text left at default (0)?
4. Are similar elements (all badges, all buttons) tracked consistently?

---

## Paragraph Measure (Line Length) Audit

**The Rule**: 45-75 characters per line. 66 characters is ideal.

**Quick Reference**:
| Measure | Characters | Verdict |
|---------|-----------|---------|
| Too narrow | <45 | Choppy, tiring |
| Optimal | 45-75 | Comfortable reading |
| Ideal | 60-66 | Perfect |
| Too wide | 75-90 | Eye tracking strain |
| Critical | 90+ | Unreadable |

**CSS Fix**: `max-width: 65ch` on paragraphs

**Evaluation Questions**:
1. What is the character count per line at common viewport widths?
2. Is `max-width` set on paragraph containers?
3. On wide screens (1400px+), do lines exceed 90 characters?
4. On narrow containers, do lines fall below 45 characters?

**Testing Method**:
Copy a representative paragraph line. Paste into character counter. Repeat for multiple viewport widths.

---

## Text Alignment Consistency Audit

**The Rule**: Same content type = same alignment. Alignment changes should be intentional and justified.

**Alignment Guidelines by Content Type**:
| Content Type | Recommended Alignment | Why |
|--------------|----------------------|-----|
| Body paragraphs (3+ lines) | Left | Consistent left edge aids eye tracking |
| Short taglines (1-2 lines) | Center OK | Short enough that scanning cost is low |
| Section headers (h2) | Center OR Left | Pick one and be consistent |
| Card content | Left | Reading flow should be predictable |
| Hero text (short) | Center OK | Focal point, draws eye to center |
| Lists | Left | Items need scannable left edge |
| Blockquotes | Left (with indent) | Long text needs left edge |
| CTAs/Buttons | Center (within container) | Buttons are UI, not reading |
| Navigation | Left or Center | Depends on layout, be consistent |

**The Core Principle**: Left-aligned text is always safe. Center-aligned text only works for:
- Very short text (1-2 lines max)
- Deliberate focal points (hero, headers)
- UI elements (buttons, badges)

**Red Flags**:
- Body paragraphs (3+ lines) that are centered = hard to read, eye loses left edge
- Inconsistent alignment between sections of same type = feels accidental
- Mixed alignment within a section = chaotic
- Centered text in breakout/full-width sections that has left-aligned text elsewhere = jarring
- FAQ or card content that's centered = poor scannability

**Audit Protocol**:
1. List every section and its text alignment
2. Group by content type (hero, section header, body, cards, breakout)
3. Check: Does same content type always get same alignment?
4. If alignment varies, ask: Is there a clear reason?

**Alignment Consistency Table** (fill this out):
| Section | Content Type | Alignment | Intentional? |
|---------|--------------|-----------|--------------|
| Hero | Short tagline | Center | ✓ |
| How It Works header | Section header | Center | ✓ |
| How It Works steps | Card content | Left | ✓ |
| Proxy Mode | Breakout body | ??? | Check |
| ... | ... | ... | ... |

**Acceptable Variation**:
- Breakout sections (different background) CAN have different alignment IF:
  - The section serves a distinct purpose
  - The difference is obviously intentional (not just forgotten)
  - The alignment suits the content length

**Unacceptable Variation**:
- Standard sections randomly switching between center and left
- Long body text that's centered
- Same section type having different alignment across the page

**Fix Strategy**:
If inconsistency is found:
1. Default to left-align for body text
2. Use center only for short headers and hero content
3. Make one pass through CSS to standardize `text-align` rules
4. Apply alignment at the section/container level, not per-element

---

## Word Spacing Audit

**The Rule**: Generally leave default, but watch for issues.

**Problem Contexts**:
- Justified text without hyphens = rivers of white space
- Monospace fonts at wide measures = excessive word gaps
- Tight tracking without word-space adjustment = words collide

**Evaluation Questions**:
1. Is there justified text? If so, is hyphenation enabled?
2. Are there visible "rivers" of white space in paragraphs?
3. Does any text appear to have words too close or too far apart?

---

## Vertical Rhythm & Spacing Audit

**The Rule**: Use a consistent spacing scale based on a base unit.

**Common Spacing Scales**:
| Scale Type | Values |
|------------|--------|
| 4px base | 4, 8, 12, 16, 24, 32, 48, 64, 96 |
| 8px base | 8, 16, 24, 32, 48, 64, 96, 128 |
| Fibonacci-ish | 4, 8, 12, 20, 32, 52, 84 |

**What to Check**:
- `margin-bottom` values on headings and paragraphs
- `padding` values on sections and cards
- `gap` values in flex/grid layouts
- Space between sections

**Red Flags**:
- More than 8-10 unique spacing values = no system
- Arbitrary values (17px, 23px, 37px) = no thought given
- Inconsistent spacing between similar elements
- No breathing room around key elements

**Evaluation Questions**:
1. How many unique margin/padding/gap values exist?
2. Do values follow a recognizable scale?
3. Is vertical spacing consistent between similar section types?
4. Is there a clear rhythm when scrolling the page?

**Calculating Vertical Rhythm**:
Ideal: `line-height × font-size = base rhythm unit`
Example: 1.5 × 16px = 24px base unit. All spacing should be multiples of 24px.

---

## Font Pairing Audit

**The Rules**:
- Maximum 2-3 typefaces
- Each typeface needs a clear role
- Pairing should create contrast OR harmony, not muddy middle

**Classic Pairings**:
| Pattern | Example | Use Case |
|---------|---------|----------|
| Geometric sans + Humanist sans | Inter + Source Sans | Modern, friendly |
| Serif + Sans | Playfair + Lato | Editorial, sophisticated |
| Mono + Sans | JetBrains Mono + Inter | Developer, technical |
| Display + Neutral | Clash Display + Satoshi | Bold, contemporary |
| Single family | Inter weights | Safe, cohesive |

**Red Flags**:
- 4+ typefaces = chaotic
- Two similar typefaces (Arial + Helvetica) = pointless
- Display font used for body = unreadable
- No contrast between heading and body fonts

**Evaluation Questions**:
1. How many font families are used?
2. Does each font have a clear purpose (display, headings, body, code)?
3. Do the fonts create intentional contrast or harmony?
4. Is the pairing appropriate for the brand/content?

---

## Font Weight Audit

**The Rule**: Use weights to create hierarchy within a family.

**Common Weight Usage**:
| Weight | Name | Typical Use |
|--------|------|-------------|
| 300 | Light | Large display text only |
| 400 | Regular | Body text, default |
| 500 | Medium | Emphasis, subheadings |
| 600 | Semi-bold | Headings, buttons |
| 700 | Bold | Strong emphasis, key headings |
| 800-900 | Black | Display only, sparingly |

**Red Flags**:
- Body text in bold (700) = fatiguing
- Light weight (300) at small sizes = illegible
- More than 3-4 weights used = cluttered
- Inconsistent weight for similar elements

---

## Typography Scorecard

After auditing, score each dimension:

| Dimension | Score (1-5) | Weight | Notes |
|-----------|-------------|--------|-------|
| Type Scale | | 25% | 5-7 sizes, clear ratio |
| Line Height | | 20% | Appropriate per context |
| Letter Spacing | | 10% | Intentional, correct |
| Paragraph Measure | | 20% | 45-75 characters |
| Vertical Rhythm | | 15% | Consistent spacing scale |
| Font Pairing | | 10% | Clear roles, good contrast |

**Calculate**: (Score × Weight) summed = Typography Score

- 4.5-5.0 = Excellent typography
- 3.5-4.4 = Good, minor issues
- 2.5-3.4 = Needs work
- Below 2.5 = Critical typography problems
