const bcrypt = require('bcrypt');
const methodeAuth = require('../_Methode/_auth/auth.methode')
const authValidator = require('../_validators/utilisateur.validator');

const authService = require('../_servies/auth.service')
const userService = require('../_servies/utilisateur.service')

const authController = {
    register: async (req, res) => {

        const authData = req.body;
        const validatedData = await authValidator.validate(authData);
        const {
            idUtilisateur,
            nom,
            prenom,
            role,
            telephone,
            gsm,
            emailUtilisateur,
            motsDePasse,
        } = validatedData;

        const hashedPassword = bcrypt.hashSync(motsDePasse, 10);
        confirmationHash = methodeAuth.hashedUrl(validatedData, emailUtilisateur);

        const authInserted = await authService.insertUser({
            idUtilisateur,
            nom,
            prenom,
            role,
            telephone,
            gsm,
            emailUtilisateur,
            hashedPassword,
            confirmationHash
        });
        // cree une methode pour hacher des info et les mettres dans une nouvelle colonne du user avec un timestampe
        methodeAuth.envoisEmailConfirmed(confirmationHash, prenom, nom, emailUtilisateur)

        if (authInserted) {
            res
                .status(201).json(authInserted)
        }
    },
    login: async (req, res) => {
        try {
            const { emailUtilisateur, motsDePasse } = req.body;
            // Vérification de l'existence de l'utilisateur via son login
            const user = await authService.exist(emailUtilisateur);
            if (!user) {
                // Si l'utilisateur n'existe pas, renvoi une réponse 401 (Unauthorized)
                return res.status(401).json({ message: 'Utilisateur non trouvé' })
            }

            const passwordMatch = await bcrypt.compareSync(motsDePasse, user.hashedPassword);
            if (!passwordMatch) {
                // Si les mots de passe ne correspondent pas, renvoi une réponse 401 (Unauthorized)
                return res.status(401).json({ message: 'Mot de passe incorrect' })
            }
            if (passwordMatch) {
                console.log("utilisateur connecter");
            }

            if (user.jwt) {
                // Vérification de la validité du token (jwt)
                const tokenValid = await authService.verifyJwt(user.jwt);
                if (tokenValid) {
                    // Le token (jwt) est valide, envoi de l'information dans le header de la requête
                    res.setHeader('Authorization', `Bearer ${user.jwt}`);
                    return res.status(200).json({ token: user.jwt, idUtilisateur: user.idUtilisateur });
                }
            }

            const token = methodeAuth.createAndStoreToken(user, '1d')
            // Stocker le token (jwt) dans la DB
            const clientJwt = await authService.addJwt(token, user.idUtilisateur);
            if (clientJwt) {

                // Si l'insertion s'est correctement déroulée, on envoi les informations dans le header et au front en json
                res.setHeader('Authorization', `Bearer ${token}`);

                return res.status(200).json({ token });

            }
        } catch (err) {
            console.error(err);
            res.sendStatus(404);
        }
    },
    confimationEmail: async (req, res) => {
        try {
            const confirmationHash = req.params.confirmationHash;

            const user = await userService.methodeConfirmationHash(confirmationHash);

            // Vérifier si l'utilisateur existe
            if (!user) {
                return res.status(404).json({ error: "Utilisateur non trouvé." });
            }
            // Vérifier si l'e-mail est déjà confirmé
            if (user.emailConfirme) {
                return res.status(400).json({ error: "L'e-mail de l'utilisateur est déjà confirmé." });
            }
            // Comparaison stricte entre les hachages
            if (confirmationHash === user.confirmationHash) {
                // Mettre à jour l'utilisateur
                user.emailConfirme = true;
                const updatedUser = await userService.updateUser(user.idUtilisateur, user);

                if (!updatedUser) {
                    return res.status(500).json({ error: "Échec de la mise à jour de l'utilisateur." });
                }

                return res.status(200).json({ message: "L'e-mail de l'utilisateur a été vérifié avec succès", userComplet: updatedUser });
            }
            // Aucune correspondance, vous pouvez gérer cela selon vos besoins
            res.status(400).json({ error: "La confirmation de l'e-mail a échoué. Les hachages ne correspondent pas." });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erreur interne du serveur." });
        }
    },
    envoisMail: async (req, res) => {
        try {
            emailUtilisateur = req.params.emailUtilisateur

            const user = await authService.exist(emailUtilisateur);

            if (!emailUtilisateur) {
                return res.status(400).json({ message: 'L\'adresse e-mail est requise' });
            }
            methodeAuth.envoisEmailConfirmed(user.confirmationHash, user.prenom, user.nom, emailUtilisateur)

            res.status(200).json(user);
        } catch (error) {
            console.error('Une erreur s\'est produite lors de l\'envoi du mail:', error);
            res.status(500).json({ message: 'Erreur lors de l\'envoi du mail' });
        }
    },
    passwordPerdu: async (req, res) => {
        try {
            const { emailUtilisateur } = req.body;

            let user = await authService.exist(emailUtilisateur);
            if (!user) {
                // Si l'utilisateur n'existe pas, renvoi une réponse 401 (Unauthorized)
                return res.status(401).json({ message: 'Utilisateur non trouvé' })
            }
            user.urlResetPasswordHash = methodeAuth.hashedUrl(user, emailUtilisateur)

            user = methodeAuth.Passworhached(user)

            const updatedUser = await userService.updateUser(user.idUtilisateur, user);
            if (!updatedUser) {
                res.sendStatus(404);
                return;
            }

            const token = methodeAuth.createAndStoreToken(user, '10m')
            const clientJwt = authService.addJwt(token, user.idUtilisateur);

            if (clientJwt) {
                methodeAuth.envoisEmailPasswordLosted(user.urlResetPasswordHash, user.prenom, user.nom, emailUtilisateur)
                // Si l'insertion s'est correctement déroulée, on envoi les informations dans le header et au front en json
                res.setHeader('Authorization', `Bearer ${token}`);
                return res.status(200).json({ token: user.jwt, idUtilisateur: user.idUtilisateur });
            }
        } catch (err) {
            console.error(err);
            res.sendStatus(404);
        }
    },
    updatePasswordLosted: async (req, res) => {
        try {
            const urlResetPasswordHash = req.params.urlResetPasswordHash;
            const passeword = req.body.passeword
            const user = await userService.methodeUrlResetPasswordHash(urlResetPasswordHash);
            if (!user) {
                return res.status(404).json({ error: "Utilisateur non trouvé." });
            }
            if (user.urlResetPasswordHash === urlResetPasswordHash) {
                user.hashedPassword = bcrypt.hashSync(passeword, 10);

                const updatedUser = await userService.updateUser(user.idUtilisateur, user);
                if (!updatedUser) {
                    res.sendStatus(404);
                    return;
                }
                return res.status(201).json({ message: 'le passeword est changé', newPassewordhacher: user.hashedPassword, motsDePasse: passeword })
            }
        } catch (err) {
            throw err
        }
    }
}
module.exports = authController
