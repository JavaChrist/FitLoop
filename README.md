# FitLoop

FitLoop est une application web en français pour suivre une remise en forme, en particulier une perte de poids. La personne connectée enregistre son profil, note ses pesées, organise ses séances et consulte quelques exercices avec vidéo.

L’interface s’adresse à une personne qui s’entraîne seule. Le programme proposé est un modèle en trois phases (adaptation, intensification, optimisation), ajusté selon le rythme de perte de poids et le créneau choisi dans le profil.

## Public

Personnes qui veulent suivre leur poids, planifier des séances et garder des rappels, depuis un navigateur, sur ordinateur ou téléphone.

Aucun autre public (coachs, salles, entreprises) n’est décrit dans le code.

## Fonctionnalités

L’accès aux pages demande un compte. Sans session, l’application renvoie vers la connexion.

### Opérationnelles

Ces parcours fonctionnent dans le navigateur lorsque Firebase est configuré pour la connexion.

- **Compte** : inscription et connexion par e-mail et mot de passe (Firebase Authentication), puis déconnexion. À l’inscription, un profil d’essai de 30 jours est enregistré dans le navigateur.
- **Profil** : poids, taille, objectif de poids, tours de taille, de poitrine et de hanches, créneau préféré (matin, midi ou soir) et rythme de perte (0,3 à 1 kg par semaine). L’enregistrement met à jour le navigateur, et le document utilisateur Firestore si une session est ouverte.
- **Programme de perte de poids** : objectif, poids restant, durée estimée, phase en cours, séances types et repères nutritionnels (calories et conseils écrits dans la page). La personne peut saisir, modifier et supprimer une pesée par semaine. Le graphique du tableau de bord reprend ces pesées.
- **Planning** : semaines numérotées, proposition de séances selon la phase, ajout et suppression de séances (nom, type, durée, jour, notes). Le planning est gardé dans le navigateur et recopié dans Firestore à chaque enregistrement.
- **Exercices** : recherche et filtres (tous, cardio, renforcement, mobilité) sur quatre exercices intégrés à la page, avec description, durée, difficulté, tags et lecture d’une vidéo YouTube.
- **Rappels** : demande d’autorisation du navigateur, création de rappels (nom, heure, jours, message) et activation ou suppression. Les rappels sont stockés dans le navigateur.
- **Installation** : manifeste et service worker permettent de proposer l’installation (y compris un mode d’emploi sur iOS) et de réafficher des pages déjà visitées sans réseau.

### Partielles

- **Tableau de bord** : objectifs, IMC, barre de progression et courbe de poids s’appuient sur le profil et les pesées du navigateur. Les deux cartes « séances récentes » sont des exemples fixes (cardio matinal, renfo dos). Si aucun profil n’existe, la page en crée un avec des valeurs d’exemple (82,5 kg, 178 cm, objectif 75 kg) et un essai de 30 jours.
- **Synchronisation** : le profil, les pesées et le planning sont envoyés vers Firestore au moment d’un enregistrement. Au chargement, les pages lisent le navigateur. Un autre appareil, ou un navigateur vidé, ne retrouve donc pas automatiquement ces données.
- **Modification d’une séance** : le formulaire s’ouvre, mais l’enregistrement ajoute une séance au lieu de remplacer celle qui était affichée.
- **Rappels dans le temps** : la programmation utilise des minuteurs de la page ouverte. Un rechargement ne les relance pas tout seul, et la fermeture de l’onglet les arrête. Le service worker ne gère pas de notifications push.
- **Essai et abonnement** : l’écran Abonnement affiche un essai, un accès « gratuit » ou un statut actif, et une offre à 4,99 € par mois. Ce montant est écrit dans l’interface. Aucune page ne bloque une fonction selon ce statut : tout reste accessible une fois connecté. Le bouton « Commencer l’essai gratuit » ouvre le paiement, il ne démarre pas un essai distinct de celui créé à l’inscription.
- **Paiement Mollie** : avec une clé configurée, l’écran appelle `/api/mollie/create-payment`, qui crée un paiement unique et renvoie vers la page de paiement Mollie. Au retour, l’adresse contient `payment=success`, mais la page ne lit pas ce paramètre et ne change pas le statut. Le webhook `/api/mollie/webhook` vérifie le paiement auprès de Mollie puis écrit dans les journaux. La mise à jour du compte dans Firestore est encore en commentaire. Les fonctions d’abonnement mensuel et de fiche client existent dans le code client et ne sont pas appelées par l’écran. En développement, si la clé du navigateur ne commence pas par le préfixe de test, le paiement est simulé et le statut « actif » n’est écrit que dans ce navigateur.
- **Application installable** : le raccourci « Mes progrès » pointe vers `/dashboard`, alors que le tableau de bord est à `/`. La proposition de mise à jour du service worker passe par une boîte de dialogue native du navigateur.
- **Réglages** : une case « Mode sombre par défaut », cochée et non modifiable. Le thème sombre est déjà appliqué sur toute l’application. Rien n’est enregistré.

### Réservées au développement

- **`/dev-seed`** : bouton qui crée, dans Firestore, un profil, trois exercices, une séance et une pesée d’exemple. La page est accessible à toute personne connectée. L’écran Exercices ne lit pas cette collection.

### Prévues, présentes dans le code sans être branchées

- Activation réelle de l’abonnement après un paiement réussi.
- Abonnement mensuel récurrent côté Mollie.
- Rechargement du profil, des pesées et du planning depuis Firestore.
- Bibliothèque d’exercices alimentée par la base (la collection et les index existent ; l’écran utilise une liste fixe).
- Séances récentes issues des entraînements enregistrés.
- Notifications push, synchronisation hors ligne des saisies, et restriction des fonctions selon l’abonnement. Ces sujets sont évoqués dans l’interface ou dans `PWA_GUIDE.md`, sans mise en œuvre correspondante.

Des fichiers (`CalendarView`, `ExerciseList`, validateurs, formateurs, `useFirestore`, `src/api/mollie-webhook.js`) ne sont reliés à aucune page.

## Stack

- React 19 et React Router 7
- Vite 7
- Tailwind CSS 4
- Firebase Authentication et Cloud Firestore
- Recharts pour la courbe de poids
- Lucide pour les icônes
- Mollie pour le paiement (fonction serverless dans `api/mollie`)
- Service worker et manifeste pour l’installation

Le fichier `package.json` ne fixe pas de version de Node.js.

## Installation

Depuis le dossier du projet :

```bash
npm install
```

Créer un fichier `.env` à la racine (il n’est pas versionné : `.gitignore` ignore les fichiers `*.local`, pas un `.env` classique ; éviter de le committer). Renseigner les variables de la section suivante, puis :

```bash
npm run dev
```

Vite sert l’application en local, en général sur `http://localhost:5173`.

## Configuration

Noms des variables uniquement. Ne pas coller de clés dans la documentation ni dans le dépôt.

Variables lues par le navigateur (`src/firebase/config.js` et `src/utils/mollie.js`) :

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_MOLLIE_API_KEY`

Variable lue par les fonctions de paiement (`api/mollie/create-payment.js` et `api/mollie/webhook.js`) :

- `MOLLIE_API_KEY`

`FIREBASE_PROJECT_ID` apparaît seulement dans un bloc commenté du webhook. `VITE_APP_URL` est cité dans `PWA_GUIDE.md` et n’est pas lu par le code.

Deux identifiants de projet Firebase coexistent : `fitloop-54ac7` dans `.firebaserc`, et `fitloop-2d380` dans la commande `npm run fb:use`. Le projet réellement utilisé est celui des variables d’environnement. À confirmer.

`firebase.json` pointe vers `firestore.rules`. Ce fichier n’est pas dans le dépôt. Les index sont dans `firestore.indexes.json` (séances, suivis, exercices).

## Commandes

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Construction dans `dist` |
| `npm run preview` | Prévisualisation du build |
| `npm run lint` | Analyse ESLint |
| `npm run fb:login` | Connexion à la CLI Firebase |
| `npm run fb:use` | Sélection du projet indiqué dans `package.json` |
| `npm run fb:deploy:rules` | Déploiement des règles Firestore |
| `npm run fb:deploy:indexes` | Déploiement des index Firestore |

## Données

Dans le navigateur (`localStorage`) :

- `fitloop-profile` : profil, essai, statut d’abonnement
- `fitloop-weekly-weights` : pesées par numéro de semaine
- `fitloop-weekly-plan` : séances du planning
- `fitloop-reminders` : rappels
- `fitloop-install-dismissed` : fermeture de l’invitation à installer l’application

Dans Firestore, lorsque le code écrit en base :

- `users/{id}` : profil, pesées, planning, date de mise à jour
- `users/{id}/workouts` et `users/{id}/tracks` : prévus pour les séances et les mesures ; remplis par la page de seed, pas par les écrans courants
- `exercises` : catalogue prévu ; rempli par le seed, non affiché par la bibliothèque

L’inscription crée le compte Firebase et le profil local. Elle ne crée pas le document Firestore. Celui-ci apparaît au premier enregistrement du profil, d’une pesée ou du planning.

## Pages

| Adresse | Contenu |
| --- | --- |
| `/login` | Connexion et inscription |
| `/` | Tableau de bord |
| `/programme` | Programme et pesées |
| `/planning` | Planning hebdomadaire |
| `/exercices` | Bibliothèque |
| `/notifications` | Rappels |
| `/profil` | Profil |
| `/subscription` | Essai et paiement |
| `/settings` | Réglages (case fixe) |
| `/dev-seed` | Données d’exemple Firestore |

## Déploiement

`vercel.json` prévoit une application à page unique et des en-têtes pour le service worker et le manifeste. `firebase.json` ne configure que Firestore (règles et index), pas l’hébergement du site.

La balise Open Graph de `index.html` indique `https://fitloop.vercel.app`. Cette adresse n’est confirmée par aucun fichier d’environnement ni par une configuration de domaine dans le dépôt. La présence de ces fichiers ne prouve pas que le site est en ligne.

Les guides `PWA_GUIDE.md` et `WEBHOOK_SETUP.md` décrivent l’installation et le webhook. Leurs étapes « notifications push » et « activation de l’abonnement en base » dépassent ce que le code exécute aujourd’hui.

## Limites importantes

- Les informations utiles restent d’abord dans le navigateur.
- L’offre à 4,99 € par mois est affichée ; l’encaissement récurrent et l’activation du compte après paiement ne sont pas terminés.
- Le catalogue d’exercices et les séances récentes ne viennent pas des données de la personne.
- La page de seed et les valeurs d’exemple peuvent se mélanger aux vraies saisies si on les utilise sur un même navigateur.
