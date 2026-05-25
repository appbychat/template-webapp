// Router error element — shown when a route throws while rendering (instead of
// React Router's raw "Unexpected Application Error" stack-trace screen).
//
// Wired as `errorElement` on the root route in src/router.tsx, so ANY runtime
// error in a page renders this friendly fallback. Keep it dependency-light (it
// must render even when the app is broken) and on-brand. The "Reload" button
// re-mounts the app, which clears transient errors (e.g. a stale module after a
// hot update).
import { useRouteError } from "react-router-dom";
import { useEffect } from "react";
import { reportCrash } from "@/lib/crash-reporter";

export function ErrorBoundary() {
  const error = useRouteError();
  // Report render-time crashes up to the bychat editor so it can offer the
  // agent a fix. React swallows these before window.onerror sees them, so the
  // ErrorBoundary is the only place to catch them.
  useEffect(() => {
    reportCrash(error);
  }, [error]);
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Something went wrong while rendering this page.";

  return (
    <div className="min-h-screen grid place-items-center bg-background px-6 text-center">
      <div className="max-w-md space-y-4">
        <div className="text-4xl">😵‍💫</div>
        <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">
          The page hit an unexpected error. Try reloading — if it keeps happening,
          describe what you were doing in the chat and the assistant can fix it.
        </p>
        <pre className="max-h-32 overflow-auto rounded-md border bg-muted/50 p-3 text-left text-xs text-muted-foreground">
          {message}
        </pre>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Reload
        </button>
      </div>
    </div>
  );
}
