import { Status } from "../../types/Status";
import { ConflictError, InvariantError, NotAuthorizedError, NotFoundError } from "../../errors/DomainErrors";
import { IReservationRepository } from "../ports/IReservationRepository";
import { IUserRepository } from "../ports/IUserRepository";
import { DateRange } from "../../value-objects/DateRange";


export class ConfirmReservationUseCase {
    constructor(
        private reservationRepo: IReservationRepository,
        private userRepo: IUserRepository,
    ) { }

    async execute(reservationId: string, requesterUserId: string): Promise<{ reservationId: string; status: Status }> {
        const reservation = await this.reservationRepo.findById(reservationId);
        if (!reservation) throw new NotFoundError("Reservation not found");

        const requester = await this.userRepo.findById(requesterUserId);
        if (!requester) throw new NotFoundError("Requester user not found");

        const isOwner = reservation.user.id === requesterUserId;
        const isAdmin = requester.isAdmin();
        if (!isOwner && !isAdmin) {
            throw new NotAuthorizedError("Not authorized to confirm this reservation");
        }

        if (reservation.status === Status.CANCELLED) {
            throw new InvariantError("Cannot confirm a cancelled reservation")
        }

        if (reservation.status === Status.CONFIRMED) {
            return { reservationId: reservation.id, status: reservation.status }
        }

        const requested = DateRange.create(reservation.startDate, reservation.endDate);
        const overlapping = await this.reservationRepo.findByRoomAndRange(
            reservation.room.id,
            requested.start,
            requested.end
        );
        const hasConflict = overlapping.some((r) =>
            r.id !== reservation.id &&
            r.status === Status.CONFIRMED &&
            r.range.overlaps(requested)
        );
        if (hasConflict) {
            throw new ConflictError("Room not available for request dates");
        }

        reservation.confirm()
        await this.reservationRepo.save(reservation);

        return { reservationId: reservation.id, status: reservation.status }
    }
}
