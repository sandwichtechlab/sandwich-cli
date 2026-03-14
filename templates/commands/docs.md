---
description: "Knowledge: Review and improve documentation from a novice user's perspective with technical writing best practices."
---

Review the specified documentation as a professional technical writer, focusing on how a novice user would experience it.

1. **Identify Target** — If not specified, ask which document(s) to review.
2. **Read as a Novice** — Go through each document start to finish. Note where a newcomer would get stuck, confused, or need outside help.
3. **Rate Four Dimensions** — For each document, rate 1-5:
   - **Clarity**: Can a novice understand without outside help? Are concepts explained before used? Is jargon avoided or defined?
   - **Completeness**: Are prerequisites stated? Are there quick-start examples? Are edge cases and errors addressed?
   - **Actionability**: Are commands copy-paste ready? Is expected output shown? Are "when to use" hints provided?
   - **Structure**: Does it flow logically from simple to complex? Are sections clearly separated?
4. **List Issues with Priority** — Categorize each as:
   - **High**: Blocks novice users from succeeding
   - **Medium**: Causes confusion but workaround exists
   - **Low**: Polish and nice-to-have improvements
5. **Suggest Concrete Fixes** — For each issue, provide specific replacement text (not vague advice). Common fixes:
   - Missing intro → add opening paragraph explaining what and why
   - No prerequisites → add requirements section
   - Jargon without explanation → add callout explaining terminology
   - No examples → add Quick Start section
   - Flat structure → organize into logical sections
   - No cross-references → add "Next Steps" or "See Also" links
6. **Present Review Summary** — Use this format per document:

```
## [Document Name]
| Aspect        | Rating | Notes |
|---------------|--------|-------|
| Clarity       | X/5    | ...   |
| Completeness  | X/5    | ...   |
| Actionability | X/5    | ...   |
| Structure     | X/5    | ...   |

**Issues:** (prioritized list with line references)
**Suggested Fixes:** (concrete replacement text for each)
```

7. **Apply Approved Changes** — After user approval, rewrite the document with all accepted fixes.
