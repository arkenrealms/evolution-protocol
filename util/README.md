# arken/packages/evolution/packages/protocol/util

Shared schema helpers for protocol routers.

- `getQueryInput` now accepts both `limit` and `take` pagination inputs.
- When only `take` is provided, it is normalized to `limit` for backward-compatible query handling.
- Pagination fields (`skip`, `limit`, `take`) accept numeric strings and coerce them to numbers.
- Pagination values are constrained to finite, non-negative integers to avoid invalid/overflow query envelopes.
- Prisma-style `where.<field>.not` now supports both scalar values and nested operator objects (e.g. `{ not: { in: [...] } }`) for compatibility with richer filter expressions.
- Top-level `where.NOT` now accepts either a single filter object or an array of filter objects, matching Prisma-style semantics.
- Top-level `where.AND` and `where.OR` accept either a single object or an array; single objects are normalized to arrays for safer downstream handling (both in `getQueryInput` and the exported `Query` schema).
- Exported `Query` now accepts scalar shorthand field filters (for example `where: { status: "Active" }`) and normalizes them to `{ equals: ... }`, matching `getQueryInput` shorthand behavior.
- Top-level logical arrays (`where.AND`/`where.OR`/`where.NOT` array form) must be non-empty; empty arrays are rejected as invalid no-op filter envelopes.
- Prisma-style string filter `mode` is now restricted to supported values (`default` or `insensitive`) to prevent silently accepting invalid case-sensitivity flags.
- Query envelopes now reject empty `orderBy` objects to avoid ambiguous no-op sort clauses (`{}`), while preserving non-empty map support.
- `orderBy` now also rejects blank or untrimmed field names (leading/trailing whitespace) to prevent malformed sort maps from slipping through validation.
- Exported `Query` now applies the same pagination coercion/validation and `orderBy` guards (`non-empty`, non-blank keys) as `getQueryInput` so direct `Query.parse(...)` callers behave consistently.
- Exported `Query` also accepts `limit` as a pagination alias and normalizes it to `take` when `take` is absent (keeping explicit `take` authoritative when both are provided).
- `include` and `select` maps now reject empty objects plus blank or untrimmed field names in both `Query` and `getQueryInput` to avoid silent no-op projection envelopes.
- `include` and `select` maps now also require at least one `true` field; all-false projection maps are rejected as caller-shape errors.
- Query envelopes now reject sending `include` and `select` together; callers must choose one projection mode per request.
- Field-level `where` operator objects must include at least one operator key (for example `{ equals: ... }`); empty objects like `{ status: {} }` are rejected to avoid silent no-op filters.
- `cursor` maps now reject empty objects, blank/untrimmed field names, and all-nullish value maps in both `Query` and `getQueryInput`, preventing ambiguous/no-op cursor envelopes.
- `cursor` maps also reject blank-string-only values (e.g. `{ id: '' }`), requiring at least one non-empty cursor value to avoid no-op pagination envelopes.
