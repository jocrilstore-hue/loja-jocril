# Nielsen's 10 Usability Heuristics

Evaluate each heuristic. Score: Pass / Partial / Fail

## 1. Visibility of System Status
**Principle**: Keep users informed about what's happening through timely feedback.

**Evaluation Questions**:
- Does the system show loading states for async operations?
- Are success/error states clearly communicated?
- Do users know where they are in multi-step processes?
- Is there feedback for user actions (button clicks, form submissions)?

**Common Violations**: Silent form submissions, missing loading indicators, no progress bars for long operations.

## 2. Match Between System and Real World
**Principle**: Use familiar language, concepts, and conventions.

**Evaluation Questions**:
- Is the language user-friendly (no jargon/technical terms)?
- Do icons match real-world conventions?
- Is information presented in logical, natural order?
- Do metaphors make sense to the target audience?

**Common Violations**: Developer-speak in error messages, unfamiliar icons, illogical information flow.

## 3. User Control and Freedom
**Principle**: Provide clear "emergency exits" and undo/redo.

**Evaluation Questions**:
- Can users easily go back or cancel actions?
- Is there an obvious way to exit unwanted states?
- Are destructive actions reversible or confirmed?
- Can users navigate freely without getting trapped?

**Common Violations**: No back button, forced modal flows, irreversible actions without warning.

## 4. Consistency and Standards
**Principle**: Follow platform conventions. Same words/actions should mean the same thing.

**Evaluation Questions**:
- Are UI elements consistent throughout the design?
- Does the design follow platform conventions (iOS/Android/Web)?
- Are similar actions presented consistently?
- Is terminology consistent across all pages?

**Common Violations**: Inconsistent button styles, varying terminology for same action, non-standard interactions.

## 5. Error Prevention
**Principle**: Design to prevent errors before they happen.

**Evaluation Questions**:
- Are error-prone conditions eliminated or flagged?
- Do forms validate input before submission?
- Are destructive actions confirmed?
- Does the system offer suggestions/constraints to guide input?

**Common Violations**: Free-text where dropdowns work, no inline validation, easy to delete without confirmation.

## 6. Recognition Rather Than Recall
**Principle**: Minimize memory load by making elements visible.

**Evaluation Questions**:
- Are options visible rather than requiring memory?
- Is context maintained across screens?
- Are recently used items easily accessible?
- Do labels and instructions remain visible when needed?

**Common Violations**: Hidden navigation, context lost between steps, requiring users to remember codes/IDs.

## 7. Flexibility and Efficiency of Use
**Principle**: Support both novice and expert users.

**Evaluation Questions**:
- Are there shortcuts for expert users?
- Can frequent actions be customized or accelerated?
- Is the default flow efficient for common tasks?
- Are there multiple ways to accomplish tasks?

**Common Violations**: No keyboard shortcuts, no saved preferences, forcing all users through same flow.

## 8. Aesthetic and Minimalist Design
**Principle**: Every extra element competes with relevant information.

**Evaluation Questions**:
- Is the design free of unnecessary elements?
- Does visual design support the content hierarchy?
- Is there appropriate use of whitespace?
- Are decorative elements adding or distracting?

**Common Violations**: Cluttered interfaces, competing visual elements, decoration over function.

## 9. Help Users Recognize, Diagnose, and Recover from Errors
**Principle**: Error messages should be clear and constructive.

**Evaluation Questions**:
- Are error messages in plain language (no codes)?
- Do errors precisely indicate what went wrong?
- Do errors suggest how to fix the problem?
- Are errors visually distinct and noticeable?

**Common Violations**: "Error 500", vague "Something went wrong", no recovery guidance.

## 10. Help and Documentation
**Principle**: Provide accessible help that's easy to search and task-focused.

**Evaluation Questions**:
- Is help available when users need it?
- Is documentation easy to search?
- Are instructions focused on user tasks?
- Is contextual help provided for complex features?

**Common Violations**: No help available, dense documentation, help hidden or hard to find.
