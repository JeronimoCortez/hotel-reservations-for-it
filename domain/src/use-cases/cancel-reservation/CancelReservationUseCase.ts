import { Roles } from "../../types/Roles";
import { Status } from "../../types/Status";
import { IReservationRepository } from "../ports/IReservationRepository";
import { IUserRepository } from "../ports/IUserRepository";


export class CancelReservationUseCase {
    constructor(
        private reservationRepo: IReservationRepository,
        private userRepo: IUserRepository
    ) { }

    async execute(reservationId: string, requesterUserId: string): Promise<{ reservationId: string; status: Status }> {
        const reservation = await this.reservationRepo.findById(reservationId);
        if (!reservation) throw new Error("Reservation not found");

        const requester = await this.userRepo.findById(requesterUserId);
        if (!requester) throw new Error("Requester user not found");

        const isOwner = reservation.user.id === requesterUserId;
        const isAdmin = (requester.role && requester.role === Roles.ADMIN);

        if (!isOwner && !isAdmin) {
            throw new Error("Not authorized to cancel this reservation")
        }

        if (reservation.status === Status.CANCELLED) {
            return { reservationId: reservation.id, status: reservation.status }
        }

        reservation.cancel();
        await this.reservationRepo.save(reservation);

        return { reservationId: reservation.id, status: reservation.status };
    }
}