import { Status } from "../../types/Status";
import { IReservationRepository } from "../ports/IReservationRepository";


export class ConfirmReservationUseCase {
    constructor(private reservationRepo: IReservationRepository) { }

    async execute(reservationId: string): Promise<{ reservationId: string; status: Status }> {
        const reservation = await this.reservationRepo.findById(reservationId);
        if (!reservation) throw new Error("Reservation not found");

        if (reservation.status === Status.CANCELLED) {
            throw new Error("Cannot confirm a cancelled reservation")
        }

        if (reservation.status === Status.CONFIRMED) {
            return { reservationId: reservation.id, status: reservation.status }
        }

        reservation.confirm()
        await this.reservationRepo.save(reservation);

        return { reservationId: reservation.id, status: reservation.status }
    }
}