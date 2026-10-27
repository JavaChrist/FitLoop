// Service de notifications pour FitLoop

export class NotificationService {
  static async requestPermission() {
    if (!("Notification" in window)) {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  static isSupported() {
    return "Notification" in window;
  }

  static isEnabled() {
    return this.isSupported() && Notification.permission === "granted";
  }

  // Créer une notification immédiate
  static showNotification(title, options = {}) {
    if (!this.isEnabled()) return;

    const notification = new Notification(title, {
      icon: "/vite.svg", // Tu peux changer pour un logo FitLoop
      badge: "/vite.svg",
      ...options,
    });

    // Auto-fermer après 5 secondes
    setTimeout(() => notification.close(), 5000);

    return notification;
  }

  // Programmer des rappels récurrents
  static scheduleReminders(reminders) {
    // Nettoyer les anciens timers
    this.clearAllReminders();

    reminders.forEach((reminder) => {
      if (!reminder.active) return;

      reminder.days.forEach((day) => {
        this.scheduleWeeklyReminder(reminder, day);
      });
    });
  }

  static scheduleWeeklyReminder(reminder, day) {
    const now = new Date();
    const [hours, minutes] = reminder.time.split(":").map(Number);

    // Trouver le prochain occurrence de ce jour
    const dayIndex = [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ].indexOf(day);
    const targetDate = new Date();
    targetDate.setHours(hours, minutes, 0, 0);

    // Ajuster au bon jour de la semaine
    const daysUntilTarget = (dayIndex - now.getDay() + 7) % 7;
    targetDate.setDate(now.getDate() + daysUntilTarget);

    // Si c'est aujourd'hui mais l'heure est passée, programmer pour la semaine prochaine
    if (daysUntilTarget === 0 && targetDate <= now) {
      targetDate.setDate(targetDate.getDate() + 7);
    }

    const timeUntilNotification = targetDate.getTime() - now.getTime();

    if (timeUntilNotification > 0) {
      const timerId = setTimeout(() => {
        this.showNotification(reminder.name, {
          body: reminder.message,
          tag: `reminder-${reminder.id}-${day}`,
          requireInteraction: true,
        });

        // Reprogrammer pour la semaine suivante
        this.scheduleWeeklyReminder(reminder, day);
      }, timeUntilNotification);

      // Stocker l'ID du timer pour pouvoir l'annuler
      if (!window.fitloopTimers) window.fitloopTimers = [];
      window.fitloopTimers.push(timerId);
    }
  }

  static clearAllReminders() {
    if (window.fitloopTimers) {
      window.fitloopTimers.forEach((id) => clearTimeout(id));
      window.fitloopTimers = [];
    }
  }

  // Notifications contextuelles intelligentes
  static showMotivationalNotification() {
    const messages = [
      "Tu es sur la bonne voie ! 🎯",
      "Chaque séance te rapproche de ton objectif ! 💪",
      "La régularité est la clé du succès ! ⭐",
      "Ton futur moi te remercie ! 🚀",
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    this.showNotification("FitLoop", { body: randomMessage });
  }

  static showWeightReminderNotification() {
    this.showNotification("Pesée hebdomadaire", {
      body: "N'oublie pas de te peser pour suivre ta progression ! 📊",
      actions: [
        { action: "weigh", title: "Enregistrer poids" },
        { action: "later", title: "Plus tard" },
      ],
    });
  }
}
