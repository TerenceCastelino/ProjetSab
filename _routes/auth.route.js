const authRouter = require('express').Router()
const authController = require('../_controllers/auth.controller')

authRouter.route('/register')
    .post(authController.register)
    .all((req, res) => {
        res.sendStatus(405); // Pour tout autre verbe HTTP, renvoyer une erreur (Méthode non autorisée)
    });

// localhost:3000/api/authentification/login
authRouter.route('/login')
    .post(authController.login)
    .all((req, res) => {
        res.sendStatus(405); // Pour tout autre verbe HTTP, renvoyer une erreur (Méthode non autorisée)
    });

authRouter.route('/envoisMail/:emailUtilisateur')
    .post(authController.envoisMail)
    .all((req, res) => {
        res.sendStatus(405); // Pour tout autre verbe HTTP, renvoyer une erreur (Méthode non autorisée)
    });

authRouter.route('/confirmation-email/:confirmationHash')
    .put(authController.confimationEmail)
    .all((req, res) => {
        res.sendStatus(405); // Pour tout autre verbe HTTP, renvoyer une erreur (Méthode non autorisée)
    });
//1071388ter
authRouter.route('/resetPassword')
    .put(authController.loginPerdu)
    .all((req, res) => {
        res.sendStatus(405); // Pour tout autre verbe HTTP, renvoyer une erreur (Méthode non autorisée)
    });

module.exports = authRouter