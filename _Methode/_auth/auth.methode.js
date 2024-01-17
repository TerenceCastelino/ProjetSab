const mailConfig = require('../../_configurations/mail.configuration')

const methodeAuth = {
    envoisEmailConfirmed: (idUtilisateur, prenom, nom, emailUtilisateur) => {
        try {
            // Contenu de l'e-mail
            const contenuEmail = `
            Sujet : Confirmation de votre adresse e-mail
            
            Bonjour ${prenom} ${nom}, 
            Nous sommes ravis de vous confirmer que votre adresse e-mail a bien été enregistrée.
            Si vous n'avez pas effectué cette action, veuillez nous contacter immédiatement.
            ${process.env.front}/api/confirmationMail/${idUtilisateur}  //hach info

            Merci,
            Votre équipe
        `;

            // Envoyer l'e-mail
            mailConfig(emailUtilisateur, 'Confirmation de l\'email pour le projet Sabrina', contenuEmail);

            return true
        } catch (err) {
            console.error(err);
        }
    }
}
module.exports = methodeAuth
