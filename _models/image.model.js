const { Sequelize, DataTypes, ModelStatic } = require('sequelize');
const db = require('./db.model')

/**
 * Fonction pour créer un model Character (donc table de db)
 * Le JSDoc sert à l'autocomplétion
 * @param {Sequelize} sequelize
 * @returns {ModelStatic<any>}
 */


module.exports = (sequelize) => {
    const Image = sequelize.define('image', {
        idImage: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        chemin: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // idTinyHouse: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        // },
        model: {
            type: DataTypes.ENUM('model1', 'model2'),
            allowNull: false
        },
        nomImage: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        tableName: 'image',
        timestamps: true,
    });





    return Image;
};

