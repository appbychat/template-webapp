// Reports runtime crashes from inside the preview iframe UP to the bychat editor
// (the parent window), so it can show "Preview crashed — want the agent to fix
// it?" without the user having to notice the blank/error screen themselves.
//
// This runs ONLY inside the live preview (an iframe hosted by the bychat editor).
// When the app is opened standalone (no parent, or same-window), postMessage to
// `window.parent` is a harmless no-op, so this is safe to ship in every build.
//
// Two layers catch different failures:
//   - installCrashReporter(): global window 'error' + 'unhandledrejection'
//     handlers — catch async errors, event-handler throws, and module-load
//     failures that React's render-time error boundary never sees.
//   - reportCrash(): called explicitly from the router ErrorBoundary for
//     render-time errors (React swallows these before they reach window.onerror).
//
// Wire format (parent listens for this exact shape):
//   { source: "bychat-preview", type: "crash", kind, message, stack, at }

const SOURCE = "bychat-preview";

export type CrashKind = "error" | "unhandledrejection" | "render";

// Don't spam the parent: a broken app can fire the same error on every render or
// every animation frame. De-dupe by message+kind and cap total reports.
const seen = new Set<string>();
let sent = 0;
const MAX_REPORTS = 5;

function post(kind: CrashKind, message: string, stack?: string): void {
  // No parent (opened standalone) → nothing to report to.
  if (typeof window === "undefined" || window.parent === window) return;
  const key = `${kind}:${message}`;
  if (seen.has(key) || sent >= MAX_REPORTS) return;
  seen.add(key);
  sent += 1;
  try {
    window.parent.postMessage(
      {
        source: SOURCE,
        type: "crash",
        kind,
        message: String(message).slice(0, 2000),
        stack: stack ? String(stack).slice(0, 4000) : undefined,
        at: new Date().toISOString(),
        // The route the crash happened on — useful context for the agent.
        path: typeof location !== "undefined" ? location.pathname : undefined,
      },
      "*"
    );
  } catch {
    // postMessage can throw if the structured-clone fails; never let the
    // reporter itself crash the app.
  }
}

/** Report a render-time error caught by the router ErrorBoundary. */
export function reportCrash(error: unknown): void {
  const message =
    error instanceof Error ? error.message : typeof error === "string" ? error : "Unknown render error";
  const stack = error instanceof Error ? error.stack : undefined;
  post("render", message, stack);
}

/** Install global handlers. Call once, as early as possible (in main.tsx). */
export function installCrashReporter(): void {
  if (typeof window === "undefined") return;
  window.addEventListener("error", (e) => {
    // Ignore benign resource-load errors (e.g. a missing <img>) — those aren't
    // app crashes and would create noise. A real script error has e.error set.
    if (e.error instanceof Error || e.message) {
      post("error", e.error?.message ?? e.message, e.error?.stack);
    }
  });
  window.addEventListener("unhandledrejection", (e) => {
    const reason = e.reason;
    const message =
      reason instanceof Error ? reason.message : typeof reason === "string" ? reason : "Unhandled promise rejection";
    post("unhandledrejection", message, reason instanceof Error ? reason.stack : undefined);
  });

  // Tell the parent the preview booted OK. The editor uses this as the "app is
  // alive" signal — if it never arrives within a few seconds AND a crash did,
  // it knows the preview is down rather than just slow.
  if (window.parent !== window) {
    try {
      window.parent.postMessage({ source: SOURCE, type: "ready", at: new Date().toISOString() }, "*");
    } catch {
      // ignore
    }
  }
}
