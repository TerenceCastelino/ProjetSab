const { Sequelize, DataTypes, ModelStatic } = require('sequelize');
const db = require('./db.model')

/**
 * Fonction pour créer un model Character (donc table de db)
 * Le JSDoc sert à l'autocomplétion
 * @param {Sequelize} sequelize
 * @returns {ModelStatic<any>}
 */

module.exports = (sequelize) => {
    const TinyHouse = sequelize.define('tinyHouse', {
        idTinyHouse: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        adresse: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
        }

    }, {
        tableName: 'tinyHouse',
        timestamps: true,
        indexes: [
            {
                name: 'unique_adresse',
                fields: ['adresse'],
                unique: true,
            },
        ],
    });





    return TinyHouse;
};
