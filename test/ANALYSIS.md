# arken/packages/evolution/packages/protocol/test ANALYSIS

## 2026-02-19

- Added `schema.test.ts` to lock pagination alias behavior:
  - `take` alone normalizes to `limit`.
  - explicit `limit` is preserved when both are present.
  - numeric-string pagination inputs (`take`/`skip`) are coerced to numbers.
  - non-numeric strings are rejected.
- Test runner wired through repo-defined `npm test` script using Jest (`ts-jest`).
