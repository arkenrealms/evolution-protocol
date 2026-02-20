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
- `createPrismaWhereSchema` now also accepts single-object forms for top-level `AND`/`OR` and normalizes them to arrays to reduce client-shape mismatch failures.
- Exported `Query` schema now mirrors the same top-level `AND`/`OR` normalization behavior so direct `Query.parse(...)` callers and `getQueryInput(...)` callers share consistent logical-filter handling.
- Hardened `createPrismaWhereSchema` string filter `mode` validation to the Prisma-compatible enum (`default` | `insensitive`) instead of permissive free-form strings.
- Tightened `getQueryInput` `orderBy` handling: empty objects are now rejected with a clear validation message so callers cannot send ambiguous no-op ordering envelopes.
- Added field-name validation for `orderBy`: blank or whitespace-only keys are now rejected (`orderBy field names must be non-empty`) to avoid malformed sort envelopes that can bypass downstream assumptions.

## 2026-02-20

- Extended exported `Query` pagination handling to match `getQueryInput` by coercing numeric-string `skip`/`take` values and enforcing finite, non-negative integers.
- Added exported `Query` `orderBy` guards for empty map rejection and blank-key rejection.
- Added exported `Query` pagination alias parity by accepting `limit` and normalizing it to `take` when `take` is absent.
- Added shared include/select map guards (non-empty object + non-blank keys) and applied them to both `Query` and `getQueryInput`.
- Rationale: these protections already existed in `getQueryInput`; bringing them to `Query` removes a mismatch where direct `Query.parse(...)` consumers could bypass validation expected by router-backed callers.
- Rationale (limit alias): some callers still send legacy `limit`; normalizing to `take` in `Query.parse(...)` keeps direct-schema consumers aligned with `getQueryInput` and avoids silent pagination drops.
- Rationale (include/select guards): empty or blank-key projection maps are almost always caller-shape mistakes and can silently degrade fetch paths, so validation now fails fast with explicit errors.
- Added truthy-projection guard for `include`/`select` maps (`at least one true field` required).
- Rationale: all-false projection envelopes are effectively no-op/misconfigured and usually indicate inverted caller logic; rejecting them avoids silent data-shape surprises and keeps projection intent explicit.
