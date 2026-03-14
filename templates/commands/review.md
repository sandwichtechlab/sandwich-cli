---
description: "Quality Gate: Review and validate — check requirements feasibility, design completeness, or final code review before pushing."
---

Perform a thorough local code review **before** pushing changes.

1. **Gather Context** — If not already provided, ask for: feature or branch description, list of modified files, relevant design doc(s) (e.g., `docs/ai/design/feature-{name}.md`), known constraints or risky areas, and which tests have been run. Also review the latest changes via `git status` and `git diff --stat`.
2. **Search Review Standards** — Check memory for project conventions and recurring issues: `sandwich memory search --query "code review checklist project conventions"`. Apply known standards to the review.
3. **Check Design Alignment** — For each design doc, summarize the architectural intent and critical constraints. Flag any implementation that deviates from the documented design.
4. **File-by-File Review** — For every modified file, check:
   - **Design alignment**: Does implementation match documented architecture and requirements?
   - **Logic correctness**: Edge cases, off-by-one errors, race conditions, null handling
   - **Security**: Input validation, secrets exposure, auth checks, data sanitization (OWASP Top 10)
   - **Error handling**: Are failures caught, logged, and surfaced appropriately?
   - **Performance**: N+1 queries, unnecessary allocations, missing caching, blocking operations
   - **Test coverage**: Are new code paths covered? Are edge cases tested?
5. **Cross-Cutting Concerns** — Verify: naming consistency and project conventions, docs/comments updated where behavior changed, configuration or migration updates needed, no debug code or temporary workarounds left behind.
6. **Store Reusable Findings** — Save durable review patterns or project-specific checklists via `sandwich memory store ...`.
7. **Summarize Findings** — Categorize each finding as **blocking** (must fix), **important** (should fix), or **nice-to-have** (optional improvement). Include: file path, issue description, impact, recommendation, and design doc reference.
8. **Next Steps** — If blocking issues, run `/execute` to fix code or `/test` to close test gaps. If clean, proceed with push/PR workflow.
