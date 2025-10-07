import { Reservation } from "../entities/Reservation";
import { Room } from "../entities/Room";
import { User } from "../entities/User";
import { Status } from "../types/Status";
import { RoomService } from "./RoomService";

export class ReservationService {
    static createReservation(
        id: string,
        user: User,
        room: Room,
        startDate: Date,
        endDate: Date,
        existingReservations: Reservation[]
    ): Reservation | null {
        if (!RoomService.isAvailable(room, existingReservations, startDate, endDate)) {
            return null;
        }
        const reservation = new Reservation(id, user, room, startDate, endDate, Status.PENDING);
        return reservation;
    }
}