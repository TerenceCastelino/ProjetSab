const { Sequelize } = require('sequelize');

const { NAME_LOGING, PASSWORD, NAME_DATABASE } = process.env;
const sequelize = new Sequelize(NAME_DATABASE, NAME_LOGING, PASSWORD, {
    host: 'localhost', // Spécifie l'adresse du serveur de base de données
    dialect: 'mssql', // Utilisez le dialecte 'mssql' pour SQL Server
    logging: false, // Désactive la sortie des requêtes SQL
    dialectOptions: {
        options: {
            trustServerCertificate: true, // Activez cette option si vous utilisez un certificat auto-signé
        },
    },
});

// Crée l'objet "db" pour stocker les modèles de base de données
const db = {};

// Associe l'instance Sequelize à "sequelize" et le module Sequelize à "Sequelize" pour une utilisation ultérieure
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import des modèles spécifiques depuis des fichiers externes
// ___________________________________________________________
db.Utilisateur = require('./utilisateur.model')(sequelize);
db.TinyHouse = require('./tinyHouse.model')(sequelize);
db.Equipement = require('./equipement.model')(sequelize);





// Définition des associations entre les modèles
// _____________________________________________

// Associer Equipement à TinyHouse avec une association 0/n
db.Equipement.belongsTo(db.TinyHouse, { foreignKey: 'idTyniHouse', as: 'tinyHouses' });
// Associer TinyHouse à Equipement avec une association 1/1
db.TinyHouse.hasMany(db.Equipement, { foreignKey: 'idTyniHouse', as: 'equipement' });



module.exports = db;