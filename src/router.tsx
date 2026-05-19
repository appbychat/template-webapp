import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { RootLayout } from "@/components/layout/root-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { HomePage } from "@/pages/home";
import { DashboardPage } from "@/pages/dashboard";
import { LoginPage } from "@/pages/login";
import { SignupPage } from "@/pages/signup";
import { NotFoundPage } from "@/pages/not-found";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      {
        element: (
          <ProtectedRoute>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [{ path: "dashboard", element: <DashboardPage /> }],
      },
      { path: "404", element: <NotFoundPage /> },
      { path: "*", element: <Navigate to="/404" replace /> },
    ],
  },
]);
