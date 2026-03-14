---
description: "Quality Gate: Review feature design for completeness, consistency with requirements, and architectural soundness."
---

Review the design documentation in `docs/ai/design/feature-{name}.md` against approved requirements.

1. **Search Prior Context** — Check memory for prior architecture constraints and patterns: `sandwich memory search --query "<feature> design architecture"`.
2. **Summarize Design** — Read the design doc and summarize:
   - Architecture overview (ensure mermaid diagram is present and accurate)
   - Key components and their responsibilities
   - Technology choices and rationale
   - Data models and relationships
   - API/interface contracts (inputs, outputs, auth)
   - Major design decisions and trade-offs
   - Non-functional requirements that must be preserved
3. **Cross-Reference Requirements** — Verify every requirement has a corresponding design element. Flag requirements without coverage or design elements without requirements justification.
4. **Highlight Issues** — Flag inconsistencies, missing sections, diagrams that need updates, or scalability concerns.
5. **ADLC Addition** — In ADLC workflow, also validate: agent pattern choice (ReAct, Plan-and-Execute, Multi-agent) is justified, tool definitions are complete with JSON Schema, cost model estimates are documented, and context engineering strategy (memory, history, RAG) is defined.
6. **Store Knowledge** — Persist approved design patterns and constraints: `sandwich memory store --title "<pattern>" --content "<details>" --tags "design,architecture,<feature>"`.
7. **Next Steps** — If requirements gaps are found, return to `/review-requirements`; if design is sound, continue to `/execute`. In ADLC workflow, run `/craft` before `/execute`.
