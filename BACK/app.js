const express = require('express');
const mongoose = require('mongoose');

const app = express();

// connexion à la base de données 
// mongodb://<username>:<password>@localhost:27017/<database>
mongoose.connect('mongodb://mvguser:p%40ssw0rd%21@localhost:27017/mvgdb?authSource=mvgdb',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
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
app.get('/api/books', (req, res, next) => {
    const books = [
        {
            _id: '2048',
            title: 'le titre'
        }
    ];
    res.status(200).json(books);
});

// Signin - cet endpoint récupère uniquement les requêtes post avec app.post
app.post('/api/auth/login', (req, res, next) => {
    var credentials = (req.body)
    console.log(credentials);

    // résoudre la requête pour que ça ne plante pas !
    //  code 201 pour la création de ressources
    res.status(201).json({
        message : 'Login recieved !'
    });
    
});





module.exports = app;