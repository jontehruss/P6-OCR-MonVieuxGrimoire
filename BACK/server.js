// Node utilise le système de module CommonJS -> require plutôt que import

// module http pour agir en tant que serveur http
const http = require('http');

// importer l'app express qui gère les requêtes avec les clients
const app = require('./app');

// définir le port d'écoute
const port = process.env.PORT;
app.set('port', port);


//  fonction pour rechercher et gèrer les différentes erreurs
const errorHandler = error => {
    //  si l'erreur n'est pas sur le listner, envoie de l'erreur
    if (error.syscall !== 'listner') {
        throw error;
    };

    // récupérer les informations à propos de la connexion au serveur
    const address = server.address();

    // si address est de type string ->renvoie 'pipe ' + address
    // sinon -> renvoie 'port: ' + port
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;

    // cas d'erreurs courrants
    switch (error.code) {
        case 'EACCES':
            console.error(bind + 'nécéssite des privilèges élevés !');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' déjà en cours d\'utilisation');
            process.exit(1);
            break;
        default:
            throw error;
    };

};

// initialisation du serveur http
const server = http.createServer(app);

// méthode pour démarrer le serveur avec la gestion d'erreurs
server.on('error', errorHandler);

// méthode pour démarer le serveur selon les paramètres définis
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Express server online, listening on : ' + bind);
});

// méthode pour mettre le serveur en écoute sur le port défini
server.listen(port);