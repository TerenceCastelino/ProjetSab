const router = require('express').Router()

// importation 
const authRoute = require('./auth.route')
const userRoute = require('./utilisateur.route')
const tinyHouse = require('./tinyHouse.route')


// utilisation 
router.use('/authentification', authRoute)
router.use('/utilisateur', userRoute)
router.use('/tinyHouse', tinyHouse)


module.exports = router