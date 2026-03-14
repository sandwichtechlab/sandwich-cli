---
description: "SDLC Phase 3 / ADLC Phase 2: System Design — create architecture blueprint, data models, API contracts, and component specifications. In ADLC mode, also covers agent architecture patterns, tool definitions, and cost modeling."
---

Create the system design for a feature based on its approved requirements document.

1. **Gather Context** — If not already provided, ask for: feature name, requirements doc path (`docs/ai/requirements/feature-{name}.md`), existing architecture patterns in the codebase, and any technology constraints or preferences.
   - **ADLC addition**: Also ask for — agent pattern preference (ReAct, Plan-and-Execute, Multi-agent), orchestration framework, model selection (LLM/SLM), and token budget constraints.
2. **Search Prior Patterns** — Check memory for established architecture patterns: `sandwich memory search --query "<feature domain> architecture"`. Reuse proven patterns from similar features.
3. **Review Requirements** — Read the requirements doc thoroughly. Extract: functional requirements (what the system must do), non-functional requirements (performance, security, scalability), constraints (tech stack, backward compatibility, external dependencies), and acceptance criteria that inform design decisions.
4. **Architecture Design** — Define the high-level architecture:
   - System components and their responsibilities
   - Component interactions and data flow (use mermaid diagrams)
   - Integration points with existing systems
   - Technology choices with justification
   - Assess compatibility with existing product architecture
5. **Detailed Design** — For each component:
   - **Data models**: Schema definitions, relationships, migrations needed
   - **API contracts**: Endpoints, request/response shapes, error codes
   - **Interfaces**: Module boundaries, public APIs, event contracts
   - **State management**: How state flows through the system
   - **User interface**: Key screens/flows if applicable
6. **Cross-Cutting Concerns** — Address:
   - **Security**: Authentication, authorization, input validation, data protection
   - **Performance**: Expected load, caching strategy, query optimization
   - **Scalability**: Horizontal scaling approach, bottleneck identification
   - **Error handling**: Failure modes, retry strategies, graceful degradation
   - **Observability**: Logging, metrics, tracing, alerting
7. **Design Decisions Log** — Document each significant decision: what was decided, alternatives considered, trade-offs, and rationale for the chosen approach.
8. **Fill Design Doc** — Write everything to `docs/ai/design/feature-{name}.md` with mermaid diagrams for architecture, data flow, and sequence diagrams.
9. **Store Patterns** — Persist reusable architecture decisions: `sandwich memory store --title "<pattern>" --content "<details>" --tags "architecture,<domain>"`.
10. **Next Steps** — Run `/review` to validate design against requirements. Once approved:
    - **SDLC**: Run `/execute` to begin implementation.
    - **ADLC**: Run `/craft` to design prompts and tool definitions, then `/eval` to validate with golden dataset before `/execute`.
