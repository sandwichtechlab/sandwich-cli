---
description: "Knowledge: Store reusable patterns, conventions, and decisions in persistent memory for future sessions."
---

Help me store knowledge in the persistent memory service so it can be retrieved in future sessions.

1. **Capture Knowledge** — If not already provided, ask for: a short explicit title (5-12 words, actionable), detailed content (markdown format, code examples encouraged), optional tags (domain keywords like `api`, `testing`, `security`), and optional scope (`global` for all projects, `project:<name>` for specific project). If the input is vague, ask follow-up questions to make it specific and reusable.
2. **Search Before Storing** — Check for existing similar entries to avoid duplicates: `sandwich memory search --query "<topic or title>"`. If a match exists, suggest updating the existing entry instead.
3. **Validate Quality** — Ensure the knowledge is: specific and actionable (not generic advice), includes the "why" along with the "what", contains code examples where applicable, and does not include secrets or sensitive data.
4. **Store** — Run `sandwich memory store --title "<title>" --content "<content>" --tags "<tags>" --scope "<scope>"`.
5. **Confirm** — Summarize what was saved (title, scope, tags). Offer to retrieve related memory entries that might complement this knowledge.
6. **Next Steps** — Continue with the current task. Use `/review` to validate changes or `/test` to add coverage as needed.
