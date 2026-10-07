---
name: contract-drift-guard
description: Use when work in this repository touches CONTRACT.md, a request or response schema, an API route under src/app/api, an n8n server client, environment-key names, authentication, a timeout or error mapping, or when an endpoint is switched from mock or local behavior to live transport.
---

# Contract Drift Guard

## Overview

Root `CONTRACT.md` is the agreed boundary between the application and the n8n
workflows. The instructor names mismatches between the contract and the real
response as the most common cause of lost time. This guard compares the
contract, the implementation and the tests, row by row, before any change is
trusted.

**Core rule:** a row passes only when the contract, the code and a test all
agree. Missing evidence is `UNKNOWN`, never `PASS`.

## When to Use

- Before and after editing `CONTRACT.md` or any zod schema that mirrors it.
- Before and after editing a route in `src/app/api/**`.
- Before and after editing a server client (`*-client.ts`) or `n8n-url.ts`.
- When adding, renaming or removing an environment-key name in `src/lib/env.ts`
  or `.env.example`.
- When changing authentication, a timeout, or the mapping of an error.
- Before switching an endpoint from mock or local behavior to live transport,
  one endpoint at a time.

Do not use it for UI styling, copy or layout changes that touch no transport.

## Authority Order

1. Instructor Part 1 and Part 2 requirements (outside the repository).
2. Root `CONTRACT.md`.
3. Root `SPEC.md`.
4. *(Public copy: the private project's `CLAUDE.md` operating instructions
   are not included. `docs/PROJECT_STATE.md` records the decisions they
   governed.)*

Earlier contract drafts and schemas (not included in this public copy) are
superseded history. Never use them as the contract.

## Workflow

1. **Identify the section.** Name the exact `CONTRACT.md` section(s) that govern
   the endpoint or rule, for example §5.1–§5.3 for `POST /review`.
2. **Read three sources.** Read that section, the implementing files (route,
   client, contract module, env reader) and their tests. Read only what is
   needed.
3. **Build the comparison table**, one row per field or rule:

   | FIELD_OR_RULE | CONTRACT | IMPLEMENTATION | TEST | STATUS |
   |---|---|---|---|---|

   Cite each cell as `file:line` or `CONTRACT.md §n`.
4. **Cover every applicable check:**
   - method and path, both the browser route and the n8n webhook;
   - request fields, types, required or optional, limits;
   - success response shape and literal values;
   - allowed error responses, and the `error_code` rules: only documented
     codes, never a manufactured one (`CONTRACT.md` §11);
   - HTTP statuses at the browser boundary;
   - the authentication header (`x-api-key`) and the 401/403 normalization;
   - the timeout value;
   - the secret boundary: server-only env reader, no `NEXT_PUBLIC_` name, no
     secret or webhook URL reaching the browser or the response;
   - echoed identifiers, such as a returned `document_id` that must equal the one
     sent;
   - retry and double-submit behavior, where the contract defines it.
5. **Mark every row** `PASS`, `FAIL`, `UNKNOWN` or `NOT APPLICABLE`.
   - `PASS`: contract, implementation and a test agree, with citations.
   - `FAIL`: the implementation or a test contradicts the contract.
   - `UNKNOWN`: any of the three is missing, unread or unverified.
   - `NOT APPLICABLE`: the contract does not define the rule for this endpoint.
6. **Report what the contract does not say.** List each behavior the contract
   leaves undefined as an open question for Avinoam. Do not fill the gap.
7. **Decide.** Any `FAIL`, or an `UNKNOWN` that affects request shape, response
   shape, status, auth, timeout or the secret boundary, blocks implementation
   until Avinoam approves a decision.

## Rules

- Do not invent contract behavior. If the contract is silent, the row is
  `NOT APPLICABLE` or an open question, never an assumed `PASS`.
- Do not edit any file. This guard reports; changes need separate approval.
- Do not treat "the code compiles" or "the tests pass" as agreement with the
  contract. A test must assert the contracted value itself.
- Do not read `.env.local` or print any environment value, URL or secret.
  Compare env-key **names** only.
- If the contract itself must change, it changes in three places at once:
  `CONTRACT.md`, the n8n workflow and the application. Report that, and stop.

## Common Mistakes

| Mistake | Correct handling |
|---|---|
| Comparing against the superseded IntentSeal schemas | Use root `CONTRACT.md` only |
| Accepting an extra `error_code` as harmless | `FAIL`: §11 forbids manufactured codes |
| Calling a row `PASS` because no test fails | No asserting test means `UNKNOWN` |
| Checking the n8n hop but not the browser hop | Check both; statuses differ at each boundary |
| Treating a 404 as "not found" without checking its body | Check what the contract says the body is |

## Output

End the report with the table, the open questions, then exactly one line:

CONTRACT_DRIFT_GUARD_PASS

or

CONTRACT_DRIFT_GUARD_BLOCKED

Use `PASS` only when every row is `PASS` or `NOT APPLICABLE`, and no blocking
open question remains.
