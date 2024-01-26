
class UtilisateurDTO {

    constructor(data) {

        this.idUtilisateur = data.idUtilisateur
        this.nom = data.nom
        this.prenom = data.prenom
        this.emailUtilisateur = data.emailUtilisateur
        this.role = data.role
        this.telephone = data.telephone
        this.gsm = data.gsm
        this.hashedPassword = data.hashedPassword
        this.jwt = data.jwt
        this.emailConfirme = data.emailConfirme
        this.profilActive = data.profilActive
        this.confirmationHash = data.confirmationHash
    }
}

module.exports = UtilisateurDTO
