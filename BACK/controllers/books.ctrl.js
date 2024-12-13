const { error } = require('console');
const fs = require('fs-extra');
// const fsXtra = require ('fs-extra');
const Book = require('../models/Book');


exports.addBook = (req, res) => {
    // parser l'objet du body request Book
    const bookObject = JSON.parse(req.body.book);

    // supprimer les information inutiles (id)
    delete bookObject._id;
    // protéger l'usurpation de userId -> préférer l'utilisation du user Id présent dans le token jwt
    delete bookObject._userId;
    delete bookObject.averageRating;

    const book = new Book({
        // extraire l'user id du token avec le middleware auth
        userId: req.auth.userId,
        title: bookObject.title,
        author: bookObject.author,
        // construire l'url avec la requête, destination et informations récuprées de multer
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        year: bookObject.year,
        genre: bookObject.genre,
        // initialiser le averageRating à 0 et le tableau ratings vide        
        ratings: [{
            userId: req.auth.userId,
            grade: 0
        }],
        averageRating: 0
    });

    // méthode save() pour enregistrer en base de données
    book.save()
        .then(() => res.status(201).json({ message: 'livre enregistré !' }))
        .catch((error) => (res.status(400).json({ error })));
};



exports.editBook = async (req, res, next) => {
    // S'il y a un file dans le body, parser l'objet 
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        ...req.body
    };

    delete bookObject._userId;

    try {
        const book = await Book.findOne({ _id: req.params.id });
        // vérifier la présence du livre
        if (!book) {
            return res.status(404).json({ message: 'Livre non enregistré' })
        };
        // Si l'iduser envoyé avec le token est différent de l'iduser en base de données, refus
        if (book.userId != req.auth.userId) {
            return res.status(401).json({ message: 'non autorisé, userId mismatch' })
        };

        // initialiser une variable pour récupérer la promesse renvoyée par Book.updateOne()
        let updatePromise;

        // Appel de la fonction updateOne() selon les 2 cas
        if (!req.file) {
            // Cas #1 mise à jour d'un champ (texte/nb sans image)
            // console.log('Cas #1 mise à jour d’un champ (texte/nb sans image)');
            updatePromise = Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id });

        } else {
            // Cas #2 mise à jour de l'image
            const fileName = book.imageUrl.split('/').pop();
            try {
                // supprimer le fichier avec fs.unlink
                await fs.unlink(`./images/${fileName}`);
                // console.log('Fichier supprimé');

            } catch (err) {
                console.error('Erreur de suppression du fichier', err);
                return res.status(500).json({ error: 'Erreur de suppression du fichier' });
            }

            // récupérer la promesse
            updatePromise = Book.updateOne({ _id: req.params.id }, bookObject);
        };

        await updatePromise;
        res.status(200).json({ message: 'livre modifié' });
        // console.log('Livre mis à jour');

    } catch (error) {
        console.error('Erreur lors de la recherche du livre', error);
        res.status(400).json({ error });
    }
};


// Fonction de notation d'un livre
exports.rateBook = (req, res) => {
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

            // ! Voir si la réponse est ok ?
            const response = {
                ...bookData,
                // * id: bookData._id.toString(),
            };
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

    // Méthode find pour récupérer les livres
    Book.find()
        // renvoyer que 3 éléments
        .limit(3)
        // méthode slect pour projection des seuls champs voulus 
        .select("title author averageRating imageUrl")
        // trier de manière ascendente
        .sort({ averageRating: -1 })
        .then((books) => {
            res.status(200).json(books);
        })
        .catch(error => res.status(400).json({ error }));
};

// ! penser à supprimer l'image ici aussi
exports.deleteBook = (req, res) => {
    //  Méthode deleteOne pour cibler le avec l'id
    Book.deleteOne({ _id: req.params.id })
        .then(book => res.status(200).json({
            message: 'livre supprimé !',
            livre: book
        }))
        .catch(error => res.status(400).json({ error }))
};