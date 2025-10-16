import { IReservation } from "../types/IReservation";
import { Status } from "../types/Status";
import { Room } from "./Room";
import { User } from "./User";


export class Reservation implements IReservation {
    constructor(
        public id: string,
        public user: User,
        public room: Room,
        public startDate: Date,
        public endDate: Date,
        public status: Status,
    ) { }

    confirm() {
        if (this.status === Status.CANCELLED) {
            throw new Error("Cannot confirm a cancelled reservation.");
        }
        this.status = Status.CONFIRMED;
        this.room.markUnavailable();
    }

    cancel() {
        this.status = Status.CANCELLED;
        this.room.markAvailable();
    }
}