import { useState, useEffect } from "react";
import { Bell, Clock, Calendar, Plus, Trash2, Edit3 } from "lucide-react";
import { NotificationService } from "../utils/notifications";

export default function Notifications() {
  const [reminders, setReminders] = useState([]);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [userProfile, setUserProfile] = useState({ timePreference: "soir" });

  useEffect(() => {
    // Charger les rappels sauvegardés
    const savedReminders = localStorage.getItem("fitloop-reminders");
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }

    // Charger les préférences utilisateur
    const savedProfile = localStorage.getItem("fitloop-profile");
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
    }

    // Vérifier si les notifications sont autorisées
    setNotificationsEnabled(NotificationService.isEnabled());
  }, []);

  // Demander l'autorisation pour les notifications
  const requestNotificationPermission = async () => {
    const enabled = await NotificationService.requestPermission();
    setNotificationsEnabled(enabled);

    if (enabled) {
      // Créer des rappels par défaut et les programmer
      createDefaultReminders();
      NotificationService.showNotification("FitLoop", {
        body: "Notifications activées ! Tu recevras des rappels pour tes séances 🎯",
      });
    }
  };

  // Créer des rappels par défaut selon les préférences
  const createDefaultReminders = () => {
    const timeSlot = userProfile.timePreference;
    const defaultTime =
      timeSlot === "matin" ? "08:00" : timeSlot === "midi" ? "12:30" : "19:00";

    const defaultReminders = [
      {
        id: Date.now(),
        name: "Séance d'entraînement",
        time: defaultTime,
        days: ["Lundi", "Mercredi", "Vendredi"],
        message: "C'est l'heure de ton entraînement ! 💪",
        active: true,
      },
      {
        id: Date.now() + 1,
        name: "Pesée hebdomadaire",
        time: "08:00",
        days: ["Lundi"],
        message: "N'oublie pas de te peser pour suivre ta progression 📊",
        active: true,
      },
    ];

    setReminders(defaultReminders);
    localStorage.setItem("fitloop-reminders", JSON.stringify(defaultReminders));
  };

  // Sauvegarder les rappels
  const saveReminders = (newReminders) => {
    setReminders(newReminders);
    localStorage.setItem("fitloop-reminders", JSON.stringify(newReminders));

    // Reprogrammer les notifications
    if (notificationsEnabled) {
      NotificationService.scheduleReminders(newReminders);
    }
  };

  // Ajouter un rappel
  const addReminder = (reminder) => {
    const newReminder = { ...reminder, id: Date.now() };
    const newReminders = [...reminders, newReminder];
    saveReminders(newReminders);
    setShowAddReminder(false);
  };

  // Supprimer un rappel
  const deleteReminder = (id) => {
    const newReminders = reminders.filter((r) => r.id !== id);
    saveReminders(newReminders);
  };

  // Activer/désactiver un rappel
  const toggleReminder = (id) => {
    const newReminders = reminders.map((r) =>
      r.id === id ? { ...r, active: !r.active } : r
    );
    saveReminders(newReminders);
  };

  return (
    <div className="grid gap-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
        <p className="text-zinc-400 mt-1">Gère tes rappels et notifications</p>
      </div>

      {/* État des notifications */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell
              className={
                notificationsEnabled ? "text-green-500" : "text-zinc-500"
              }
              size={20}
            />
            <div>
              <div className="font-medium">
                Notifications{" "}
                {notificationsEnabled ? "activées" : "désactivées"}
              </div>
              <div className="text-sm text-zinc-400">
                {notificationsEnabled
                  ? "Tu recevras des rappels selon tes préférences"
                  : "Active les notifications pour recevoir des rappels"}
              </div>
            </div>
          </div>
          {!notificationsEnabled && (
            <button
              onClick={requestNotificationPermission}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium"
            >
              Activer
            </button>
          )}
        </div>
      </div>

      {/* Liste des rappels */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium">Mes rappels</h2>
          <button
            onClick={() => setShowAddReminder(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium"
          >
            <Plus size={16} />
            Nouveau rappel
          </button>
        </div>

        {reminders.length === 0 ? (
          <div className="text-center py-8 text-zinc-400">
            <Bell size={32} className="mx-auto mb-3 opacity-50" />
            <p>Aucun rappel configuré</p>
            <p className="text-sm mt-1">
              Clique sur "Nouveau rappel" pour commencer
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className={`border rounded-lg p-4 ${
                  reminder.active
                    ? "bg-zinc-800/30 border-zinc-700"
                    : "bg-zinc-800/10 border-zinc-800 opacity-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={reminder.active}
                      onChange={() => toggleReminder(reminder.id)}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="font-medium">{reminder.name}</div>
                      <div className="text-sm text-zinc-400 flex items-center gap-2 mt-1">
                        <Clock size={12} />
                        <span>{reminder.time}</span>
                        <Calendar size={12} />
                        <span>{reminder.days.join(", ")}</span>
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">
                        "{reminder.message}"
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="p-1.5 hover:bg-zinc-700 rounded"
                      title="Supprimer"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal d'ajout de rappel */}
      {showAddReminder && (
        <ReminderModal
          onSave={addReminder}
          onCancel={() => setShowAddReminder(false)}
          userProfile={userProfile}
        />
      )}
    </div>
  );
}

function ReminderModal({ onSave, onCancel, userProfile }) {
  const [formData, setFormData] = useState({
    name: "",
    time:
      userProfile.timePreference === "matin"
        ? "08:00"
        : userProfile.timePreference === "midi"
        ? "12:30"
        : "19:00",
    days: [],
    message: "",
    active: true,
  });

  const dayOptions = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  const handleDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.days.length > 0) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-medium mb-4">Nouveau rappel</h3>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="grid gap-2 text-sm">
            <span className="font-medium">Nom du rappel</span>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:border-zinc-600 focus:outline-none"
              placeholder="Ex: Séance cardio"
              required
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-medium">Heure</span>
            <input
              type="time"
              value={formData.time}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, time: e.target.value }))
              }
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:border-zinc-600 focus:outline-none"
              required
            />
          </label>

          <div className="grid gap-2 text-sm">
            <span className="font-medium">Jours</span>
            <div className="grid grid-cols-2 gap-2">
              {dayOptions.map((day) => (
                <label
                  key={day}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.days.includes(day)}
                    onChange={() => handleDayToggle(day)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{day}</span>
                </label>
              ))}
            </div>
          </div>

          <label className="grid gap-2 text-sm">
            <span className="font-medium">Message</span>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, message: e.target.value }))
              }
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:border-zinc-600 focus:outline-none resize-none"
              rows="2"
              placeholder="Message qui s'affichera dans la notification"
            />
          </label>

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 rounded-lg px-4 py-2 font-medium"
            >
              Créer rappel
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
