import { Reservation } from "../entities/Reservation";
import { Room } from "../entities/Room";
import { Status } from "../types/Status";
import { DateRange } from "../value-objects/DateRange";

export class RoomService {
    static isAvailable(room: Room, reservations: Reservation[], requested: DateRange): boolean {
        if (!room.inService) return false;

        return !reservations.some((r) => {
            if (r.room.id !== room.id) return false;
            if (r.status !== Status.CONFIRMED) return false;
            return r.range.overlaps(requested);
        });
    }

    static findAvailableRooms(rooms: Room[], reservations: Reservation[], requested: DateRange): Room[] {
        return rooms.filter((room) => this.isAvailable(room, reservations, requested));
    }
}
