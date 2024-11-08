const express = require('express');

const app = express();

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

// Signin 
app.post('/api/auth/login', (req, res, next) => {
    var credentials = (req.body)
    console.log(credentials);

    res.status(201).json({
        message : 'Login recieved !'
    });
    
});





module.exports = app;