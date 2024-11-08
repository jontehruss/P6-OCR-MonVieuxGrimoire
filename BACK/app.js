const express = require ('express');

const app = express();

app.use((req, res, next) => {
    console.log('helloWorld !');
    next();
});


app.use((req, res, next) => {
    res.status(201);
    next();
});


app.use((req, res, next)=>{
    res.json({ message: 'requête bien reçue'});
    next();
});


app.use((req, res) => {
    console.log('réponse envoyée avec succès !')
});


module.exports = app;