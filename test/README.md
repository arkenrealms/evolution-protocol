# arken/packages/evolution/packages/protocol/test

Jest + TypeScript unit tests for protocol package behavior.

Current coverage includes:
- `util/schema.ts` query pagination alias behavior (`take` and `limit`).
- Pagination coercion behavior for numeric strings and rejection of non-numeric strings.
- Pagination bounds validation (reject negative and infinite/overflow values).
- Prisma-compatible `where.<field>.not` handling for both scalar and nested-operator object forms.
- Top-level `where.NOT` compatibility for both single-object and array forms.

## 2026-02-19 maintenance update

Added regression coverage for:
- Single-object logical operands on top-level `where.AND` and `where.OR` (both `getQueryInput` and exported `Query`).
- `orderBy` direction normalization (`trim` + lowercase) for both query schema entry points.
- Invalid `orderBy` direction rejection parity across both schema paths.
