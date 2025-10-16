import { Reservation } from "../entities/Reservation";
import { Room } from "../entities/Room";
import { User } from "../entities/User";
import { Roles } from "../types/Roles";
import { RoomType } from "../types/RoomType";
import { Status } from "../types/Status";
import { ConfirmReservationUseCase } from "../use-cases/confirm-reservation/ConfirmReservartionUseCase";
import { InMemoryReservationRepo } from "./InMemoryRepo"


describe("ConfirmReservationUseCase", () => {
    let reservationRepo: InMemoryReservationRepo;
    let useCase: ConfirmReservationUseCase;
    const user = new User("u1", "Jeronimo", "jeronimo@gmail.com", "123456", Roles.USER);
    const room = new Room("r1", 101, RoomType.SINGLE, 15000, true);

    beforeEach(() => {
        reservationRepo = new InMemoryReservationRepo();
        useCase = new ConfirmReservationUseCase(reservationRepo);
    })

    test("confirms a pending reservation", async () => {
        const existing = new Reservation("e1", user, room, new Date("2025-11-10"), new Date("2025-11-11"), Status.PENDING);
        await reservationRepo.save(existing);

        const result = await useCase.execute("e1");
        expect(result.reservationId).toBe("e1");
        expect(result.status).toBe(Status.CONFIRMED);

        const stored = await reservationRepo.findById("e1");
        expect(stored).not.toBeNull()
        expect(stored!.status).toBe(Status.CONFIRMED);
        expect(room.available).toBe(false);
    });

    test("throws if reservation not found", async () => {
        await expect(useCase.execute("nope")).rejects.toThrow("Reservation not found");
    })

    test("throws if reservation cancelled", async () => {
        const r = new Reservation("r2", user, room, new Date("2025-11-10"), new Date("2025-11-12"), Status.CANCELLED);
        await reservationRepo.save(r);
        await expect(useCase.execute("r2")).rejects.toThrow("Cannot confirm a cancelled reservation");
    });

    test("idempotent when already confirmed", async () => {
        const r = new Reservation("r3", user, room, new Date("2025-11-10"), new Date("2025-11-12"), Status.CONFIRMED);
        await reservationRepo.save(r);
        const result = await useCase.execute("r3");
        expect(result.status).toBe(Status.CONFIRMED);
    });
})