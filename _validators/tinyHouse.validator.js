const yup = require('yup');
const { object } = require('yup');

const tinyValidator = object({

    idTinyHouse: yup.number(),
    adresse: yup.string().min(2).max(50).required(),
    model: yup.string(6).oneOf(['model1', 'model2']).required(),


});


module.exports = tinyValidator;