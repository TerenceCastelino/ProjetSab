const authRouter = require('express').Router()
const authController = require('../_controllers/auth.controller')

authRouter.route('/register')
    .post(authController.register)
    .all((req, res) => {
        res.sendStatus(405); // Pour tout autre verbe HTTP, renvoyer une erreur (Méthode non autorisée)
    });

module.exports = authRouter