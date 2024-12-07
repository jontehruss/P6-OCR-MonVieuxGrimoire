// package pour gérer les fichiers
const multer = require('multer');

// dictionnaire utilisé pour créer l'extension du nom de fichier en se basant sur le MimeType
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// définir le point de stockage et le nom du fichier
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        // propriété orignal name de file pour récupérer le nom du fichier.
        // méthodes split et join pour retirer les espaces 
        const name = file.originalname.split(' ').join('_');

        // avec le mime/type -> création de l'extension
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

// export de la conf avec la méthode multer en passant le paramètre storage qui contient la config
// la méthode single pour indiquer qu'on ne traite qu'un seul fichier (pas un groupe) et qu'il s'agit d'images
module.exports = multer({ storage }).single('image');