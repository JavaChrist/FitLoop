import { useState, useEffect } from "react";
import {
  Target,
  Calendar,
  TrendingDown,
  CheckCircle,
  Clock,
  Zap,
  Edit3,
  Trash2,
} from "lucide-react";

export default function Programme() {
  const [userProfile, setUserProfile] = useState({
    currentWeight: 82.5,
    goalWeight: 75,
    height: 178,
    timeframe: 12, // semaines
    weeklyGoal: 0.7, // kg/semaine
  });

  const [currentWeek, setCurrentWeek] = useState(1);
  const [weeklyWeights, setWeeklyWeights] = useState({}); // {semaine: poids}
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [editingWeek, setEditingWeek] = useState(null);

  // Charger les données du profil et pesées depuis localStorage
  useEffect(() => {
    // 1. Charger le profil
    const savedProfile = localStorage.getItem("fitloop-profile");
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      const weightToLose =
        (profile.weight || 82.5) - (profile.goalWeight || 75);

      // Utiliser la préférence de rythme de l'utilisateur ou valeur par défaut
      const targetWeeklyLoss = parseFloat(profile.weeklyGoal) || 0.7;
      const calculatedWeeks = Math.ceil(weightToLose / targetWeeklyLoss);
      const finalWeeks = Math.max(calculatedWeeks, 4); // Minimum 4 semaines, pas de maximum artificiel

      setUserProfile({
        currentWeight: profile.weight || 82.5,
        startWeight: profile.startWeight || profile.weight || 82.5, // Poids de départ
        goalWeight: profile.goalWeight || 75,
        height: profile.height || 178,
        timeframe: finalWeeks,
        weeklyGoal: targetWeeklyLoss,
      });
    }

    // 2. Charger les pesées
    const savedWeights = localStorage.getItem("fitloop-weekly-weights");
    if (savedWeights) {
      const weights = JSON.parse(savedWeights);
      setWeeklyWeights(weights);

      // 3. Aller à la prochaine semaine à remplir APRÈS avoir chargé les pesées
      if (Object.keys(weights).length > 0) {
        // Filtrer les semaines valides (1-12 pour un programme normal)
        const validWeeks = Object.keys(weights)
          .map(Number)
          .filter((week) => week >= 1 && week <= 12)
          .sort((a, b) => a - b);

        if (validWeeks.length > 0) {
          const maxValidWeek = Math.max(...validWeeks);
          const nextWeek = Math.min(maxValidWeek + 1, 12);
          setCurrentWeek(nextWeek);
        } else {
          setCurrentWeek(1);
        }
      }
    }
  }, []);

  // Calcul des objectifs avec poids réel
  const startWeight =
    userProfile.startWeight || userProfile.currentWeight || 80;
  const currentRealWeight =
    weeklyWeights[currentWeek] || userProfile.currentWeight || startWeight;
  const goalWeight = userProfile.goalWeight || 75;
  const totalWeightToLose = startWeight - goalWeight;
  const weightLostSoFar = startWeight - currentRealWeight;
  const remainingWeight = currentRealWeight - goalWeight;

  const weeklyTarget = parseFloat(userProfile.weeklyGoal || 0.7).toFixed(1);
  const realProgress =
    totalWeightToLose > 0
      ? Math.max(0, (weightLostSoFar / totalWeightToLose) * 100)
      : 0;

  // Recalcul du temps restant selon le poids actuel
  const weeklyGoalNum = parseFloat(userProfile.weeklyGoal || 0.7);
  const weeksRemaining =
    remainingWeight > 0 && weeklyGoalNum > 0
      ? Math.ceil(remainingWeight / weeklyGoalNum)
      : 0;

  // Fonction pour enregistrer le poids d'une semaine
  const saveWeeklyWeight = (week, weight) => {
    const parsedWeight = parseFloat(weight);
    const newWeights = { ...weeklyWeights, [week]: parsedWeight };
    setWeeklyWeights(newWeights);
    localStorage.setItem("fitloop-weekly-weights", JSON.stringify(newWeights));

    // Mettre à jour le poids actuel dans le profil avec le dernier poids enregistré
    const updatedProfile = { ...userProfile, weight: parsedWeight };
    setUserProfile(updatedProfile);
    localStorage.setItem("fitloop-profile", JSON.stringify(updatedProfile));

    setShowWeightInput(false);
    setEditingWeek(null);
  };

  // Fonction pour supprimer une pesée
  const deleteWeeklyWeight = (week) => {
    const newWeights = { ...weeklyWeights };
    delete newWeights[week];
    setWeeklyWeights(newWeights);
    localStorage.setItem("fitloop-weekly-weights", JSON.stringify(newWeights));
  };

  // Fonction pour nettoyer les données incorrectes
  const cleanInvalidWeights = () => {
    const validWeights = {};
    Object.entries(weeklyWeights).forEach(([week, weight]) => {
      const weekNum = parseInt(week);
      if (weekNum >= 1 && weekNum <= 12) {
        validWeights[week] = weight;
      }
    });
    setWeeklyWeights(validWeights);
    localStorage.setItem(
      "fitloop-weekly-weights",
      JSON.stringify(validWeights)
    );

    // Aller à la bonne semaine après nettoyage
    if (Object.keys(validWeights).length > 0) {
      const maxValidWeek = Math.max(...Object.keys(validWeights).map(Number));
      setCurrentWeek(Math.min(maxValidWeek + 1, 12));
    } else {
      setCurrentWeek(1);
    }
  };

  const weeklyProgram = {
    1: {
      title: "Semaine 1-2 : Adaptation",
      focus: "Mise en route douce",
      workouts: [
        {
          day: "Lundi",
          type: "Cardio léger",
          duration: 20,
          exercises: ["Marche rapide", "Étirements"],
        },
        {
          day: "Mercredi",
          type: "Renforcement",
          duration: 25,
          exercises: ["Squats", "Pompes modifiées", "Gainage"],
        },
        {
          day: "Vendredi",
          type: "Cardio",
          duration: 25,
          exercises: ["Vélo d'appartement", "Étirements"],
        },
        {
          day: "Samedi",
          type: "Activité libre",
          duration: 30,
          exercises: ["Marche", "Yoga"],
        },
      ],
      nutrition: {
        calories: 1800,
        tips: [
          "Boire 2L d'eau/jour",
          "3 repas + 1 collation",
          "Réduire les portions de 20%",
        ],
      },
    },
    3: {
      title: "Semaine 3-6 : Intensification",
      focus: "Montée en puissance",
      workouts: [
        {
          day: "Lundi",
          type: "HIIT débutant",
          duration: 30,
          exercises: ["Burpees modifiés", "Mountain climbers", "Squats sautés"],
        },
        {
          day: "Mardi",
          type: "Renforcement",
          duration: 35,
          exercises: ["Circuit full-body", "Gainage renforcé"],
        },
        {
          day: "Jeudi",
          type: "Cardio",
          duration: 35,
          exercises: ["Course légère", "Vélo"],
        },
        {
          day: "Samedi",
          type: "Renforcement",
          duration: 40,
          exercises: ["Musculation", "Étirements"],
        },
      ],
      nutrition: {
        calories: 1700,
        tips: [
          "Augmenter les protéines",
          "Limiter les glucides le soir",
          "Collation pré-entraînement",
        ],
      },
    },
    7: {
      title: "Semaine 7-12 : Optimisation",
      focus: "Objectif final",
      workouts: [
        {
          day: "Lundi",
          type: "HIIT avancé",
          duration: 40,
          exercises: ["Circuit intensif", "Cardio-muscu"],
        },
        {
          day: "Mardi",
          type: "Renforcement",
          duration: 45,
          exercises: ["Split upper/lower", "Supersets"],
        },
        {
          day: "Jeudi",
          type: "Cardio",
          duration: 45,
          exercises: ["Course fractionée", "Rameur"],
        },
        {
          day: "Vendredi",
          type: "Functional",
          duration: 40,
          exercises: ["Mouvements fonctionnels", "Core training"],
        },
        {
          day: "Samedi",
          type: "Endurance",
          duration: 50,
          exercises: ["Cardio long", "Récupération active"],
        },
      ],
      nutrition: {
        calories: 1600,
        tips: [
          "Cyclage glucidique",
          "Jeûne intermittent 16:8",
          "Supplémentation si besoin",
        ],
      },
    },
  };

  const getCurrentPhase = () => {
    // Phases basées sur la progression réelle, pas sur le temps total théorique
    const progressPercent =
      totalWeightToLose > 0 ? (weightLostSoFar / totalWeightToLose) * 100 : 0;

    // Phase selon le pourcentage de progression
    if (progressPercent < 25 || currentWeek <= 4) {
      return {
        ...weeklyProgram[1],
        title: "Phase d'Adaptation",
        focus: "Mise en route et création d'habitudes",
      };
    }
    if (progressPercent < 75 || currentWeek <= 8) {
      return {
        ...weeklyProgram[3],
        title: "Phase d'Intensification",
        focus: "Accélération de la perte de poids",
      };
    }
    return {
      ...weeklyProgram[7],
      title: "Phase d'Optimisation",
      focus: "Finalisation et stabilisation",
    };
  };

  // Évaluation de la faisabilité
  const weeklyTargetNum = userProfile.weeklyGoal;
  const isRealistic = weeklyTargetNum <= 1.0;
  const difficultyLevel =
    weeklyTargetNum <= 0.5
      ? "Facile"
      : weeklyTargetNum <= 0.8
      ? "Modéré"
      : weeklyTargetNum <= 1.2
      ? "Difficile"
      : "Très difficile";

  const currentPhase = getCurrentPhase();

  return (
    <div className="grid gap-8 max-w-6xl">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Programme Perte de Poids
        </h1>
        <p className="text-zinc-400 mt-1">
          Plan personnalisé sur {userProfile.timeframe} semaines
        </p>
      </div>

      {/* Vue d'ensemble */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Progression numérique */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-medium mb-6">Progression</h2>
          <div className="grid gap-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Poids de départ</span>
              <span className="font-semibold">
                {userProfile.currentWeight} kg
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Objectif final</span>
              <span className="font-semibold text-green-400">
                {userProfile.goalWeight} kg
              </span>
            </div>
            <div className="border-t border-zinc-700 pt-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-zinc-400">Poids actuel</span>
                <span className="font-semibold text-blue-400">
                  {(currentRealWeight || 0).toFixed(1)} kg
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-zinc-400">Reste à perdre</span>
                <span className="font-semibold text-orange-400">
                  -{Math.max(0, remainingWeight || 0).toFixed(1)} kg
                </span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-zinc-400">Temps restant estimé</span>
                <span className="font-semibold text-green-400">
                  {weeksRemaining} semaines
                </span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-orange-500 to-green-500 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(realProgress, 100).toFixed(0)}%`,
                  }}
                />
              </div>
              <div className="text-center mt-2 text-sm text-zinc-400">
                {(realProgress || 0).toFixed(0)}% de l'objectif accompli
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4">Objectifs</h2>
          <div className="grid gap-4">
            <div className="flex items-center gap-3">
              <Target
                className={isRealistic ? "text-green-500" : "text-orange-500"}
                size={20}
              />
              <div>
                <div className="font-medium">{weeklyTarget} kg/semaine</div>
                <div className="text-xs text-zinc-400">
                  Perte hebdomadaire • {difficultyLevel}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="text-blue-500" size={20} />
              <div>
                <div className="font-medium">
                  Semaine {currentWeek}/{userProfile.timeframe}
                </div>
                <div className="text-xs text-zinc-400">Progression</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TrendingDown className="text-orange-500" size={20} />
              <div>
                <div className="font-medium">
                  {(realProgress || 0).toFixed(0)}% accompli
                </div>
                <div className="text-xs text-zinc-400">De l'objectif</div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase actuelle */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4">Phase actuelle</h2>
          <div className="grid gap-3">
            <div>
              <div className="font-medium text-green-400">
                {currentPhase.title}
              </div>
              <div className="text-sm text-zinc-400 mt-1">
                {currentPhase.focus}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap size={16} className="text-yellow-500" />
              <span>{currentPhase.nutrition.calories} cal/jour</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock size={16} className="text-blue-500" />
              <span>{currentPhase.workouts.length} séances/semaine</span>
            </div>
          </div>
        </div>
      </div>

      {/* Avertissement si objectif irréaliste */}
      {!isRealistic && (
        <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Target
              className="text-orange-500 flex-shrink-0 mt-0.5"
              size={20}
            />
            <div>
              <div className="font-medium text-orange-400 mb-1">
                Objectif ambitieux
              </div>
              <div className="text-sm text-zinc-300">
                Une perte de {weeklyTarget} kg/semaine est difficile à
                maintenir. Considère un objectif de 0.5-0.8 kg/semaine pour des
                résultats durables.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Programme de la semaine */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium">
            Programme Semaine {currentWeek}
          </h2>
          <div className="flex gap-2">
            {!weeklyWeights[currentWeek] && (
              <button
                onClick={() => setShowWeightInput(true)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
              >
                Enregistrer poids
              </button>
            )}
            <button
              onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
              className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-sm"
              disabled={currentWeek === 1}
            >
              Précédent
            </button>
            <button
              onClick={() =>
                setCurrentWeek(Math.min(userProfile.timeframe, currentWeek + 1))
              }
              className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-sm"
              disabled={currentWeek === userProfile.timeframe}
            >
              Suivant
            </button>
          </div>
        </div>

        {/* Modal de saisie du poids */}
        {(showWeightInput || editingWeek) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-sm w-full mx-4">
              <h3 className="text-lg font-medium mb-4">
                {editingWeek
                  ? `Modifier poids semaine ${editingWeek}`
                  : `Poids semaine ${currentWeek}`}
              </h3>
              <input
                type="number"
                step="0.1"
                placeholder="Votre poids en kg"
                defaultValue={editingWeek ? weeklyWeights[editingWeek] : ""}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:border-zinc-600 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none mb-4"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    saveWeeklyWeight(
                      editingWeek || currentWeek,
                      e.target.value
                    );
                  }
                }}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    const input = e.target.parentElement.previousElementSibling;
                    if (input.value)
                      saveWeeklyWeight(editingWeek || currentWeek, input.value);
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 rounded-lg px-3 py-2"
                >
                  Sauvegarder
                </button>
                <button
                  onClick={() => {
                    setShowWeightInput(false);
                    setEditingWeek(null);
                  }}
                  className="flex-1 bg-zinc-700 hover:bg-zinc-600 rounded-lg px-3 py-2"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {currentPhase.workouts.map((workout, index) => (
            <div
              key={index}
              className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium">{workout.day}</div>
                <div className="flex items-center gap-1 text-xs text-zinc-400">
                  <Clock size={12} />
                  <span>{workout.duration}min</span>
                </div>
              </div>
              <div className="text-sm text-green-400 mb-2">{workout.type}</div>
              <div className="text-xs text-zinc-400 space-y-1">
                {workout.exercises.map((exercise, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <CheckCircle size={10} className="text-zinc-600" />
                    <span>{exercise}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Conseils nutrition */}
        <div className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-4">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Target size={16} className="text-orange-500" />
            Nutrition - {currentPhase.nutrition.calories} calories/jour
          </h3>
          <div className="grid md:grid-cols-3 gap-3 text-sm">
            {currentPhase.nutrition.tips.map((tip, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-zinc-300"
              >
                <CheckCircle
                  size={14}
                  className="text-green-500 flex-shrink-0"
                />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progression */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-medium mb-4">Barre de progression</h2>
        <div className="relative">
          <div className="w-full bg-zinc-800 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-600 to-green-400 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(realProgress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-zinc-400 mt-2">
            <span>Début</span>
            <span>{(realProgress || 0).toFixed(0)}% accompli</span>
            <span>Objectif</span>
          </div>
        </div>
      </div>

      {/* Historique des pesées */}
      {Object.keys(weeklyWeights).length > 0 && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4">Historique des pesées</h2>
          <div className="grid gap-3">
            {Object.entries(weeklyWeights)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([week, weight]) => {
                const weekNum = parseInt(week);
                const previousWeight =
                  weekNum === 1
                    ? userProfile.currentWeight
                    : weeklyWeights[weekNum - 1];
                const weightChange = previousWeight
                  ? weight - previousWeight
                  : 0;

                return (
                  <div
                    key={week}
                    className="flex items-center justify-between bg-zinc-800/30 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium">Semaine {week}</span>
                      <span className="text-lg">{weight} kg</span>
                      {weightChange !== 0 && (
                        <span
                          className={`text-sm ${
                            weightChange < 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {weightChange > 0 ? "+" : ""}
                          {(weightChange || 0).toFixed(1)} kg
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingWeek(weekNum)}
                        className="p-1.5 hover:bg-zinc-700 rounded"
                        title="Modifier"
                      >
                        <Edit3 size={14} className="text-zinc-400" />
                      </button>
                      <button
                        onClick={() => deleteWeeklyWeight(week)}
                        className="p-1.5 hover:bg-zinc-700 rounded"
                        title="Supprimer"
                      >
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
