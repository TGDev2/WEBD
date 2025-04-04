# Concert Ticketing System - Microservices Architecture

Ce dépôt contient un **SaaS** de billetterie conçu pour gérer aussi bien de petits événements (ex. : spectacle scolaire) que de grandes tournées internationales. Le projet est structuré en plusieurs **microservices** afin de garantir la **scalabilité**, la **flexibilité** et la **maintenabilité**.

## Composition du projet

Le système est organisé en **quatre services** distincts, chacun exécuté dans son propre conteneur Docker :

1. **Auth Service (auth/)**  
   - Gère l’enregistrement et la connexion des utilisateurs via JWT.  
   - Implémente quatre rôles : `Admin`, `EventCreator`, `User`, `Basic`.  
   - Stocke les utilisateurs dans une base de données **SQLite** locale.  
   - Peut créer un compte administrateur par défaut, si configuré via les variables d’environnement (`ADMIN_EMAIL`, `ADMIN_PASSWORD`).

2. **Webd Service (webd/)**  
   - Gère la logique métier relative aux événements (CRUD complet), aux billets et aux achats.  
   - Utilise une base de données **SQLite** indépendante pour stocker les événements et tickets.  
   - Vérifie systématiquement le **nombre de places disponibles** avant chaque achat, évitant toute sur-vente (grâce à un verrouillage transactionnel).  
   - Simule un **paiement par carte** (contrôle du numéro de carte, 16 chiffres requis) et déclenche une **confirmation asynchrone** (pseudo email / SMS).  
   - Expose plusieurs routes protégées par rôles (seuls `Admin` et `EventCreator` peuvent créer ou supprimer des événements).

3. **Frontend (frontend/)**  
   - Application JavaScript servie via un conteneur Nginx.  
   - Propose des écrans de connexion, liste d’événements, achat de billets, gestion des événements (si rôle élevé), et gestion des utilisateurs (si rôle `Admin`).  
   - Interagit uniquement avec le **Load Balancer** sur le port 80, qui redirige les requêtes vers les microservices Auth et Webd.

4. **Load Balancer (lb/)**  
   - Un conteneur Nginx distinct, configuré pour recevoir tout le trafic sur le port 80.  
   - Route automatiquement les chemins `/api/auth/...` vers `auth:3001`, ceux de `/api/events/...` et `/api/tickets/...` vers `webd:3000`, et sert le **Frontend** par défaut.

Cette séparation en microservices simplifie la maintenance : chaque service peut être mis à jour et déployé indépendamment. Elle permet également de faire évoluer seulement les parties de l’application qui en ont besoin (par exemple, augmenter le nombre d’instances du service Webd en cas de forte demande).

## Principales Fonctionnalités

- **CRUD d’événements**  
  - Chaque événement possède un titre, une description, une date et un nombre maximum de places (`maxSeats`).  
  - Le champ `soldSeats` permet de suivre le nombre de billets vendus.

- **Gestion des utilisateurs**  
  - Les comptes sont créés via `/api/auth/register`.  
  - La connexion se fait via `/api/auth/login`, et on reçoit un token JWT.  
  - En fonction du rôle, l’utilisateur aura plus ou moins de droits (accès à la création/suppression d’événements, à la gestion des utilisateurs, etc.).

- **Achat de billets**  
  - Le service Webd assure l’achat : il vérifie en transaction si l’événement a des places disponibles (`soldSeats < maxSeats`).  
  - Génère un ticket unique (numérotation par `crypto.randomBytes`).  
  - Effectue une **simulation de paiement** (carte de 16 chiffres) et, si validé, incrémente `soldSeats`.  
  - Déclenche un appel asynchrone (simulé) pour la confirmation (SMS/email).  
  - Le nouvel acquéreur peut consulter son billet dans l’écran *« My Tickets »* du Frontend.

- **Multilingue**  
  - Le système supporte l’anglais et le français.  
  - Chaque service utilise un middleware pour déterminer la langue (entête `Accept-Language`) et renvoie les messages dans la langue choisie.

- **Sécurité**  
  - Les mots de passe sont hashés avec **bcrypt** ; aucun mot de passe en clair dans la base.  
  - Les endpoints sensibles vérifient le token JWT (middleware `authenticateToken`).

- **Logs et tests**  
  - Les services Auth et Webd utilisent Winston pour la journalisation.  
  - Des tests (Jest / Supertest) sont disponibles pour vérifier les fonctionnalités clés (exemple : achat de billet).

## Lancer le projet

### Prérequis
- **Docker** et **Docker Compose** doivent être installés.

### Étapes
1. **Cloner** ce dépôt en local.
2. Se placer dans le dossier racine (contenant `docker-compose.yml`).
3. Copier le fichier `.env.example` en `.env` et renseigner éventuellement les variables voulues (`JWT_SECRET`, `CREATE_DEFAULT_ADMIN`, etc.).
4. Lancer la commande :
   ```bash
   docker-compose build
   docker-compose up
   ```
5. Une fois tous les conteneurs démarrés, accéder aux URL suivantes :
   - **http://localhost** : Interface utilisateur (via le load balancer).  
   - **http://localhost/api-docs** : Documentation Swagger du service Webd.  
   - **http://localhost/api/auth/api-docs** : Documentation Swagger du service Auth.  
   - **http://localhost:8080** : Frontend (si vous contournez le load balancer).

Chaque microservice stocke sa base **SQLite** en local dans le conteneur, sous le nom `database.sqlite`. Les données sont persistantes entre les redémarrages tant que le volume Docker correspondant n’est pas supprimé.

## Tests

Pour lancer les tests de chaque service :
- **Auth** :
  ```bash
  cd auth
  npm install
  npm test
  ```
- **Webd** :
  ```bash
  cd webd
  npm install
  npm test
  ```
- **Frontend** :
  ```bash
  cd frontend
  npm install
  npm test
  ```
  (Le `Dockerfile` du Frontend exécute aussi les tests lors de la phase de build.)

Un script global `./run-tests.sh` est également prévu pour exécuter les tests dans les conteneurs.

## Documentation Technique

Pour plus de détails sur l’implémentation, le fonctionnement asynchrone et l’enchaînement des composants, consultez le fichier [docs/architecture.md](./docs/architecture.md), qui inclut un schéma de l’architecture et la description des choix techniques (sécurité, transactions pour prévenir la sur-vente, etc.).