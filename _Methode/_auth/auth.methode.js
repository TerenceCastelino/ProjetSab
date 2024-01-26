const mailConfig = require('../../_configurations/mail.configuration')

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
}
module.exports = methodeAuth
