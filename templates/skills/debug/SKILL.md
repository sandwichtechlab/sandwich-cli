---
name: debug
description: Structured debugging — clarify expected vs actual behavior, reproduce the issue, identify root causes, and agree on a fix plan before changing code. Use for bugs, regressions, failing tests, incidents, error spikes, or root cause analysis (RCA).
---

# Debug

Evidence-first debugging. Understand the problem completely before proposing any fix. Resist the urge to jump to solutions.

## Hard Rules
- Do not modify code until the user approves a selected fix plan.
- Every hypothesis must be testable. If you can't verify it, refine it until you can.

## Mindset

Effective debugging is about narrowing possibilities, not guessing. Each step should cut the problem space in half. The goal is to build a chain of evidence that leads inevitably to the root cause.

Common traps to avoid:
- **Confirmation bias**: Don't look for evidence that supports your first guess — look for evidence that *disproves* it.
- **Shallow fixes**: A symptom fix hides the real problem. Ask "why does this happen?" at least twice.
- **Scope creep**: Fix the reported issue. Note other problems for separate investigation.

## Workflow

1. **Clarify**
   - Restate observed vs expected behavior in one concise comparison.
   - Confirm the source of truth (spec, test, requirement, user expectation).
   - Define measurable success criteria: what does "fixed" look like?

2. **Reproduce**
   - Capture minimal reproduction steps — the fewest actions that trigger the bug.
   - Record environment fingerprint: runtime version, OS, config flags, data sample.
   - Classify: always reproducible, intermittent (frequency?), environment-specific.
   - If not reproducible, focus on gathering more signal before hypothesizing.

3. **Hypothesize and Test**
   For each hypothesis:
   - **If true**: what evidence would you see? (predicted positive signal)
   - **If false**: what evidence would disprove it? (predicted negative signal)
   - **Test**: exact command, query, or code check to verify.
   - Prefer one-variable-at-a-time tests. Change one thing, observe one result.
   - Rank hypotheses by likelihood. Test the most likely first.
   - Stop when you find a hypothesis that explains ALL observed symptoms.

4. **Plan**
   - Present fix options with: approach, risk level, affected components, validation steps.
   - For each option, identify what could go wrong and how to detect it.
   - Recommend one option with clear rationale. Request user approval.

## Validation
- Confirm a pre-fix failing signal exists (the bug is demonstrably present).
- Confirm post-fix success signal (the bug is demonstrably gone).
- Run nearby regression checks to ensure the fix doesn't break adjacent behavior.
- Summarize: remaining risks, monitoring to watch, and follow-up items.

## Output Template
- Observed vs Expected (concise diff)
- Reproduction Steps & Environment
- Hypotheses Tested (with evidence for/against)
- Fix Options & Recommendation
- Validation Plan & Results
- Open Questions & Follow-ups
