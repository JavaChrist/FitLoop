import { useState, useEffect } from "react";
import { Crown, X, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export default function TrialBanner() {
  const [profile, setProfile] = useState({});
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const savedProfile = localStorage.getItem("fitloop-profile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const isTrialActive = () => {
    if (!profile.trialEndDate) return false;
    return new Date() < new Date(profile.trialEndDate);
  };

  const getDaysRemaining = () => {
    if (!profile.trialEndDate) return 0;
    const remaining = Math.ceil(
      (new Date(profile.trialEndDate) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(0, remaining);
  };

  // Ne pas afficher si abonnement actif ou banner fermée
  if (profile.subscriptionStatus === "active" || !isVisible) {
    return null;
  }

  const hasTrialData = profile.trialEndDate;
  const isInTrial = isTrialActive();

  const daysLeft = getDaysRemaining();
  const isUrgent = isInTrial && daysLeft <= 7;

  return (
    <div
      className={`border-b ${
        !hasTrialData
          ? "bg-blue-900/20 border-blue-500/30" // Mode gratuit
          : isUrgent
          ? "bg-orange-900/20 border-orange-500/30" // Urgent
          : "bg-green-900/20 border-green-500/30" // Essai normal
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown
              className={
                !hasTrialData
                  ? "text-blue-400"
                  : isUrgent
                  ? "text-orange-400"
                  : "text-green-400"
              }
              size={20}
            />
            <div className="text-sm">
              <span
                className={`font-medium ${
                  !hasTrialData
                    ? "text-blue-400"
                    : isUrgent
                    ? "text-orange-400"
                    : "text-green-400"
                }`}
              >
                {!hasTrialData
                  ? "🚀 Découvre FitLoop Premium !"
                  : isUrgent
                  ? "⚡ Essai expire bientôt !"
                  : "🎁 Essai gratuit actif"}
              </span>
              <span className="text-zinc-400 ml-2">
                {`${daysLeft} jour${daysLeft !== 1 ? "s" : ""} restant${
                  daysLeft !== 1 ? "s" : ""
                } • Puis 4.99€/mois`}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/subscription"
              className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-colors ${
                !hasTrialData
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : isUrgent
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {isUrgent ? "S'abonner maintenant" : "Voir Premium"}
            </Link>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-zinc-800 rounded"
            >
              <X size={14} className="text-zinc-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
