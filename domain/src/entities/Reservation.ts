import { IReservation } from "../types/IReservation";
import { Status } from "../types/Status";
import { Room } from "./Room";
import { User } from "./User";
import { InvariantError } from "../errors/DomainErrors";
import { assertLocalDate, LocalDate } from "../value-objects/LocalDate";
import { DateRange } from "../value-objects/DateRange";


export class Reservation implements IReservation {
    constructor(
        public id: string,
        public user: User,
        public room: Room,
        public startDate: LocalDate,
        public endDate: LocalDate, // exclusive
        public status: Status,
    ) {
        assertLocalDate(startDate, "startDate");
        assertLocalDate(endDate, "endDate");
        DateRange.create(startDate, endDate);
    }

    get range(): DateRange {
        return DateRange.create(this.startDate, this.endDate);
    }

    confirm() {
        if (this.status === Status.CANCELLED) {
            throw new InvariantError("Cannot confirm a cancelled reservation");
        }
        this.status = Status.CONFIRMED;
    }

    cancel() {
        this.status = Status.CANCELLED;
    }
}
