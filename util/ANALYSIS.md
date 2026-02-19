# arken/packages/evolution/packages/protocol/util ANALYSIS

## 2026-02-19

- Added pagination alias normalization in `getQueryInput`.
- Rationale: package-level `Query` schema already used `take`, while query-input builder used `limit`; this mismatch could drop pagination intent depending on caller path.
- Implementation keeps explicit `limit` authoritative and only maps `take -> limit` when `limit` is absent.
- Added numeric-string coercion (`"7" -> 7`) for `skip`/`limit`/`take` in `getQueryInput` to improve transport compatibility for query-string backed callers.
- Added pagination bounds hardening: `skip`/`limit`/`take` now must be finite, non-negative integers.
- Non-numeric strings, negatives, and overflow-to-infinity values are rejected by schema validation.
- `createPrismaWhereSchema` now accepts nested Prisma-style `not` operator objects (e.g. `{ not: { in: [...] } }`) in addition to scalar `not` values.
