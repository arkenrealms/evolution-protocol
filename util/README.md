# arken/packages/evolution/packages/protocol/util

Shared schema helpers for protocol routers.

- `getQueryInput` now accepts both `limit` and `take` pagination inputs.
- When only `take` is provided, it is normalized to `limit` for backward-compatible query handling.
- Pagination fields (`skip`, `limit`, `take`) accept numeric strings and coerce them to numbers.
- Pagination values are constrained to finite, non-negative integers to avoid invalid/overflow query envelopes.
- Prisma-style `where.<field>.not` now supports both scalar values and nested operator objects (e.g. `{ not: { in: [...] } }`) for compatibility with richer filter expressions.
- Top-level `where.NOT` now accepts either a single filter object or an array of filter objects, matching Prisma-style semantics.
- Top-level `where.AND` / `where.OR` accept either a single filter object or an array, improving Prisma-compatible envelope handling.
