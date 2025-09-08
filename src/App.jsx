import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  Dumbbell,
  User,
  Target,
  Bell,
  Crown,
  LogIn,
  LogOut,
  Settings as SettingsIcon,
  Menu,
  X,
} from "lucide-react";
import TrialBanner from "./components/TrialBanner";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import { useAuth } from "./hooks/useAuth";
import { signOutUser } from "./firebase/auth";

function App() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOutUser();
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header avec menu hamburger */}
      <header className="border-b border-white/5 bg-zinc-900/50 backdrop-blur">
        <nav className="mx-auto max-w-6xl header-safe h-16 flex items-center justify-between">
          {/* Logo/Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold text-lg"
          >
            <LayoutDashboard size={20} />
            <span className="hidden sm:block">FitLoop</span>
          </Link>

          {/* Menu desktop (caché sur mobile) */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              to="/"
              className="flex items-center gap-2 opacity-90 hover:opacity-100"
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/planning"
              className="flex items-center gap-2 opacity-90 hover:opacity-100"
            >
              <Calendar size={16} />
              <span>Planning</span>
            </Link>
            <Link
              to="/exercices"
              className="flex items-center gap-2 opacity-90 hover:opacity-100"
            >
              <Dumbbell size={16} />
              <span>Exercices</span>
            </Link>
            <Link
              to="/programme"
              className="flex items-center gap-2 opacity-90 hover:opacity-100"
            >
              <Target size={16} />
              <span>Programme</span>
            </Link>
            <Link
              to="/subscription"
              className="flex items-center gap-2 opacity-90 hover:opacity-100"
            >
              <Crown size={16} />
              <span>Premium</span>
            </Link>
          </div>

          {/* Actions utilisateur desktop */}
          <div className="hidden md:flex items-center gap-4 text-sm font-medium">
            {user ? (
              <>
                <Link
                  to="/profil"
                  className="flex items-center gap-2 opacity-90 hover:opacity-100"
                >
                  <User size={16} />
                  <span>Profil</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 opacity-90 hover:opacity-100"
                >
                  <LogOut size={16} />
                  <span>Déconnexion</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 opacity-90 hover:opacity-100"
              >
                <LogIn size={16} />
                <span>Connexion</span>
              </Link>
            )}
          </div>

          {/* Bouton menu hamburger (visible sur mobile) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-zinc-800"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* Menu mobile (slide down) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-zinc-900/95 border-t border-white/5">
            <div className="safe-x px-4 py-4 space-y-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800"
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/planning"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800"
              >
                <Calendar size={18} />
                <span>Planning</span>
              </Link>
              <Link
                to="/exercices"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800"
              >
                <Dumbbell size={18} />
                <span>Exercices</span>
              </Link>
              <Link
                to="/programme"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800"
              >
                <Target size={18} />
                <span>Programme</span>
              </Link>
              <Link
                to="/notifications"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800"
              >
                <Bell size={18} />
                <span>Notifications</span>
              </Link>
              <Link
                to="/subscription"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800"
              >
                <Crown size={18} />
                <span>Premium</span>
              </Link>

              <hr className="border-white/10 my-4" />

              {user ? (
                <>
                  <Link
                    to="/profil"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800"
                  >
                    <User size={18} />
                    <span>Profil</span>
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800"
                  >
                    <SettingsIcon size={18} />
                    <span>Paramètres</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800 text-left"
                  >
                    <LogOut size={18} />
                    <span>Déconnexion</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800"
                >
                  <LogIn size={18} />
                  <span>Connexion</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <TrialBanner />
      <main className="mx-auto max-w-6xl safe-x px-4 sm:px-6 py-6 sm:py-8">
        <Outlet />
      </main>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
}

export default App;
