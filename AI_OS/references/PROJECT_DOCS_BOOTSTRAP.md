# Project Docs Bootstrap

Use this file when initializing or cleaning the documentation structure of a project.

The goal is to create **just enough documentation** for humans and AI agents to work consistently without turning the repo into a markdown landfill.

---

## Recommended Starting Structure

```text
project-root/
  README.md
  AI.md
  AGENTS.md

  docs/
    DOCS_INDEX.md
    ARCHITECTURE.md
    SETUP.md
    WORKFLOWS/
    FEATURES/
    INTEGRATIONS/
    DATABASE/
    OPERATIONS/
    _archive/
```

Adjust only when the project genuinely needs more structure.

---

## File Roles

### `README.md`
Use for:
- quick project overview
- fastest path to run the project
- links to deeper docs

Keep it short.

### `AI.md`
Use for:
- loading the shared AI Operating System
- booting agents into the correct workflow
- pointing to handoffs and skills indirectly

### `AGENTS.md`
Use for:
- root AI coding guidance
- JIT directory map
- quick commands
- links to local AGENTS files

Keep it lean.

### `docs/DOCS_INDEX.md`
Use for:
- the map of project docs
- declaring source-of-truth files
- preventing duplicates

### `docs/ARCHITECTURE.md`
Use for:
- system overview
- main components
- boundaries
- data flow
- major design decisions

### `docs/SETUP.md`
Use for:
- install
- environment variables
- local dev setup
- required services/tools

### `docs/WORKFLOWS/`
Use for:
- recurring processes
- release flows
- maintenance procedures
- AI/human workflow notes that are stable

### `docs/FEATURES/`
Use for:
- stable feature-level documentation
- rules for important modules/features

### `docs/INTEGRATIONS/`
Use for:
- external APIs
- service bridges
- provider-specific behavior

### `docs/DATABASE/`
Use for:
- migration policy
- schema notes
- DB workflows
- operational data rules

### `docs/OPERATIONS/`
Use for:
- deployment
- runbooks
- script usage
- cron/job/worker operational notes

### `docs/_archive/`
Use for:
- retired docs
- superseded plans
- historical decisions not worth deleting

---

## What NOT To Do

Do not:
- create `README_NEW.md`, `SETUP_v2.md`, or other clone files
- leave stable docs in `TEMP/`
- create docs with cute names nobody will guess
- let session notes become permanent docs without review
- document the same workflow in 3 places
- bury critical docs in obscure nested folders

---

## Documentation Creation Rule

Create a new permanent doc only if:

- the topic will recur
- the workflow is stable enough
- multiple humans/agents need it
- the information would be costly to rediscover
- no better source-of-truth file already exists

Otherwise:
- keep it in a dated handoff
- keep it local to a session artifact
- or update an existing doc instead

---

## AGENTS.md Rule

Generate AGENTS hierarchy only after:

- discovery is complete enough
- repo structure is known
- packages/apps/services are stable enough to describe

AGENTS files should:
- stay local and operational
- point to patterns and examples
- avoid becoming general documentation

---

## First Docs To Create

For most serious projects, create these first:

1. `README.md`
2. `AI.md`
3. `AGENTS.md`
4. `docs/DOCS_INDEX.md`
5. `docs/ARCHITECTURE.md`
6. `docs/SETUP.md`

Only after that, add more as needed.

---

## Review Rule

When cleaning a messy project, do this in order:

1. identify existing docs
2. find duplicates
3. identify source-of-truth files
4. create/update `docs/DOCS_INDEX.md`
5. move/archive junk
6. only then create missing docs

---

## Final Principle

The docs system should make the project easier to navigate in one pass.

If a new doc does not reduce confusion, it probably should not exist.
