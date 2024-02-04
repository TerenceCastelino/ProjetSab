const reservationService = require('../_servies/reservation.service');
const jourReserverService = require('../_servies/jourReserver.service'); // Ajout du service jourReserver
const tinyHouseService = require('../_servies/tinyHouse.service');
const userService = require('../_servies/utilisateur.service');
const reservationValidator = require('../_validators/reservation.validator');
const methodeReservation = require('../_Methode/_reservation/reservation.methode')

const reservationController = {
    preReservation: async (req, res) => {
        try {
            const { model, idUtilisateur, dateDebut, dateFin } = req.body;

            // Convertir les chaînes de caractères en objets Date
            const dateDebutObj = new Date(dateDebut);
            const dateFinObj = new Date(dateFin);

            console.log(dateDebutObj);
            console.log(dateFinObj);

            const tinys = await tinyHouseService.getAllTinyModel(model);

            const unixDebut = methodeReservation.convertDateToDayUnix(dateDebutObj);
            const unixFin = methodeReservation.convertDateToDayUnix(dateFinObj);

            console.log('le jour unixdebut', unixDebut);
            console.log('le jour unixfin', unixFin);
            const joursDemandes = unixFin - unixDebut;
            let testingDay = unixDebut;

            for (const tiny of tinys) {
                const jourTiny = await jourReserverService.getJourReserverByTinyHouseId(tiny.idTinyHouse);


                console.log(`Début de la vérification pour la Tiny House ${tiny.idTinyHouse}`);

                let jourReserve = false; // Variable pour suivre si un jour est déjà réservé pour la Tiny House actuelle

                for (let index = 0; index <= joursDemandes; index++) {
                    for (const jour of jourTiny) {
                        console.log('jourunixxxxxxxxxxxxxx', jour.jourUnix, 'testingDay', testingDay);
                        if (parseInt(jour.jourUnix) === testingDay) {
                            jourReserve = true;
                            console.log(`Le jour ${testingDay} est déjà réservé pour la Tiny House ${tiny.idTinyHouse}`);
                            break; // Sortir de la boucle des jours si un jour est déjà réservé
                        }
                    }

                    if (jourReserve) {
                        // Si un jour est déjà réservé, passer à la prochaine Tiny House
                        break;
                    }

                    console.log(`Le jour ${testingDay} est libre pour la Tiny House ${tiny.idTinyHouse}`);
                    testingDay++;
                }

                console.log(`Fin de la vérification pour la Tiny House ${tiny.idTinyHouse}`);

                // Si tous les jours sont libres, créer une réservation
                if (!jourReserve) {
                    const reservationData = {
                        dateDebut: dateDebutObj,
                        dateFin: dateFinObj,
                        payementConfirmer: false, // Vous pouvez ajuster selon vos besoins
                        idUtilisateur: idUtilisateur,
                        idTinyHouse: tiny.idTinyHouse
                    };
                    console.log('ici jourReserve.idTinyHouse ', reservationData.idTinyHouse);

                    const reservation = await reservationService.createReservation(reservationData);
                    console.log('la reservation', reservation.idReservation);
                    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    // Ajout de la création des occurrences dans JourReserver
                    await createJourReserverForReservation(reservation);

                    console.log(`Réservation créée pour la Tiny House ${tiny.idTinyHouse}`);
                    // Envoyer la réponse appropriée ici
                    res.status(200).json({ message: `Réservation créée pour la Tiny House ${tiny.idTinyHouse}` });
                    return;
                }
            }

            // Si aucune réservation n'a été créée, renvoyer un message
            res.status(404).json({ error: 'Aucune Tiny House disponible pour le modèle spécifié pendant cette période.' });
        } catch (err) {
            console.error('Erreur lors de la pré-réservation :', err);
            res.status(500).json({ error: 'Erreur lors de la pré-réservation' });
        }
    }
};

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Méthode pour créer des occurrences dans JourReserver pour tous les jours de la réservation
// reservation.controller.js

const createJourReserverForReservation = async (reservation) => {
    try {
        const { idReservation, dateDebut, dateFin, idTinyHouse } = reservation;
        const daysBetween = (dateFin - dateDebut) / (1000 * 60 * 60 * 24);

        for (let i = 0; i <= daysBetween; i++) {
            // Obtenez la date du jour correspondant
            const currentDate = new Date(dateDebut);
            currentDate.setDate(currentDate.getDate() + i);

            // Obtenez le jourUnix correspondant
            const jourUnix = methodeReservation.convertDateToDayUnix(currentDate);

            // Créez une occurrence dans JourReserver pour chaque jour de la réservation
            await jourReserverService.createJourReserver(idReservation, idTinyHouse, currentDate, jourUnix);
        }
    } catch (error) {
        throw error;
    }
};




module.exports = reservationController;
