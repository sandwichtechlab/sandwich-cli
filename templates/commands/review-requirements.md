---
description: "Quality Gate: Review feature requirements for completeness, clarity, and feasibility before proceeding to design."
---

Review `docs/ai/requirements/feature-{name}.md` and the project-level template `docs/ai/requirements/README.md` to ensure structure and content alignment.

1. **Search Prior Context** — Check memory for related requirements and domain decisions: `sandwich memory search --query "<feature> requirements"`.
2. **Summarize Requirements** — Read the requirements doc and summarize:
   - Core problem statement and affected users
   - Goals, non-goals, and success criteria
   - Primary user stories and critical flows
   - Constraints, assumptions, and open questions
   - Any missing sections or deviations from the template
3. **Identify Gaps** — Flag contradictions, missing acceptance criteria, vague success metrics, or untested assumptions. Suggest specific clarifications.
4. **ADLC Addition** — In ADLC workflow, also validate: human-agent responsibility mapping is defined, autonomy boundaries are explicit, accuracy/hallucination thresholds are set, and cost budget (tokens, API calls) is documented.
5. **Store Knowledge** — If new reusable requirement conventions are agreed, persist them: `sandwich memory store --title "<convention>" --content "<details>" --tags "requirements,<feature>"`.
6. **Next Steps** — If fundamentals are missing, go back to `/plan`; otherwise continue to `/design`. In ADLC workflow, also verify agent-specific constraints before proceeding.
