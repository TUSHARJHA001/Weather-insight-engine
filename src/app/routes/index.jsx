import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "@/app/providers/AppLayout.jsx";

const Dashboard = lazy(() => import("../../pages/Dashboard/index.jsx"));
const Analytics = lazy(() => import("../../pages/Analytics/index.jsx"));
const Compare = lazy(() => import("../../pages/Compare/index.jsx"));
const SavedLocations = lazy(
  () => import("../../pages/SavedLocations/index.jsx"),
);

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-6 h-6 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin" />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "analytics",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Analytics />
          </Suspense>
        ),
      },
      {
        path: "compare",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Compare />
          </Suspense>
        ),
      },
      {
        path: "saved",
        element: (
          <Suspense fallback={<PageLoader />}>
            <SavedLocations />
          </Suspense>
        ),
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
