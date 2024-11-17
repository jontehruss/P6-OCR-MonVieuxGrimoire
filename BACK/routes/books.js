const express = require('express');
// const { route } = require('../app');

const router = express.Router();

const Book = require('../models/Book');


// ajouter un livre en bdd
router.post('/', (req, res) => {
    console.log(req.body);

    // const book = new Book({
    //     title: req.body.title,
    //     author: req.body.author,
    //     imageUrl: req.body.imageUrl,
    //     year: req.body.year,
    //     genre: req.body.genre,
    // });

    // ! version simplifié par le "Spread Operator" -> fait une copie de tous les éléments de req.body
    const book = new Book({
        ...req.body
    });

    // méthode save() pour enregistrer en base de données
    book.save()
        .then(() => res.status(201).json({ message: 'livre enregistré !' }))
        .catch(error => res.status(400).json({ error }));
});

// modifier un livre
router.put('/:id', (req, res, next) => {
    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id } )
    .then(() => res.status(200).json({ message: 'livre modifié'}) )
    .catch(error => res.status(400).json({ error }));
});

// app.get pour capturer uniquement les requêtes en méthode GET
router.get('/', (req, res) => {

    // Méthode find fournie par le modèle pour requêter la base (avec des paramètres il est possible d'affiner la requête)
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
});


// app.get pour capturer uniquement les requêtes en méthode GET
router.get('/:id', (req, res) => {

    // Méthode findOne sur la paramètre id de la request 
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(400).json({ error }));
});


// app.delete pour supprimer un item en base de données
router.delete('/:id', (req, res) => {

    //  Méthode deleteOne pour cibler le avec l'id
    Book.deleteOne({ _id: req.params.id })
        .then(book => res.status(200).json({ message: 'livre supprimé !' }))
        .catch(error => res.status(400).json({ error }))
});


module.exports = router;