<!-- Thanks for the PR. Keep this short — reviewers scan. -->

## What

<!-- One or two sentences: what does this change do? -->

## Why

<!-- The user-visible or operational reason. Link an issue if relevant. -->

## How to verify

<!-- Commands or steps a reviewer can run locally / in preview to convince themselves this works. -->

## Risk & rollback

- [ ] DB migration included (if yes, tested with `alembic downgrade -1 && alembic upgrade head`)
- [ ] Generated client regenerated (`npm run gen:api`) if OpenAPI changed
- [ ] Feature-flagged (flag name: `...`) — safe to roll back by flipping
- [ ] No secrets committed (gitleaks passes in CI)
