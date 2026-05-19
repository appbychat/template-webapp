import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HomePage() {
  return (
    <section className="container py-24 flex flex-col items-center text-center gap-6">
      <h1 className="text-5xl font-bold tracking-tight">Ship faster.</h1>
      <p className="text-muted-foreground max-w-xl">
        Webapp template — Vite + React + TypeScript + shadcn/ui + React Router +
        Supabase auth + TanStack Query. Start building.
      </p>
      <div className="flex gap-3">
        <Link to="/dashboard">
          <Button>Open dashboard</Button>
        </Link>
        <a
          href="https://ui.shadcn.com"
          target="_blank"
          rel="noreferrer"
        >
          <Button variant="outline">shadcn docs</Button>
        </a>
      </div>
    </section>
  );
}
