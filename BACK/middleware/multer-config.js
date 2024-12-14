// package pour gérer les fichiers
const multer = require('multer');

// dictionnaire utilisé pour créer l'extension du nom de fichier en se basant sur le MimeType
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
};


// ! compmresser l'image ici 

// définir le point de stockage et le nom du fichier
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
        // console.log(req)
    },
    filename: (req, file, callback) => {

        // propriété orignal name de file pour récupérer le nom du fichier.
        // méthode replace pour retirer les carractères spéciaux

        // console.log(file.originalname)


        const name = file.originalname.split('.'); // isoler l'extension à la fin d'un tableau
        name.pop() // supprimer la dernière entrée du tableau
            .toString() // retransformer en chaine de carractères
            .replace(/[^\w-]/g, '_') // méthode replace pour retirer les carractères spéciaux
            .split(' ') // méthode split pour retirer les espaces 
            .map(name => name.toLocaleLowerCase()) // map pour passer en lowercase
            .join('_'); // remplacer les espaces par _

        // avec le mime/type -> création de l'extension
        const extension = MIME_TYPES[file.mimetype];

        // contrôler le mime type
        if (!extension) {
            return callback(new Error('Mime Type non autorisé'), false);
        };

        const fileName = callback(null, name + Date.now() + '.' + extension);

        return fileName;


    }
});

// export de la conf avec la méthode multer en passant le paramètre storage qui contient la config
// la méthode single pour indiquer qu'on ne traite qu'un seul fichier (pas un groupe) et qu'il s'agit d'images
module.exports = multer({ storage }).single('image');
