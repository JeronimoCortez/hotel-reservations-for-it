import { Reservation } from "../entities/Reservation";
import { Room } from "../entities/Room";
import { User } from "../entities/User";
import { Status } from "../types/Status";
import { RoomService } from "./RoomService";
import { DateRange } from "../value-objects/DateRange";
import { LocalDate } from "../value-objects/LocalDate";

export class ReservationService {
    static createReservation(
        id: string,
        user: User,
        room: Room,
        startDate: LocalDate,
        endDate: LocalDate,
        existingReservations: Reservation[]
    ): Reservation | null {
        const requested = DateRange.create(startDate, endDate);
        if (!RoomService.isAvailable(room, existingReservations, requested)) {
            return null;
        }
        const reservation = new Reservation(id, user, room, startDate, endDate, Status.PENDING);
        return reservation;
    }
}
