import { Reservation } from "../entities/Reservation";
import { Room } from "../entities/Room";
import { Status } from "../types/Status";

export class RoomService {
    static isAvailable(room: Room, reservations: Reservation[], startDate: Date, endDate: Date): boolean {
        return !reservations.some(
            r =>
                r.room.id === room.id &&
                r.status === Status.CONFIRMED &&
                ((startDate >= r.startDate && startDate < r.endDate) ||
                    (endDate > r.startDate && endDate <= r.endDate))
        )
    }

    static finAvailableRooms(rooms: Room[], reservations: Reservation[], startDate: Date, endDate: Date): Room[] {
        return rooms.filter(room => this.isAvailable(room, reservations, startDate, endDate))
    }
}