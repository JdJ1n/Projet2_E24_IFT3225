# Projet2_E24_IFT3225

## Introductions

- Dans ce projet est une application web présentant des tuiles sur la page d’accueil. Chaque tuile représente un élément de l’application. Cette application est un système de gestion d'albums. Ce système de gestion aux utilisateurs de créer, modifier et supprimer des tuiles (grâce à une API REST), et de les partager en temps réel avec d'autres utilisateurs connectés.

## Dépendances

- node.js v20.15.1
- npm v10.7.0
  - express v4.19.2
  - mysql v2.18.1
  - nodemon v3.1.4 (optionelle)
- bootstrap v5.3.3 (intégré dans le projet)

## Instructions

1. Tout d’abord, assurez-vous que votre ordinateur a installé node.js.
2. Lancez MAMP, assurez-vous que le serveur mysql fonctionne sur le port 3306, puis créez une nouvelle base de données appelée tp2. Importez le fichier tp2.sql situé dans le répertoire racine de ce dépôt. Les informations utilisées pour se connecter à la base de données dans notre programme sont :

  ```plaintext
  {DB_HOST=localhost
  DB_USER=root
  DB_PASS=root
  DB_NAME=tp2
  }```

3. Ensuite, dans le répertoire racine du projet, utilisez Terminal pour exécuter `node app.js` (ou `nodemon app.js`).
4. Lors des tests locaux, ouvrez le navigateur et entrez <http://localhost:{PORT}/> dans la barre d’adresse (dans ce projet, le port par défaut est <http://localhost:3000/>).
