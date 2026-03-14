---
description: "ADLC Phase 9: Agent Observability — set up tracing, monitoring, feedback loops, and drift detection for agents in production."
---

Guide me through setting up or reviewing observability for an agent — from instrumentation to feedback loops.

1. **Gather Context** — If not already provided, ask for: which agent/prompt is being observed, current observability state (none, basic logging, full tracing), production environment details (where the agent runs), known issues or concerns triggering this review, and available monitoring infrastructure (logging, metrics, alerting tools).
2. **Search Prior Observations** — Check memory for prior observability findings and known drift patterns: `sandwich memory search --query "<agent> observability monitoring"`. Build on existing setup.
3. **Define Observation Points** — Identify what to instrument:
   - **Input layer**: Request volume, input size/type distribution, user patterns
   - **Reasoning layer**: Decision points, chain-of-thought quality, confidence signals
   - **Tool call layer**: Which tools called, arguments, success/failure, latency per call
   - **Output layer**: Response quality, format compliance, length distribution
   - **Cost layer**: Token usage (input/output), API calls, total cost per request
   - **Safety layer**: Refusals, escalations, boundary violations
4. **Set Up Tracing** — Implement structured tracing:
   - Assign unique `trace_id` per conversation/request
   - Create spans for: input processing, reasoning, each tool call, output generation
   - Log structured data (not raw text) with PII/secret redaction
   - Include: tool name, arguments (redacted), duration_ms, result status, token counts
5. **Define Metrics & Alerts** — Set up key metrics with alert thresholds:
   - **Performance**: Latency p50/p95, error rate, token usage per request
   - **Quality**: Format compliance rate, task completion rate, consistency score
   - **Safety**: Unauthorized tool calls, data leakage incidents, injection attempts
   - **Cost**: Cost per request, daily/weekly spend, budget utilization
   - Set alert thresholds (e.g., error rate > 5%, latency p95 > 30s, any safety violation)
6. **Establish Feedback Loops** — Define the observe-act cycle:
   - Quality degradation → review prompt, check model changes, re-run `/eval`
   - New failure mode → add eval case, update prompt constraints via `/craft`
   - Usage pattern shift → adjust few-shot examples, expand test coverage
   - Cost spike → optimize prompt, review tool call efficiency
   - Tool reliability drop → fix tool, add fallback, update error handling
7. **Set Up Drift Detection** — Configure monitoring for gradual changes:
   - Output distribution comparison over time windows (daily/weekly)
   - Tool call pattern tracking (frequency, argument changes)
   - Latency and token usage trend analysis
   - Scheduled safety eval runs on sampled production traces
8. **Store Observability Setup** — Persist configuration and baseline metrics: `sandwich memory store --title "<agent> observability baseline" --content "<metrics and thresholds>" --tags "observe,<agent>"`.
9. **Next Steps** — If issues detected: run `/debug` for root cause analysis. If prompt changes needed: run `/craft` then `/eval`. Schedule regular observability reviews (weekly recommended).
