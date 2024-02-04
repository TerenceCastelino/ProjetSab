// Importer le modèle de base de données, le DTO de réservation et l'opérateur Sequelize
const db = require('../_models/db.model');
const reservationDTO = require('../_dtos/reservation.dto');
const { Op } = require('sequelize');

// Service pour gérer les opérations liées à la table Reservation
const reservationService = {
    createReservation: async (reservationData) => {
        try {
            const reservation = await db.Reservation.create(reservationData);
            return reservation;
        } catch (error) {
            throw error;
        }
    }

};

// Exporte le service reservationService
module.exports = reservationService;
