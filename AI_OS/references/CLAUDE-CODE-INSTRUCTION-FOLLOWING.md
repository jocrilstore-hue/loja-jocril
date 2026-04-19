# How to Make Claude Code (CLI) Actually Follow Instructions

> Compiled 2026-03-10 from Anthropic docs, GitHub issues, and community research.
> This is a living document — update when new patterns are discovered.

---

## The Core Problem

Claude Code can read instructions, recite them back, and still not follow them. This is a known model behavior issue, not a user skill problem. It affects all models (Opus 4.6, Sonnet 4.6, and older). The following practices reduce — but don't eliminate — instruction drift.

---

## 1. Keep CLAUDE.md SHORT

**The single most impactful rule.** Research shows:
- Frontier thinking models can follow ~150-200 instructions with linear decay
- Smaller models exhibit exponential decay past ~50 instructions
- Claude Code's system prompt already uses ~50 instruction slots
- That leaves you ~100-150 instructions before reliability drops

**Action:** Target under 200 lines. For every line, ask: "Would removing this cause Claude to make mistakes?" If not, cut it. Move domain-specific knowledge into Skills (loaded on demand, not every session).

**If Claude keeps ignoring a rule despite it being in CLAUDE.md, the file is probably too long and the rule is getting lost.**

---

## 2. Use Hooks for Non-Negotiable Rules

CLAUDE.md instructions are advisory. Hooks are deterministic — they run scripts automatically and CANNOT be ignored.

```json
// .claude/settings.json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write(*.ts)",
        "hooks": [
          {
            "type": "command",
            "command": "npx tsc --noEmit"
          }
        ]
      }
    ]
  }
}
```

Example: "Write a hook that runs the test suite after every file edit" — ask Claude to set this up.

If a rule MUST be followed every time with zero exceptions → make it a hook, not an instruction.

---

## 3. Phrase Rules as Positive Guidance

"Do not..." rules are ignored more often than "Prefer X over Y" rules.

- ❌ "Do not modify files outside the scope of the task"
- ✅ "Modify ONLY the files explicitly listed in the instructions. If a change requires touching other files, STOP and ask first."

- ❌ "Don't use any type in TypeScript"  
- ✅ "Use proper TypeScript types for all declarations. Replace any with the correct type."

---

## 4. Use Emphasis Sparingly but Strategically

ALL CAPS and "IMPORTANT:" work — but only if used rarely. If everything is emphasized, nothing is.

Reserve emphasis for 3-5 truly critical rules. Everything else in normal text.

---

## 5. Manage Context Aggressively

- **Manual /compact at ~50% context usage** — don't let it auto-compact at the edge where quality degrades
- **Use /clear when switching tasks** — fresh context beats dragging old context forward
- **Write handoff files** before clearing — ask Claude to write HANDOFF.md with: goal, what was tried, what worked, what failed, next steps
- **Start new sessions for new tasks** — long sessions cause instruction drift

---

## 6. Scope Tasks Tightly

The #1 cause of regressions: prompts that are too broad. Claude will "helpfully" expand scope.

- ❌ "Fix the hover animations"
- ✅ "In `buildHoverReverseInteraction()` ONLY, change `timelineIds: [id, id]` to `timelineIds: [id]`. Do NOT modify any other function."

Specify exact files, exact functions, exact line ranges when possible.

---

## 7. Use Plan Mode for Complex Tasks

Press `Shift+Tab` twice to enter Plan Mode. Claude reads files and answers questions WITHOUT making changes. Use this to:
1. Have Claude analyze the problem
2. Propose a plan
3. YOU review the plan
4. Exit plan mode and execute

Separating research from implementation prevents solving the wrong problem.

---

## 8. Verify, Don't Trust

- Always review diffs before approving
- Include verification steps in prompts: "After changes, run `bun test` and report results"
- If you can't verify it, don't ship it
- Green tests ≠ working paste (for our project specifically)

---

## 9. Model Selection for Instruction Following

| Need | Model | Why |
|------|-------|-----|
| Complex architecture | Opus 4.6, effort: high | Deeper reasoning, but prone to scope creep |
| Standard implementation | Sonnet 4.6, effort: high | Best balance of capability and obedience |
| Simple mechanical changes | Sonnet 4.6, effort: medium | Fast, cheap, follows simple instructions well |
| Read-only discovery | Sonnet 4.6, effort: medium | Just reading and reporting, no reasoning needed |

---

## 10. The Nuclear Options

When nothing else works:

- **Restrict tools**: `--allowedTools "Read" "Write" "Bash(bun test:*)"` — physically prevent Claude from doing things you didn't ask for
- **Use print mode**: `claude -p "prompt"` — non-interactive, single pass, no drift
- **Use --max-turns**: `--max-turns 3` — limits how many agentic steps Claude can take

---

## Sources

- Anthropic Best Practices: https://code.claude.com/docs/en/best-practices
- HumanLayer Research: https://www.humanlayer.dev/blog/writing-a-good-claude-md (instruction decay analysis)
- GitHub Issue #32166: Opus 4.6 prompt reading failures (March 2026)
- GitHub Issue #668: Instruction following failures (systemic)
- Community consensus: https://github.com/shanraisshan/claude-code-best-practice
