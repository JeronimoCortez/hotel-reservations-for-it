import { Reservation } from "../../entities/Reservation";
import { RoomService } from "../../services/RoomService";
import { Status } from "../../types/Status";
import { ConflictError, NotFoundError } from "../../errors/DomainErrors";
import { IReservationRepository } from "../ports/IReservationRepository";
import { IIdGenerator } from "../ports/IIdGenerator";
import { IRoomRepository } from "../ports/IRoomRepository";
import { IUserRepository } from "../ports/IUserRepository";
import { CreateReservationDTO } from "./CreateReservationDTO";
import { CreateReservationResult } from "./CreateReservationResult";
import { assertLocalDate } from "../../value-objects/LocalDate";
import { DateRange } from "../../value-objects/DateRange";


export class CreateReservationUseCase {
    constructor(
        private userRepo: IUserRepository,
        private roomRepo: IRoomRepository,
        private reservationRepo: IReservationRepository,
        private idGenerator: IIdGenerator
    ) {

    }

    async execute(dto: CreateReservationDTO): Promise<CreateReservationResult> {
        assertLocalDate(dto.startDate, "startDate");
        assertLocalDate(dto.endDate, "endDate");
        const requested = DateRange.create(dto.startDate, dto.endDate);

        const user = await this.userRepo.findById(dto.userId);
        if (!user) throw new NotFoundError("User not found");

        const room = await this.roomRepo.findById(dto.roomId);
        if (!room) throw new NotFoundError("Room not found");
        if (!room.inService) throw new ConflictError("Room is out of service");

        const existing = await this.reservationRepo.findByRoomAndRange(
            room.id,
            requested.start,
            requested.end
        );

        if (!RoomService.isAvailable(room, existing, requested)) {
            throw new ConflictError("Room not available for request dates");
        }

        const id = this.idGenerator.generate();
        const reservation = new Reservation(id, user, room, requested.start, requested.end, Status.PENDING);
        await this.reservationRepo.save(reservation);

        return {
            reservationId: id,
            status: reservation.status,
            startDate: reservation.startDate,
            endDate: reservation.endDate,
            roomId: room.id,
            userId: user.id
        }
    }
}
