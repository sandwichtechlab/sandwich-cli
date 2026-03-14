---
name: testing
description: "SDLC Phase 5: Testing — guide test strategy, write unit/integration/E2E tests, achieve coverage targets, and identify edge cases. Use when writing tests, designing test strategy, improving coverage, setting up test infrastructure, or debugging failing tests."
---

# Testing

Guide comprehensive test strategy and implementation. Tests are documentation that verifies behavior — they tell the next developer what the code is supposed to do.

## Hard Rules
- Tests must be deterministic. A test that sometimes passes is worse than no test.
- Test behavior, not implementation. Tests should survive refactoring.
- Every test must have a clear "why" — if you can't explain what bug it prevents, reconsider it.

## Mindset

The purpose of testing is confidence: confidence that the code works, confidence that changes don't break things, confidence that edge cases are handled. Write tests that give maximum confidence with minimum maintenance burden.

The test pyramid is a guideline, not a law:
- **Unit tests** (70%): Fast, isolated, test single functions/classes. Catch logic bugs.
- **Integration tests** (20%): Test component interactions, data flow, API contracts. Catch wiring bugs.
- **E2E tests** (10%): Test real user flows end-to-end. Catch system-level bugs.

When to deviate: if your app is mostly glue code (API gateway, CRUD), shift toward integration tests. If it's algorithm-heavy, shift toward unit tests.

## Workflow

1. **Understand What to Test**
   - Read `docs/ai/requirements/feature-{name}.md` for acceptance criteria.
   - Read `docs/ai/design/feature-{name}.md` for component boundaries and contracts.
   - Identify: happy paths, edge cases, error paths, boundary values, concurrency scenarios.
   - Search memory for known testing patterns: `sandwich memory search --query "<feature> testing"`.

2. **Design Test Strategy**
   - Map each requirement to test type (unit, integration, E2E).
   - Identify what needs mocking vs real dependencies.
   - Define test data strategy: fixtures, factories, seeds.
   - Choose framework and tools appropriate for the tech stack.
   - Document strategy in `docs/ai/testing/feature-{name}.md`.

3. **Write Unit Tests**
   For each function/module:
   - **Happy path**: Normal inputs produce expected outputs.
   - **Edge cases**: Empty inputs, null/undefined, max values, unicode, special characters.
   - **Error handling**: Invalid inputs throw expected errors with correct messages.
   - **Boundary values**: Off-by-one, min/max, empty collections, single-element collections.
   - Follow **Arrange-Act-Assert** pattern. One assertion concept per test.
   - Name tests as sentences: `should return empty array when no items match filter`.

4. **Write Integration Tests**
   - Test component interactions at boundaries (API → service → database).
   - Verify data contracts between components match.
   - Test failure modes: what happens when a dependency is down or slow?
   - Use real dependencies when practical; mock only external services.
   - Test database queries with representative data volumes.

5. **Write E2E Tests**
   - Cover critical user journeys (signup, core workflow, payment).
   - Keep E2E tests minimal — they're slow and brittle.
   - Test the happy path thoroughly; test one critical error path.
   - Use stable selectors (data-testid, not CSS classes).

6. **Coverage Analysis**
   - Run coverage tools and identify uncovered branches.
   - Focus on covering business logic, not boilerplate.
   - 100% coverage is a target for critical paths, not a universal goal.
   - Untested code is a risk — decide explicitly what not to test and document why.

7. **Test Quality Checklist**
   - Tests are independent (can run in any order).
   - Tests are fast (unit < 10ms, integration < 1s, E2E < 30s).
   - Tests are readable (a new developer can understand what's being tested).
   - Tests don't depend on external state (time, network, filesystem outside fixtures).
   - Failing tests produce clear error messages that point to the problem.

## Testing Anti-Patterns (AVOID)

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| Testing implementation details | Breaks on every refactor | Test inputs → outputs |
| Mocking everything | Tests pass but prod breaks | Use real deps where practical |
| No assertions | Tests pass but verify nothing | Every test needs explicit assertions |
| Shared mutable state | Tests affect each other | Reset state in beforeEach |
| Flaky tests ignored | Erodes trust in test suite | Fix or delete immediately |
| Copy-paste tests | Maintenance nightmare | Extract test helpers/factories |
| Testing getters/setters | No value, inflates coverage | Test behavior, not properties |

## Framework Quick Reference

| Language | Unit | Integration | E2E |
|----------|------|-------------|-----|
| TypeScript/JS | Vitest, Jest | Supertest, Testcontainers | Playwright, Cypress |
| Python | pytest | pytest + httpx | Playwright |
| Go | testing + testify | testcontainers-go | chromedp |
| Rust | cargo test | reqwest + testcontainers | — |

## Validation
- All acceptance criteria from requirements have corresponding tests.
- Coverage meets team targets for critical paths.
- Tests are deterministic (run 3 times, same result).
- No skipped or disabled tests without documented reason.
- Test documentation updated in `docs/ai/testing/feature-{name}.md`.

## Output Template
- Test Strategy (pyramid distribution, tools, data strategy)
- Unit Tests (per module/function, with edge cases)
- Integration Tests (per boundary, with failure modes)
- E2E Tests (critical user journeys)
- Coverage Report (current state, gaps, plan)
- Known Edge Cases & Deferred Tests
