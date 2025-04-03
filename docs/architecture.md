# Architecture du Système de Billetterie

Le présent système repose sur une **architecture microservices** destinée à la gestion d’événements et de tickets. Quatre conteneurs principaux constituent la base de ce projet :

```mermaid
flowchart LR
    A[Client (Navigateur)] -- HTTP --> LB[Load Balancer (Nginx)]
    LB --> Frontend[Frontend Container (JavaScript)]
    LB --> Auth[Auth Service (3001)]
    LB --> Webd[Webd Service (3000)]

    subgraph Microservices
    Auth -- SQLite
    Webd -- SQLite
    end
```

Le schéma ci-dessus illustre le parcours d’une requête depuis le navigateur de l’utilisateur jusqu’aux différents services. Le **Load Balancer (lb)**, configuré via Nginx, reçoit l’ensemble du trafic sur le port 80 puis le redirige vers la bonne cible : le service d’authentification (Auth), le service de gestion principale (Webd) ou l’interface Frontend en JavaScript.

## Fonctionnement Global

Le service **Auth** (port 3001) s’occupe de la gestion des utilisateurs et de leur authentification par Jeton JWT. Il offre notamment la création de comptes, la connexion et la détermination des rôles (Admin, EventCreator, User ou Basic). La base de données utilisée pour le service Auth est un fichier SQLite autonome, qui se synchronise lors du démarrage du conteneur.  

Le service **Webd** (port 3000) concentre la logique métier : il gère la création, l’édition et la suppression d’événements, assure la cohérence du nombre de places disponibles, et prend en charge l’achat de billets. Ce service utilise également une base SQLite indépendante, pour stocker et verrouiller les événements ainsi que les tickets associés.

L’interface **Frontend**, servie par un conteneur Nginx distinct, contient le code JavaScript (HTML, CSS, JS) permettant à l’utilisateur d’interagir avec le système. Elle fournit différents écrans :  
- une page de connexion,  
- une page listant les événements,  
- et un portail d’administration pour la création et la modification des événements, sous réserve que l’utilisateur dispose des privilèges suffisants (Admin ou EventCreator).

Lorsque l’utilisateur consulte le **Frontend**, toutes les requêtes API sont routées via le **Load Balancer**. Les demandes visant par exemple l’URL `/api/auth/...` sont redirigées vers le conteneur Auth, tandis que les appels à `/api/events/...` ou `/api/tickets/...` vont basculer vers Webd. 

## Choix Techniques

Cette répartition en microservices facilite la **scalabilité** : il est possible de dimensionner indépendamment chaque composant (par exemple en clonant plusieurs instances de Webd si le volume d’événements et de transactions augmente). Elle améliore aussi la **maintenabilité** : chaque service évolue sans perturber les autres, selon les besoins fonctionnels ou les contraintes de performance.  

Le stockage via **SQLite** dans chaque microservice met l’accent sur la simplicité lors du développement et des démonstrations. Dans un environnement de production à grande échelle, d’autres bases de données (telles que PostgreSQL ou MySQL) pourraient être adoptées afin de bénéficier d’une meilleure robustesse et d’une capacité de montée en charge plus élevée.  

La **sécurisation** est assurée via la cryptographie des mots de passe (bcrypt) et la vérification des jetons JWT à chaque route sensible. Les rôles définissent précisément l’accès aux fonctionnalités critiques (opérations Admin, création d’événements, etc.).  

Enfin, le **Load Balancer** Nginx agit comme point d’entrée unique pour toutes les requêtes. Il achemine celles-ci en HTTP vers Auth et Webd, ou bien vers le conteneur Frontend lui-même. Cette configuration est décrite dans `lb/nginx.conf` et s’inscrit dans l’esprit « un service, une responsabilité » (Single Responsibility Principle), caractéristique des architectures microservices.

## Vision d’Ensemble

Le système ainsi mis en place permet de :  
1. Créer et administrer des événements sur le service Webd.  
2. Gérer l’accès et l’authentification des utilisateurs dans le service Auth.  
3. Présenter une interface JavaScript hébergée par un conteneur Nginx pour simplifier l’usage (Frontend).  
4. Centraliser l’acheminement du trafic au travers du Load Balancer.  

À tout moment, les logs et retours d’erreur offrent des informations utiles pour le **débogage**. Chaque conteneur dispose d’un mécanisme de **logging** avec Winston et gère localement sa base de données SQLite. La cohérence des données entre microservices est maintenue via des appels HTTP bien définis et un respect strict des transactions pour éviter toute sur-vente lors de l’achat de billets.