# arken/packages/evolution/packages/protocol/test

Jest + TypeScript unit tests for protocol package behavior.

Current coverage includes:
- `util/schema.ts` query pagination alias behavior (`take` and `limit`).
- Pagination coercion behavior for numeric strings and rejection of non-numeric strings.
- Pagination bounds validation (reject negative and infinite/overflow values).
- Prisma-compatible `where.<field>.not` handling for both scalar and nested-operator object forms.
- Top-level `where.NOT` compatibility for both single-object and array forms.
- Top-level `where.AND`/`where.OR` single-object normalization to array form.
- Top-level logical-array guard behavior (`where.AND`/`where.OR` reject empty arrays) across both `Query` and `getQueryInput`.
- Exported `Query` schema logical-operator normalization parity (`AND`/`OR` object -> array).
- Exported `Query` pagination coercion/validation parity (`skip`/`take` numeric-string coercion; non-negative finite integer constraints).
- Exported `Query` pagination alias parity (`limit` accepted and normalized to `take` when `take` is absent; explicit `take` wins when both are supplied).
- Query string-filter mode validation (`default`/`insensitive` accepted; invalid modes rejected).
- `orderBy` validation behavior (empty object rejected; non-empty object accepted; blank/whitespace field names rejected) across both `Query` and `getQueryInput`.
- `include`/`select` validation parity across both `Query` and `getQueryInput` (empty maps rejected; blank field names rejected; all-false maps rejected).
- Projection exclusivity parity (`include` + `select` together is rejected in both parser paths).
