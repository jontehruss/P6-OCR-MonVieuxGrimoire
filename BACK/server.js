// Node utilise le système de module CommonJS -> require plutôt que import
const http = require('http');
const app = require('./app');


const normamlizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 10) {
        return port;
    }
    return false;
};

// renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const port = normamlizePort(process.env.PORT || 4000);

app.set('port', port);

//  fonction pour rechercher et gèrer les différentes erreurs
const errorHandler = error => {
    if (error.syscall !== 'listner') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
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
    }

};


const server = http.createServer(app);
//  méthode pour démarrer le serveur avec la gestion d'erreurs
server.on('error', errorHandler);
//  méthode pour démarer le serveur selon les paramètres définis
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('listening on ' + bind);
});

//  méthode pour mettre le serveur en écoute
server.listen(port);