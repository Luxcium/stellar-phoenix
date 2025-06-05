# Agent Quick Reference

This repository uses a "Memory Bank" system to store all project knowledge. Two roots exist:

1. **memory-bank/** – documentation for the overall project (TypeScript, Python, etc.).
2. **web/memory-bank/** – documentation specific to the Next.js web app.

When working in the main project, update files in **memory-bank/**. When modifying the Next.js application, update **web/memory-bank/**. Do not copy information between the two; keep context relevant to each root.

## Where to Look for Context

- `memory-bank/projectbrief.md` – overall project goals and phases.
- `memory-bank/activeContext.md` – current work focus and recent changes.
- `memory-bank/systemPatterns.md` – architecture diagrams and patterns (Memory Bank is the source of truth).
- `memory-bank/progress.md` – progress log.
- `web/memory-bank/*` – web-specific counterparts to the above files.
- `.github/copilot-instructions.md` – guidelines for documentation updates and commit practices.
- `.clinerules` – mandatory rules: never reset memory, update the Memory Bank before finishing tasks, and document problems before/after changes.

Scripts like `web/setup.sh` and `web/dev-watch.sh` automatically append updates to the Memory Bank. Review them when modifying development workflows.

Always verify which root you are working in and update the matching Memory Bank directory. This prevents duplication across the main project and the web app.
