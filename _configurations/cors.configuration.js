const cors = require('cors');


const corsOptions = {
    origin: 'http://localhost:4200', // Remplacez par votre URL front-end
    optionsSuccessStatus: 200 // Certaines anciennes versions de navigateurs (IE11, divers SmartTVs) rencontrent des problèmes avec le code 204
};
const configureCors = (app) => {
    app.use(cors(corsOptions));
    return corsOptions; // Retourner les options CORS après les avoir appliquées
};

module.exports = configureCors;









