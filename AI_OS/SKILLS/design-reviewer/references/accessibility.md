# Accessibility Checklist (WCAG 2.2 AA)

Organized by POUR principles: Perceivable, Operable, Understandable, Robust.

## Perceivable

Users must be able to perceive the information presented.

### Text Alternatives
- [ ] All meaningful images have descriptive alt text
- [ ] Decorative images have empty alt="" or are CSS backgrounds
- [ ] Complex images (charts, infographics) have detailed descriptions
- [ ] Icons with function have accessible names

### Color & Contrast
- [ ] Text contrast ratio: 4.5:1 minimum (normal text)
- [ ] Text contrast ratio: 3:1 minimum (large text 18px+ bold or 24px+)
- [ ] UI component contrast: 3:1 minimum
- [ ] Color is not the only indicator of meaning (add icons, text, patterns)
- [ ] Links distinguishable from surrounding text (not just by color)

### Adaptable Content
- [ ] Content can be presented in different ways without losing meaning
- [ ] Proper heading hierarchy (H1 → H2 → H3, no skips)
- [ ] Lists use proper list markup (ul, ol, dl)
- [ ] Tables have proper headers and structure
- [ ] Reading order makes sense when CSS is disabled

### Media
- [ ] Videos have captions
- [ ] Audio has transcripts
- [ ] No auto-playing audio
- [ ] Media controls are accessible

### Text Presentation
- [ ] Text can be resized up to 200% without loss of content
- [ ] No horizontal scrolling at 320px viewport width (reflow)
- [ ] Line height at least 1.5x font size
- [ ] Paragraph spacing at least 2x font size
- [ ] Letter spacing adjustable without breaking

## Operable

Users must be able to operate the interface.

### Keyboard Accessible
- [ ] All functionality available via keyboard
- [ ] No keyboard traps (can always tab away)
- [ ] Focus order is logical and intuitive
- [ ] Focus indicator is visible and clear
- [ ] Skip link provided to bypass navigation

### Focus Management
- [ ] Focus visible on all interactive elements
- [ ] Focus style has sufficient contrast
- [ ] Focus not obscured by other elements
- [ ] Custom focus styles match brand but remain clear

### Timing
- [ ] Time limits can be adjusted, extended, or disabled
- [ ] Moving/auto-updating content can be paused
- [ ] No content flashes more than 3 times per second

### Navigation
- [ ] Multiple ways to find pages (nav, search, sitemap)
- [ ] Page titles are descriptive and unique
- [ ] Link purpose is clear from text (avoid "click here")
- [ ] Consistent navigation across pages

### Input Methods
- [ ] Touch targets at least 44x44px
- [ ] Sufficient spacing between touch targets
- [ ] Gestures have alternatives (swipe → buttons)
- [ ] Pointer actions can be cancelled (on release, not press)

## Understandable

Users must be able to understand the content.

### Readable
- [ ] Language of page is specified (lang attribute)
- [ ] Language changes within content are marked
- [ ] Text is written in plain language
- [ ] Unusual words/abbreviations are explained

### Predictable
- [ ] Navigation is consistent across pages
- [ ] Components behave consistently
- [ ] Changes don't occur unexpectedly on focus
- [ ] Changes don't occur unexpectedly on input (unless warned)

### Forms & Input Assistance
- [ ] Labels clearly associated with inputs
- [ ] Required fields clearly indicated
- [ ] Input format requirements shown before input
- [ ] Error messages are specific and helpful
- [ ] Error suggestions provided when possible
- [ ] Errors can be reviewed before final submission

### Error Handling
- [ ] Errors identified clearly (not just by color)
- [ ] Error location is indicated
- [ ] Suggestions for fixing errors provided
- [ ] Legal/financial submissions can be reviewed/corrected

## Robust

Content must be compatible with current and future technologies.

### Parsing & Compatibility
- [ ] Valid HTML (no duplicate IDs, proper nesting)
- [ ] ARIA used correctly (roles, states, properties)
- [ ] Custom components have proper accessible names
- [ ] Status messages announced to screen readers

### ARIA Usage
- [ ] ARIA only used when native HTML insufficient
- [ ] ARIA roles match component behavior
- [ ] ARIA states update with interaction
- [ ] Live regions used for dynamic updates

## Quick Tests

### Keyboard-Only Navigation
1. Unplug mouse
2. Tab through entire page
3. Check: Can you access everything? Is focus visible? Any traps?

### Screen Reader Test
1. Use VoiceOver (Mac), NVDA (Windows), or browser extension
2. Navigate page with eyes closed
3. Check: Is content understandable? Are images described? Are forms labeled?

### Zoom Test
1. Zoom to 200%
2. Check: Is all content visible? No horizontal scroll? Still usable?

### Color Test
1. View page in grayscale (browser extension or filter)
2. Check: Is hierarchy maintained? Are interactive elements identifiable?

## Common Violations

| Issue | Impact | Fix |
|-------|--------|-----|
| Missing alt text | Screen readers skip images | Add descriptive alt |
| Low contrast | Unreadable for low vision | Increase to 4.5:1+ |
| Missing form labels | Forms unusable | Add label elements |
| No focus indicator | Keyboard users lost | Add visible focus style |
| Missing skip link | Tedious navigation | Add skip to main content |
| Color-only meaning | Color blind users miss info | Add text/icon |
| Missing lang attribute | Screen readers mispronounce | Add lang="en" |
| Keyboard traps | Users stuck | Ensure escape route |

## Testing Tools

- **WAVE**: Browser extension for quick scan
- **axe DevTools**: Detailed accessibility testing
- **Lighthouse**: Built into Chrome DevTools
- **Contrast Checker**: WebAIM contrast checker
- **Screen Readers**: VoiceOver, NVDA, JAWS
