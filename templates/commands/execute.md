---
description: "SDLC Phase 4 / ADLC Phase 4: Implementation — execute tasks from the planning doc one by one, track progress, handle blockers, and update status. In ADLC mode, includes continuous evaluation after each change."
---

Execute the implementation plan from `docs/ai/planning/feature-{name}.md`, working through tasks systematically.

1. **Gather Context** — If not already provided, ask for: feature name, planning doc path (`docs/ai/planning/feature-{name}.md`), supporting docs (design, requirements), current branch and diff status. Search memory for related patterns: `sandwich memory search --query "<feature domain>"`.
2. **Load Plan** — Parse the planning doc's task lists (checkboxes). Build an ordered task queue grouped by section. Show the queue with status for each task: `todo`, `in-progress`, `done`, `blocked`.
3. **Execute Tasks** — For each task in order:
   - Show task context and relevant design/requirements references
   - Break into sub-steps if the task is complex
   - Implement the task, following the design doc's architecture decisions
   - After completion, prompt for status and notes
   - If blocked, record the blocker reason and defer to the next task
4. **Update Planning** — After each task status change, update the planning doc with current progress. Mark checkboxes, add notes, record blockers. After completing a section, ask if new tasks were discovered during implementation.
5. **Session Summary** — At the end of each session, summarize: tasks completed, in-progress, blocked, skipped, and newly discovered work. Suggest the next 2-3 actionable tasks.
6. **Store Patterns** — Save reusable implementation patterns or decisions via `sandwich memory store ...`.
7. **ADLC: Continuous Eval** — In ADLC workflow, after each prompt or context change, run `/eval` to validate behavioral consistency. Do not batch validation — the loop is: change → evaluate → confirm → proceed. This may execute dozens of times during implementation.
8. **Next Steps** — After all tasks complete, run `/recheck` to verify against design, then `/test` for coverage, then `/review` before pushing. In ADLC workflow, also run `/eval` for a full behavioral validation pass before `/test`.
