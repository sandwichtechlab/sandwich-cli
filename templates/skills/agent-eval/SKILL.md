# Agent Evaluation

> **ADLC Phase 7:** Evaluate agent output quality, reliability, and safety beyond traditional code testing.

---

## Hard Rules

| Rule | Rationale |
|------|-----------|
| **Every eval needs a rubric** | Subjective "looks good" is not evaluation |
| **Test with adversarial inputs** | Agents fail on edge cases humans don't anticipate |
| **Measure consistency, not just correctness** | Same input should produce structurally similar output |
| **Separate functional from behavioral evals** | Correct output + wrong behavior = still a bug |
| **Log all eval results** | Trends matter more than individual results |

---

## Evaluation Framework

### 1. Define Eval Dimensions

| Dimension | What It Measures | Example Criteria |
|-----------|-----------------|------------------|
| **Correctness** | Does the output solve the task? | Passes all acceptance criteria |
| **Format Compliance** | Does output match expected structure? | Valid JSON, correct schema, no extra fields |
| **Consistency** | Same input → similar output across runs? | 5 runs produce structurally identical results |
| **Safety** | Does it avoid harmful outputs? | No secrets leaked, no destructive actions |
| **Groundedness** | Is the output based on provided context? | No hallucinated facts, references exist |
| **Efficiency** | Token usage, latency, tool call count | Within budget and latency SLA |
| **Robustness** | Handles malformed/adversarial input? | Graceful failure, not crash or hallucination |

### 2. Eval Types

#### Functional Evals (Automated)

```
Input → Agent → Output → Assert(output matches expected)
```

| Eval Type | When to Use | Automation |
|-----------|------------|------------|
| **Golden set** | Curated input/output pairs | Fully automated |
| **Schema validation** | Output format correctness | Fully automated |
| **Regression suite** | After prompt changes | Fully automated |
| **Boundary testing** | Edge cases (empty, huge, malformed) | Fully automated |

#### Behavioral Evals (Semi-Automated)

| Eval Type | When to Use | Automation |
|-----------|------------|------------|
| **Tool use correctness** | Agent calls right tools with right args | Automated (trace inspection) |
| **Reasoning quality** | Chain-of-thought makes sense | Human review + rubric |
| **Refusal accuracy** | Refuses when it should, doesn't when it shouldn't | Automated with labeled dataset |
| **Multi-turn coherence** | Maintains context across conversation | Semi-automated |

#### Safety Evals (Mandatory)

| Eval Type | Check | Pass Criteria |
|-----------|-------|---------------|
| **Prompt injection** | Resists instruction override attempts | 100% resistance on test set |
| **Data leakage** | No secrets/PII in output | Zero leaks |
| **Destructive actions** | Confirms before destructive ops | Always asks, never auto-executes |
| **Scope creep** | Stays within defined capabilities | No unauthorized tool calls |

### 3. Eval Execution

#### Test Matrix

```
For each eval case:
  1. Prepare input (context + user message)
  2. Run agent N times (N ≥ 3 for consistency checks)
  3. Collect outputs + traces (tool calls, reasoning)
  4. Score against rubric
  5. Log results with metadata (model, prompt version, timestamp)
```

#### Scoring Rubric Template

| Score | Label | Criteria |
|-------|-------|----------|
| 5 | Excellent | Correct, well-formatted, efficient, handles edge cases |
| 4 | Good | Correct, minor format issues, reasonable efficiency |
| 3 | Acceptable | Mostly correct, some issues but usable |
| 2 | Poor | Partially correct, significant issues |
| 1 | Fail | Wrong output, format violation, or safety issue |

### 4. Eval Reporting

#### Report Structure

```markdown
## Eval Report: [Agent/Prompt Name]

**Version:** [prompt version or commit hash]
**Date:** [timestamp]
**Model:** [model ID]

### Summary
- Total cases: N
- Pass rate: X%
- Average score: Y/5
- Consistency: Z% (across repeated runs)

### Results by Dimension
| Dimension | Score | Pass Rate | Notes |
|-----------|-------|-----------|-------|

### Failures
| Case | Expected | Actual | Root Cause |
|------|----------|--------|------------|

### Recommendations
- [Action items based on failures]
```

---

## Eval-Driven Development

```
Define eval cases FIRST → Write prompt → Run evals →
Fail? → Refine prompt → Re-run evals → Pass? → Ship
```

### Regression Prevention

- Every bug fix adds a new eval case
- Prompt changes require full eval suite re-run
- Track eval scores over time (detect drift)
- Set minimum pass rate thresholds per dimension

---

## Anti-Patterns

| Anti-Pattern | Why It Fails | Fix |
|--------------|-------------|-----|
| "It looks right" | Subjective, not reproducible | Use scoring rubric |
| Testing only happy path | Misses edge cases that fail in production | Add adversarial + boundary tests |
| One-shot eval | Doesn't catch inconsistency | Run N ≥ 3 times per case |
| No baseline comparison | Can't tell if changes improved things | Track scores over prompt versions |
| Skipping safety evals | Risks data leakage or destructive actions | Safety evals are non-negotiable |
