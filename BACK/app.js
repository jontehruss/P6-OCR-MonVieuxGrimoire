const express = require('express');
const app = express();

// importer les routes
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/user');

// package pour interragir avec mongo
const mongoose = require('mongoose');

// body parser pour exploiter les données transmises en json
const bodyParser = require('body-parser');

//  importer les modèles de données 
const User = require('./models/User');

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

// rendre exploitable les datas en json
app.use(bodyParser.json());

// Utiliser le router bookRoutes pour toutes les routes /api/books
app.use('/api/books', bookRoutes);

app.use('/api/auth', userRoutes);


module.exports = app;