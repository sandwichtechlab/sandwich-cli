import type { Command } from "commander";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import chalk from "chalk";
import { ui } from "#ui/terminal-ui.js";

const PHASES = ["requirements", "design", "planning", "implementation", "testing", "deployment", "maintenance"] as const;
type Phase = (typeof PHASES)[number];

const PHASE_TITLES: Record<Phase, string> = {
  requirements:   "Phase 1: Planning — Requirements & Feasibility",
  design:         "Phase 3: System Design & Architecture",
  planning:       "Phase 1: Project Planning & Task Breakdown",
  implementation: "Phase 4: Implementation Guide",
  testing:        "Phase 5: Testing Strategy",
  deployment:     "Phase 6: Deployment & Release",
  maintenance:    "Phase 7: Maintenance & Operations",
};

const PHASE_DESCRIPTIONS: Record<Phase, string> = {
  requirements:   "Clarify the problem space, gather requirements, assess feasibility, and define success criteria",
  design:         "Define the technical architecture, components, data models, and API contracts",
  planning:       "Break down work into actionable tasks, estimate effort, and identify dependencies",
  implementation: "Track implementation progress, decisions, and knowledge captured during coding",
  testing:        "Define testing strategy, coverage targets, and test results",
  deployment:     "Document release strategy, versioning, changelog, and deployment procedures",
  maintenance:    "Track known issues, tech debt, monitoring, and post-deployment improvements",
};

function phaseReadmePath(cwd: string, phase: string) {
  return join(cwd, "docs", "ai", phase, "README.md");
}

const PHASE_SECTIONS: Record<Phase, string> = {
  requirements: `
## Problem Statement

## Goals & Non-Goals

## User Stories & Acceptance Criteria

## Feasibility & Risk Assessment

## Success Metrics

## Constraints & Assumptions

## Open Questions
`,
  design: `
## Architecture Overview

## Component Design

## Data Models

## API Contracts & Interfaces

## Security Considerations

## Performance Considerations

## Design Decisions Log
`,
  planning: `
## Task Breakdown

## Dependencies

## Effort Estimates

## Implementation Order

## Risks & Mitigations

## Progress Tracking
`,
  implementation: `
## Implementation Notes

## Key Decisions Made

## Knowledge Captured

## Deviations from Design

## Open Issues
`,
  testing: `
## Test Strategy

## Unit Tests

## Integration Tests

## E2E Tests

## Coverage Report

## Known Edge Cases
`,
  deployment: `
## Release Version

## Changelog

## Deployment Strategy

## Rollback Plan

## Pre-Deployment Checklist

## Post-Deployment Verification
`,
  maintenance: `
## Known Issues

## Technical Debt

## Monitoring & Alerts

## Performance Baseline

## Improvement Backlog
`,
};

function phaseReadmeContent(phase: Phase): string {
  return `---
phase: ${phase}
title: ${PHASE_TITLES[phase]}
description: ${PHASE_DESCRIPTIONS[phase]}
---

# ${PHASE_TITLES[phase]}
${PHASE_SECTIONS[phase]}`;
}

export function registerDocsCommand(program: Command): void {
  const docs = program
    .command("docs")
    .description("Manage project documentation structure (docs/ai/)");

  // ── sandwich docs init ────────────────────────────────────────────────────
  docs
    .command("init")
    .description("Initialize docs/ai/ phase directories with README templates")
    .option("--cwd <path>", "Target directory (default: cwd)")
    .action((opts: { cwd?: string }) => {
      const root = opts.cwd ?? process.cwd();
      let created = 0;
      let skipped = 0;

      for (const phase of PHASES) {
        const filePath = phaseReadmePath(root, phase);
        const dir = join(root, "docs", "ai", phase);

        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

        if (existsSync(filePath)) {
          ui.info(`${chalk.dim(phase.padEnd(16))} ${chalk.dim("already exists — skipped")}`);
          skipped++;
        } else {
          writeFileSync(filePath, phaseReadmeContent(phase), "utf-8");
          ui.success(`${chalk.cyan(phase.padEnd(16))} created ${chalk.dim(`docs/ai/${phase}/README.md`)}`);
          created++;
        }
      }

      console.log();
      ui.summary({
        title: "Docs Init",
        items: [
          { type: "success", count: created, label: "created" },
          { type: "info",    count: skipped, label: "skipped" },
        ],
      });
    });

  // ── sandwich docs lint ────────────────────────────────────────────────────
  docs
    .command("lint")
    .description("Validate docs/ai/ phase structure")
    .option("--cwd <path>", "Target directory (default: cwd)")
    .option("--feature <name>", "Also check feature docs (docs/ai/{phase}/feature-<name>.md)")
    .option("--json", "Output as JSON")
    .action((opts: { cwd?: string; feature?: string; json?: boolean }) => {
      const root = opts.cwd ?? process.cwd();

      type CheckResult = { phase: string; file: string; ok: boolean; fix?: string };
      const results: CheckResult[] = [];

      // Base structure checks
      for (const phase of PHASES) {
        const filePath = phaseReadmePath(root, phase);
        const ok = existsSync(filePath);
        results.push({
          phase,
          file: `docs/ai/${phase}/README.md`,
          ok,
          fix: ok ? undefined : `Run: sandwich docs init`,
        });
      }

      // Feature doc checks
      if (opts.feature) {
        const name = opts.feature.replace(/^feature-/, "");
        for (const phase of PHASES) {
          const filePath = join(root, "docs", "ai", phase, `feature-${name}.md`);
          const ok = existsSync(filePath);
          results.push({
            phase: `${phase}/feature-${name}`,
            file: `docs/ai/${phase}/feature-${name}.md`,
            ok,
            fix: ok ? undefined : `Create docs/ai/${phase}/feature-${name}.md`,
          });
        }
      }

      if (opts.json) {
        console.log(JSON.stringify(results, null, 2));
        return;
      }

      console.log();
      ui.text(chalk.bold("=== Base Structure ==="));
      for (const r of results.filter((r) => !r.phase.includes("/"))) {
        if (r.ok) {
          ui.text(`${chalk.green("[OK]    ")} ${r.file}`);
        } else {
          ui.text(`${chalk.red("[MISSING]")} ${r.file}`);
          if (r.fix) ui.text(`         ${chalk.dim(r.fix)}`);
        }
      }

      const featureResults = results.filter((r) => r.phase.includes("/"));
      if (featureResults.length > 0) {
        console.log();
        ui.text(chalk.bold(`=== Feature: ${opts.feature} ===`));
        for (const r of featureResults) {
          if (r.ok) {
            ui.text(`${chalk.green("[OK]    ")} ${r.file}`);
          } else {
            ui.text(`${chalk.yellow("[MISSING]")} ${r.file}`);
            if (r.fix) ui.text(`         ${chalk.dim(r.fix)}`);
          }
        }
      }

      console.log();
      const failed = results.filter((r) => !r.ok).length;
      if (failed === 0) {
        ui.text("All checks passed.");
      } else {
        ui.text(`${failed} check(s) failed.`);
        process.exitCode = 1;
      }
    });
}
