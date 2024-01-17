const userRouter = require('express').Router()
const userController = require('../_controllers/user.controller')

userRouter.route('/:idUtilisateur')
    .get(userController.getOne)
    .delete(userController.delete)


module.exports = userRouter

