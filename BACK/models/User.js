const mongoose = require('mongoose');


// La méthode Schema permets de créer un schéma de données pour  MongoDB
const userSchema = mongoose.Schema({
    email: { type: String},
    password: {type: String}
});

// La méthode model transforme rends le modèle utilisable
module.exports = mongoose.model('user', userSchema);