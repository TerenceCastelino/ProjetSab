const { Sequelize, DataTypes, ModelStatic } = require('sequelize');
const db = require('./db.model')

/**
 * Fonction pour créer un model Character (donc table de db)
 * Le JSDoc sert à l'autocomplétion
 * @param {Sequelize} sequelize
 * @returns {ModelStatic<any>}
 */

module.exports = (sequelize) => {
    const Reservation = sequelize.define('reservation', {
        idReservation: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        dateDebut: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        dateFin: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        payementConfirmer: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            // defaultValue: false,
        }

    }, {
        tableName: 'reservation',
        timestamps: true,
        indexes: [

        ],
    });





    return Reservation;
};
