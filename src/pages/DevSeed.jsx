import { useState } from "react";
import {
  ensureUserProfile,
  createWorkout,
  createTrack,
  createExercise,
  currentUserIdOrDemo,
} from "../firebase/collections";

export default function DevSeed() {
  const [status, setStatus] = useState("");

  async function handleSeed() {
    setStatus("Initialisation en cours...");
    try {
      const userId = currentUserIdOrDemo();
      await ensureUserProfile(userId, {
        displayName: "Demo User",
        preferences: { slot: "soir" },
      });

      await Promise.all([
        createExercise({ name: "Rowing", tags: ["dos", "cardio"] }),
        createExercise({ name: "Squat box", tags: ["renfo", "genoux"] }),
        createExercise({
          name: "Étirements lombaires",
          tags: ["dos", "mobilité"],
        }),
      ]);

      await createWorkout(userId, {
        title: "Cardio matinal",
        type: "cardio",
        duration: 30,
        intensity: "modérée",
        date: new Date().toISOString().slice(0, 10),
      });

      await createTrack(userId, {
        type: "poids",
        value: 81.6,
        unit: "kg",
        at: new Date().toISOString(),
      });

      setStatus("Seed terminé. Collections créées.");
    } catch (e) {
      setStatus("Erreur: " + (e?.message || "inconnue"));
    }
  }

  return (
    <div className="grid gap-4 max-w-lg">
      <h1 className="text-xl font-medium">Dev · Seed</h1>
      <button
        onClick={handleSeed}
        className="border border-white/10 px-3 py-2 rounded"
      >
        Créer les collections et données d'exemple
      </button>
      {status && (
        <div className="border border-white/10 rounded p-3 text-sm">
          {status}
        </div>
      )}
    </div>
  );
}
