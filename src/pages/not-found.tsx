import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <section className="container py-24 text-center space-y-4">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="text-muted-foreground">Page not found.</p>
      <Link to="/">
        <Button>Go home</Button>
      </Link>
    </section>
  );
}
