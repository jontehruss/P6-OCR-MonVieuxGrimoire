const { error } = require('console');
const Book = require('../models/Book');
const fs = require('fs');


exports.addBook = (req, res) => {
    // parser l'objet du body request Book
    const bookObject = JSON.parse(req.body.book);

    // supprimer les information inutiles (id)
    delete bookObject._id;
    // protéger l'usurpation de userId -> préférer l'utilisation du user Id présent dans le token jwt
    delete bookObject._userId;
    delete bookObject.averageRating;
    console.log(bookObject)

    const book = new Book({
        // ...req.body,
        // extraire l'user id du token avec le middleware auth
        userId: req.auth.userId,
        title: bookObject.title,
        author: bookObject.author,
        // construire l'url avec la requête, destination et informations récuprées de multer
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        year: bookObject.year,
        genre: bookObject.genre,
        ratings: [{
            userId: req.auth.userId,
            grade: bookObject.grade
        }],
    });

    console.log(book);

    // méthode save() pour enregistrer en base de données
    book.save()
        .then(() => res.status(201).json({ message: 'livre enregistré !' }))
        .catch((error) => (res.status(400).json({ error })));
};



exports.editBook = (req, res, next) => {
    // S'il y a un file dans le body, parser l'objet 
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        // sinon,         
    } : {
        ...req.body
    };

    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            // Si l'id du token est différent de l'id en base de données, refus
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'non autorisé, userId mismatch' })
                // sinon on traite pour mettre à jour l'enregistrement en base
            } else {
                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => res.status(201).json({ message: 'modification effectuée' }))
                    .catch((error) => (res.status(400).json({ error })));
            };
        })
        .catch((error) => res.status(400).json({ error }));


    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'livre modifié' }))
        .catch(error => res.status(400).json({ error }));
};


exports.getAllBooks = (req, res) => {
    console.log('Utilisateur authentifié :', req.auth); // log pour vérifier l'utilisateur

    // Méthode find pour récupérer les livres
    Book.find()
        .then(books => {
            res.status(200).json(books);
        })
        .catch(error => res.status(400).json({ error }));
};



exports.getOneBook = (req, res) => {
    // Méthode findOne sur la paramètre id de la request 
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(400).json({ error }));
};

exports.getBestsBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteBook = (req, res) => {
    //  Méthode deleteOne pour cibler le avec l'id
    Book.deleteOne({ _id: req.params.id })
        .then(book => res.status(200).json({
            message: 'livre supprimé !',
            livre: book
        }))
        .catch(error => res.status(400).json({ error }))
};