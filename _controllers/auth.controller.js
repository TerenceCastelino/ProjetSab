const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authService = require('../_servies/auth.service')
const authValidator = require('../_validators/utilisateur.validator');

const authController = {

    register: async (req, res) => {

        const authData = req.body;
        const validatedData = await authValidator.validate(authData);
        const {
            idUtilisateur,
            nom,
            prenom,
            role,
            telephone,
            gsm,
            emailUtilisateur,
            motsDePasse,
            emailConfirme,
            profilActive
        } = validatedData;

        const hashedPassword = bcrypt.hashSync(motsDePasse, 10);

        const authInserted = await authService.insertUser({
            idUtilisateur,
            nom,
            prenom,
            role,
            telephone,
            gsm,
            emailUtilisateur,
            hashedPassword,
            emailConfirme: false,
            profilActive: false,
        });

        if (authInserted) {
            res
                .status(201)
                // On redirige les informations utilisateur sur la route login (ne pas oublier de gérer la redirection dans le front)
                // .location(`api/utilisateur/login`)
                .json(authInserted)
        }
    },

}

module.exports = authController