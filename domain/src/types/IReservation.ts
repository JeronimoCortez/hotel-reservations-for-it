import { IRoom } from "./IRoom";
import { IUser } from "./IUser";
import { Status } from "./Status";
import { LocalDate } from "../value-objects/LocalDate";

export interface IReservation {
    id: string;
    user: IUser;
    room: IRoom;
    startDate: LocalDate; // YYYY-MM-DD
    endDate: LocalDate; // YYYY-MM-DD (exclusive)
    status: Status;
}
