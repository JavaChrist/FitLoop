import { useState, useEffect } from "react";
import {
  Crown,
  Check,
  Calendar,
  CreditCard,
  Loader,
  AlertCircle,
  X,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { MollieService } from "../utils/mollie";

export default function Subscription() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({});
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const savedProfile = localStorage.getItem("fitloop-profile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const isTrialActive = () => {
    if (!profile.trialEndDate) return false;
    return new Date() < new Date(profile.trialEndDate);
  };

  const getDaysRemaining = () => {
    if (!profile.trialEndDate) return 0;
    const remaining = Math.ceil(
      (new Date(profile.trialEndDate) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(0, remaining);
  };

  const handleSubscribe = async () => {
    setIsProcessing(true);

    try {
      // Vérifier si on a une clé API Mollie configurée
      if (!MollieService.apiKey) {
        setErrorMessage(
          "Configuration de paiement manquante. Veuillez configurer votre clé API Mollie."
        );
        setShowError(true);
        return;
      }

      // En mode dev avec clé de test, ou en production
      if (import.meta.env.DEV && MollieService.apiKey.startsWith("test_")) {
        // Mode dev avec vraie clé de test Mollie
        const payment = await MollieService.createPaymentWithUser(
          4.99,
          "FitLoop Premium - Abonnement mensuel (Test)",
          MollieService.getRedirectUrl(),
          user?.uid || "demo-user"
        );

        if (payment.links?.checkout?.href) {
          window.location.href = payment.links.checkout.href;
        } else {
          throw new Error("Lien de paiement non reçu de Mollie");
        }
      } else if (!import.meta.env.DEV) {
        // Production : vrai paiement Mollie
        const payment = await MollieService.createPaymentWithUser(
          4.99,
          "FitLoop Premium - Abonnement mensuel",
          MollieService.getRedirectUrl(),
          user?.uid || "demo-user"
        );

        if (payment.links?.checkout?.href) {
          window.location.href = payment.links.checkout.href;
        } else {
          throw new Error("Lien de paiement non reçu de Mollie");
        }
      } else {
        // Fallback : simulation uniquement si pas de clé API
        const payment = await MollieService.simulatePayment();
        console.log("Paiement simulé:", payment);

        const newProfile = {
          ...profile,
          subscriptionStatus: "active",
          subscriptionStartDate: new Date().toISOString(),
          nextBillingDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          molliePaymentId: payment.id,
        };
        setProfile(newProfile);
        localStorage.setItem("fitloop-profile", JSON.stringify(newProfile));
        setShowPayment(false);
      }
    } catch (error) {
      console.error("Erreur paiement:", error);
      setErrorMessage(
        error.message || "Erreur lors du paiement. Veuillez réessayer."
      );
      setShowError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto grid gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Abonnement</h1>
        <p className="text-zinc-400 mt-1">Gère ton abonnement FitLoop</p>
      </div>

      {/* Statut actuel */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Crown
            className={
              profile.subscriptionStatus === "active"
                ? "text-yellow-500"
                : isTrialActive()
                ? "text-green-500"
                : "text-zinc-500"
            }
            size={24}
          />
          <div>
            <div className="font-medium text-lg">
              {profile.subscriptionStatus === "active"
                ? "Abonnement Actif"
                : isTrialActive()
                ? "Période d'essai"
                : "Accès Gratuit"}
            </div>
            <div className="text-sm text-zinc-400">
              {profile.subscriptionStatus === "active"
                ? `Prochaine facturation le ${new Date(
                    profile.nextBillingDate || Date.now()
                  ).toLocaleDateString()}`
                : isTrialActive()
                ? `${getDaysRemaining()} jours restants`
                : "Fonctionnalités limitées"}
            </div>
          </div>
        </div>

        {isTrialActive() && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-4">
            <div className="text-green-400 font-medium mb-2">
              Profite de ton essai gratuit !
            </div>
            <div className="text-sm text-zinc-300">
              Tu as accès à toutes les fonctionnalités pendant encore{" "}
              {getDaysRemaining()} jours.
            </div>
          </div>
        )}
      </div>

      {/* Offre d'abonnement */}
      {profile.subscriptionStatus !== "active" && (
        <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 border border-green-500/30 rounded-xl p-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="text-yellow-500" size={24} />
              <h2 className="text-xl font-semibold">FitLoop Premium</h2>
            </div>
            <div className="text-3xl font-bold text-green-400 mb-1">4.99€</div>
            <div className="text-zinc-400">par mois</div>
          </div>

          <div className="grid gap-3 mb-6">
            {[
              "Suivi illimité des pesées et mesures",
              "Programme personnalisé adaptatif",
              "Bibliothèque complète d'exercices avec vidéos",
              "Notifications et rappels intelligents",
              "Statistiques et analyses détaillées",
              "Sauvegarde cloud sécurisée",
              "Support prioritaire",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="text-green-500 flex-shrink-0" size={16} />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowPayment(true)}
            className="w-full bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <CreditCard size={16} />
            {isTrialActive()
              ? "Continuer avec Premium"
              : "Commencer l'essai gratuit"}
          </button>

          <div className="text-center mt-4 text-xs text-zinc-500">
            Résiliation possible à tout moment • Pas d'engagement
          </div>
        </div>
      )}

      {/* Modal de paiement */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Paiement sécurisé</h3>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-4">
              <div className="text-center">
                <div className="font-medium text-blue-400">Mollie Payment</div>
                <div className="text-sm text-zinc-400 mt-1">
                  {MollieService.apiKey
                    ? "Paiement sécurisé via Mollie (cartes, SEPA, PayPal...)"
                    : "Configuration requise pour le paiement"}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubscribe}
                disabled={isProcessing || !MollieService.apiKey}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-lg px-4 py-2 font-medium flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Traitement...
                  </>
                ) : (
                  "Payer avec Mollie"
                )}
              </button>
              <button
                onClick={() => setShowPayment(false)}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 rounded-lg px-4 py-2 font-medium"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'erreur personnalisée */}
      {showError && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-start gap-3">
              <AlertCircle
                className="text-red-400 flex-shrink-0 mt-0.5"
                size={20}
              />
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">Erreur de paiement</h3>
                <p className="text-zinc-400 text-sm mb-4">{errorMessage}</p>
              </div>
              <button
                onClick={() => setShowError(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowError(false)}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 rounded-lg px-4 py-2 font-medium"
              >
                Fermer
              </button>
              {!MollieService.apiKey && (
                <button
                  onClick={() => {
                    setShowError(false);
                    window.open(
                      "https://docs.mollie.com/overview/authentication",
                      "_blank"
                    );
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 font-medium"
                >
                  Configuration
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
