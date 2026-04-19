# Refactoring UI Principles

Tactical design guidance from Adam Wathan & Steve Schoger. No fluff, just specific fixes.

## Core Philosophy

**Design is not magic—it's a system of repeatable decisions.**

Every "ugly" design has specific, fixable problems. Every "beautiful" design follows identifiable patterns. This reference helps you spot problems and apply solutions.

---

## Starting From Scratch

### Don't Start With the Shell
- Design features first, not navigation/layout
- You don't know what the layout needs until you've designed features
- The shell is a container—build what goes inside first

### Design in Grayscale First
- Forces you to nail hierarchy with spacing, contrast, and size
- Color is the easy part—add it after structure is solid
- If it works in grayscale, it'll work in color

### Don't Over-invest in Wireframes
- Low-fidelity is for exploration, not presentation
- Move fast, make decisions, throw wireframes away
- Details come later—don't obsess about typefaces and shadows yet

### Define Personality First
- Is it playful or serious? Corporate or casual? Elegant or bold?
- Border-radius telegraphs personality: small=neutral, large=playful, none=formal
- Let personality guide font, color, and spacing choices

---

## Visual Hierarchy

### Size Isn't Everything
- **Weight and color are more powerful than size**
- To emphasize: increase weight, use darker color
- To de-emphasize: decrease weight, use lighter color
- You can create hierarchy without making anything huge

**Red Flag**: Headlines are 3x larger than body but still don't feel prominent
**Fix**: Bold the headline + darken the color, reduce body text contrast

### Emphasize by De-emphasizing
- Instead of making primary content bigger/bolder...
- Make secondary content smaller/lighter
- The primary stands out because everything else recedes

### Hierarchy of Actions
- Not every button should be primary
- Destructive ≠ automatically red and bold
- **Ask**: What's the most important action here?
- Primary actions: solid, high-contrast backgrounds
- Secondary actions: outline or ghost styles
- Tertiary actions: text links

**Red Flag**: Every button is big and colorful
**Fix**: Pick ONE primary action per section. Make others subtle.

### Labels Are a Last Resort
- Combine label + value into natural language when possible
- "Email: john@example.com" → "john@example.com" (with email icon)
- "Quantity: 3" → "3 items"
- Fewer labels = cleaner interface

---

## Layout & Spacing

### Start With Too Much White Space
- Then reduce until it feels "just right"
- You'll usually end up with more than you started with
- **Default to generous, not cramped**

### Don't Fill the Whole Screen
- Elements should be as big as they need to be—no bigger
- A little extra space around edges never hurt anyone
- Empty space creates focus

### Create a Spacing System
- Pick a base unit (4px or 8px) and derive a scale
- Example: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128
- Use ONLY values from this scale
- Fewer choices = faster decisions = more consistency

**Red Flag**: Random margins like 17px, 23px, 37px
**Fix**: Constrain to your spacing scale

### Relative Sizing Doesn't Scale
- A heading that's 2x body at 16px doesn't work the same at 12px
- Elements should scale independently, not proportionally
- Fine-tune each size for its context

### Grids Are Overrated
- Don't be a slave to the grid
- If a sidebar looks better at 280px than 1/4 of the page, use 280px
- Give components the space they need—not arbitrary grid fractions

### Ambiguous Spacing
- **More space between groups, less space within groups**
- If spacing is uniform, users can't tell what belongs together
- Proximity = relationship

**Red Flag**: Form labels are equidistant from field above AND below
**Fix**: Label should be closer to its field than to the previous field

---

## Typography

### Define a Type Scale
- Limit to 5-7 sizes with clear purpose
- Base sizes on a ratio (1.125, 1.25, 1.333, etc.)
- Example scale: 12, 14, 16, 20, 24, 32, 48

### Font Weight Rules
- **Never use weights under 400 for UI text**
- Light weights (300) only work at large display sizes
- To de-emphasize: use lighter color, not thinner weight
- For body text, 400 or 500 is ideal

### Two Fonts Max
- One for headings, one for body (or just one for both)
- Each font needs a clear job
- More fonts = more chaos

---

## Color

### Define a Color System
- 8-10 shades per color (not just one)
- Darkest shade for text, lightest for backgrounds
- Middle shades for borders, hovers, etc.

### Don't Use Grey on Colored Backgrounds
Making text grey on a colored background looks wrong.

**Fixes**:
1. **Reduce opacity** of white text (lets background bleed through)
2. **Use same hue as background**, adjusted for saturation/lightness
3. **Hand-pick a color** that works with the background

**Red Flag**: #6b7280 grey text on a blue card
**Fix**: Use a light blue that matches the card's hue

### Use HSL for Color Work
- Easier to create consistent variations
- Adjust lightness for shades, saturation for vibrancy
- Keep hue consistent within a color family

---

## Borders

### Use Fewer Borders
- Borders make designs feel busy and cluttered
- They're rarely the best solution

**Alternatives**:
1. **Box shadows**: More subtle than borders
2. **Background color differences**: Works great for adjacent elements
3. **Extra spacing**: Simplest—just push things apart

**Red Flag**: Every card, every input, every section has a border
**Fix**: Remove most borders. Use shadows and spacing instead.

### Accent Borders Add Personality
- A colorful top border on a card = instant "designed" feeling
- Works great for otherwise bland elements
- Use your accent color, not grey

---

## Shadows

### Offset Shadows Vertically
- Real light comes from above
- Shadows should go DOWN, not spread evenly
- Use vertical offset, minimal horizontal

**Bad**: `box-shadow: 0 0 20px rgba(0,0,0,0.1)`
**Good**: `box-shadow: 0 4px 6px rgba(0,0,0,0.1)`

### Use Two Shadows
For realistic depth, combine:
1. **Large, soft shadow**: Ambient light (larger blur, lower opacity)
2. **Small, sharp shadow**: Direct light (smaller blur, higher opacity)

```css
box-shadow: 
  0 1px 3px rgba(0,0,0,0.12),  /* direct */
  0 4px 12px rgba(0,0,0,0.08); /* ambient */
```

### Establish an Elevation System
- Define 3-5 shadow levels
- Small: buttons, inputs
- Medium: dropdowns, cards
- Large: modals, dialogs
- Use consistently throughout

### Shadows for Interaction
- Elevate buttons on hover (increase shadow)
- Press effect: reduce shadow (feels pressed down)
- Dynamic shadows make UI feel responsive

---

## Depth Without Shadows

### Color Creates Depth
- Lighter elements feel closer/elevated
- Darker elements feel further/recessed
- Works in flat design without any shadows

### Overlap Elements
- Cards that cross background boundaries create layers
- Images with small gaps between them (invisible border)
- Z-index stacking with visible overlap

### Solid Shadows for Flat Design
- If you want flat but need depth...
- Use short vertical-offset shadow with NO blur
- Maintains crisp edges while showing elevation

---

## Icons

### Don't Blow Up Small Icons
- Icons designed for 16px look chunky at 32px
- They lose detail and look amateur

**Fixes**:
1. Use an icon designed for the size you need
2. Put the icon inside a shape (circle with background color)
3. The shape occupies space, icon stays crisp

### Replace Bullets With Icons
- Checkmarks, arrows, or relevant icons > generic bullets
- Adds visual interest without adding clutter
- Great for feature lists

---

## Images

### Quality Matters
- Blurry, low-res images ruin everything
- Use stock photos or hire a photographer
- Phone pics rarely cut it

### Text Over Images
To make headlines readable on images:
1. Add a dark overlay (reduce opacity)
2. Reduce image contrast
3. Colorize the image with a single hue
4. Use text shadow on the text itself

### Control User-Uploaded Images
- Force aspect ratios with CSS (`object-fit: cover`)
- Add subtle inner shadow to prevent background bleed
- Provide upload guidance to users

### Screenshots Need Care
- Don't scale down full screenshots—details disappear
- Take screenshots at smaller screen size, OR
- Crop to show just the relevant portion

---

## Components

### Semantic Data → Visual Design
- Don't just dump key-value pairs on screen
- Turn data into human-readable phrases
- Emphasize what matters, de-emphasize metadata

**Bad**: 
```
Name: Sarah Connor
Email: sarah@resistance.io
Status: Active
```

**Good**:
```
Sarah Connor
sarah@resistance.io
● Active
```

### Custom Form Controls
- Default checkboxes and radios look generic
- Style them in your brand color
- Instant polish, minimal effort

### Dropdowns ≠ Required
- If there are only 3-5 options, consider radio buttons
- If options are important, make them visible (cards)
- Dropdowns hide information

---

## Polish Tactics

### Add Accent Colors Sparingly
- Most UI should be neutral
- One or two accent colors is enough
- Accent = action, not decoration

### Empty States Matter
- Don't leave them blank
- Add illustrations, helpful text, or CTAs
- First impression for new users

### Look for Unintuitive Decisions
- Study designs you admire
- What choices seem "wrong" but work?
- Rebuild interfaces to discover hidden tricks

---

## System Checklist

Before building, define your system:

- [ ] **Spacing scale**: 8-10 values derived from base unit
- [ ] **Type scale**: 5-7 font sizes with clear ratio
- [ ] **Font weights**: Which weights for which contexts
- [ ] **Color palette**: 8-10 shades per color
- [ ] **Shadow scale**: 3-5 elevation levels
- [ ] **Border radius**: 2-3 values (small, medium, large)
- [ ] **Border widths**: Usually just 1-2 values

**Having a system means making fewer decisions and maintaining more consistency.**

---

## Refactoring UI Audit Questions

When reviewing a design, ask:

1. **Hierarchy**: Can I instantly tell what's most important?
2. **Spacing**: Is there more space between groups than within?
3. **Borders**: Can any be replaced with shadows or spacing?
4. **Shadows**: Are they offset vertically with realistic blur?
5. **Icons**: Are any blown up beyond their intended size?
6. **Color**: Am I using grey text on colored backgrounds?
7. **Type**: Am I relying on size alone for hierarchy?
8. **System**: Do my values come from a constrained scale?
9. **Personality**: Does the design have a consistent feel?
10. **Polish**: Are there any default elements I could customize?
