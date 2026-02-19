# arken/packages/evolution/packages/protocol/test

Jest + TypeScript unit tests for protocol package behavior.

Current coverage includes:
- `util/schema.ts` query pagination alias behavior (`take` and `limit`).
- Pagination coercion behavior for numeric strings and rejection of non-numeric strings.
- Pagination bounds validation (reject negative and infinite/overflow values).
- Prisma-compatible `where.<field>.not` handling for both scalar and nested-operator object forms.
- Top-level `where.NOT` compatibility for both single-object and array forms.
- Regression coverage now includes single-object logical operands for top-level `where.AND` / `where.OR` in both `getQueryInput` and exported `Query` parsing.
- Exported `Query` pagination parsing now has coverage for numeric-string coercion and rejection of negative/infinite values.
- Both `getQueryInput` and exported `Query` now include regression coverage for `orderBy` direction normalization (`trim/lowercase`) and invalid direction rejection.
