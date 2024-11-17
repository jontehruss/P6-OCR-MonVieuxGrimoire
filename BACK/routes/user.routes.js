const express = require('express');
const router = express.Router();

const User = require('../models/User');

// importer le controlleur
const userCtrl = require('../controllers/users.ctrl');

//  Créer un utilisateur
router.post('/signup', userCtrl.signUp);

// Signin - cet endpoint récupère uniquement les requêtes post avec app.post
router.post('/login', userCtrl.logIn );


module.exports = router;