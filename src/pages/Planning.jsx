import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Plus,
  CheckCircle,
  Edit3,
  Trash2,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { userDoc } from "../firebase/collections";
import { setDoc } from "firebase/firestore";

export default function Planning() {
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(1);
  const [weeklyPlan, setWeeklyPlan] = useState({});
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [userProfile, setUserProfile] = useState({ weeklyGoal: 0.7 });

  // Charger les données sauvegardées
  useEffect(() => {
    const savedPlan = localStorage.getItem("fitloop-weekly-plan");
    if (savedPlan) {
      setWeeklyPlan(JSON.parse(savedPlan));
    }

    const savedProfile = localStorage.getItem("fitloop-profile");
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile({
        weeklyGoal: parseFloat(profile.weeklyGoal) || 0.7,
        timePreference: profile.timePreference || "soir",
      });
    }
  }, []);

  // Sauvegarder le planning
  const savePlan = async (newPlan) => {
    setWeeklyPlan(newPlan);
    localStorage.setItem("fitloop-weekly-plan", JSON.stringify(newPlan));

    // 🔥 NOUVEAU : Sauvegarder dans Firebase si utilisateur connecté
    if (user?.uid) {
      try {
        await setDoc(
          userDoc(user.uid),
          {
            weeklyPlan: newPlan,
            lastUpdated: new Date().toISOString(),
          },
          { merge: true }
        );

        console.log("✅ Planning sauvegardé dans Firebase");
      } catch (error) {
        console.error("❌ Erreur sauvegarde planning Firebase:", error);
      }
    }
  };

  // Ajouter une séance
  const addWorkout = (workout) => {
    const weekKey = `week-${currentWeek}`;
    const newPlan = {
      ...weeklyPlan,
      [weekKey]: [
        ...(weeklyPlan[weekKey] || []),
        { ...workout, id: Date.now() },
      ],
    };
    savePlan(newPlan);
    setShowAddWorkout(false);
  };

  // Supprimer une séance
  const deleteWorkout = (workoutId) => {
    const weekKey = `week-${currentWeek}`;
    const newPlan = {
      ...weeklyPlan,
      [weekKey]: (weeklyPlan[weekKey] || []).filter((w) => w.id !== workoutId),
    };
    savePlan(newPlan);
  };

  // Générer le programme recommandé selon la phase
  const getRecommendedWorkouts = (week) => {
    const isAdaptation = week <= 2;
    const isIntensification = week > 2 && week <= 6;
    const isOptimization = week > 6;

    const timeSlot = userProfile.timePreference === "matin" ? "Matin" : "Soir";

    if (isAdaptation) {
      return [
        {
          name: `Cardio léger ${timeSlot.toLowerCase()}`,
          type: "cardio",
          duration: 20,
          day: "Lundi",
          notes: "Marche rapide ou vélo tranquille",
        },
        {
          name: "Renforcement débutant",
          type: "renforcement",
          duration: 25,
          day: "Mercredi",
          notes: "Squats, pompes modifiées, gainage",
        },
        {
          name: `Cardio ${timeSlot.toLowerCase()}`,
          type: "cardio",
          duration: 25,
          day: "Vendredi",
          notes: "Vélo d'appartement",
        },
        {
          name: "Activité libre",
          type: "mobilite",
          duration: 30,
          day: "Samedi",
          notes: "Marche, yoga ou étirements",
        },
      ];
    } else if (isIntensification) {
      return [
        {
          name: `HIIT débutant ${timeSlot.toLowerCase()}`,
          type: "cardio",
          duration: 30,
          day: "Lundi",
          notes: "Burpees modifiés, mountain climbers",
        },
        {
          name: "Circuit full-body",
          type: "renforcement",
          duration: 35,
          day: "Mardi",
          notes: "Gainage renforcé, squats, pompes",
        },
        {
          name: `Cardio ${timeSlot.toLowerCase()}`,
          type: "cardio",
          duration: 35,
          day: "Jeudi",
          notes: "Course légère ou vélo",
        },
        {
          name: "Renforcement",
          type: "renforcement",
          duration: 40,
          day: "Samedi",
          notes: "Musculation + étirements",
        },
      ];
    } else {
      return [
        {
          name: `HIIT avancé ${timeSlot.toLowerCase()}`,
          type: "cardio",
          duration: 40,
          day: "Lundi",
          notes: "Circuit intensif cardio-muscu",
        },
        {
          name: "Split upper/lower",
          type: "renforcement",
          duration: 45,
          day: "Mardi",
          notes: "Supersets haut du corps",
        },
        {
          name: `Cardio fractionné ${timeSlot.toLowerCase()}`,
          type: "cardio",
          duration: 45,
          day: "Jeudi",
          notes: "Course fractionée ou rameur",
        },
        {
          name: "Functional training",
          type: "renforcement",
          duration: 40,
          day: "Vendredi",
          notes: "Mouvements fonctionnels",
        },
        {
          name: "Endurance",
          type: "cardio",
          duration: 50,
          day: "Samedi",
          notes: "Cardio long + récupération",
        },
      ];
    }
  };

  // Appliquer le programme recommandé
  const applyRecommendedProgram = () => {
    const weekKey = `week-${currentWeek}`;
    const recommended = getRecommendedWorkouts(currentWeek);
    const recommendedWithIds = recommended.map((w) => ({
      ...w,
      id: Date.now() + Math.random(),
    }));

    const newPlan = {
      ...weeklyPlan,
      [weekKey]: recommendedWithIds,
    };
    savePlan(newPlan);
  };

  const currentWeekWorkouts = weeklyPlan[`week-${currentWeek}`] || [];
  const recommendedWorkouts = getRecommendedWorkouts(currentWeek);
  const hasCustomPlan = currentWeekWorkouts.length > 0;

  const dayNames = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  // Déterminer la phase actuelle
  const getPhase = (week) => {
    if (week <= 2) return { name: "Adaptation", color: "text-blue-400" };
    if (week <= 6) return { name: "Intensification", color: "text-orange-400" };
    return { name: "Optimisation", color: "text-green-400" };
  };

  const currentPhase = getPhase(currentWeek);

  return (
    <div className="grid gap-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Planning</h1>
        <p className="text-zinc-400 mt-1">Organise tes séances de la semaine</p>
      </div>

      {/* Navigation semaines */}
      <div className="space-y-4">
        {/* Ligne 1: Titre, phase et navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <h2 className="text-lg font-medium">Semaine {currentWeek}</h2>
            <span className={`text-sm font-medium ${currentPhase.color}`}>
              Phase {currentPhase.name}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
              className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-sm"
              disabled={currentWeek === 1}
            >
              Précédent
            </button>
            <button
              onClick={() => setCurrentWeek(currentWeek + 1)}
              className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-sm"
            >
              Suivant
            </button>
          </div>
        </div>

        {/* Ligne 2: Boutons d'action */}
        <div className="flex flex-wrap gap-2">
          {!hasCustomPlan && (
            <button
              onClick={applyRecommendedProgram}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg font-medium text-sm sm:text-base sm:px-4"
            >
              <CheckCircle size={16} />
              <span className="hidden sm:inline">Appliquer programme</span>
              <span className="sm:hidden">Appliquer</span>
            </button>
          )}
          <button
            onClick={() => setShowAddWorkout(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg font-medium text-sm sm:text-base sm:px-4"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Ajouter séance</span>
            <span className="sm:hidden">Ajouter</span>
          </button>
        </div>
      </div>

      {/* Programme recommandé si pas de plan personnalisé */}
      {!hasCustomPlan && (
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-blue-400">
                Programme recommandé
              </h3>
              <p className="text-sm text-zinc-400 mt-1">
                Basé sur la phase {currentPhase.name} et tes préférences (
                {userProfile.timePreference})
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {recommendedWorkouts.map((workout, index) => (
              <div
                key={index}
                className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-3"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      workout.type === "cardio"
                        ? "bg-blue-500"
                        : workout.type === "renforcement"
                        ? "bg-orange-500"
                        : "bg-green-500"
                    }`}
                  />
                  <div className="font-medium">{workout.name}</div>
                </div>
                <div className="text-sm text-zinc-400 mb-1">
                  {workout.day} • {workout.duration} min
                </div>
                <div className="text-xs text-zinc-500">{workout.notes}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Planning de la semaine */}
      <div className="grid gap-4">
        {dayNames.map((day, index) => {
          const dayWorkouts = currentWeekWorkouts.filter((w) => w.day === day);

          return (
            <div
              key={day}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">{day}</h3>
                <span className="text-sm text-zinc-400">
                  {dayWorkouts.length} séance
                  {dayWorkouts.length !== 1 ? "s" : ""}
                </span>
              </div>

              {dayWorkouts.length === 0 ? (
                <div className="text-zinc-500 text-sm italic py-2">
                  Aucune séance prévue
                </div>
              ) : (
                <div className="grid gap-2">
                  {dayWorkouts.map((workout) => (
                    <div
                      key={workout.id}
                      className="flex items-center justify-between bg-zinc-800/30 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            workout.type === "cardio"
                              ? "bg-blue-500"
                              : workout.type === "renforcement"
                              ? "bg-orange-500"
                              : workout.type === "mobilite"
                              ? "bg-green-500"
                              : "bg-zinc-500"
                          }`}
                        />
                        <div>
                          <div className="font-medium">{workout.name}</div>
                          <div className="text-sm text-zinc-400 flex items-center gap-2">
                            <Clock size={12} />
                            <span>
                              {workout.duration} min • {workout.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingWorkout(workout)}
                          className="p-1.5 hover:bg-zinc-700 rounded"
                          title="Modifier"
                        >
                          <Edit3 size={14} className="text-zinc-400" />
                        </button>
                        <button
                          onClick={() => deleteWorkout(workout.id)}
                          className="p-1.5 hover:bg-zinc-700 rounded"
                          title="Supprimer"
                        >
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal d'ajout/modification de séance */}
      {(showAddWorkout || editingWorkout) && (
        <WorkoutModal
          workout={editingWorkout}
          onSave={addWorkout}
          onCancel={() => {
            setShowAddWorkout(false);
            setEditingWorkout(null);
          }}
        />
      )}
    </div>
  );
}

function WorkoutModal({ workout, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: workout?.name || "",
    type: workout?.type || "cardio",
    duration: workout?.duration || 30,
    day: workout?.day || "Lundi",
    notes: workout?.notes || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.duration) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-medium mb-4">
          {workout ? "Modifier la séance" : "Nouvelle séance"}
        </h3>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="grid gap-2 text-sm">
            <span className="font-medium">Nom de la séance</span>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:border-zinc-600 focus:outline-none"
              placeholder="Ex: Cardio matinal"
              required
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="grid gap-2 text-sm">
              <span className="font-medium">Type</span>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, type: e.target.value }))
                }
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:border-zinc-600 focus:outline-none"
              >
                <option value="cardio">Cardio</option>
                <option value="renforcement">Renforcement</option>
                <option value="mobilite">Mobilité</option>
                <option value="autre">Autre</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm">
              <span className="font-medium">Durée (min)</span>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    duration: parseInt(e.target.value),
                  }))
                }
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:border-zinc-600 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min="5"
                max="180"
                required
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm">
            <span className="font-medium">Jour</span>
            <select
              value={formData.day}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, day: e.target.value }))
              }
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:border-zinc-600 focus:outline-none"
            >
              {[
                "Lundi",
                "Mardi",
                "Mercredi",
                "Jeudi",
                "Vendredi",
                "Samedi",
                "Dimanche",
              ].map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-medium">Notes (optionnel)</span>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:border-zinc-600 focus:outline-none resize-none"
              rows="2"
              placeholder="Exercices spécifiques, matériel..."
            />
          </label>

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 rounded-lg px-4 py-2 font-medium"
            >
              {workout ? "Modifier" : "Ajouter"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-zinc-700 hover:bg-zinc-600 rounded-lg px-4 py-2 font-medium"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
