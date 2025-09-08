import { useState, useEffect } from "react";
import { Crown } from "lucide-react";
import { Link } from "react-router-dom";
import ProgressChart from "../components/ProgressChart";
import WorkoutCard from "../components/WorkoutCard";

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState({
    weight: 82.5,
    startWeight: 82.5, // Poids de départ
    goalWeight: 75,
    height: 178,
  });

  const [weeklyWeights, setWeeklyWeights] = useState({});

  // Vérifier le statut d'essai
  const isTrialActive = () => {
    if (!userProfile.trialEndDate) return false;
    return new Date() < new Date(userProfile.trialEndDate);
  };

  const getDaysRemaining = () => {
    if (!userProfile.trialEndDate) return 0;
    const remaining = Math.ceil(
      (new Date(userProfile.trialEndDate) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(0, remaining);
  };

  // Charger les données du profil et pesées depuis localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem("fitloop-profile");
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile({
        weight: profile.weight || 82.5,
        goalWeight: profile.goalWeight || 75,
        height: profile.height || 178,
        subscriptionStatus: profile.subscriptionStatus,
        trialEndDate: profile.trialEndDate,
      });
    } else {
      // Créer un profil par défaut avec essai gratuit
      const defaultProfile = {
        weight: 82.5,
        height: 178,
        goalWeight: 75,
        waist: 85,
        chest: 95,
        hips: 98,
        timePreference: "soir",
        weeklyGoal: 0.7,
        subscriptionStatus: "trial",
        trialStartDate: new Date().toISOString(),
        trialEndDate: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      };
      localStorage.setItem("fitloop-profile", JSON.stringify(defaultProfile));
      setUserProfile(defaultProfile);
    }

    const savedWeights = localStorage.getItem("fitloop-weekly-weights");
    if (savedWeights) {
      setWeeklyWeights(JSON.parse(savedWeights));
    }
  }, []);

  // Créer les données du graphique à partir des pesées réelles
  const createWeightData = () => {
    const weights = Object.entries(weeklyWeights)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .slice(-7); // 7 dernières semaines maximum

    if (weights.length === 0) {
      // Pas de pesées enregistrées, afficher juste le poids de départ
      return [{ label: "Départ", value: userProfile.weight }];
    }

    return weights.map(([week, weight]) => ({
      label: `S${week}`,
      value: weight,
    }));
  };

  const weightData = createWeightData();

  // Calculs dynamiques
  const startWeight = userProfile.startWeight || userProfile.weight; // Poids de départ
  const currentWeight = userProfile.weight;
  const goalWeight = userProfile.goalWeight;

  const totalWeightToLose = startWeight - goalWeight;
  const weightLostSoFar = startWeight - currentWeight;
  const progressPercentage =
    totalWeightToLose > 0
      ? Math.max(
          0,
          Math.min(100, (weightLostSoFar / totalWeightToLose) * 100)
        ).toFixed(0)
      : 0;

  const currentBMI = currentWeight / Math.pow(userProfile.height / 100, 2);
  const goalBMI = goalWeight / Math.pow(userProfile.height / 100, 2);

  return (
    <div className="grid gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Aujourd'hui</h1>
          <p className="text-zinc-400 mt-1">Suivi de ta remise en forme</p>
        </div>
        {/* Compte à rebours essai */}
        {userProfile.subscriptionStatus !== "active" && isTrialActive() && (
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-400">
              {getDaysRemaining()}
            </div>
            <div className="text-sm text-zinc-400">
              jour{getDaysRemaining() !== 1 ? "s" : ""} restant
              {getDaysRemaining() !== 1 ? "s" : ""}
            </div>
            <div className="text-xs text-orange-300 mt-1">Essai gratuit</div>
          </div>
        )}
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Objectifs et progression */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-medium mb-6">Objectifs</h2>
          <div className="grid gap-6">
            {/* Progression du poids */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium">Évolution du poids</h3>
                <Link
                  to="/programme"
                  className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded-lg"
                >
                  Voir programme
                </Link>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-zinc-400">Poids de départ</span>
                <span className="font-medium text-zinc-400">
                  {startWeight} kg
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-zinc-400">Poids actuel</span>
                <span className="font-semibold">{currentWeight} kg</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-zinc-400">Objectif</span>
                <span className="font-semibold text-green-400">
                  {goalWeight} kg
                </span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-zinc-400">Perdu</span>
                <span className="font-semibold text-blue-400">
                  {weightLostSoFar.toFixed(1)} kg
                </span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-orange-500 to-green-500 h-2 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="text-center mt-2 text-sm text-zinc-400">
                {progressPercentage}% de l'objectif atteint
              </div>
            </div>

            {/* IMC */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-zinc-400">IMC actuel</span>
                <span className="font-semibold">{currentBMI.toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-zinc-400">IMC objectif</span>
                <span className="font-semibold text-green-400">
                  {goalBMI.toFixed(1)}
                </span>
              </div>
              <div className="text-xs text-zinc-500">
                {currentBMI > 25
                  ? "Surpoids"
                  : currentBMI > 18.5
                  ? "Normal"
                  : "Sous-poids"}{" "}
                →{" "}
                {goalBMI > 25
                  ? "Surpoids"
                  : goalBMI > 18.5
                  ? "Normal"
                  : "Sous-poids"}
              </div>
            </div>
          </div>
        </div>

        {/* Graphique poids */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4">Évolution du poids</h2>
          <ProgressChart data={weightData} />
        </div>
      </div>

      {/* Incitation abonnement pour utilisateurs gratuits et en essai */}
      {userProfile.subscriptionStatus !== "active" && (
        <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="text-yellow-500" size={24} />
              <div>
                <div className="font-medium text-green-400">
                  {getDaysRemaining() <= 3
                    ? "🔥 Derniers jours d'essai !"
                    : getDaysRemaining() <= 7
                    ? "⚡ Essai expire bientôt !"
                    : "⭐ Profite de ton essai Premium"}
                </div>
                <div className="text-sm text-zinc-300">
                  Plus que {getDaysRemaining()} jour
                  {getDaysRemaining() !== 1 ? "s" : ""} d'accès complet • Puis
                  4.99€/mois
                </div>
              </div>
            </div>
            <Link
              to="/subscription"
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <Crown size={16} />
              S'abonner
            </Link>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-medium mb-4">Séances récentes</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <WorkoutCard
            title="Cardio matinal"
            type="Cardio"
            duration={30}
            intensity="modérée"
          />
          <WorkoutCard
            title="Renfo dos"
            type="Renforcement"
            duration={40}
            intensity="moyenne"
          />
        </div>
      </div>
    </div>
  );
}
