# Artifact Hierarchy

Use the earliest trustworthy artifact that can still explain the failure.

1. Source input
2. Converter/intermediate data structures
3. Generated payload or built output
4. Clipboard/export artifact from the real run
5. Designer state after paste/import
6. Published/runtime behavior

If a later stage is wrong, ask whether the earlier stage was already wrong. If yes, fix upstream first.

# Session Checklist

## At the start

- Name the exact failure.
- Name the artifact chain.
- Identify the current source of truth.
- Start or update a handoff doc.

## After each fix

- Add or update a regression test.
- Run the narrowest relevant test set.
- Rebuild generated artifacts if the user depends on them.
- Re-run the real-world check.
- Record what changed and what did not.

## When evidence conflicts

- Prefer dumps, payloads, computed styles, and direct runtime inspection over recollection.
- Mark earlier conclusions as superseded when new artifacts disprove them.
- Avoid carrying invalid assumptions forward.

# Comparison Prompt Pattern

When using a browser inspection tool, ask for:

- exact environment
- exact failing behavior
- exact selectors or ids involved
- exact first broken stage
- exact evidence for each claim

Avoid prompts that ask for generic advice before the factual comparison is done.
