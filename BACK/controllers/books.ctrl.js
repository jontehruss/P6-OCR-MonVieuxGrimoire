const { error } = require('console');
const Book = require('../models/Book');
const fs = require('fs');

const mongoose = require('mongoose')




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

// Fonction de notation d'un livre
exports.noteBook = (req, res) => {
    // récupérer les paramétres livre, user et note
    const userId = req.auth.userId; // ID de l'utilisateur authentifié
    const grade = req.body.rating; // note envoyée
    const bookId = req.params.id; // ID du livre

    // body objet note 
    const userRating = {
        userId: userId,
        grade: grade,
    };

    // trouver le livre par son ID
    Book.findById(bookId)
        .then((book) => {
            if (!book) {
                return res.status(404).json({ message: "Livre non trouvé" });
            };

            // ajouter la nouvelle note au tableau ratings
            book.ratings.push(userRating);

            // calculer le total des notes du livre
            const totalGrade = book.ratings.reduce((sum, rating) => {
                return sum + rating.grade;
            }, 0);

            // calculer le nombre de grades
            const numberOfGrades = book.ratings.length;

            // calculer la moyenne du livre
            const averageGrade = numberOfGrades > 0 ? Math.round(totalGrade / numberOfGrades) : 0;

            // mettre à jour la note moyenne du livre
            book.averageRating = averageGrade;

            return book.save();
        })
        .then((updatedBook) => {
            // Convertir l'objet en JSON ordinaire
            const bookData = updatedBook.toObject();

            // Inclure `id` au niveau racine ET dans l'objet book
            const response = {
                message: "Note enregistrée avec succès",
                book: { ...bookData, id: bookData._id.toString() },
                _id: bookData._id.toString(), // Ajout au niveau racine
                id: bookData._id.toString(),
            };
            console.log(response)

            res.status(201).json(response);
        })
        .catch((error) =>
            res.status(400).json({
                message: "Erreur lors du traitement",
                error,
            })
        );
};


exports.getAllBooks = (req, res) => {
    // console.log('Utilisateur authentifié :', req.auth); // log pour vérifier l'utilisateur

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
        .then((book) => {
            // console.log(req.params.id);
            (res.status(200).json(book));
        })
        .catch(error => res.status(400).json({ error }));
};

exports.getBestsBook = (req, res) => {


    console.log("Requête reçue !");

    // récupérer tous les livre  
    // Méthode find pour récupérer les livres
    Book.find()
        // renvoyer que 3 éléments
        .limit(3)
        // trier de manière ascendente
        .sort({ title: 1 })
        .then((books) => {
            res.status(200).json(books);
        })
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