// import d'express pour créer l'application
const express = require('express');

const path = require('path');

//  Variables d'environnement
require('dotenv').config();

// package pour interragir avec mongo
const mongoose = require('mongoose');

// connexion à la base de données 
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DB_NAME,
})
.then(() => console.log('Database online'))
.catch(err => console.log('Database offline, connection failed ! ', err));

// initialiser l'app express
const app = express();

// app.use() permet d'attribuer un middleware à une route spécifique (ou toutes si non précisé en argument)
// ajouter les Origin, Headers et Méthodes autorisées pour CORS
// 1er middleware -> Appliqué sur toutes les routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// intercepter tous les content type json -> permet d'accéder au body des requêtes 'req.body...'
app.use(express.json());

// importer les routes
const bookRoutes = require('./routes/books.routes');
const userRoutes = require('./routes/user.routes');

// Utiliser le router bookRoutes pour toutes les routes /api/books
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

// route pour servir les fichiers contenus dans le dossier images
app.use('/images', express.static(path.join(__dirname, 'images')));

// exposer l'app
module.exports = app;