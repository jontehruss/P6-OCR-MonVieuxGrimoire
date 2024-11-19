const mongoose = require('mongoose');

// gestion de l'unicité de l'email
const uniqueValidator = require('mongoose-unique-validator');

// La méthode Schema permets de créer un schéma de données pour  MongoDB
const userSchema = mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true
    },
    password: {
        type: String, 
        required: true
    }
});

// utiliser le uniqueValidator comme plugin appliqué au Schema
userSchema.plugin(uniqueValidator);

// La méthode model transforme rends le modèle utilisable
module.exports = mongoose.model('user', userSchema);