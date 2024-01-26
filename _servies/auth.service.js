const UtilisateurDTO = require('../_dtos/utilisateur.dto');

const db = require('../_models/db.model');
const jwt = require('jsonwebtoken');

const authService = {
    //propre au register
    insertUser: async (data) => {
        try {
            const user = await db.Utilisateur.create(data);
            return new UtilisateurDTO(user);
        } catch (error) {
            throw error;
        }
    },
    //propre au login

    // Vérifie l'existence d'un utilisateur par son email
    exist: async (emailUtilisateur) => {
        const user = await db.Utilisateur.findOne({
            where: { emailUtilisateur }
        });
        return new UtilisateurDTO(user);
    },

    // Associe un jeton JWT à un utilisateur
    addJwt: async (jwt, id) => {
        // Vérification de l'existence de l'utilisateur
        const userFound = await db.Utilisateur.findOne({
            where: { idUtilisateur: id }
        });
        // S'il existe, lui attribue un jeton JWT (s'il n'en a pas déjà)
        await userFound.update({ jwt });
        return userFound;
    },
    // Vérifie la validité d'un jeton JWT
    verifyJwt: async (token) => {
        const secret = process.env.JWT_SECRET;
        try {
            return !!jwt.verify(token, secret);
        } catch (err) {
            return false;
        }
    },


}




module.exports = authService