const express = require('express');
const router = express.Router();

const User = require('../models/User');

// ! variable temporaire pour simuler la connexion
let data = {
    token: 'azerty',
    userId: '6738dbc4a16bfe0613a0392e'
};


router.post('/signup', (req, res, next) => {
    // Créer un utilisateur
    const user = new User({
        email: req.body.email,
        password: req.body.password
    })

    // méthode save() pour enregistrer en base de données
    user.save()
        .then((newUser) => {
            res.status(201).json({ message: 'utilisateur  enregistré !' });
            // Récupérer l'_id mongo de l'utilisateur
            console.log(newUser._id);
        }

        )
        .catch(error => res.status(400).json({ error }));

});

// Signin - cet endpoint récupère uniquement les requêtes post avec app.post
router.post('/login', async (req, res) => {
    try {
        // récupérer l'email depuis le body
        const { email } = req.body;

        // vérifier que l'email est fourni
        if (!email) {
            return res.status(400).json({ error: "no email" });
        };

        // cherche user dans  la base 
        const user = await User.findOne({ email });

        if (user) {
            // ! Si user existe
            console.log('user is :', user);
            return res.status(200).json(data);
        } else {
            // Si pas de user
            console.log('no user in db');
            return res.status(400).json({ error });
        };
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error });
    };
});



module.exports = router;

