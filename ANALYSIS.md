# arken/packages/evolution/packages/protocol ANALYSIS

## 2026-02-18 maintenance pass

- Loaded repo markdown first (`README.md`) and then analyzed source structure (`bridge/`, `realm/`, `shard/`, `util/`).
- Deepest-first review focused on `util/schema.ts` query envelope and router-level usage patterns.
- Found pagination naming inconsistency risk (`take` appears in shared query type conventions elsewhere, while this package currently uses `limit` in `getQueryInput`).
- Attempted to introduce Jest+TS test harness for a safe compatibility fix, but test execution is currently blocked in this checkout runtime.

## Blockers

- `rushx test` fails due workspace dependency gap outside this repo (`@arken/cerebro-hub` package path missing in local checkout).
- `npm test` cannot run because local runtime lacks `jest` binary in this package context (`sh: jest: command not found`).

Under the source-change test gate, source edits were not retained this run.

## 2026-02-18 late maintenance pass (slot 10)

- Re-read local markdown first (`README.md`, this `ANALYSIS.md`) before source verification.
- Re-verified direct-repo branch hygiene: `git fetch origin` + `git merge --no-edit origin/main` completed cleanly.
- Deepest-first re-check focused on leaf `util/schema.ts` and router call surfaces in `realm/realm.router.ts` and `shard/shard.router.ts`.
- Confirmed the package currently has **no `test` script** in `package.json`, so unit tests are not runnable via repo-defined script in this checkout.

## Blockers (current)

- `rushx test` fails at workspace load due to missing checkout path for `@arken/cerebro-hub` (`/arken/cerebro/hub/package.json`).
- `npm test` fails because `package.json` has no `test` script in this package.
- Under the source-change test gate, source edits remain disallowed until a runnable test command exists.

## Next actionable fix (once runtime/workspace blockers are resolved)

1. Add/enable a Jest+TS `test` script in this package (prefer repo-standard command path).
2. Add targeted tests for query-envelope compatibility (`take` + `limit`) in `util/schema.ts`.
3. Apply minimal source patch only after tests are runnable and passing (no extra tRPC wrapper abstraction).

## 2026-02-18 late-night slot-10 follow-up
- Re-ran branch hygiene (`git fetch origin` + merge `origin/main`) and verified leaf-first files (`util/schema.ts`, then `realm/*.router.ts` and `shard/*.router.ts`).
- Revalidated test gate blockers:
  - `rushx test` ❌ Rush workspace path drift (`@arken/cerebro-hub` expected at `arken/cerebro/hub/package.json`)
  - `npm test` ❌ missing script (`Missing script: "test"`)
- No source edits were made pending runnable package-local tests.

## 2026-02-19 slot-10 maintenance pass

- Completed branch hygiene in direct repo (`git fetch origin` + merge `origin/main`) before edits.
- Added package-local Jest+TS harness (`npm test` script + `jest.config.js`) to satisfy source-change test gate.
- Implemented pagination compatibility fix in `util/schema.ts`: `getQueryInput` now accepts `take` and normalizes `take -> limit` when `limit` is absent.
- Added regression tests in `test/schema.test.ts` for alias behavior and explicit `limit` precedence.
- Verified tests: `npm test` ✅ (2/2).

## 2026-02-19 slot-10 follow-up hardening

- Tightened pagination validation in `util/schema.ts`: pagination fields now require finite, non-negative integers.
- Added regression tests for negative and infinite/overflow pagination inputs.
- Verified tests: `npm test` ✅ (6/6).

## 2026-02-19 late slot-9 hardening pass

- Added an explicit guard in `getQueryInput` to reject empty `orderBy` maps.
- Rationale: `{ orderBy: {} }` previously validated but represents an ambiguous no-op sort envelope and can mask caller bugs.
- Added regression tests to verify empty `orderBy` rejection and non-empty acceptance.
- Verified tests: `rushx test` ✅ (15/15).

## 2026-02-20 slot-9 parity hardening pass

- Aligned exported `Query` schema logical operator behavior with `getQueryInput` by normalizing object-form `where.AND`/`where.OR` to array form.
- Rationale: `getQueryInput` already normalized these shapes via `createPrismaWhereSchema`, but direct callers of `Query.parse(...)` still required arrays; this inconsistency caused avoidable client-shape mismatches.
- Added focused tests in `test/schema.test.ts` to verify `Query`-level normalization for both `AND` and `OR`.

## 2026-02-20 slot-9 validation-parity hardening pass

- Re-ran branch hygiene (`git fetch origin` + merge `origin/main`) before edits and kept work on the active direct-repo branch with open PR.
- Hardened exported `Query` envelope validation to match `getQueryInput` expectations:
  - `skip`/`take` now coerce numeric-string inputs and enforce finite, non-negative integers.
  - `orderBy` now rejects empty maps and blank/whitespace field names.
- Rationale: `getQueryInput` already enforced these constraints, but direct `Query.parse(...)` callers could still pass malformed envelopes; this created avoidable behavior drift between two public entry paths.
- Added focused tests in `test/schema.test.ts` to lock `Query` pagination coercion and `orderBy` guard behavior.
- Verified with `rushx test` (Node `20.11.1`) ✅ (1 suite, 21 tests).

## 2026-02-20 slot-9 pagination-alias parity follow-up

- Extended exported `Query` to accept `limit` as a legacy pagination alias and normalize it to `take` when `take` is absent.
- Preserved explicit `take` precedence when both `limit` and `take` are provided.
- Rationale: router query envelopes already support `limit` aliasing via `getQueryInput`, but direct `Query.parse(...)` callers could still drop pagination intent when sending `limit` only.
- Added focused regressions in `test/schema.test.ts` for `limit -> take` mapping and precedence behavior.

## 2026-02-20 slot-9 projection-map validation parity follow-up

- Hardened `util/schema.ts` by introducing shared `include`/`select` map guards used by both exported `Query` and `getQueryInput`.
- Validation now rejects:
  - empty projection maps (`{}`),
  - blank or whitespace-only projection keys.
- Added regression tests in `test/schema.test.ts` for both parser paths (`Query.parse` and `getQueryInput(...).parse`).
- Rationale: projection envelopes with empty/blank keys are caller-shape bugs that previously passed silently and could produce no-op or confusing query behavior; fail-fast parity reduces debugging time and keeps direct schema callers aligned with router input semantics.

## 2026-02-20 slot-9 projection truthiness follow-up

- Extended shared projection-map guards so `include`/`select` now require at least one `true` value (all-false maps are rejected).
- Applied consistently to both exported `Query` and `getQueryInput` in `util/schema.ts`.
- Added regressions in `test/schema.test.ts` for both parser paths to lock this behavior.
- Rationale: all-false projection maps are effectively no-op envelopes and usually indicate inverted caller logic; rejecting them early avoids silent data-shape surprises.

## 2026-02-20 slot-9 logical-array non-empty enforcement

- Hardened logical filter validation by requiring non-empty `where.AND`/`where.OR` arrays in both exported `Query` and recursive `createPrismaWhereSchema` handling.
- Added parity regressions in `test/schema.test.ts` to verify empty logical arrays are rejected for both direct `Query.parse(...)` and `getQueryInput(...).parse` paths.
- Rationale: empty logical arrays are no-op filters that often mask upstream query-builder bugs; failing fast avoids silently degraded filtering semantics.

## 2026-02-20 slot-9 projection-mode exclusivity guard

- Added shared projection-mode guard in `util/schema.ts` so envelopes that provide both `include` and `select` now fail validation for both direct `Query.parse(...)` and `getQueryInput(...).parse` paths.
- Added focused regressions in `test/schema.test.ts` for both parser paths to lock the guard behavior and message.
- Rationale: mixed projection modes are ambiguous and previously passed through both schemas; explicit rejection prevents precedence ambiguity and keeps request shape intent clear.

## 2026-02-20 slot-9 scalar where-shorthand parity follow-up

- Updated exported `Query` filtering behavior so scalar field filters (for example `where: { status: 'Active' }`) are normalized to `{ equals: ... }`.
- Added a direct `Query.parse(...)` regression in `test/schema.test.ts` to lock this normalization behavior.
- Rationale: `getQueryInput` already supported scalar shorthand through `createPrismaWhereSchema`; aligning direct `Query` parsing closes a remaining query-shape mismatch and improves protocol caller compatibility.

## 2026-02-20 slot-9 NOT-array guard follow-up

- Re-ran branch hygiene (`git fetch origin` + merge `origin/main`) before edits on the active direct-repo maintenance branch.
- Tightened logical filter validation parity in `util/schema.ts` by enforcing non-empty arrays for `where.NOT` (array form) in both `Query` and `getQueryInput` recursive schemas.
- Added focused regression updates in `test/schema.test.ts` to verify empty `NOT` arrays now fail in both parser paths.
- Rationale: this closes a no-op logical-envelope gap that still existed for `NOT` after prior `AND`/`OR` hardening.

## 2026-02-20 slot-9 empty field-filter guard follow-up

- Added shared fail-fast validation for field-level filter operator objects so empty objects are rejected in both parser paths (`Query` and `getQueryInput` via `createPrismaWhereSchema`).
- Added focused regressions in `test/schema.test.ts` for `where: { status: {} }` on both parser entry points.
- Rationale: empty operator objects are silent no-op filters that usually indicate broken caller query-builder output; rejecting them early improves reliability and debugging clarity.

## 2026-02-21 slot-9 cursor-envelope validation parity

- Re-ran direct-repo branch hygiene (`git fetch origin` + merge `origin/main`) before edits and continued on the active maintenance branch.
- Hardened query envelope validation in `util/schema.ts` by adding shared cursor-map guards used by both `Query` and `getQueryInput`.
  - `cursor` now rejects empty maps.
  - `cursor` now rejects blank/whitespace field names.
- Added parity regressions in `test/schema.test.ts` for both parser paths.
- Rationale: malformed cursor envelopes are pagination no-ops that can hide caller bugs; strict parity keeps direct schema and router input behavior aligned.

## 2026-02-21 slot-9 key-whitespace map guard parity

- Tightened map-key validation in `util/schema.ts` so `orderBy`, `cursor`, `include`, and `select` reject leading/trailing whitespace in field names (in addition to empty keys).
- Added regression coverage in `test/schema.test.ts` for both parser entry points (`Query.parse` and `getQueryInput(...).parse`).
- Rationale: padded field names are malformed map envelopes that can parse but fail at downstream lookups; fail-fast parser parity improves protocol reliability.
