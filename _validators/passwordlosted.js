// a. Importation de la bibliothèque de validation Yup
const yup = require('yup');

// b. Importation de la méthode "object" de la bibliothèque Yup
// La méthode "object" est utilisée pour définir un schéma de validation pour un objet.
const { object } = require('yup');

// c. Définition du schéma de validation pour les utilisateurs en utilisant Yup
const mdpValidator = object({
    idUtilisateur: yup.number(),
    motsDePasse: yup.string().min(5).max(20).required(),
    emailUtilisateur: yup.string().email().required(),

});

// d. Exportation du schéma de validation "userValidator" pour être utilisé ailleurs dans l'application
module.exports = mdpValidator;