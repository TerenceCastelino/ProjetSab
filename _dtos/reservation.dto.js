class ReservationDTO {
    constructor(data) {
        this.idReservation = data.idReservation
        this.dateDebut = data.dateDebut
        this.dateFin = data.dateFin
        this.idUtilisateur = data.idUtilisateur
        this.idTinyHouse = data.idUtilisateur
        this.payementConfirmer = data.payementConfirmer

    }
}

module.exports = ReservationDTO 