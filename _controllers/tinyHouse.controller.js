const tinyHouseService = require('../_servies/tinyHouse.service')
const tinyValidator = require('../_validators/tinyHouse.validator')

const tinyHouseController = {
    getOne: async (req, res) => {
        try {
            const idTinyHouse = req.params.idTinyHouse;

            const tiny = await tinyHouseService.getOneTiny(idTinyHouse);

            if (!tiny) {
                res.status(404).json({ error: 'TinyHouse non trouvée' });
                return;
            }

            res.status(200).json(tiny);

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur serveur lors de la récupération de la TinyHouse' });
        }
    },
    delete: async (req, res) => {
        try {
            const { idTinyHouse } = req.params;
            const isDeleted = await tinyHouseService.deleteTiny(idTinyHouse);

            if (isDeleted) {
                res.sendStatus(204);
                return;
            }

            res.status(404).json({ error: 'TinyHouse non trouvée' });
        } catch (error) {
            console.error('Erreur lors de la suppression d\'une TinyHouse :', error);
            res.status(500).json({ error: 'Erreur serveur lors de la suppression de la TinyHouse' });
        }
    },
    registerTiny: async (req, res) => {

        const tinyData = req.body;
        const validatedData = await tinyValidator.validate(tinyData);
        const {
            // idTinyHouse,
            adresse,
            model
        } = validatedData;

        const tinyInserted = await tinyHouseService.creatTinyHouse({
            // idTinyHouse,
            adresse,
            model
        });

        if (tinyInserted) {
            res.status(201).json(tinyInserted);
        } else {
            res.status(500).json({ error: 'Erreur serveur lors de la création de la TinyHouse' });
        }
    },
    getAllHouse: async (req, res) => {
        try {
            // Appeler la méthode allUser du service utilisateur
            const tinys = await tinyHouseService.getAllTiny();

            // Retourner les emails des utilisateurs en tant que réponse
            res.status(200).json(tinys);
        } catch (error) {
            console.error('Erreur lors de la récupération des tinyHouse:', error);
            res.status(500).json({ error: 'Erreur de service' });
        }

    },
    updateTinyHouse: async (req, res) => {
        try {
            const { idTinyHouse } = req.params;
            const data = req.body;
            const tiny = await tinyHouseService.getOneTiny(idTinyHouse)
            // Validation des données
            const validateData = await tinyValidator.validate(data);

            // Mise à jour de la tiny house
            const tinyPatch = await tinyHouseService.updatetiny(parseInt(idTinyHouse), validateData);

            // Envoi de la réponse réussie
            res.status(200).json(tinyPatch);
        } catch (error) {
            console.error(error);

            if (error instanceof ValidationError) {
                // Gestion des erreurs de validation
                res.status(400).json({ error: 'Erreur de validation', details: error.message });
            } else if (error instanceof NotFoundError) {
                // Gestion des erreurs liées à l'absence de données
                res.status(404).json({ error: 'Tiny house non trouvée', details: error.message });
            } else {
                // Gestion des autres erreurs (erreurs de service)
                res.status(500).json({ error: 'Erreur de service', details: error.message });
            }
        }
    }

};

module.exports = tinyHouseController;


module.exports = tinyHouseController