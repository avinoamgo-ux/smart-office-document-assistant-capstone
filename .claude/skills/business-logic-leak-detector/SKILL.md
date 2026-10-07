---
name: business-logic-leak-detector
description: Use when work in this repository changes an app route, server client, UI component or data mapping; connects a mock or local path to live transport; adds an AI, Google, Gmail, Drive, Sheets or n8n integration; changes extraction, classification, urgency, department, notification or file-movement behavior; or is about to be staged or committed for M6 or submission.
---

# Business-Logic Leak Detector

## Overview

The instructor's defining rule for Part 2: the application must not
re-implement any business logic. It collects input, calls the n8n workflow and
presents what the workflow returns. AI extraction logic, urgency rules or direct
Google API calls inside the application cost up to 20 points, whatever else is
delivered.

**Core rule:** every business decision is made in n8n. A rule passes only when
the evidence shows where the decision is made. Missing evidence is `UNKNOWN`,
never `PASS`.

## When to Use

- After changing a route in `src/app/api/**`, a server client, a UI component
  under `src/components/**` or `src/app/**`, or a data-mapping module.
- When a mock or local path is connected to live transport.
- When any AI, Google, Gmail, Drive, Sheets or n8n integration is added.
- When behavior around extraction, classification, urgency, department,
  notification or file movement changes.
- Before staging or committing M6 work, and before final submission.

## The Boundary

| Owner | Responsibilities |
|---|---|
| **n8n** | Document text extraction, AI field extraction and classification (`document_type`, `urgency`, `department`), routing, Gmail notifications, Drive storage and file movement, every Google Sheets read and write |
| **Next.js app** | Presentation, input validation, same-origin proxying to `/api/**`, sanitized error mapping, local search, sort and filter display logic, user interaction |

Sources: instructor Part 2 doc §1 and §3.1; root `CONTRACT.md` §8; root
`SPEC.md` §3 and §15.

## Workflow

1. **List the changed files.** Use `git status` and `git diff --name-only`
   against the last checkpoint. Include untracked files.
2. **Read each changed file and its imports.** Follow imports one level into
   `src/lib/**`. Note whether each file is a client component (`'use client'`)
   or server-only.
3. **Check every forbidden behavior** below, per file.
4. **Check that every permitted behavior** stays within its limits.
5. **Produce the table**, one row per rule and file:

   | RULE | FILE | EVIDENCE | STATUS |
   |---|---|---|---|

   Cite evidence as `file:line`. Mark each row `PASS`, `FAIL`, `UNKNOWN` or
   `NOT APPLICABLE`.
6. **Decide.** Block on any forbidden business logic, any client-side secret or
   direct external integration, or a material `UNKNOWN` about where a business
   decision is made.

## Forbidden in the Application

| Rule | What to look for |
|---|---|
| No browser call to n8n | A `fetch` or URL to an n8n host or `/webhook/` path in client code |
| No Google API call | Drive, Sheets or Gmail SDKs or hosts, browser or server side |
| No AI call | Model, provider or LLM SDK imports; AI API hosts; prompt text |
| No extraction or summarization | Parsing document text, producing a summary or extracting fields |
| No classification | Code deriving `document_type`, `urgency` or `department` from content |
| No notification decision | Code choosing whether or what to email |
| No file movement | Code moving, copying or filing documents in Drive |
| No duplicated workflow rule | Re-deriving a value n8n returns, or substituting a default for it |
| No secret in client code | A client component importing `env.ts` or reading a secret or webhook URL |
| No external URL built in the client | A client component composing a non-same-origin URL |

## Permitted in the Application

| Behavior | Limit |
|---|---|
| Request-shape validation | Checks the contract shape; decides nothing about content |
| File type and size validation | PDF/DOCX/TXT and the 10 MB limit, before sending |
| Same-origin calls | Only to `/api/**` |
| Server-side proxy transport | Server-only modules; secret attached on the server |
| Response contract validation | Rejects a bad shape; never repairs or invents a value |
| Sanitized error mapping | Fixed messages; no upstream detail |
| Display logic | Rendering, search, sorting and user-selected filters over returned rows |
| UI state | Loading state, double-submit guards, superseded-response guards |

Displaying a returned value with a colour or label is permitted. Deciding the
value is not.

## Rules

- Do not edit or repair any file. Report, and wait for Avinoam.
- Do not read `.env.local` or print any secret, URL or identifier.
- Do not mark a rule `PASS` because nothing obvious was found. Cite the file
  read and what it contains.
- A legacy or unused module still counts when it ships in the repository.

## Common Mistakes

| Mistake | Correct handling |
|---|---|
| Treating an urgency badge colour map as classification | Styling a returned value is display; deriving it is a leak |
| Skipping server-only files | Server code calling Google or an AI API is still a leak |
| Missing a default that replaces a missing field | Substituting a value n8n did not return is a duplicated rule |
| Checking the changed file but not its imports | Follow imports into `src/lib/**` |
| Accepting "it is only a mock" | Mocks may hold fixtures, never decision logic |

## Output

End the report with the table, the open questions, then exactly one line:

BUSINESS_LOGIC_LEAK_DETECTOR_PASS

or

BUSINESS_LOGIC_LEAK_DETECTOR_BLOCKED
