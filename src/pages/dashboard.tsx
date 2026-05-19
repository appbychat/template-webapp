import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <section className="container py-12 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Signed in as {user?.email ?? "unknown"}.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Card one</CardTitle>
            <CardDescription>Replace with your data.</CardDescription>
          </CardHeader>
          <CardContent>—</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Card two</CardTitle>
            <CardDescription>Replace with your data.</CardDescription>
          </CardHeader>
          <CardContent>—</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Card three</CardTitle>
            <CardDescription>Replace with your data.</CardDescription>
          </CardHeader>
          <CardContent>—</CardContent>
        </Card>
      </div>
    </section>
  );
}
