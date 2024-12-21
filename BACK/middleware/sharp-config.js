const sharp = require('sharp');
const fs = require('fs');

module.exports = (req, res, next) => {

    // condition pour vérifier s'il y a une image dans la requête
    if ('file' in req) {

        const filePath = req.file.path;

        const fileExtension = filePath.split('.').pop().toLowerCase();

        const outputFilePath = filePath.replace(/\.(png|jpg|jpeg|gif|svg)$/, '.webp');

        // passer le chemin du file en paramètre            
        convertToWebp(filePath, outputFilePath);

        // Fonction pour convertir un fichier image en WebP
        async function convertToWebp(filePath, outputFilePath) {

            try {
                await sharp(filePath)
                    .resize({ height: 650 })
                    .toFormat('webp')
                    .webp({ quality: 80 })
                    .toFile(outputFilePath);

                // remplacer le nom du fichier pour l'enregistrement en bdd
                req.file.pathWebp = outputFilePath;

                // supprimer le fichier original avec fs.unlink
                try {

                    await fs.unlink(filePath, (err) => {
                        if (err) throw err;
                    });

                } catch (err) {
                    console.error('Erreur de suppression du fichier', err);
                    return res.status(500).json({ error: 'Erreur de suppression du fichier' });
                };


            } catch (err) {
                console.error(`Erreur lors de la conversion de ${filePath}:`, err);
                res.status(500).json({ message: 'erreur de conversion' })
                return next(err);
            };

            next();

        }
    } else {
        // passer à l'étape suivante directement si pas d'image
        next();
    };
};