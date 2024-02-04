const methodeReservation = {

    convertDateToDayUnix(date) {
        // Vérifier si date est un objet Date
        if (!(date instanceof Date)) {
            // S'il ne s'agit pas d'un objet Date, renvoyer une erreur ou traiter selon vos besoins
            throw new Error('La valeur fournie n\'est pas un objet Date valide.');
        }

        // Convertir la date en millisecondes
        const dateInMilliseconds = date.getTime();

        // Date de référence (1er janvier 1970 à 00:00:00 UTC)
        const referenceDate = new Date(1970, 0, 1, 0, 0, 0, 0);

        // Calculer la différence en jours entre la date donnée et la date de référence
        const daysDifference = Math.floor((dateInMilliseconds - referenceDate) / (24 * 60 * 60 * 1000));

        return daysDifference;
    }
}
module.exports = methodeReservation