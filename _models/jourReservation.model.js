const { Sequelize, DataTypes, ModelStatic } = require('sequelize');
const db = require('./db.model');

/**
 * Fonction pour créer un model Character (donc table de db)
 * Le JSDoc sert à l'autocomplétion
 * @param {Sequelize} sequelize
 * @returns {ModelStatic<any>}
 */

module.exports = (sequelize) => {
    const JourReserver = sequelize.define('jourReserver', {
        idJourReserver: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        idReservation: {
            type: DataTypes.INTEGER,
            allowNull: false,

        },
        idTinyHouse: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        dateReserver: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
        },
        jourUnix: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: Sequelize.literal('(DATEDIFF(day, \'1970-01-01\', GETDATE()))'),
        },
    }, {
        tableName: 'jourReserver',
        timestamps: true,
    });


    return JourReserver;
};
