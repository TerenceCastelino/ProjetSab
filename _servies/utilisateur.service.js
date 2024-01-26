const UtilisateurDTO = require('../_dtos/utilisateur.dto');
const db = require('../_models/db.model');

const userService = {
    // Récupère un utilisateur par son ID
    getOne: async (idUtilisateur) => {
        // Assurez-vous que idUtilisateur est un nombre valide
        idUtilisateur = parseInt(idUtilisateur);

        if (isNaN(idUtilisateur)) {
            // Si idUtilisateur n'est pas un nombre valide, vous pouvez gérer l'erreur ici
            console.error("Erreur : idUtilisateur n'est pas un nombre valide.");
            return null; // Ou vous pouvez retourner une autre valeur appropriée
        }

        const user = await db.Utilisateur.findOne({
            where: { idUtilisateur }
        });

        return new UtilisateurDTO(user);
    },
    updateUser: async (idUtilisateur, data) => {
        try {
            const user = await db.Utilisateur.findOne({
                where: { idUtilisateur },
            });

            if (!user) {
                throw new Error('Utilisateur non trouvé');
            }

            await user.update(data);

            return new UtilisateurDTO(user);//dto specifique qui empeche la modification du mots de passe
        } catch (error) {//cree validator
            throw error;
        }
    },
    deleteUser: async (idUtilisateur) => {
        try {
            const user = await db.Utilisateur.findOne({
                where: { idUtilisateur },
            });

            if (!user) {
                throw new Error('Utilisateur non trouvé');
            }

            await user.destroy();

            return 'Utilisateur supprimé avec succès';
        } catch (error) {
            throw error;
        }
    },
    methodeConfirmationHash: async (confirmationHash) => {

        const user = await db.Utilisateur.findOne({
            where: { confirmationHash }
        });

        return new UtilisateurDTO(user);
    },
}

module.exports = userService