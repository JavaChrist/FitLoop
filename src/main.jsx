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

// Enregistrement du Service Worker pour PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("✅ Service Worker enregistré:", registration.scope);

        // Écouter les mises à jour
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // Nouvelle version disponible
              console.log("🆕 Nouvelle version de FitLoop disponible");

              // Optionnel: Afficher une notification à l'utilisateur
              if (
                window.confirm(
                  "Une nouvelle version de FitLoop est disponible. Recharger maintenant ?"
                )
              ) {
                newWorker.postMessage({ type: "SKIP_WAITING" });
                window.location.reload();
              }
            }
          });
        });
      })
      .catch((error) => {
        console.log("❌ Échec enregistrement Service Worker:", error);
      });
  });

  // Gérer la prise de contrôle par le nouveau service worker
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.location.reload();
  });
}
