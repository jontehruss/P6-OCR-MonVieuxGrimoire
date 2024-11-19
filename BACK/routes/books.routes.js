const express = require('express');
const router = express.Router();

//  importer middleware de vérification authentification
const auth = require('../middleware/auth');

//  importer le controlleur
const bookCtrl = require('../controllers/books.ctrl');


// ajouter un livre en bdd
router.post('/', auth, bookCtrl.addBook);

// modifier un livre
router.put('/:id', auth, bookCtrl.editBook);

// lister tous les livre
router.get('/', auth, bookCtrl.getAllBooks);

// détails d'un livre
router.get('/:id', auth, bookCtrl.getOneBook);

// supprimer un livre
router.delete('/:id', auth, bookCtrl.deleteBook);


module.exports = router;