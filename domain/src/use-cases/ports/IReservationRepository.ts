import { Reservation } from "../../entities/Reservation";


export interface IReservationRepository {
    findById(id: string): Promise<Reservation | null>;
    findByRoomAndRange(roomId: string, start: Date, end: Date): Promise<Reservation[]>;
    findByRange(start: Date, end: Date): Promise<Reservation[]>;
    save(reservation: Reservation): Promise<void>;
    delete(id: string): Promise<void>;
}