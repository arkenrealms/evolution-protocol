# arken/packages/evolution/packages/protocol/util ANALYSIS

## 2026-02-19

- Added pagination alias normalization in `getQueryInput`.
- Rationale: package-level `Query` schema already used `take`, while query-input builder used `limit`; this mismatch could drop pagination intent depending on caller path.
- Implementation keeps explicit `limit` authoritative and only maps `take -> limit` when `limit` is absent.
