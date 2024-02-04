// Importer le modèle de base de données et l'opérateur Sequelize
const db = require('../_models/db.model');
const { Op } = require('sequelize');

// Service pour gérer les opérations liées à la table jourReserver
const jourReserverService = {
    getJourReserverByTinyHouseId: async (idTinyHouse) => {
        try {
            const jourReservers = await db.JourReserver.findAll({
                where: {
                    idTinyHouse: idTinyHouse,
                },
            });

            return jourReservers;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des jourReservers : ' + error.message);
        }
    },
    createJourReserver: async (idReservation, idTinyhouse, dateReserver, jourUnix) => {
        try {
            const jourReserver = await db.JourReserver.create({
                idReservation,
                idTinyHouse: idTinyhouse,
                dateReserver,
                jourUnix,
            });

            return jourReserver;
        } catch (error) {
            throw error;
        }

    }
}

// Exporte le service jourReserverService
module.exports = jourReserverService;
