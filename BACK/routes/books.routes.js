const express = require('express');

// importer router 
const router = express.Router();

// importer middleware de vérification authentification
const auth = require('../middleware/auth');

//importer Multer pour la gestion des fichiers 
const multer = require('../middleware/multer-config');

// importer le compresseur d'image
const sharp = require('../middleware/sharp-config');

// importer le controlleur
const bookCtrl = require('../controllers/books.ctrl');

// livre les mieux notés
router.get('/bestrating', bookCtrl.getBestsBook);

// ajouter un livre
router.post('/', auth, multer, sharp, bookCtrl.addBook);

// modifier un livre
router.put('/:id', auth, multer, sharp, bookCtrl.editBook);

// lister tous les livre
router.get('/', bookCtrl.getAllBooks);

// détails d'un livre (auth?)
router.get('/:id', bookCtrl.getOneBook);

// Noter un livre
router.post('/:id/rating', auth, bookCtrl.rateBook);

// supprimer un livre
router.delete('/:id', auth, bookCtrl.deleteBook);

// exposer le routeur 
module.exports = router;