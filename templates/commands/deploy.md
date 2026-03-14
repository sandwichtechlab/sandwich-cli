---
description: "SDLC Phase 6 / ADLC Phase 6: Deployment & Agent Activation — prepare release with versioning, deployment strategy, and post-deployment verification. In ADLC mode, deployment is controlled activation with AI-specific observability and behavioral monitoring."
---

Prepare and execute deployment of completed, tested, and reviewed code.

1. **Gather Context** — If not already provided, ask for: feature/release name, target environment (staging, production), deployment method (CI/CD, manual, platform-specific), version bump type (major, minor, patch), and any deployment dependencies or prerequisites.
2. **Pre-Deployment Checklist** — Verify before proceeding:
   - All tests pass (`/test` completed)
   - Code review approved (`/review` completed)
   - Implementation matches design (`/recheck` completed)
   - No unresolved blocking issues in docs
   - Database migrations prepared (if applicable)
   - Environment variables and secrets configured
   - Rollback plan documented
3. **Version & Changelog** — Prepare release artifacts:
   - Determine version number following semver (breaking change → major, new feature → minor, fix → patch)
   - Generate changelog from commits since last release
   - Update version in package.json / version files
   - Write release notes: summary of changes, breaking changes, migration guide if needed
4. **Deployment Strategy** — Choose and document approach:
   - **Direct deploy**: Simple push to production (small changes, low risk)
   - **Blue-green**: Run new version alongside old, switch traffic when ready
   - **Canary**: Roll out to small percentage first, monitor, then expand
   - **Feature flags**: Deploy code but control activation separately
   - Document the chosen strategy and rollback procedure
5. **Execute Deployment** — Follow the deployment steps:
   - Create release branch or tag
   - Run deployment pipeline / push to target environment
   - Monitor deployment progress and health checks
   - Verify smoke tests pass in target environment
6. **Post-Deployment Verification** — After deployment:
   - Verify key user flows work in production
   - Check error rates, latency, and resource usage
   - Confirm monitoring and alerting are active
   - Test rollback procedure (if not previously verified)
   - **ADLC addition**: Monitor AI-specific metrics — hallucination rate, token cost per request, reasoning quality, tool call success rate, prompt injection resistance
7. **Document & Communicate** — Update deployment records:
   - Mark release as complete in project tracking
   - Notify stakeholders of the deployment
   - Document any issues encountered and resolutions
   - Update `docs/ai/deployment/feature-{name}.md` with deployment notes and results
8. **Store Lessons** — Persist deployment insights: `sandwich memory store --title "<deployment lesson>" --content "<details>" --tags "deployment,<environment>"`.
9. **Next Steps** — Monitor production for Phase 7 (Maintenance). Use `/debug` for any post-deployment issues. Use `/capture` to document the deployed system for future reference. In ADLC workflow, immediately run `/observe` to set up continuous monitoring, drift detection, and feedback loops.
