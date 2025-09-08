import { useState, useEffect } from "react";

export default function Profil() {
  const [profile, setProfile] = useState({
    weight: 82.5,
    height: 178,
    goalWeight: 75,
    waist: 85,
    chest: 95,
    hips: 98,
    timePreference: "soir",
    weeklyGoal: 0.7, // kg/semaine
    subscriptionStatus: "trial",
    trialStartDate: new Date().toISOString(),
    trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 jours
  });

  const [isSaved, setIsSaved] = useState(true);

  // Charger les données sauvegardées au démarrage
  useEffect(() => {
    const savedProfile = localStorage.getItem("fitloop-profile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: parseFloat(value) || value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem("fitloop-profile", JSON.stringify(profile));
    setIsSaved(true);
    // Optionnel: afficher une notification de succès
  };

  const handleCancel = () => {
    const savedProfile = localStorage.getItem("fitloop-profile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    setIsSaved(true);
  };

  return (
    <div className="grid gap-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profil</h1>
        <p className="text-zinc-400 mt-1">Tes informations et objectifs</p>
      </div>

      {/* Résumé des objectifs */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-medium mb-6">Résumé des objectifs</h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-400">
              {profile.weight} kg
            </div>
            <div className="text-sm text-zinc-400">Poids actuel</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">
              {profile.goalWeight} kg
            </div>
            <div className="text-sm text-zinc-400">Objectif</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-400">
              -{(profile.weight - profile.goalWeight).toFixed(1)} kg
            </div>
            <div className="text-sm text-zinc-400">À perdre</div>
          </div>
        </div>
        <div className="mt-6">
          <div className="w-full bg-zinc-800 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full"
              style={{ width: "30%" }}
            />
          </div>
          <div className="text-center mt-2 text-sm text-zinc-400">
            IMC:{" "}
            {(profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)} →{" "}
            {(profile.goalWeight / Math.pow(profile.height / 100, 2)).toFixed(
              1
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Informations de base */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4">Informations de base</h2>
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm">
              <span className="font-medium">Poids actuel (kg)</span>
              <input
                type="number"
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:border-zinc-600 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={profile.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="font-medium">Taille (cm)</span>
              <input
                type="number"
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:border-zinc-600 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={profile.height}
                onChange={(e) => handleChange("height", e.target.value)}
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="font-medium">Objectif de poids (kg)</span>
              <input
                type="number"
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:border-zinc-600 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={profile.goalWeight}
                onChange={(e) => handleChange("goalWeight", e.target.value)}
              />
            </label>
          </div>
        </div>

        {/* Mensurations */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4">Mensurations</h2>
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm">
              <span className="font-medium">Tour de taille (cm)</span>
              <input
                type="number"
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:border-zinc-600 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={profile.waist}
                onChange={(e) => handleChange("waist", e.target.value)}
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="font-medium">Tour de poitrine (cm)</span>
              <input
                type="number"
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:border-zinc-600 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={profile.chest}
                onChange={(e) => handleChange("chest", e.target.value)}
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="font-medium">Tour de hanches (cm)</span>
              <input
                type="number"
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:border-zinc-600 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={profile.hips}
                onChange={(e) => handleChange("hips", e.target.value)}
              />
            </label>
          </div>
        </div>

        {/* Préférences */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4">Préférences</h2>
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm">
              <span className="font-medium">Créneaux préférés</span>
              <select
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:border-zinc-600 focus:outline-none"
                value={profile.timePreference}
                onChange={(e) => handleChange("timePreference", e.target.value)}
              >
                <option value="matin">Matin (6h-10h)</option>
                <option value="midi">Midi (11h-14h)</option>
                <option value="soir">Soir (17h-21h)</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              <span className="font-medium">Rythme de perte de poids</span>
              <select
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:border-zinc-600 focus:outline-none"
                value={profile.weeklyGoal}
                onChange={(e) => handleChange("weeklyGoal", e.target.value)}
              >
                <option value="0.3">Très lent (0.3 kg/semaine)</option>
                <option value="0.5">Lent (0.5 kg/semaine)</option>
                <option value="0.7">Modéré (0.7 kg/semaine)</option>
                <option value="1.0">Rapide (1.0 kg/semaine)</option>
              </select>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 items-center">
          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isSaved
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {isSaved ? "Sauvegardé" : "Sauvegarder"}
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaved}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isSaved
                ? "border border-zinc-700 text-zinc-500 cursor-not-allowed"
                : "border border-zinc-700 hover:bg-zinc-800 text-white"
            }`}
          >
            Annuler
          </button>
          {!isSaved && (
            <span className="text-sm text-orange-400">
              Modifications non sauvegardées
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
