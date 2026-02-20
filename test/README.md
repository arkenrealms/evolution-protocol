# arken/packages/evolution/packages/protocol/test

Jest + TypeScript unit tests for protocol package behavior.

Current coverage includes:
- `util/schema.ts` query pagination alias behavior (`take` and `limit`).
- Pagination coercion behavior for numeric strings and rejection of non-numeric strings.
- Pagination bounds validation (reject negative and infinite/overflow values).
- Prisma-compatible `where.<field>.not` handling for both scalar and nested-operator object forms.
- Top-level `where.NOT` compatibility for both single-object and array forms.
- Top-level `where.AND`/`where.OR` single-object normalization to array form.
- Exported `Query` schema logical-operator normalization parity (`AND`/`OR` object -> array).
- Exported `Query` pagination coercion/validation parity (`skip`/`take` numeric-string coercion; non-negative finite integer constraints).
- Query string-filter mode validation (`default`/`insensitive` accepted; invalid modes rejected).
- `orderBy` validation behavior (empty object rejected; non-empty object accepted; blank/whitespace field names rejected) across both `Query` and `getQueryInput`.
