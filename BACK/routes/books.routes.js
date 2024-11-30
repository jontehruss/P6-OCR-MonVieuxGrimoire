const express = require('express');
const router = express.Router();

//  importer middleware de vérification authentification
const auth = require('../middleware/auth');

// importer le middleware Multer pour la gestion des fichiers 
const multer = require('../middleware/multer-config');

//  importer le controlleur
const bookCtrl = require('../controllers/books.ctrl');


// ajouter un livre en bdd
// l'utilisation de Multer modifie la requête, il faut donc modifie rle contrôlleur
router.post('/', auth, multer, bookCtrl.addBook);
// router.post('/', auth, bookCtrl.addBook);

// modifier un livre
router.put('/:id', auth, multer, bookCtrl.editBook);

// lister tous les livre
router.get('/', auth, bookCtrl.getAllBooks);

// détails d'un livre
router.get('/:id', auth, bookCtrl.getOneBook);

// livres mieux notés
router.get('/bestrating', auth, bookCtrl.getBestsBook);

// supprimer un livre
router.delete('/:id', auth, bookCtrl.deleteBook);


module.exports = router;