const mailConfig = require('../../_configurations/mail.configuration')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const methodeAuth = {
    envoisEmailConfirmed: (x, prenom, nom, emailUtilisateur) => {
        try {
            // Contenu de l'e-mail
            const contenuEmail = `
            Sujet : Confirmation de votre adresse e-mail
            
            Bonjour ${prenom} ${nom}, 
            Nous sommes ravis de vous confirmer que votre adresse e-mail a bien été enregistrée.
            Si vous n'avez pas effectué cette action, veuillez nous contacter immédiatement.
            http://localhost:4200/confirmation-email/${x}

           

            

            Merci,
            Votre équipe
        `;

            // Envoyer l'e-mail
            mailConfig(emailUtilisateur, 'Confirmation de l\'email pour le projet Sabrina', contenuEmail);

            return true
        } catch (err) {
            console.error(err);
        }
    },
    extractBearer: (authorization) => {
        if (typeof authorization !== 'string') {
            return false
        }
        const matches = authorization.match(/(bearer)\s+(\S+)/i)
        return matches && matches[2]
    },
    envoisEmailPasswordLosted: (x, prenom, nom, emailUtilisateur) => {
        try {

            const contenuEmail = `
            Bonjour ${prenom} ${nom},

            Nous avons reçu une demande de réinitialisation de mot de passe associée à cette adresse e-mail. Si vous n'avez pas effectué cette demande, veuillez ignorer cet e-mail.

            Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :

            http://localhost:4200/resetPassword/${x}

            Le lien est valable [durée de validité, par exemple, 1 heure].

            Cordialement,
            Votre équipe
        `;

            // Envoyer l'e-mail
            mailConfig(emailUtilisateur, 'passwod perdu projet Sabrina', contenuEmail);

            return true
        } catch (err) {
            console.error(err);
        }
    },
    createAndStoreToken(user, timeString) {
        const payload = {
            userId: user.idUtilisateur,
            login: user.emailUtilisateur,
            role: user.role
        };
        const options = {
            expiresIn: timeString,
        };

        // Signer le token (jwt) avec le SECRET
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(payload, secret, options);

        // Stocker le token (jwt) dans la DB
        // const clientJwt = authService.addJwt(token, user.idUtilisateur);

        console.log("1 le token dans la methode syncro", token);
        return token;
    },
    Passworhached: (utilisateur) => {
        try {

            const randomInt = Math.floor(Math.random() * 100000) + 1;
            const stringRandomInt = randomInt.toString(); // Convertit le nombre en chaîne de caractère
            const motsDePasse = `${utilisateur.idUtilisateur}${stringRandomInt}${utilisateur.prenom.slice(0, 3)}`

            const hashedPassword = bcrypt.hashSync(motsDePasse, 10);
            // Mettre à jour les propriétés de l'utilisateur
            utilisateur.hashedPassword = hashedPassword;

            return utilisateur
        } catch (err) {
            console.error(err);
        }

    },
    hashedUrl: (user, emailUtilisateur) => {
        const concate = `${user.nom}${user.prenom}${emailUtilisateur}${Math.floor(new Date().getTime() / 1000)}`
        let url = bcrypt.hashSync(concate, 2)
        return url = btoa(url);
    }
}
module.exports = methodeAuth
