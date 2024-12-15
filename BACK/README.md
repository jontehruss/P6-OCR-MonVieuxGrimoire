# initialiser le backend 
npm init

# installer nodemon pour faciliter le refresh du server.js
npm install -g nodemon

# installer express & middleware
npm install express --save


# installer mongoose pour accéder depuis le backend à la DB
<!-- Mongoose facilite les interactions entre Express et MongoDB -->
npm install mongoose@^7
<!-- pour la gestion des erreurs en cas d'utilisation du même email -->
npm install --save unique-validator
<!-- chiffrement des mots de passe utilsiateur -->
npm install brcypt


# déporter les informations privées en variables d'environnement
npm install dotenv

# implémenter le token jwt
npm iunstall --save jsonwebtoken


# corrections dans FRONT\src\pages\Home\Home.jsx
<!-- ajout header+jwt -->

# gérer les fichiers (upload/download)
npm instal -- save multer

npm install sharp