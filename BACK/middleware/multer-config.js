// package pour gérer les fichiers
const multer = require('multer');

// dictionnaire utilisé pour créer l'extension du nom de fichier en se basant sur le MimeType
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg'
};

// définir le point de stockage et le nom du fichier
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {

        // propriété orignal name de file pour récupérer le nom du fichier.
        // méthode replace pour retirer les carractères spéciaux
        let name = file.originalname.split('.'); // isoler l'extension à la fin d'un tableau

        // Supprimer la dernière entrée du tableau et obtenir les éléments restants
        const nameNoExtension = name.slice(0, -1).join('.');

        // Méthode replace pour retirer les caractères spéciaux et espaces
        const nameClean = nameNoExtension.replace(/[^\w-]/g, '_');

        // avec le mime/type -> création de l'extension
        const extension = MIME_TYPES[file.mimetype];

        // contrôler le mime type
        if (!extension) {
            return callback(new Error('Mime Type non autorisé'), false);
        };

        // appel de la fonction de retour avec les paramètres définis pour enregistrer le fichier
        callback(null, nameClean + Date.now() + '.' + extension,
        );
    }
});


// export de la conf avec la méthode multer en passant le paramètre storage qui contient la config
// la méthode single pour indiquer qu'on ne traite qu'un seul fichier (pas un groupe) et qu'il s'agit d'images
module.exports = multer({ storage }).single('image');
