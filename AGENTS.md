<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Verification policy
- For small, purely visual changes (colors, spacing, text, single-component
  edits), do NOT run Playwright, the test suite, or build checks unless
  I explicitly ask. Just make the edit.
- Only run tests/Playwright when the change affects logic, data fetching,
  or routing — or when I explicitly say "verify this" / "test this."