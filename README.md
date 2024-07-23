# Projet2_E24_IFT3225

## Introductions

- Ce projet est une application web présentant des tuiles sur la page. Chaque tuile représente un élément de l'application. Cette application est un système de gestion d'albums. Ce système de gestion aux utilisateurs de créer, modifier et supprimer des tuiles (grâce à une API REST), et de les partager en temps réel avec d'autres utilisateurs connectés.

## Dépendances

- node.js v20.15.1
- npm v10.7.0
- phpMyAdmin SQL Dump v5.1.2 (MySQL)
- bootstrap v5.3.3 (intégré dans le projet)

## Instructions

1. Tout d'abord, assurez-vous que votre ordinateur a installé node.js.
2. Lancez MAMP, assurez-vous que le serveur mysql fonctionne sur le port 3306, puis créez une nouvelle base de données appelée tp2. Importez le fichier tp2.sql situé dans le répertoire racine de ce dépôt. Les informations utilisées pour se connecter à la base de données dans notre programme sont dans le file .env.
3. Ensuite, dans le répertoire racine du projet, utilisez Terminal pour exécuter `npm install`.

4. Puis, utilisez Terminal pour exécuter `node app.js` (ou `nodemon app.js`).
5. Lors des tests locaux, ouvrez le navigateur et entrez <http://localhost:{PORT}/> dans la barre d'adresse (dans ce projet, le port par défaut est <http://localhost:3000/>).

## La mise en œuvre de la composition du projet

1. Interface utilisateur

   - Nous utilisons principalement le cadre bootstrap v5.3.3 pour le front-end, et nous nous référons à bootstrap-5.3.3-examples/masonry pour réaliser notre interface utilisateur.

   - Notre interface utilisateur est principalement public/index.html et public/private.html.
   - L'index.html est utilisé pour afficher l'interface avant la connexion de l'utilisateur. Dans cette interface, nous choisirons aléatoirement 15 tuiles de la base de données pour l'affichage.
   - Le private.html est utilisé pour afficher l'interface après la connexion de l'utilisateur. Selon le nombre de tuiles que l'utilisateur peut voir, nous mettrons en place un système de pagination dynamique.
  
2. Affichage dynamique en fonction de la taille de l'écran (CSS)

   - En utilisant l'attribut col-* dans bootstrap 5, nous avons défini dynamiquement la largeur de chaque colonne sur l'écran, évitant ainsi à l'utilisateur de se promener de droite à gauche.
   - De plus, en utilisant masonry.pkgd.min.js, nous avons réalisé un ajustement dynamique lorsque la largeur de l'écran change.

3. Authentification utilisateur

   - Nous avons mis en place un système d'authentification pour permettre aux utilisateurs de s'inscrire, de se connecter et de gérer leurs tuiles personnelles.
   - Les fonctionnalités d'inscription et de connexion sont principalement mises en œuvre dans index.js sur le front-end, et sont principalement réalisées par les fonctionnalités de routage dans src/routes/userRoutes.js sur le back-end.
   - Lors de l'inscription, nous vérifions le format de l'e-mail à l'aide d'une expression régulière sur le front-end. Tous les mots de passe des utilisateurs sont cryptés en utilisant une méthode de hachage et sont ensuite stockés dans la base de données.
   - Comme il existe un attribut de rôle dans la table des utilisateurs dans la base de données pour distinguer les fonctions des utilisateurs, il peut y avoir plusieurs comptes administrateurs.
   - Après la connexion de l'utilisateur, toutes les demandes qu'il envoie au back-end incluront ses informations de token dans les en-têtes pour l'authentification. La vérification du token est principalement réalisée par src/middleware/auth.js.

4. Gestion des tâches (REST)

   - Nous utilisons différentes méthodes REST API telles que GET, POST, PUT, DELETE pour communiquer entre le serveur et le client, permettant aux utilisateurs d'afficher les tuiles, d'en ajouter une, d'en modifier une ou d'en supprimer une.

5. Partage en temps réel (requêtes asynchrones)

   - Toutes les demandes des utilisateurs sont traitées par des requêtes asynchrones, principalement mises en œuvre dans private.js.

6. Stockage de données

   - Nous utilisons principalement le pool de connexions mysql2/promise pour interagir avec la base de données, principalement mis en œuvre dans src/services/mysql.js.

7. Sauvegarde et gestion des versions

   - Au cours de tout le processus de développement de cette application, nous avons utilisé GitHub pour sauvegarder la progression et l'interaction. L'adresse du dépôt est <https://github.com/JdJ1n/Projet2_E24_IFT3225>.
