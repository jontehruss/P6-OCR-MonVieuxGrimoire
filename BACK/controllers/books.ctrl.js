const Book = require('../models/Book');



exports.addBook = (req, res) => {
    console.log(req.body);
    console.log('la route et le ctrl sont ok ! ')
    const book = new Book({
        ...req.body
    });
    // méthode save() pour enregistrer en base de données
    book.save()
        .then(() => res.status(201).json({ message: 'livre enregistré !' }))
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
            res.status(200).json(books);})
        .catch(error => res.status(400).json({ error }));
};



exports.getOneBook = (req, res) => {
    // Méthode findOne sur la paramètre id de la request 
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(400).json({ error }));
};