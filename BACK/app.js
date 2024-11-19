const express = require('express');

// package pour interragir avec mongo
const mongoose = require('mongoose');

//  Variables d'environnement
require('dotenv').config();

// importer les routes
const bookRoutes = require('./routes/books.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

// ajouter les Origin, Headers et Méthodes autorisées pour CORS
// 1er middleware -> Appliqué sur toutes les routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// app.use() permet d'attribuer un middleware à une route spécifique (ou toutes si non précisé en argument)
// intercepter tous les content type json -> permet d'accéder au body des requêtes 'req.body...'
app.use(express.json());

// connexion à la base de données 
mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: process.env.DB_NAME,
    })
    .then(() => console.log('connexion DB ok!'))
    .catch(err => console.log('connexion failed ! ', err));

// Utiliser le router bookRoutes pour toutes les routes /api/books
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;