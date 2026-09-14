---
name: test-bg0-web
description: Launch, test, reproduce, or verify BG0's TanStack Start web app and its anonymous local background-removal flow in an isolated browser.
---

# Test the BG0 web app

Use this workflow for changes under `apps/web` and `packages/browser`. Run from
the repository root. The web app has no database or authentication dependency.

## Safety and ownership

Browser control requires explicit authorization in the current request. When it
is absent, run static checks and report the exact browser interactions left
unverified. Prefer the environment's native collaborative preview: check status,
open it when needed, navigate to the owned port, and use semantic snapshot
locators. Use a named isolated `agent-browser` session only when that preview is
explicitly unavailable; never attach to a personal profile.

Choose an unused loopback port and record the server session returned by the
terminal tool. Keep the server while iterating. Stop only that recorded session.
The app and browser use no durable test state; keep evidence under
`.artifacts/browser/`, which is ignored by Git.

## Cold launch

1. Confirm the checkout and dependencies:

   ```bash
   test "$(pwd -P)" = "/home/leo/projects/bg0.dev"
   test -f package.json
   test -f apps/web/package.json
   bun install --frozen-lockfile
   ```

2. Pick a port. `4173` is the default test port, but it is not owned until the
   read-only check below shows no listener:

   ```bash
   BG0_TEST_PORT="${BG0_TEST_PORT:-4173}"
   ! ss -ltn "sport = :$BG0_TEST_PORT" | tail -n +2 | grep -q .
   ```

3. Start the app from the repository root and retain the returned session ID:

   ```bash
   bun --cwd apps/web dev -- --host 127.0.0.1 --port "$BG0_TEST_PORT" --strictPort
   ```

4. Readiness is HTTP 200 from `http://127.0.0.1:$BG0_TEST_PORT/`. Bound the wait
   to 30 seconds and inspect the owned server output if it fails.

## Doctor

Before reuse, prove the origin belongs to this checkout:

```bash
PID="$(fuser -n tcp "$BG0_TEST_PORT" 2>/dev/null | awk '{print $1}')"
test -n "$PID"
test "$(readlink -f "/proc/$PID/cwd")" = "/home/leo/projects/bg0.dev/apps/web"
curl -fsS "http://127.0.0.1:$BG0_TEST_PORT/" | grep -q '<title>BG0 — Remove backgrounds locally</title>'
```

The title check identifies the BG0 app rather than another server on the port.

## Browser proof

Create the evidence directory and navigate the native preview to the environment
port using `localhost`, which is a WebGPU secure context. Snapshot before each
semantic interaction. If the native preview is unavailable, use this isolated
fallback:

```bash
export AGENT_BROWSER_SESSION="$(agent-browser session id --scope worktree --prefix bg0-web)"
mkdir -p .artifacts/browser
# Headless Chrome on this host needs AGENT_BROWSER_ARGS="--no-sandbox".
agent-browser open "http://localhost:$BG0_TEST_PORT/"
agent-browser wait --load networkidle
```

Use `localhost`, which is a WebGPU secure context. Do not substitute a plain LAN
HTTP address. For WebGPU work, launch with `agent-browser --webgpu`; on Linux use
`--headed` when screenshot evidence must include WebGPU canvas presentation.

The representative flow is: open `/`, upload a PNG or JPG fixture, wait for the
result toolbar (`Download PNG`), switch the Compare/Result/Original view, download
the PNG, and press `Escape` to return to the empty dropzone. Keyboard shortcuts
(`⌘O`, `⌘V`, `Space`, arrows, `⌘S`, `⌘C`, `Escape`) are part of the product and
should be exercised when the remover changes. Capture an accessibility snapshot and screenshot, then verify
browser and server errors:

```bash
agent-browser snapshot -i
agent-browser find role heading text --name "Background removal that stays on your device"
agent-browser upload "input[type=file]" .agents/skills/test-bg0-web/fixtures/person.jpg
# If every CDP call times out after `upload` on this host, the native file chooser
# is blocking the renderer. Inject the fixture instead: base64 the file, build a
# `File` in `agent-browser eval --stdin`, assign it through a `DataTransfer` to
# `input.files`, and dispatch a bubbling `change` event.
agent-browser wait --text "Download PNG"
AGENT_BROWSER_SCREENSHOT_DIR=.artifacts/browser agent-browser screenshot
agent-browser find role tab click --name "Original"
agent-browser find role tab click --name "Compare"
agent-browser find role button click --name "Download PNG"
agent-browser press Escape
agent-browser wait --text "Drop an image anywhere on this page"
agent-browser console
agent-browser errors
```

Use `.agents/skills/test-bg0-web/fixtures/invalid.gif` through the file input to
verify the useful unsupported-image error. The site ships dark only. Test the mobile viewport for layout changes.

The web app has no cloud, pricing, sign-in, dashboard, or server-inference
routes; browser removal is the whole product. `/docs` is a separate Blume app in
`apps/docs`. The web server proxies `/docs` to port 4321. To see the docs
inline, serve a static build there (`bun --cwd apps/docs serve`); the Astro dev
server (`bun --cwd apps/docs dev`) emits root-level `/@fs` module URLs that
collide with the web app's own Vite, so use it standalone for editing docs. In
production a Vercel rewrite in `apps/web/vercel.json` does the same proxying.

## Responsive and theme checks

For layout changes, test at `1440x1000` and `390x844`. Capture screenshots at both widths. Re-snapshot after each state
change and verify the visible outcome, rather than trusting the click alone.

## Checks

During iteration, run the affected package check. Before completion run:

```bash
bun run lint
bun typecheck
bun test
bun run build
```

Inspect the browser console, browser page errors, and owned server output after
the completed interaction. A screenshot of the initial page does not prove an
upload, inference, or downloaded PNG.

## Cleanup

Capture final evidence before cleanup. Close only the named browser session with
`agent-browser close`. Stop only the recorded dev-server session by sending
Ctrl-C to that session. Preserve `.artifacts/browser/` for review and remove only
temporary fixtures created by this workflow.
