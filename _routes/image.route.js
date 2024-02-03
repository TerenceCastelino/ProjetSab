const imageRouter = require('express').Router()
const { imageController, uploadMiddelware } = require('../_controllers/image.controller')

imageRouter.route('/')
    .post(uploadMiddelware, imageController.addContenu)
    .all((req, res) => {
        res.sendStatus(405); // Pour tout autre verbe HTTP, renvoyer une erreur (Méthode non autorisée)
    });
imageRouter.route('/model1')
    .get(imageController.getAllImageModel1)
    .all((req, res) => {
        res.sendStatus(405); // Pour tout autre verbe HTTP, renvoyer une erreur (Méthode non autorisée)
    });
imageRouter.route('/model1/idContenu/:idContenu')
    .get(imageController.getOneContenuModel1)
    .all((req, res) => {
        res.sendStatus(405);
    });
imageRouter.route('/model2')
    .get(imageController.getAllImageModel2)
    .all((req, res) => {
        res.sendStatus(405); // Pour tout autre verbe HTTP, renvoyer une erreur (Méthode non autorisée)
    });

imageRouter.route('/idContenu/:idContenu')
    .delete(imageController.delete)
    .all((req, res) => {
        res.sendStatus(405); // Pour tout autre verbe HTTP, renvoyer une erreur (Méthode non autorisée)
    });

imageRouter.route('/model2/idContenu/:idContenu')
    .get(imageController.getOneContenuModel2)
    .all((req, res) => {
        res.sendStatus(405); // Pour tout autre verbe HTTP, renvoyer une erreur (Méthode non autorisée)
    });

module.exports = imageRouter

