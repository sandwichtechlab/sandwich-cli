---
description: "Update planning docs to reflect implementation progress — reconcile completed, in-progress, blocked, and newly discovered tasks."
---

Help me reconcile current implementation progress with the planning documentation.

1. **Gather Context** — If not already provided, ask for: feature/branch name and brief status, tasks completed since last update, new tasks discovered, current blockers or risks, and planning doc path (default `docs/ai/planning/feature-{name}.md`).
2. **Search Prior Context** — Check memory for prior decisions that affect priorities or scope: `sandwich memory search --query "<feature> planning updates"`.
3. **Review & Reconcile** — Summarize existing milestones, task breakdowns, and dependencies from the planning doc. For each planned task: mark status (done / in progress / blocked / not started), note scope changes, record blockers, identify skipped or added tasks.
4. **Produce Updated Task List** — Generate an updated checklist grouped by: Done, In Progress, Blocked, Newly Discovered Work — with short notes per task.
5. **Store Knowledge** — If new planning conventions or risk-handling rules emerge, persist them: `sandwich memory store --title "<convention>" --content "<details>" --tags "planning,<feature>"`.
6. **Next Steps** — Suggest the next 2-3 actionable tasks and prepare a summary paragraph for the planning doc. Return to `/execute` for remaining work. When all tasks are complete, run `/recheck`.
