// Service Mollie pour FitLoop
// Note: En production, les appels API Mollie doivent se faire côté serveur pour la sécurité

export class MollieService {
  static apiKey = import.meta.env.VITE_MOLLIE_API_KEY;
  static baseUrl = "https://api.mollie.com/v2";

  // Créer un paiement unique (pour tester)
  static async createPayment(amount, description, redirectUrl) {
    return this.createPaymentWithUser(
      amount,
      description,
      redirectUrl,
      "demo-user"
    );
  }

  // Créer un paiement avec ID utilisateur spécifique
  static async createPaymentWithUser(amount, description, redirectUrl, userId) {
    try {
      // 🔥 NOUVEAU : Appeler notre API route au lieu de Mollie directement
      const response = await fetch("/api/mollie/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          description: description,
          redirectUrl: redirectUrl,
          userId: userId,
        }),
      });

      const payment = await response.json();

      // Vérifier si notre API a retourné une erreur
      if (!response.ok || payment.error) {
        throw new Error(
          payment.error || `Erreur ${response.status}: ${response.statusText}`
        );
      }

      return payment;
    } catch (error) {
      console.error("Erreur création paiement Mollie:", error);
      throw error;
    }
  }

  // Créer un abonnement récurrent
  static async createSubscription(customerId, amount, description) {
    try {
      const response = await fetch(
        `${this.baseUrl}/customers/${customerId}/subscriptions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: {
              currency: "EUR",
              value: amount.toFixed(2),
            },
            interval: "1 month",
            description,
            webhookUrl: `${window.location.origin}/api/mollie/webhook`,
            metadata: {
              plan: "fitloop-monthly",
            },
          }),
        }
      );

      const subscription = await response.json();
      return subscription;
    } catch (error) {
      console.error("Erreur création abonnement Mollie:", error);
      throw error;
    }
  }

  // Créer un client Mollie
  static async createCustomer(email, name) {
    try {
      const response = await fetch(`${this.baseUrl}/customers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          metadata: {
            source: "fitloop-app",
          },
        }),
      });

      const customer = await response.json();
      return customer;
    } catch (error) {
      console.error("Erreur création client Mollie:", error);
      throw error;
    }
  }

  // Vérifier le statut d'un paiement
  static async getPaymentStatus(paymentId) {
    try {
      const response = await fetch(`${this.baseUrl}/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      const payment = await response.json();
      return payment;
    } catch (error) {
      console.error("Erreur vérification paiement Mollie:", error);
      throw error;
    }
  }

  // URL de redirection après paiement
  static getRedirectUrl() {
    return `${window.location.origin}/subscription?payment=success`;
  }

  // Simuler le paiement en dev (à supprimer en prod)
  static async simulatePayment() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: "tr_demo_" + Date.now(),
          status: "paid",
          amount: { value: "4.99", currency: "EUR" },
          description: "FitLoop Premium - Abonnement mensuel",
          createdAt: new Date().toISOString(),
        });
      }, 2000); // Simule 2s de traitement
    });
  }
}
