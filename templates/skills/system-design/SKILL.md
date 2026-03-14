---
name: system-design
description: "SDLC Phase 3: System Design — guide architecture decisions, component decomposition, data modeling, API design, and trade-off analysis. Use when designing new features, evaluating architecture options, creating data models, defining API contracts, or making technology choices."
---

# System Design

Guide architecture and design decisions with a structured, trade-off-aware approach. Good design makes the right things easy and the wrong things hard.

## Hard Rules
- Do not finalize design without documenting trade-offs for each major decision.
- Every design decision must answer: "What are we trading away by choosing this?"
- Design for the current requirements, not hypothetical future ones. Note future considerations but don't over-engineer for them.

## Mindset

System design is about managing complexity through good boundaries. The best architecture is the simplest one that meets all requirements — both functional and non-functional.

Three principles guide every design decision:
1. **Separation of concerns** — Each component does one thing well
2. **Explicit contracts** — Interfaces between components are clear and documented
3. **Reversibility** — Prefer decisions that are easy to change over ones that are "optimal" but permanent

## Workflow

1. **Understand Requirements**
   - Read `docs/ai/requirements/feature-{name}.md` thoroughly.
   - Extract functional requirements (what it must do).
   - Extract non-functional requirements (performance targets, security needs, scale expectations).
   - Identify constraints (tech stack, team skills, timeline, backward compatibility).
   - List assumptions that need validation.

2. **Assess Architecture Context**
   - Is this greenfield or extending existing architecture?
   - What patterns does the codebase already use? Follow them unless there's a strong reason not to.
   - What are the integration points with existing systems?
   - Search memory for prior architecture decisions: `sandwich memory search --query "<domain> architecture"`.

3. **Component Design**
   - Decompose into components with clear responsibilities.
   - Define boundaries: what each component owns, what it delegates.
   - Identify shared state and data ownership — every piece of data has exactly one owner.
   - Map dependencies: prefer one-directional; flag circular dependencies as design smells.
   - Use mermaid diagrams to visualize component relationships.

4. **Data Modeling**
   - Design schemas from the domain model, not from the UI.
   - Normalize to 3NF by default; denormalize only with measured performance justification.
   - Define relationships, constraints, and indexes.
   - Plan migration strategy if modifying existing schemas.
   - Consider data lifecycle: creation, updates, deletion, archival.

5. **API & Interface Design**
   - Define contracts between components: inputs, outputs, error cases.
   - For REST APIs: resource naming, HTTP methods, status codes, pagination, versioning.
   - For internal interfaces: function signatures, event contracts, message formats.
   - Design for backward compatibility — additive changes are safe, removals break things.
   - Document error handling: what errors can occur, how they propagate, how consumers handle them.

6. **Cross-Cutting Concerns**
   - **Security**: Authentication, authorization, input validation, data encryption, secrets management.
   - **Performance**: Identify hot paths, caching strategy, async boundaries, query optimization.
   - **Scalability**: Horizontal scaling approach, stateless design, bottleneck identification.
   - **Observability**: Logging strategy, metrics, distributed tracing, alerting thresholds.
   - **Error handling**: Failure modes, retry policies, circuit breakers, graceful degradation.

7. **Design Decisions Log**
   For each significant decision, document:
   - **Decision**: What was chosen
   - **Context**: Why this decision was needed
   - **Alternatives**: What else was considered
   - **Trade-offs**: What we gain vs what we lose
   - **Consequences**: What this decision makes easier or harder

8. **Document Design**
   - Write to `docs/ai/design/feature-{name}.md`.
   - Include: architecture overview, component diagrams (mermaid), data models, API contracts, sequence diagrams for key flows, design decisions log.

## Architecture Patterns Reference

| Pattern | Best For | Trade-off |
|---------|----------|-----------|
| Monolith | Small teams, early stage, simple domains | Simple deployment, harder to scale independently |
| Microservices | Large teams, independent scaling needs | Operational complexity, network latency |
| Event-driven | Async workflows, loose coupling | Eventual consistency, harder debugging |
| Layered (MVC) | CRUD-heavy apps, clear separation | Can become rigid, layer leakage |
| CQRS | Read/write asymmetry, complex queries | Complexity, eventual consistency |
| Serverless | Sporadic traffic, event processing | Cold starts, vendor lock-in, debugging difficulty |

## Validation
- Design covers all functional and non-functional requirements.
- Every component has clear ownership and boundaries.
- Trade-offs are documented for all major decisions.
- Diagrams accurately represent the architecture.
- No circular dependencies between components.

## Output Template
- Architecture Overview (with mermaid diagram)
- Component Design (responsibilities, boundaries)
- Data Models (schemas, relationships, migrations)
- API Contracts (endpoints, interfaces, error handling)
- Sequence Diagrams (key flows)
- Cross-Cutting Concerns (security, performance, observability)
- Design Decisions Log (decision, context, alternatives, trade-offs)
