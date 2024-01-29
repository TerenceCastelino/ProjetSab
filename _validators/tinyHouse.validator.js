const yup = require('yup');
const { object } = require('yup');

const tinyValidator = object({

    idTinyHouse: yup.number(),
    adresse: yup.string().min(2).max(50).required(),


});


module.exports = tinyValidator;