# Prompt & Skill Craft

> **ADLC Phase 4:** Design, write, and refine prompts, skills, and agent tool definitions.

---

## Hard Rules

| Rule | Rationale |
|------|-----------|
| **One prompt = one responsibility** | Compound prompts produce unpredictable outputs |
| **Test before shipping** | Every prompt must be validated against at least 3 representative inputs |
| **Version every change** | Prompts are code — track diffs, not just final state |
| **Include failure modes** | Define what the prompt should NOT do (negative constraints) |

---

## Prompt Design Workflow

### 1. Define Intent

Before writing any prompt:

| Question | Purpose |
|----------|---------|
| What is the agent's goal? | Scope the prompt to one clear objective |
| What inputs will it receive? | Define expected input shape and edge cases |
| What output format is needed? | Structured (JSON, YAML) vs free-form |
| What are the failure modes? | Hallucination, refusal, off-topic, wrong format |
| Who consumes the output? | Human, another agent, API — affects tone and structure |

### 2. Prompt Architecture

```
┌─────────────────────────────────────┐
│ System Prompt                       │
│  ├─ Role & identity                 │
│  ├─ Hard constraints (MUST/NEVER)   │
│  ├─ Output format specification     │
│  └─ Examples (few-shot)             │
├─────────────────────────────────────┤
│ Tool Definitions                    │
│  ├─ Name & description              │
│  ├─ Parameter schema (JSON Schema)  │
│  ├─ Required vs optional params     │
│  └─ Example invocations             │
├─────────────────────────────────────┤
│ User Prompt Template                │
│  ├─ Context injection points        │
│  ├─ Variable placeholders           │
│  └─ Chain-of-thought guidance       │
└─────────────────────────────────────┘
```

### 3. Writing Patterns

#### System Prompt Pattern

| Section | Purpose | Example |
|---------|---------|---------|
| **Role** | Set behavior baseline | "You are a code reviewer focused on security" |
| **Constraints** | Hard boundaries | "NEVER suggest deleting files without confirmation" |
| **Format** | Output structure | "Respond in JSON with keys: action, reasoning, confidence" |
| **Examples** | Few-shot calibration | 2-3 input/output pairs covering normal + edge cases |

#### Tool Definition Pattern

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Verb-noun format: `search_files`, `create_issue` |
| `description` | Yes | One sentence: when and why to use this tool |
| `parameters` | Yes | JSON Schema with descriptions per field |
| `required` | Yes | List minimum required params |
| `examples` | Recommended | 1-2 realistic invocation examples |

### 4. Refinement Loop

```
Write prompt → Test with 3+ inputs → Analyze failures →
Adjust constraints/examples → Re-test → Document decisions
```

#### Refinement Checklist

- [ ] Does it handle the happy path correctly?
- [ ] Does it handle edge cases (empty input, very long input, ambiguous input)?
- [ ] Does it respect all hard constraints?
- [ ] Is the output format consistent across runs?
- [ ] Does it fail gracefully (clear error vs hallucination)?
- [ ] Are few-shot examples representative and diverse?

---

## Skill Authoring

### Skill Structure

```
skill-name/
├── SKILL.md          # Main skill prompt (loaded as system context)
├── references/       # Supporting docs, templates, examples
│   ├── template.md
│   └── examples.md
└── tools/            # MCP tool definitions (if applicable)
```

### SKILL.md Sections

| Section | Purpose |
|---------|---------|
| **Title & Description** | What the skill does, when to trigger |
| **Hard Rules** | Non-negotiable constraints (table format) |
| **Workflow** | Step-by-step process the agent follows |
| **Output Format** | Expected deliverables and their structure |
| **Anti-Patterns** | What NOT to do (common mistakes) |
| **References** | Links to supporting docs in `references/` |

---

## Quality Criteria

| Criterion | Measure |
|-----------|---------|
| **Clarity** | A new developer can understand the prompt's purpose in < 30 seconds |
| **Consistency** | Same input produces structurally similar output across 5 runs |
| **Completeness** | Covers happy path + top 3 failure modes |
| **Conciseness** | No redundant instructions; every sentence earns its place |
| **Testability** | Can be evaluated with concrete pass/fail criteria |

---

## Anti-Patterns

| Anti-Pattern | Why It Fails | Fix |
|--------------|-------------|-----|
| "Be helpful and thorough" | Too vague, no actionable constraint | Specify exact output format and scope |
| Mega-prompts (1000+ words) | Models lose focus on long instructions | Split into role + constraints + examples |
| No negative constraints | Model doesn't know what to avoid | Add explicit "NEVER" and "DO NOT" rules |
| No examples | Model guesses output format | Add 2-3 few-shot examples |
| Copy-paste prompts | Context drift between use cases | Tailor prompts to specific domain and inputs |
