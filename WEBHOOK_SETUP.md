# 🔗 Configuration des Webhooks Mollie pour FitLoop

## 📋 Étapes de configuration

### 1. **Déployer ton webhook**

Ton webhook est déjà prêt dans `api/mollie/webhook.js`. Il sera automatiquement disponible à :

```
https://ton-domaine.vercel.app/api/mollie/webhook
```

### 2. **Configurer dans le dashboard Mollie**

1. **Connecte-toi sur [mollie.com](https://mollie.com)**
2. **Va dans "Developers" → "Webhooks"**
3. **Clique sur "Create webhook"**
4. **Configure :**
   - **URL** : `https://ton-domaine-fitloop.vercel.app/api/mollie/webhook`
   - **Events** : Sélectionne `payment.paid`, `payment.failed`, `payment.canceled`, `payment.expired`
   - **Description** : "FitLoop Payment Webhook"

### 3. **Variables d'environnement requises**

Assure-toi d'avoir ces variables dans Vercel :

```bash
# Dans Vercel Dashboard → Settings → Environment Variables
MOLLIE_API_KEY=live_ton_api_key_mollie    # Pour production
VITE_MOLLIE_API_KEY=test_ton_api_key      # Pour dev/frontend
```

## 🔄 Comment ça fonctionne

### **Flux normal :**

1. Utilisateur clique "S'abonner"
2. Redirection vers Mollie
3. Utilisateur paie
4. **Mollie envoie webhook** → Ton serveur
5. **Ton serveur active l'abonnement** → Base de données
6. Utilisateur redirigé → FitLoop avec accès premium

### **Avantages des webhooks :**

- ✅ **Fiabilité** : Même si l'utilisateur ferme son navigateur
- ✅ **Temps réel** : Activation immédiate de l'abonnement
- ✅ **Sécurité** : Vérification côté serveur
- ✅ **Gestion des échecs** : Traitement automatique des paiements ratés

## 🧪 Test des webhooks

### **En développement :**

1. Utilise [ngrok](https://ngrok.com) pour exposer ton localhost
2. Configure l'URL webhook : `https://ton-ngrok.ngrok.io/api/mollie/webhook`

### **Avec Vercel (recommandé) :**

1. Deploy sur Vercel
2. Utilise l'URL de production dans Mollie

## 🎯 Prochaines étapes

1. **Intégrer Firestore** : Décommenter le code dans `activateSubscription()`
2. **Tester les paiements** : Avec une vraie clé de test Mollie
3. **Monitoring** : Surveiller les logs dans Vercel Functions

## 🚨 Points importants

- **Sécurité** : Le webhook vérifie toujours le paiement auprès de Mollie
- **Idempotence** : Le webhook peut être appelé plusieurs fois pour le même paiement
- **Timeout** : Mollie attend une réponse HTTP 200 dans les 15 secondes
