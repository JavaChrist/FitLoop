// Webhook Mollie pour Vercel Functions
// Endpoint: /api/mollie/webhook

export default async function handler(req, res) {
  // Autoriser uniquement les requêtes POST de Mollie
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const paymentId = req.body.id;

    if (!paymentId) {
      return res.status(400).json({ error: "Payment ID missing" });
    }

    // Vérifier le paiement auprès de Mollie
    const mollieResponse = await fetch(
      `https://api.mollie.com/v2/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MOLLIE_API_KEY}`,
        },
      }
    );

    const payment = await mollieResponse.json();

    console.log("Webhook Mollie:", {
      id: payment.id,
      status: payment.status,
      amount: payment.amount?.value,
      metadata: payment.metadata,
    });

    // Traiter selon le statut
    if (payment.status === "paid") {
      // Paiement réussi
      await activateSubscription(payment);
    } else if (["failed", "canceled", "expired"].includes(payment.status)) {
      // Paiement échoué
      await handleFailedPayment(payment);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Erreur webhook:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function activateSubscription(payment) {
  try {
    const { userId, plan } = payment.metadata || {};

    if (!userId) {
      console.error(
        "❌ UserID manquant dans les metadata du paiement",
        payment.id
      );
      return;
    }

    console.log(`✅ Activation de l'abonnement pour l'utilisateur ${userId}`, {
      paymentId: payment.id,
      plan: plan,
      amount: payment.amount?.value,
    });

    // TODO: Intégrer avec Firestore quand prêt
    /*
    import { initializeApp } from 'firebase-admin/app';
    import { getFirestore } from 'firebase-admin/firestore';
    
    const app = initializeApp({
      credential: applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID
    });
    const db = getFirestore(app);
    
    await db.collection('users').doc(userId).update({
      subscriptionStatus: 'active',
      subscriptionStartDate: new Date().toISOString(),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      molliePaymentId: payment.id,
      mollieCustomerId: payment.customerId,
      plan: plan,
      updatedAt: new Date().toISOString()
    });
    
    console.log(`🎉 Abonnement ${plan} activé pour ${userId}`);
    */

    // Pour l'instant, on log juste (à activer quand Firestore sera configuré)
    console.log("🎯 Prêt pour l'intégration Firestore");
  } catch (error) {
    console.error("❌ Erreur lors de l'activation de l'abonnement:", error);
    throw error;
  }
}

async function handleFailedPayment(payment) {
  try {
    const { userId, plan } = payment.metadata || {};

    console.log("❌ Paiement échoué:", {
      paymentId: payment.id,
      status: payment.status,
      userId: userId,
      plan: plan,
      failureReason: payment.details?.failureReason,
    });

    // TODO: Optionnel - notifier l'utilisateur par email
    /*
    if (userId) {
      // Envoyer un email à l'utilisateur pour l'informer
      await sendPaymentFailedEmail(userId, payment);
    }
    */
  } catch (error) {
    console.error("❌ Erreur lors du traitement du paiement échoué:", error);
  }
}
