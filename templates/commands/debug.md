---
description: "SDLC Phase 7: Maintenance — debug issues with structured root-cause analysis before changing code."
---

Help me debug an issue. Follow an evidence-first approach: understand the problem fully before proposing any code changes.

1. **Gather Context** — If not already provided, ask for: what is happening vs what should happen, error messages/logs/screenshots, recent related changes or deployments, scope of impact (one user, all users, one environment), and any attempted fixes.
2. **Search Prior Knowledge** — Check memory for similar incidents or known patterns: `sandwich memory search --query "<issue symptoms or error message>"`. Apply any relevant past solutions before deep investigation.
3. **Clarify Expected vs Actual** — Restate the gap between observed and expected behavior in one concise comparison. Confirm the source of truth (requirements doc, test spec, user expectation). Define measurable acceptance criteria for the fix.
4. **Reproduce & Isolate** — Determine reproducibility: always, intermittent, or environment-specific. Capture minimal reproduction steps and environment fingerprint (runtime, versions, config, platform). Narrow down to the smallest reproducing case.
5. **Hypothesize & Test** — For each candidate root cause: state the predicted evidence if true, state the disconfirming evidence if false, specify the exact test command or check to run. Prefer one-variable-at-a-time tests. Rank hypotheses by likelihood based on evidence gathered.
6. **Propose Fix Options** — Present resolution options (targeted fix, refactor, rollback, config change) with: pros/cons, risk level, affected components, and validation steps. Recommend one option and request approval before proceeding.
7. **Store Reusable Knowledge** — Save root-cause patterns and fix strategies via `sandwich memory store --title "<pattern>" --content "<details>" --tags "<tags>"`.
8. **Next Steps** — After implementing the fix, run `/recheck` to verify against design, then `/test` for coverage, then `/review` before pushing.
