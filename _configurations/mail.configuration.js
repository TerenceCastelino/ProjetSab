require('dotenv').config()
// Importation du module nodemailer
const nodemailer = require('nodemailer');


const { passmail, usermail } = process.env

// Définition de la fonction sendEmail prenant trois paramètres: destinataire, sujet, contenu
function sendEmail(to, subject, text) {
    // Création d'un objet transporter avec les informations de votre service de messagerie (Gmail dans ce cas)
    let transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        secureConnection: false,
        port: 587,
        tls: {
            ciphers: "SSLv3"
        },
        auth: {
            //usermail passmail sont des variable d environnement
            user: usermail, // Adresse e-mail de l'expéditeur
            pass: passmail // Mot de passe de l'expéditeur (Attention : stocker les mots de passe directement dans le code peut être risqué)

        }
    });
    // Configuration des options de l'e-mail (expéditeur, destinataire, sujet, contenu)
    let mailOptions = {
        from: usermail, // Adresse e-mail de l'expéditeur (la même que celle utilisée pour l'authentification)
        to: to, // Adresse e-mail du destinataire
        subject: subject, // Sujet de l'e-mail
        text: text // Contenu de l'e-mail
    };

    // Envoi de l'e-mail en utilisant la méthode sendMail de l'objet transporter
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error); // En cas d'erreur lors de l'envoi, affiche l'erreur dans la console
        } else {
            console.log('E-mail envoyé: ' + info.response); // Si l'e-mail est envoyé avec succès, affiche un message de confirmation dans la console
        }
    });
}

// Exportation de la fonction sendEmail pour pouvoir l'utiliser dans d'autres fichiers
module.exports = sendEmail;
