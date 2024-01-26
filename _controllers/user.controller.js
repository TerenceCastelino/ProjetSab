const userValidator = require('../_validators/utilisateur.validator')
const userService = require('../_servies/utilisateur.service')

const userController = {
    getOne: async (req, res) => {
        try {
            const idUtilisateur = req.params.idUtilisateur;

            const user = await userService.getOne(idUtilisateur)
            console.log(user);

            res.status(200).json(user)

        } catch (err) {
            console.error(err);
        }
    },
    delete: async (req, res) => {
        try {
            const { idUtilisateur } = req.params;
            const isDeleted = await userService.deleteUser(idUtilisateur);

            if (isDeleted) {
                res.sendStatus(204);
                return;
            }

            res.sendStatus(404);
        } catch (error) {
            console.error('Erreur lors de la suppression d\'un utilisateur :', error);
            res.status(400).json({ error: 'Erreur lors de la suppression' });
        }
    },

}

module.exports = userController
