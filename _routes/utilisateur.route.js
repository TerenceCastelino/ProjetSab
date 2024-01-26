const userRouter = require('express').Router()
const userController = require('../_controllers/user.controller')
const middlewareToken = require('../_guard/middlewareToken')

userRouter.route('/:idUtilisateur')
    .get(middlewareToken.checkTokenMiddleware, userController.getOne)
    .delete(userController.delete)


module.exports = userRouter

