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
- Test runner wired through repo-defined `npm test` script using Jest (`ts-jest`).

## 2026-02-19 follow-up

- Expanded `schema.test.ts` to verify logical operator shape parity:
  - `where.AND` and `where.OR` accept single-object forms via both `getQueryInput` and exported `Query`.
- Added order-direction parity tests:
  - `' DESC '` normalizes to `'desc'` in both schema paths.
  - Invalid values such as `'descending'` are rejected in both schema paths.
