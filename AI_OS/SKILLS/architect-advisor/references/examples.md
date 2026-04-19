# Project Architect Advisor — Examples

These examples show what belongs in a project-local AI_OS architect skill.

---

## Good: Local Architecture Constraint

```
### Architecture Constraints

- The email bridge is the source of truth for normalized email body text.
- The UI should not perform HTML sanitization for stored emails.
```

Why: this is project-specific and affects future implementation choices.

---

## Good: Local Task Mapping

```
| Task pattern | Preferred mode | Local reason |
|---|---|---|
| Quote intake extraction | Single session | Sequential pipeline with one source document |
| Multi-quote comparison | Parallel exploration | Each quote can be analyzed independently before synthesis |
```

Why: this helps future sessions route recurring project work without duplicating global orchestration rules.

---

## Good: Local Model Exception

```
- Use the cheaper extraction model for routine quote line-item normalization because the project has deterministic validation tables.
```

Why: the exception is tied to local validation reality.

---

## Bad: Global Skill Duplication

```
Always use Opus for architecture.
Always use gpt-5.4 for planning.
Here is the full my-precious prompt structure...
```

Why: global model routing and prompt packaging belong in global skills.

---

## Bad: Provider Leakage

```
Every Codex task should use Claude Agent Teams.
Every Claude task should use Codex sub-agents.
```

Why: provider mechanics are different. The project can record local constraints, but the global provider skill chooses the correct harness mechanics.
