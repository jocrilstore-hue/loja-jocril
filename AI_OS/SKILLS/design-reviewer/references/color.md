# Color Evaluation

Color is deceptively complex. Poor color choices instantly signal amateur design. Audit systematically.

## Color Audit Protocol

**Step 1: Extract all colors**
Before evaluating, extract from CSS:
- All `color` values (text colors)
- All `background-color` values
- All `border-color` values
- All colors in `box-shadow`, `gradient`, SVG fills
- Count unique colors and group by purpose

**Step 2: Map colors to roles**
Create a table:
| Color | Hex | Role | Usage Count |
|-------|-----|------|-------------|
| #1a1a1a | Dark grey | Primary text | 12 |
| #3b82f6 | Blue | Primary CTA | 4 |
| #ef4444 | Red | Error state | 2 |

**Step 3: Evaluate relationships and consistency using sections below**

---

## Color Theory Fundamentals

**The Color Wheel Relationships**:

| Harmony Type | Definition | Effect | Best For |
|--------------|------------|--------|----------|
| **Complementary** | Opposite on wheel (blue/orange, red/green) | Maximum contrast, vibrant tension | Accents, CTAs that must pop |
| **Analogous** | Neighbors on wheel (blue/blue-green/green) | Harmonious, calm, cohesive | Backgrounds, unified sections |
| **Triadic** | Three equidistant (red/yellow/blue) | Vibrant but balanced | Playful brands, infographics |
| **Split-Complementary** | One color + two adjacent to its complement | Contrast with less tension | Easier than pure complementary |
| **Monochromatic** | Single hue, varying saturation/lightness | Sophisticated, unified | Minimal designs, dark modes |

**When to Use Each**:
- Complementary: Use sparingly. One color dominant (90%), complement as accent (10%). Never 50/50.
- Analogous: Safe choice. Risk is muddy sameness—ensure enough lightness variation.
- Triadic: Pick one dominant, two as accents. Equal distribution = chaos.
- Monochromatic: Add texture/typography interest to avoid boredom.

**Red Flags**:
- Two complementary colors at equal weight = visual fight
- Analogous palette with no lightness contrast = everything blends
- Random colors with no wheel relationship = amateur hour
- Triadic with three saturated colors = circus

---

## The 60-30-10 Rule

**The Rule**: Distribute color in a 60-30-10 ratio.

| Percentage | Role | Examples |
|------------|------|----------|
| **60%** | Dominant | Backgrounds, large surfaces, body areas |
| **30%** | Secondary | Cards, sections, supporting elements, navigation |
| **10%** | Accent | CTAs, links, highlights, icons, key elements |

**Why It Works**: Mimics how the human eye naturally processes visual hierarchy. Provides enough variety without chaos.

**Evaluation Protocol**:
1. Eyeball the page. What color dominates?
2. What's the secondary color covering sections/cards?
3. Is accent color reserved for actions and highlights only?
4. Rough percentage check: Does it feel balanced?

**Red Flags**:
- Accent color used for large areas (CTA blue as section background)
- No clear dominant color (everything competing)
- 50/50 split between two colors = no hierarchy
- Accent at 30%+ = accent loses meaning

**Scoring**:
- Clear 60-30-10 distribution = Excellent
- Slightly off but hierarchy clear = Good
- 40-40-20 or unclear dominance = Needs work
- Color chaos, no discernible ratio = Critical issue

---

## Section Color Switching Rules

**When to Switch Background Colors**:

| Trigger | Reason | Example |
|---------|--------|---------|
| Content type changes | Signal mental context shift | Pricing vs. Features vs. Testimonials |
| Hierarchy demands attention | Draw eye to key section | CTA section, promotional banner |
| Breaking monotony | Prevent scroll fatigue on long pages | Alternating light/dark sections |
| Grouping related content | Visual container effect | FAQ section, footer |

**When NOT to Switch Colors**:

| Situation | Why It's Wrong |
|-----------|----------------|
| Content is continuous | Interrupts reading flow |
| Designer boredom | Every switch costs cognitive load |
| Creates false grouping | Same color = related. Don't lie to the brain. |
| No content reason | Arbitrary = amateur |

**Lightness Shift Guidelines**:

For subtle section breaks (same hue family):
- 5-10% lightness shift = Subtle separation, professional
- 15-20% lightness shift = Clear differentiation
- 30%+ lightness shift = Strong break, use sparingly

**Evaluation Questions**:
1. Does each color change correspond to a content/purpose change?
2. Are similar sections (all feature cards) the same color?
3. Is there a rhythm to color changes, or random?
4. Could any color switches be removed without losing meaning?

---

## Color Palette Composition

**Required Palette Categories**:

| Category | Purpose | Typical Count |
|----------|---------|---------------|
| **Primary** | Brand identity, main actions | 1-2 colors |
| **Secondary** | Supporting elements, accents | 1-2 colors |
| **Neutral** | Backgrounds, text, borders, dividers | 5-9 shades (grey scale) |
| **Semantic** | Status indicators | 4 colors (success, error, warning, info) |

**Neutral Scale (Critical)**:

Most designs need a full neutral scale:
| Shade | Lightness | Use |
|-------|-----------|-----|
| 50 | ~97% | Subtle backgrounds |
| 100 | ~95% | Card backgrounds |
| 200 | ~90% | Borders, dividers |
| 300 | ~80% | Disabled text |
| 400 | ~65% | Placeholder text |
| 500 | ~50% | Secondary text |
| 600 | ~40% | Body text (light mode) |
| 700 | ~30% | Primary text |
| 800 | ~20% | Headings |
| 900 | ~10% | High emphasis |

**Red Flags**:
- Only 2-3 greys = harsh jumps, no subtlety
- No true black or near-black = weak contrast
- Greys with inconsistent undertones = muddy, accidental
- Missing semantic colors = relying on users to infer meaning

**Evaluation Questions**:
1. Count unique colors. Is the palette constrained (ideally <15 total including shades)?
2. Is there a full neutral scale, or sparse greys?
3. Do neutrals have consistent undertones (warm, cool, or pure)?
4. Are semantic colors defined and used consistently?

---

## Contrast Requirements (WCAG AA)

**Minimum Contrast Ratios**:

| Element Type | Minimum Ratio | Example |
|--------------|---------------|---------|
| Normal text (<18px) | 4.5:1 | #595959 on white = 7:1 ✓ |
| Large text (18px+ bold or 24px+) | 3:1 | #767676 on white = 4.5:1 ✓ |
| UI components (buttons, inputs) | 3:1 | Border, icon against background |
| Graphical objects | 3:1 | Charts, icons conveying meaning |
| Focus indicators | 3:1 | Keyboard focus rings |

**AAA Standard** (enhanced, not required but better):
- Normal text: 7:1
- Large text: 4.5:1

**Common Contrast Failures**:

| Failure | Example | Fix |
|---------|---------|-----|
| Light grey text | #999 on white (2.8:1) | Darken to #767676 minimum |
| Colored text on color | Blue on dark blue | Add lightness contrast |
| Placeholder text | #ccc in input | Darken or use icon hint |
| Disabled states | Too faint to read | Balance: visible but muted |

**Tools**:
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Coolors Contrast Checker: https://coolors.co/contrast-checker

**Evaluation Questions**:
1. Does all body text meet 4.5:1?
2. Do interactive elements meet 3:1?
3. Are there any light-grey-on-white or low-contrast patterns?
4. Do disabled states remain readable?

---

## Perceptual Color Issues

**Grey Text on Colored Backgrounds**:

**The Problem**: Pure grey (#888) on a colored background looks wrong. Grey has no saturation, so it clashes with saturated backgrounds.

**The Fix**: Match the grey's undertone to the background.
- On blue background: Add blue to the grey
- On warm background: Add warm undertone to grey
- Formula: Mix 10-20% of background hue into grey

**Same Color, Different Perception** (Albers principle):

Colors change based on surrounding colors:
- Grey on white looks darker than same grey on black
- A color appears more saturated next to its complement
- Warm colors advance; cool colors recede

**Evaluation Questions**:
1. Is there grey text directly on colored backgrounds?
2. Do greys have undertones matching the palette?
3. Are there jarring color adjacencies?

---

## Color Blindness & Accessibility

**The Rule**: Never use color alone to convey meaning.

**Types of Color Blindness**:
| Type | Affected | Population |
|------|----------|------------|
| Deuteranopia | Green perception | ~6% of males |
| Protanopia | Red perception | ~2% of males |
| Tritanopia | Blue perception | Rare |

**Problem Combinations**:
| Avoid | Why | Alternative |
|-------|-----|-------------|
| Red/green only | Invisible to 8% of males | Add icons, patterns, labels |
| Green = success, Red = error with no other indicator | Status unclear to colorblind users | Add checkmark/X icons |
| Color-coded charts without labels | Data unreadable | Add patterns, direct labels |

**Safe Practices**:
- Pair color with icons (✓ for success, ✗ for error)
- Use patterns in addition to color in charts
- Ensure sufficient lightness contrast (works in greyscale)
- Test with color blindness simulator

**Greyscale Test**: 
Convert design to greyscale. Does hierarchy hold? Can you distinguish all elements? If not, you're over-relying on hue.

**Evaluation Questions**:
1. Does any element rely solely on color for meaning?
2. Would a colorblind user understand the status indicators?
3. Does the design pass the greyscale test?

---

## Dark Mode Considerations

**Inverted Hierarchy Issues**:

What works in light mode may fail in dark mode:
- Pure white text on dark = too harsh, eye strain
- Shadows don't work the same (can't go darker than dark)
- Saturated colors may need desaturation
- Elevation indicated by lightening, not darkening

**Dark Mode Adjustments**:

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | White (#fff) | Near-black (#121212), not pure black |
| Body text | Dark grey (#333) | Light grey (#e0e0e0), not pure white |
| Surfaces | Shades of grey | Elevated = lighter (opposite) |
| Primary color | Full saturation | Reduce saturation 10-20% |
| Shadows | Dark shadows | Reduce opacity or use borders |

**Evaluation Questions**:
1. If dark mode exists, is text slightly off-white?
2. Are surfaces elevated by lightening?
3. Are saturated colors adjusted for dark backgrounds?
4. Are shadows replaced with borders or subtle lightening?

---

## Color Psychology (Context-Dependent)

**Use with caution**—psychology is cultural and contextual, not universal.

| Color | Western Associations | Caution |
|-------|---------------------|---------|
| **Blue** | Trust, stability, professionalism, calm | Overused in tech/finance |
| **Green** | Growth, nature, success, health, money | Can feel clinical |
| **Red** | Urgency, passion, danger, error, excitement | Can feel aggressive |
| **Yellow/Orange** | Energy, warmth, optimism, caution | Can feel cheap if overused |
| **Purple** | Creativity, luxury, wisdom, mystery | Can feel dated |
| **Black** | Sophistication, luxury, power | Can feel heavy |
| **White** | Purity, simplicity, cleanliness | Can feel sterile |
| **Neutral/Grey** | Balance, professionalism, timelessness | Can feel cold |

**Industry Conventions**:
| Industry | Common Palettes | Why |
|----------|-----------------|-----|
| Finance/Banking | Blue, grey, green | Trust, stability, money |
| Healthcare | Blue, green, white | Calm, cleanliness, trust |
| Food/Restaurant | Red, orange, yellow | Appetite stimulation |
| Luxury | Black, gold, purple | Sophistication |
| Tech/SaaS | Blue, purple, gradients | Modern, trustworthy |
| Children/Playful | Primary colors, bright | Energy, fun |

**Evaluation Questions**:
1. Does the color palette match the industry/audience expectations?
2. Is color psychology being used intentionally or accidentally?
3. Are there any jarring mismatches (e.g., red for a meditation app)?

---

## Color Scorecard

After auditing, score each dimension:

| Dimension | Score (1-5) | Weight | Notes |
|-----------|-------------|--------|-------|
| Palette Composition | | 20% | Constrained, purposeful colors |
| 60-30-10 Balance | | 15% | Clear hierarchy |
| Color Harmony | | 15% | Wheel relationships make sense |
| Contrast (WCAG) | | 20% | All text meets minimums |
| Section Switching | | 10% | Intentional, not arbitrary |
| Accessibility | | 15% | Works for colorblind, greyscale |
| Dark Mode (if applicable) | | 5% | Proper adjustments made |

**Calculate**: (Score × Weight) summed = Color Score

- 4.5-5.0 = Excellent color system
- 3.5-4.4 = Good, minor issues
- 2.5-3.4 = Needs work
- Below 2.5 = Critical color problems
