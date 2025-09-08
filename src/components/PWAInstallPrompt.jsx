import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Détecter iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Vérifier si l'app est déjà installée
    const isAppInstalled =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone ||
      document.referrer.includes("android-app://");
    setIsInstalled(isAppInstalled);

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Afficher le prompt après un délai (pour ne pas être intrusif)
      setTimeout(() => {
        if (!localStorage.getItem("fitloop-install-dismissed")) {
          setShowInstallPrompt(true);
        }
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Pour iOS, afficher le prompt manuellement
    if (
      iOS &&
      !isAppInstalled &&
      !localStorage.getItem("fitloop-install-dismissed")
    ) {
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 5000);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android/Chrome
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        console.log("✅ FitLoop installé !");
      }

      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } else if (isIOS) {
      // Pour iOS, on affiche les instructions
      // (le prompt sera fermé par l'utilisateur après lecture)
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem("fitloop-install-dismissed", "true");
  };

  // Ne pas afficher si déjà installé
  if (isInstalled || !showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:max-w-sm safe-bottom safe-x">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="bg-blue-600 p-2 rounded-lg flex-shrink-0">
            <Smartphone size={20} className="text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm mb-1">Installer FitLoop</h3>
            <p className="text-xs text-zinc-400 mb-3">
              {isIOS
                ? "Ajoute FitLoop à ton écran d'accueil pour une expérience optimale"
                : "Installe FitLoop pour un accès rapide et des fonctionnalités avancées"}
            </p>

            {isIOS && (
              <div className="text-xs text-zinc-300 mb-3 space-y-1">
                <p>
                  1. Appuie sur{" "}
                  <span className="font-mono bg-zinc-800 px-1 rounded">⎋</span>{" "}
                  (Partager)
                </p>
                <p>2. Sélectionne "Sur l'écran d'accueil"</p>
                <p>3. Confirme avec "Ajouter"</p>
              </div>
            )}

            <div className="flex gap-2">
              {!isIOS && (
                <button
                  onClick={handleInstallClick}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium"
                >
                  <Download size={14} />
                  Installer
                </button>
              )}

              <button
                onClick={handleDismiss}
                className="text-xs text-zinc-400 hover:text-white px-2 py-1.5"
              >
                {isIOS ? "Compris" : "Plus tard"}
              </button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
