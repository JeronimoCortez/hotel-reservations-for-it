import { Status } from "../../types/Status";
import { LocalDate } from "../../value-objects/LocalDate";

export interface CreateReservationResult {
    reservationId: string;
    status: Status;
    startDate: LocalDate;
    endDate: LocalDate;
    roomId: string;
    userId: string;
}
