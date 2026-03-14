---
description: "Knowledge: Analyze a code entry point (file, function, module, or API) and save structured knowledge documentation."
---

Guide me through creating a structured understanding of a code entry point and saving it to the knowledge docs.

1. **Gather & Validate Entry Point** — If not already provided, ask for: entry point (file, folder, function, API), why it matters (feature context, bug investigation, onboarding), and desired depth or focus areas. Confirm the entry point exists in the codebase; if ambiguous or not found, clarify or suggest alternatives.
2. **Search Existing Knowledge** — Check if prior analysis exists: `sandwich memory search --query "<entry point or subsystem>"`. Reuse relevant context; only investigate uncovered areas.
3. **Collect Source Context** — Read the primary file/module and summarize: purpose, public exports, key patterns, and design decisions. For folders: list structure and highlight key modules. For functions/APIs: capture signature, parameters, return values, error handling, and edge cases.
4. **Trace Dependencies** — Build a dependency graph up to depth 3, tracking visited nodes to avoid cycles. Categorize each dependency: internal imports, function calls, services, external packages. Note external systems or generated code to exclude from deep analysis.
5. **Synthesize Understanding** — Draft a clear explanation covering: overview (purpose, language, high-level behavior), core logic and execution flow, key patterns and design decisions, error handling strategy, performance and security considerations, and potential risks or improvement opportunities.
6. **Create Documentation** — Normalize name to kebab-case (`calculateTotalPrice` → `calculate-total-price`). Write to `docs/ai/implementation/knowledge-{name}.md` with sections: Overview, Implementation Details, Dependencies, Visual Diagrams (mermaid for flows and relationships), Additional Insights, Metadata (analysis date, depth, files touched), Next Steps.
7. **Persist Key Insights** — If discoveries should persist across sessions, store them via `sandwich memory store --title "<insight>" --content "<details>" --tags "<tags>"`.
8. **Review & Suggest Next Actions** — Summarize key findings and open questions. Suggest related areas worth deeper analysis. Confirm file path and recommend committing the documentation.
