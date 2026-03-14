---
description: "ADLC Phase 4: Prompt & Skill Craft — design, write, and refine prompts, skills, and agent tool definitions."
---

Guide me through crafting a prompt, skill, or agent tool definition — from intent to tested artifact.

1. **Define Intent** — If not already provided, ask for: what the agent should do (one clear objective), expected input shape and sources, desired output format (structured vs free-form), failure modes to guard against, and who/what consumes the output (human, another agent, API).
2. **Search Prior Patterns** — Check memory for existing prompt patterns and conventions: `sandwich memory search --query "<domain> prompt pattern"`. Reuse established patterns; don't reinvent.
3. **Design Architecture** — Determine prompt structure:
   - **System prompt**: Role, hard constraints (MUST/NEVER), output format spec
   - **Tool definitions**: Name (verb-noun), description, JSON Schema parameters, examples
   - **User prompt template**: Context injection points, variable placeholders, chain-of-thought guidance
   - For skills: plan the `SKILL.md` sections (title, hard rules, workflow, output format, anti-patterns)
4. **Write First Draft** — Create the prompt/skill following the architecture from step 3. Apply these principles:
   - One prompt = one responsibility (no compound goals)
   - Include 2-3 few-shot examples covering normal + edge cases
   - Add explicit negative constraints ("NEVER", "DO NOT")
   - Keep concise — every sentence must earn its place
5. **Test with Representative Inputs** — Validate against at least 3 inputs:
   - Happy path (normal, expected input)
   - Edge case (empty, very long, ambiguous)
   - Adversarial (tries to break constraints or inject instructions)
   - Check: correctness, format consistency, constraint compliance
6. **Refine** — Based on test results, adjust constraints, examples, or structure. Re-test until all 3 inputs pass.
7. **Store Patterns** — Save reusable prompt patterns and design decisions: `sandwich memory store --title "<pattern>" --content "<details>" --tags "prompt-craft,<domain>"`.
8. **Next Steps** — Run `/eval` to evaluate the prompt with a formal rubric. If part of a larger agent, run `/design` to integrate into the system architecture.
