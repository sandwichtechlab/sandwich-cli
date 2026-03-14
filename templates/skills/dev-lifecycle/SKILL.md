---
name: dev-lifecycle
description: End-to-end development lifecycle supporting both SDLC (7 phases) and ADLC (8 phases, 0-7). SDLC targets deterministic software; ADLC targets probabilistic agentic systems. Produces structured docs in docs/ai/. Use when building features end-to-end or running any individual phase.
---

# Dev Lifecycle

Dual-workflow lifecycle producing shared context docs in `docs/ai/`. Check `sandwich.json` → `"workflow"` field to determine which mode is active.

## SDLC Flow (Traditional Software)

```
/plan → /review-requirements → /design → /review-design → /execute ⇄ /update-planning → /recheck → /test → /code-review → /deploy
 P1           P2                 P3           P3              P4            P4               QG        P5         P6           P6
                                                               ↑                                       |
                                                               └── /debug ─────────────────────────────┘  (P7)
                                                               └── /simplify ──────────────────────────┘
```

## ADLC Flow (Agentic Systems)

```
/plan → /review-requirements → /design → /review-design → /craft → /eval → /execute ⇄ /update-planning + /eval → /test → /code-review → /deploy → /observe
 P0-1          P1                 P2           P2             P3      P3       P4                 P4                 P5         P6           P6        P7
                                                                                ↑                                    |
                                                                                └── /debug ─────────────────────────┘  (P7: continuous loop)
                                                                                └── /simplify ──────────────────────┘
                                                                                └── /observe ───────────────────────┘
```

> **ADLC key difference:** Development and evaluation are inseparable. `/eval` runs continuously during implementation, not just after. Deployment is "activation" — the start of active monitoring, not the end of development.

## Prerequisite

Before starting any phase, run `sandwich docs lint` to verify the base `docs/ai/` structure exists and is valid.

If working on a specific feature, also run `sandwich docs lint --feature <name>` to validate feature-scoped docs.

If lint fails because project docs are not initialized, run `sandwich docs init`, then rerun lint. Do not proceed until checks pass.

For a **new feature start** (Phase 1 or `/plan`), apply the shared worktree setup in [references/worktree-setup.md](references/worktree-setup.md) before phase work. This setup is worktree-first by default and includes explicit no-worktree fallback, context verification, and dependency bootstrap.

## SDLC Phases & Commands

| SDLC Phase | # | Command | Skill | Docs Directory | When |
|------------|---|---------|-------|----------------|------|
| **1. Planning** | 1 | `/plan` | brainstorming | `requirements/`, `planning/` | User wants to add a feature |
| **2. Review Requirements** | 2 | `/review-requirements` | brainstorming | validates `requirements/` | Requirements need validation |
| **3. System Design** | 3 | `/design` | system-design | `design/` | Create architecture from requirements |
| **3. Review Design** | 4 | `/review-design` | system-design | validates `design/` | Design needs validation |
| **4. Implementation** | 5 | `/execute` | system-design | `implementation/` | Ready to code tasks from plan |
| **4. Update Progress** | — | `/update-planning` | — | updates `planning/` | After completing tasks in Phase 4 |
| **4. Verify** | 6 | `/recheck` | system-design | validates `implementation/` | Verify code matches design |
| **5. Testing** | 7 | `/test` | testing | `testing/` | Add test coverage |
| **6. Code Review** | 8 | `/code-review` → `/deploy` | deployment | `deployment/` | Final review then release |
| **7. Maintenance** | 9 | `/debug`, `/simplify` | debug, simplify-implementation | `maintenance/` | Post-deploy fixes & improvements |

## ADLC Phases & Commands

| ADLC Phase | # | Command | Skill | Docs Directory | When |
|------------|---|---------|-------|----------------|------|
| **0. Preparation & Hypotheses** | 0 | `/plan` | brainstorming | `requirements/` | Pain point discovery, initial hypotheses before committing to any agent design |
| **1. Scope Framing** | 1 | `/plan` + `/review-requirements` | brainstorming | `requirements/`, `planning/` | Define KPIs, human-agent responsibility mapping, constraint identification |
| **2. Agent Architecture** | 2 | `/design` + `/review-design` | system-design | `design/` | Agent patterns (ReAct, Plan-and-Execute, Multi-agent), tool design, cost modeling |
| **3. Simulation & Proof** | 3 | `/craft` + `/eval` | prompt-craft, agent-eval | `design/`, `testing/` | Golden dataset, PoV prototype, baseline metrics, business case validation |
| **4. Implementation & Evals** | 4 | `/execute` + `/update-planning` + `/eval` | system-design, agent-eval | `implementation/` | Build + continuous eval loop (change → evaluate → confirm → proceed) |
| **5. Testing** | 5 | `/test` + `/eval` | testing, agent-eval | `testing/` | E2E validation, UAT, bias testing, safety/red-team, performance at scale |
| **6. Agent Activation** | 6 | `/code-review` → `/deploy` | deployment | `deployment/` | Controlled rollout (canary/blue-green), AI-specific observability, alerting |
| **7. Continuous Learning** | 7 | `/observe`, `/debug`, `/simplify` | agent-observe, debug, simplify | `maintenance/` | Drift detection, feedback loops, model version governance, knowledge refresh |

### ADLC-Specific Concepts

| Concept | Description | Phase |
|---------|-------------|-------|
| **Human-Agent Responsibility Mapping** | Explicitly divide decisions, approvals, and autonomy levels between humans and the agent | P1 |
| **Golden Dataset** | Curated ground-truth dataset for all behavioral testing and regression | P3 |
| **Continuous Eval** | Dev and eval are inseparable — validate after every prompt/context change | P4 |
| **Behavioral Testing** | Test reasoning quality, safety, tool use — not just functional correctness | P5 |
| **Agent Activation** | Deployment = start of supervision, not end of development | P6 |
| **Concept Drift** | Agent behavior changes without code changes due to model updates, data drift, context shift | P7 |

### Phase References (detailed guides)

| Phase | Reference |
|-------|-----------|
| Planning | [references/new-requirement.md](references/new-requirement.md) |
| Feasibility | [references/review-requirements.md](references/review-requirements.md) |
| Design | [references/review-design.md](references/review-design.md) |
| Implementation | [references/execute-plan.md](references/execute-plan.md) |
| Progress Tracking | [references/update-planning.md](references/update-planning.md) |
| Verification | [references/check-implementation.md](references/check-implementation.md) |
| Testing | [references/writing-test.md](references/writing-test.md) |
| Code Review | [references/code-review.md](references/code-review.md) |

Load only the reference file for the current phase. For Phase 1, also load [references/worktree-setup.md](references/worktree-setup.md).

## Documentation Structure (7 directories)

```
docs/ai/
├── requirements/     Phase 1: Problem, goals, user stories, feasibility, risks
├── design/           Phase 3: Architecture, data models, APIs, design decisions
├── planning/         Phase 1: Task breakdown, effort, dependencies, progress
├── implementation/   Phase 4: Coding progress, decisions, knowledge captured
├── testing/          Phase 5: Test strategy, coverage, results
├── deployment/       Phase 6: Release notes, deploy strategy, rollback plan
└── maintenance/      Phase 7: Known issues, tech debt, monitoring, improvements
```

Feature docs: `docs/ai/{phase}/feature-{name}.md` (copy from `README.md` template in each directory, preserve frontmatter). Keep `<name>` aligned with the worktree/branch name `feature-<name>`.

## Resuming Work

If the user wants to continue work on an existing feature:

1. Check branch and worktree state before phase work:
   - Branch check: `git branch --show-current`
   - Worktree check: `git worktree list`
2. Determine target context for `<feature-name>`:
   - Prefer worktree `.worktrees/feature-<name>` when it exists.
   - Otherwise use branch `feature-<name>` in the current repository.
3. Before switching, explicitly confirm target with the user (branch or worktree path).
4. After user confirmation, switch to the confirmed context first:
   - Worktree: run phase commands with `workdir=.worktrees/feature-<name>`.
   - Branch: checkout `feature-<name>` in current repo.
5. After switching, run `sandwich docs lint --feature <feature-name>` in the active branch/worktree context.
6. Then run the phase detector using the installed skill directory:
   - Resolve `<skill-dir>` as the directory containing this `SKILL.md`.
   - Run `<skill-dir>/scripts/check-status.sh <feature-name>`.
     Use the suggested phase from this script based on doc state and planning progress.

## Backward Transitions

Not every phase moves forward. When a phase reveals problems, loop back:

- `/review` finds requirement gaps → back to `/plan` to revise
- `/review` finds design gaps → back to `/design` to revise
- `/recheck` finds major deviations → back to `/execute` (fix code) or `/design` (fix architecture)
- `/test` reveals design flaws → back to `/recheck` then `/design`
- `/review` (final) finds blocking issues → back to `/execute` (fix) or `/test` (coverage gaps)

## Memory Integration

Use `sandwich memory` CLI in any phase that involves clarification (typically Phases 1-3):

1. **Before asking questions**: `sandwich memory search --query "<topic>"`. Apply matches; only ask about uncovered gaps.
2. **After clarification**: `sandwich memory store --title "<title>" --content "<knowledge>" --tags "<tags>"`.

## Rules

- Read existing `docs/ai/` before changes. Keep diffs minimal.
- Use mermaid diagrams for architecture visuals.
- After each phase, summarize output and suggest next command.
- All 7 docs/ai/ directories share context between AI agents and team members across sessions.
