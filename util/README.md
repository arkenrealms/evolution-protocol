# arken/packages/evolution/packages/protocol/util

Shared schema helpers for protocol routers.

- `getQueryInput` now accepts both `limit` and `take` pagination inputs.
- When only `take` is provided, it is normalized to `limit` for backward-compatible query handling.
- Pagination fields (`skip`, `limit`, `take`) accept numeric strings and coerce them to numbers.
- Pagination values are constrained to finite, non-negative integers to avoid invalid/overflow query envelopes.
- Prisma-style `where.<field>.not` now supports both scalar values and nested operator objects (e.g. `{ not: { in: [...] } }`) for compatibility with richer filter expressions.
- Top-level `where.NOT` now accepts either a single filter object or an array of filter objects, matching Prisma-style semantics.
- Top-level `where.AND` and `where.OR` accept either a single object or an array; single objects are normalized to arrays for safer downstream handling (both in `getQueryInput` and the exported `Query` schema).
- Prisma-style string filter `mode` is now restricted to supported values (`default` or `insensitive`) to prevent silently accepting invalid case-sensitivity flags.
- Query envelopes now reject empty `orderBy` objects to avoid ambiguous no-op sort clauses (`{}`), while preserving non-empty map support.
- `orderBy` now also rejects blank/whitespace field names to prevent malformed sort maps from slipping through validation.
- Exported `Query` now applies the same pagination coercion/validation and `orderBy` guards (`non-empty`, non-blank keys) as `getQueryInput` so direct `Query.parse(...)` callers behave consistently.
- Exported `Query` also accepts `limit` as a pagination alias and normalizes it to `take` when `take` is absent (keeping explicit `take` authoritative when both are provided).
- `include` and `select` maps now reject empty objects and blank field names in both `Query` and `getQueryInput` to avoid silent no-op projection envelopes.
