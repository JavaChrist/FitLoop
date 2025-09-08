import { Outlet, Link, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import TrialBanner from "./components/TrialBanner";
import { useAuth } from "./hooks/useAuth";
import { signOutUser } from "./firebase/auth";

function App() {
  const { user } = useAuth();
  const navigate = useNavigate();

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
      <header className="border-b border-white/5 bg-zinc-900/50 backdrop-blur">
        <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center gap-8 text-sm font-medium">
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
            to="/profil"
            className="flex items-center gap-2 opacity-90 hover:opacity-100"
          >
            <User size={16} />
            <span>Profil</span>
          </Link>
          <Link
            to="/programme"
            className="flex items-center gap-2 opacity-90 hover:opacity-100"
          >
            <Target size={16} />
            <span>Programme</span>
          </Link>
          <Link
            to="/notifications"
            className="flex items-center gap-2 opacity-90 hover:opacity-100"
          >
            <Bell size={16} />
            <span>Rappels</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <Link
              to="/subscription"
              className="flex items-center gap-2 opacity-90 hover:opacity-100"
            >
              <Crown size={16} />
              <span>Abonnement</span>
            </Link>
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 opacity-90 hover:opacity-100"
              >
                <LogOut size={16} />
                <span>Déconnexion</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 opacity-90 hover:opacity-100"
              >
                <LogIn size={16} />
                <span>Login</span>
              </Link>
            )}
            <Link
              to="/settings"
              className="flex items-center gap-2 opacity-90 hover:opacity-100"
            >
              <SettingsIcon size={16} />
              <span>Réglages</span>
            </Link>
          </div>
        </nav>
      </header>
      <TrialBanner />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
