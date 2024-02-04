const reservationRouter = require('express').Router();
const reservationController = require('../_controllers/reservation.controller');

reservationRouter.route('/')
    .get(reservationController.preReservation)
    .all((req, res) => {
        res.sendStatus(405);
    });

module.exports = reservationRouter;
