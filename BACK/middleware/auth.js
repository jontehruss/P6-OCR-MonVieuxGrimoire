const jwt = require('jsonwebtoken');
require('dotenv').config();

// ! middleware pour vérifier la présence et conformité du token dans le header des requêtes
module.exports = (req, res, next) => {
    try {
        console.log('Clé secrète dans le middleware :', process.env.SECRET_KEY);

        const authHeader = req.headers.authorization;

        // vérifier si le header Authorization est présent
        if (!authHeader) {
            throw new Error('Authorization header absent');
        }

        // récupérer le token après "Bearer " dans la chaine du header authorization
        const token = authHeader.split(' ')[1];

        //  erreur si le token est absent
        if (!token) {
            throw new Error('Token manquant');
        }

        // checker la conformité du token avec la clé secrète
        // La méthode verify() du package jsonwebtoken permet de vérifier la validité d'un token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        // ajouter "userId" à req.auth pour autoriser uniquement l'utilisateur connecté à accéder/modifier les ressources
        req.auth = { userId: decodedToken.userId }; 
        // console.log('Utilisateur authentifié :', req.auth);

        // passer au middleware suivant
        next();

    } catch (error) {
        console.error('Erreur dans le middleware auth :', error.message);
        res.status(401).json({ error: error.message });
    }
};
