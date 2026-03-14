---
name: memory
description: Store, search, and manage persistent knowledge across sessions using sandwich memory CLI. Use when storing coding patterns, project conventions, debugging solutions, or retrieving previously saved knowledge.
---

# Memory Skill

Persistent knowledge storage that survives across sessions. Store insights, patterns, conventions, and solutions — retrieve them when context is needed.

## When to Use

- Store reusable patterns after resolving an issue or establishing a convention
- Search for prior decisions before asking the user repetitive questions
- Retrieve context before starting a task in a domain you've worked on before
- Avoid duplicates by searching before storing

## Commands

### Store Knowledge

```bash
sandwich memory store \
  --title "<short descriptive title>" \
  --content "<detailed knowledge content>" \
  --tags "<comma-separated tags>" \
  --scope "<scope>"
```

| Param       | Required | Description                                    |
|-------------|----------|------------------------------------------------|
| `--title`   | Yes      | Explicit, actionable title (max 100 chars)     |
| `--content` | Yes      | Detailed explanation in markdown (max 5000)    |
| `--tags`    | No       | Comma-separated domain keywords                |
| `--scope`   | No       | `global` (default) or `project:<name>`         |

**Examples:**

```bash
# Global coding pattern
sandwich memory store \
  --title "Always handle BigInt serialization in API responses" \
  --content "Convert BigInt to string via BigInt.toString() before serialization. JSON.stringify() cannot serialize BigInt natively." \
  --tags "api,backend,serialization"

# Project-specific convention
sandwich memory store \
  --title "Use pnpm for package management" \
  --content "This monorepo uses pnpm workspaces. Always use pnpm instead of npm or yarn." \
  --scope "project:my-monorepo"
```

### Search Knowledge

```bash
sandwich memory search \
  --query "<search terms>" \
  --tags "<filter tags>" \
  --scope "<filter scope>" \
  --limit <n>
```

| Param     | Required | Description                             |
|-----------|----------|-----------------------------------------|
| `--query` | Yes      | Natural language search (min 3 chars)   |
| `--tags`  | No       | Comma-separated tags to filter by       |
| `--scope` | No       | Filter by scope                         |
| `--limit` | No       | Max results (default 5, max 20)         |

**Examples:**

```bash
# Basic search
sandwich memory search --query "API response handling"

# Scoped search with tag filter
sandwich memory search \
  --query "coding standards" \
  --scope "project:my-app" \
  --tags "conventions" \
  --limit 10
```

### Update Knowledge

```bash
sandwich memory update \
  --id "<uuid>" \
  --title "<new title>" \
  --content "<new content>" \
  --tags "<new tags>" \
  --scope "<new scope>"
```

All fields except `--id` are optional — only provided fields are updated.

## Integration with AI Workflows

1. **Before asking questions** — search for prior decisions on the topic to avoid redundant clarification
2. **After resolving an issue** — store the root cause and fix pattern for future reference
3. **When conventions are established** — store them so they persist across sessions
4. **Before starting a task** — search for relevant context in the domain

## Best Practices

### Titles
- Be explicit and actionable: "Always validate user input before database queries"
- Include the domain: "React: Use useCallback for event handlers in list items"
- Keep concise: 5-12 words that capture the essence

### Content
- Use markdown formatting with code examples
- Explain the "why", not just the "what"
- Include edge cases and exceptions

### Tags
- Lowercase, single-word: `typescript`, `react`, `docker`
- Include domains: `api`, `frontend`, `testing`, `security`
- Include action types: `debugging`, `performance`, `patterns`

### Scope

| Scope            | Use When                               |
|------------------|----------------------------------------|
| `global`         | Knowledge applies to all projects      |
| `project:<name>` | Specific to a named project            |

## Storage

All data stored locally at `~/.sandwich/memory.db` (SQLite with FTS5 full-text search). The database is portable — copy it to another machine to share knowledge.

## Troubleshooting

| Error               | Solution                                                   |
|---------------------|------------------------------------------------------------|
| Duplicate title     | Use a more specific title or update the existing entry     |
| Query too short     | Search queries must be at least 3 characters               |
| Empty results       | Broaden search terms, remove tag filters, try synonyms     |
