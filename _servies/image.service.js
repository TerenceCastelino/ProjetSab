const db = require('../_models/db.model')
const fs = require('fs')
const ImageDTO = require('../_dtos/image.dto')

const { Op } = require('sequelize');




const contenuService = {
    //ok
    insertContenu: async (data) => {
        try {
            // Créez un nouveau contenu associé à l'utilisateur avec l'ID spécifié
            // data.idTinyHouse = idTinyHouse; // Assurez-vous que la clé étrangère idTinyHouse est définie
            const contenu = await db.Image.create(data);
            return new ImageDTO(contenu);
        } catch (error) {
            throw error;
        }
    },
    //ok
    deleteContenu: async (idImage, model) => {
        try {
            // Recherchez le contenu en spécifiant à la fois idContenu et idTinyHouse
            const contenu = await db.Image.findOne({
                where: { idImage, model },
            });

            if (!contenu) {
                throw new Error('Contenu non trouvé pour cet utilisateur');
            }

            // Obtenez le chemin du fichier associé à ce contenu
            const cheminFichier = contenu.chemin;

            await contenu.destroy();

            // Supprimez le fichier du système de fichiers
            fs.unlink(cheminFichier, (err) => {
                if (err) {
                    throw err; // Gérez les erreurs en conséquence
                }
                console.log('Fichier supprimé avec succès');
            });

            return 'Contenu supprimé avec succès';
        } catch (error) {
            throw error;
        }
    },
    //ok
    oneContenuForTiny: async (model, idImage) => {
        try {
            const contenu = await db.Image.findOne({
                where: { idImage, model },
            });

            if (!contenu) {
                throw new Error('Contenu non trouvé pour cet utilisateur');
            }

            return new ImageDTO(contenu);
        } catch (error) {
            throw error;
        }
    },


    //ok
    allImageContenusForTinyModel: async (model) => {
        try {
            const contenus = await db.Image.findAll({
                where: { model }
            });

            return contenus.map((contenu) => new ImageDTO(contenu));
        } catch (error) {
            throw error;
        }
    },
    //ok
    // allVideoContenusForUser: async (idTinyHouse) => {
    //     try {
    //         const contenus = await db.Contenu.findAll({
    //             where: {
    //                 idTinyHouse,
    //                 typeContenu: 'video', // Filtre pour les contenus de type vidéo
    //             },
    //         });

    //         return contenus.map((contenu) => new ImageDTO(contenu));
    //     } catch (error) {
    //         throw error;
    //     }
    // },

}
module.exports = contenuService
