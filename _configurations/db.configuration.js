const db = require("../_models/db.model");

const connectToDatabase = async () => {
    try {
        await db.sequelize.authenticate();
        console.log('Connection à la DB réussie');

        // Synchronisation de la base de données uniquement en mode développement
        if (process.env.NODE_ENV === 'development') {
            await db.sequelize.sync({ alter: { drop: false } });
        }
    } catch (error) {
        console.log(`Connection à la DB ratée : ${error}`);
    }
};

module.exports = connectToDatabase;