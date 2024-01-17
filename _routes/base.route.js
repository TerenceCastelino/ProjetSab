const router = require('express').Router()

// importation 
const authRoute = require('./auth.route')
const userRoute = require('./utilisateur.route')


// utilisation 
router.use('/authentification', authRoute)
router.use('/utilisateur', userRoute)


module.exports = router