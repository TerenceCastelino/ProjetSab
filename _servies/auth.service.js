const UtilisateurDTO = require('../_dtos/utilisateur.dto');

const db = require('../_models/db.model');
const jwt = require('jsonwebtoken');

const authService = {
    insertUser: async (data) => {
        try {
            const user = await db.Utilisateur.create(data);
            return new UtilisateurDTO(user);
        } catch (error) {
            throw error;
        }
    },

}

module.exports = authService