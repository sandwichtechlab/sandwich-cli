---
name: simplify-implementation
description: Analyze and simplify code — reduce complexity, improve readability, remove dead code, flatten nesting, and decouple modules. Use when users ask to simplify, refactor, clean up, reduce tech debt, or improve maintainability.
---

# Simplify Implementation

Reduce complexity through analysis-first approach. Understand the code's purpose and constraints before proposing changes.

## Hard Rules
- Do not modify code until the user approves a simplification plan.
- Readability over brevity. Some duplication beats the wrong abstraction.
- Never simplify away correctness. If you're unsure a change is safe, flag it.

## Mindset

Simplification is not about making code shorter — it's about making it easier to understand and change. Apply the **30-second test**: can a developer new to this codebase understand the code's purpose and flow within 30 seconds of reading it?

When NOT to simplify:
- Performance-critical code where the complexity serves measured optimization
- Code that's about to be replaced or deprecated
- Abstractions that serve a real, current use case (not hypothetical future needs)

The best simplification removes concepts. Reducing the number of things a reader needs to hold in their head is more valuable than reducing line count.

## Workflow

1. **Gather Context**
   - Confirm targets, pain points, and constraints (compatibility, API stability, deadlines).
   - Understand who reads and changes this code most often.
   - Identify the real problem: is it hard to read, hard to change, hard to test, or slow?

2. **Analyze Complexity**
   - Identify sources: deep nesting, duplication, tight coupling, over-engineering, magic values, unclear naming, god objects, feature envy.
   - Assess impact: lines of code, number of dependencies, cognitive load for a new reader.
   - Identify scalability blockers: single points of failure, sync where async needed, missing caching.
   - Count the "concepts" a reader must understand — this is the true complexity metric.

3. **Apply Readability Principles**
   - Apply the [readability guide](references/readability-guide.md) and its "Reading Test".
   - Each function should do one thing and its name should say what that thing is.
   - Prefer explicit over implicit. Prefer flat over nested. Prefer pure over stateful.

4. **Propose Simplifications**
   For each issue, choose the right pattern:
   - **Extract**: Long functions → smaller, focused functions with clear names
   - **Consolidate**: Duplicate code → shared utilities (only when 3+ occurrences)
   - **Flatten**: Deep nesting → early returns, guard clauses, pipeline patterns
   - **Decouple**: Tight coupling → dependency injection, interfaces, event-driven
   - **Remove**: Dead code, unused features, speculative abstractions, unnecessary wrappers
   - **Replace**: Hand-rolled logic → built-in language/library features
   - **Defer**: Premature optimization → measure-first approach with profiling data

   Provide before/after snippets for each proposal.

5. **Prioritize and Plan**
   - Rank by impact vs risk:
     1. High impact, low risk — do first
     2. High impact, higher risk — plan carefully with tests
     3. Low impact, low risk — quick wins if time permits
     4. Low impact, high risk — skip or defer
   - Specify testing requirements for each change.
   - Produce recommended execution order.

## Validation
- No regressions: all existing tests pass after each change.
- Add tests for extracted helpers or changed interfaces.
- Update documentation if public interfaces changed.
- Re-apply the 30-second test to the result.

## Output Template
- Target and Context (what, why, constraints)
- Complexity Analysis (sources, metrics, impact)
- Simplification Proposals (prioritized, with before/after)
- Execution Plan (order, risks, testing)
- Scalability Recommendations
- Validation Checklist
