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
  - accepts numeric-string pagination by coercing to validated integers.
- Rationale: direct `Query.parse(...)` callers previously had a looser envelope contract than router query inputs, so parity tests now lock the stricter shared behavior.
