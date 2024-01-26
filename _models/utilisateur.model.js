const { Sequelize, DataTypes, ModelStatic } = require('sequelize');
const db = require('./db.model')

/**
 * Fonction pour créer un model Character (donc table de db)
 * Le JSDoc sert à l'autocomplétion
 * @param {Sequelize} sequelize
 * @returns {ModelStatic<any>}
 */

module.exports = (sequelize) => {
    const Utilisateur = sequelize.define('Utilisateur', {
        idUtilisateur: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        hashedPassword: {
            type: DataTypes.STRING(250),
            allowNull: true,
        },
        jwt: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        nom: {
            type: DataTypes.STRING(75),
            allowNull: false,
        },
        prenom: {
            type: DataTypes.STRING(75),
            allowNull: false,
        },
        emailUtilisateur: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
        },
        role: {
            type: DataTypes.ENUM('admin', 'utilisateur'),
            allowNull: false,
            defaultValue: 'utilisateur',
        },
        telephone: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        gsm: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        emailConfirme: {
            type: DataTypes.BOOLEAN(false),
            defaultValue: false,
            allowNull: false,
        },
        profilActive: {
            type: DataTypes.BOOLEAN(false),
            defaultValue: false,
            allowNull: false,
        },
        confirmationHash: {
            type: DataTypes.STRING(300),
            allowNull: true,
        }
    }, {
        tableName: 'utilisateur',
        timestamps: true,
        indexes: [
            {
                name: 'UK_Auth__jwt',
                fields: ['emailUtilisateur', 'jwt'],
                unique: false,
            },
        ],
    });





    return Utilisateur;
};
