const yup = require('yup');
const { object } = require('yup');

const utilisateurValidator = object({

    idUtilisateur: yup.number(),
    nom: yup.string().min(2).max(50).required(),
    prenom: yup.string().min(2).max(50).required(),
    emailUtilisateur: yup.string().email(),
    motsDePasse: yup.string().min(4).required(),
    role: yup.string().min(5).max(11).oneOf(['admin', 'utilisateur']),
    telephone: yup.string(),
    gsm: yup.string().max(14),
    profilActive: yup.boolean(),
    emailConfirme: yup.boolean()


});


module.exports = utilisateurValidator;