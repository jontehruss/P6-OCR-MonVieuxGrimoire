const Book = require('../models/Book');
const fs = require('fs');


exports.addBook = (req, res) => {

    // console.log('la route et le ctrl sont ok ! ')
    // console.log('Method:', req.method);
    // console.log('URL:', req.url);
    // console.log('Headers:', req.headers);
    // console.log('Query:', req.query);
    // console.log('Params:', req.params);
    // console.log('Body:', req.body.book);
    // console.log('Cookies:', req.cookies);
    // console.log('IP:', req.ip);
    // console.log('Protocol:', req.protocol);
    // console.log('Original URL:', req.originalUrl);

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
        .catch((error) => (
            // console.log(error),
            res
                .status(400)
                .json({ error })
        )

        );
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


exports.editBook = (req, res, next) => {
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