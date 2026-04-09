import { Reservation } from "../../entities/Reservation";
import { LocalDate } from "../../value-objects/LocalDate";


export interface IReservationRepository {
    findById(id: string): Promise<Reservation | null>;
    findByRoomAndRange(roomId: string, start: LocalDate, end: LocalDate): Promise<Reservation[]>;
    findByRange(start: LocalDate, end: LocalDate): Promise<Reservation[]>;
    save(reservation: Reservation): Promise<void>;
    delete(id: string): Promise<void>;
}
