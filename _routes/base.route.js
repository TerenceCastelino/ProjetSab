const router = require('express').Router()

// importation 
const authRoute = require('./auth.route')
const userRoute = require('./utilisateur.route')
const tinyHouseRoute = require('./tinyHouse.route')
const imageRoute = require('./image.route')
const reservationRoute = require('./reservation.route')


// utilisation 
router.use('/authentification', authRoute)
router.use('/utilisateur', userRoute)
router.use('/tinyHouse', tinyHouseRoute)
router.use('/image', imageRoute)
router.use('/reservation', reservationRoute)


module.exports = router