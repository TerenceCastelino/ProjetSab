//dependence
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const methodeAuth = require('../_Methode/_auth/auth.methode')
//service
const authService = require('../_servies/auth.service')
const userService = require('../_servies/utilisateur.service')
// validateur
const authValidator = require('../_validators/utilisateur.validator');


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

        const authInserted = await authService.insertUser({
            idUtilisateur,
            nom,
            prenom,
            role,
            telephone,
            gsm,
            emailUtilisateur,
            hashedPassword,
        });

        methodeAuth.envoisEmailConfirmed(authInserted.idUtilisateur, prenom, nom, emailUtilisateur)

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

            // Vérification de l'existence d'un token (jwt) pour cet utilisateur
            const existingToken = await userService.getOne(user.idUtilisateur);
            if (existingToken.jwt) {
                // Vérification de la validité du token (jwt)
                const tokenValid = await authService.verifyJwt(existingToken.jwt);
                if (tokenValid) {
                    // Le token (jwt) est valide, envoi de l'information dans le header de la requête
                    res.setHeader('Authorization', `Bearer ${existingToken.jwt}`);
                    return res.status(200).json({ token: existingToken.jwt, idUtilisateur: user.idUtilisateur });
                }
            }

            // Vérification du password fourni par l'utilisateur avec le password hashé dans la DB
            const passwordMatch = await bcrypt.compareSync(motsDePasse, user.hashedPassword);
            if (!passwordMatch) {
                // Si les mots de passe ne correspondent pas, renvoi une réponse 401 (Unauthorized)
                return res.status(401).json({ message: 'Mot de passe incorrect' })
            }
            if (passwordMatch) {
                console.log("utilisateur connecter");
            }

            // Si les password correspondent, on va créer un token (jwt) pour l'utilisateur
            const payload = {
                userId: user.idUtilisateur,
                login: user.emailUtilisateur,
                role: user.role

            };
            const options = {
                expiresIn: '1d',
            };

            // Signer le token (jwt) avec le SECRET
            const secret = process.env.JWT_SECRET;
            const token = jwt.sign(payload, secret, options);
            console.log('signature du tocken ', payload, secret, options);

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
            const idUtilisateur = req.params.idUtilisateur;

            // Vérifier si l'idUtilisateur est un nombre valide
            if (isNaN(idUtilisateur)) {
                return res.status(400).json({ error: "L'idUtilisateur doit être un nombre valide." });
            }

            const user = await userService.getOne(idUtilisateur);

            // Vérifier si l'utilisateur existe
            if (!user) {
                return res.status(404).json({ error: "Utilisateur non trouvé." });
            }

            // Vérifier si l'e-mail est déjà confirmé
            if (user.emailConfirme) {
                return res.status(400).json({ error: "L'e-mail de l'utilisateur est déjà confirmé." });
            }

            user.emailConfirme = true;

            // Mettre à jour l'utilisateur
            const updatedUser = await userService.updateUser(user.idUtilisateur, user);

            // Vérifier si la mise à jour a réussi
            if (!updatedUser) {
                return res.status(500).json({ error: "Échec de la mise à jour de l'utilisateur." });
            }

            res.status(200).json({ message: "L'e-mail de l'utilisateur a été vérifié avec succès", userComplet: updatedUser });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erreur interne du serveur." });
        }
    },

}

module.exports = authController