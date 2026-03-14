---
description: "ADLC Phase 7: Agent Evaluation — assess agent output quality, consistency, safety, and reliability with structured rubrics."
---

Guide me through evaluating an agent, prompt, or skill — from defining criteria to scoring and reporting.

1. **Gather Context** — If not already provided, ask for: which agent/prompt/skill to evaluate, the current prompt version or commit hash, what triggered this eval (new prompt, regression, scheduled review), and available test inputs or golden datasets.
2. **Search Prior Evals** — Check memory for prior eval results and known failure modes: `sandwich memory search --query "<agent> evaluation results"`. Use prior baselines for comparison.
3. **Define Eval Dimensions** — Select which dimensions to evaluate:
   - **Correctness**: Does the output solve the task?
   - **Format compliance**: Does output match expected structure?
   - **Consistency**: Same input → similar output across N runs (N ≥ 3)?
   - **Safety**: No secrets leaked, no destructive actions, resists prompt injection?
   - **Groundedness**: Output based on provided context, no hallucinated facts?
   - **Efficiency**: Token usage, latency, tool call count within budget?
   - **Robustness**: Handles malformed or adversarial input gracefully?
4. **Build Test Cases** — For each dimension, create test cases:
   - **Golden set**: Curated input/output pairs with expected results
   - **Boundary tests**: Empty input, very long input, malformed input
   - **Adversarial tests**: Prompt injection attempts, instruction override, out-of-scope requests
   - **Regression tests**: Previously failed cases that should now pass
5. **Run Evaluations** — Execute each test case:
   - Run agent N times per case (N ≥ 3 for consistency checking)
   - Collect outputs + traces (tool calls, reasoning steps)
   - Score each output against rubric (1-5 scale: Fail, Poor, Acceptable, Good, Excellent)
6. **Analyze Results** — Aggregate scores by dimension. Identify: patterns in failures, consistency gaps, safety violations (any = blocking), and comparison with prior baseline (improved/regressed/stable).
7. **Generate Report** — Create eval report with: summary (pass rate, average score, consistency %), results by dimension, failure analysis with root causes, and action items for each failure category.
8. **Store Eval Results** — Persist eval baseline and findings: `sandwich memory store --title "<agent> eval v<version>" --content "<summary and key findings>" --tags "eval,<agent>"`.
9. **Next Steps** — If failures found: return to `/craft` to refine the prompt, then re-run `/eval`. If all pass: proceed to `/deploy` for release. If safety failures: block deployment until resolved.
