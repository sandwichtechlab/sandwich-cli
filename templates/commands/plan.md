---
description: "SDLC Phase 1 / ADLC Phase 0-1: Planning — gather requirements, define scope, assess feasibility, identify risks, and create the feature documentation structure. In ADLC mode, also covers preparation & hypotheses and human-agent responsibility mapping."
---

Guide me through planning a new feature — from problem understanding to a complete requirements document and project structure.

1. **Capture Requirements** — If not already provided, ask for: feature name (kebab-case, e.g., `user-authentication`), what problem it solves and who benefits, key user stories or acceptance criteria, known constraints (timeline, dependencies, backward compatibility), and success metrics.
   - **ADLC addition**: Also ask for — agent autonomy level (full, supervised, advisory), human-agent responsibility boundaries, target accuracy/hallucination thresholds, and cost budget (tokens, API calls).
2. **Search Prior Context** — Check memory for related decisions and conventions: `sandwich memory search --query "<feature or domain>"`. Reuse relevant context; skip questions already answered in prior sessions.
3. **Feasibility Assessment** — Evaluate before committing:
   - **Technical feasibility**: Can the team build this with current tech stack and skills?
   - **Resource feasibility**: Is the effort realistic within timeline and team capacity?
   - **Risk analysis**: What could go wrong? Dependencies on external systems? Data migration risks?
   - Document risks with severity (high/medium/low) and mitigation strategies.
4. **Create Feature Documentation Structure** — Create docs for all 7 SDLC phases from templates (preserving YAML frontmatter):
   - `docs/ai/requirements/feature-{name}.md` — Phase 1: Requirements & feasibility
   - `docs/ai/design/feature-{name}.md` — Phase 3: System design
   - `docs/ai/planning/feature-{name}.md` — Phase 1: Task breakdown
   - `docs/ai/implementation/feature-{name}.md` — Phase 4: Implementation progress
   - `docs/ai/testing/feature-{name}.md` — Phase 5: Test strategy
   - `docs/ai/deployment/feature-{name}.md` — Phase 6: Release & deploy
   - `docs/ai/maintenance/feature-{name}.md` — Phase 7: Post-deploy ops
5. **Fill Requirements Doc** — Complete `docs/ai/requirements/feature-{name}.md`:
   - Problem statement (what pain exists today)
   - Goals and non-goals (explicit scope boundaries)
   - User stories with acceptance criteria
   - Success metrics (measurable outcomes)
   - Constraints and assumptions
   - Risk assessment from step 3
   - Open questions and decision items
6. **Create Task Breakdown** — Fill `docs/ai/planning/feature-{name}.md` with initial task breakdown: high-level milestones, estimated effort, dependencies between tasks, and recommended implementation order.
7. **Store Decisions** — Persist important decisions and conventions: `sandwich memory store --title "<decision>" --content "<rationale>" --tags "<tags>"`.
8. **Next Steps** — Run `/review` to validate requirements and feasibility. Once approved, run `/design` to create the system architecture. In ADLC workflow, `/design` will focus on agent architecture patterns and tool definitions.
