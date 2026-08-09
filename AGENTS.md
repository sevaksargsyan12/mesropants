<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Verification policy
- For small, purely visual changes (colors, spacing, text, single-component
  edits), do NOT run Playwright, the test suite, or build checks unless
  I explicitly ask. Just make the edit.
- Only run tests/Playwright when the change affects logic, data fetching,
  or routing — or when I explicitly say "verify this" / "test this."