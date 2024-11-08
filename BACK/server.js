// Node utilise le système de module CommonJS -> require plutôt que import
const http = require('http');

const server = http.createServer((req , res) => {
    res.end('helloWorld!')
    // console.log(http)
});


//! variable "process.env.PORT" - voir pour définir variables d'environnement
server.listen(process.env.PORT || 3001);