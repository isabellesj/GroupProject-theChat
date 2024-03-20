import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Chat } from "./pages/Chat";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Home />,
        index: true,
      },
      {
        path: "/chat",
        element: <Chat />,
      },
      {
        path: "/chat/:id",
        element: <Chat />,
      },
    ],
  },
]);
