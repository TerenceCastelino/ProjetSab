const yup = require('yup');
const { object } = require('yup');

const utilisateurValidator = object({

    dateDebut: yup.date().min(new Date(), "La date de début ne peut pas être antérieure à la date actuelle").required(),
    dateFin: yup.date().required(),
    idTinyHouse: yup.number().required(),
    idUtilisateur: yup.number().required(),
    payementConfirmer: yup.bool(),



});


module.exports = utilisateurValidator;