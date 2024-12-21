const User = require('../models/User');

//  importer bcrypt
const bcrypt = require('bcrypt');

// importer jswonweb token
const jwt = require('jsonwebtoken');

//  Variables d'environnement
require('dotenv').config();


exports.signUp = (req, res, next) => {

    // hasher le mot de passe en premier et en assynchrone car cela prends un certain temps
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            // Créer un utilisateur et passer le résultat du hash en body
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // méthode save() pour enregistrer en base de données
            user.save()
                .then((newUser) => {
                    res.status(201).json({ message: 'utilisateur  enregistré !' });
                })
                // si utilisateur déjà existant, message vague pour éviter la fuite de données
                .catch(error => res.status(400).json({
                    error: error,
                    message: 'erreur'
                }));
        })
        .catch(error => res.status(500).json({ error: error }));
};


exports.logIn = async (req, res) => {
    // cherche user dans  la base 
    User.findOne({ email: req.body.email })
        .then(user => {
            // vérifier si l'utilisateur est dans la base de données
            if (!user) {
                res.status(401).json({ message: 'identifiant et/ou mot de passe incorrect(s)' });
                // si user est présent :
            } else {
                // utiliser la méthode compare de bcrypt pour vérifier le mot de passe -> comparaison de la req avec l'information en base 
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(401).json({ message: 'identifiant et/ou mot de passe incorrect(s)' })
                        } else {
                            // envoyer le token encodé dans la réponse
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    process.env.SECRET_KEY,
                                    { expiresIn: '1h' }
                                )
                            })
                        };
                    })
                    .catch(error => {
                        res.status(500)
                            .json({ error: error })
                    });
            };
        })
        .catch(error => {
            res.status(500)
                .json({ error: error })
        });
};