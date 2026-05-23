import { Link, Outlet } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function RootLayout() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center" aria-label="bychat home">
            {/* Brand wordmark — served from public/logo.svg. Swap the file (keep
                the path) to rebrand; the favicon lives at public/favicon.svg. */}
            <img src="/logo.svg" alt="bychat" className="h-7 w-auto" />
          </Link>
          <nav className="flex items-center gap-2">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            {user ? (
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                Sign out
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
            )}
            <ModeToggle />
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
