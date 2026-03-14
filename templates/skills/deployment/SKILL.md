---
name: deployment
description: "SDLC Phase 6: Deployment — guide release preparation, CI/CD pipeline design, versioning strategy, deployment execution, and post-deployment monitoring. Use when releasing software, setting up CI/CD, managing versions, planning rollbacks, or configuring monitoring."
---

# Deployment

Guide reliable, repeatable software releases. A good deployment is boring — nothing unexpected happens.

## Hard Rules
- Never deploy without a tested rollback plan.
- Every deployment must be reversible within minutes, not hours.
- Do not deploy on Fridays or before holidays unless it's a critical hotfix.

## Mindset

Deployment is not the finish line — it's the beginning of production. The goal is to make releases routine, low-risk, and fast. If deploying is scary, the process needs improvement, not courage.

Three principles:
1. **Automate everything**: Manual steps are error-prone. If you do it twice, script it.
2. **Ship small, ship often**: Small changes are easier to debug, review, and rollback.
3. **Monitor before, during, and after**: You can't fix what you can't see.

## Workflow

1. **Pre-Release Assessment**
   - Verify all prior phases are complete:
     - Requirements met (`docs/ai/requirements/feature-{name}.md`)
     - Design approved (`docs/ai/design/feature-{name}.md`)
     - Implementation verified (`/recheck` passed)
     - Tests pass (`docs/ai/testing/feature-{name}.md`)
     - Code review approved (`/review` passed)
   - Check for blocking issues in any phase docs.
   - Search memory for deployment lessons: `sandwich memory search --query "deployment lessons"`.

2. **Version Management**
   - Follow semantic versioning (semver):
     - **Major** (X.0.0): Breaking changes, incompatible API changes
     - **Minor** (0.X.0): New features, backward compatible
     - **Patch** (0.0.X): Bug fixes, no feature changes
   - Update version files (package.json, pyproject.toml, Cargo.toml, etc.).
   - Tag the release in git: `git tag -a vX.Y.Z -m "Release X.Y.Z"`.

3. **Changelog & Release Notes**
   - Generate changelog from git history since last release.
   - Structure: breaking changes (top), new features, bug fixes, improvements.
   - Write user-facing release notes: what changed, why it matters, migration steps if needed.
   - Link to relevant issues/PRs for context.

4. **Deployment Strategy Selection**

   | Strategy | Risk Level | Best For | Rollback Speed |
   |----------|-----------|----------|----------------|
   | **Direct** | Higher | Small changes, low traffic | Redeploy previous version |
   | **Blue-green** | Low | Zero-downtime requirement | Instant (switch traffic back) |
   | **Canary** | Lowest | High traffic, risk-averse | Instant (route away from canary) |
   | **Rolling** | Medium | Kubernetes/container fleets | Gradual (stop rollout) |
   | **Feature flags** | Lowest | Decouple deploy from release | Instant (toggle flag) |

   Document chosen strategy and rollback procedure in `docs/ai/deployment/feature-{name}.md`.

5. **CI/CD Pipeline**
   - Build: compile, bundle, create artifacts
   - Test: run full test suite (unit + integration + E2E)
   - Security: dependency audit, SAST scanning
   - Stage: deploy to staging environment
   - Verify: smoke tests on staging
   - Promote: deploy to production
   - Health check: verify production health after deploy

6. **Execute Deployment**
   - Create release branch or tag.
   - Run pipeline or execute deployment steps.
   - Monitor deployment progress and health checks.
   - Verify smoke tests pass in target environment.
   - If any step fails: stop, assess, rollback if needed.

7. **Post-Deployment Verification**
   - Verify critical user flows in production.
   - Compare key metrics with pre-deployment baseline:
     - Error rates (should not increase)
     - Response latency (should not regress)
     - Resource usage (CPU, memory, connections)
   - Confirm alerting and monitoring are active.
   - Watch for 15-30 minutes before declaring success.

8. **Document & Communicate**
   - Update `docs/ai/deployment/feature-{name}.md` with: deployment date, version, environment, any issues encountered, and post-deploy observations.
   - Notify stakeholders.
   - Update project tracking (close tickets, update status).

## Monitoring Essentials

| What to Monitor | Why | Tools |
|----------------|-----|-------|
| Error rate | Catch regressions immediately | Sentry, Datadog, CloudWatch |
| Response latency (p50, p95, p99) | Detect performance degradation | Prometheus, Grafana |
| Request throughput | Detect traffic anomalies | APM tools |
| Resource usage | Prevent OOM, CPU throttling | Container metrics |
| Business metrics | Catch logic bugs (0 orders = problem) | Custom dashboards |

## Rollback Decision Framework

| Signal | Action |
|--------|--------|
| Error rate > 2x baseline | Immediate rollback |
| P95 latency > 3x baseline | Investigate, rollback if not resolving |
| Health checks failing | Immediate rollback |
| Business metrics anomaly | Investigate, rollback if confirmed |
| Single user report | Investigate, don't rollback yet |

## Validation
- Deployment completed without errors.
- All health checks pass.
- Key metrics within acceptable ranges.
- Rollback plan verified (tested or documented).
- Deployment documented in `docs/ai/deployment/feature-{name}.md`.
- `docs/ai/maintenance/feature-{name}.md` updated with monitoring baseline.

## Output Template
- Pre-Release Checklist (all gates passed)
- Version & Changelog
- Deployment Strategy & Rollback Plan
- CI/CD Pipeline Steps
- Post-Deployment Verification Results
- Monitoring Baseline & Alerts
- Issues & Lessons Learned
