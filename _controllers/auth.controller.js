//dependence
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const methodeAuth = require('../_Methode/_auth/auth.methode')
//service
const authService = require('../_servies/auth.service')
const userService = require('../_servies/utilisateur.service')
// validateur
const authValidator = require('../_validators/utilisateur.validator');
const mdpValidator = require('../_validators/passwordlosted')


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

        const concate = `${nom}${prenom}${emailUtilisateur}${Math.floor(new Date().getTime() / 1000)}`
        let confirmationHash = bcrypt.hashSync(concate, 2)

        confirmationHash = btoa(confirmationHash);
        console.log(confirmationHash, 'qu elle idee folle');

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
        console.log(confirmationHash);

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
        console.log('coucou');
        try {
            console.log('coucou2');
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
    loginPerdu: async (req, res) => {
        try {
            const { emailUtilisateur } = req.body;

            const user = await authService.exist(emailUtilisateur);
            const recupeId = user.idUtilisateur


            if (!user) {
                // Si l'utilisateur n'existe pas, renvoi une réponse 401 (Unauthorized)
                return res.status(401).json({ message: 'Utilisateur non trouvé' })
            }
            // Vérification de l'existence d'un token (jwt) pour cet utilisateur

            const motsDePasse = authController.updateMdp(req, res, recupeId)

            // Vérification de l'existence d'un token (jwt) pour cet utilisateur
            // const existingToken = await authentificationService.getJwt(user.idUtilisateur);
            console.log("3_________", user.jwt);

            if (user.jwt) {
                console.log("4_________", user.jwt);
                // Vérification de la validité du token (jwt)
                const tokenValid = await authService.verifyJwt(user.jwt);
                if (tokenValid) {

                    methodeAuth.envoisEmailPasswordLosted(user.jwt, user.prenom, user.nom, emailUtilisateur)
                    // Le token (jwt) est valide, envoi de l'information dans le header de la requête
                    res.setHeader('Authorization', `Bearer ${user.jwt}`);
                    return res.status(200).json({ token: user.jwt, idUtilisateur: user.idUtilisateur });
                }
            }

            // Vérification du password fourni par l'utilisateur avec le password hashé dans la DB
            const passwordMatch = await bcrypt.compareSync(motsDePasse, user.hashedPassword);//!!!!!!!!!!
            console.log("5_________", user.jwt);
            if (!passwordMatch) {
                // Si les mots de passe ne correspondent pas, renvoi une réponse 401 (Unauthorized)
                return res.status(401).json({ message: 'Mot de passe incorrect' })
            }
            if (passwordMatch) {
                console.log("utilisateur connecter");
            }

            // Si les password correspondent, on va créer un token(jwt) pour l'utilisateur
            const payload = {
                userId: user.idUtilisateur,
                login: user.emailUtilisateur,
                role: user.role

            };

            const options = {
                expiresIn: '1h',
            };

            // Signer le token (jwt) avec le SECRET
            const secret = process.env.JWT_SECRET;
            const token = jwt.sign(payload, secret, options);
            console.log("6_________", user.jwt);

            // Stocker le token (jwt) dans la DB
            const clientJwt = await authService.addJwt(token, user.idUtilisateur);

            if (clientJwt) {
                methodeAuth.envoisEmailPasswordLosted(user.jwt, user.prenom, user.nom, emailUtilisateur)
                console.log("7_________", user.jwt);
                // Si l'insertion s'est correctement déroulée, on envoi les informations dans le header et au front en json
                res.setHeader('Authorization', `Bearer ${token}`);

                return res.status(200).json({ token: user.jwt, idUtilisateur: user.idUtilisateur });
            }
        } catch (err) {
            console.error(err);
            res.sendStatus(404);
        }
    },
    updateMdp: async (req, res, recupeId) => {
        try {
            const id = recupeId

            const randomInt = Math.floor(Math.random() * 100000) + 1;
            const stringRandomInt = randomInt.toString(); // Convertit le nombre en chaîne de caractère
            const utilisateur = await userService.getOne(id); // Récupération des données utilisateur

            const passwordData = {
                "idUtilisateur": utilisateur.idUtilisateur,
                "emailUtilisateur": utilisateur.emailUtilisateur,
                "motsDePasse": `${utilisateur.idUtilisateur}${stringRandomInt}${utilisateur.prenom.slice(0, 3)}`,

            }
            console.log(passwordData.motsDePasse, 'le mots de passe aleatoire');
            // Validation des informations récupérées depuis les données utilisateur
            const validatedData = await mdpValidator.validate(passwordData);

            // Destructuration des données vérifiées
            const { motsDePasse, idUtilisateur, emailUtilisateur } = validatedData;

            if (idUtilisateur == id && utilisateur.emailUtilisateur == emailUtilisateur) {
                // Ré-hachage du mot de passe

                const hashedPassword = bcrypt.hashSync(motsDePasse, 10);

                // Mettre à jour les propriétés de l'utilisateur

                utilisateur.hashedPassword = hashedPassword;

                // Mettre à jour l'utilisateur dans la base de données
                const updatedUser = await userService.updateUser(id, utilisateur);

                if (!updatedUser) {
                    res.sendStatus(404);
                    return;
                }
                return passwordData.motsDePasse

            } else {
                // console.error('Erreur lors de la mise à jour :', error);
                res.status(400).json({ error: 'id incorrecte' });
            }

        } catch (error) {
            console.error('Erreur lors de la mise à jour :', error);
            res.status(400).json({ error: 'Erreur lors de la mise à jour' });
        }
    },





}

module.exports = authController

