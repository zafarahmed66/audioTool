import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import Layout from "@/components/layout";
import HomePage from "./pages/home";
import AudioPage from "./pages/audio";
import EnhancePage from "./pages/enhance";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/audio",
        element: <AudioPage />,
      },
      {
        path: "/enhance",
        element: <EnhancePage />,
      },
      {
        path: "/*",
        element: <Navigate to="/" />,
      },
    ],
  },
]);

export default function App() {
  return (
    <RouterProvider router={router} />
  )
}