---
description: "SDLC Phase 5 / ADLC Phase 5: Testing — write unit, integration, and E2E tests based on requirements and design docs. In ADLC mode, also covers behavioral testing, bias/fairness testing, safety validation, and red-team exercises."
---

Write comprehensive tests for a feature, guided by the testing documentation and design specs.

1. **Gather Context** — If not already provided, ask for: feature name/branch, summary of changes (link to design and requirements docs), target test environment and framework, existing test suites and utilities available, and any known flaky or slow tests to avoid patterns from.
2. **Search Testing Patterns** — Check memory for existing testing conventions and prior edge cases: `sandwich memory search --query "<feature> testing strategy"`. Reuse established patterns and fixtures.
3. **Analyze Testing Template** — Read `docs/ai/testing/feature-{name}.md` and confirm it mirrors the base template. Identify required test categories from the doc. Cross-reference success criteria and edge cases from requirements and design docs. Note available mocks, stubs, and fixtures.
4. **Unit Tests (target 100% coverage)** — For each module/function:
   - List behavior scenarios: happy path, boundary values, edge cases, error handling
   - Generate test cases with clear assertions using existing test utilities
   - Highlight missing branches that prevent full coverage
   - Follow the Arrange-Act-Assert pattern
5. **Integration Tests** — Identify critical cross-component flows. For each flow:
   - Define setup and teardown steps
   - Test interaction boundaries, data contracts, and failure modes
   - Verify error propagation across component boundaries
6. **Coverage Strategy** — Recommend coverage tooling commands for the project's framework. Identify files/functions still needing coverage. Suggest additional tests to close gaps toward 100%.
7. **Store Testing Patterns** — Save reusable testing patterns, tricky fixtures, or discovered edge cases: `sandwich memory store --title "<pattern>" --content "<details>" --tags "testing,<feature>"`.
8. **Update Documentation** — Summarize tests added and any remaining gaps. Update `docs/ai/testing/feature-{name}.md` with links to test files and results. Flag deferred tests as follow-up tasks.
9. **ADLC: Behavioral & Safety Testing** — In ADLC workflow, add these test categories:
   - **Bias and fairness**: Evaluate behavior across demographics and input variations
   - **Safety and red-team**: Run prompt injection tests, data leakage checks, destructive action guards
   - **Compliance validation**: Verify regulatory requirements on agent outputs
   - **Performance at scale**: Measure latency, throughput, and cost under peak loads
   - Run `/eval` with the complete test suite for formal scoring and reporting
10. **Next Steps** — If tests expose design flaws, return to `/recheck` then fix. If all tests pass, proceed to `/review` for final code review before pushing.
