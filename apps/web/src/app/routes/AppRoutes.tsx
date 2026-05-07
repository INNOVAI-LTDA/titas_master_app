import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "../layout/AppLayout";
import { PatientsPage } from "../../modules/patients/PatientsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <PatientsPage /> },
      { path: "patients", element: <PatientsPage /> },
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
