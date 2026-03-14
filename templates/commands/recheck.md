---
description: "Quality Gate: Verify implementation matches design and requirements — flag deviations, missing pieces, and alignment issues before testing."
---

Compare the current implementation against the design and requirements documentation to verify alignment.

1. **Gather Context** — If not already provided, ask for: feature name, list of modified files (`git diff --stat`), design doc (`docs/ai/design/feature-{name}.md`), requirements doc (`docs/ai/requirements/feature-{name}.md`), and any known constraints or deviations.
2. **Search Prior Context** — Check memory for known architectural decisions: `sandwich memory search --query "<feature> design decisions"`.
3. **Summarize Design Intent** — Extract from the design doc: key architectural decisions, component boundaries, interfaces and data contracts, data flow and state management, security and performance requirements.
4. **File-by-File Comparison** — For every modified file, verify:
   - **Design alignment**: Does the code follow the documented architecture, component structure, and data flow?
   - **Requirements coverage**: Are all acceptance criteria and user stories addressed?
   - **Interface contracts**: Do APIs, data models, and component interfaces match the design spec?
   - **Missing pieces**: Are there design elements not yet implemented?
   - **Deviations**: Where does implementation differ from design? Is the deviation justified or accidental?
5. **Assess Alignment** — Produce an alignment report:
   - **Aligned**: Implementation matches design intent
   - **Minor deviation**: Acceptable difference with justification (document the reason)
   - **Major deviation**: Needs design update or code fix
   - **Missing**: Design element not yet implemented
6. **Store Findings** — Save significant architectural findings via `sandwich memory store ...`.
7. **Summarize & Recommend** — List all deviations with severity. Identify missing pieces and concerns. Recommend next action:
   - If aligned → proceed to `/test`
   - If minor deviations → document in design doc, then `/test`
   - If major deviations → go back to `/execute` (fix code) or update design doc first
