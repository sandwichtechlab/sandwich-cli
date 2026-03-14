---
name: capture-knowledge
description: Analyze a code entry point (module, file, function, or API) and produce structured knowledge documentation. Use when users want to document, understand, trace, or map code for any part of the codebase.
---

# Knowledge Capture

Analyze code entry points and produce structured documentation. The goal is to create a mental model that accelerates future work — not just describe what exists, but explain why it exists and how it connects.

## Hard Rules
- Do not create documentation until the entry point is validated and analysis is complete.
- Analyze before documenting. Understanding comes first; writing comes second.

## Mindset

Good knowledge capture answers three questions:
1. **What does this do?** — Purpose, behavior, inputs/outputs
2. **Why does it exist this way?** — Design decisions, trade-offs, constraints that shaped it
3. **How does it connect?** — Dependencies, consumers, data flow through the system

Avoid documentation that merely restates the code. Focus on the context that isn't obvious from reading the source: the reasoning, the gotchas, the implicit contracts.

## Workflow

1. **Gather & Validate**
   - Confirm entry point (file, folder, function, API), purpose, and desired depth.
   - Verify it exists; resolve ambiguity or suggest alternatives if not found.
   - Clarify scope: full deep-dive vs focused analysis of specific aspect.

2. **Collect Source Context**
   - Read the primary source and summarize purpose, public API, and key patterns.
   - For files: exports, configuration, side effects.
   - For folders: structure, module boundaries, key entry points.
   - For functions/APIs: signature, parameters, return values, error paths, invariants.
   - Note design patterns in use (factory, observer, middleware chain, etc.).

3. **Trace Dependencies**
   - Build dependency view up to depth 3, tracking visited nodes to prevent cycles.
   - Categorize: internal imports, service calls, external packages, infrastructure.
   - Identify the "blast radius" — what breaks if this code changes?
   - Exclude generated code and third-party internals from deep analysis.

4. **Synthesize Understanding**
   - Overview: purpose, language/framework, high-level behavior.
   - Core logic: execution flow, state transitions, key algorithms.
   - Patterns: architectural patterns, conventions, implicit contracts.
   - Error handling: failure modes, recovery strategies, error propagation.
   - Performance: hot paths, caching, async boundaries, known bottlenecks.
   - Security: trust boundaries, input validation, data sensitivity.
   - Risks: fragile areas, missing tests, implicit dependencies, tech debt.

5. **Create Documentation**
   - Normalize name to kebab-case (`calculateTotalPrice` → `calculate-total-price`).
   - Write to `docs/ai/implementation/knowledge-{name}.md`.
   - Use mermaid diagrams when they clarify flows, relationships, or state machines.
   - Include metadata: analysis date, depth level, files touched.

## Output Template Sections
- Overview (what it does, why it exists)
- Implementation Details (core logic, execution flow)
- Dependencies (internal/external, blast radius)
- Visual Diagrams (mermaid — data flow, sequence, architecture)
- Design Decisions (trade-offs, alternatives considered)
- Risks & Improvements (tech debt, fragility, optimization opportunities)
- Metadata (date, depth, files analyzed)
- Next Steps (related areas worth investigating)

## Validation
- Documentation covers all template sections with substance, not placeholders.
- Summarize key insights, open questions, and recommended follow-ups.
- Confirm file path and remind to commit.
