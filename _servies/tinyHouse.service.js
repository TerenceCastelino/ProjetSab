const db = require('../_models/db.model');
const TinyHouseDTO = require('../_dtos/tinyHouse.dto')
const { Op } = require('sequelize');

const tinyHouseService = {

    getOneTiny: async (idTinyHouse) => {
        // Assurez-vous que idTinyHouse est un nombre valide
        idTinyHouse = parseInt(idTinyHouse);

        if (isNaN(idTinyHouse)) {
            // Si idTinyHouse n'est pas un nombre valide, vous pouvez gérer l'erreur ici
            console.error("Erreur : idTinyHouse n'est pas un nombre valide.");
            return null; // Ou vous pouvez retourner une autre valeur appropriée
        }

        const tinyHouse = await db.TinyHouse.findOne({
            where: { idTinyHouse }
        });

        return new TinyHouseDTO(tinyHouse);
    },
    updatetiny: async (idTinyHouse, data) => {
        try {
            const tiny = await db.TinyHouse.findOne({
                where: { idTinyHouse },
            });

            if (!tiny) {
                throw new Error('TinyHouse non trouvé');
            }

            await tiny.update(data);

            return new TinyHouseDTO(tiny);//dto specifique qui empeche la modification du mots de passe
        } catch (error) {//cree validator
            throw error;
        }
    },
    deleteTiny: async (idTinyHouse) => {
        try {
            const tiny = await db.TinyHouse.findOne({
                where: { idTinyHouse },
            });

            if (!tiny) {
                throw new Error('TinyHouse non trouvé');
            }

            await tiny.destroy();

            return 'TinyHouse supprimé avec succès';
        } catch (error) {
            throw error;
        }
    },
    getAllTiny: async () => {
        try {
            const tinyHouses = await db.TinyHouse.findAll({

            });
            return tinyHouses.map(tiny => new TinyHouseDTO(tiny));

        } catch (error) {
            throw error;
        }

    },
    getAllTinyModel: async (model) => {
        try {
            const tinyHouses = await db.TinyHouse.findAll({
                where: { model }
            });
            return tinyHouses.map(tiny => new TinyHouseDTO(tiny));

        } catch (error) {
            throw error;
        }

    },
    creatTinyHouse: async (data) => {
        try {
            const tiny = await db.TinyHouse.create(data);
            return new TinyHouseDTO(tiny);
        } catch (error) {
            throw error;
        }

    },
    //!
    // Fonction pour valider la disponibilité du Tiny House





}

module.exports = tinyHouseService