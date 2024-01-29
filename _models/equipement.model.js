const { Sequelize, DataTypes, ModelStatic } = require('sequelize');
const db = require('./db.model')

/**
 * Fonction pour créer un model Character (donc table de db)
 * Le JSDoc sert à l'autocomplétion
 * @param {Sequelize} sequelize
 * @returns {ModelStatic<any>}
 */

module.exports = (sequelize) => {
    const Equipement = sequelize.define('equipement', {
        idEquipement: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nomEquipement: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
        }

    }, {
        tableName: 'equipement',
        timestamps: true,

    });





    return Equipement;
};
