import { Reservation } from "../../entities/Reservation";
import { RoomService } from "../../services/RoomService";
import { Status } from "../../types/Status";
import { IReservationRepository } from "../ports/IReservationRepository";
import { IRoomRepository } from "../ports/IRoomRepository";
import { IUserRepository } from "../ports/IUserRepository";
import { CreateReservationDTO } from "./CreateReservationDTO";
import { CreateReservationResult } from "./CreateReservationResult";
import { v4 as uuid } from "uuid";


export class CreateReservationUseCase {
    constructor(
        private userRepo: IUserRepository,
        private roomRepo: IRoomRepository,
        private reservationRepo: IReservationRepository
    ) {

    }

    async execute(dto: CreateReservationDTO): Promise<CreateReservationResult> {
        const start = new Date(dto.startDate);
        const end = new Date(dto.endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) throw new Error("Invalid dates");
        if (end <= start) throw new Error("endDate must be after startDate");

        const user = await this.userRepo.findById(dto.userId);
        if (!user) throw new Error("User not found");

        const room = await this.roomRepo.findById(dto.roomId);
        if (!room) throw new Error("Room not found");

        const existing = await this.reservationRepo.findByRoomAndRange(room.id, start, end);

        if (!RoomService.isAvailable(room, existing, start, end)) {
            throw new Error("Room not available for request dates");
        }

        const id = uuid();
        const reservation = new Reservation(id, user, room, start, end, Status.PENDING);
        await this.reservationRepo.save(reservation);

        return {
            reservationId: id,
            status: reservation.status,
            startDate: reservation.startDate.toISOString(),
            endDate: reservation.endDate.toISOString(),
            roomId: room.id,
            userId: user.id
        }
    }
}