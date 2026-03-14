# Sandwich CLI

Universal CLI to initialize and manage AI coding skills across multiple AI-powered development environments.

## Supported Environments

| Environment | CLI Key |
|---|---|
| Claude Code | `claude` |
| Cursor | `cursor` |
| Google Gemini | `gemini` |
| GitHub Copilot | `github` |
| Windsurf | `windsurf` |
| KiloCode | `kilocode` |
| Antigravity | `antigravity` |
| OpenAI Codex | `codex` |
| AMP | `amp` |
| OpenCode | `opencode` |
| Roo Code | `roo` |

## Installation

```bash
npm install -g sandwich-ai
```

## Quick Start

```bash
# Initialize a project (interactive)
sandwich init

# Initialize with defaults (Claude Code + SDLC + all bundled skills)
sandwich init --yes
```

Running `init` will:
1. Create `sandwich.json` in your project root
2. Scaffold the appropriate directory structure for each selected environment
3. Install selected skills and slash commands

## Commands

### `sandwich init`

Initialize a project with `sandwich.json` and environment directories.

```bash
sandwich init [--yes]
```

**Options:**
- `--yes` — Skip prompts, use defaults

**Interactive prompts:**
- Select AI environments to support
- Choose workflow: **SDLC** or **ADLC**
- Select bundled skills and commands
- Choose installation mode: `clone` or `symlink`

---

### `sandwich install`

Install all skills defined in `sandwich.json`.

```bash
sandwich install [options]
```

**Options:**
- `-c, --config <path>` — Path to config file (default: `sandwich.json`)
- `--overwrite` — Re-install even if already present

---

### `sandwich skill`

Manage skills in your project.

```bash
sandwich skill add <registry> <name> [options]
sandwich skill remove <registry> <name>
sandwich skill list
sandwich skill update <registry> <name>
```

**`add` options:**
- `-e, --env <envs>` — Target specific environments, comma-separated (e.g. `claude,cursor`)
- `--overwrite` — Overwrite if already installed

**Examples:**
```bash
# Add a skill from the Anthropic registry
sandwich skill add anthropics/skills dev-lifecycle

# Add a skill only for Claude Code and Cursor
sandwich skill add anthropics/skills testing --env claude,cursor

# List all installed skills
sandwich skill list
```

---

### `sandwich registry`

Manage skill registries.

```bash
sandwich registry add <alias> <url> [--project]
sandwich registry remove <alias> [--project]
sandwich registry list
```

By default, registries are saved globally to `~/.sandwich/registries.json`. Use `--project` to save to `sandwich.json` instead.

**Examples:**
```bash
# Add a custom registry globally
sandwich registry add my-org https://github.com/my-org/skills

# Add a registry scoped to this project
sandwich registry add my-org https://github.com/my-org/skills --project

# List all available registries
sandwich registry list
```

**Built-in registries include:** `anthropics/skills`, `vercel-labs/agent-skills`, `vercel-labs/skills`, `sickn33/antigravity-awesome-skills`, and community registries from Supabase, Stripe, Cloudflare, and more.

---

### `sandwich memory`

Store and search knowledge items using a local SQLite database.

```bash
sandwich memory store [options]
sandwich memory search [options]
sandwich memory update [options]
```

**`store` options:**
- `-t, --title <title>` — Title (max 100 chars)
- `-c, --content <content>` — Content (max 5000 chars)
- `--tags <tags>` — Comma-separated tags
- `-s, --scope <scope>` — `global` or `project:<name>` (default: `global`)

**`search` options:**
- `-q, --query <query>` — Search query (min 3 chars)
- `--tags <tags>` — Filter by tags
- `-s, --scope <scope>` — Filter by scope
- `-l, --limit <n>` — Max results (default: 5)

**`update` options:**
- `--id <id>` — Item ID to update
- `-t, --title`, `-c, --content`, `--tags`, `-s, --scope` — Fields to update

**Examples:**
```bash
# Store a design decision
sandwich memory store \
  --title "Use SQLite for caching" \
  --content "Chose SQLite for local registry cache due to zero-config setup." \
  --tags "database,architecture"

# Search stored knowledge
sandwich memory search --query "database"

# Search by tag within a project scope
sandwich memory search --tags "architecture" --scope project:my-app
```

---

### `sandwich docs`

Initialize and validate a structured `docs/ai/` documentation layout.

```bash
sandwich docs init [--cwd <path>]
sandwich docs lint [--cwd <path>] [--feature <name>] [--json]
```

**`init`** creates `docs/ai/` with directories for each development phase:
`requirements`, `design`, `planning`, `implementation`, `testing`, `deployment`, `maintenance`

**`lint`** validates that the `docs/ai/` structure is correct.

---

## Workflows

Sandwich CLI supports two development lifecycle models:

### SDLC — Software Development Life Cycle

For traditional, deterministic software development. 7 phases:
1. Planning & Requirements
2. Review Requirements
3. System Design
4. Review Design
5. Implementation
6. Testing
7. Deployment

### ADLC — Agentic Development Life Cycle

For probabilistic AI agent development. 8 phases:
0. Preparation & Hypotheses
1. Scope Framing
2. Agent Architecture
3. Simulation & Proof
4. Implementation & Evals
5. Testing
6. Agent Activation
7. Continuous Learning

---

## Bundled Skills

Sandwich CLI ships with the following skills out of the box:

| Skill | Description |
|---|---|
| `dev-lifecycle` | End-to-end SDLC/ADLC development phases |
| `brainstorming` | Ideation and planning |
| `system-design` | Architecture and design |
| `testing` | Test strategy and execution |
| `deployment` | Release and deployment |
| `debug` | Debugging and troubleshooting |
| `memory` | Knowledge management |
| `technical-writer` | Documentation |
| `simplify-implementation` | Code simplification |
| `capture-knowledge` | Context capture |
| `prompt-craft` | Prompt engineering (ADLC) |
| `agent-eval` | Agent evaluation (ADLC) |
| `agent-observe` | Agent monitoring (ADLC) |

---

## Installation Modes

When installing skills you can choose between two modes:

- **Clone** — Copies skill files into your project. No automatic updates.
- **Symlink** — Links to the cached local registry. Updates automatically when the registry updates.

---

## Project Configuration

After `init`, a `sandwich.json` file is created at your project root:

```json
{
  "version": "1",
  "workflow": "sdlc",
  "environments": ["claude", "cursor"],
  "skills": [],
  "registries": [],
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

Global configuration is stored at `~/.sandwich/`.

---

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Type check
npm run typecheck

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## License

MIT
