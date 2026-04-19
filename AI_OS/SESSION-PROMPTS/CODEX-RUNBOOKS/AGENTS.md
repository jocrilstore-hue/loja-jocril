# SESSION-PROMPTS/CODEX-RUNBOOKS/AGENTS.md

## Package Identity

`CODEX-RUNBOOKS/` stores reusable Codex-first execution prompts.

Use this folder for:

- one-prompt autonomous missions
- reusable execution plans intended to be pasted into new Codex sessions
- durable prompts that should be referenced by absolute path instead of recopied through chat

Do not use this folder for:

- dated handoffs
- historical session notes
- project-specific one-off artifacts that only make sense inside one completed session

## Placement Rules

- Put reusable Codex execution prompts here.
- Keep historical outcomes under `SESSION-PROMPTS/SESSIONS/YYYY-MM-DD/`.
- Keep universal cross-tool boot and handoff files at the top level of `SESSION-PROMPTS/`.
- If a prompt becomes a stable standard, keep it here and link to it by absolute path in chat responses.

## Naming

- Use stable, descriptive filenames.
- Prefer `topic-purpose-mode.md`.
- Avoid date-prefixed filenames here unless the date is part of the stable standard itself.

## Regression Prevention

- Do not casually rename runbooks once they have been shared with the user.
- If replacing a widely shared prompt, preserve a compatibility path or update the references in the same session.
