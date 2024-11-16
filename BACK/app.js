const express = require('express');
const app = express();

// package pour interragir avec mongo
const mongoose = require('mongoose');

// body parser pour exploiter les données transmises en json
const bodyParser = require('body-parser');

//  importer les modèles de données 
const User = require('./models/User');
const Book = require('./models/Book');

//  Variables d'environnement
require('dotenv').config();


// connexion à la base de données 
mongoose.connect(process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: process.env.DB_NAME,
    })
    .then(() => console.log('connexion DB ok!'))
    .catch(err => console.log('connexion failed ! ', err));

// app.use() permet d'attribuer un middleware à une route spécifique (ou toutes si non précisé en argument)

// intercepter tous les content type json -> permet d'accéder au body des requêtes 
app.use(express.json());

// ajouter les Origin, Headers et Méthodes autorisées pour CORS
// 1er middleware -> Appliqué sur toutes les routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


// Signin - cet endpoint récupère uniquement les requêtes post avec app.post
app.post('/api/auth/login', (req, res, next) => {
    // créer un instance du modèle user
    const user = new User({
        email: req.body.email,
        password: req.body.password
    });

    // résoudre la requête
    res.status(201).json({
        message: 'Login recieved !'
    });
});


// ajouter un livre en bdd
app.post('/api/books', (req, res) => {
    console.log(req.body);

    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        imageUrl: req.body.imageUrl,
        year: req.body.year,
        genre: req.body.genre,
    });

    // ! version simplifié par le "Spread Operator" -> fait une copie de tous les éléments de req.body
    // const book = new Book({
    //     ...req.body
    // });

    // méthode save() pour enregistrer en base de données
    book.save()
        .then(() => res.status(201).json({ message: 'livre enregistré !' }))
        .catch(error => res.status(400).json({ error }));
});

// app.get pour capturer uniquement les requêtes en méthode GET
app.get('/api/books', (req, res) => {

    // Méthode find fournie par le modèle pour requêter la base (avec des paramètres il est possible d'affiner la requête)
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
});


// app.get pour capturer uniquement les requêtes en méthode GET
app.get('/api/books/:id', (req, res) => {

    // Méthode findOne sur la paramètre id de la request 
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(400).json({ error }));
});


// app.delete pour supprimer un item en base de données
app.delete('/api/books/:id', (req, res) => {

    //  Méthode deleteOne pour cibler le avec l'id
    Book.deleteOne({ _id: req.params.id })
        .then(book => res.status(200).json({ message: 'livre supprimé !' }))
        .catch(error => res.status(400).json({ error }))
});


module.exports = app;