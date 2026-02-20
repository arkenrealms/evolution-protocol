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

## 2026-02-19 follow-up (AND/OR + orderBy parity completion)

- Closed a remaining shape mismatch: `createPrismaWhereSchema` now accepts top-level `AND` / `OR` as `object | object[]` (same flexibility as `NOT`).
- Aligned exported `QueryWhereSchema` to the same logical operand shape (`AND` / `OR` / `NOT` all accept single object or array).
- Unified direction parsing with shared `SortDirectionSchema` so both `getQueryInput` and exported `Query` normalize `orderBy` values (`' DESC ' -> 'desc'`) while still rejecting invalid directions.
- Reused a shared numeric parser (`NumericQueryValue`) for query pagination primitives to keep exported `Query` behavior aligned with `getQueryInput`.
