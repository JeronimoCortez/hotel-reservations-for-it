import { IRoom } from "./IRoom";
import { IUser } from "./IUser";
import { Status } from "./Status";

export interface IReservation {
    id: string;
    user: IUser;
    room: IRoom;
    startDate: Date;
    endDate: Date;
    status: Status;
}