const router = require('express').Router()

// importation 
const authRoute = require('./auth.route')


// utilisation 
router.use('/authentification', authRoute)


module.exports = router