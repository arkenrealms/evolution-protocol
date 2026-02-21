# arken/packages/evolution/packages/protocol/test ANALYSIS

## 2026-02-19

- Added `schema.test.ts` to lock pagination alias behavior:
  - `take` alone normalizes to `limit`.
  - explicit `limit` is preserved when both are present.
  - numeric-string pagination inputs (`take`/`skip`) are coerced to numbers.
  - non-numeric strings are rejected.
  - negative values are rejected.
  - infinite/overflow values are rejected.
- Added coverage for Prisma-style `where.<field>.not` filters:
  - scalar `not` values remain valid.
  - nested operator-object `not` values (e.g. `{ not: { in: [...] } }`) are accepted.
- Added explicit enum coverage for Prisma string-filter `mode`:
  - accepts supported values (`insensitive`, `default`).
  - rejects unsupported values (e.g. `loose`) to prevent ambiguous matching behavior.
- Added normalization coverage for top-level logical operators:
  - accepts `where.AND` as a single object and normalizes to array form.
  - accepts `where.OR` as a single object and normalizes to array form.
- Added parity tests for the exported `Query` schema so object-form `AND`/`OR` behavior matches `getQueryInput` behavior.
- Added `orderBy` envelope coverage to ensure empty sort maps are rejected and non-empty sort maps continue to pass.
- Expanded `orderBy` coverage to reject blank/whitespace-only field names so malformed sort maps fail fast with an explicit validation error.
- Test runner wired through repo-defined `npm test` script using Jest (`ts-jest`).

## 2026-02-20

- Added exported `Query` regression coverage for numeric-string pagination coercion (`skip`/`take`) and `orderBy` guard behavior.
- New tests verify parity expectations shared with `getQueryInput`:
  - rejects empty `orderBy` envelopes,
  - rejects blank/whitespace `orderBy` keys,
  - accepts numeric-string pagination by coercing to validated integers,
  - accepts `limit` alias and normalizes it to `take` when `take` is absent (while preserving explicit `take` precedence).
- Added parity regressions for `include`/`select` maps across both `Query` and `getQueryInput` (empty maps and blank field names now rejected consistently).
- Added regressions asserting `include`/`select` maps with only `false` values are rejected in both parser paths.
- Added regressions asserting `where.AND`/`where.OR` reject empty arrays in both parser paths (`Query.parse` and `getQueryInput(...).parse`).
- Added regressions asserting mixed projection envelopes (`include` + `select`) are rejected in both parser paths with the same explicit error message.
- Rationale: direct `Query.parse(...)` callers previously had a looser envelope contract than router query inputs, so parity tests now lock the stricter shared behavior and prevent silent no-op projection envelopes, mixed projection ambiguity, and empty logical-clause envelopes.
- Added parity regressions asserting array-form `where.NOT` rejects empty arrays in both parser paths (`Query.parse` and `getQueryInput(...).parse`).
- Rationale: empty `NOT` arrays are semantic no-ops and often indicate upstream filter-construction defects; explicit validation failure preserves fail-fast behavior.
- Added regression coverage that exported `Query` accepts scalar where-filter shorthand (`where: { status: 'Active' }`) and normalizes to `{ equals: ... }`.
- Rationale: `getQueryInput` already supported scalar shorthand via `createPrismaWhereSchema`; this test locks direct-schema parity and prevents reintroducing caller-path shape drift.
- Added parity regressions asserting empty field-level where operator objects are rejected in both parser paths (`Query.parse` and `getQueryInput(...).parse`).
- Rationale: `where: { status: {} }` is a no-op envelope that can hide caller query-builder errors; explicit failure keeps filter intent strict and debuggable.
- Added cursor-envelope parity regressions asserting both parser paths reject empty cursor maps and blank/whitespace cursor field names.
- Rationale: malformed cursor objects are usually pagination-caller shape bugs; fail-fast tests prevent silent no-op cursor envelopes from reappearing.
- Added key-whitespace regressions for both parser paths to reject leading/trailing whitespace in `orderBy`, `cursor`, `include`, and `select` field names.
- Rationale: padded keys are malformed envelopes that can otherwise pass validation and create brittle downstream map lookups; tests lock strict, deterministic key-shape behavior.
- Added cursor-value regressions for both parser paths to reject cursor envelopes that contain only nullish values (`undefined`/`null`).
- Rationale: nullish-only cursor maps are pagination no-ops that can hide caller cursor-construction defects; fail-fast tests keep cursor intent explicit.
- Added cursor-value regressions for both parser paths to reject blank-string-only cursor values (`''`, `'   '`).
- Rationale: blank-string cursor payloads are another no-op pagination shape; parity tests ensure both parser entry points fail fast with the same message.
