const { diskStorage } = require('multer')
const multer = require('multer')
const path = require('path')
const contenuService = require('../_servies/image.service')


const storage = diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        // Utilisez path.extname pour obtenir l'extension du fichier
        const extension = path.extname(file.originalname);
        // Générez un nom de fichier unique en utilisant l'extension
        const uniqueFileName = `${Date.now()}${extension}`;
        // Appelez le callback avec le nom de fichier unique
        cb(null, uniqueFileName);
    },
});
const upload = multer({ storage: storage })

const imageController = {

    addContenu: async (req, res) => {
        try {
            // const { idTinyHouse } = req.params;//! on ne va plus recup id mais plustot le model
            const contenuData = req.body;
            // const validateData = await contenuValidator.validate(contenuData);

            const { nomImage, model } = contenuData;

            // Le chemin du fichier téléchargé sera stocké dans req.file.path
            const chemin = req.file.filename;
            console.log(req.file.filename);

            const contenuInsert = await contenuService.insertContenu({
                chemin,
                nomImage,
                model
            },
                // idTinyHouse
            );

            if (contenuInsert) {
                res.status(201).json(contenuInsert);
            } else {
                res.status(400).json({ error: 'Erreur lors de l\'insertion du contenu' });
            }
        } catch (error) {
            console.error('Erreur lors de l\'insertion du contenu', error);
            res.status(400).json({ error: 'Erreur lors de l\'insertion du contenu' });
        }
    },

    delete: async (req, res) => {
        try {
            const { model } = req.body;
            const { idContenu } = req.params;
            const isDeleted = await contenuService.deleteContenu(idContenu, model);

            if (isDeleted) {
                res.sendStatus(204);
                return;
            }

            res.sendStatus(404);
        } catch (error) {
            console.error('Erreur lors de la suppression d\'un utilisateur :', error);
            res.status(400).json({ error: 'Erreur lors de la suppression' });
        }
    },
    getOneContenuModel1: async (req, res) => {
        try {
            const model = 'model1';
            const { idContenu } = req.params;

            if (isNaN(parseInt(idContenu))) {
                res.sendStatus(400);
                return;
            }

            const contenuData = await contenuService.oneContenuForTiny(model, idContenu);

            if (!contenuData) {
                res.sendStatus(404);
                return;
            }

            res.status(200).json(contenuData);
        } catch (error) {
            console.error('Erreur lors de la récupération des informations sur l\'image:', error);
            res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des informations sur l\'image' });
        }
    },

    getOneContenuModel2: async (req, res) => {
        try {
            // const { model } = req.body;
            const model = 'model2'
            const { idContenu } = req.params;

            if (isNaN(idContenu)) {
                // Si l'un des paramètres n'est pas un nombre valide, renvoyer une réponse 400 (Mauvaise demande)
                res.sendStatus(400);
                return;
            }//log section a des image chris

            // Appelez votre service pour obtenir les informations sur l'image
            const contenuData = await contenuService.oneContenuForTiny(model, idContenu);

            if (!contenuData) {
                // Si aucune donnée n'a été trouvée (contenuData est falsy), renvoyer une réponse 404 (Non trouvé)
                res.sendStatus(404);
                return;
            }

            // Si tout s'est bien passé, renvoyer les données de l'image dans la réponse
            res.status(200).json(contenuData);
        } catch (error) {
            // En cas d'erreur, attrapez-la ici et renvoyez une réponse d'erreur appropriée
            console.error('Erreur lors de la récupération des informations sur l\'image:', error);
            res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des informations sur l\'image' });
        }
    },
    getAllImageModel1: async (req, res) => {
        try {
            // const { model } = req.body
            const model = 'model1'
            const images = await contenuService.allImageContenusForTinyModel(model)
            res.status(200).json(images)


        } catch (error) {
            console.error(error);
        }
    },
    getAllImageModel2: async (req, res) => {
        try {
            // const { model } = req.body
            const model = 'model2'
            const images = await contenuService.allImageContenusForTinyModel(model)
            res.status(200).json(images)


        } catch (error) {
            console.error(error);
        }
    },
    // getAllVideo: async (req, res) => {
    //     try {
    //         const { id } = req.params
    //         const images = await contenuService.allVideoContenusForUser(id)
    //         res.status(200).json(images)


    //     } catch (error) {

    //     }
    // },

};

const uploadMiddelware = upload.single('contenu')

module.exports = { imageController, uploadMiddelware }