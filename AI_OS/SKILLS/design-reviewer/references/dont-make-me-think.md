# Don't Make Me Think

Steve Krug's usability bible. Short, punchy, timeless. These principles haven't changed since 2000 because human psychology doesn't change.

---

## The Three Laws

### First Law: Don't Make Me Think

**Every question mark adds cognitive load.** Each time a user pauses—even for a split second—to wonder "Where am I?", "Where should I start?", "Why did they call it that?", "Is that a button?"... you've failed.

**Self-evident > self-explanatory > requires explanation.**
- Self-evident: User gets it instantly. No thought required.
- Self-explanatory: User gets it after a moment. Tolerable.
- Requires explanation: User needs help text. You've failed.

**Test**: Can a user of average ability accomplish their goal without it being more trouble than it's worth?

---

### Second Law: Clicks Don't Matter, Thinking Does

> "It doesn't matter how many times I have to click, as long as each click is a mindless, unambiguous choice."

**Three mindless clicks > one click that requires thought.**

People don't mind clicking. They mind:
- Being uncertain which link to click
- Clicking and getting something unexpected
- Not knowing if they're on the right track

---

### Third Law: Get Rid of Half the Words

> "Get rid of half the words on each page, then get rid of half of what's left."

**Happy talk must die.** Happy talk = introductory text that says nothing. "Welcome to our website!" "We are pleased to offer..." "At [Company], we believe..."

Nobody reads it. It wastes space. Kill it.

**Instructions are failure.** If you need instructions, your design isn't self-evident. Make it obvious instead.

---

## How Users Actually Use the Web

### They Don't Read—They Scan

**Reality check**: Users don't read web pages. They scan for:
- Words or phrases that match their goal
- Things that look clickable
- Anything that stands out

**Why?**
- They're on a mission (get in, get it, get out)
- They know they don't need to read everything
- They're good at scanning—it works

**Design implication**: Design for scanning, not reading.

---

### They Satisfice

Users don't look for the best choice—they take the **first reasonable option**.

"Satisficing" = satisfy + suffice. Good enough is good enough.

**Why?**
- Optimizing is hard work
- Consequences of wrong choice are low (back button exists)
- Random clicking is faster than careful analysis

**Design implication**: Make the right choice look like the obvious first choice.

---

### They Muddle Through

Users don't figure out how things work—they muddle through.

They don't read manuals. They don't understand your clever architecture. They click things that seem promising and see what happens.

**Why?**
- It usually works
- Who has time to figure out your special system?
- They don't care how it works, just that it works

**Design implication**: Don't expect users to understand your system. Make muddling work.

---

## Design for Scanning

### Create Clear Visual Hierarchy

**Show relationships through visual design:**
- More important = larger, bolder, higher, more prominent color
- Related items = grouped together, same style
- Nested = visually contained within parent

**Test**: Squint at the page. Can you still tell what matters?

---

### Use Conventions

**Conventions are your friend.** Users have mental models from other sites. Leverage them.

Standard conventions:
- Logo top-left (links to home)
- Navigation at top or left
- Search box top-right
- Blue underlined text = link
- Shopping cart icon = shopping cart

**Only break conventions if:**
1. Your replacement is so clear there's no learning curve, OR
2. The added value is worth a small learning curve

Most "innovations" are just confusion.

---

### Break Pages Into Clearly Defined Areas

Users should be able to instantly identify:
- What are the main parts of this page?
- Where is the navigation?
- Where is the main content?
- What can I ignore?

**Use visual elements to create regions:**
- Whitespace
- Background colors
- Borders (sparingly)
- Headers

---

### Make It Obvious What's Clickable

**Question marks are bad:**
- Is this a link or just bold text?
- Is this image clickable?
- Does this button do something?

**Make clickable things look clickable:**
- Links: underlined, colored
- Buttons: look like buttons (depth, shape)
- Cards: hover effects

**Make non-clickable things look non-clickable.**

---

### Eliminate Noise

**Visual noise** = everything competing for attention.

**Types of noise:**
- Shouting: When everything is emphasized, nothing is
- Disorganization: No clear structure
- Clutter: Too much stuff

**Ruthlessly cut:**
- Happy talk
- Instructions (make it obvious instead)
- Decorative elements that don't help
- Redundant content

---

### Format Content for Scanning

- Use headings and subheadings
- Keep paragraphs short
- Use bulleted lists (when appropriate)
- Highlight key terms
- Put the most important info first (inverted pyramid)

---

## Navigation

### What Navigation Must Do

1. **Tell me where I am.** (Which site? Which section? Which page?)
2. **Tell me where I can go.** (What are my options?)
3. **Tell me how to get there.** (What do I click?)
4. **Tell me how to get back.** (Can I undo? Go home?)

---

### Navigation Conventions

**Persistent Navigation** (appears on every page):
- Site ID (logo, top-left)
- Sections (primary navigation)
- Utilities (search, cart, account, help)
- Search box

**Page-Level Navigation**:
- Page name (what page am I on?)
- "You are here" indicator
- Breadcrumbs (where am I in the hierarchy?)

---

### The Trunk Test

Imagine being blindfolded, driven around, and dropped on a random page of the site.

**You should immediately know:**
1. What site is this? (Site ID)
2. What page am I on? (Page name)
3. What are the major sections? (Sections)
4. What are my options at this level? (Local navigation)
5. Where am I in the scheme of things? (You are here)
6. How can I search? (Search)

If you can't answer these in seconds, navigation has failed.

---

### Breadcrumbs

**Breadcrumbs show path**: Home > Category > Subcategory > Current Page

Rules:
- Put them at the top
- Use ">" between levels
- Bold the last item (current page)
- Don't make them the only navigation—supplement, don't replace

---

### Tabs Work

Tabs are effective because:
- They're self-evident (everyone knows tabs)
- They clearly show what's selected
- They're hard to miss

**Rules for tabs:**
- Must look like physical tabs (drawn correctly)
- One tab must be clearly selected
- Selected tab connects visually to content

---

## The Home Page

### The Home Page Has to Do Everything

Required elements:
1. **Site identity and mission**: What site is this? What does it do?
2. **Site hierarchy**: What can I find here? (Content, features, sections)
3. **Search**: Let me search
4. **Teases**: What's worth looking at? (Top content, promotions)
5. **Timely content**: What's new? (Shows site is alive)
6. **Deals and shortcuts**: Common tasks, popular items
7. **Registration/Login**: If needed

### The Tagline

A tagline is a short phrase that captures the site's purpose.

**Good tagline characteristics:**
- Clear and informative (not clever and obscure)
- 6-8 words
- Conveys differentiation

**Bad tagline**: "Let's Build Tomorrow Together!"
**Good tagline**: "All the news that's fit to print."

### The Welcome Blurb

A brief description that explains:
- What the site is
- What you can do here
- Why you should be here

**Keep it short.** 1-2 sentences max. No happy talk.

---

## Mobile Usability

### Mobile Constraints

- Smaller screen = less visible at once
- Fat fingers = harder to tap accurately
- Variable attention = users distracted

### Mobile Priorities

**Allow zooming.** Don't disable pinch-to-zoom. Users may need it.

**Manage real estate ruthlessly.** Every pixel matters more.

**Prioritize content.** Show what matters most—hide the rest behind taps.

**Design for thumbs.** Put primary actions in thumb reach zones.

---

## Usability Testing

### Just Do It

> "Testing one user is 100% better than testing none."

**You will find more problems in half a day than you can fix in a month.**

### Krug's Testing Rules

- **Test early, test often.** One morning a month. Regular rhythm.
- **3-4 users is enough.** You don't need 50. First 3 find most problems.
- **Almost anyone will do.** You don't need perfect target users.
- **Debrief immediately.** Right after testing, while it's fresh.
- **Focus on serious problems first.** Fix what matters most.

### What You'll Learn

Watching someone use your site reveals:
- Where they get stuck
- What they misunderstand
- What they don't see
- What they expect but don't find
- What frustrates them

**You can't unsee it.** Once you watch a user struggle, you'll never look at your design the same way.

---

## Usability as Courtesy

### Goodwill is a Reservoir

Users arrive with a reservoir of goodwill toward your site. Every frustration drains it. When it empties, they leave.

**Things that drain goodwill:**
- Hiding information they need (prices, phone numbers)
- Punishing them for not doing things your way
- Asking for unnecessary information
- Fake sincerity ("Your call is important to us")
- Obstacles to doing what they came to do
- Looking amateurish or unprofessional

**Things that build goodwill:**
- Making things easy
- Saving them time
- Anticipating their questions
- Providing helpful error messages
- Telling them what they want to know

---

## Accessibility

### It's the Right Thing to Do

> "The web has the power to dramatically improve the lives of people with disabilities... we have an opportunity and a responsibility to make that possible."

### Accessibility Quick Wins

1. **Fix usability problems that confuse everyone.** If it's hard for average users, it's impossible for users with disabilities.

2. **Add alt text to images.** Describe what's in the image.

3. **Use proper headings.** Screen readers navigate by headings.

4. **Make forms work with screen readers.** Labels, clear errors.

5. **Add a "Skip to Main Content" link.** First thing on the page.

6. **Ensure keyboard navigation works.** Every action possible without mouse.

7. **Be careful with JavaScript.** Don't break accessibility.

---

## Audit Checklist: Krug's Laws

### Scanning Test
- [ ] Clear visual hierarchy?
- [ ] Distinct page regions?
- [ ] Obviously clickable elements?
- [ ] Minimal noise/clutter?
- [ ] Content formatted for scanning?

### Navigation Test (Trunk Test)
- [ ] Site ID visible?
- [ ] Page name clear?
- [ ] Main sections obvious?
- [ ] Current location indicated?
- [ ] Search available?
- [ ] Way to get home?

### Thinking Test
- [ ] Is everything self-evident?
- [ ] Are button labels clear?
- [ ] Is it obvious what to do first?
- [ ] Could a user explain what this page is for?
- [ ] Are there any question marks?

### Words Test
- [ ] Happy talk eliminated?
- [ ] Instructions minimized?
- [ ] Content ruthlessly shortened?
- [ ] Important info first?

### Courtesy Test
- [ ] Information users need easily accessible?
- [ ] Unnecessary friction removed?
- [ ] Error messages helpful?
- [ ] Site feels professional?
