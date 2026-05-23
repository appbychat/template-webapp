// "Coming soon" placeholder landing.
//
// WHY THIS EXISTS: a freshly-created project starts from this template before
// the user's app has been generated. Showing a generic dev landing confused
// people ("is this my app?"), so the default home makes it unmistakable that the
// real app is still being built. It animates through a few status messages so it
// reads as alive, not broken.
//
// Claude: REPLACE this whole page with the real product landing once you start
// building the user's app. It's a placeholder, not a component to keep.
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const MESSAGES = [
  "Setting things up…",
  "Wiring up your components…",
  "Designing the interface…",
  "Almost there…",
];

export function HomePage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="container flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-8 py-24 text-center">
      <div className="flex flex-col items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Template preview
        </span>
        <h1 className="bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
          Your app is coming soon
        </h1>
        <p className="max-w-xl text-muted-foreground">
          This is a starter template. Your app is being built — describe what you
          want in the chat and watch it appear here, live.
        </p>
      </div>

      {/* Cycling status line — keyed so each message re-triggers the fade-in. */}
      <div className="flex h-6 items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span key={index} className="animate-in fade-in slide-in-from-bottom-1 duration-500">
          {MESSAGES[index]}
        </span>
      </div>

      {/* Skeleton blocks that shimmer, hinting "components are coming". */}
      <div className="grid w-full max-w-md gap-3" aria-hidden>
        <div className="h-10 animate-pulse rounded-lg bg-muted" />
        <div className="grid grid-cols-3 gap-3">
          <div className="h-24 animate-pulse rounded-lg bg-muted [animation-delay:120ms]" />
          <div className="h-24 animate-pulse rounded-lg bg-muted [animation-delay:240ms]" />
          <div className="h-24 animate-pulse rounded-lg bg-muted [animation-delay:360ms]" />
        </div>
        <div className="h-10 w-2/3 animate-pulse rounded-lg bg-muted" />
      </div>
    </section>
  );
}
