# Code review report — PR #1

Evidence for `SPEC.md` §13, item 1 (the `code-review` plugin).

| Field | Value |
|---|---|
| Plugin | `code-review@claude-plugins-official`, user scope, enabled |
| Command run | `/code-review:code-review 1` |
| Pull request | #1 (private project repository, not publicly accessible), "M7: submission evidence, workflow exports and demo", `m7-submission-evidence` → `main`, private repository |
| Reviewed head commit | `ee666997e4ee1d3dc90eb8d7074dd09767933e2b` |
| Date | 2026-10-03 (UTC) |
| Result posted | PR comment on the private PR (not publicly accessible; its full text is quoted here): "No issues found. Checked for bugs and CLAUDE.md compliance." |

## How the plugin ran

1. **Eligibility check (Haiku agent):** the PR was open, not a draft, not trivial
   (25 files) and had no earlier review. Eligible.
2. **`CLAUDE.md` discovery (Haiku agent):** only the root `CLAUDE.md` applies.
3. **PR summary (Haiku agent).**
4. **Five parallel Sonnet reviewers:**

   | # | Focus | Result |
   |---|---|---|
   | 1 | `CLAUDE.md` compliance | No issues |
   | 2 | Shallow bug scan (JSON validity, connections, links) | No issues |
   | 3 | Git history and blame | 2 candidate issues |
   | 4 | Comments on earlier PRs | None exist; this is the first PR |
   | 5 | Guidance in code and file comments | No issues |

5. **Confidence scoring (one Haiku agent per candidate)**, using the plugin's
   0–100 rubric:
   - **Score 75:** stale status text. `docs/PROJECT_STATE.md` said the M7 exports
     and screenshots were "not committed", although commit `ee66699` committed
     them. This is a real documentation issue. It was fixed in the follow-up
     commit that adds this report.
   - **Score 0:** a false positive. The phrase "review fields empty" for the
     document 21 detail screenshot describes the empty input boxes for a new
     review. The detail screen does not display the stored Review Note, so
     nothing conflicts with the Sheet repair record.
6. **Threshold 80:** both candidates were filtered out.
7. **Final eligibility check (Haiku agent):** it reported `NOT_ELIGIBLE`, which
   contradicted its own evidence. It found state `OPEN`, `isDraft: false`, no
   comments or reviews, and the unchanged head `ee666997…`, and said it could
   not judge "trivially simple" from that data alone, which step 1 had already
   settled. The run continued on that basis and posted the result.
8. **Comment posted with `gh`.** It appears under the account `avinoamgo-ux`,
   because the GitHub CLI acts as the logged-in user.

## Follow-up: a pre-commit verification gap and its fix

**The gap**
- Before PR #1 was created, `npm run check` passed while the new
  `n8n/exports/` files were still untracked. `verify:privacy` scans tracked
  files only, so that PASS did not cover them.
- Once commit `ee66699` tracked them, `verify:privacy` failed:
  `account_specific_url`, 3 hits in `n8n/exports/workflow-a.json`. These are the
  three approved dynamic Drive file-link templates.
- The PR body's statement that all checks passed was therefore inaccurate for
  the committed state. The plugin run did not catch this, because build
  signals are out of its scope.

**The fix (approved by Avinoam, fail-closed)**
- `scripts/verify-privacy.mjs` now covers a Google-host hit only when every
  one of these holds:
  - it is in `n8n/exports/workflow-a.json`;
  - it is at one of three exact JSON paths (`nodes[3]…["File Link"]`,
    `nodes[10]…responseBody`, `nodes[11]…responseBody`);
  - the value is an n8n expression;
  - it holds exactly one host, in exactly the form
    `'…/file/d/' + $('Upload file').<item|first()>.json.id + '/view'`;
  - no other ID-like token of 25 or more characters remains in the value;
  - it appears unescaped in the raw file text.
- There is no general Drive allowance and no folder exclusion, and the exports
  are unchanged.

**New tests in `scripts/verifiers.test.mjs`**
- Pass: each approved template.
- Fail:
  - a literal file ID at an approved path;
  - a Google URL at another export path;
  - the same templates in another export file;
  - a template with an extra literal ID in its URL;
  - an intact template with a long literal ID elsewhere in the same value;
  - a second Google host in the same value.

**Results after the fix (2026-10-04)**
- `npx vitest run scripts/verifiers.test.mjs`: 20/20.
- `npm run check` with the exports tracked: exit 0. That covers
  `verify:baseline`, `verify:privacy` (86 tracked files, no findings), lint,
  158/158 unit tests and the build.
- The fix also caught a real slip: a literal Drive link prefix in a
  `PROMPTS.md` note, which was reworded.

## Limits

- This is an automated plugin review, not an independent human approval on
  GitHub.
- The binary files (PNG, MP4) were not reviewed by the agents. They were
  inspected separately for privacy before the commit.
- The plugin was not rerun after the follow-up documentation commit.
