# Agent Observability

> **ADLC Phase 9:** Monitor agent behavior in production — tracing, feedback loops, drift detection, and continuous improvement.

---

## Hard Rules

| Rule | Rationale |
|------|-----------|
| **Log every agent decision** | You can't fix what you can't see |
| **Trace tool calls end-to-end** | Tool failures are the #1 source of agent bugs |
| **Set alerts on behavioral drift** | Gradual degradation is harder to catch than crashes |
| **Feedback loops must close** | Observations without action are wasted effort |
| **Never log sensitive data** | PII, secrets, and credentials must be redacted before logging |

---

## Observability Framework

### 1. What to Observe

| Layer | Signals | Why |
|-------|---------|-----|
| **Input** | Request volume, input size, input types | Detect usage pattern changes |
| **Reasoning** | Chain-of-thought, decision points, confidence | Understand agent behavior |
| **Tool Calls** | Which tools, arguments, success/failure, latency | Tool reliability and efficiency |
| **Output** | Response quality scores, format compliance, length | Output quality monitoring |
| **Cost** | Token usage (input/output), API calls, latency | Budget and performance tracking |
| **Safety** | Refusals, escalations, boundary violations | Safety compliance |

### 2. Tracing Architecture

```
┌─────────────────────────────────────────────────┐
│ Agent Request                                   │
│  ├─ trace_id: unique per conversation           │
│  ├─ span: input_processing                      │
│  │   └─ input tokens, classification            │
│  ├─ span: reasoning                             │
│  │   └─ thinking tokens, decision points        │
│  ├─ span: tool_call (repeated)                  │
│  │   ├─ tool_name, arguments                    │
│  │   ├─ duration_ms                             │
│  │   ├─ result_status (success/error)           │
│  │   └─ result_summary                          │
│  ├─ span: output_generation                     │
│  │   └─ output tokens, format validation        │
│  └─ span: total                                 │
│      └─ total_ms, total_tokens, total_cost      │
└─────────────────────────────────────────────────┘
```

### 3. Key Metrics

#### Performance Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| **Latency (p50)** | < 2s | > 5s |
| **Latency (p95)** | < 10s | > 30s |
| **Token usage per request** | Within budget | > 2x baseline |
| **Tool call count per request** | Minimal needed | > 2x baseline |
| **Error rate** | < 1% | > 5% |

#### Quality Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| **Format compliance** | > 99% | < 95% |
| **Task completion rate** | > 95% | < 85% |
| **User satisfaction (if available)** | > 4/5 | < 3/5 |
| **Consistency score** | > 90% | < 80% |

#### Safety Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| **Unauthorized tool calls** | 0 | Any occurrence |
| **Data leakage incidents** | 0 | Any occurrence |
| **Prompt injection attempts blocked** | 100% | < 100% |
| **Appropriate refusal rate** | Matches expected | ± 20% deviation |

### 4. Feedback Loops

```
Observe → Detect anomaly → Diagnose root cause →
Adjust (prompt/tool/config) → Validate with eval → Deploy fix
```

#### Feedback Categories

| Category | Signal | Action |
|----------|--------|--------|
| **Quality degradation** | Eval scores dropping over time | Review prompt, check for model changes |
| **New failure mode** | Unseen error pattern | Add eval case, update prompt constraints |
| **Usage pattern shift** | Input distribution changed | Adjust few-shot examples, add new test cases |
| **Cost spike** | Token usage increasing | Optimize prompt length, review tool call efficiency |
| **Tool reliability** | Tool error rate increasing | Fix tool, add fallback, update error handling |

### 5. Drift Detection

| Drift Type | Detection Method | Response |
|------------|-----------------|----------|
| **Output drift** | Compare output distribution over time windows | Re-run eval suite, check model updates |
| **Behavioral drift** | Track tool call patterns, reasoning paths | Review prompt, compare with baseline |
| **Performance drift** | Monitor latency and token usage trends | Profile, optimize, or scale |
| **Safety drift** | Regular safety eval runs on production traces | Immediate investigation if any failure |

---

## Observability Checklist

### Setup

- [ ] Structured logging with trace IDs
- [ ] Tool call tracing (name, args, duration, result)
- [ ] Token usage tracking per request
- [ ] Error categorization and logging
- [ ] PII/secret redaction in logs

### Monitoring

- [ ] Dashboard with key metrics (latency, error rate, cost)
- [ ] Alerts on threshold breaches
- [ ] Daily/weekly quality trend reports
- [ ] Cost tracking per agent/feature

### Feedback

- [ ] Process for triaging observed issues
- [ ] Eval case creation from production failures
- [ ] Regular (weekly) review of agent behavior
- [ ] Prompt versioning tied to observation insights

---

## Anti-Patterns

| Anti-Pattern | Why It Fails | Fix |
|--------------|-------------|-----|
| Logging everything verbatim | PII risk, storage cost, noise | Log structured summaries, redact sensitive data |
| No alerting | Issues found days/weeks late | Set threshold alerts on key metrics |
| Observing without acting | Wasted effort, problems persist | Close the feedback loop — every insight needs an action |
| Only monitoring errors | Misses gradual quality degradation | Track quality scores and trends, not just failures |
| One-time setup | Observability needs evolve with the agent | Review and update observability as agent capabilities change |
