import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Planning from "./pages/Planning.jsx";
import Exercices from "./pages/Exercices.jsx";
import Profil from "./pages/Profil.jsx";
import Login from "./pages/Login.jsx";
import Settings from "./pages/Settings.jsx";
import DevSeed from "./pages/DevSeed.jsx";
import Programme from "./pages/Programme.jsx";
import Notifications from "./pages/Notifications.jsx";
import Subscription from "./pages/Subscription.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "planning", element: <Planning /> },
      { path: "exercices", element: <Exercices /> },
      { path: "profil", element: <Profil /> },
      { path: "programme", element: <Programme /> },
      { path: "notifications", element: <Notifications /> },
      { path: "subscription", element: <Subscription /> },
      { path: "login", element: <Login /> },
      { path: "settings", element: <Settings /> },
      { path: "dev-seed", element: <DevSeed /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
