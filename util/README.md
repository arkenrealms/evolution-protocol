# arken/packages/evolution/packages/protocol/util

Shared schema helpers for protocol routers.

- `getQueryInput` now accepts both `limit` and `take` pagination inputs.
- When only `take` is provided, it is normalized to `limit` for backward-compatible query handling.
- Pagination fields (`skip`, `limit`, `take`) accept numeric strings and coerce them to numbers.
- Pagination values are constrained to finite, non-negative integers to avoid invalid/overflow query envelopes.
