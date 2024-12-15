const sharp = require('sharp');

module.exports = (req, res, next) => {


    // passer le chemin du file en paramètre
    convertToWebp(req.file.path);

    // Fonction pour convertir un fichier image en WebP
    function convertToWebp(filePath) {
        const outputFilePath = filePath.replace(/\.(png|jpg|jpeg|gif)$/, '.webp');

        try {
            sharp(filePath)
                .toFormat('webp')
                .toFile(outputFilePath);
            console.log(`Image convertie avec succès: ${outputFilePath}`);

            // ! remplacer le nom du fichier pour l'enregistrement en bdd
            req.file.path = outputFilePath;


            // ! supprimer le fichier original avec fs.unlink
            try {

            } catch (err) {

            }


        } catch (err) {
            console.error(`Erreur lors de la conversion de ${filePath}:`, err);
            // res.status(500).json({ message : 'erreur de conversion'})
            return next(err);
        }

        console.log('ici')
        next();

    }

}


