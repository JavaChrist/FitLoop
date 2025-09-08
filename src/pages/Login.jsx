import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { emailPasswordSignIn } from "../firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/auth";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        // Créer le profil utilisateur initial
        const defaultProfile = {
          weight: 75,
          height: 175,
          goalWeight: 70,
          weeklyGoal: 0.7,
          timePreference: "soir",
          subscriptionStatus: "trial",
          trialStartDate: new Date().toISOString(),
          trialEndDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(), // 30 jours
        };
        localStorage.setItem("fitloop-profile", JSON.stringify(defaultProfile));
      } else {
        await emailPasswordSignIn(formData.email, formData.password);
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            {isSignUp ? "Créer un compte" : "Connexion"}
          </h1>
          <p className="text-zinc-400 mt-2">
            {isSignUp
              ? "Commence ton parcours FitLoop avec 1 mois gratuit !"
              : "Retrouve ton parcours de remise en forme"}
          </p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="grid gap-2 text-sm">
            <span className="font-medium flex items-center gap-2">
              <Mail size={14} />
              Email
            </span>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:border-zinc-600 focus:outline-none"
              placeholder="ton@email.com"
              required
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-medium flex items-center gap-2">
              <Lock size={14} />
              Mot de passe
            </span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 pr-10 focus:border-zinc-600 focus:outline-none"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-zinc-700 px-4 py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? (
              "Chargement..."
            ) : (
              <>
                {isSignUp ? <UserPlus size={16} /> : <LogIn size={16} />}
                {isSignUp ? "Créer mon compte" : "Se connecter"}
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            className="text-zinc-400 hover:text-white text-sm"
          >
            {isSignUp
              ? "Déjà un compte ? Se connecter"
              : "Pas de compte ? S'inscrire gratuitement"}
          </button>
        </div>

        {isSignUp && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mt-4">
            <div className="text-center">
              <div className="font-medium text-green-400 mb-1">
                🎁 Offre de lancement
              </div>
              <div className="text-sm text-zinc-300">
                <strong>1 mois gratuit</strong> pour découvrir FitLoop
              </div>
              <div className="text-xs text-zinc-400 mt-1">
                Puis 4.99€/mois • Résilie à tout moment
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
