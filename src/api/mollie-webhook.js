// Webhook Mollie pour FitLoop
// Ce fichier doit être déployé sur un serveur (Vercel Functions, Netlify Functions, etc.)

import { MollieService } from "../utils/mollie.js";

export default async function handler(req, res) {
  // Vérifier que c'est une requête POST de Mollie
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Récupérer l'ID du paiement depuis le body
    const paymentId = req.body.id;

    if (!paymentId) {
      return res.status(400).json({ error: "Payment ID missing" });
    }

    // Vérifier le statut du paiement auprès de Mollie
    const payment = await MollieService.getPaymentStatus(paymentId);

    console.log("Webhook Mollie reçu:", {
      paymentId,
      status: payment.status,
      amount: payment.amount,
      metadata: payment.metadata,
    });

    // Traiter selon le statut
    switch (payment.status) {
      case "paid":
        await handleSuccessfulPayment(payment);
        break;

      case "failed":
      case "canceled":
      case "expired":
        await handleFailedPayment(payment);
        break;

      default:
        console.log("Statut de paiement en attente:", payment.status);
    }

    // Répondre OK à Mollie
    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Erreur webhook Mollie:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}

async function handleSuccessfulPayment(payment) {
  try {
    const { userId, plan } = payment.metadata;

    // Ici tu peux :
    // 1. Mettre à jour Firestore avec le statut d'abonnement
    // 2. Envoyer un email de confirmation
    // 3. Activer les fonctionnalités premium

    console.log(
      `✅ Paiement réussi pour l'utilisateur ${userId}, plan ${plan}`
    );

    // Exemple : Mise à jour Firestore
    /*
    import { doc, updateDoc } from 'firebase/firestore';
    import { db } from '../firebase/db.js';
    
    await updateDoc(doc(db, 'users', userId), {
      subscriptionStatus: 'active',
      subscriptionStartDate: new Date().toISOString(),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      molliePaymentId: payment.id,
      mollieCustomerId: payment.customerId
    });
    */
  } catch (error) {
    console.error("Erreur traitement paiement réussi:", error);
  }
}

async function handleFailedPayment(payment) {
  try {
    const { userId } = payment.metadata;

    console.log(`❌ Paiement échoué pour l'utilisateur ${userId}`);

    // Ici tu peux :
    // 1. Envoyer un email d'échec
    // 2. Logger l'échec
    // 3. Proposer une alternative
  } catch (error) {
    console.error("Erreur traitement paiement échoué:", error);
  }
}
