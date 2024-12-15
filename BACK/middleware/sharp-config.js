const sharp = require('sharp');
const fs = require('fs');

module.exports = (req, res, next) => {


    // passer le chemin du file en paramètre
    convertToWebp(req.file.path);

    // Fonction pour convertir un fichier image en WebP
    async function convertToWebp(filePath) {
        const outputFilePath = filePath.replace(/\.(png|jpg|jpeg|gif)$/, '.webp');

        try {
            await sharp(filePath)
                .toFormat('webp')
                .toFile(outputFilePath);
            // console.log(`Image convertie avec succès: ${outputFilePath}`);

            // remplacer le nom du fichier pour l'enregistrement en bdd
            // console.log('req.file.path',req.file.path)
            
            req.file.pathWebp = outputFilePath;

            // console.log('req.file.pathWebp', req.file.pathWebp)

            // ! supprimer le fichier original avec fs.unlink
            try {
                // console.log(filePath)

                await fs.unlink(filePath, (err) => {
                    if (err) throw err;
                    // console.log(filePath, ' a été supprimé !');
                    
                  });

            } catch (err) {
                console.error('Erreur de suppression du fichier', err);
                return res.status(500).json({ error: 'Erreur de suppression du fichier' });
            }


        } catch (err) {
            console.error(`Erreur lors de la conversion de ${filePath}:`, err);
            // res.status(500).json({ message : 'erreur de conversion'})
            return next(err);
        }

        // console.log('ici')
        next();

    }

}


