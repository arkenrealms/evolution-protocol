# arken/packages/evolution/packages/protocol/util ANALYSIS

## 2026-02-19

- Added pagination alias normalization in `getQueryInput`.
- Rationale: package-level `Query` schema already used `take`, while query-input builder used `limit`; this mismatch could drop pagination intent depending on caller path.
- Implementation keeps explicit `limit` authoritative and only maps `take -> limit` when `limit` is absent.
- Added numeric-string coercion (`"7" -> 7`) for `skip`/`limit`/`take` in `getQueryInput` to improve transport compatibility for query-string backed callers.
- Added pagination bounds hardening: `skip`/`limit`/`take` now must be finite, non-negative integers.
- Non-numeric strings, negatives, and overflow-to-infinity values are rejected by schema validation.
- `createPrismaWhereSchema` now accepts nested Prisma-style `not` operator objects (e.g. `{ not: { in: [...] } }`) in addition to scalar `not` values.
- `createPrismaWhereSchema` and `QueryWhereSchema` now accept top-level `NOT` as either a single filter object or an array of filter objects for Prisma compatibility.

## 2026-02-19 follow-up (logical operator shape alignment)

- Fixed a behavior gap in recursive where parsing: `createPrismaWhereSchema` now accepts top-level `AND` / `OR` as either a single object or an array (matching existing `NOT` flexibility and Prisma enumerable patterns).
- Aligned `QueryWhereSchema` to the same logical-operand shape (`object | object[]`) for `AND` / `OR` / `NOT`.
- This prevents clients that submit singular logical operands from being rejected on one code path while accepted on another.

## 2026-02-19 follow-up (Query pagination parser parity)

- Hardened exported `Query` pagination parsing to match `getQueryInput` behavior:
  - accepts numeric-string pagination values via preprocess coercion,
  - enforces finite, non-negative integer constraints for `skip` and `take`.
- Added tests to prevent regressions on negative and infinite pagination inputs for the exported schema path.
