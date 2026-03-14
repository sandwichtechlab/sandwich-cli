---
description: "SDLC Phase 7: Maintenance — simplify code by reducing complexity, removing dead code, and improving readability."
---

Help me simplify an existing implementation while maintaining or improving its functionality.

1. **Gather Context** — If not already provided, ask for: target file(s) or component(s) to simplify, current pain points (hard to understand, maintain, or extend?), performance or scalability concerns, constraints (backward compatibility, API stability, deadlines), and relevant design docs or requirements.
2. **Search Prior Patterns** — Check memory for established patterns and prior refactors in this area: `sandwich memory search --query "<component or pattern>"`. Reuse known simplification strategies.
3. **Analyze Current Complexity** — For each target, identify:
   - **Complexity sources**: deep nesting, code duplication, unclear abstractions, tight coupling, over-engineering, magic values
   - **Cognitive load**: how long would a new team member need to understand this code?
   - **Scalability blockers**: single points of failure, sync where async is needed, missing caching, inefficient algorithms
4. **Propose Simplifications** — Prioritize readability over brevity (some duplication beats the wrong abstraction). Apply the 30-second test: can a new team member understand each change quickly? For each issue, suggest a concrete pattern:
   - **Extract**: Long functions → smaller, focused functions
   - **Consolidate**: Duplicate code → shared utilities
   - **Flatten**: Deep nesting → early returns, guard clauses
   - **Decouple**: Tight coupling → dependency injection, interfaces
   - **Remove**: Dead code, unused features, excessive abstractions
   - **Replace**: Complex logic → built-in language/library features
   Provide before/after code snippets for each proposal.
5. **Prioritize & Plan** — Rank changes by impact vs risk:
   1. High impact, low risk — do first
   2. High impact, higher risk — plan carefully
   3. Low impact, low risk — quick wins if time permits
   4. Low impact, high risk — defer or skip
   Specify testing requirements and effort for each change. Produce a recommended execution order.
6. **Store Reusable Patterns** — Save simplification patterns and trade-offs via `sandwich memory store --title "<pattern>" --content "<details>" --tags "<tags>"`.
7. **Next Steps** — After implementation, run `/recheck` to verify alignment, then `/test`, then `/review`.
