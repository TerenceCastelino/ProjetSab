const tinyHouseRouter = require('express').Router()
const tinyHouseController = require('../_controllers/tinyHouse.controller')

tinyHouseRouter.route('')
    .post(tinyHouseController.registerTiny)
    .get(tinyHouseController.getAllHouse)
    .all((req, res) => {
        res.sendStatus(405); // Pour tout autre verbe HTTP, renvoyer une erreur (Méthode non autorisée)
    });
tinyHouseRouter.route('/:idTinyHouse')
    .get(tinyHouseController.getOne)
    .delete(tinyHouseController.delete)
    .patch(tinyHouseController.updateTinyHouse)
    .all((req, res) => {
        res.sendStatus(405); // Pour tout autre verbe HTTP, renvoyer une erreur (Méthode non autorisée)
    });



module.exports = tinyHouseRouter