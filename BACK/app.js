const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');



//  importer les modèles de données
const User = require('./models/User');
const Book = require('./models/Book');

const app = express();

// connexion à la base de données 
// mongodb://<username>:<password>@localhost:27017/<database>
// russeaujohann 36H1Bi2w6exAl5Zg
mongoose.connect( process.env.CONNECTIONSTRING ,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'mvgdb',
    }
)
    .then(() => console.log('connexion DB ok!'))
    .catch(err => console.log('connexion failed ! ', err));


// intercepter tous les content type json -> permet d'accéder au body des requêtes 
app.use(express.json());

// ajouter les Origin, Headers et méthodes autorisées pour CORS
// 1er middleware -> Appliqué sur toutes les routes
app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
})

// app.use() permet d'attribuer un middleware à une route spécifique (ou toutes si non précisé en argument)

// app.get pour capturer uniquement les requêtes en méthode GET
// app.get('/api/books', (req, res, next) => {
//     const books = [
//         {
//             ...res.body
//         }
//     ];
//     res.status(200).json(books);
// });

// Signin - cet endpoint récupère uniquement les requêtes post avec app.post
app.post('/api/auth/login', (req, res, next) => {
    console.log(req.body);

    // créer un instance du modèle user
    const user = new User({
        email: req.body.email,
        password: req.body.password
    });

    console.log(user);

    // résoudre la requête pour que ça ne plante pas !
    //  code 201 pour la création de ressources
    res.status(201).json({
        message: 'Login recieved !'
    });

});

// ajouter un livre en bdd
app.post('/api/books', (req, res, next) => {
    console.log(req.body);

    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        imageUrl: req.body.imageUrl,
        year: req.body.year,
        genre: req.body.genre,
    });


    // méthode save pour enregistrer en base de données
    book.save()
        .then(() => res(201).json({ message: 'livre enregistré !' }))
        .catch(error => res.status(400).json({ error }));

    next();

});





module.exports = app;