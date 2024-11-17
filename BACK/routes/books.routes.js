const express = require('express');
const router = express.Router();

//  importer le controlleur
const bookCtrl = require('../controllers/books.ctrl');


// ajouter un livre en bdd
router.post('/', bookCtrl.addBook);

// modifier un livre
router.put('/:id', bookCtrl.editBook);

// lister tous les livre
router.get('/', bookCtrl.getAllBooks);

// détails d'un livre
router.get('/:id', bookCtrl.getOneBook);

// supprimer un livre
router.delete('/:id', bookCtrl.deleteBook);


module.exports = router;