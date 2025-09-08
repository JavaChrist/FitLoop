// API Route pour créer un paiement Mollie
// Endpoint: /api/mollie/create-payment

export default async function handler(req, res) {
  // Autoriser uniquement les requêtes POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount, description, redirectUrl, userId } = req.body;

    // Vérifier les paramètres requis
    if (!amount || !description || !redirectUrl || !userId) {
      return res.status(400).json({
        error: "Paramètres manquants",
        required: ["amount", "description", "redirectUrl", "userId"],
      });
    }

    // Vérifier que la clé API Mollie est configurée
    if (!process.env.MOLLIE_API_KEY) {
      return res.status(500).json({
        error: "Configuration Mollie manquante",
      });
    }

    // Appeler l'API Mollie depuis le serveur
    const mollieResponse = await fetch("https://api.mollie.com/v2/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MOLLIE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: {
          currency: "EUR",
          value: amount.toFixed(2),
        },
        description,
        redirectUrl,
        webhookUrl: `${req.headers.origin}/api/mollie/webhook`,
        metadata: {
          userId: userId,
          plan: "fitloop-monthly",
          source: "fitloop-app",
        },
      }),
    });

    const payment = await mollieResponse.json();

    // Vérifier si Mollie a retourné une erreur
    if (!mollieResponse.ok || payment.error) {
      console.error("Erreur Mollie API:", payment);
      return res.status(400).json({
        error: payment.error?.message || "Erreur Mollie inconnue",
        details: payment.error,
      });
    }

    console.log("✅ Paiement Mollie créé:", payment.id);

    // Retourner le paiement au frontend
    res.status(200).json(payment);
  } catch (error) {
    console.error("❌ Erreur création paiement:", error);
    res.status(500).json({
      error: "Erreur serveur lors de la création du paiement",
      message: error.message,
    });
  }
}
